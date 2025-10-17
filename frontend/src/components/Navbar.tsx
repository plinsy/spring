import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { LogOut, User, BookOpen, Award } from 'lucide-react'
import { ROUTES, getDashboardRoute } from '../lib/urls'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore()

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to={ROUTES.HOME} className="flex items-center text-2xl font-bold text-primary-600">
              🎓 SkillHub
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to={ROUTES.COURSES}
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-primary-600"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Courses
              </Link>
              <Link
                to={ROUTES.ABOUT}
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-primary-600"
              >
                About
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to={user?.role ? getDashboardRoute(user.role) : ROUTES.DASHBOARD}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600"
                >
                  <User className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
                <Link
                  to={ROUTES.PROFILE}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600"
                >
                  {user?.firstName}
                </Link>
                {user?.role === 'STUDENT' && (
                  <Link
                    to={ROUTES.CERTIFICATES}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600"
                  >
                    <Award className="w-4 h-4 mr-2" />
                    Certificates
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to={ROUTES.LOGIN}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600"
                >
                  Login
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
