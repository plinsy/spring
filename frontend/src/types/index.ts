export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  role: 'ADMIN' | 'INSTRUCTOR' | 'STUDENT'
  profileImage?: string
  bio?: string
}

export interface Category {
  id: number
  name: string
  description: string
  slug: string
  icon?: string
}

export interface Instructor {
  id: number
  firstName: string
  lastName: string
  email: string
  profileImage?: string
  bio?: string
}

export interface Course {
  id: number
  title: string
  description: string
  shortDescription?: string
  price: number
  thumbnail?: string
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  published: boolean
  instructor: Instructor
  category: Category
  enrollmentCount?: number
  averageRating?: number
  duration?: number
  createdAt: string
  updatedAt: string
}

export interface Module {
  id: number
  title: string
  description: string
  orderIndex: number
  lessons: Lesson[]
}

export interface Lesson {
  id: number
  title: string
  description: string
  content?: string
  videoUrl?: string
  duration: number
  orderIndex: number
  isFree: boolean
}

export interface Review {
  id: number
  rating: number
  comment: string
  user: User
  createdAt: string
}

export interface Enrollment {
  id: number
  course: Course
  student: User
  enrolledAt: string
  completionPercentage: number
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

export interface ApiError {
  message: string
  status: number
}
