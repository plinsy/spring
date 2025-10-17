# 🎓 SkillHub - Learning Platform

A comprehensive learning management system built with modern technologies including Spring Boot, React, GraphQL, JWT authentication, and more.

## 🚀 Features

- **User Management**: Student, Instructor, and Admin roles
- **Course Management**: Create, update, and manage courses
- **Module & Lesson System**: Organize content hierarchically
- **Progress Tracking**: Track learning progress for students
- **Reviews & Ratings**: Course reviews and star ratings
- **Comments**: Discussion system for courses and lessons
- **Authentication**: JWT-based secure authentication
- **GraphQL API**: Efficient data querying with GraphQL
- **REST API**: Traditional REST endpoints with Swagger documentation
- **Responsive UI**: React SPA with Vite for modern user experience
- **Server-Side Rendering**: Thymeleaf templates for SEO-friendly pages

## 🛠️ Tech Stack

### Backend
- **Spring Boot 3.2**: Application framework
- **Spring Security**: Authentication & authorization
- **JWT**: Token-based authentication
- **Spring Data JPA**: Database access
- **PostgreSQL**: Primary database
- **GraphQL**: Modern API query language
- **Swagger/OpenAPI**: API documentation

### Frontend
- **React 18**: UI library
- **Vite**: Build tool
- **TypeScript**: Type-safe JavaScript
- **Thymeleaf**: Server-side templates

### DevOps
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **Maven**: Build automation

## 📋 Prerequisites

- Java 17 or higher
- Node.js 20 or higher
- Docker & Docker Compose
- Maven 3.8+

## 🏃 Quick Start

### Using Docker (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd spring

# Start all services
docker-compose up -d

# Access the application
# Backend: http://localhost:8080
# GraphQL Playground: http://localhost:8080/graphiql
# Swagger UI: http://localhost:8080/swagger-ui.html
# Frontend: http://localhost:3000
```

### Manual Setup

#### 1. Start PostgreSQL

```bash
docker run -d \
  --name skillhub-db \
  -e POSTGRES_DB=skillhub \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:15-alpine
```

#### 2. Build and Run Backend

```bash
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run

# Or run with specific profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

#### 3. Run Frontend (Development)

```bash
cd frontend
npm install
npm run dev
```

## 📚 API Documentation

### REST API
- Swagger UI: http://localhost:8080/swagger-ui.html
- OpenAPI JSON: http://localhost:8080/api-docs

### GraphQL
- GraphQL Playground: http://localhost:8080/graphiql
- GraphQL Endpoint: http://localhost:8080/graphql

## 🔑 Default Users

After first run, these users are available:

| Role | Username | Password |
|------|----------|----------|
| Admin | admin@skillhub.com | admin123 |
| Instructor | instructor@skillhub.com | instructor123 |
| Student | student@skillhub.com | student123 |

## 🗂️ Project Structure

```
skillhub/
├── src/
│   ├── main/
│   │   ├── java/com/skillhub/
│   │   │   ├── config/          # Configuration classes
│   │   │   ├── controller/      # REST controllers
│   │   │   ├── entity/          # JPA entities
│   │   │   ├── repository/      # Data repositories
│   │   │   ├── service/         # Business logic
│   │   │   ├── security/        # Security & JWT
│   │   │   ├── graphql/         # GraphQL resolvers
│   │   │   ├── dto/             # Data transfer objects
│   │   │   └── exception/       # Custom exceptions
│   │   └── resources/
│   │       ├── templates/       # Thymeleaf templates
│   │       ├── static/          # Static resources
│   │       └── graphql/         # GraphQL schemas
│   └── test/                    # Test files
├── frontend/                    # React application
├── docker-compose.yml           # Docker orchestration
├── Dockerfile                   # Backend container
└── pom.xml                      # Maven configuration
```

## 🧪 Testing

```bash
# Run all tests
mvn test

# Run with coverage
mvn test jacoco:report
```

## 📦 Building for Production

```bash
# Build backend with frontend
mvn clean package -Pprod

# Run the JAR
java -jar target/skillhub-1.0.0.jar
```

## 🐳 Docker Commands

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Clean everything
docker-compose down -v
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- React team for the amazing UI library
- All open-source contributors
