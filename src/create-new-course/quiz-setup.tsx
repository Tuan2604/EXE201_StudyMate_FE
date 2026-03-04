import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCourse } from '../contexts/CourseContext'
import type { QuizQuestion } from '../contexts/CourseContext'
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

const QuizSetup: React.FC = () => {
  const { user, logout } = useAuth()
  const { courseData, updateCourseData } = useCourse()
  const currentStep: number = 3

  // Local state for the current question being edited
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion>({
    questionText: '',
    questionType: 'multiple_choice',
    options: [
      { optionText: '', isCorrect: false },
      { optionText: '', isCorrect: false },
      { optionText: '', isCorrect: false },
      { optionText: '', isCorrect: false }
    ]
  })

  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null)
  const [editingQuestionState, setEditingQuestionState] = useState<QuizQuestion | null>(null)

  const handleAddQuestion = () => {
    if (!currentQuestion.questionText.trim()) return

    // Basic validation for options
    if (currentQuestion.questionType === 'multiple_choice' || currentQuestion.questionType === 'true_false') {
      const hasCorrectAnswer = currentQuestion.options.some(opt => opt.isCorrect)
      const validOptions = currentQuestion.options.filter(opt => opt.optionText.trim() !== '')
      
      if (!hasCorrectAnswer) {
        alert('Please select a correct answer')
        return
      }
      if (validOptions.length < 2) {
        alert('Please provide at least 2 options')
        return
      }
    }

    const newQuiz = {
      title: courseData.quizzes[0]?.title || 'Default Quiz',
      questions: [...(courseData.quizzes[0]?.questions || []), currentQuestion]
    }

    updateCourseData({
      quizzes: [newQuiz]
    })

    // Reset current question
    setCurrentQuestion({
      questionText: '',
      questionType: 'multiple_choice',
      options: [
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false }
      ]
    })
  }

  const startEditingQuestion = (index: number) => {
    const question = courseData.quizzes[0].questions[index]
    setEditingQuestionIndex(index)
    setEditingQuestionState({...question})
  }

  const saveEditedQuestion = () => {
    if (editingQuestionIndex === null || !editingQuestionState) return

    const updatedQuestions = [...courseData.quizzes[0].questions]
    updatedQuestions[editingQuestionIndex] = editingQuestionState

    const updatedQuiz = {
      ...courseData.quizzes[0],
      questions: updatedQuestions
    }

    updateCourseData({ quizzes: [updatedQuiz] })
    setEditingQuestionIndex(null)
    setEditingQuestionState(null)
  }

  const deleteQuestion = (index: number) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      const updatedQuestions = courseData.quizzes[0].questions.filter((_, i) => i !== index)
      const updatedQuiz = {
        ...courseData.quizzes[0],
        questions: updatedQuestions
      }
      updateCourseData({ quizzes: [updatedQuiz] })
    }
  }

  const updateOption = (index: number, text: string) => {
    const newOptions = [...currentQuestion.options]
    newOptions[index] = { ...newOptions[index], optionText: text }
    setCurrentQuestion({ ...currentQuestion, options: newOptions })
  }

  const setCorrectOption = (index: number) => {
    const newOptions = currentQuestion.options.map((opt, i) => ({
      ...opt,
      isCorrect: i === index
    }))
    setCurrentQuestion({ ...currentQuestion, options: newOptions })
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
          to="/create-new-course/curriculum" 
          className="inline-flex items-center gap-2 text-sm font-medium text-white bg-[#1976d2] px-4 py-2 rounded-md hover:bg-[#1565c0] transition-colors mb-8 shadow-sm"
        >
          <i className="fa-solid fa-arrow-left"></i> Back to Curriculum
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
          <h2 className="text-xl font-bold text-slate-900 mb-6">Quiz Setup</h2>
          
          <div className="space-y-8">
            {/* List existing questions */}
            {courseData.quizzes[0]?.questions.map((q, idx) => (
              <div key={idx} className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm">
                {editingQuestionIndex === idx && editingQuestionState ? (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="block text-sm font-bold text-slate-700">Question</label>
                      <textarea
                        rows={2}
                        className="w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1976d2]"
                        value={editingQuestionState.questionText}
                        onChange={(e) => setEditingQuestionState({...editingQuestionState, questionText: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      {editingQuestionState.options.map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-3">
                          <input 
                            type="radio" 
                            name={`edit-correct-${idx}`}
                            className="w-4 h-4 text-[#1976d2]"
                            checked={opt.isCorrect}
                            onChange={() => {
                              const newOptions = editingQuestionState.options.map((o, i) => ({
                                ...o,
                                isCorrect: i === optIdx
                              }))
                              setEditingQuestionState({...editingQuestionState, options: newOptions})
                            }}
                          />
                          <input
                            type="text"
                            className="flex-1 rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-[#1976d2]"
                            value={opt.optionText}
                            onChange={(e) => {
                              const newOptions = [...editingQuestionState.options]
                              newOptions[optIdx] = { ...newOptions[optIdx], optionText: e.target.value }
                              setEditingQuestionState({...editingQuestionState, options: newOptions})
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button 
                        onClick={() => setEditingQuestionIndex(null)}
                        className="px-3 py-1 text-xs font-medium text-slate-500 hover:text-slate-700"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={saveEditedQuestion}
                        className="px-3 py-1 text-xs font-bold text-white bg-green-500 rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-slate-900">Question {idx + 1}</h3>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => startEditingQuestion(idx)}
                          className="text-slate-400 hover:text-[#1976d2]"
                          title="Edit Question"
                        >
                          <i className="fa-solid fa-pen"></i>
                        </button>
                        <button 
                          onClick={() => deleteQuestion(idx)}
                          className="text-slate-400 hover:text-red-500"
                          title="Delete Question"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </div>
                    <p className="text-slate-700 mb-2">{q.questionText}</p>
                    <div className="pl-4 border-l-2 border-slate-200 space-y-1">
                      {q.options.map((opt, i) => (
                        <div key={i} className={`text-sm ${opt.isCorrect ? 'text-green-600 font-medium' : 'text-slate-500'}`}>
                          {opt.isCorrect && <i className="fa-solid fa-check mr-2"></i>}
                          {opt.optionText}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}

            {/* Current Question Form */}
            <div className="border border-slate-200 rounded-xl p-6 bg-slate-50">
              <h3 className="font-bold text-lg text-slate-900 mb-4">New Question</h3>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-sm font-bold text-slate-700">Question Type</label>
                  <select 
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-[#1976d2] focus:ring-1 focus:ring-[#1976d2] outline-none transition-all bg-white"
                    value={currentQuestion.questionType}
                    onChange={(e) => setCurrentQuestion({...currentQuestion, questionType: e.target.value as any})}
                  >
                    <option value="multiple_choice">Multiple Choice</option>
                    <option value="true_false">True / False</option>
                    <option value="short_answer">Short Answer</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-bold text-slate-700">Question</label>
                  <textarea
                    rows={3}
                    placeholder="Enter your question here..."
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-[#1976d2] focus:ring-1 focus:ring-[#1976d2] outline-none transition-all resize-none bg-white"
                    value={currentQuestion.questionText}
                    onChange={(e) => setCurrentQuestion({...currentQuestion, questionText: e.target.value})}
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">Options</label>
                  <div className="space-y-2">
                    {currentQuestion.options.map((opt, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <input 
                          type="radio" 
                          name="correct-answer" 
                          className="w-4 h-4 text-[#1976d2]"
                          checked={opt.isCorrect}
                          onChange={() => setCorrectOption(idx)}
                        />
                        <input
                          type="text"
                          placeholder={`Option ${idx + 1}`}
                          className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-[#1976d2] focus:ring-1 focus:ring-[#1976d2] outline-none transition-all bg-white"
                          value={opt.optionText}
                          onChange={(e) => updateOption(idx, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Select the correct answer</p>
                </div>
              </div>
            </div>

            <button 
              onClick={handleAddQuestion}
              className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 font-medium hover:border-[#1976d2] hover:text-[#1976d2] hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-plus"></i> Add Question
            </button>
          </div>

          <div className="mt-8 flex justify-between">
            <Link
              to="/create-new-course/curriculum"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-6 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <i className="fa-solid fa-arrow-left"></i> Previous
            </Link>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-[#1976d2] px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-[#1565c0] transition-colors"
            >
              <Link to="/create-new-course/flashcards">
                Next <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default QuizSetup
