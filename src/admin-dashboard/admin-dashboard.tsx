import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LogoImg from '../accesory/picture/StudyMate 1.png'
import { getRevenueSummary } from '../services/paymentService'
import type { RevenueSummaryResponse } from '../services/paymentService'

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [revenueSummary, setRevenueSummary] = useState<RevenueSummaryResponse | null>(null)
  const [loading, setLoading] = useState(true)

  // Hardcoded usage data (monthly active users) - keep for now
  const usageData = [
    { month: 'Jan', users: 1250 },
    { month: 'Feb', users: 1580 },
    { month: 'Mar', users: 1920 },
    { month: 'Apr', users: 1740 },
    { month: 'May', users: 2230 },
    { month: 'Jun', users: 2680 },
  ]

  const maxUsers = Math.max(...usageData.map(d => d.users))

  // Fetch revenue summary from API
  useEffect(() => {
    const fetchRevenueSummary = async () => {
      try {
        setLoading(true)
        const data = await getRevenueSummary()
        setRevenueSummary(data)
      } catch (error) {
        console.error('Error fetching revenue summary:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRevenueSummary()
  }, [])

  // Check if user is not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Please log in to view this page.</p>
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

  // Check if user is admin (case-insensitive)
  const isAdmin = user?.role?.toLowerCase() === 'admin'
  
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Access Denied. Admin only.</p>
          <Link
            to="/"
            className="inline-block rounded-md bg-[#1976d2] px-6 py-2 text-sm font-semibold text-white shadow hover:bg-[#145ca5] transition-colors"
          >
            Go to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 h-screen transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full w-64 bg-white shadow-xl border-r border-slate-200 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Management</h2>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <i className="fa-solid fa-times text-slate-600"></i>
            </button>
          </div>

          {/* Sidebar Menu */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/user-management"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#e3f2fd] text-slate-700 hover:text-[#1976d2] transition-colors group"
                  onClick={() => setSidebarOpen(false)}
                >
                  <i className="fa-solid fa-users-gear text-lg"></i>
                  <span className="font-medium">User Management</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/course-management"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-50 text-slate-700 hover:text-purple-600 transition-colors group"
                  onClick={() => setSidebarOpen(false)}
                >
                  <i className="fa-solid fa-book text-lg"></i>
                  <span className="font-medium">Course Management</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/payment-management"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-50 text-slate-700 hover:text-green-600 transition-colors group"
                  onClick={() => setSidebarOpen(false)}
                >
                  <i className="fa-solid fa-credit-card text-lg"></i>
                  <span className="font-medium">Payment Management</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/content-management"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-orange-50 text-slate-700 hover:text-orange-600 transition-colors group"
                  onClick={() => setSidebarOpen(false)}
                >
                  <i className="fa-solid fa-file-lines text-lg"></i>
                  <span className="font-medium">Content Management</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/reports"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-cyan-50 text-slate-700 hover:text-cyan-600 transition-colors group"
                  onClick={() => setSidebarOpen(false)}
                >
                  <i className="fa-solid fa-chart-bar text-lg"></i>
                  <span className="font-medium">Reports & Analytics</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin-settings"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors group"
                  onClick={() => setSidebarOpen(false)}
                >
                  <i className="fa-solid fa-gear text-lg"></i>
                  <span className="font-medium">Settings</span>
                </Link>
              </li>
            </ul>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-[#1976d2] flex items-center justify-center">
                <i className="fa-solid fa-user text-white"></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{user.fullName || 'Admin'}</p>
                <p className="text-xs text-slate-500 truncate">{user.role}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                title="Open Menu"
              >
                <i className="fa-solid fa-bars text-xl text-slate-600"></i>
              </button>
              <Link to="/" className="flex items-center gap-3">
                <img
                  src={LogoImg}
                  alt="StudyMate Logo"
                  className="h-10 w-auto object-contain"
                />
                <span className="text-xl font-semibold tracking-tight text-[#1976d2]">
                  StudyMate Admin
                </span>
              </Link>
            </div>
            
            <div className="flex items-center gap-4">
              <Link to="/profile" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                Profile
              </Link>
              <button 
                onClick={() => logout()}
                className="px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors border border-red-100"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-600 mt-1">Welcome back, {user.fullName || 'Admin'}!</p>
        </div>

        {/* Stats Cards */}
        {loading ? (
          <div className="text-center py-8">
            <i className="fa-solid fa-spinner fa-spin text-3xl text-[#1976d2]"></i>
            <p className="text-slate-600 mt-3">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Users</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">1,234</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <i className="fa-solid fa-users text-2xl text-[#1976d2]"></i>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Tổng doanh thu</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">
                    {revenueSummary ? new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(revenueSummary.totalRevenue) : '0 ₫'}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <i className="fa-solid fa-dollar-sign text-2xl text-green-600"></i>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Tổng giao dịch</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">
                    {revenueSummary?.totalTransactions.toLocaleString() || 0}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    {revenueSummary?.paidTransactions || 0} thành công
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <i className="fa-solid fa-receipt text-2xl text-[#1976d2]"></i>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Doanh thu tháng này</p>
                  <p className="text-2xl font-bold text-slate-900 mt-2">
                    {revenueSummary ? new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(revenueSummary.revenueThisMonth) : '0 ₫'}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    +{revenueSummary?.monthOverMonthGrowthPercent.toFixed(1) || 0}%
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <i className="fa-solid fa-chart-line text-2xl text-purple-600"></i>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          {revenueSummary && revenueSummary.revenueByMonth.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <i className="fa-solid fa-chart-bar text-[#1976d2]"></i>
                Doanh thu theo tháng
              </h2>
              <div className="space-y-4">
                {revenueSummary.revenueByMonth.map((data, index) => {
                  const maxRevenue = Math.max(...revenueSummary.revenueByMonth.map(d => d.totalRevenue))
                  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                  return (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-12 text-sm font-medium text-slate-600">
                        {monthNames[data.month - 1]}
                      </div>
                      <div className="flex-1 bg-slate-100 rounded-full h-8 relative overflow-hidden">
                        <div 
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#1976d2] to-[#64b5f6] rounded-full flex items-center justify-end pr-3 transition-all duration-500"
                          style={{ width: `${(data.totalRevenue / maxRevenue) * 100}%` }}
                        >
                          <span className="text-xs font-bold text-white">
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                            }).format(data.totalRevenue)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Usage Chart */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <i className="fa-solid fa-chart-line text-[#1976d2]"></i>
              Monthly Active Users
            </h2>
            <div className="space-y-4">
              {usageData.map((data, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-12 text-sm font-medium text-slate-600">{data.month}</div>
                  <div className="flex-1 bg-slate-100 rounded-full h-8 relative overflow-hidden">
                    <div 
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#4caf50] to-[#81c784] rounded-full flex items-center justify-end pr-3 transition-all duration-500"
                      style={{ width: `${(data.users / maxUsers) * 100}%` }}
                    >
                      <span className="text-xs font-bold text-white">{data.users.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard
