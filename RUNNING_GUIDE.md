# 🚀 Running SkillHub - Complete Guide

## 📋 Quick Reference

| Mode | Command | Frontend | Backend | Use Case |
|------|---------|----------|---------|----------|
| **Production** | `docker-compose up -d` | Production build (nginx) | Production | Testing production build |
| **Development** | `docker-compose -f docker-compose.dev.yml up` | Dev server with HMR | Development | Full stack dev with hot reload |
| **Manual Dev** | See below | Local pnpm dev | Local mvn | Maximum flexibility |
| **Helper Script** | `.\start.ps1` | Production | Production | Quick demo |

## 🎯 Option 1: Production Mode (Recommended for Demo)

This builds optimized production versions of both frontend and backend.

```powershell
cd e:\Courses\JEE\spring

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**Access:**
- Frontend: http://localhost:3000 (nginx serving React build)
- Backend: http://localhost:8080
- Swagger: http://localhost:8080/swagger-ui.html
- GraphQL: http://localhost:8080/graphiql

**Note:** Frontend changes require rebuild (`docker-compose up -d --build`)

---

## 🛠️ Option 2: Development Mode (Best for Development)

This runs frontend with hot module replacement (HMR) for instant updates.

```powershell
cd e:\Courses\JEE\spring

# Start all services in dev mode
docker-compose -f docker-compose.dev.yml up

# Or in detached mode
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f frontend

# Stop services
docker-compose -f docker-compose.dev.yml down
```

**Access:** Same URLs as production

**Benefits:**
- ✅ Hot reload for frontend (instant updates)
- ✅ Volume mounts (changes reflect immediately)
- ✅ Full Docker environment
- ✅ All services orchestrated

---

## 💻 Option 3: Manual Development (Maximum Control)

Run services separately for maximum flexibility.

### Step 1: Start PostgreSQL

```powershell
docker run -d `
  --name skillhub-postgres `
  -e POSTGRES_DB=skillhub `
  -e POSTGRES_USER=postgres `
  -e POSTGRES_PASSWORD=postgres `
  -p 5432:5432 `
  postgres:15-alpine
```

### Step 2: Run Backend (New Terminal)

```powershell
cd e:\Courses\JEE\spring

# Development mode with hot reload
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Or build and run
mvn clean package -DskipTests
java -jar target\skillhub-1.0.0.jar
```

Backend starts at: http://localhost:8080

### Step 3: Run Frontend (New Terminal)

```powershell
cd e:\Courses\JEE\spring\frontend

# Install dependencies (first time only)
pnpm install

# Start dev server
pnpm run dev
```

Frontend starts at: http://localhost:3000 (usually 5173 if 3000 is taken)

**Benefits:**
- ✅ Fastest hot reload
- ✅ Direct access to logs
- ✅ Easy debugging
- ✅ Can run only what you need

---

## 🎬 Option 4: Quick Start Scripts

Use the PowerShell helper scripts:

### Production Mode
```powershell
.\start.ps1
```

### Development Mode (Separate Windows)
```powershell
.\start-dev.ps1
```

This opens 2-3 separate PowerShell windows for PostgreSQL, backend, and frontend.

---

## 🐛 Troubleshooting

### Frontend Build Fails

```powershell
# Clean and rebuild
cd frontend
rm -rf node_modules pnpm-lock.yaml dist
pnpm install
pnpm run build
```

### Docker Build Fails

```powershell
# Clean Docker build cache
docker-compose down -v
docker system prune -af
docker-compose up -d --build
```

### Port Already in Use

```powershell
# Find process using port 8080
netstat -ano | findstr :8080

# Kill process (replace PID)
taskkill /PID <PID> /F

# Or use different port in docker-compose.yml
# Change "8080:8080" to "8081:8080"
```

### Database Connection Issues

```powershell
# Check if PostgreSQL is running
docker ps | findstr postgres

# Restart PostgreSQL
docker restart skillhub-postgres

# Or recreate
docker rm -f skillhub-postgres
docker-compose up -d postgres
```

### Frontend Shows "Cannot GET /"

This usually means the React app hasn't loaded. Check:
1. Frontend container is running: `docker ps`
2. Build succeeded: `docker-compose logs frontend`
3. Try accessing: http://localhost:3000/index.html

---

## 🔄 Common Workflows

### Making Frontend Changes (Docker Dev Mode)

```powershell
# Just edit files - HMR handles the rest!
# Changes in src/ appear instantly in browser
```

### Making Backend Changes (Docker Mode)

```powershell
# Backend needs rebuild
docker-compose up -d --build backend
```

### Making Backend Changes (Manual Mode)

```powershell
# Spring Boot DevTools auto-reloads
# Just save the file!
```

### Rebuilding Everything

```powershell
# Clean slate
docker-compose down -v
docker system prune -f
docker-compose up -d --build
```

### Testing Production Build Locally

```powershell
# Build frontend
cd frontend
pnpm run build

# Preview
pnpm run preview
```

---

## 📊 Monitoring

### View All Logs
```powershell
docker-compose logs -f
```

### View Specific Service
```powershell
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Check Service Status
```powershell
docker-compose ps
```

### Check Resource Usage
```powershell
docker stats
```

---

## 🎯 Recommended Setup by Use Case

### For Learning/Exploring
→ Use **Production Mode** (`docker-compose up -d`)
- Everything just works
- Easy to start/stop
- Clean URLs

### For Frontend Development
→ Use **Development Mode** (`docker-compose -f docker-compose.dev.yml up`)
- Instant feedback
- HMR enabled
- Easy debugging

### For Backend Development
→ Use **Manual Mode**
- Run backend with `mvn spring-boot:run`
- Access logs directly
- Easy debugging with IDE

### For Full-Stack Development
→ Use **Manual Mode** or **Dev Docker**
- Backend: `mvn spring-boot:run`
- Frontend: `pnpm run dev`
- Maximum flexibility

---

## 🔑 Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@skillhub.com | admin123 |
| Instructor | john@skillhub.com | instructor123 |
| Student | alice@skillhub.com | student123 |

---

## ✅ Health Checks

Visit these URLs to verify services are running:

- Frontend: http://localhost:3000
- Backend Health: http://localhost:8080/actuator/health (if actuator is enabled)
- API Docs: http://localhost:8080/swagger-ui.html
- GraphQL: http://localhost:8080/graphiql
- Database: `docker exec -it skillhub-postgres psql -U postgres -d skillhub`

---

## 🎓 Next Steps

1. **Start the application** using your preferred method
2. **Login** with test credentials
3. **Explore** the API docs at /swagger-ui.html
4. **Test** GraphQL queries at /graphiql
5. **Browse** courses at http://localhost:3000/courses
6. **Start coding** and building new features!

Happy coding! 🚀
