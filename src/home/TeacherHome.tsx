import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
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

const StatCard: React.FC<{
  label: string
  value: string
  icon: React.ReactNode
  color?: string
}> = ({ label, value, icon, color = 'text-[#1976d2]' }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group hover:shadow-md transition-all">
      <div className="flex justify-between items-start z-10">
        <div>
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</div>
          <div className="mt-2 text-3xl font-bold text-slate-900">{value}</div>
        </div>
        <div className={`p-2 rounded-lg bg-opacity-10 ${color.replace('text-', 'bg-')}`}>
          <div className={`text-2xl ${color}`}>{icon}</div>
        </div>
      </div>
      <div className={`absolute -right-4 -bottom-4 opacity-5 transform scale-150 rotate-12 group-hover:scale-175 transition-transform duration-500 ${color}`}>
        {icon}
      </div>
    </div>
  )
}

const CourseCard: React.FC<{
  title: string
  students: number
  earnings: string
  rating: number
  status: 'Published' | 'Draft'
}> = ({ title, students, earnings, rating, status }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-slate-900 text-lg">{title}</h3>
          <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <i className="fa-solid fa-user-group text-slate-400"></i> {students} students
            </span>
            <span className="flex items-center gap-1">
              <i className="fa-solid fa-dollar-sign text-slate-400"></i> {earnings}
            </span>
            <span className="flex items-center gap-1 text-yellow-500 font-medium">
              <i className="fa-solid fa-star"></i> {rating}
            </span>
          </div>
        </div>
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
            status === 'Published'
              ? 'bg-green-100 text-green-700'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          {status}
        </span>
      </div>
      <div className="mt-5 flex gap-2">
        <button className="px-3 py-1.5 rounded-md border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
          Edit
        </button>
        <button className="px-3 py-1.5 rounded-md border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
          Analytics
        </button>
      </div>
    </div>
  )
}

const ActivityItem: React.FC<{
  title: string
  time: string
}> = ({ title, time }) => {
  return (
    <div className="py-3 border-b border-slate-100 last:border-0">
      <p className="text-sm font-medium text-slate-800">{title}</p>
      <p className="text-[10px] text-slate-500 mt-1">{time}</p>
    </div>
  )
}

const QuickAction: React.FC<{
  label: string
  icon: React.ReactNode
}> = ({ label, icon }) => {
  return (
    <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white hover:border-[#1976d2] hover:bg-blue-50 transition-all text-left group">
      <div className="text-slate-400 group-hover:text-[#1976d2] transition-colors">{icon}</div>
      <span className="text-sm font-medium text-slate-700 group-hover:text-[#1976d2] transition-colors">
        {label}
      </span>
    </button>
  )
}

const TeacherHome: React.FC = () => {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Top nav */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-3">
                <img
                  src={LogoImg}
                  alt="StudyMate Logo"
                  className="h-9 w-auto object-contain"
                />
                <span className="text-xl font-bold tracking-tight text-[#1976d2]">
                  StudyMate
                </span>
              </Link>
              
              <div className="hidden md:flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-md">
                <span>Dashboard</span>
                <span>/</span>
                <span className="text-slate-900">Lecturer</span>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <NavItem>Home</NavItem>
              <NavItem>Courses</NavItem>
              <NavItem>AI Tutor</NavItem>
              <NavItem>Game</NavItem>
              <NavItem>Community</NavItem>
            </nav>

            <div className="flex items-center gap-4">
              <button
                type="button"
                className="hidden sm:inline-flex items-center justify-center h-9 w-9 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <i className="fa-solid fa-magnifying-glass text-sm"></i>
              </button>
              
              <Link
                to="/membership"
                className="hidden sm:inline-flex items-center gap-2 rounded-md border border-[#bbdefb] bg-white px-3 py-1.5 text-xs font-bold text-[#1976d2] hover:bg-blue-50"
              >
                <i className="fa-solid fa-crown"></i>
                Upgrade
              </Link>

              <div className="h-6 w-px bg-slate-200 mx-1"></div>

              <div className="flex items-center gap-3">
                <Link to="/profile" className="flex items-center gap-3 group">
                  <div className="hidden md:flex flex-col items-end mr-2">
                    <span className="text-sm font-bold text-slate-900 group-hover:text-[#1976d2] transition-colors">
                      {user?.fullName || 'Teacher'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium capitalize bg-slate-100 px-1.5 py-0.5 rounded">
                      {user?.role || 'Lecturer'}
                    </span>
                  </div>
                  <div className="h-9 w-9 rounded-full bg-[#1976d2] flex items-center justify-center text-white cursor-pointer shadow-md group-hover:bg-[#1565c0] transition-all ring-2 ring-white ring-offset-1 ring-offset-slate-100">
                    <span className="font-bold text-sm">
                      {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'T'}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={() => logout()}
                  className="text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors ml-1"
                >
                  <i className="fa-solid fa-right-from-bracket text-lg"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">
              Welcome back, <span className="text-[#1976d2]">{user?.fullName || 'Teacher'}</span>!
            </h1>
            <p className="mt-1 text-slate-500">Manage your courses and track student progress</p>
          </div>
          <Link 
            to="/create-new-course"
            className="inline-flex items-center gap-2 bg-[#1976d2] text-white px-5 py-2.5 rounded-lg font-semibold shadow-lg hover:bg-[#1565c0] hover:shadow-xl transition-all transform hover:-translate-y-0.5"
          >
            <i className="fa-solid fa-plus"></i> Create New Course
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            label="Total Courses" 
            value="12" 
            icon={<i className="fa-solid fa-book-open"></i>} 
            color="text-blue-600"
          />
          <StatCard 
            label="Total Students" 
            value="1,234" 
            icon={<i className="fa-solid fa-users"></i>} 
            color="text-green-600"
          />
          <StatCard 
            label="Revenue" 
            value="$5,430" 
            icon={<i className="fa-solid fa-dollar-sign"></i>} 
            color="text-purple-600"
          />
          <StatCard 
            label="Avg Rating" 
            value="4.8" 
            icon={<i className="fa-solid fa-star"></i>} 
            color="text-yellow-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Courses */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Your Courses</h2>
              <button className="text-sm font-semibold text-[#1976d2] hover:text-[#1565c0] hover:underline">
                View All
              </button>
            </div>

            <div className="space-y-4">
              <CourseCard 
                title="Advanced React Patterns" 
                students={156} 
                earnings="$5,780" 
                rating={4.9} 
                status="Published" 
              />
              <CourseCard 
                title="TypeScript Fundamentals" 
                students={89} 
                earnings="$2,340" 
                rating={4.8} 
                status="Published" 
              />
              <CourseCard 
                title="Node.js Masterclass" 
                students={210} 
                earnings="$8,900" 
                rating={4.9} 
                status="Published" 
              />
              <CourseCard 
                title="Database Design for Beginners" 
                students={0} 
                earnings="$0" 
                rating={0} 
                status="Draft" 
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Recent Activity */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <i className="fa-solid fa-chart-line text-[#1976d2]"></i>
                <h3 className="font-bold text-slate-900">Recent Activity</h3>
              </div>
              <div className="space-y-1">
                <ActivityItem title="New enrollment in Advanced React Patterns" time="2 hours ago" />
                <ActivityItem title="5-star review on TypeScript Fundamentals" time="5 hours ago" />
                <ActivityItem title="Course completion: Node.js Masterclass" time="1 day ago" />
                <ActivityItem title="3 new comments on Database Design" time="2 days ago" />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <QuickAction label="Create New Course" icon={<i className="fa-solid fa-book-medical"></i>} />
                <QuickAction label="AI Chatbot" icon={<i className="fa-solid fa-robot"></i>} />
                <QuickAction label="Community Discussions" icon={<i className="fa-solid fa-comments"></i>} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default TeacherHome
