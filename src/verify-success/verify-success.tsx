import React from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import LogoImg from '../accesory/picture/StudyMate 1.png'

const VerifySuccess: React.FC = () => {
  const [searchParams] = useSearchParams()

  const isSuccess = searchParams.get('success') === 'true'
  const message = searchParams.get('message') || (isSuccess
    ? 'Email verified successfully! Your account has been created.'
    : 'Email verification failed.')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <img src={LogoImg} alt="StudyMate" className="h-8 w-auto" />
              <span className="text-xl font-bold text-[#1976d2]">StudyMate</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className={`text-center px-8 py-12 ${isSuccess ? 'bg-gradient-to-br from-green-50 to-blue-50' : 'bg-gradient-to-br from-red-50 to-orange-50'}`}>
            <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 ${isSuccess ? 'bg-green-500' : 'bg-red-500'}`}>
              {isSuccess ? (
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-3">
              {isSuccess ? 'Xác thực email thành công!' : 'Xác thực email thất bại'}
            </h1>
            <p className="text-slate-600">{message}</p>
          </div>

          <div className="px-8 py-6">
            {isSuccess ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-2">Bước tiếp theo</h3>
                <p className="text-sm text-slate-600">Đăng nhập để bắt đầu sử dụng StudyMate.</p>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-2">Gợi ý</h3>
                <p className="text-sm text-slate-600">Liên kết có thể đã hết hạn hoặc đã được sử dụng. Vui lòng đăng ký lại để nhận liên kết mới.</p>
              </div>
            )}

            <div className="flex gap-4">
              <Link
                to="/"
                className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium text-center"
              >
                Về trang chủ
              </Link>
              <Link
                to={isSuccess ? '/login' : '/register'}
                className="flex-1 px-6 py-3 bg-[#1976d2] text-white rounded-lg hover:bg-[#1565c0] transition font-medium text-center"
              >
                {isSuccess ? 'Đăng nhập' : 'Đăng ký lại'}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default VerifySuccess