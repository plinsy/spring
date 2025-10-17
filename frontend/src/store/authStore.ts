import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN'
}

interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  login: (user: User, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      login: (user, token) => {
        localStorage.setItem('accessToken', token)
        set({ user, accessToken: token, isAuthenticated: true })
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
