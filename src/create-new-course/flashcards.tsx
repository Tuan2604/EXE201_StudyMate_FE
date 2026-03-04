import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCourse } from '../contexts/CourseContext'
import type { CourseFlashcard } from '../contexts/CourseContext'
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

const Flashcards: React.FC = () => {
  const { user, logout } = useAuth()
  const { courseData, updateCourseData, resetCourseData } = useCourse()
  const currentStep: number = 4
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  // Local state for the current flashcard being edited
  const [currentFlashcard, setCurrentFlashcard] = useState<CourseFlashcard>({
    front: '',
    back: ''
  })

  const [editingCardIndex, setEditingCardIndex] = useState<number | null>(null)
  const [editingCardState, setEditingCardState] = useState<CourseFlashcard | null>(null)

  const handleAddFlashcard = () => {
    if (!currentFlashcard.front.trim() || !currentFlashcard.back.trim()) return

    updateCourseData({
      flashcards: [...courseData.flashcards, currentFlashcard]
    })

    setCurrentFlashcard({ front: '', back: '' })
  }

  const startEditingCard = (index: number) => {
    const card = courseData.flashcards[index]
    setEditingCardIndex(index)
    setEditingCardState({...card})
  }

  const saveEditedCard = () => {
    if (editingCardIndex === null || !editingCardState) return

    const updatedFlashcards = [...courseData.flashcards]
    updatedFlashcards[editingCardIndex] = editingCardState

    updateCourseData({ flashcards: updatedFlashcards })
    setEditingCardIndex(null)
    setEditingCardState(null)
  }

  const deleteCard = (index: number) => {
    if (window.confirm('Are you sure you want to delete this flashcard?')) {
      const updatedFlashcards = courseData.flashcards.filter((_, i) => i !== index)
      updateCourseData({ flashcards: updatedFlashcards })
    }
  }

  const handleFinish = async () => {
    // Basic validation
    if (courseData.flashcards.length === 0) {
      if (!window.confirm('You haven\'t added any flashcards. Are you sure you want to finish?')) {
        return
      }
    }

    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      
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
        categoryId: courseData.categoryId || 1,
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
        const errorText = await response.text()
        console.error('API Error Response:', errorText)
        
        let errorMessage = 'Failed to create course'
        try {
          const errorJson = JSON.parse(errorText)
          errorMessage = errorJson.message || errorMessage
        } catch (e) {
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
          to="/create-new-course/quiz-setup" 
          className="inline-flex items-center gap-2 text-sm font-medium text-white bg-[#1976d2] px-4 py-2 rounded-md hover:bg-[#1565c0] transition-colors mb-8 shadow-sm"
        >
          <i className="fa-solid fa-arrow-left"></i> Back to Quiz Setup
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
          <h2 className="text-xl font-bold text-slate-900 mb-2">Flashcard Game</h2>
          <p className="text-sm text-slate-600 mb-6">Create flashcard pairs for students to practice and memorize key concepts</p>
          
          <div className="space-y-6">
            {/* List existing flashcards */}
            {courseData.flashcards.map((card, idx) => (
              <div key={idx} className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm">
                {editingCardIndex === idx && editingCardState ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="block text-sm font-bold text-slate-700">Term / Front</label>
                        <input
                          type="text"
                          className="w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1976d2]"
                          value={editingCardState.front}
                          onChange={(e) => setEditingCardState({...editingCardState, front: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-sm font-bold text-slate-700">Definition / Back</label>
                        <textarea
                          rows={2}
                          className="w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1976d2] resize-none"
                          value={editingCardState.back}
                          onChange={(e) => setEditingCardState({...editingCardState, back: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button 
                        onClick={() => setEditingCardIndex(null)}
                        className="px-3 py-1 text-xs font-medium text-slate-500 hover:text-slate-700"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={saveEditedCard}
                        className="px-3 py-1 text-xs font-bold text-white bg-green-500 rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <span className="text-xs font-bold text-slate-500 uppercase">Front</span>
                        <p className="mt-1 text-slate-900 font-medium">{card.front}</p>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-500 uppercase">Back</span>
                        <p className="mt-1 text-slate-900">{card.back}</p>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
                      <button 
                        onClick={() => startEditingCard(idx)}
                        className="text-slate-400 hover:text-[#1976d2]"
                        title="Edit Flashcard"
                      >
                        <i className="fa-solid fa-pen"></i>
                      </button>
                      <button 
                        onClick={() => deleteCard(idx)}
                        className="text-slate-400 hover:text-red-500"
                        title="Delete Flashcard"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}

            {/* Current Flashcard Form */}
            <div className="border border-slate-200 rounded-xl p-6 bg-slate-50">
              <h3 className="font-bold text-lg text-slate-900 mb-4">New Flashcard</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="block text-sm font-bold text-slate-700">Term / Front</label>
                  <input
                    type="text"
                    placeholder="e.g., useState"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-[#1976d2] focus:ring-1 focus:ring-[#1976d2] outline-none transition-all bg-white"
                    value={currentFlashcard.front}
                    onChange={(e) => setCurrentFlashcard({...currentFlashcard, front: e.target.value})}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-bold text-slate-700">Definition / Back</label>
                  <textarea
                    rows={3}
                    placeholder="e.g., A React Hook for managing state"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-[#1976d2] focus:ring-1 focus:ring-[#1976d2] outline-none transition-all resize-none bg-white"
                    value={currentFlashcard.back}
                    onChange={(e) => setCurrentFlashcard({...currentFlashcard, back: e.target.value})}
                  ></textarea>
                </div>
              </div>
            </div>

            <button 
              onClick={handleAddFlashcard}
              className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 font-medium hover:border-[#1976d2] hover:text-[#1976d2] hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-plus"></i> Add Flashcard
            </button>
          </div>

          <div className="mt-8 flex justify-between">
            <Link
              to="/create-new-course/quiz-setup"
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

export default Flashcards
