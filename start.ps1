# SkillHub - Start Script
# Run this script to start the entire application

Write-Host "🎓 Starting SkillHub..." -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
Write-Host "Checking Docker..." -ForegroundColor Yellow
$dockerRunning = docker info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Docker is running" -ForegroundColor Green
Write-Host ""

# Check if docker-compose.yml exists
if (!(Test-Path "docker-compose.yml")) {
    Write-Host "❌ docker-compose.yml not found" -ForegroundColor Red
    exit 1
}

# Start services
Write-Host "Starting services with Docker Compose..." -ForegroundColor Yellow
docker-compose up -d

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Services started successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📍 Access Points:" -ForegroundColor Cyan
    Write-Host "   Frontend (React):     http://localhost:3000" -ForegroundColor White
    Write-Host "   Backend API:          http://localhost:8080" -ForegroundColor White
    Write-Host "   Swagger UI:           http://localhost:8080/swagger-ui.html" -ForegroundColor White
    Write-Host "   GraphQL Playground:   http://localhost:8080/graphiql" -ForegroundColor White
    Write-Host ""
    Write-Host "👤 Test Users:" -ForegroundColor Cyan
    Write-Host "   Admin:      admin@skillhub.com / admin123" -ForegroundColor White
    Write-Host "   Instructor: john@skillhub.com / instructor123" -ForegroundColor White
    Write-Host "   Student:    alice@skillhub.com / student123" -ForegroundColor White
    Write-Host ""
    Write-Host "📊 View logs:" -ForegroundColor Cyan
    Write-Host "   docker-compose logs -f" -ForegroundColor White
    Write-Host ""
    Write-Host "🛑 Stop services:" -ForegroundColor Cyan
    Write-Host "   docker-compose down" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "❌ Failed to start services" -ForegroundColor Red
    exit 1
}
