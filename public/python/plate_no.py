from flask import Flask, Response, jsonify, request
import cv2
import easyocr
import numpy as np
import requests
import time
import base64
import sys
import threading
import warnings

warnings.filterwarnings("ignore")

# ---------------- CONFIG ----------------
CAMERA_INDEX_1 = 0
CAMERA_INDEX_2 = 1
PROCESS_EVERY_N_FRAMES = 30     # OCR every N frames
OCR_SCALE = 0.7                 # Slight upscale for better detection
CONFIDENCE_THRESHOLD = 0.4
COOLDOWN = 1.0
API_STORE_URL = "http://127.0.0.1:8000/api/monitoring/store"
BBOX_EXPAND = 10                # Expand bounding box to capture full plate
# --------------------------------------

# Initialize OCR reader
reader = easyocr.Reader(['en'], gpu=True)

# Flask app
app = Flask(__name__)

# Thread-safe OCR
ocr_lock = threading.Lock()

# ---------------- CAMERA SETUP ----------------
camera_indexes = {
    "CAM_1": CAMERA_INDEX_1,
    "CAM_2": CAMERA_INDEX_2,
}
camera_api_ids = {
    "CAM_1": 1,
    "CAM_2": 2,
}
camera_locks = {camera_id: threading.Lock() for camera_id in camera_indexes}

def open_camera(camera_id):
    camera_index = camera_indexes[camera_id]
    backends = (
        [cv2.CAP_MSMF, cv2.CAP_DSHOW, cv2.CAP_ANY]
        if sys.platform == "win32"
        else [cv2.CAP_ANY]
    )

    for backend in backends:
        cap = cv2.VideoCapture(camera_index, backend)
        if cap.isOpened():
            cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
            cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
            cap.set(cv2.CAP_PROP_FPS, 30)
            print(
                f"[CAMERA] {camera_id} opened index {camera_index} "
                f"with {cap.getBackendName()}.",
                flush=True,
            )
            return cap
        cap.release()

    print(
        f"[CAMERA] Unable to open {camera_id} at index {camera_index}. "
        "Close other camera apps and check Windows camera permissions.",
        flush=True,
    )
    return cv2.VideoCapture()

# Keep physical cameras closed until the user clicks "Open Camera".
caps = {camera_id: cv2.VideoCapture() for camera_id in camera_indexes}
camera_power = {camera_id: False for camera_id in camera_indexes}
latest_frames = {camera_id: None for camera_id in camera_indexes}
frame_locks = {camera_id: threading.Lock() for camera_id in camera_indexes}

def capture_camera(camera_id, cap):
    while camera_power[camera_id] and caps[camera_id] is cap:
        ret, frame = cap.read()
        if not ret:
            time.sleep(0.1)
            continue

        with frame_locks[camera_id]:
            latest_frames[camera_id] = frame

def set_camera_power(camera_id, powered):
    with camera_locks[camera_id]:
        cap = caps[camera_id]

        if powered:
            if camera_power[camera_id] and cap.isOpened():
                return True
            if not cap.isOpened():
                cap = open_camera(camera_id)
                caps[camera_id] = cap
            camera_power[camera_id] = cap.isOpened()
            if camera_power[camera_id]:
                with frame_locks[camera_id]:
                    latest_frames[camera_id] = None
                threading.Thread(
                    target=capture_camera,
                    args=(camera_id, cap),
                    daemon=True,
                ).start()
        else:
            camera_power[camera_id] = False
            if cap.isOpened():
                cap.release()
            with frame_locks[camera_id]:
                latest_frames[camera_id] = None

        return camera_power[camera_id]

# Store OCR results for each camera
recent_plates = {"CAM_1": {}, "CAM_2": {}}
last_detections = {"CAM_1": [], "CAM_2": []}
frame_counters = {"CAM_1": 0, "CAM_2": 0}
plate_registration = {"CAM_1": {}, "CAM_2": {}}
plate_registration_lock = threading.Lock()

# ---------------- API CALL ----------------
def send_to_api(payload, camera_id, plate_text):
    try:
        response = requests.post(API_STORE_URL, json=payload, timeout=5)
        # Print Laravel response
        if response.ok:
            try:
                data = response.json()  # decode JSON
                is_registered = data.get("vehicle") is not None
                with plate_registration_lock:
                    plate_registration[camera_id][plate_text] = is_registered
                print("[API] Success:", data, flush=True)
            except Exception:
                print("[API] Success, but invalid JSON:", response.text, flush=True)
        else:
            print(f"[API] Failed {response.status_code}: {response.text}", flush=True)
    except Exception as e:
        print("[API] Error:", e, flush=True)

# ---------------- OCR & FRAME GENERATOR ----------------
def generate_frames(camera_id):
    global recent_plates, last_detections, frame_counters

    while True:
        if not camera_power[camera_id]:
            time.sleep(0.1)
            continue

        with frame_locks[camera_id]:
            frame = (
                latest_frames[camera_id].copy()
                if latest_frames[camera_id] is not None
                else None
            )

        if frame is None:
            time.sleep(0.05)
            continue

        frame_counters[camera_id] += 1
        display_frame = frame.copy()

        # OCR every N frames
        if frame_counters[camera_id] % PROCESS_EVERY_N_FRAMES == 0:
            # Resize and grayscale
            small = cv2.resize(frame, None, fx=OCR_SCALE, fy=OCR_SCALE)
            gray = cv2.cvtColor(small, cv2.COLOR_BGR2GRAY)

            # Enhance contrast for small plates
            clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
            gray = clahe.apply(gray)

            try:
                with ocr_lock:
                    results = reader.readtext(gray)
            except:
                results = []

            last_detections[camera_id] = []

            # Only capture full plate
            for (bbox, text, prob) in results:
                if prob < CONFIDENCE_THRESHOLD:
                    continue

                plate_text = text.strip().upper()

                # Cooldown
                now = time.time()
                if plate_text in recent_plates[camera_id] and now - recent_plates[camera_id][plate_text] < COOLDOWN:
                    continue
                recent_plates[camera_id][plate_text] = now

                with plate_registration_lock:
                    plate_registration[camera_id].setdefault(plate_text, None)

                # Scale bbox back to original frame size
                bbox = np.array(bbox) / OCR_SCALE
                bbox = bbox.astype(int)

                # Expand bbox to ensure full plate
                x_min, y_min = bbox.min(axis=0)
                x_max, y_max = bbox.max(axis=0)
                x_min = max(0, x_min - BBOX_EXPAND)
                y_min = max(0, y_min - BBOX_EXPAND)
                x_max = min(frame.shape[1], x_max + BBOX_EXPAND)
                y_max = min(frame.shape[0], y_max + BBOX_EXPAND)

                plate_img = frame[y_min:y_max, x_min:x_max]
                if plate_img.size == 0:
                    continue

                # Encode whole plate image
                _, buffer = cv2.imencode('.jpg', plate_img, [cv2.IMWRITE_JPEG_QUALITY, 80])
                plate_base64 = base64.b64encode(buffer).decode()

                payload = {
                    "text": plate_text,
                    "plate_image": plate_base64,
                    "camera_id": camera_api_ids[camera_id],
                    "confidence": float(prob),
                }
                threading.Thread(
                    target=send_to_api,
                    args=(payload, camera_id, plate_text),
                    daemon=True,
                ).start()

                # Save detection to draw once per plate
                last_detections[camera_id].append((bbox, plate_text))

        # Draw detections on frame
        for bbox, text in last_detections[camera_id]:
            with plate_registration_lock:
                is_registered = plate_registration[camera_id].get(text)

            if is_registered is True:
                color = (0, 255, 0)
                status = "REGISTERED"
            elif is_registered is False:
                color = (0, 0, 255)
                status = "UNREGISTERED"
            else:
                color = (0, 255, 255)
                status = "CHECKING"

            cv2.polylines(display_frame, [bbox], True, color, 2)
            x_min, y_min = bbox.min(axis=0)
            cv2.putText(display_frame, f"{text} - {status}",
                        (x_min, max(25, y_min - 10)),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)

        # Encode frame as JPEG for streaming
        ret, buffer = cv2.imencode('.jpg', display_frame)
        frame_bytes = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

# ---------------- FLASK ROUTES ----------------
@app.after_request
def allow_laravel_origin(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return response

@app.route('/camera/status')
def camera_status():
    return jsonify({
        camera_id: bool(camera_power[camera_id] and caps[camera_id].isOpened())
        for camera_id in camera_indexes
    })

@app.route('/camera/<camera_id>/power', methods=['POST'])
def camera_power_control(camera_id):
    camera_id = camera_id.upper()
    if camera_id not in camera_indexes:
        return jsonify({"error": "Unknown camera."}), 404

    payload = request.get_json(silent=True) or {}
    if not isinstance(payload.get("powered"), bool):
        return jsonify({"error": "The powered field must be true or false."}), 422

    powered = set_camera_power(camera_id, payload["powered"])
    if payload["powered"] and not powered:
        return jsonify({
            "camera_id": camera_id,
            "powered": False,
            "error": "Camera could not be opened.",
        }), 503

    return jsonify({"camera_id": camera_id, "powered": powered})

@app.route('/video/cam1')
def video_cam1():
    if not camera_power["CAM_1"]:
        return jsonify({"error": "Camera 1 is powered off."}), 409
    return Response(generate_frames("CAM_1"),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/video/cam2')
def video_cam2():
    if not camera_power["CAM_2"]:
        return jsonify({"error": "Camera 2 is powered off."}), 409
    return Response(generate_frames("CAM_2"),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

# ---------------- START ----------------
if __name__ == "__main__":
    print("🚀 Flask OCR server running")
    app.run(host="0.0.0.0", port=5000, threaded=True)
