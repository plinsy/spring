# Centralized URL Management

This document explains how to use the centralized URL management system in the SkillHub application.

## Overview

All application routes and API endpoints are now centralized in `frontend/src/lib/urls.ts`. This makes it easy to maintain and update URLs throughout the application.

## Benefits

1. **Single Source of Truth**: All routes defined in one place
2. **Easy Refactoring**: Change a route once, update everywhere
3. **Type Safety**: TypeScript autocomplete for all routes
4. **Consistency**: Standardized URL generation
5. **Role-Based Routing**: Helper functions for dynamic routing

## Usage

### Importing Routes

```typescript
import { ROUTES, API, getDashboardRoute } from '../lib/urls'
```

### Page Routes

#### Static Routes
```typescript
// Simple navigation
navigate(ROUTES.HOME)            // '/'
navigate(ROUTES.LOGIN)           // '/login'
navigate(ROUTES.REGISTER)        // '/register'
navigate(ROUTES.COURSES)         // '/courses'
navigate(ROUTES.DASHBOARD)       // '/dashboard'
navigate(ROUTES.PROFILE)         // '/profile'
```

#### Dynamic Routes (with parameters)
```typescript
// Course detail page
navigate(ROUTES.COURSE_DETAIL(123))  // '/courses/123'

// Instructor routes
navigate(ROUTES.INSTRUCTOR.DASHBOARD)            // '/instructor/dashboard'
navigate(ROUTES.INSTRUCTOR.COURSES.NEW)          // '/instructor/courses/new'
navigate(ROUTES.INSTRUCTOR.COURSES.EDIT(456))    // '/instructor/courses/edit/456'

// Admin routes
navigate(ROUTES.ADMIN.DASHBOARD)    // '/admin/dashboard'
navigate(ROUTES.ADMIN.USERS)        // '/admin/users'
```

#### Role-Based Dashboard Routing
```typescript
// Automatically route to correct dashboard based on user role
const dashboardRoute = getDashboardRoute(user.role)
// Returns '/dashboard' for STUDENT
// Returns '/instructor/dashboard' for INSTRUCTOR
// Returns '/admin/dashboard' for ADMIN
```

### API Endpoints

#### Static Endpoints
```typescript
// Auth
await api.post(API.AUTH.LOGIN, credentials)
await api.post(API.AUTH.REGISTER, userData)
await api.get(API.AUTH.ME)

// Categories
await api.get(API.CATEGORIES.LIST)
```

#### Dynamic Endpoints
```typescript
// Courses
await api.get(API.COURSES.DETAIL(courseId))
await api.put(API.COURSES.UPDATE(courseId), data)
await api.delete(API.COURSES.DELETE(courseId))
await api.get(API.COURSES.BY_INSTRUCTOR(instructorId))

// Modules
await api.get(API.MODULES.LIST(courseId))
await api.put(API.MODULES.UPDATE(moduleId), data)

// Lessons
await api.get(API.LESSONS.LIST(moduleId))
await api.post(API.LESSONS.CREATE, lessonData)

// Enrollments
await api.get(API.ENROLLMENTS.MY_ENROLLMENTS)
await api.get(API.PROGRESS.LESSON_PROGRESS(enrollmentId, lessonId))
```

### Helper Functions

#### Building URLs with Query Parameters
```typescript
import { buildUrl, buildQueryString } from '../lib/urls'

// Build URL with query params
const url = buildUrl(API.COURSES.LIST, {
  page: 0,
  size: 20,
  instructorId: 123,
  level: 'BEGINNER'
})
// Result: '/courses?page=0&size=20&instructorId=123&level=BEGINNER'

// Or just get the query string
const queryString = buildQueryString({ page: 0, size: 20 })
// Result: '?page=0&size=20'
```

## React Router Integration

### In App.tsx
```typescript
import { ROUTES } from './lib/urls'

<Route path={ROUTES.HOME} element={<Layout />}>
  <Route index element={<HomePage />} />
  <Route path={ROUTES.LOGIN.substring(1)} element={<LoginPage />} />
  <Route path="courses/:id" element={<CourseDetailPage />} />
</Route>
```

### In Components (Link)
```typescript
import { Link } from 'react-router-dom'
import { ROUTES } from '../lib/urls'

<Link to={ROUTES.LOGIN}>Login</Link>
<Link to={ROUTES.COURSE_DETAIL(course.id)}>View Course</Link>
<Link to={ROUTES.INSTRUCTOR.COURSES.EDIT(course.id)}>Edit</Link>
```

### In Components (Navigate)
```typescript
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../lib/urls'

const navigate = useNavigate()

// Navigate on button click
onClick={() => navigate(ROUTES.DASHBOARD)}

// Navigate with replace
onClick={() => navigate(ROUTES.HOME, { replace: true })}

// Conditional navigation
onClick={() => navigate(
  user?.role === 'INSTRUCTOR' 
    ? ROUTES.INSTRUCTOR.DASHBOARD 
    : ROUTES.DASHBOARD
)}

// Or use the helper
onClick={() => navigate(getDashboardRoute(user.role))}
```

## Route Structure

### Public Routes
- `ROUTES.HOME` - Landing page
- `ROUTES.LOGIN` - Login page
- `ROUTES.REGISTER` - Registration page
- `ROUTES.COURSES` - Course listing
- `ROUTES.COURSE_DETAIL(id)` - Course detail page

### Student Routes
- `ROUTES.DASHBOARD` - Student dashboard
- `ROUTES.PROFILE` - User profile

### Instructor Routes
- `ROUTES.INSTRUCTOR.DASHBOARD` - Instructor dashboard
- `ROUTES.INSTRUCTOR.COURSES.NEW` - Create new course
- `ROUTES.INSTRUCTOR.COURSES.EDIT(id)` - Edit course

### Admin Routes
- `ROUTES.ADMIN.DASHBOARD` - Admin dashboard
- `ROUTES.ADMIN.USERS` - User management
- `ROUTES.ADMIN.COURSES` - Course management

## API Structure

All API endpoints are organized by resource:
- `API.AUTH` - Authentication endpoints
- `API.COURSES` - Course management
- `API.MODULES` - Module management
- `API.LESSONS` - Lesson management
- `API.ENROLLMENTS` - Enrollment management
- `API.PROGRESS` - Progress tracking
- `API.CATEGORIES` - Category management
- `API.REVIEWS` - Course reviews
- `API.USERS` - User management
- `API.CERTIFICATES` - Certificate generation

## Best Practices

1. **Always use ROUTES constants** instead of hardcoded strings
2. **Use helper functions** for role-based routing
3. **Use dynamic route functions** for routes with parameters
4. **Use buildUrl** when you need query parameters
5. **Keep urls.ts updated** when adding new routes

## Example: Adding a New Route

1. Add to `urls.ts`:
```typescript
export const ROUTES = {
  // ... existing routes
  LESSON_PLAYER: (courseId: number | string, lessonId: number | string) => 
    `/courses/${courseId}/lessons/${lessonId}`,
}
```

2. Use in App.tsx:
```typescript
<Route path="courses/:courseId/lessons/:lessonId" element={<LessonPlayerPage />} />
```

3. Use in components:
```typescript
<Link to={ROUTES.LESSON_PLAYER(course.id, lesson.id)}>
  Watch Lesson
</Link>
```

## Migration Checklist

All major files have been updated to use the centralized routing system:
- ✅ `App.tsx` - Route definitions
- ✅ `Navbar.tsx` - Navigation links
- ✅ `DashboardPage.tsx` - Student dashboard
- ✅ `InstructorDashboardPage.tsx` - Instructor dashboard
- ✅ `CourseEditorPage.tsx` - Course editor
- ✅ `LoginPage.tsx` - Login page
- ✅ `RegisterPage.tsx` - Registration page

## Future Enhancements

The following routes are defined but not yet implemented:
- About page
- Contact page
- 404 Not Found page
- Admin dashboard
- Lesson player

When implementing these pages, use the routes already defined in `urls.ts`.
