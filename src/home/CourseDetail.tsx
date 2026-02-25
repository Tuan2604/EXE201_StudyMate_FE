import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LogoImg from '../accesory/picture/StudyMate 1.png'

interface Lesson {
  id: string
  title: string
  duration: string
  type: 'video' | 'reading' | 'quiz'
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
  rating: number
  reviewCount: number
  enrolledCount: number
  level: string
  duration: string
  providerName: string
  providerLogo: string
  thumbnailUrl: string
  skills: string[]
  syllabus: Section[]
}

const mockDetailedCourse: DetailedCourse = {
  id: 101,
  title: "Google Data Analytics Professional Certificate",
  description: "Get started in the high-growth field of data analytics with a professional certificate from Google.",
  longDescription: "This is your path to a career in data analytics. In this program, you’ll learn in-demand skills that will have you job-ready in less than six months. No degree or experience required. Data analytics is the collection, transformation, and organization of data in order to draw conclusions, make predictions, and drive informed decision-making.",
  instructor: "Google Career Certificates",
  instructorTitle: "Top Instructor",
  instructorImage: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_\"G\"_Logo.svg",
  rating: 4.8,
  reviewCount: 125430,
  enrolledCount: 1205400,
  level: "Beginner",
  duration: "6 months at 10 hours/week",
  providerName: "Google",
  providerLogo: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_\"G\"_Logo.svg",
  thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200",
  skills: ["Data Analysis", "R Programming", "SQL", "Tableau", "Data Visualization", "Spreadsheets"],
  syllabus: [
    {
      id: "s1",
      title: "Foundations: Data, Data, Everywhere",
      lessons: [
        { id: "l1", title: "Introduction to Data Analytics", duration: "10 min", type: "video", videoUrl: "https://www.youtube.com/embed/KxryzSO1Fjs" },
        { id: "l2", title: "Thinking Like an Analyst", duration: "15 min", type: "video", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
        { id: "l3", title: "Data Analyst Tools", duration: "5 min", type: "reading", content: "Data analysts use various tools like SQL, Excel, and R..." },
        { id: "l4", title: "Weekly Quiz: Foundations", duration: "20 min", type: "quiz", questions: [
          { q: "What is data analytics?", options: ["Collecting data", "Cleaning data", "Drawing conclusions", "All of the above"], a: 3 }
        ]}
      ]
    },
    {
      id: "s2",
      title: "Ask Questions to Make Data-Driven Decisions",
      lessons: [
        { id: "l5", title: "Effective Questioning", duration: "12 min", type: "video" },
        { id: "l6", title: "Data-Driven Decisions", duration: "8 min", type: "video" },
        { id: "l7", title: "Spreadsheet Basics", duration: "20 min", type: "video" }
      ]
    }
  ]
}

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>("s1")
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(false)

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

  // Simulation of loading data
  useEffect(() => {
    // In a real app, fetch by id
    // For now, we use the mock
    setSelectedLesson(mockDetailedCourse.syllabus[0].lessons[0])
  }, [id])

  const handleEnroll = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    setLoading(true)
    setTimeout(() => {
      setIsEnrolled(true)
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <img src={LogoImg} alt="StudyMate" className="h-8 w-auto" />
              <span className="text-xl font-bold text-[#1976d2] tracking-tight">StudyMate</span>
            </Link>
            <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <Link to="/courses" className="hover:text-[#1976d2]">Explore Courses</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link to="/profile" className="h-8 w-8 rounded-full bg-[#1976d2] text-white flex items-center justify-center font-bold text-xs">
                {user?.fullName?.charAt(0).toUpperCase() || 'U'}
              </Link>
            ) : (
              <Link to="/login" className="text-sm font-bold text-slate-700">Log In</Link>
            )}
          </div>
        </div>
      </header>

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
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map(i => <i key={i} className="fa-solid fa-star"></i>)}
                    </div>
                    <span className="font-bold">{mockDetailedCourse.rating}</span>
                    <span className="text-slate-400">({mockDetailedCourse.reviewCount.toLocaleString()} reviews)</span>
                  </div>
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
                  <div className="flex flex-col justify-center text-xs text-slate-400">
                    <span className="font-bold text-white">Financial aid available</span>
                    <span>1,205,400 already enrolled</span>
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
                          <span className="text-slate-400 font-bold">COURSE {idx + 1}</span>
                          <h3 className="font-bold text-slate-900">{section.title}</h3>
                        </div>
                        <i className={`fa-solid fa-chevron-${activeSection === section.id ? 'up' : 'down'} text-slate-400`}></i>
                      </button>
                      {activeSection === section.id && (
                        <div className="px-6 pb-6 pt-2 space-y-4 border-t border-slate-100">
                          <p className="text-sm text-slate-500 mb-4">In this course, you’ll be introduced to the world of data analytics through a curriculum developed by Google...</p>
                          {section.lessons.map(lesson => (
                            <div key={lesson.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                              <div className="flex items-center gap-3">
                                <i className={`fa-solid ${lesson.type === 'video' ? 'fa-circle-play text-[#1976d2]' : lesson.type === 'quiz' ? 'fa-clipboard-question text-orange-500' : 'fa-file-lines text-green-500'} w-5`}></i>
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
                  <button onClick={handleEnroll} className="w-full bg-[#1976d2] text-white py-3 rounded-md font-bold hover:bg-[#1565c0] transition-colors shadow-lg">
                    Enroll for Free
                  </button>
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
              <p className="text-xs text-slate-500 mt-1">12 / 48 lessons completed</p>
              <div className="mt-4 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-1/4"></div>
              </div>
            </div>
            
            <div className="divide-y divide-slate-100">
              {mockDetailedCourse.syllabus.map((section, sIdx) => (
                <div key={section.id}>
                  <div className="p-4 bg-slate-50/50 font-bold text-xs text-slate-400 uppercase tracking-widest flex items-center justify-between">
                    <span>Module {sIdx + 1}: {section.title}</span>
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
                              <i className={`fa-solid ${lesson.type === 'video' ? 'fa-circle-play' : lesson.type === 'quiz' ? 'fa-clipboard-question' : 'fa-file-lines'}`}></i>
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
