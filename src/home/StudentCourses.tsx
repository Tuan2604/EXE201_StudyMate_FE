import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import MainHeader from '../components/MainHeader'

interface Course {
  id: number
  title: string
  description: string
  categoryName: string
  thumbnailUrl?: string
  totalEnrollments: number
  teacherName: string
  providerLogo?: string
}

const normalizeCourse = (raw: any): Course => {
  return {
    id: raw.id,
    title: raw.title || '',
    description: raw.description || '',
    categoryName: raw.categoryName || '',
    thumbnailUrl: undefined,
    totalEnrollments: Number(raw.totalEnrollments ?? 0),
    teacherName: raw.teacherName || '',
    providerLogo: raw.teacherAvatar || undefined,
  }
}

const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
  return (
    <Link to={`/courses/${course.id}`} className="flex flex-col h-full bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* Thumbnail Area */}
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
        {course.thumbnailUrl ? (
          <img 
            src={course.thumbnailUrl} 
            alt={course.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <i className="fa-solid fa-image text-3xl"></i>
          </div>
        )}
        
        {/* Provider Logo Overlay */}
        {course.providerLogo && (
          <div className="absolute bottom-3 left-3 h-10 w-10 bg-white p-1.5 rounded shadow-sm">
            <img src={course.providerLogo} alt={course.teacherName || course.title} className="h-full w-full object-contain" />
          </div>
        )}
        
      </div>

      {/* Content Area */}
      <div className="flex-1 p-5 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            {course.teacherName || 'Unknown Teacher'}
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-[#1976d2] transition-colors line-clamp-2 min-h-[3.5rem]">
          {course.title}
        </h3>

        <div className="mt-2 mb-4">
          <span className="inline-flex items-center rounded bg-slate-100 text-slate-600 text-[11px] px-2.5 py-1 font-medium">
            {course.categoryName || 'Uncategorized'}
          </span>
        </div>

        <div className="mt-auto space-y-3">
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
            <div className="flex items-center gap-1 text-slate-500">
              <i className="fa-solid fa-layer-group"></i>
              <span>{course.categoryName || 'Uncategorized'}</span>
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-1">
              <i className="fa-solid fa-user-group"></i>
              <span>{course.totalEnrollments} enrolled</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

const StudentCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('https://localhost:7259/api/Course/all')
        if (response.ok) {
          const result = await response.json()
          const apiData = Array.isArray(result?.data) ? result.data : []
          setCourses(apiData.map(normalizeCourse))
        } else {
          setCourses([])
        }
      } catch (error) {
        console.error('Failed to fetch courses:', error)
        setCourses([])
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const filteredCourses = courses.filter(course => {
    const keyword = searchTerm.trim().toLowerCase()

    if (!keyword) return true

    return course.title.toLowerCase().includes(keyword) ||
      course.categoryName.toLowerCase().includes(keyword)
  })

  return (
    <div className="min-h-screen bg-white">
      <MainHeader />

      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex flex-col gap-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">All Courses</h2>
                <p className="text-sm text-slate-500 font-medium">Showing {filteredCourses.length} results</p>
              </div>

              <div className="relative w-full lg:max-w-md">
                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by course name or category..."
                  className="w-full rounded-xl border border-slate-300 bg-white pl-11 pr-10 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1976d2]/20 focus:border-[#1976d2]"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label="Clear search"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white rounded-lg border border-slate-200 h-[400px] animate-pulse">
                    <div className="aspect-[16/9] bg-slate-100"></div>
                    <div className="p-5 space-y-4">
                      <div className="h-3 bg-slate-100 rounded w-1/4"></div>
                      <div className="h-6 bg-slate-100 rounded w-3/4"></div>
                      <div className="space-y-2 pt-2">
                        <div className="h-3 bg-slate-100 rounded w-full"></div>
                        <div className="h-3 bg-slate-100 rounded w-5/6"></div>
                      </div>
                      <div className="flex justify-between pt-6">
                        <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                        <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredCourses.map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <i className="fa-solid fa-magnifying-glass text-3xl text-slate-300"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-900">We couldn't find any matches</h3>
                <p className="text-slate-500 mt-2 max-w-xs mx-auto">Try searching with a different course name or category.</p>
                <button 
                  onClick={() => setSearchTerm('')}
                  className="mt-6 bg-[#1976d2] text-white px-6 py-2.5 rounded-md font-bold hover:bg-[#145ca5] transition-colors"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 mt-20">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <p className="text-sm text-slate-600">StudyMate - Nền tảng học tập thông minh dành cho bạn.</p>
            <div className="flex items-center gap-5 text-sm">
              <Link to="/courses" className="text-slate-500 hover:text-[#1976d2] transition-colors">Courses</Link>
              <Link to="/community" className="text-slate-500 hover:text-[#1976d2] transition-colors">Community</Link>
              <Link to="/membership" className="text-slate-500 hover:text-[#1976d2] transition-colors">Membership</Link>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-200 text-xs text-slate-500 text-center md:text-left">
            © 2026 StudyMate. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default StudentCourses
