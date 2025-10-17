import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Video,
  FileText,
  CheckSquare,
  Link as LinkIcon
} from 'lucide-react'
import api from '../lib/axios'
import { Alert, AlertDescription } from '../components/ui/alert'

interface Module {
  id?: number
  title: string
  description: string
  orderIndex: number
  lessons: Lesson[]
}

interface Lesson {
  id?: number
  title: string
  type: 'VIDEO' | 'TEXT' | 'QUIZ' | 'ASSIGNMENT' | 'RESOURCE'
  content: string
  videoUrl?: string
  durationMinutes?: number
  isFree: boolean
  orderIndex: number
}

export default function CourseEditorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const isEditMode = Boolean(id)

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    thumbnailUrl: '',
    level: 'BEGINNER',
    price: 0,
    isPublished: false,
    categoryIds: [] as number[],
  })

  const [modules, setModules] = useState<Module[]>([])
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set([0]))
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    fetchCategories()
    if (isEditMode) {
      fetchCourseData()
    }
  }, [id])

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories')
      setCategories(response.data.data || [])
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }

  const fetchCourseData = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/courses/${id}`)
      const course = response.data.data
      
      setCourseData({
        title: course.title,
        description: course.description,
        thumbnailUrl: course.thumbnailUrl || '',
        level: course.level,
        price: course.price,
        isPublished: course.isPublished,
        categoryIds: course.categories?.map((c: any) => c.id) || [],
      })

      // Fetch modules and lessons
      const modulesRes = await api.get(`/courses/${id}/modules`)
      setModules(modulesRes.data.data || [])
      
    } catch (err) {
      console.error('Failed to fetch course:', err)
      setError('Failed to load course data')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveCourse = async () => {
    if (!courseData.title.trim()) {
      setError('Course title is required')
      return
    }

    if (!courseData.description.trim()) {
      setError('Course description is required')
      return
    }

    try {
      setSaving(true)
      setError('')
      
      const coursePayload = {
        ...courseData,
        instructorId: user?.id,
      }

      let courseId = id

      if (isEditMode) {
        await api.put(`/courses/${id}`, coursePayload)
      } else {
        const response = await api.post('/courses', coursePayload)
        courseId = response.data.data.id
      }

      // Save modules and lessons
      for (const module of modules) {
        const modulePayload = {
          title: module.title,
          description: module.description,
          orderIndex: module.orderIndex,
          courseId,
        }

        let moduleId = module.id

        if (module.id) {
          await api.put(`/modules/${module.id}`, modulePayload)
        } else {
          const moduleRes = await api.post('/modules', modulePayload)
          moduleId = moduleRes.data.data.id
        }

        // Save lessons
        for (const lesson of module.lessons) {
          const lessonPayload = {
            title: lesson.title,
            type: lesson.type,
            content: lesson.content,
            videoUrl: lesson.videoUrl,
            durationMinutes: lesson.durationMinutes,
            isFree: lesson.isFree,
            orderIndex: lesson.orderIndex,
            moduleId,
          }

          if (lesson.id) {
            await api.put(`/lessons/${lesson.id}`, lessonPayload)
          } else {
            await api.post('/lessons', lessonPayload)
          }
        }
      }

      setSuccess(isEditMode ? 'Course updated successfully!' : 'Course created successfully!')
      
      setTimeout(() => {
        navigate('/instructor/dashboard')
      }, 1500)
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save course')
    } finally {
      setSaving(false)
    }
  }

  const addModule = () => {
    setModules([
      ...modules,
      {
        title: '',
        description: '',
        orderIndex: modules.length,
        lessons: [],
      },
    ])
    setExpandedModules(new Set([...expandedModules, modules.length]))
  }

  const removeModule = (index: number) => {
    if (window.confirm('Are you sure you want to delete this module?')) {
      setModules(modules.filter((_, i) => i !== index))
    }
  }

  const updateModule = (index: number, field: string, value: any) => {
    const updated = [...modules]
    updated[index] = { ...updated[index], [field]: value }
    setModules(updated)
  }

  const addLesson = (moduleIndex: number) => {
    const updated = [...modules]
    updated[moduleIndex].lessons.push({
      title: '',
      type: 'VIDEO',
      content: '',
      isFree: false,
      orderIndex: updated[moduleIndex].lessons.length,
    })
    setModules(updated)
  }

  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      const updated = [...modules]
      updated[moduleIndex].lessons = updated[moduleIndex].lessons.filter((_, i) => i !== lessonIndex)
      setModules(updated)
    }
  }

  const updateLesson = (moduleIndex: number, lessonIndex: number, field: string, value: any) => {
    const updated = [...modules]
    updated[moduleIndex].lessons[lessonIndex] = {
      ...updated[moduleIndex].lessons[lessonIndex],
      [field]: value,
    }
    setModules(updated)
  }

  const toggleModule = (index: number) => {
    const newExpanded = new Set(expandedModules)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedModules(newExpanded)
  }

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'VIDEO': return <Video className="h-4 w-4" />
      case 'TEXT': return <FileText className="h-4 w-4" />
      case 'QUIZ': return <CheckSquare className="h-4 w-4" />
      case 'ASSIGNMENT': return <FileText className="h-4 w-4" />
      case 'RESOURCE': return <LinkIcon className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  if (user?.role !== 'INSTRUCTOR') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Only instructors can create or edit courses.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course editor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/instructor/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isEditMode ? 'Edit Course' : 'Create New Course'}
              </h1>
              <p className="mt-2 text-gray-600">
                {isEditMode ? 'Update your course information' : 'Fill in the details to create your course'}
              </p>
            </div>
            
            <button
              onClick={handleSaveCourse}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  {isEditMode ? 'Update Course' : 'Create Course'}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert variant="success" className="mb-6">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Course Basic Info */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Title *
              </label>
              <input
                type="text"
                value={courseData.title}
                onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                placeholder="e.g., Complete Web Development Bootcamp"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Description *
              </label>
              <textarea
                value={courseData.description}
                onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                placeholder="Describe what students will learn in this course..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Level
                </label>
                <select
                  value={courseData.level}
                  onChange={(e) => setCourseData({ ...courseData, level: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                  <option value="EXPERT">Expert</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($)
                </label>
                <input
                  type="number"
                  value={courseData.price}
                  onChange={(e) => setCourseData({ ...courseData, price: parseFloat(e.target.value) || 0 })}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={courseData.isPublished ? 'published' : 'draft'}
                  onChange={(e) => setCourseData({ ...courseData, isPublished: e.target.value === 'published' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail URL
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={courseData.thumbnailUrl}
                  onChange={(e) => setCourseData({ ...courseData, thumbnailUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Upload className="h-4 w-4" />
                  Upload
                </button>
              </div>
              {courseData.thumbnailUrl && (
                <img
                  src={courseData.thumbnailUrl}
                  alt="Thumbnail preview"
                  className="mt-3 w-48 h-28 object-cover rounded-lg border border-gray-200"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categories
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={courseData.categoryIds.includes(category.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCourseData({
                            ...courseData,
                            categoryIds: [...courseData.categoryIds, category.id],
                          })
                        } else {
                          setCourseData({
                            ...courseData,
                            categoryIds: courseData.categoryIds.filter(id => id !== category.id),
                          })
                        }
                      }}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">{category.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Course Curriculum */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Course Curriculum</h2>
            <button
              onClick={addModule}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Module
            </button>
          </div>

          {modules.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No modules yet</h3>
              <p className="text-gray-600 mb-6">Start building your course by adding modules and lessons</p>
              <button
                onClick={addModule}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                Add First Module
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {modules.map((module, moduleIndex) => (
                <div key={moduleIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Module Header */}
                  <div className="bg-gray-50 p-4">
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                      <button
                        onClick={() => toggleModule(moduleIndex)}
                        className="flex-1 flex items-center justify-between text-left"
                      >
                        <div className="flex-1">
                          <input
                            type="text"
                            value={module.title}
                            onChange={(e) => updateModule(moduleIndex, 'title', e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            placeholder="Module Title"
                            className="w-full font-semibold text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1"
                          />
                          <input
                            type="text"
                            value={module.description}
                            onChange={(e) => updateModule(moduleIndex, 'description', e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            placeholder="Module Description"
                            className="w-full text-sm text-gray-600 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 mt-1"
                          />
                        </div>
                        {expandedModules.has(moduleIndex) ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                      <button
                        onClick={() => removeModule(moduleIndex)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Module Content (Lessons) */}
                  {expandedModules.has(moduleIndex) && (
                    <div className="p-4">
                      {module.lessons.length === 0 ? (
                        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                          <p className="text-gray-500 text-sm mb-3">No lessons in this module</p>
                          <button
                            onClick={() => addLesson(moduleIndex)}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                            Add Lesson
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <div key={lessonIndex} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg bg-white">
                              <div className="flex items-center gap-2 flex-shrink-0">
                                {getLessonIcon(lesson.type)}
                                <span className="text-xs text-gray-500">{lessonIndex + 1}</span>
                              </div>
                              
                              <div className="flex-1 space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <input
                                    type="text"
                                    value={lesson.title}
                                    onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'title', e.target.value)}
                                    placeholder="Lesson Title"
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                  />
                                  <select
                                    value={lesson.type}
                                    onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'type', e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                  >
                                    <option value="VIDEO">Video</option>
                                    <option value="TEXT">Text</option>
                                    <option value="QUIZ">Quiz</option>
                                    <option value="ASSIGNMENT">Assignment</option>
                                    <option value="RESOURCE">Resource</option>
                                  </select>
                                </div>

                                {lesson.type === 'VIDEO' && (
                                  <input
                                    type="text"
                                    value={lesson.videoUrl || ''}
                                    onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'videoUrl', e.target.value)}
                                    placeholder="Video URL (YouTube, Vimeo, etc.)"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                  />
                                )}

                                <textarea
                                  value={lesson.content}
                                  onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'content', e.target.value)}
                                  placeholder="Lesson content or description"
                                  rows={2}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                />

                                <div className="flex items-center gap-4">
                                  <label className="flex items-center gap-2 text-sm text-gray-700">
                                    <input
                                      type="checkbox"
                                      checked={lesson.isFree}
                                      onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'isFree', e.target.checked)}
                                      className="rounded text-blue-600 focus:ring-blue-500"
                                    />
                                    Free Preview
                                  </label>
                                  <input
                                    type="number"
                                    value={lesson.durationMinutes || ''}
                                    onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'durationMinutes', parseInt(e.target.value) || 0)}
                                    placeholder="Duration (min)"
                                    className="w-32 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                  />
                                </div>
                              </div>

                              <button
                                onClick={() => removeLesson(moduleIndex, lessonIndex)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <button
                        onClick={() => addLesson(moduleIndex)}
                        className="mt-3 flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors w-full justify-center"
                      >
                        <Plus className="h-4 w-4" />
                        Add Lesson
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Save Button (Bottom) */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => navigate('/instructor/dashboard')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveCourse}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                {isEditMode ? 'Update Course' : 'Create Course'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
