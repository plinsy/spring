# 🚀 Quick Start Guide - SkillHub

## Prerequisites Check

Before starting, ensure you have:
- ✅ Java 17+ installed
- ✅ Maven 3.8+ installed
- ✅ Node.js 20+ installed
- ✅ pnpm installed (`npm install -g pnpm`)
- ✅ Docker & Docker Compose installed (for easy setup)

## Option 1: Docker Setup (Recommended) 🐳

The easiest way to run the entire application:

```powershell
# Navigate to project directory
cd e:\Courses\JEE\spring

# Start all services (PostgreSQL + Backend + Frontend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Access Points:
- **Frontend (React)**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **GraphQL Playground**: http://localhost:8080/graphiql
- **API Docs**: http://localhost:8080/api-docs

## Option 2: Manual Setup 🛠️

### Step 1: Start PostgreSQL Database

```powershell
docker run -d `
  --name skillhub-postgres `
  -e POSTGRES_DB=skillhub `
  -e POSTGRES_USER=postgres `
  -e POSTGRES_PASSWORD=postgres `
  -p 5432:5432 `
  postgres:15-alpine
```

### Step 2: Run Backend (Spring Boot)

```powershell
# In project root
cd e:\Courses\JEE\spring

# Run with Maven (development profile)
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Or build and run JAR
mvn clean package -DskipTests
java -jar target\skillhub-1.0.0.jar
```

Backend will start on: http://localhost:8080

### Step 3: Run Frontend (React + Vite)

Open a **new terminal**:

```powershell
# Navigate to frontend directory
cd e:\Courses\JEE\spring\frontend

# Install dependencies (if not done yet)
pnpm install

# Start development server
pnpm run dev
```

Frontend will start on: http://localhost:3000

## 🔐 Default Test Users

After the application starts, these users are automatically created:

| Role | Email | Password | Use For |
|------|-------|----------|---------|
| **Admin** | admin@skillhub.com | admin123 | Full system access |
| **Instructor** | john@skillhub.com | instructor123 | Creating courses |
| **Student** | alice@skillhub.com | student123 | Enrolling in courses |

## 📚 API Documentation

### REST API (Swagger)
Visit: http://localhost:8080/swagger-ui.html

**Example API calls:**

```powershell
# Login
curl -X POST http://localhost:8080/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"emailOrUsername\":\"alice@skillhub.com\",\"password\":\"student123\"}'

# Get all published courses (no auth required)
curl http://localhost:8080/api/courses
```

### GraphQL API
Visit: http://localhost:8080/graphiql

**Example queries:**

```graphql
# Get all published courses
query {
  courses(published: true) {
    id
    title
    description
    level
    instructor {
      firstName
      lastName
    }
  }
}

# Search courses
query {
  searchCourses(keyword: "spring", page: 0, size: 10) {
    content {
      id
      title
      averageRating
    }
    totalElements
  }
}
```

## 🧪 Testing the Application

### 1. Test Authentication
```powershell
# Register a new user
curl -X POST http://localhost:8080/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{
    \"username\":\"testuser\",
    \"email\":\"test@example.com\",
    \"password\":\"password123\",
    \"firstName\":\"Test\",
    \"lastName\":\"User\",
    \"role\":\"STUDENT\"
  }'
```

### 2. Browse Courses
- Open browser: http://localhost:3000
- Click "Courses" in navigation
- View sample courses created automatically

### 3. Test GraphQL
- Open: http://localhost:8080/graphiql
- Try the example queries above

## 🔧 Development Commands

### Backend
```powershell
# Run with dev profile (auto-reload)
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Run tests
mvn test

# Build for production
mvn clean package -Pprod
```

### Frontend
```powershell
cd frontend

# Development server with hot reload
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview

# Lint code
pnpm run lint
```

## 📁 Project Structure Overview

```
spring/
├── src/main/java/com/skillhub/
│   ├── entity/          # Database entities (User, Course, etc.)
│   ├── repository/      # JPA repositories
│   ├── service/         # Business logic
│   ├── controller/      # REST controllers
│   ├── security/        # JWT & Security config
│   ├── config/          # App configuration
│   └── graphql/         # GraphQL resolvers (to be added)
├── src/main/resources/
│   ├── application.yml  # Main configuration
│   ├── templates/       # Thymeleaf templates
│   └── graphql/         # GraphQL schemas
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── lib/         # Utilities (axios, etc.)
│   │   └── store/       # State management (Zustand)
│   └── package.json     # Frontend dependencies
├── docker-compose.yml   # Docker orchestration
└── pom.xml             # Maven configuration
```

## 🐛 Troubleshooting

### Port already in use
```powershell
# Check what's using the port
netstat -ano | findstr :8080
netstat -ano | findstr :3000

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

### Database connection issues
```powershell
# Check if PostgreSQL is running
docker ps | findstr postgres

# Restart PostgreSQL
docker restart skillhub-postgres

# View PostgreSQL logs
docker logs skillhub-postgres
```

### Frontend not loading
```powershell
# Clear pnpm cache and reinstall
cd frontend
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## 🎯 Next Steps

1. ✅ Application is running!
2. 📖 Explore the Swagger docs: http://localhost:8080/swagger-ui.html
3. 🎮 Try GraphQL playground: http://localhost:8080/graphiql
4. 👤 Login with test users
5. 📚 Browse courses at http://localhost:3000/courses
6. 🎨 Customize the frontend styling in `frontend/src/index.css`
7. 🔧 Add more features by extending controllers and entities

## 📞 Need Help?

- Check logs: `docker-compose logs -f`
- Backend logs: Look for Spring Boot output
- Frontend console: Open browser DevTools (F12)

Enjoy building with SkillHub! 🎓✨
