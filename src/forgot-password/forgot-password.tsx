import React from 'react'
import { Link } from 'react-router-dom'
import LogoImg from '../accesory/picture/StudyMate 1.png'

const ForgotPassword: React.FC = () => {
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
        <h2 className="text-xl font-semibold text-gray-900">Forgot Password</h2>
        <p className="mt-1 text-xs text-gray-500">
          Enter your email to receive an OTP to reset your password
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

          <button
            type="submit"
            className="mt-4 w-full rounded-md bg-[#1976d2] py-2 text-sm font-medium text-white shadow hover:bg-[#145ca5] transition-colors"
          >
            Send OTP
          </button>
        </form>

        <p className="mt-5 text-center text-[11px] text-gray-500">
          Remember your password?{' '}
          <Link
            to="/login"
            className="font-medium text-[#1976d2] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default ForgotPassword
