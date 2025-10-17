import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Search, Filter, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { courseApi, categoryApi } from '../services/courseService'
import type { CourseFilters } from '../services/courseService'
import CourseCard from '../components/CourseCard'

export default function CoursesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  
  // Filter states
  const [filters, setFilters] = useState<CourseFilters>({
    search: searchParams.get('search') || '',
    categoryId: searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : undefined,
    level: (searchParams.get('level') as CourseFilters['level']) || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 0,
    size: 12,
    sort: 'createdAt,desc',
    published: true,
  })

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryApi.getCategories,
  })

  // Fetch courses
  const { data: coursesData, isLoading, error } = useQuery({
    queryKey: ['courses', filters],
    queryFn: () => courseApi.getCourses(filters),
  })

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (filters.search) params.set('search', filters.search)
    if (filters.categoryId) params.set('categoryId', filters.categoryId.toString())
    if (filters.level) params.set('level', filters.level)
    if (filters.minPrice !== undefined) params.set('minPrice', filters.minPrice.toString())
    if (filters.maxPrice !== undefined) params.set('maxPrice', filters.maxPrice.toString())
    if (filters.page) params.set('page', filters.page.toString())
    setSearchParams(params)
  }, [filters, setSearchParams])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value, page: 0 }))
  }

  const handleCategoryChange = (categoryId: number | undefined) => {
    setFilters(prev => ({ ...prev, categoryId, page: 0 }))
  }

  const handleLevelChange = (level: CourseFilters['level']) => {
    setFilters(prev => ({ ...prev, level, page: 0 }))
  }

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = value ? Number(value) : undefined
    setFilters(prev => ({
      ...prev,
      [type === 'min' ? 'minPrice' : 'maxPrice']: numValue,
      page: 0,
    }))
  }

  const handleSortChange = (sort: string) => {
    setFilters(prev => ({ ...prev, sort, page: 0 }))
  }

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      categoryId: undefined,
      level: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      page: 0,
      size: 12,
      sort: 'createdAt,desc',
      published: true,
    })
  }

  const hasActiveFilters = filters.categoryId || filters.level || filters.minPrice !== undefined || filters.maxPrice !== undefined

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Explore Courses</h1>
          <p className="text-lg text-blue-100">
            Discover and enroll in courses that help you achieve your goals
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Category</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      checked={!filters.categoryId}
                      onChange={() => handleCategoryChange(undefined)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">All Categories</span>
                  </label>
                  {categories.map(category => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        checked={filters.categoryId === category.id}
                        onChange={() => handleCategoryChange(category.id)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Level Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Level</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="level"
                      checked={!filters.level}
                      onChange={() => handleLevelChange(undefined)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">All Levels</span>
                  </label>
                  {['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map(level => (
                    <label key={level} className="flex items-center">
                      <input
                        type="radio"
                        name="level"
                        checked={filters.level === level}
                        onChange={() => handleLevelChange(level as CourseFilters['level'])}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 capitalize">
                        {level.toLowerCase()}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Price Range</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Min Price</label>
                    <input
                      type="number"
                      min="0"
                      value={filters.minPrice || ''}
                      onChange={(e) => handlePriceChange('min', e.target.value)}
                      placeholder="$0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Max Price</label>
                    <input
                      type="number"
                      min="0"
                      value={filters.maxPrice || ''}
                      onChange={(e) => handlePriceChange('max', e.target.value)}
                      placeholder="Any"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Search and Sort Bar */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={filters.search}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Filter className="w-5 h-5" />
                  <span>Filters</span>
                </button>

                {/* Sort Dropdown */}
                <select
                  value={filters.sort}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="createdAt,desc">Newest First</option>
                  <option value="createdAt,asc">Oldest First</option>
                  <option value="title,asc">Title (A-Z)</option>
                  <option value="title,desc">Title (Z-A)</option>
                  <option value="price,asc">Price (Low to High)</option>
                  <option value="price,desc">Price (High to Low)</option>
                  <option value="enrollmentCount,desc">Most Popular</option>
                </select>
              </div>

              {/* Active Filters Summary */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {filters.categoryId && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {categories.find(c => c.id === filters.categoryId)?.name}
                      <button onClick={() => handleCategoryChange(undefined)}>
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  )}
                  {filters.level && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm capitalize">
                      {filters.level.toLowerCase()}
                      <button onClick={() => handleLevelChange(undefined)}>
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  )}
                  {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      ${filters.minPrice || 0} - ${filters.maxPrice || '∞'}
                      <button onClick={() => {
                        setFilters(prev => ({ ...prev, minPrice: undefined, maxPrice: undefined, page: 0 }))
                      }}>
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Filter Panel */}
            {isFilterOpen && (
              <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsFilterOpen(false)}>
                <div 
                  className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-xl p-6 overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                    <button onClick={() => setIsFilterOpen(false)}>
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Same filter content as desktop sidebar */}
                  <div className="space-y-6">
                    {/* Category */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Category</h3>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="category-mobile"
                            checked={!filters.categoryId}
                            onChange={() => handleCategoryChange(undefined)}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">All Categories</span>
                        </label>
                        {categories.map(category => (
                          <label key={category.id} className="flex items-center">
                            <input
                              type="radio"
                              name="category-mobile"
                              checked={filters.categoryId === category.id}
                              onChange={() => handleCategoryChange(category.id)}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">{category.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Level */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Level</h3>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="level-mobile"
                            checked={!filters.level}
                            onChange={() => handleLevelChange(undefined)}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">All Levels</span>
                        </label>
                        {['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map(level => (
                          <label key={level} className="flex items-center">
                            <input
                              type="radio"
                              name="level-mobile"
                              checked={filters.level === level}
                              onChange={() => handleLevelChange(level as CourseFilters['level'])}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700 capitalize">
                              {level.toLowerCase()}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Price */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Price Range</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-gray-600 mb-1 block">Min Price</label>
                          <input
                            type="number"
                            min="0"
                            value={filters.minPrice || ''}
                            onChange={(e) => handlePriceChange('min', e.target.value)}
                            placeholder="$0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600 mb-1 block">Max Price</label>
                          <input
                            type="number"
                            min="0"
                            value={filters.maxPrice || ''}
                            onChange={(e) => handlePriceChange('max', e.target.value)}
                            placeholder="Any"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t">
                      <button
                        onClick={clearFilters}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Clear All
                      </button>
                      <button
                        onClick={() => setIsFilterOpen(false)}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-600 font-medium">Failed to load courses</p>
                <p className="text-red-500 text-sm mt-1">Please try again later</p>
              </div>
            )}

            {/* Results */}
            {coursesData && !isLoading && (
              <>
                {/* Results Count */}
                <div className="mb-4 text-sm text-gray-600">
                  Showing {coursesData.content.length} of {coursesData.totalElements} courses
                </div>

                {/* Empty State */}
                {coursesData.content.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <div className="text-gray-400 mb-4">
                      <Search className="w-16 h-16 mx-auto" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No courses found</h3>
                    <p className="text-gray-600 mb-6">
                      Try adjusting your filters or search terms
                    </p>
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    {/* Course Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                      {coursesData.content.map(course => (
                        <CourseCard key={course.id} course={course} />
                      ))}
                    </div>

                    {/* Pagination */}
                    {coursesData.totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handlePageChange(filters.page! - 1)}
                          disabled={coursesData.first}
                          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>

                        <div className="flex gap-2">
                          {Array.from({ length: coursesData.totalPages }, (_, i) => {
                            // Show first page, last page, current page, and pages around current
                            const showPage = 
                              i === 0 || 
                              i === coursesData.totalPages - 1 || 
                              Math.abs(i - filters.page!) <= 1

                            if (!showPage) {
                              // Show ellipsis
                              if (i === filters.page! - 2 || i === filters.page! + 2) {
                                return <span key={i} className="px-3 py-2">...</span>
                              }
                              return null
                            }

                            return (
                              <button
                                key={i}
                                onClick={() => handlePageChange(i)}
                                className={`px-4 py-2 rounded-lg border ${
                                  i === filters.page
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'border-gray-300 hover:bg-gray-50'
                                }`}
                              >
                                {i + 1}
                              </button>
                            )
                          })}
                        </div>

                        <button
                          onClick={() => handlePageChange(filters.page! + 1)}
                          disabled={coursesData.last}
                          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
