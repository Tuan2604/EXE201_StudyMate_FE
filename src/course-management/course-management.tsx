import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LogoImg from '../accesory/picture/StudyMate 1.png';

interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  categoryName: string;
  teacherName: string;
  teacherAvatar: string | null;
  averageRating: number;
  totalRatings: number;
  createdAt: string;
  updatedAt: string | null;
  totalSections: number;
  totalMaterials: number;
  totalQuizzes: number;
  totalQuestions: number;
  totalFlashcards: number;
  totalEnrollments: number;
}

const CourseManagement: React.FC = () => {
  const { user, logout } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('https://localhost:7259/api/Course/all');
        if (response.ok) {
          const data = await response.json();
          setCourses(data.data || []);
        } else {
          setError('Failed to fetch courses');
        }
      } catch (err) {
        setError('Network error');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

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
    );
  }

  const isAdmin = user?.role?.toLowerCase() === 'admin';
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
    );
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
            <h1 className="text-3xl font-bold text-slate-900">Course Management</h1>
          </div>
          <p className="text-slate-600">Manage all courses in the system</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Courses</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{loading ? '...' : courses.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <i className="fa-solid fa-book text-2xl text-[#1976d2]"></i>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Enrollments</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{loading ? '...' : courses.reduce((sum, c) => sum + c.totalEnrollments, 0)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <i className="fa-solid fa-user-graduate text-2xl text-green-600"></i>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Quizzes</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{loading ? '...' : courses.reduce((sum, c) => sum + c.totalQuizzes, 0)}</p>
              </div>
              <div className="p-3 bg-cyan-100 rounded-lg">
                <i className="fa-solid fa-question text-2xl text-cyan-600"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Course Table */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-[#1976d2] to-[#64b5f6] px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <i className="fa-solid fa-book"></i>
              All Courses
            </h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">ID</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Title</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Category</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Teacher</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Price</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Enrollments</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Quizzes</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center">
                        <i className="fa-solid fa-spinner fa-spin text-3xl text-[#1976d2] mb-2"></i>
                        <p className="text-slate-500">Loading courses...</p>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center">
                        <i className="fa-solid fa-exclamation-circle text-3xl text-red-500 mb-2"></i>
                        <p className="text-red-600">{error}</p>
                      </td>
                    </tr>
                  ) : courses.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center">
                        <i className="fa-solid fa-book text-5xl text-slate-300 mb-4"></i>
                        <p className="text-slate-500">No courses found</p>
                      </td>
                    </tr>
                  ) : (
                    courses.map((course, index) => {
                      const createdDate = new Date(course.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      });
                      return (
                        <tr key={course.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                          <td className="py-4 px-4 text-sm text-slate-900 font-medium">#{course.id}</td>
                          <td className="py-4 px-4 text-sm text-slate-900 font-medium">{course.title}</td>
                          <td className="py-4 px-4 text-sm text-slate-600">{course.categoryName}</td>
                          <td className="py-4 px-4 text-sm text-slate-600 flex items-center gap-2">
                            {course.teacherAvatar ? (
                              <img src={course.teacherAvatar} alt={course.teacherName} className="w-6 h-6 rounded-full object-cover" />
                            ) : (
                              <span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs text-slate-500">
                                <i className="fa-solid fa-user"></i>
                              </span>
                            )}
                            {course.teacherName}
                          </td>
                          <td className="py-4 px-4 text-sm text-slate-600">{course.price === 0 ? 'Free' : `$${course.price}`}</td>
                          <td className="py-4 px-4 text-sm text-slate-600">{course.totalEnrollments}</td>
                          <td className="py-4 px-4 text-sm text-slate-600">{course.totalQuizzes}</td>
                          <td className="py-4 px-4 text-sm text-slate-600">{createdDate}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseManagement;
