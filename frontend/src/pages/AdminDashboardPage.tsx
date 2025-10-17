import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { ROUTES } from '../lib/urls'
import {
  Users,
  BookOpen,
  TrendingUp,
  DollarSign,
  Award,
  AlertCircle,
  Search,
  Trash2,
  CheckCircle,
  Calendar,
  Activity,
  UserCheck,
  UserX,
  ShieldCheck,
  Eye,
  Star
} from 'lucide-react'
import api from '../lib/axios'
import { Alert, AlertDescription } from '../components/ui/alert'

interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  username: string
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN'
  createdAt: string
  profileImageUrl?: string
}

interface Course {
  id: number
  title: string
  instructor: {
    firstName: string
    lastName: string
  }
  isPublished: boolean
  enrollmentCount: number
  rating: number
  price: number
  createdAt: string
}

interface PlatformStats {
  totalUsers: number
  totalCourses: number
  totalEnrollments: number
  totalRevenue: number
  activeStudents: number
  activeInstructors: number
  publishedCourses: number
  draftCourses: number
}

export default function AdminDashboardPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'courses'>('overview')
  const [stats, setStats] = useState<PlatformStats>({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalRevenue: 0,
    activeStudents: 0,
    activeInstructors: 0,
    publishedCourses: 0,
    draftCourses: 0,
  })
  const [users, setUsers] = useState<User[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState<'ALL' | 'STUDENT' | 'INSTRUCTOR' | 'ADMIN'>('ALL')
  const [filterCourseStatus, setFilterCourseStatus] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL')

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError('')

      // Fetch all users
      const usersRes = await api.get('/users')
      const allUsers = usersRes.data.data || []
      setUsers(allUsers)

      // Fetch all courses
      const coursesRes = await api.get('/courses', {
        params: { page: 0, size: 1000 }
      })
      const allCourses = coursesRes.data.data.content || []
      setCourses(allCourses)

      // Fetch all enrollments for stats
      const enrollmentsRes = await api.get('/enrollments')
      const allEnrollments = enrollmentsRes.data.data || []

      // Calculate stats
      const students = allUsers.filter((u: User) => u.role === 'STUDENT')
      const instructors = allUsers.filter((u: User) => u.role === 'INSTRUCTOR')
      const publishedCourses = allCourses.filter((c: Course) => c.isPublished)
      const draftCourses = allCourses.filter((c: Course) => !c.isPublished)
      const totalRevenue = allCourses.reduce((sum: number, c: Course) => 
        sum + (c.price * (c.enrollmentCount || 0)), 0
      )

      setStats({
        totalUsers: allUsers.length,
        totalCourses: allCourses.length,
        totalEnrollments: allEnrollments.length,
        totalRevenue: totalRevenue,
        activeStudents: students.length,
        activeInstructors: instructors.length,
        publishedCourses: publishedCourses.length,
        draftCourses: draftCourses.length,
      })
    } catch (err: any) {
      console.error('Failed to fetch admin data:', err)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }

    try {
      await api.delete(`/users/${userId}`)
      setUsers(users.filter(u => u.id !== userId))
      setStats(prev => ({ ...prev, totalUsers: prev.totalUsers - 1 }))
    } catch (err: any) {
      alert('Failed to delete user: ' + (err.response?.data?.message || 'Unknown error'))
    }
  }

  const handleDeleteCourse = async (courseId: number) => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return
    }

    try {
      await api.delete(`/courses/${courseId}`)
      setCourses(courses.filter(c => c.id !== courseId))
      setStats(prev => ({ ...prev, totalCourses: prev.totalCourses - 1 }))
    } catch (err: any) {
      alert('Failed to delete course: ' + (err.response?.data?.message || 'Unknown error'))
    }
  }

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesRole = filterRole === 'ALL' || u.role === filterRole
    
    return matchesSearch && matchesRole
  })

  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = 
      filterCourseStatus === 'ALL' || 
      (filterCourseStatus === 'PUBLISHED' && c.isPublished) ||
      (filterCourseStatus === 'DRAFT' && !c.isPublished)
    
    return matchesSearch && matchesStatus
  })

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-purple-100 text-purple-800'
      case 'INSTRUCTOR': return 'bg-blue-100 text-blue-800'
      case 'STUDENT': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Only administrators can access this page.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <p className="text-gray-600">Manage users, courses, and monitor platform performance</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
                <div className="flex items-center gap-2 mt-2">
                  <UserCheck className="h-4 w-4 text-green-600" />
                  <span className="text-xs text-green-600 font-medium">
                    {stats.activeStudents} Students
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-blue-600 font-medium">
                    {stats.activeInstructors} Instructors
                  </span>
                </div>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalCourses}</p>
                <div className="flex items-center gap-2 mt-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-xs text-green-600 font-medium">
                    {stats.publishedCourses} Published
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-yellow-600 font-medium">
                    {stats.draftCourses} Draft
                  </span>
                </div>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Enrollments</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalEnrollments.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-xs text-green-600 font-medium">Active learning</span>
                </div>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Platform Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ${stats.totalRevenue.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <Award className="h-4 w-4 text-yellow-600" />
                  <span className="text-xs text-yellow-600 font-medium">Total earnings</span>
                </div>
              </div>
              <div className="bg-yellow-100 rounded-full p-3">
                <DollarSign className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="flex gap-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'overview'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Overview
                </div>
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'users'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Users ({users.length})
                </div>
              </button>
              <button
                onClick={() => setActiveTab('courses')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'courses'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Courses ({courses.length})
                </div>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Activity</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                      <Users className="h-8 w-8 mb-3 opacity-80" />
                      <p className="text-sm opacity-90">User Growth</p>
                      <p className="text-3xl font-bold mt-1">{stats.totalUsers}</p>
                      <p className="text-xs opacity-75 mt-2">Total registered users</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                      <BookOpen className="h-8 w-8 mb-3 opacity-80" />
                      <p className="text-sm opacity-90">Course Library</p>
                      <p className="text-3xl font-bold mt-1">{stats.publishedCourses}</p>
                      <p className="text-xs opacity-75 mt-2">Published courses</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
                      <TrendingUp className="h-8 w-8 mb-3 opacity-80" />
                      <p className="text-sm opacity-90">Engagement</p>
                      <p className="text-3xl font-bold mt-1">{stats.totalEnrollments}</p>
                      <p className="text-xs opacity-75 mt-2">Total enrollments</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Platform Statistics</p>
                        <p className="text-xs text-gray-600">Last updated today</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search users..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value as any)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="ALL">All Roles</option>
                    <option value="STUDENT">Students</option>
                    <option value="INSTRUCTOR">Instructors</option>
                    <option value="ADMIN">Admins</option>
                  </select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">User</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Email</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Role</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Joined</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-12">
                            <UserX className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-600">No users found</p>
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((u) => (
                          <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                                  {u.firstName[0]}{u.lastName[0]}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{u.firstName} {u.lastName}</p>
                                  <p className="text-sm text-gray-600">@{u.username}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">{u.email}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(u.role)}`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {new Date(u.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-end gap-2">
                                <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  onClick={() => handleDeleteUser(u.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Courses Tab */}
            {activeTab === 'courses' && (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search courses..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={filterCourseStatus}
                    onChange={(e) => setFilterCourseStatus(e.target.value as any)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="ALL">All Status</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="DRAFT">Draft</option>
                  </select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Course</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Instructor</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Enrollments</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Price</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCourses.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-12">
                            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-600">No courses found</p>
                          </td>
                        </tr>
                      ) : (
                        filteredCourses.map((c) => (
                          <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <p className="font-medium text-gray-900">{c.title}</p>
                              <div className="flex items-center gap-1 mt-1">
                                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                <span className="text-xs text-gray-600">{c.rating.toFixed(1)}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {c.instructor.firstName} {c.instructor.lastName}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                c.isPublished 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {c.isPublished ? 'Published' : 'Draft'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">{c.enrollmentCount}</td>
                            <td className="py-3 px-4 text-sm font-medium text-gray-900">${c.price}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-end gap-2">
                                <button 
                                  onClick={() => navigate(ROUTES.COURSE_DETAIL(c.id))}
                                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteCourse(c.id)}
                                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
