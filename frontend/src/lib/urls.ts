/**
 * Centralized URL/Route management
 * All application routes are defined here for easy maintenance
 */

// Public routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  COURSES: '/courses',
  COURSE_DETAIL: (id: number | string) => `/courses/${id}`,
  LESSON_PLAYER: (courseId: number | string, lessonId: number | string) => 
    `/courses/${courseId}/lessons/${lessonId}`,
  
  // Student routes
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  
  // Instructor routes
  INSTRUCTOR: {
    DASHBOARD: '/instructor/dashboard',
    COURSES: {
      NEW: '/instructor/courses/new',
      EDIT: (id: number | string) => `/instructor/courses/edit/${id}`,
    },
  },
  
  // Admin routes
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    COURSES: '/admin/courses',
  },
  
  // Other pages
  ABOUT: '/about',
  CONTACT: '/contact',
  NOT_FOUND: '/404',
} as const

// API endpoints
export const API = {
  BASE_URL: '/api',
  
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  
  // Course endpoints
  COURSES: {
    LIST: '/courses',
    DETAIL: (id: number | string) => `/courses/${id}`,
    CREATE: '/courses',
    UPDATE: (id: number | string) => `/courses/${id}`,
    DELETE: (id: number | string) => `/courses/${id}`,
    BY_INSTRUCTOR: (instructorId: number | string) => `/courses?instructorId=${instructorId}`,
  },
  
  // Module endpoints
  MODULES: {
    LIST: (courseId: number | string) => `/courses/${courseId}/modules`,
    DETAIL: (id: number | string) => `/modules/${id}`,
    CREATE: '/modules',
    UPDATE: (id: number | string) => `/modules/${id}`,
    DELETE: (id: number | string) => `/modules/${id}`,
  },
  
  // Lesson endpoints
  LESSONS: {
    LIST: (moduleId: number | string) => `/modules/${moduleId}/lessons`,
    DETAIL: (id: number | string) => `/lessons/${id}`,
    CREATE: '/lessons',
    UPDATE: (id: number | string) => `/lessons/${id}`,
    DELETE: (id: number | string) => `/lessons/${id}`,
  },
  
  // Enrollment endpoints
  ENROLLMENTS: {
    LIST: '/enrollments',
    MY_ENROLLMENTS: '/enrollments/my',
    DETAIL: (id: number | string) => `/enrollments/${id}`,
    CREATE: '/enrollments',
    UPDATE: (id: number | string) => `/enrollments/${id}`,
    DELETE: (id: number | string) => `/enrollments/${id}`,
  },
  
  // Progress endpoints
  PROGRESS: {
    LIST: (enrollmentId: number | string) => `/enrollments/${enrollmentId}/progress`,
    UPDATE: '/progress',
    LESSON_PROGRESS: (enrollmentId: number | string, lessonId: number | string) => 
      `/enrollments/${enrollmentId}/lessons/${lessonId}/progress`,
  },
  
  // Category endpoints
  CATEGORIES: {
    LIST: '/categories',
    DETAIL: (id: number | string) => `/categories/${id}`,
    CREATE: '/categories',
    UPDATE: (id: number | string) => `/categories/${id}`,
    DELETE: (id: number | string) => `/categories/${id}`,
  },
  
  // Review endpoints
  REVIEWS: {
    LIST: (courseId: number | string) => `/courses/${courseId}/reviews`,
    CREATE: '/reviews',
    UPDATE: (id: number | string) => `/reviews/${id}`,
    DELETE: (id: number | string) => `/reviews/${id}`,
  },
  
  // User endpoints
  USERS: {
    LIST: '/users',
    DETAIL: (id: number | string) => `/users/${id}`,
    UPDATE: (id: number | string) => `/users/${id}`,
    DELETE: (id: number | string) => `/users/${id}`,
    CHANGE_PASSWORD: '/users/change-password',
  },
  
  // Certificate endpoints
  CERTIFICATES: {
    LIST: '/certificates',
    DETAIL: (id: number | string) => `/certificates/${id}`,
    GENERATE: (enrollmentId: number | string) => `/enrollments/${enrollmentId}/certificate`,
  },
} as const

// Helper function to build query strings
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value))
    }
  })
  
  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ''
}

// Helper function to build URL with query params
export const buildUrl = (baseUrl: string, params?: Record<string, any>): string => {
  if (!params) return baseUrl
  return `${baseUrl}${buildQueryString(params)}`
}

// Role-based dashboard routing
export const getDashboardRoute = (role: string): string => {
  switch (role) {
    case 'INSTRUCTOR':
      return ROUTES.INSTRUCTOR.DASHBOARD
    case 'ADMIN':
      return ROUTES.ADMIN.DASHBOARD
    case 'STUDENT':
    default:
      return ROUTES.DASHBOARD
  }
}

// Export types for TypeScript
export type RouteKey = keyof typeof ROUTES
export type ApiKey = keyof typeof API
