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

      {/* Footer Area - Minimal Coursera style */}
      <footer className="bg-[#f5f5f5] border-t border-slate-200 mt-20">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
            <div>
              <h5 className="font-bold text-slate-900 mb-5">StudyMate</h5>
              <ul className="space-y-3 text-sm text-slate-600">
                <li><a href="#" className="hover:text-[#1976d2]">About</a></li>
                <li><a href="#" className="hover:text-[#1976d2]">What we offer</a></li>
                <li><a href="#" className="hover:text-[#1976d2]">Leadership</a></li>
                <li><a href="#" className="hover:text-[#1976d2]">Careers</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-slate-900 mb-5">Community</h5>
              <ul className="space-y-3 text-sm text-slate-600">
                <li><a href="#" className="hover:text-[#1976d2]">Learners</a></li>
                <li><a href="#" className="hover:text-[#1976d2]">Partners</a></li>
                <li><a href="#" className="hover:text-[#1976d2]">Developers</a></li>
                <li><a href="#" className="hover:text-[#1976d2]">Beta Testers</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-slate-900 mb-5">More</h5>
              <ul className="space-y-3 text-sm text-slate-600">
                <li><a href="#" className="hover:text-[#1976d2]">Press</a></li>
                <li><a href="#" className="hover:text-[#1976d2]">Investors</a></li>
                <li><a href="#" className="hover:text-[#1976d2]">Terms</a></li>
                <li><a href="#" className="hover:text-[#1976d2]">Privacy</a></li>
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
              <h5 className="font-bold text-slate-900 mb-5">Mobile App</h5>
              <div className="flex flex-col gap-3">
                <div className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-3 cursor-pointer">
                  <i className="fa-brands fa-apple text-2xl"></i>
                  <div className="leading-tight">
                    <p className="text-[10px] uppercase">Download on the</p>
                    <p className="text-sm font-bold">App Store</p>
                  </div>
                </div>
                <div className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-3 cursor-pointer">
                  <i className="fa-brands fa-google-play text-xl"></i>
                  <div className="leading-tight">
                    <p className="text-[10px] uppercase">Get it on</p>
                    <p className="text-sm font-bold">Google Play</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs text-slate-500">© 2025 StudyMate Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <i className="fa-brands fa-facebook text-slate-400 hover:text-[#1976d2] cursor-pointer"></i>
              <i className="fa-brands fa-linkedin text-slate-400 hover:text-[#1976d2] cursor-pointer"></i>
              <i className="fa-brands fa-twitter text-slate-400 hover:text-[#1976d2] cursor-pointer"></i>
              <i className="fa-brands fa-youtube text-slate-400 hover:text-[#1976d2] cursor-pointer"></i>
              <i className="fa-brands fa-instagram text-slate-400 hover:text-[#1976d2] cursor-pointer"></i>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default StudentCourses
