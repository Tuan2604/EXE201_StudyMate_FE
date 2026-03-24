import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import MainHeader from '../components/MainHeader'
import LogoImg from '../accesory/picture/StudyMate 1.png'

interface Lesson {
  id: string
  title: string
  duration: string
  type: 'video' | 'reading' | 'quiz' | 'flashcard'
  completed?: boolean
  videoUrl?: string
  content?: string
  questions?: any[]
}

interface Section {
  id: string
  title: string
  lessons: Lesson[]
}

interface DetailedCourse {
  id: number
  title: string
  description: string
  longDescription: string
  instructor: string
  instructorTitle: string
  instructorImage: string
  enrolledCount: number
  level: string
  duration: string
  providerName: string
  providerLogo: string
  thumbnailUrl: string
  skills: string[]
  syllabus: Section[]
}

const defaultDetailedCourse: DetailedCourse = {
  id: 0,
  title: "Untitled Course",
  description: "No description available.",
  longDescription: "No description available.",
  instructor: "StudyMate Instructor",
  instructorTitle: "Instructor",
  instructorImage: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
  enrolledCount: 0,
  level: "All Levels",
  duration: "0 section(s)",
  providerName: "StudyMate",
  providerLogo: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
  thumbnailUrl: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&q=80&w=1200",
  skills: ["General"],
  syllabus: []
}

const mapApiCourseToDetailedCourse = (raw: any): DetailedCourse => {
  const materialSections: Section[] = Array.isArray(raw?.sections)
    ? raw.sections.map((section: any, sectionIndex: number) => ({
        id: `s-${section.id ?? sectionIndex + 1}`,
        title: section.title || 'Untitled Section',
        lessons: (section.materials || []).map((material: any, materialIndex: number) => ({
          id: `m-${material.id ?? `${sectionIndex + 1}-${materialIndex + 1}`}`,
          title: material.title || 'Untitled Lesson',
          duration: '10 min',
          type: String(material.materialType || '').toLowerCase().includes('video') ? 'video' : 'reading',
          videoUrl: material.fileUrl || undefined,
          content: material.description || material.title || 'No content available.'
        }))
      }))
    : []

  const quizSection: Section = {
    id: 's-quiz',
    title: 'Quizzes',
    lessons: Array.isArray(raw?.quizzes)
      ? raw.quizzes.map((quiz: any, quizIndex: number) => ({
          id: `q-${quiz.id ?? quizIndex + 1}`,
          title: quiz.title || 'Quiz',
          duration: `${(quiz.questions || []).length} question(s)`,
          type: 'quiz',
          questions: (quiz.questions || []).map((question: any) => ({
            q: question.questionText,
            options: (question.options || []).map((option: any) => option.optionText),
            a: Math.max(0, (question.options || []).findIndex((option: any) => option.isCorrect))
          }))
        }))
      : []
  }

  const flashcardSection: Section = {
    id: 's-flashcard',
    title: 'Flashcards',
    lessons: Array.isArray(raw?.flashcards)
      ? raw.flashcards.map((flashcard: any, flashcardIndex: number) => ({
          id: `f-${flashcard.id ?? flashcardIndex + 1}`,
          title: flashcard.front || `Flashcard ${flashcardIndex + 1}`,
          duration: '1 card',
          type: 'flashcard',
          content: flashcard.back || ''
        }))
      : []
  }

  const syllabus = [
    ...materialSections,
    ...(quizSection.lessons.length > 0 ? [quizSection] : []),
    ...(flashcardSection.lessons.length > 0 ? [flashcardSection] : [])
  ]

  return {
    id: Number(raw?.id || 0),
    title: raw?.title || 'Untitled Course',
    description: raw?.description || 'No description available.',
    longDescription: raw?.description || 'No description available.',
    instructor: raw?.teacherName || 'StudyMate Instructor',
    instructorTitle: 'Instructor',
    instructorImage: raw?.teacherAvatar || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
    enrolledCount: Number(raw?.totalEnrollments || 0),
    level: 'All Levels',
    duration: `${Number(raw?.totalSections || 0)} section(s)`,
    providerName: raw?.teacherName || 'StudyMate',
    providerLogo: raw?.teacherAvatar || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
    thumbnailUrl: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&q=80&w=1200',
    skills: raw?.categoryName ? [raw.categoryName] : ['General'],
    syllabus
  }
}

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(false)
  const [detailLoading, setDetailLoading] = useState(true)
  const [detailError, setDetailError] = useState('')
  const [enrollError, setEnrollError] = useState('')
  const [courseDetail, setCourseDetail] = useState<DetailedCourse | null>(null)
  const [showFlashcardBack, setShowFlashcardBack] = useState(false)

  const mockDetailedCourse = courseDetail ?? defaultDetailedCourse
  const totalLessons = mockDetailedCourse.syllabus.reduce((sum, section) => sum + section.lessons.length, 0)
  const completedLessons = mockDetailedCourse.syllabus.reduce(
    (sum, section) => sum + section.lessons.filter((lesson) => lesson.completed).length,
    0
  )
  const completionPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  // Helper function to get YouTube embed URL
  const getEmbedUrl = (url: string | undefined) => {
    if (!url) return ''
    if (url.includes('youtube.com/embed/')) return url
    
    let videoId = ''
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0]
    } else if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1].split('&')[0]
    }
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url
  }

  useEffect(() => {
    const fetchCourseDetail = async () => {
      if (!id) {
        setDetailError('Invalid course id')
        setDetailLoading(false)
        return
      }

      try {
        let mappedCourse: DetailedCourse | null = null

        const response = await fetch(`https://localhost:7259/api/Course/public/${id}`)

        if (response.ok) {
          const result = await response.json()
          mappedCourse = mapApiCourseToDetailedCourse(result?.data)
        } else {
          const token = localStorage.getItem('token')
          const role = String(user?.role || '').toLowerCase()
          const endpoint = role === 'admin'
            ? 'https://localhost:7259/api/Course/admin/all'
            : 'https://localhost:7259/api/Course/all'

          const listResponse = await fetch(endpoint, {
            headers: role === 'admin' && token
              ? { Authorization: `Bearer ${token}` }
              : undefined,
          })

          if (listResponse.ok) {
            const listResult = await listResponse.json()
            const apiData = Array.isArray(listResult?.data) ? listResult.data : []
            const matchedCourse = apiData.find((course: any) => Number(course?.id) === Number(id))

            if (matchedCourse) {
              mappedCourse = mapApiCourseToDetailedCourse(matchedCourse)
            }
          }
        }

        if (!mappedCourse) {
          setDetailError('Failed to load course detail')
          return
        }

        setCourseDetail(mappedCourse)

        const firstSection = mappedCourse.syllabus[0]
        const firstLesson = firstSection?.lessons?.[0] || null
        setActiveSection(firstSection?.id || null)
        setSelectedLesson(firstLesson)

        const token = localStorage.getItem('token')
        const role = String(user?.role || '').toLowerCase()
        if (token && role === 'student') {
          const statusResponse = await fetch(`https://localhost:7259/api/course-student/${id}/enrollment-status`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })

          if (statusResponse.ok) {
            const statusData = await statusResponse.json().catch(() => null)
            setIsEnrolled(Boolean(statusData?.isEnrolled))
          }
        }
      } catch (error) {
        console.error('Failed to fetch course detail:', error)
        setDetailError('Network error while loading course detail')
      } finally {
        setDetailLoading(false)
      }
    }

    fetchCourseDetail()
  }, [id, user?.role])

  useEffect(() => {
    setShowFlashcardBack(false)
  }, [selectedLesson?.id])

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    if (!id) {
      setEnrollError('Invalid course id')
      return
    }

    setEnrollError('')
    setLoading(true)

    try {
      const response = await fetch(`https://localhost:7259/api/course-student/${id}/enroll`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setIsEnrolled(true)
        return
      }

      const text = await response.text()
      let message = text || 'Enroll failed'
      try {
        const parsed = JSON.parse(text)
        if (parsed?.message) {
          message = parsed.message
        }
      } catch {
      }
      setEnrollError(message)

      if (message.toLowerCase().includes('already enrolled')) {
        setIsEnrolled(true)
        setEnrollError('')
        return
      }

      if (message.toLowerCase().includes('premium')) {
        setTimeout(() => navigate('/membership'), 1200)
      }
    } catch (error) {
      console.error('Enroll error:', error)
      setEnrollError('Network error while enrolling')
    } finally {
      setLoading(false)
    }
  }

  if (detailLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-3xl text-[#1976d2] mb-3"></i>
          <p className="text-slate-600">Loading course detail...</p>
        </div>
      </div>
    )
  }

  if (detailError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <i className="fa-solid fa-circle-exclamation text-3xl text-red-500 mb-3"></i>
          <p className="text-red-600 mb-4">{detailError}</p>
          <Link to="/courses" className="bg-[#1976d2] text-white px-4 py-2 rounded-md font-semibold hover:bg-[#1565c0] transition-colors">
            Back to Courses
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <MainHeader />

      {/* Hero Section */}
      {!isEnrolled ? (
        <>
          <section className="bg-slate-900 text-white py-16">
            <div className="mx-auto max-w-7xl px-4 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center gap-3">
                  <img src={mockDetailedCourse.providerLogo} className="h-10 w-10 bg-white p-1 rounded" alt="Google" />
                  <span className="text-lg font-semibold">{mockDetailedCourse.providerName}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">{mockDetailedCourse.title}</h1>
                <p className="text-xl text-slate-300 max-w-2xl">{mockDetailedCourse.description}</p>
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-users text-slate-400"></i>
                    <span>{mockDetailedCourse.enrolledCount.toLocaleString()} already enrolled</span>
                  </div>
                </div>
                <div className="pt-4 flex flex-wrap gap-4">
                  <button 
                    onClick={handleEnroll}
                    disabled={loading}
                    className="bg-[#1976d2] hover:bg-[#1565c0] text-white px-8 py-4 rounded-md font-bold text-lg transition-all shadow-lg flex items-center gap-2"
                  >
                    {loading ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div> : 'Enroll for Free'}
                    <span className="text-sm font-normal opacity-80">Starts Feb 25</span>
                  </button>
                  {enrollError && <p className="text-sm text-red-300">{enrollError}</p>}
                  <div className="flex flex-col justify-center text-xs text-slate-400">
                    <span className="font-bold text-white">Financial aid available</span>
                    <span>{mockDetailedCourse.enrolledCount.toLocaleString()} already enrolled</span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block relative group">
                <div className="aspect-video rounded-xl overflow-hidden shadow-2xl border-4 border-white/10">
                  <img src={mockDetailedCourse.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Preview" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center text-[#1976d2] shadow-xl">
                      <i className="fa-solid fa-play text-2xl ml-1"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Main Content */}
          <main className="mx-auto max-w-7xl px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-12">
              {/* About */}
              <section>
                <h2 className="text-2xl font-bold mb-6">About this Professional Certificate</h2>
                <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                  <p>{mockDetailedCourse.longDescription}</p>
                </div>
              </section>

              {/* Skills gained */}
              <section className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
                <h3 className="text-lg font-bold mb-6">Skills you will gain</h3>
                <div className="flex flex-wrap gap-2">
                  {mockDetailedCourse.skills.map(skill => (
                    <span key={skill} className="bg-white px-4 py-2 rounded-full border border-slate-200 text-sm font-medium text-slate-700">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>

              {/* Syllabus */}
              <section>
                <h2 className="text-2xl font-bold mb-8">Syllabus - What you will learn from this course</h2>
                <div className="space-y-4">
                  {mockDetailedCourse.syllabus.map((section, idx) => (
                    <div key={section.id} className="border border-slate-200 rounded-xl overflow-hidden">
                      <button 
                        onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                        className="w-full px-6 py-5 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-slate-400 font-bold">SECTION {idx + 1}</span>
                          <h3 className="font-bold text-slate-900">{section.title}</h3>
                        </div>
                        <i className={`fa-solid fa-chevron-${activeSection === section.id ? 'up' : 'down'} text-slate-400`}></i>
                      </button>
                      {activeSection === section.id && (
                        <div className="px-6 pb-6 pt-2 space-y-4 border-t border-slate-100">
                          <p className="text-sm text-slate-500 mb-4">
                            {section.lessons.length} lesson(s) in this section.
                          </p>
                          {section.lessons.map(lesson => (
                            <div key={lesson.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                              <div className="flex items-center gap-3">
                                <i className={`fa-solid ${lesson.type === 'video' ? 'fa-circle-play text-[#1976d2]' : lesson.type === 'quiz' ? 'fa-clipboard-question text-orange-500' : lesson.type === 'flashcard' ? 'fa-layer-group text-purple-500' : 'fa-file-lines text-green-500'} w-5`}></i>
                                <span className="text-sm font-medium text-slate-700">{lesson.title}</span>
                              </div>
                              <span className="text-xs text-slate-400">{lesson.duration}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Sticky Sidebar */}
            <aside className="space-y-8">
              <div className="sticky top-24 space-y-6">
                <div className="p-6 border border-slate-200 rounded-2xl space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <i className="fa-solid fa-signal text-[#1976d2] w-5"></i>
                      <div>
                        <p className="text-sm font-bold">Beginner Level</p>
                        <p className="text-xs text-slate-500">No previous experience necessary</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <i className="fa-solid fa-calendar text-[#1976d2] w-5"></i>
                      <div>
                        <p className="text-sm font-bold">Flexible schedule</p>
                        <p className="text-xs text-slate-500">Learn at your own pace</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <i className="fa-solid fa-certificate text-[#1976d2] w-5"></i>
                      <div>
                        <p className="text-sm font-bold">Shareable Certificate</p>
                        <p className="text-xs text-slate-500">Earn a certificate upon completion</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <i className="fa-solid fa-globe text-[#1976d2] w-5"></i>
                      <div>
                        <p className="text-sm font-bold">100% online</p>
                        <p className="text-xs text-slate-500">Start instantly and learn at your own schedule</p>
                      </div>
                    </div>
                  </div>
                  <button onClick={handleEnroll} disabled={loading} className="w-full bg-[#1976d2] text-white py-3 rounded-md font-bold hover:bg-[#1565c0] transition-colors shadow-lg disabled:opacity-70">
                    {loading ? 'Enrolling...' : 'Enroll for Free'}
                  </button>
                  {enrollError && <p className="text-xs text-red-600">{enrollError}</p>}
                </div>

                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                  <h4 className="font-bold mb-4">Instructors</h4>
                  <div className="flex items-center gap-4">
                    <img src={mockDetailedCourse.instructorImage} className="h-12 w-12 rounded-full border border-slate-200 bg-white p-1" alt="Instructor" />
                    <div>
                      <p className="text-sm font-bold text-slate-900">{mockDetailedCourse.instructor}</p>
                      <p className="text-xs text-[#1976d2] font-semibold">{mockDetailedCourse.instructorTitle}</p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </main>
        </>
      ) : (
        /* Course Player View */
        <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)]">
          {/* Sidebar Playlist - Now on the Left */}
          <div className="w-full lg:w-80 bg-white border-r border-slate-200 overflow-y-auto order-2 lg:order-1">
            <div className="p-6 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-900">Course Content</h3>
              <p className="text-xs text-slate-500 mt-1">{completedLessons} / {totalLessons} lessons completed</p>
              <div className="mt-4 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: `${completionPercent}%` }}></div>
              </div>
            </div>
            
            <div className="divide-y divide-slate-100">
              {mockDetailedCourse.syllabus.map((section, sIdx) => (
                <div key={section.id}>
                  <div className="p-4 bg-slate-50/50 font-bold text-xs text-slate-400 uppercase tracking-widest flex items-center justify-between">
                    <span>Section {sIdx + 1}: {section.title}</span>
                  </div>
                  <div className="bg-white">
                    {section.lessons.map(lesson => (
                      <button 
                        key={lesson.id}
                        onClick={() => setSelectedLesson(lesson)}
                        className={`w-full p-4 flex items-start gap-3 text-left hover:bg-slate-50 transition-colors ${selectedLesson?.id === lesson.id ? 'bg-blue-50 border-r-4 border-[#1976d2]' : ''}`}
                      >
                        <div className={`mt-0.5 h-5 w-5 flex items-center justify-center rounded-full border ${selectedLesson?.id === lesson.id ? 'border-[#1976d2] text-[#1976d2]' : 'border-slate-300 text-slate-300'}`}>
                          {lesson.completed ? <i className="fa-solid fa-check text-[10px]"></i> : <div className="h-1.5 w-1.5 bg-current rounded-full"></div>}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-bold leading-tight ${selectedLesson?.id === lesson.id ? 'text-[#1976d2]' : 'text-slate-700'}`}>{lesson.title}</p>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                              <i className={`fa-solid ${lesson.type === 'video' ? 'fa-circle-play' : lesson.type === 'quiz' ? 'fa-clipboard-question' : lesson.type === 'flashcard' ? 'fa-layer-group' : 'fa-file-lines'}`}></i>
                              {lesson.type}
                            </span>
                            <span className="text-[10px] text-slate-300 font-bold uppercase tracking-tighter">{lesson.duration}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content Area - Full Width */}
          <div className="flex-1 bg-black flex flex-col overflow-hidden order-1 lg:order-2">
            <div className="flex-1 flex items-center justify-center p-0 lg:p-4">
              {selectedLesson?.type === 'video' ? (
                <div className="w-full h-full lg:max-w-[95%] lg:h-[90%] aspect-video bg-slate-900 lg:rounded-lg overflow-hidden shadow-2xl border border-white/5">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={getEmbedUrl(selectedLesson.videoUrl)} 
                    title="Video Player"
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
              ) : selectedLesson?.type === 'reading' ? (
                <div className="w-full h-full bg-white p-6 lg:p-12 overflow-y-auto lg:rounded-lg shadow-2xl">
                  <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">{selectedLesson.title}</h1>
                    <div className="prose prose-slate lg:prose-lg max-w-none">
                      <p>{selectedLesson.content}</p>
                      <p>In this module, we explore the core principles of data analytics. You'll learn how to approach problems with an analytical mindset...</p>
                      <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-[#1976d2] my-8">
                        <p className="font-bold text-[#1976d2]">Key Takeaway</p>
                        <p className="text-sm">Always verify your data sources before starting your analysis process.</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : selectedLesson?.type === 'flashcard' ? (
                <div className="w-full h-full bg-slate-50 overflow-y-auto flex items-center justify-center py-10 lg:p-10">
                  <div className="w-full max-w-2xl bg-white p-6 lg:p-10 rounded-2xl shadow-xl h-fit">
                    <div className="flex items-center gap-3 mb-6 text-purple-500">
                      <i className="fa-solid fa-layer-group text-2xl"></i>
                      <h2 className="text-2xl font-bold text-slate-900">Flashcard</h2>
                    </div>
                    <div className="border border-slate-200 rounded-xl p-8 min-h-48 flex items-center justify-center text-center">
                      <p className="text-xl font-bold text-slate-800">
                        {showFlashcardBack ? selectedLesson?.content || 'No answer' : selectedLesson?.title}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowFlashcardBack((prev) => !prev)}
                      className="mt-6 w-full bg-[#1976d2] text-white py-3 rounded-xl font-bold hover:bg-[#1565c0] transition-all shadow-lg"
                    >
                      {showFlashcardBack ? 'Show Front' : 'Show Back'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-slate-50 overflow-y-auto flex justify-center py-10 lg:p-10">
                  <div className="w-full max-w-3xl bg-white p-6 lg:p-10 rounded-2xl shadow-xl h-fit">
                    <div className="flex items-center gap-3 mb-6 text-orange-500">
                      <i className="fa-solid fa-clipboard-question text-2xl"></i>
                      <h2 className="text-2xl font-bold text-slate-900">Quiz: {selectedLesson?.title}</h2>
                    </div>
                    <div className="space-y-8">
                      {selectedLesson?.questions?.map((q, idx) => (
                        <div key={idx} className="space-y-4">
                          <p className="font-bold text-lg">{idx + 1}. {q.q}</p>
                          <div className="space-y-3">
                            {q.options.map((opt: string, oIdx: number) => (
                              <label key={oIdx} className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-[#1976d2] hover:bg-blue-50 cursor-pointer transition-all group">
                                <input type="radio" name={`q-${idx}`} className="w-5 h-5 text-[#1976d2] focus:ring-[#1976d2]" />
                                <span className="font-medium text-slate-700 group-hover:text-[#1976d2]">{opt}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                      <button className="w-full bg-[#1976d2] text-white py-4 rounded-xl font-bold hover:bg-[#1565c0] transition-all shadow-lg">
                        Submit Quiz
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Control Bar */}
            <div className="bg-slate-900 px-4 lg:px-8 py-4 flex items-center justify-between border-t border-white/5">
              <div className="text-white">
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Currently Viewing</p>
                <h4 className="font-bold text-sm lg:text-base line-clamp-1">{selectedLesson?.title}</h4>
              </div>
              <div className="flex items-center gap-2 lg:gap-3">
                <button className="px-4 lg:px-6 py-2 rounded-md bg-white/10 text-white font-bold hover:bg-white/20 transition-all text-xs lg:text-sm">
                  <i className="fa-solid fa-chevron-left mr-1 lg:mr-2"></i> Previous
                </button>
                <button className="px-4 lg:px-6 py-2 rounded-md bg-[#1976d2] text-white font-bold hover:bg-[#1565c0] transition-all text-xs lg:text-sm">
                  Next Lesson <i className="fa-solid fa-chevron-right ml-1 lg:mr-2"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer (only show on detail page) */}
      {!isEnrolled && (
        <footer className="bg-slate-50 border-t border-slate-200 py-16">
          <div className="mx-auto max-w-7xl px-4 grid grid-cols-2 md:grid-cols-4 gap-12 text-sm">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <img src={LogoImg} className="h-6 w-auto" alt="Logo" />
                <span className="text-lg font-bold text-[#1976d2]">StudyMate</span>
              </div>
              <p className="text-slate-500 leading-relaxed">StudyMate is an online learning platform that helps students achieve their goals with AI-powered courses.</p>
            </div>
            <div>
              <h4 className="font-bold mb-6">Explore</h4>
              <ul className="space-y-4 text-slate-600">
                <li><a href="#" className="hover:text-[#1976d2]">Data Science</a></li>
                <li><a href="#" className="hover:text-[#1976d2]">Business</a></li>
                <li><a href="#" className="hover:text-[#1976d2]">Computer Science</a></li>
                <li><a href="#" className="hover:text-[#1976d2]">Health</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Community</h4>
              <ul className="space-y-4 text-slate-600">
                <li><a href="#" className="hover:text-[#1976d2]">Learners</a></li>
                <li><a href="#" className="hover:text-[#1976d2]">Partners</a></li>
                <li><a href="#" className="hover:text-[#1976d2]">Developers</a></li>
                <li><a href="#" className="hover:text-[#1976d2]">Mentors</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">StudyMate</h4>
              <ul className="space-y-4 text-slate-600">
                <li><a href="#" className="hover:text-[#1976d2]">About</a></li>
                <li><a href="#" className="hover:text-[#1976d2]">Careers</a></li>
                <li><a href="#" className="hover:text-[#1976d2]">Contact</a></li>
                <li><a href="#" className="hover:text-[#1976d2]">Press</a></li>
              </ul>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}

export default CourseDetail
