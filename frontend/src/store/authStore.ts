import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../lib/axios'

interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN'
}

interface AuthResponse {
  data: {
    user: User
    accessToken: string
  }
}

interface RegisterRequest {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
  role: 'STUDENT' | 'INSTRUCTOR'
}

interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      login: async (emailOrUsername: string, password: string) => {
        const response = await api.post<AuthResponse>('/auth/login', { emailOrUsername, password })
        const { user, accessToken } = response.data.data
        localStorage.setItem('accessToken', accessToken)
        set({ user, accessToken, isAuthenticated: true })
      },
      register: async (data: RegisterRequest) => {
        const response = await api.post<AuthResponse>('/auth/register', data)
        const { user, accessToken } = response.data.data
        localStorage.setItem('accessToken', accessToken)
        set({ user, accessToken, isAuthenticated: true })
      },
      logout: () => {
        localStorage.removeItem('accessToken')
        set({ user: null, accessToken: null, isAuthenticated: false })
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
