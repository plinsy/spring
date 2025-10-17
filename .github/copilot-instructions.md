# SkillHub - Learning Management System

## Project Overview

SkillHub is a full-stack Learning Management System (LMS) built with Spring Boot backend and React frontend. It allows students to enroll in courses, track progress, and earn certificates, while instructors can create and manage courses, and admins oversee the platform.

## Technology Stack

### Backend
- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17+
- **Database**: PostgreSQL 15.10
- **Security**: Spring Security with JWT authentication
- **Build Tool**: Maven
- **Port**: 8080

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand with persist middleware
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Dev Server**: Port 5174 (proxies to backend on 8080)

## Project Structure

```
spring/
├── src/main/java/com/skillhub/
│   ├── config/          # Security, CORS, JWT configuration
│   ├── controller/      # REST API endpoints
│   ├── dto/            # Data Transfer Objects
│   ├── entity/         # JPA entities
│   ├── enums/          # Enums (Role, CourseLevel, LessonType, etc.)
│   ├── repository/     # JPA repositories
│   ├── security/       # JWT filters, authentication
│   ├── service/        # Business logic
│   └── exception/      # Custom exceptions
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── ui/        # Base UI components (Alert)
│   │   │   ├── Layout.tsx
│   │   │   └── Navbar.tsx
│   │   ├── pages/         # Page components
│   │   │   ├── HomePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── CoursesPage.tsx
│   │   │   ├── CourseDetailPage.tsx
│   │   │   ├── DashboardPage.tsx (Student)
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── InstructorDashboardPage.tsx
│   │   │   ├── CourseEditorPage.tsx
│   │   │   ├── LessonPlayerPage.tsx
│   │   │   ├── AdminDashboardPage.tsx
│   │   │   ├── NotFoundPage.tsx
│   │   │   └── CertificatesPage.tsx
│   │   ├── store/         # Zustand stores
│   │   │   └── authStore.ts
│   │   ├── lib/           # Utilities
│   │   │   ├── axios.ts   # Axios config with interceptors
│   │   │   └── urls.ts    # Centralized route/API management
│   │   └── App.tsx        # Main app with routes
│   └── ROUTING_GUIDE.md   # Route usage documentation
```

## Database Schema

### Core Entities

1. **User**
   - id (Long, PK)
   - firstName, lastName, username, email
   - password (encrypted)
   - role (STUDENT, INSTRUCTOR, ADMIN)
   - profileImageUrl, bio
   - createdAt, updatedAt

2. **Course**
   - id (Long, PK)
   - title, description, thumbnailUrl
   - instructor (ManyToOne → User)
   - price (BigDecimal)
   - level (BEGINNER, INTERMEDIATE, ADVANCED, EXPERT)
   - isPublished (Boolean)
   - rating (Double), enrollmentCount (Integer)
   - categories (ManyToMany → Category)
   - createdAt, updatedAt

3. **Module**
   - id (Long, PK)
   - title, description
   - course (ManyToOne → Course)
   - orderIndex (Integer)
   - createdAt, updatedAt

4. **Lesson**
   - id (Long, PK)
   - title, content, videoUrl
   - type (VIDEO, TEXT, QUIZ, ASSIGNMENT, RESOURCE)
   - module (ManyToOne → Module)
   - durationMinutes (Integer)
   - isFree (Boolean)
   - orderIndex (Integer)
   - createdAt, updatedAt

5. **Enrollment**
   - id (Long, PK)
   - student (ManyToOne → User)
   - course (ManyToOne → Course)
   - enrolledAt, completedAt
   - progress (Double, 0-100)
   - status (ACTIVE, COMPLETED, DROPPED)

6. **LessonProgress**
   - id (Long, PK)
   - enrollment (ManyToOne → Enrollment)
   - lesson (ManyToOne → Lesson)
   - isCompleted (Boolean)
   - watchedDuration (Integer)
   - completedAt

7. **Review**
   - id (Long, PK)
   - course (ManyToOne → Course)
   - student (ManyToOne → User)
   - rating (Integer, 1-5)
   - comment (Text)
   - createdAt

8. **Category**
   - id (Long, PK)
   - name, description, iconUrl

9. **Certificate**
   - id (Long, PK)
   - enrollment (OneToOne → Enrollment)
   - certificateUrl, certificateCode
   - issuedAt

## Authentication & Authorization

### JWT Authentication Flow
1. User logs in with email/username and password
2. Backend validates credentials
3. Backend generates JWT token with user details
4. Frontend stores token in localStorage
5. Frontend includes token in Authorization header for all requests
6. Backend validates token using JwtAuthenticationFilter

### User Roles & Permissions

**STUDENT**
- Browse and enroll in courses
- Track learning progress
- Complete lessons and quizzes
- Write reviews
- Earn certificates

**INSTRUCTOR**
- Create and manage courses
- Add modules and lessons
- View student enrollments
- Track revenue and ratings
- Publish/unpublish courses

**ADMIN**
- Manage all users
- Moderate content
- View platform analytics
- Manage categories

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user details

### Courses
- `GET /api/courses` - List courses (with pagination, filters)
- `GET /api/courses/{id}` - Get course details
- `POST /api/courses` - Create course (INSTRUCTOR only)
- `PUT /api/courses/{id}` - Update course (INSTRUCTOR only)
- `DELETE /api/courses/{id}` - Delete course (INSTRUCTOR only)

### Modules
- `GET /api/courses/{courseId}/modules` - List modules
- `POST /api/modules` - Create module
- `PUT /api/modules/{id}` - Update module
- `DELETE /api/modules/{id}` - Delete module

### Lessons
- `GET /api/modules/{moduleId}/lessons` - List lessons
- `POST /api/lessons` - Create lesson
- `PUT /api/lessons/{id}` - Update lesson
- `DELETE /api/lessons/{id}` - Delete lesson

### Enrollments
- `GET /api/enrollments/my` - Get current user's enrollments
- `POST /api/enrollments` - Enroll in course
- `PUT /api/enrollments/{id}/progress` - Update progress

### Categories
- `GET /api/categories` - List all categories

## Frontend Architecture

### State Management (Zustand)

**authStore.ts** - Authentication state
```typescript
{
  isAuthenticated: boolean
  user: User | null
  accessToken: string | null
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
}
```

### Routing System (Centralized in urls.ts)

**Page Routes**
- `ROUTES.HOME` → `/`
- `ROUTES.LOGIN` → `/login`
- `ROUTES.REGISTER` → `/register`
- `ROUTES.COURSES` → `/courses`
- `ROUTES.COURSE_DETAIL(id)` → `/courses/{id}`
- `ROUTES.DASHBOARD` → `/dashboard` (Student)
- `ROUTES.PROFILE` → `/profile`
- `ROUTES.INSTRUCTOR.DASHBOARD` → `/instructor/dashboard`
- `ROUTES.INSTRUCTOR.COURSES.NEW` → `/instructor/courses/new`
- `ROUTES.INSTRUCTOR.COURSES.EDIT(id)` → `/instructor/courses/edit/{id}`
- `ROUTES.LESSON_PLAYER(courseId, lessonId)` → `/courses/{courseId}/lessons/{lessonId}`

**Helper Functions**
- `getDashboardRoute(role)` - Returns appropriate dashboard based on user role
- `buildUrl(baseUrl, params)` - Builds URL with query parameters
- `buildQueryString(params)` - Creates query string from object

### Key Components

**Layout.tsx** - Main layout wrapper with Navbar and Outlet

**Navbar.tsx** - Navigation bar with role-based links
- Shows different links for authenticated/unauthenticated users
- Uses `getDashboardRoute()` for role-based dashboard navigation

**Alert Component** - Notification system with variants
- `default` - Blue info alert
- `destructive` - Red error alert
- `success` - Green success alert
- `warning` - Yellow warning alert

### Pages

**HomePage** - Landing page with hero section and course preview

**LoginPage** - User authentication
- Demo credentials buttons for testing
- Password visibility toggle
- Error handling with Alert component

**RegisterPage** - User registration
- Role selection (Student/Instructor)
- Password strength indicator
- Form validation

**CoursesPage** - Course catalog with search and filters

**CourseDetailPage** - Detailed course view with enrollment

**DashboardPage (Student)** - Student dashboard
- Enrolled courses with progress
- Learning stats
- Continue learning section
- Achievements and recommendations
- Auto-redirects instructors to their dashboard

**ProfilePage** - User profile management
- 3 tabs: Profile, Security, Preferences
- Edit profile information
- Change password
- Notification preferences

**InstructorDashboardPage** - Instructor course management
- Stats: courses, students, revenue, rating
- Course list with search/filter
- Create/Edit/Delete course actions
- Role-based access control

**CourseEditorPage** - Course creation/editing
- Basic info: title, description, price, level
- Thumbnail upload
- Category selection
- Module and lesson management
- Drag-and-drop module ordering
- Multiple lesson types (VIDEO, TEXT, QUIZ, etc.)
- Free preview toggle for lessons

**LessonPlayerPage** - Video/content player for lessons
- Video player with controls (YouTube/Vimeo support)
- Lesson content display
- Progress tracking and completion
- Next/Previous lesson navigation
- Sidebar with course curriculum
- Discussion section
- Mark lesson as complete
- Auto-advance to next lesson

**AdminDashboardPage** - Admin platform management
- Platform statistics (users, courses, enrollments, revenue)
- User management with role filtering
- Course moderation with status filtering
- Search functionality for users and courses
- Delete users and courses
- Tabbed interface (Overview, Users, Courses)
- Role-based access control (Admin only)

**NotFoundPage** - 404 error page
- User-friendly error message with 404 illustration
- Helpful navigation suggestions
- Quick action buttons (Home, Browse Courses, Go Back)
- Contact support link
- Gradient background with centered layout

**CertificatesPage** - View earned certificates
- Display all earned certificates with stats
- Certificate cards with course info and issue date
- Download, share, and print functionality
- Certificate preview modal with full design
- Certificate verification codes
- Empty state with call-to-action to browse courses
- Student-only page

## Development Workflow

### Running the Application

1. **Backend** (Port 8080)
   ```bash
   cd E:\Courses\JEE\spring
   mvn spring-boot:run
   ```

2. **Frontend** (Port 5174)
   ```bash
   cd frontend
   npm run dev
   ```

### Demo Credentials

**Admin**
- Email: admin@skillhub.com
- Password: admin123

**Instructor**
- Email: john@skillhub.com
- Password: instructor123

**Student**
- Email: alice@skillhub.com
- Password: student123

## Key Features Implemented

✅ JWT Authentication & Authorization
✅ Role-based access control (Student, Instructor, Admin)
✅ Course creation and management
✅ Module and lesson structure
✅ Student enrollment and progress tracking
✅ Lesson player with video support
✅ Progress tracking and lesson completion
✅ User profile management
✅ Admin dashboard with user and course management
✅ Responsive UI with Tailwind CSS
✅ Centralized routing system
✅ API error handling with interceptors
✅ Form validation and loading states
✅ Empty states and error messages
✅ Certificate viewing page with download/share
✅ 404 Not Found page

## Features In Progress / Planned

🔲 Quiz and assignment functionality
🔲 Certificate generation (backend)
🔲 Review and rating system
🔲 Payment integration
🔲 File upload for course materials
🔲 Email notifications
🔲 Course search with advanced filters
🔲 Social features (discussions, Q&A)

## Code Conventions

### Backend (Java/Spring)
- Use DTOs for API requests/responses
- Service layer handles business logic
- Repository layer for data access
- Use `@Valid` for request validation
- Use `ApiResponse<T>` wrapper for consistent responses
- Handle exceptions with custom exception handlers
- Use Spring Security for authentication/authorization

### Frontend (React/TypeScript)
- Use TypeScript for type safety
- Functional components with hooks
- Use Zustand for global state
- Import routes/APIs from `urls.ts`
- Use Axios interceptors for auth headers
- Handle loading/error states in UI
- Use Alert component for user feedback
- Follow component structure: imports → interfaces → component → export

### Naming Conventions
- Backend: PascalCase for classes, camelCase for methods/variables
- Frontend: PascalCase for components, camelCase for functions/variables
- Routes: Use ROUTES constants from urls.ts
- API endpoints: Use API constants from urls.ts

## Important Files to Know

1. **backend/application.properties** - Database and JWT configuration
2. **frontend/src/lib/urls.ts** - All routes and API endpoints
3. **frontend/src/lib/axios.ts** - Axios config with JWT interceptor
4. **frontend/src/store/authStore.ts** - Authentication state
5. **frontend/ROUTING_GUIDE.md** - Routing documentation
6. **SecurityConfig.java** - Security and CORS configuration
7. **JwtAuthenticationFilter.java** - JWT token validation

## Common Tasks

### Adding a New Page
1. Create component in `frontend/src/pages/`
2. Add route to `urls.ts` ROUTES object
3. Import and add route in `App.tsx`
4. Add navigation links in appropriate components

### Adding a New API Endpoint
1. Add endpoint to `urls.ts` API object
2. Create controller method in backend
3. Implement service method
4. Use endpoint in frontend with `api.get(API.YOUR_ENDPOINT)`

### Adding New User Role
1. Add to `Role.java` enum
2. Update `SecurityConfig.java` for role-based access
3. Update `getDashboardRoute()` in urls.ts
4. Add role-specific pages and routes

## Environment Variables

### Backend (.env or application.properties)
- `spring.datasource.url` - PostgreSQL connection URL
- `spring.datasource.username` - Database username
- `spring.datasource.password` - Database password
- `jwt.secret` - JWT signing secret key
- `jwt.expiration` - Token expiration time (ms)

### Frontend (.env)
- `VITE_API_BASE_URL` - Backend API URL (currently uses Vite proxy)

## Testing Notes

- Backend runs on http://localhost:8080
- Frontend runs on http://localhost:5174
- Frontend proxies API requests to backend (configured in vite.config.ts)
- Use demo credentials for testing different roles
- Check browser console for frontend errors
- Check terminal output for backend errors

## Git Workflow

- Main branch: `main`
- Create feature branches for new features
- Commit messages should be descriptive
- Test before committing

---

**Last Updated**: October 17, 2025
**Project Status**: Active Development
**Version**: 1.0.0-SNAPSHOT
