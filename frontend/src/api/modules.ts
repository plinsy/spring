import axios from '../lib/axios'
import type {  Module } from '../types'

export const moduleService = {
  // Get all modules for a course
  getCourseModules: async (courseId: number): Promise<Module[]> => {
    const response = await axios.get(`/api/courses/${courseId}/modules`)
    return response.data.data || response.data
  },

  // Get a single module by ID
  getModuleById: async (moduleId: number): Promise<Module> => {
    const response = await axios.get(`/api/modules/${moduleId}`)
    return response.data.data || response.data
  },

  // Get module with lessons
  getModuleWithLessons: async (moduleId: number): Promise<Module> => {
    const response = await axios.get(`/api/modules/${moduleId}/lessons`)
    return response.data.data || response.data
  }
}
