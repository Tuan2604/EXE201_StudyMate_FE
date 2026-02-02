import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LogoImg from '../accesory/picture/StudyMate 1.png'

const Profile: React.FC = () => {
  const { user, logout } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Please log in to view your profile.</p>
          <Link
            to="/login"
            className="inline-block rounded-md bg-[#1976d2] px-6 py-2 text-sm font-semibold text-white shadow hover:bg-[#145ca5] transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-200">
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
            </nav>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Banner/Cover */}
          <div className="h-32 bg-gradient-to-r from-[#1976d2] to-[#64b5f6]"></div>

          <div className="px-8 pb-8">
            {/* Avatar Section */}
            <div className="relative flex justify-between items-end -mt-12 mb-6">
              <div className="h-24 w-24 rounded-full ring-4 ring-white bg-white flex items-center justify-center shadow-md overflow-hidden">
                <div className="h-full w-full bg-[#e3f2fd] flex items-center justify-center text-[#1976d2] text-3xl font-bold">
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : <i className="fa-solid fa-user"></i>}
                </div>
              </div>
              <button 
                onClick={() => logout()}
                className="mb-2 px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors border border-red-100"
              >
                Logout
              </button>
            </div>

            {/* User Info */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900">{user.fullName || 'User'}</h1>
              <p className="text-slate-500 font-medium capitalize flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded bg-[#e3f2fd] text-[#1976d2] text-xs font-semibold border border-[#bbdefb]">
                  {user.role || 'Student'}
                </span>
                <span className="text-sm">{user.email}</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">
                  Personal Information
                </h3>
                
                <div className="space-y-4">
                  <div className="group">
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 group-hover:border-[#bbdefb] transition-colors">
                      <span className="text-slate-400"><i className="fa-regular fa-user"></i></span>
                      <span className="text-slate-800 font-medium">{user.fullName}</span>
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 group-hover:border-[#bbdefb] transition-colors">
                      <span className="text-slate-400"><i className="fa-regular fa-envelope"></i></span>
                      <span className="text-slate-800 font-medium">{user.email}</span>
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                      Account Type
                    </label>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 group-hover:border-[#bbdefb] transition-colors">
                      <span className="text-slate-400"><i className="fa-solid fa-id-badge"></i></span>
                      <span className="text-slate-800 font-medium capitalize">{user.role || 'Student'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Stats / Additional Info */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">
                  Learning Statistics
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-[#e3f2fd] to-white border border-[#bbdefb] text-center">
                    <div className="text-2xl font-bold text-[#1976d2] mb-1">0</div>
                    <div className="text-xs font-medium text-slate-600">Courses Enrolled</div>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-[#e8f5e9] to-white border border-[#c8e6c9] text-center">
                    <div className="text-2xl font-bold text-[#2e7d32] mb-1">0</div>
                    <div className="text-xs font-medium text-slate-600">Completed</div>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-[#fff3e0] to-white border border-[#ffe0b2] text-center">
                    <div className="text-2xl font-bold text-[#ef6c00] mb-1">0</div>
                    <div className="text-xs font-medium text-slate-600">Certificates</div>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-[#f3e5f5] to-white border border-[#e1bee7] text-center">
                    <div className="text-2xl font-bold text-[#7b1fa2] mb-1">0h</div>
                    <div className="text-xs font-medium text-slate-600">Learning Hours</div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-100">
                  <h4 className="font-medium text-[#1976d2] mb-2 flex items-center gap-2">
                    <i className="fa-solid fa-crown"></i> Membership Status
                  </h4>
                  <p className="text-sm text-slate-600 mb-3">
                    You are currently on the <span className="font-semibold">Free Plan</span>.
                  </p>
                  <Link 
                    to="/membership" 
                    className="block w-full py-2 text-center text-sm font-semibold text-white bg-[#1976d2] rounded-md hover:bg-[#1565c0] transition-colors"
                  >
                    Upgrade Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Profile
