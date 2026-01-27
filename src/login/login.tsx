import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LogoImg from '../accesory/picture/StudyMate 1.png'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [userName, setUserName] = useState('')

  const { login } = useAuth()
  const navigate = useNavigate()

  const decodeToken = (token: string) => {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
          })
          .join('')
      )
      return JSON.parse(jsonPayload)
    } catch (error) {
      console.error('Error decoding token:', error)
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('https://localhost:7259/api/Auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const responseData = await response.json()
        const data = responseData.data || responseData

        const name = data?.user?.fullName || 'User'
        
        setUserName(name)
        setShowToast(true)
        login(data.accessToken || data.token, data.user)
        
        // Wait for 1.5s before redirecting
        setTimeout(() => {
          navigate('/')
        }, 1500)
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Login failed')
      }
    } catch (err) {
      setError('Network error or server not reachable')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col items-center justify-center px-4 relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-5 right-5 z-50 flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow-xl border-l-4 border-green-500 animate-[slideIn_0.5s_ease-out]">
          <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg">
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
            </svg>
            <span className="sr-only">Check icon</span>
          </div>
          <div className="ml-3 text-sm font-normal text-gray-900">
            Welcome back, <span className="font-bold text-[#1976d2]">{userName}</span>!
          </div>
        </div>
      )}

      <div className="mb-10 flex flex-col items-center space-y-3">
        {/* Brand logo image */}
        <div className="flex items-center justify-center">
          <img
            src={LogoImg}
            alt="StudyMate Logo"
            className="h-16 w-auto object-contain drop-shadow-md mr-4"
          />
        </div>
        <p className="text-sm text-gray-600">Start your learning journey today</p>
      </div>

      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-gray-200 px-10 py-8">
        <h2 className="text-xl font-semibold text-gray-900">Welcome Back</h2>
        <p className="mt-1 text-xs text-gray-500">
          Sign in to continue your learning journey
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-700">
              Email
            </label>
            <div className="flex items-center rounded-md border border-gray-300 px-3 py-2 text-sm focus-within:border-[#1976d2] focus-within:ring-1 focus-within:ring-[#1976d2]">
              <span className="mr-2 text-gray-400">
                <i className="fa-regular fa-envelope" />
              </span>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full border-none outline-none text-gray-800 placeholder:text-gray-400 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-700">
              Password
            </label>
            <div className="flex items-center rounded-md border border-gray-300 px-3 py-2 text-sm focus-within:border-[#1976d2] focus-within:ring-1 focus-within:ring-[#1976d2]">
              <span className="mr-2 text-gray-400">
                <i className="fa-solid fa-lock" />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full border-none outline-none text-gray-800 placeholder:text-gray-400 text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <div className="mt-1 flex items-center justify-between text-xs">
            <label className="inline-flex items-center space-x-2 text-gray-600">
              <input
                type="checkbox"
                className="h-3 w-3 rounded border-gray-300 text-[#1976d2] focus:ring-[#1976d2]"
              />
              <span>Remember me</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-[11px] font-medium text-[#1976d2] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="mt-4 w-full rounded-md bg-[#1976d2] py-2 text-sm font-medium text-white shadow hover:bg-[#145ca5] transition-colors"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <div className="mt-4 flex items-center">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="mx-3 text-[10px] text-gray-400">
              OR CONTINUE WITH
            </span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <button
            type="button"
            className="mt-3 flex w-full items-center justify-center space-x-2 rounded-md border border-gray-300 bg-white py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            <span className="text-[#ea4335] text-base">G</span>
            <span>Continue with Google</span>
          </button>
        </form>

        <p className="mt-5 text-center text-[11px] text-gray-500">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-[#1976d2] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login

