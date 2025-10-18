export interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  role: 'ADMIN' | 'INSTRUCTOR' | 'STUDENT'
  profilePictureUrl?: string
  bio?: string
  isActive?: boolean
}

export interface Category {
  id: number
  name: string
  description?: string
  iconUrl?: string
  createdAt?: string
}

export interface Instructor {
  id: number
  username: string
  firstName: string
  lastName: string
  email?: string
  profilePictureUrl?: string
  bio?: string
}

export interface Course {
  id: number
  title: string
  description: string
  shortDescription: string
  thumbnailUrl?: string
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
  duration: number
  isPublished: boolean
  price: number
  instructor: Instructor
  categories: Category[]
  averageRating?: number
  totalEnrollments?: number
  totalModules?: number
  totalLessons?: number
  totalReviews?: number
  createdAt: string
  updatedAt: string
}

export interface Module {
  id: number
  title: string
  description?: string
  orderIndex: number
  courseId: number
  lessons?: Lesson[]
  createdAt?: string
  updatedAt?: string
}

export interface Lesson {
  id: number
  title: string
  content?: string
  videoUrl?: string
  type: 'VIDEO' | 'TEXT' | 'QUIZ' | 'ASSIGNMENT' | 'RESOURCE'
  durationMinutes?: number
  orderIndex: number
  isFree: boolean
  moduleId: number
  createdAt?: string
  updatedAt?: string
}

export interface Review {
  id: number
  rating: number
  comment?: string
  user: User
  courseId: number
  isApproved?: boolean
  createdAt: string
  updatedAt?: string
}

export interface Enrollment {
  id: number
  courseId: number
  studentId: number
  enrolledAt: string
  completedAt?: string
  progressPercentage: number
  isCompleted: boolean
}

export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
}

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
}

export interface ApiError {
  message: string
  status: number
}
