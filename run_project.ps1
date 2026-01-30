# run_project.ps1
# This script starts all components of the PDF Contract Extractor Platform.

# 1. Start Docker Containers
Write-Host "--- Step 1: Handling Docker Containers ---" -ForegroundColor Cyan
$redisContainer = docker ps -a -f "name=pdf-extractor-redis" --format "{{.Names}}"
if ($redisContainer) {
    Write-Host "Starting existing Redis container..."
    docker start pdf-extractor-redis
} else {
    Write-Host "Creating and starting new Redis container..."
    docker run -d --name pdf-extractor-redis -p 6379:6379 redis:latest
}

$postgresContainer = docker ps -a -f "name=pdf-extractor-postgres" --format "{{.Names}}"
if ($postgresContainer) {
    Write-Host "Starting existing Postgres container..."
    docker start pdf-extractor-postgres
} else {
    Write-Host "Creating and starting new Postgres container..."
    docker run -d --name pdf-extractor-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=local123 -e POSTGRES_DB=pdf_extractor -p 5432:5432 postgres:15
}

# 2. Start Backend API in a new window
Write-Host "--- Step 2: Starting Backend API ---" -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; .\backend\venv\Scripts\activate; uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000"

# 3. Start Celery Worker in a new window
Write-Host "--- Step 3: Starting Celery Worker ---" -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; .\backend\venv\Scripts\activate; celery -A backend.tasks worker --loglevel=info --pool=solo"

# 4. Start Frontend in a new window
Write-Host "--- Step 4: Starting Frontend ---" -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev"

Write-Host ""
Write-Host "All components are starting in separate windows." -ForegroundColor Green
Write-Host "Backend: http://localhost:8000" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Green
