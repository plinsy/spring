import api from '../lib/axios'
import type { Course, Category, PaginatedResponse } from '../types'

export interface CourseFilters {
  search?: string
  categoryId?: number
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  minPrice?: number
  maxPrice?: number
  published?: boolean
  page?: number
  size?: number
  sort?: string
}

export const courseApi = {
  // Get paginated courses with filters
  getCourses: async (filters: CourseFilters = {}): Promise<PaginatedResponse<Course>> => {
    const params = new URLSearchParams()
    
    if (filters.search) params.append('search', filters.search)
    if (filters.categoryId) params.append('categoryId', filters.categoryId.toString())
    if (filters.level) params.append('level', filters.level)
    if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString())
    if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString())
    if (filters.published !== undefined) params.append('published', filters.published.toString())
    if (filters.page !== undefined) params.append('page', filters.page.toString())
    if (filters.size !== undefined) params.append('size', filters.size.toString())
    if (filters.sort) params.append('sort', filters.sort)
    
    const response = await api.get<PaginatedResponse<Course>>(`/courses?${params.toString()}`)
    return response.data
  },

  // Get course by ID
  getCourseById: async (id: number): Promise<Course> => {
    const response = await api.get<Course>(`/courses/${id}`)
    return response.data
  },

  // Get featured courses
  getFeaturedCourses: async (size: number = 6): Promise<Course[]> => {
    const response = await api.get<PaginatedResponse<Course>>(`/courses?published=true&size=${size}&sort=enrollmentCount,desc`)
    return response.data.content
  },
}

export const categoryApi = {
  // Get all categories
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/categories')
    return response.data
  },

  // Get category by ID
  getCategoryById: async (id: number): Promise<Category> => {
    const response = await api.get<Category>(`/categories/${id}`)
    return response.data
  },
}
