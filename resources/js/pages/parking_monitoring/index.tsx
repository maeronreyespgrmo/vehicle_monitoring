import { DataTable } from "@/components/reusable/data-table"
import { SidebarInset } from "@/components/ui/sidebar"
import AppLayout from "@/layouts/app-layout"
import { dashboard } from "@/routes"
import type { BreadcrumbItem } from "@/types"
import { Head, router, usePage } from "@inertiajs/react"
import { Power } from "lucide-react"
import { useEffect, useState } from "react"

type MonitoringRecord = {
  id: number
  driver_name: string | null
  plate_no: string
  vehicle_name: string | null
  plate_image: string | null
  camera_id: string | null
  confidence: number | null
  created_at: string | null
}

type ParkingMonitoringProps = {
  monitoring: MonitoringRecord[]
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Parking Monitoring",
    href: dashboard().url,
  },
]

const columns = [
  {
    key: "plate_image" as const,
    label: "Plate Image",
    render: (record: MonitoringRecord) =>
      record.plate_image ? (
        <img
          src={`data:image/jpeg;base64,${record.plate_image}`}
          alt={`Detected plate ${record.plate_no}`}
          className="h-14 w-28 rounded-md object-cover"
        />
      ) : (
        <span className="text-muted-foreground">No image</span>
      ),
  },
  {
    key: "driver_name" as const,
    label: "Driver Name",
    render: (record: MonitoringRecord) => record.driver_name ?? "Unregistered",
  },
  { key: "plate_no" as const, label: "Plate No." },
  {
    key: "vehicle_name" as const,
    label: "Vehicle Name",
    render: (record: MonitoringRecord) => record.vehicle_name ?? "-",
  },
  {
    key: "camera_id" as const,
    label: "Camera",
    render: (record: MonitoringRecord) => record.camera_id ?? "-",
  },
  {
    key: "confidence" as const,
    label: "Confidence",
    render: (record: MonitoringRecord) =>
      record.confidence === null ? "-" : `${(record.confidence * 100).toFixed(1)}%`,
  },
  {
    key: "created_at" as const,
    label: "Detected At",
    render: (record: MonitoringRecord) =>
      record.created_at ? new Date(record.created_at).toLocaleString() : "-",
  },
]

export default function ParkingMonitoring() {
  const { monitoring } = usePage<ParkingMonitoringProps>().props
  const [camera1Power, setCamera1Power] = useState(false)
  const [camera2Power, setCamera2Power] = useState(false)
  const [cameraBusy, setCameraBusy] = useState<string | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)

  useEffect(() => {
    fetch("http://localhost:5000/camera/status")
      .then((response) => {
        if (!response.ok) throw new Error("Unable to read camera status.")
        return response.json() as Promise<{ CAM_1: boolean; CAM_2: boolean }>
      })
      .then((status) => {
        setCamera1Power(status.CAM_1)
        setCamera2Power(status.CAM_2)
      })
      .catch(() => setCameraError("Python camera server is unavailable."))

    const interval = window.setInterval(() => {
      router.reload({ only: ["monitoring"] })
    }, 3000)

    return () => window.clearInterval(interval)
  }, [])

  const toggleCamera = async (
    cameraId: "CAM_1" | "CAM_2",
    powered: boolean,
    setPowered: (powered: boolean) => void,
  ) => {
    setCameraBusy(cameraId)
    setCameraError(null)

    try {
      const response = await fetch(`http://localhost:5000/camera/${cameraId}/power`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ powered: !powered }),
      })
      const result = (await response.json()) as { powered?: boolean; error?: string }

      if (!response.ok || typeof result.powered !== "boolean") {
        throw new Error(result.error ?? "Unable to change camera power.")
      }

      setPowered(result.powered)
    } catch (error) {
      setCameraError(error instanceof Error ? error.message : "Unable to change camera power.")
    } finally {
      setCameraBusy(null)
    }
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Parking Monitoring" />
      <SidebarInset>
        <div className="w-full px-6 pt-6">
          {cameraError && (
            <div className="mb-4 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
              {cameraError}
            </div>
          )}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <CameraFeed
              cameraName="Camera 1"
              streamUrl="http://localhost:5000/video/cam1"
              powered={camera1Power}
              busy={cameraBusy === "CAM_1"}
              onToggle={() => toggleCamera("CAM_1", camera1Power, setCamera1Power)}
            />
            <CameraFeed
              cameraName="Camera 2"
              streamUrl="http://localhost:5000/video/cam2"
              powered={camera2Power}
              busy={cameraBusy === "CAM_2"}
              onToggle={() => toggleCamera("CAM_2", camera2Power, setCamera2Power)}
            />
          </div>
        </div>

        <div className="w-full px-6 py-6">
          <DataTable
            data={monitoring}
            columns={columns}
            itemsPerPage={10}
            actionsDisabled
            searchKeys={["driver_name", "plate_no", "vehicle_name", "camera_id"]}
          />
        </div>
      </SidebarInset>
    </AppLayout>
  )
}

type CameraFeedProps = {
  cameraName: string
  streamUrl: string
  powered: boolean
  busy: boolean
  onToggle: () => Promise<void>
}

function CameraFeed({ cameraName, streamUrl, powered, busy, onToggle }: CameraFeedProps) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
      <button
        type="button"
        onClick={onToggle}
        disabled={busy}
        className={`absolute top-3 right-3 z-10 flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-white disabled:cursor-wait disabled:opacity-60 ${
          powered ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
        }`}
        aria-label={`${powered ? "Turn off" : "Turn on"} ${cameraName}`}
      >
        <Power size={20} />
        {busy ? "Please wait" : powered ? "Close Camera" : "Open Camera"}
      </button>

      {powered ? (
        <iframe
          src={streamUrl}
          className="absolute inset-0 h-full w-full"
          frameBorder="0"
          allowFullScreen
          title={`${cameraName} Feed`}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
          <Power size={48} className="mb-2 text-gray-600" />
          <p className="text-gray-400">{cameraName} is Off</p>
        </div>
      )}
    </div>
  )
}
