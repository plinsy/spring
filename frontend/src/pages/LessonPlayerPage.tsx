import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ROUTES } from '../lib/urls'
import {
  ArrowLeft,
  CheckCircle,
  Circle,
  ChevronRight,
  ChevronLeft,
  Lock,
  Play,
  BookOpen,
  FileText,
  Video,
  MessageSquare,
  ThumbsUp,
  Share2,
  Download,
  AlertCircle
} from 'lucide-react'
import api from '../lib/axios'
import { Alert, AlertDescription } from '../components/ui/alert'

interface Lesson {
  id: number
  title: string
  content: string
  type: 'VIDEO' | 'TEXT' | 'QUIZ' | 'ASSIGNMENT' | 'RESOURCE'
  videoUrl?: string
  durationMinutes?: number
  isFree: boolean
  orderIndex: number
  isCompleted?: boolean
}

interface Module {
  id: number
  title: string
  orderIndex: number
  lessons: Lesson[]
}

interface Course {
  id: number
  title: string
  instructor: {
    firstName: string
    lastName: string
  }
  thumbnailUrl?: string
}

interface Enrollment {
  id: number
  progress: number
  status: string
}

export default function LessonPlayerPage() {
  const { courseId, lessonId } = useParams()
  const navigate = useNavigate()

  const [course, setCourse] = useState<Course | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [markingComplete, setMarkingComplete] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)

  useEffect(() => {
    if (courseId) {
      fetchCourseData()
    }
  }, [courseId])

  useEffect(() => {
    if (lessonId && modules.length > 0) {
      findAndSetCurrentLesson()
    }
  }, [lessonId, modules])

  const fetchCourseData = async () => {
    try {
      setLoading(true)
      setError('')

      // Fetch course details
      const courseRes = await api.get(`/courses/${courseId}`)
      setCourse(courseRes.data.data)

      // Fetch enrollment
      const enrollmentRes = await api.get('/enrollments/my')
      const enrollments = enrollmentRes.data.data || []
      const currentEnrollment = enrollments.find(
        (e: any) => e.course.id === parseInt(courseId!)
      )
      
      if (!currentEnrollment) {
        setError('You are not enrolled in this course')
        setLoading(false)
        return
      }
      
      setEnrollment(currentEnrollment)

      // Fetch modules with lessons
      const modulesRes = await api.get(`/courses/${courseId}/modules`)
      const modulesData = modulesRes.data.data || []
      
      // Fetch lessons for each module and check completion
      const modulesWithLessons = await Promise.all(
        modulesData.map(async (module: Module) => {
          const lessonsRes = await api.get(`/modules/${module.id}/lessons`)
          const lessons = lessonsRes.data.data || []
          
          // Check completion status for each lesson
          const lessonsWithStatus = await Promise.all(
            lessons.map(async (lesson: Lesson) => {
              try {
                const progressRes = await api.get(
                  `/enrollments/${currentEnrollment.id}/lessons/${lesson.id}/progress`
                )
                return {
                  ...lesson,
                  isCompleted: progressRes.data.data?.isCompleted || false
                }
              } catch {
                return { ...lesson, isCompleted: false }
              }
            })
          )
          
          return {
            ...module,
            lessons: lessonsWithStatus
          }
        })
      )
      
      setModules(modulesWithLessons)
    } catch (err: any) {
      console.error('Failed to fetch course data:', err)
      setError('Failed to load course data')
    } finally {
      setLoading(false)
    }
  }

  const findAndSetCurrentLesson = () => {
    for (const module of modules) {
      const lesson = module.lessons.find(l => l.id === parseInt(lessonId!))
      if (lesson) {
        setCurrentLesson(lesson)
        return
      }
    }
  }

  const markLessonComplete = async () => {
    if (!currentLesson || !enrollment) return

    try {
      setMarkingComplete(true)
      
      await api.put(`/enrollments/${enrollment.id}/progress`, {
        lessonId: currentLesson.id,
        isCompleted: true
      })

      // Update local state
      setModules(prev => prev.map(module => ({
        ...module,
        lessons: module.lessons.map(lesson =>
          lesson.id === currentLesson.id
            ? { ...lesson, isCompleted: true }
            : lesson
        )
      })))

      // Refresh enrollment to get updated progress
      const enrollmentRes = await api.get('/enrollments/my')
      const enrollments = enrollmentRes.data.data || []
      const updatedEnrollment = enrollments.find(
        (e: any) => e.course.id === parseInt(courseId!)
      )
      if (updatedEnrollment) {
        setEnrollment(updatedEnrollment)
      }

      // Auto-advance to next lesson
      goToNextLesson()
    } catch (err: any) {
      console.error('Failed to mark lesson complete:', err)
    } finally {
      setMarkingComplete(false)
    }
  }

  const getNextLesson = (): { moduleId: number; lesson: Lesson } | null => {
    let foundCurrent = false
    
    for (const module of modules) {
      for (const lesson of module.lessons) {
        if (foundCurrent && !lesson.isCompleted) {
          return { moduleId: module.id, lesson }
        }
        if (lesson.id === currentLesson?.id) {
          foundCurrent = true
        }
      }
    }
    return null
  }

  const getPreviousLesson = (): { moduleId: number; lesson: Lesson } | null => {
    let prevLesson: { moduleId: number; lesson: Lesson } | null = null
    
    for (const module of modules) {
      for (const lesson of module.lessons) {
        if (lesson.id === currentLesson?.id) {
          return prevLesson
        }
        prevLesson = { moduleId: module.id, lesson }
      }
    }
    return null
  }

  const goToNextLesson = () => {
    const next = getNextLesson()
    if (next) {
      navigate(`/courses/${courseId}/lessons/${next.lesson.id}`)
    }
  }

  const goToPreviousLesson = () => {
    const prev = getPreviousLesson()
    if (prev) {
      navigate(`/courses/${courseId}/lessons/${prev.lesson.id}`)
    }
  }

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'VIDEO': return <Video className="h-4 w-4" />
      case 'TEXT': return <FileText className="h-4 w-4" />
      case 'QUIZ': return <CheckCircle className="h-4 w-4" />
      default: return <BookOpen className="h-4 w-4" />
    }
  }

  const getCompletedLessonsCount = () => {
    return modules.reduce((count, module) => 
      count + module.lessons.filter(l => l.isCompleted).length, 0
    )
  }

  const getTotalLessonsCount = () => {
    return modules.reduce((count, module) => count + module.lessons.length, 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lesson...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!currentLesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Lesson Not Found</h2>
          <p className="text-gray-600 mb-6">The lesson you're looking for doesn't exist.</p>
          <Link
            to={ROUTES.COURSE_DETAIL(courseId!)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Back to Course
          </Link>
        </div>
      </div>
    )
  }

  const nextLesson = getNextLesson()
  const prevLesson = getPreviousLesson()
  const completedCount = getCompletedLessonsCount()
  const totalCount = getTotalLessonsCount()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to={ROUTES.COURSE_DETAIL(courseId!)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="hidden sm:inline">Back to Course</span>
              </Link>
              <div className="hidden md:block">
                <h1 className="text-lg font-semibold text-gray-900 truncate max-w-md">
                  {course?.title}
                </h1>
                <p className="text-sm text-gray-600">
                  by {course?.instructor.firstName} {course?.instructor.lastName}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{completedCount}</span> / {totalCount} lessons
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2 hidden sm:block">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${enrollment?.progress || 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Main Content */}
        <div className={`flex-1 transition-all ${showSidebar ? 'mr-80' : ''}`}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Video Player or Content */}
            {currentLesson.type === 'VIDEO' && currentLesson.videoUrl ? (
              <div className="bg-black rounded-lg overflow-hidden mb-6">
                <div className="aspect-video">
                  {currentLesson.videoUrl.includes('youtube.com') || currentLesson.videoUrl.includes('youtu.be') ? (
                    <iframe
                      src={currentLesson.videoUrl.replace('watch?v=', 'embed/')}
                      className="w-full h-full"
                      allowFullScreen
                      title={currentLesson.title}
                    />
                  ) : (
                    <video
                      src={currentLesson.videoUrl}
                      controls
                      className="w-full h-full"
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-8 mb-6">
                <div className="flex items-center gap-4 text-white">
                  {getLessonIcon(currentLesson.type)}
                  <div>
                    <p className="text-sm opacity-90">
                      {currentLesson.type.charAt(0) + currentLesson.type.slice(1).toLowerCase()}
                    </p>
                    <h2 className="text-2xl font-bold">{currentLesson.title}</h2>
                  </div>
                </div>
              </div>
            )}

            {/* Lesson Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {currentLesson.isCompleted ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <Circle className="h-6 w-6 text-gray-400" />
                    )}
                    <h1 className="text-2xl font-bold text-gray-900">
                      {currentLesson.title}
                    </h1>
                  </div>
                  {currentLesson.durationMinutes && (
                    <p className="text-sm text-gray-600">
                      Duration: {currentLesson.durationMinutes} minutes
                    </p>
                  )}
                </div>
                
                {!currentLesson.isCompleted && (
                  <button
                    onClick={markLessonComplete}
                    disabled={markingComplete}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <CheckCircle className="h-5 w-5" />
                    {markingComplete ? 'Marking...' : 'Mark as Complete'}
                  </button>
                )}
              </div>

              {/* Lesson Content */}
              <div className="prose max-w-none">
                <div className="text-gray-700 whitespace-pre-wrap">
                  {currentLesson.content}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-6 mt-6 border-t border-gray-200">
                <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <ThumbsUp className="h-4 w-4" />
                  Like
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <Download className="h-4 w-4" />
                  Resources
                </button>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <button
                onClick={goToPreviousLesson}
                disabled={!prevLesson}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="hidden sm:inline">Previous Lesson</span>
              </button>
              
              <button
                onClick={goToNextLesson}
                disabled={!nextLesson}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span className="hidden sm:inline">Next Lesson</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Discussion Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Discussion
              </h3>
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No discussions yet. Be the first to ask a question!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Course Content */}
        {showSidebar && (
          <div className="fixed right-0 top-16 bottom-0 w-80 bg-white border-l border-gray-200 overflow-y-auto">
            <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h3 className="font-semibold text-gray-900">Course Content</h3>
              <p className="text-sm text-gray-600 mt-1">
                {completedCount} of {totalCount} lessons completed
              </p>
            </div>
            
            <div className="p-4">
              {modules.map((module, moduleIndex) => (
                <div key={module.id} className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    {moduleIndex + 1}. {module.title}
                  </h4>
                  <div className="space-y-1">
                    {module.lessons.map((lesson) => (
                      <Link
                        key={lesson.id}
                        to={`/courses/${courseId}/lessons/${lesson.id}`}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          lesson.id === currentLesson.id
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {lesson.isCompleted ? (
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        ) : lesson.isFree ? (
                          <Play className="h-4 w-4 flex-shrink-0" />
                        ) : (
                          <Lock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">{lesson.title}</p>
                          {lesson.durationMinutes && (
                            <p className="text-xs text-gray-500">
                              {lesson.durationMinutes} min
                            </p>
                          )}
                        </div>
                        {getLessonIcon(lesson.type)}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sidebar Toggle */}
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="fixed right-4 top-20 z-20 p-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          {showSidebar ? (
            <ChevronRight className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>
    </div>
  )
}
