import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { 
  BookOpen, 
  Clock, 
  TrendingUp, 
  Award, 
  Target,
  Play,
  CheckCircle,
  Calendar,
  Zap
} from 'lucide-react'
import api from '../lib/axios'

interface EnrolledCourse {
  id: number
  title: string
  thumbnailUrl: string
  instructor: {
    firstName: string
    lastName: string
  }
  progress: number
  lastAccessedAt?: string
  totalLessons: number
  completedLessons: number
  categories: Array<{ id: number; name: string }>
}

interface DashboardStats {
  totalEnrolled: number
  completedCourses: number
  inProgressCourses: number
  totalLearningHours: number
}

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([])
  const [recommendedCourses, setRecommendedCourses] = useState<any[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalEnrolled: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    totalLearningHours: 0,
  })
  const [loading, setLoading] = useState(true)

  // Redirect instructors to their dashboard
  if (user?.role === 'INSTRUCTOR') {
    return <Navigate to="/instructor/dashboard" replace />
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch enrolled courses
      const enrollmentsRes = await api.get('/enrollments')
      const enrollments = enrollmentsRes.data.data || []
      
      // Fetch course details for each enrollment
      const coursesWithProgress = await Promise.all(
        enrollments.map(async (enrollment: any) => {
          const courseRes = await api.get(`/courses/${enrollment.courseId}`)
          const course = courseRes.data.data
          
          return {
            id: course.id,
            title: course.title,
            thumbnailUrl: course.thumbnailUrl,
            instructor: course.instructor,
            progress: enrollment.progressPercentage || 0,
            lastAccessedAt: enrollment.updatedAt,
            totalLessons: course.totalLessons || 0,
            completedLessons: Math.floor((enrollment.progressPercentage || 0) * (course.totalLessons || 0) / 100),
            categories: course.categories || [],
          }
        })
      )
      
      setEnrolledCourses(coursesWithProgress)
      
      // Calculate stats
      const completed = coursesWithProgress.filter(c => c.progress === 100).length
      const inProgress = coursesWithProgress.filter(c => c.progress > 0 && c.progress < 100).length
      const totalHours = coursesWithProgress.reduce((sum, c) => sum + (c.totalLessons * 0.5), 0)
      
      setStats({
        totalEnrolled: coursesWithProgress.length,
        completedCourses: completed,
        inProgressCourses: inProgress,
        totalLearningHours: Math.round(totalHours),
      })
      
      // Fetch recommended courses
      const recommendedRes = await api.get('/courses', {
        params: { published: true, page: 0, size: 3 }
      })
      setRecommendedCourses(recommendedRes.data.data.content || [])
      
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="mt-2 text-gray-600">
            Continue your learning journey and track your progress
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Enrolled Courses</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalEnrolled}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.inProgressCourses}</p>
              </div>
              <div className="bg-yellow-100 rounded-full p-3">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.completedCourses}</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <Award className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Learning Hours</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalLearningHours}</p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Continue Learning */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Continue Learning</h2>
                <Link to="/courses" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View All
                </Link>
              </div>

              {enrolledCourses.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
                  <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No courses enrolled yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Start your learning journey by exploring our courses
                  </p>
                  <Link
                    to="/courses"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <BookOpen className="h-5 w-5 mr-2" />
                    Browse Courses
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {enrolledCourses
                    .sort((a, b) => {
                      // Sort by progress: in-progress first, then not started, then completed
                      if (a.progress > 0 && a.progress < 100 && !(b.progress > 0 && b.progress < 100)) return -1
                      if (!(a.progress > 0 && a.progress < 100) && b.progress > 0 && b.progress < 100) return 1
                      return 0
                    })
                    .slice(0, 4)
                    .map((course) => (
                      <Link
                        key={course.id}
                        to={`/courses/${course.id}`}
                        className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                      >
                        <div className="flex items-start p-4 gap-4">
                          <img
                            src={course.thumbnailUrl || 'https://via.placeholder.com/120x80'}
                            alt={course.title}
                            className="w-32 h-20 object-cover rounded-lg flex-shrink-0"
                          />
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                              {course.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {course.instructor.firstName} {course.instructor.lastName}
                            </p>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                              <span className="flex items-center">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                {course.completedLessons}/{course.totalLessons} lessons
                              </span>
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Progress</span>
                                <span className="font-medium text-gray-900">{course.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${course.progress}%` }}
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex-shrink-0">
                            <button className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                              <Play className="h-5 w-5 ml-0.5" />
                            </button>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              )}
            </div>

            {/* Achievements */}
            {stats.completedCourses > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Achievements</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {stats.completedCourses > 0 && (
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-yellow-500 rounded-full p-2">
                          <Award className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Course Completed</h3>
                          <p className="text-sm text-gray-600">Finished {stats.completedCourses} course{stats.completedCourses > 1 ? 's' : ''}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {stats.totalLearningHours > 10 && (
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-purple-500 rounded-full p-2">
                          <Zap className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Learning Streak</h3>
                          <p className="text-sm text-gray-600">{stats.totalLearningHours}+ hours learned</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recommended Courses */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recommended for You</h2>
              <div className="space-y-4">
                {recommendedCourses.map((course) => (
                  <Link
                    key={course.id}
                    to={`/courses/${course.id}`}
                    className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden"
                  >
                    <img
                      src={course.thumbnailUrl || 'https://via.placeholder.com/400x200'}
                      alt={course.title}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {course.instructor?.firstName} {course.instructor?.lastName}
                      </p>
                      {course.categories && course.categories.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="inline-block px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded">
                            {course.categories[0].name}
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-sm p-6 text-white">
              <h3 className="font-bold text-lg mb-2">Keep Learning! 🚀</h3>
              <p className="text-blue-100 text-sm mb-4">
                Explore more courses to expand your skills and knowledge
              </p>
              <Link
                to="/courses"
                className="block w-full bg-white text-blue-600 text-center font-semibold py-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Browse All Courses
              </Link>
            </div>

            {/* Calendar Widget */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-gray-600" />
                <h3 className="font-bold text-gray-900">Learning Activity</h3>
              </div>
              <div className="space-y-3">
                {enrolledCourses.slice(0, 3).map((course, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">
                        {course.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {course.progress}% complete
                      </p>
                    </div>
                  </div>
                ))}
                {enrolledCourses.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No activity yet
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
