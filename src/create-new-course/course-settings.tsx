import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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

const CourseSettings: React.FC = () => {
  const { user, logout } = useAuth()
  const { courseData, updateCourseData, resetCourseData } = useCourse()
  const currentStep: number = 5
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleFinish = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      console.log('Current Token:', token ? 'Found' : 'Not Found')
      
      if (!token) {
        alert('You are not logged in. Please login first.')
        setLoading(false)
        return
      }

      // Prepare data for API
      const apiData = {
        title: courseData.title || "Untitled Course",
        description: courseData.description || "No description",
        price: courseData.price || 0,
        categoryId: courseData.categoryId || 1, // Default to 1 if not set
        sections: courseData.sections.map((section) => ({
          title: section.title,
          description: section.description || "",
          orderIndex: section.orderIndex,
          materials: section.materials.map(m => ({
            ...m,
            materialType: m.materialType || "other"
          }))
        })),
        quizzes: courseData.quizzes.map((quiz) => ({
          title: quiz.title,
          questions: quiz.questions.map((q) => ({
            questionText: q.questionText,
            questionType: q.questionType,
            options: q.options.map(o => ({
              optionText: o.optionText,
              isCorrect: o.isCorrect
            }))
          }))
        })),
        flashcards: courseData.flashcards.map(f => ({
          front: f.front,
          back: f.back
        }))
      }

      console.log('Sending data to API:', apiData)

      const response = await fetch('https://localhost:7259/api/Course/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(apiData)
      })

      if (!response.ok) {
        // Try to read as text first to avoid JSON parse error
        const errorText = await response.text()
        console.error('API Error Response:', errorText)
        
        let errorMessage = 'Failed to create course'
        try {
          const errorJson = JSON.parse(errorText)
          errorMessage = errorJson.message || errorMessage
        } catch (e) {
          // If not JSON, use the status text or the raw text
          errorMessage = errorText || `Error ${response.status}: ${response.statusText}`
        }
        
        if (response.status === 401) {
          errorMessage = 'Unauthorized: Please login again.'
        }
        
        throw new Error(errorMessage)
      }

      alert('Course created successfully!')
      resetCourseData()
      navigate('/')
    } catch (error) {
      console.error('Error creating course:', error)
      alert(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Top nav */}
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
          to="/create-new-course/flashcards" 
          className="inline-flex items-center gap-2 text-sm font-medium text-white bg-[#1976d2] px-4 py-2 rounded-md hover:bg-[#1565c0] transition-colors mb-8 shadow-sm"
        >
          <i className="fa-solid fa-arrow-left"></i> Back to Flashcards
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
            <Step number={5} title="Settings" active={currentStep === 5} completed={currentStep > 5} />
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Course Settings</h2>
          
          <div className="space-y-6">
            <div className="space-y-1">
              <label className="block text-sm font-bold text-slate-700">Estimated Duration (hours)</label>
              <input
                type="number"
                placeholder="e.g. 10"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-[#1976d2] focus:ring-1 focus:ring-[#1976d2] outline-none transition-all"
                value={courseData.duration}
                onChange={(e) => updateCourseData({ duration: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-bold text-slate-700">Prerequisites</label>
              <textarea
                rows={4}
                placeholder="What should students know before taking this course?"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-[#1976d2] focus:ring-1 focus:ring-[#1976d2] outline-none transition-all resize-none"
                value={courseData.prerequisites}
                onChange={(e) => updateCourseData({ prerequisites: e.target.value })}
              ></textarea>
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <Link
              to="/create-new-course/flashcards"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-6 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <i className="fa-solid fa-arrow-left"></i> Previous
            </Link>
            <button
              type="button"
              onClick={handleFinish}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-[#1976d2] px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-[#1565c0] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Finish'} <i className="fa-solid fa-check"></i>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default CourseSettings
