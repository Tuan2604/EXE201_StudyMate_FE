import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCourse } from '../contexts/CourseContext'
import LogoImg from '../accesory/picture/StudyMate 1.png'

const NavItem: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <a
      href="#"
      className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
    >
      {children}
    </a>
  )
}

const Step: React.FC<{
  number: number
  title: string
  active?: boolean
  completed?: boolean
}> = ({ number, title, active = false, completed = false }) => {
  return (
    <div className="flex flex-col items-center relative z-10">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
          active
            ? 'bg-[#1976d2] text-white ring-4 ring-blue-100'
            : completed
            ? 'bg-green-500 text-white'
            : 'bg-slate-200 text-slate-500'
        }`}
      >
        {completed ? <i className="fa-solid fa-check"></i> : number}
      </div>
      <div
        className={`mt-2 text-[10px] font-medium uppercase tracking-wide ${
          active ? 'text-[#1976d2]' : 'text-slate-500'
        }`}
      >
        {title}
      </div>
    </div>
  )
}

const CreateNewCourse: React.FC = () => {
  const { user, logout } = useAuth()
  const { courseData, updateCourseData } = useCourse()
  const currentStep: number = 1
  const [categories, setCategories] = useState<any[]>([])

  React.useEffect(() => {
    // Fetch categories from API
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://localhost:7259/api/Category/all')
        if (response.ok) {
          const result = await response.json()
          if (result && result.data) {
            setCategories(result.data)
          }
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }
    fetchCategories()
  }, [])

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Top nav - Simplified Version */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4">
          <div className="h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img
                src={LogoImg}
                alt="StudyMate Logo"
                className="h-10 w-auto object-contain"
              />
              <span className="text-xl font-semibold tracking-tight text-[#1976d2]">
                StudyMate
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-7">
              <Link to="/" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                Home
              </Link>
              <NavItem>Courses</NavItem>
              <NavItem>AI Tutor</NavItem>
              <NavItem>Game</NavItem>
              <NavItem>Community</NavItem>
            </nav>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="hidden sm:inline-flex items-center justify-center h-9 w-9 rounded-full bg-[#e3f2fd] text-[#1976d2] border border-[#bbdefb]"
                aria-label="Search"
              >
                <span className="text-sm">⌕</span>
              </button>
              <Link
                to="/membership"
                className="hidden sm:inline-flex items-center gap-2 rounded-md border border-[#bbdefb] bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <span className="text-sm">♛</span>
                Upgrade
              </Link>
              <div className="flex items-center gap-3">
                  <Link to="/profile" className="flex items-center gap-3 group">
                    <div className="hidden md:flex flex-col items-end mr-2">
                      <span className="text-sm font-semibold text-slate-900 group-hover:text-[#1976d2] transition-colors">
                        {user?.fullName || 'Teacher'}
                      </span>
                      <span className="text-[10px] text-slate-500 capitalize">
                        {user?.role || 'Lecturer'}
                      </span>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-[#1976d2] flex items-center justify-center text-white cursor-pointer group-hover:bg-[#1565c0] transition-colors">
                      <span className="font-semibold text-xs">
                        {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'T'}
                      </span>
                    </div>
                  </Link>
                  <button
                    onClick={() => logout()}
                    className="text-xs font-medium text-slate-500 hover:text-red-600 transition-colors ml-1"
                  >
                    Logout
                  </button>
                </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm font-medium text-white bg-[#1976d2] px-4 py-2 rounded-md hover:bg-[#1565c0] transition-colors mb-8 shadow-sm"
        >
          <i className="fa-solid fa-arrow-left"></i> Back to Dashboard
        </Link>

        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-slate-900">Create New Course</h1>
          <p className="mt-2 text-slate-600">Follow the steps to create your course</p>
        </div>

        {/* Stepper */}
        <div className="mb-12 relative">
          <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-200 -z-0"></div>
          <div className="flex justify-between relative px-4">
            <Step number={1} title="Basic Info" active={currentStep === 1} completed={currentStep > 1} />
            <Step number={2} title="Curriculum" active={currentStep === 2} completed={currentStep > 2} />
            <Step number={3} title="Quiz Setup" active={currentStep === 3} completed={currentStep > 3} />
            <Step number={4} title="Flashcards" active={currentStep === 4} completed={currentStep > 4} />
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Basic Information</h2>
          
          <form className="space-y-6">
            <div className="space-y-1">
              <label className="block text-sm font-bold text-slate-700">
                Course Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Advanced React Patterns"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-[#1976d2] focus:ring-1 focus:ring-[#1976d2] outline-none transition-all"
                value={courseData.title}
                onChange={(e) => updateCourseData({ title: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-bold text-slate-700">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                placeholder="What will students learn in this course?"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-[#1976d2] focus:ring-1 focus:ring-[#1976d2] outline-none transition-all resize-none"
                value={courseData.description}
                onChange={(e) => updateCourseData({ description: e.target.value })}
              ></textarea>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-bold text-slate-700">
                Category <span className="text-red-500">*</span>
              </label>
              <select 
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-[#1976d2] focus:ring-1 focus:ring-[#1976d2] outline-none transition-all bg-white"
                value={courseData.categoryId}
                onChange={(e) => updateCourseData({ categoryId: Number(e.target.value) })}
              >
                <option value={0}>Select Category</option>
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value={1}>Development</option>
                    <option value={2}>Business</option>
                    <option value={3}>Design</option>
                    <option value={4}>Marketing</option>
                  </>
                )}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-bold text-slate-700">
                Price (VND)
              </label>
              <input
                type="number"
                placeholder="0 for free"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-[#1976d2] focus:ring-1 focus:ring-[#1976d2] outline-none transition-all"
                value={courseData.price === 0 ? '' : courseData.price}
                onChange={(e) => updateCourseData({ price: e.target.value === '' ? 0 : Number(e.target.value) })}
              />
            </div>

            <div className="pt-4 flex justify-end">
              <Link
                to="/create-new-course/curriculum"
                className="inline-flex items-center gap-2 rounded-lg bg-[#1976d2] px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-[#1565c0] transition-colors"
              >
                Next <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default CreateNewCourse
