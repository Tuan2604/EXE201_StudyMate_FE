import React from 'react'
import { Link } from 'react-router-dom'
import LogoImg from '../accesory/picture/StudyMate 1.png'

const Login: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col items-center justify-center px-4">
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

        <form className="mt-6 space-y-4">
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
              />
            </div>
          </div>

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
          >
            Sign In
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

