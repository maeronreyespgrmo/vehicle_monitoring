# Vehicle Monitoring System

A Laravel-based Vehicle Monitoring System integrated with Python Flask and EasyOCR for automatic license plate recognition.

## Requirements

Make sure the following are installed:

- PHP 8.2 or higher
- Composer
- Node.js and NPM
- Python 3.x
- MySQL
- Git

## Installation and Setup Guide

### 1. Install Laravel Dependencies

Open your project directory and execute:

```bash
composer install
```

### 2. Install Node.js Dependencies

```bash
npm install
```

### 3. Build Frontend Assets

```bash
npm run build
```

### 4. Optimize Laravel Application

```bash
php artisan optimize
```

### 5. Configure Environment Variables

Make sure your `.env` file exists. If not, create it:

```bash
cp .env.example .env
```

Configure your database connection in `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=vehicle_monitoring
DB_USERNAME=root
DB_PASSWORD=
```

### 6. Generate Application Key

```bash
php artisan key:generate
```

### 7. Run Database Migrations and Seeders

**WARNING:** This command deletes all existing database tables and data before recreating them.

```bash
php artisan migrate:fresh --seed
```

### 8. Start Laravel Development Server

```bash
php artisan serve
```

The Laravel application will be available at:

```text
http://127.0.0.1:8000
```

## Python OCR Setup

The system uses Python Flask and EasyOCR for license plate recognition.

### 9. Install Python Dependencies

Install the required Python packages:

```bash
python -m pip install flask easyocr torch torchvision opencv-python numpy pillow
```

### 10. Run the Python License Plate Recognition Service

Open another terminal window in the Laravel project directory and execute:

```bash
python public/python/plate_no.py
```

Make sure the Python Flask application is running before using the license plate recognition feature.

## Running the Application

You need two terminal windows:

**Terminal 1 – Laravel Application**

```bash
php artisan serve
```

**Terminal 2 – Python OCR Service**

```bash
python public/python/plate_no.py
```

## Troubleshooting

| Problem | Solution |
|---|---|
| Composer dependencies missing | Run `composer install` |
| Vite manifest not found | Run `npm run build` |
| Application key missing | Run `php artisan key:generate` |
| Database connection error | Check database credentials in `.env` |
| Python Flask not found | Run `python -m pip install flask` |
| EasyOCR not found | Run `python -m pip install easyocr` |
| Python OCR service unavailable | Check whether the Flask server is running |

## Important Notes

- Ensure MySQL is running before executing database migrations.
- Run `php artisan migrate:fresh --seed` only when you intend to reset the database.
- Keep the Python OCR service running while using license plate recognition.
- Do not expose the Python Flask service publicly without proper authentication and security controls.

---

**Vehicle Monitoring System**  
Powered by Laravel, Python Flask, OpenCV, and EasyOCR.