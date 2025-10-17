import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { 
  BookOpen, 
  Clock, 
  Star, 
  Play, 
  CheckCircle, 
  ChevronDown,
  ChevronUp,
  Award,
  Calendar,
  TrendingUp
} from 'lucide-react'
import { courseApi } from '../services/courseService'
import { useAuthStore } from '../store/authStore'
import type { Course, Module } from '../types'

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set())
  const [enrolling, setEnrolling] = useState(false)

  // Fetch course details
  const { data: course, isLoading, error } = useQuery<Course>({
    queryKey: ['course', id],
    queryFn: () => courseApi.getCourseById(Number(id)),
    enabled: !!id,
  })

  // Fetch course modules (mock for now, will need backend endpoint)
  const { data: modules = [] } = useQuery<Module[]>({
    queryKey: ['course-modules', id],
    queryFn: async () => {
      // Mock data for now - replace with actual API call when backend is ready
      return []
    },
    enabled: !!id,
  })

  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev)
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId)
      } else {
        newSet.add(moduleId)
      }
      return newSet
    })
  }

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/courses/${id}` } })
      return
    }

    try {
      setEnrolling(true)
      await courseApi.enrollInCourse(Number(id))
      // Redirect to course player or dashboard
      navigate(`/dashboard`)
    } catch (error) {
      console.error('Enrollment failed:', error)
      alert('Failed to enroll in course. Please try again.')
    } finally {
      setEnrolling(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-64 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h2>
          <p className="text-gray-600 mb-6">The course you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/courses')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Browse Courses
          </button>
        </div>
      </div>
    )
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'BEGINNER': return 'bg-green-100 text-green-800'
      case 'INTERMEDIATE': return 'bg-blue-100 text-blue-800'
      case 'ADVANCED': return 'bg-purple-100 text-purple-800'
      case 'EXPERT': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-blue-100 mb-4">
                <button onClick={() => navigate('/')} className="hover:text-white">Home</button>
                <span>/</span>
                <button onClick={() => navigate('/courses')} className="hover:text-white">Courses</button>
                <span>/</span>
                <span className="text-white">{course.title}</span>
              </div>

              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl text-blue-100 mb-6">{course.description}</p>

              {/* Course Meta */}
              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{course.averageRating?.toFixed(1) || '0.0'}</span>
                  <span className="text-blue-100">({course.totalEnrollments || 0} students)</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  <span>{course.totalLessons || 0} lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{course.totalModules || 0} modules</span>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(course.level)}`}>
                    {course.level}
                  </span>
                </div>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                  {course.instructor.firstName[0]}{course.instructor.lastName[0]}
                </div>
                <div>
                  <p className="text-sm text-blue-100">Instructor</p>
                  <p className="text-lg font-semibold">
                    {course.instructor.firstName} {course.instructor.lastName}
                  </p>
                </div>
              </div>
            </div>

            {/* Enrollment Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-xl p-6 sticky top-4">
                {course.thumbnailUrl && (
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    ${course.price === 0 ? 'Free' : course.price.toFixed(2)}
                  </div>
                  {course.price > 0 && (
                    <p className="text-sm text-gray-600">One-time payment</p>
                  )}
                </div>

                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                >
                  {enrolling ? 'Enrolling...' : 'Enroll Now'}
                </button>

                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>{course.totalEnrollments || 0} students enrolled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Last updated {new Date(course.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    <span>Certificate of completion</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Course Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* What You'll Learn */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">What You'll Learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Master the fundamentals</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Build real-world projects</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Industry best practices</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Expert guidance and support</span>
                </div>
              </div>
            </div>

            {/* Course Content/Curriculum */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">Course Content</h2>
              
              {modules.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>Course modules will be available after enrollment</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {modules.map((module) => (
                    <div key={module.id} className="border rounded-lg">
                      <button
                        onClick={() => toggleModule(module.id)}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition"
                      >
                        <div className="flex items-center gap-3">
                          {expandedModules.has(module.id) ? (
                            <ChevronUp className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          )}
                          <div className="text-left">
                            <h3 className="font-semibold">{module.title}</h3>
                            {module.description && (
                              <p className="text-sm text-gray-600">{module.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          {module.lessons?.length || 0} lessons
                        </div>
                      </button>

                      {expandedModules.has(module.id) && module.lessons && (
                        <div className="border-t bg-gray-50">
                          {module.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className="flex items-center gap-3 p-4 border-b last:border-b-0 hover:bg-white transition"
                            >
                              <Play className="w-4 h-4 text-gray-400" />
                              <div className="flex-1">
                                <p className="font-medium">{lesson.title}</p>
                                {lesson.durationMinutes && (
                                  <p className="text-sm text-gray-500">{lesson.durationMinutes} min</p>
                                )}
                              </div>
                              {lesson.isFree && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                  Free Preview
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">Requirements</h2>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>No prior experience needed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>A computer with internet connection</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Willingness to learn</span>
                </li>
              </ul>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">Description</h2>
              <div className="prose max-w-none text-gray-700">
                <p>{course.description}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Categories */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h3 className="text-lg font-bold mb-4">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {course.categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => navigate(`/courses?categoryId=${category.id}`)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition"
                  >
                    {category.iconUrl && <span className="mr-1">{category.iconUrl}</span>}
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
