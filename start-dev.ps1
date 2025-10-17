# SkillHub - Development Start Script
# Run backend and frontend separately for development

Write-Host "🎓 Starting SkillHub (Development Mode)..." -ForegroundColor Cyan
Write-Host ""

# Check if PostgreSQL is running
Write-Host "Checking PostgreSQL..." -ForegroundColor Yellow
$postgresRunning = docker ps --filter "name=skillhub-postgres" --format "{{.Names}}"
if ($postgresRunning -ne "skillhub-postgres") {
    Write-Host "Starting PostgreSQL..." -ForegroundColor Yellow
    docker run -d `
        --name skillhub-postgres `
        -e POSTGRES_DB=skillhub `
        -e POSTGRES_USER=postgres `
        -e POSTGRES_PASSWORD=postgres `
        -p 5432:5432 `
        postgres:15-alpine
    
    Write-Host "⏳ Waiting for PostgreSQL to be ready..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
}
Write-Host "✅ PostgreSQL is running" -ForegroundColor Green
Write-Host ""

# Start backend in new window
Write-Host "Starting Spring Boot backend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; Write-Host '🔧 Starting Backend...' -ForegroundColor Cyan; mvn spring-boot:run -Dspring-boot.run.profiles=dev"

# Wait a bit before starting frontend
Start-Sleep -Seconds 3

# Start frontend in new window
Write-Host "Starting React frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; Write-Host '⚛️ Starting Frontend...' -ForegroundColor Cyan; pnpm run dev"

Write-Host ""
Write-Host "✅ Starting services in separate windows!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Access Points:" -ForegroundColor Cyan
Write-Host "   Frontend:           http://localhost:3000" -ForegroundColor White
Write-Host "   Backend API:        http://localhost:8080" -ForegroundColor White
Write-Host "   Swagger UI:         http://localhost:8080/swagger-ui.html" -ForegroundColor White
Write-Host "   GraphQL Playground: http://localhost:8080/graphiql" -ForegroundColor White
Write-Host ""
Write-Host "⏳ Please wait 30-60 seconds for services to start..." -ForegroundColor Yellow
Write-Host ""
