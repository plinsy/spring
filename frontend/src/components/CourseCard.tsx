import { Link } from 'react-router-dom'
import { Star, Users, Clock } from 'lucide-react'
import type { Course } from '../types'

interface CourseCardProps {
  course: Course
}

export default function CourseCard({ course }: CourseCardProps) {
  const formatDuration = (minutes?: number) => {
    if (!minutes) return 'N/A'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const formatPrice = (price: number) => {
    return price === 0 ? 'Free' : `$${price.toFixed(2)}`
  }

  return (
    <Link
      to={`/courses/${course.id}`}
      className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
    >
      {/* Thumbnail */}
      <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
        {course.thumbnailUrl ? (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-white text-4xl font-bold opacity-50">
              {course.title.charAt(0)}
            </span>
          </div>
        )}
        {/* Level Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
            course.level === 'BEGINNER' ? 'bg-green-500' :
            course.level === 'INTERMEDIATE' ? 'bg-yellow-500' :
            'bg-red-500'
          }`}>
            {course.level}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <div className="text-sm text-blue-600 font-medium mb-2">
          {course.categories[0]?.name}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {course.title}
        </h3>

        {/* Short Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {course.shortDescription || course.description}
        </p>

        {/* Instructor */}
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600">
            {course.instructor.firstName.charAt(0)}
          </div>
          <span className="ml-2 text-sm text-gray-700">
            {course.instructor.firstName} {course.instructor.lastName}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-4">
            {course.averageRating !== undefined && course.averageRating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{course.averageRating.toFixed(1)}</span>
              </div>
            )}
            {course.totalEnrollments !== undefined && (
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{course.totalEnrollments}</span>
              </div>
            )}
            {course.duration && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(course.duration)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <span className="text-2xl font-bold text-gray-900">
            {formatPrice(course.price)}
          </span>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
            View Details
          </button>
        </div>
      </div>
    </Link>
  )
}
