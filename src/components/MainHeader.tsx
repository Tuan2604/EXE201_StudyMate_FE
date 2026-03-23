import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LogoImg from '../accesory/picture/StudyMate 1.png'

const HeaderNavItem: React.FC<{ children: React.ReactNode; to?: string }> = ({ children, to = '#' }) => (
  <Link to={to} className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
    {children}
  </Link>
)

const MainHeader: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="mx-auto max-w-7xl px-4">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3">
              <img src={LogoImg} alt="StudyMate Logo" className="h-9 w-auto object-contain" />
              <span className="text-xl font-bold tracking-tight text-[#1976d2]">StudyMate</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <HeaderNavItem to="/">Home</HeaderNavItem>
              <HeaderNavItem to="/courses">Courses</HeaderNavItem>
              <HeaderNavItem to="/community">Community</HeaderNavItem>
              <HeaderNavItem to="/game">Game</HeaderNavItem>
              <HeaderNavItem to="/chat">Chat</HeaderNavItem>
              <HeaderNavItem to="/feedback">Feedback</HeaderNavItem>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/membership"
              className="hidden sm:inline-flex items-center gap-2 rounded-md border border-[#bbdefb] bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <span className="text-sm">♛</span>
              Upgrade
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to="/profile" className="flex items-center gap-3 group">
                  <div className="hidden md:flex flex-col items-end mr-2">
                    <span className="text-sm font-semibold text-slate-900 group-hover:text-[#1976d2] transition-colors">
                      {user?.fullName || 'User'}
                    </span>
                    <span className="text-[10px] text-slate-500 capitalize">
                      {user?.role || 'Student'}
                    </span>
                  </div>
                  <div className="h-9 w-9 rounded-full bg-[#1976d2] flex items-center justify-center text-white cursor-pointer group-hover:bg-[#1565c0] transition-colors">
                    <span className="font-semibold text-xs">
                      {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={async () => {
                    await logout()
                    navigate('/')
                  }}
                  className="text-sm font-semibold text-slate-500 hover:text-red-600 transition-colors ml-1"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold text-slate-700 hover:text-slate-900">
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="rounded-md bg-[#1976d2] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#145ca5] transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default MainHeader
