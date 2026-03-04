import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LogoImg from '../accesory/picture/StudyMate 1.png'
import { NavItem } from './StudentHome'

const CourseCard: React.FC<{
  course: any
}> = ({ course }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group p-5">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-48 aspect-video bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
          {course.thumbnailUrl ? (
            <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <i className="fa-solid fa-book text-3xl"></i>
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#1976d2] transition-colors">{course.title}</h3>
              <p className="mt-1 text-sm text-slate-500 line-clamp-2">{course.description || 'No description provided.'}</p>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
              course.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
            }`}>
              {course.status === 'active' ? 'Published' : 'Draft'}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <i className="fa-solid fa-users text-slate-400"></i>
              <span>{course.totalEnrollments || 0} students enrolled</span>
            </div>
            <div className="flex items-center gap-1.5">
              <i className="fa-solid fa-star text-yellow-500"></i>
              <span>{course.averageRating || 0} (12 reviews)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <i className="fa-solid fa-clock text-slate-400"></i>
              <span>Last updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button className="bg-[#1976d2] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#1565c0] transition-colors">
              Edit Course
            </button>
            <button className="border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors">
              View Analytics
            </button>
            <button className="ml-auto text-red-500 hover:text-red-700 text-sm font-semibold">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const TeacherCourses: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [courses, setCourses] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState('')

  React.useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) return

        const response = await fetch('https://localhost:7259/api/Course/my-courses', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.ok) {
          const result = await response.json()
          if (result && result.data) {
            setCourses(result.data)
          }
        }
      } catch (error) {
        console.error('Failed to fetch courses:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3">
              <img src={LogoImg} alt="StudyMate" className="h-9 w-auto" />
              <span className="text-xl font-bold text-[#1976d2]">StudyMate</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <NavItem to="/">Home</NavItem>
              <NavItem to="/courses">Courses</NavItem>
              <NavItem>AI Tutor</NavItem>
              <NavItem>Game</NavItem>
              <NavItem>Community</NavItem>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/profile" className="flex items-center gap-3 group">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-bold text-slate-900">{user?.fullName || 'Teacher'}</span>
                <span className="text-[10px] text-slate-500 font-medium bg-slate-100 px-1.5 py-0.5 rounded">Lecturer</span>
              </div>
              <div className="h-9 w-9 rounded-full bg-[#1976d2] flex items-center justify-center text-white font-bold ring-2 ring-white ring-offset-1">
                {user?.fullName?.charAt(0).toUpperCase() || 'T'}
              </div>
            </Link>
            <button 
              onClick={async () => {
                await logout()
                navigate('/')
              }} 
              className="text-slate-500 hover:text-red-600"
            >
              <i className="fa-solid fa-right-from-bracket text-lg"></i>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Course Management</h1>
            <p className="text-slate-500 mt-1">Create, edit, and manage your educational content</p>
          </div>
          <Link 
            to="/create-new-course"
            className="bg-[#1976d2] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-[#1565c0] transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <i className="fa-solid fa-plus"></i> Create New Course
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-8">
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input 
              type="text" 
              placeholder="Search your courses by title..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1976d2]/20 focus:border-[#1976d2] transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin h-10 w-10 border-4 border-[#1976d2] border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-500 font-medium">Loading your courses...</p>
            </div>
          ) : filteredCourses.length > 0 ? (
            filteredCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
              <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fa-solid fa-book-open text-3xl text-slate-300"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900">No courses found</h3>
              <p className="text-slate-500 mt-2">
                {searchTerm ? 'Try adjusting your search term' : "You haven't created any courses yet."}
              </p>
              {!searchTerm && (
                <Link 
                  to="/create-new-course" 
                  className="mt-6 inline-block bg-[#1976d2] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-[#1565c0]"
                >
                  Create Your First Course
                </Link>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default TeacherCourses
