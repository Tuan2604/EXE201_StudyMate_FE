import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LogoImg from '../accesory/picture/StudyMate 1.png'

interface User {
  id: number
  fullName: string
  email: string
  role: string
  isBanned: boolean
  createdAt: string
}

const UserManagement: React.FC = () => {
  const { user, logout } = useAuth()
  
  // Fetch users from API
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://localhost:7259/api/Users')
        if (response.ok) {
          const data = await response.json()
          setUsers(data)
        } else {
          setError('Failed to fetch users')
        }
      } catch (err) {
        setError('Network error')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleStatusToggle = async (userId: number, currentBanned: boolean) => {
    try {
      const endpoint = currentBanned ? 'unban' : 'ban'
      const response = await fetch(`https://localhost:7259/api/Users/${userId}/${endpoint}`, {
        method: 'PUT',
      })

      if (response.ok) {
        // Update local state
        setUsers(users.map(u => 
          u.id === userId ? { ...u, isBanned: !u.isBanned } : u
        ))
      } else {
        alert(`Failed to ${endpoint} user`)
      }
    } catch (err) {
      console.error(err)
      alert('Network error')
    }
  }

  const handleDeleteUser = (userId: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== userId))
    }
  }

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
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4">
          <div className="h-16 flex items-center justify-between">
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
            
            <div className="flex items-center gap-4">
              <Link to="/admin-dashboard" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                Dashboard
              </Link>
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
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Link to="/admin-dashboard" className="text-slate-400 hover:text-slate-600 transition-colors">
              <i className="fa-solid fa-arrow-left"></i>
            </Link>
            <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
          </div>
          <p className="text-slate-600">Manage all users in the system</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Users</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {loading ? '...' : users.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <i className="fa-solid fa-users text-2xl text-[#1976d2]"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Active Users</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {loading ? '...' : users.filter(u => !u.isBanned).length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <i className="fa-solid fa-user-check text-2xl text-green-600"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Banned Users</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {loading ? '...' : users.filter(u => u.isBanned).length}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <i className="fa-solid fa-user-slash text-2xl text-red-600"></i>
              </div>
            </div>
          </div>
        </div>

        {/* User Management Table */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-[#1976d2] to-[#64b5f6] px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <i className="fa-solid fa-users-gear"></i>
              All Users
            </h2>
          </div>
          
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">ID</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Full Name</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Email</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Role</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Joined</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center">
                        <i className="fa-solid fa-spinner fa-spin text-3xl text-[#1976d2] mb-2"></i>
                        <p className="text-slate-500">Loading users...</p>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center">
                        <i className="fa-solid fa-exclamation-circle text-3xl text-red-500 mb-2"></i>
                        <p className="text-red-600">{error}</p>
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center">
                        <i className="fa-solid fa-users text-5xl text-slate-300 mb-4"></i>
                        <p className="text-slate-500">No users found</p>
                      </td>
                    </tr>
                  ) : (
                    users.map((userData, index) => {
                      const status = userData.isBanned ? 'Inactive' : 'Active'
                      const joinedDate = new Date(userData.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      })
                      const roleDisplay = userData.role.charAt(0).toUpperCase() + userData.role.slice(1)
                      
                      return (
                        <tr key={userData.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                          <td className="py-4 px-4 text-sm text-slate-900 font-medium">#{userData.id}</td>
                          <td className="py-4 px-4 text-sm text-slate-900 font-medium">{userData.fullName}</td>
                          <td className="py-4 px-4 text-sm text-slate-600">{userData.email}</td>
                          <td className="py-4 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              userData.role.toLowerCase() === 'teacher' || userData.role.toLowerCase() === 'lecturer'
                                ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                : userData.role.toLowerCase() === 'admin'
                                ? 'bg-orange-100 text-orange-700 border border-orange-200'
                                : 'bg-blue-100 text-[#1976d2] border border-blue-200'
                            }`}>
                              {roleDisplay}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              status === 'Active' 
                                ? 'bg-green-100 text-green-700 border border-green-200' 
                                : 'bg-red-100 text-red-700 border border-red-200'
                            }`}>
                              {status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-sm text-slate-600">{joinedDate}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={() => handleStatusToggle(userData.id, userData.isBanned)}
                                className="px-3 py-1.5 bg-[#e3f2fd] text-[#1976d2] text-xs font-semibold rounded-md hover:bg-[#bbdefb] transition-colors"
                                title={status === 'Active' ? 'Ban User' : 'Unban User'}
                              >
                                <i className={`fa-solid ${status === 'Active' ? 'fa-ban' : 'fa-check'}`}></i>
                              </button>
                              <button 
                                className="px-3 py-1.5 bg-yellow-50 text-yellow-700 text-xs font-semibold rounded-md hover:bg-yellow-100 transition-colors border border-yellow-200"
                                title="Edit User"
                              >
                                <i className="fa-solid fa-pen"></i>
                              </button>
                              <button 
                                onClick={() => handleDeleteUser(userData.id)}
                                className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-md hover:bg-red-100 transition-colors border border-red-200"
                                title="Delete User"
                              >
                                <i className="fa-solid fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default UserManagement
