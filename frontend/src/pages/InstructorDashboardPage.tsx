import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import {
  BookOpen,
  Users,
  TrendingUp,
  DollarSign,
  Plus,
  Edit,
  Eye,
  Trash2,
  BarChart3,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  MoreVertical
} from 'lucide-react'
import api from '../lib/axios'

interface Course {
  id: number
  title: string
  thumbnailUrl: string
  isPublished: boolean
  level: string
  price: number
  enrollmentCount: number
  rating: number
  totalModules: number
  totalLessons: number
  createdAt: string
}

interface InstructorStats {
  totalCourses: number
  totalStudents: number
  publishedCourses: number
  draftCourses: number
  totalRevenue: number
  averageRating: number
}

export default function InstructorDashboardPage() {
  const { user } = useAuthStore()
  const [courses, setCourses] = useState<Course[]>([])
  const [stats, setStats] = useState<InstructorStats>({
    totalCourses: 0,
    totalStudents: 0,
    publishedCourses: 0,
    draftCourses: 0,
    totalRevenue: 0,
    averageRating: 0,
  })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all')

  useEffect(() => {
    if (user?.role === 'INSTRUCTOR') {
      fetchInstructorData()
    }
  }, [user])

  const fetchInstructorData = async () => {
    try {
      setLoading(true)
      
      // Fetch instructor's courses
      const coursesRes = await api.get('/courses', {
        params: { instructorId: user?.id, page: 0, size: 100 }
      })
      
      const instructorCourses = coursesRes.data.data.content || []
      setCourses(instructorCourses)
      
      // Calculate stats
      const published = instructorCourses.filter((c: Course) => c.isPublished).length
      const draft = instructorCourses.filter((c: Course) => !c.isPublished).length
      const totalEnrollments = instructorCourses.reduce((sum: number, c: Course) => 
        sum + (c.enrollmentCount || 0), 0)
      const totalRevenue = instructorCourses.reduce((sum: number, c: Course) => 
        sum + (c.price * (c.enrollmentCount || 0)), 0)
      const avgRating = instructorCourses.length > 0
        ? instructorCourses.reduce((sum: number, c: Course) => sum + (c.rating || 0), 0) / instructorCourses.length
        : 0
      
      setStats({
        totalCourses: instructorCourses.length,
        totalStudents: totalEnrollments,
        publishedCourses: published,
        draftCourses: draft,
        totalRevenue: totalRevenue,
        averageRating: avgRating,
      })
      
    } catch (error) {
      console.error('Failed to fetch instructor data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCourse = async (courseId: number) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return
    }

    try {
      await api.delete(`/courses/${courseId}`)
      setCourses(courses.filter(c => c.id !== courseId))
      // Recalculate stats
      fetchInstructorData()
    } catch (error) {
      console.error('Failed to delete course:', error)
      alert('Failed to delete course. Please try again.')
    }
  }

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = 
      filterStatus === 'all' ? true :
      filterStatus === 'published' ? course.isPublished :
      !course.isPublished
    
    return matchesSearch && matchesFilter
  })

  if (user?.role !== 'INSTRUCTOR') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">This page is only accessible to instructors.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
            <p className="mt-2 text-gray-600">Manage your courses and track your performance</p>
          </div>
          <Link
            to="/instructor/courses/new"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <Plus className="h-5 w-5" />
            Create Course
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalCourses}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-green-600 font-medium">
                    {stats.publishedCourses} published
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-yellow-600 font-medium">
                    {stats.draftCourses} draft
                  </span>
                </div>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalStudents}</p>
                <p className="text-xs text-gray-500 mt-1">Across all courses</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {stats.averageRating.toFixed(1)}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < Math.floor(stats.averageRating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="bg-yellow-100 rounded-full p-3">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  ${stats.totalRevenue.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">All time earnings</p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-md p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Course Performance</h3>
              <BarChart3 className="h-5 w-5 opacity-80" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="opacity-90">Published</span>
                <span className="font-semibold">{stats.publishedCourses}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="opacity-90">In Draft</span>
                <span className="font-semibold">{stats.draftCourses}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="opacity-90">Avg. Rating</span>
                <span className="font-semibold">{stats.averageRating.toFixed(1)} ⭐</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl shadow-md p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Student Engagement</h3>
              <TrendingUp className="h-5 w-5 opacity-80" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="opacity-90">Total Enrollments</span>
                <span className="font-semibold">{stats.totalStudents}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="opacity-90">Avg. per Course</span>
                <span className="font-semibold">
                  {stats.totalCourses > 0 ? Math.round(stats.totalStudents / stats.totalCourses) : 0}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl shadow-md p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Revenue Overview</h3>
              <DollarSign className="h-5 w-5 opacity-80" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="opacity-90">Total Earned</span>
                <span className="font-semibold">${stats.totalRevenue.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="opacity-90">Avg. per Course</span>
                <span className="font-semibold">
                  ${stats.totalCourses > 0 ? Math.round(stats.totalRevenue / stats.totalCourses).toLocaleString() : 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {/* Toolbar */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">My Courses</h2>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                {/* Search */}
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="all">All Courses</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Courses List */}
          <div className="p-6">
            {filteredCourses.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchQuery ? 'No courses found' : 'No courses yet'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery 
                    ? 'Try adjusting your search or filter'
                    : 'Create your first course to start teaching'}
                </p>
                {!searchQuery && (
                  <Link
                    to="/courses/create"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                    Create Your First Course
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
                  >
                    {/* Thumbnail */}
                    <img
                      src={course.thumbnailUrl || 'https://via.placeholder.com/160x100'}
                      alt={course.title}
                      className="w-40 h-24 object-cover rounded-lg flex-shrink-0"
                    />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 line-clamp-1">
                              {course.title}
                            </h3>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              course.isPublished
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {course.isPublished ? 'Published' : 'Draft'}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {course.enrollmentCount || 0} students
                            </span>
                            <span className="flex items-center gap-1">
                              <BookOpen className="h-4 w-4" />
                              {course.totalModules || 0} modules, {course.totalLessons || 0} lessons
                            </span>
                            {course.rating > 0 && (
                              <span className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                {course.rating.toFixed(1)}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              {course.price === 0 ? 'Free' : `$${course.price}`}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Link
                            to={`/courses/${course.id}`}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Course"
                          >
                            <Eye className="h-5 w-5" />
                          </Link>
                          <Link
                            to={`/instructor/courses/edit/${course.id}`}
                            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit Course"
                          >
                            <Edit className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleDeleteCourse(course.id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Course"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      {/* Progress/Stats Bar */}
                      <div className="flex items-center gap-6 mt-3 pt-3 border-t border-gray-100">
                        <div className="text-xs text-gray-500">
                          Revenue: <span className="font-semibold text-gray-900">
                            ${((course.enrollmentCount || 0) * course.price).toLocaleString()}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Level: <span className="font-semibold text-gray-900">{course.level}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Created: <span className="font-semibold text-gray-900">
                            {new Date(course.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
