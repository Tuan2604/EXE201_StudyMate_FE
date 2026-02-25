
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


const NavItem: React.FC<{ children: React.ReactNode; to?: string }> = ({ children, to }) => {
  if (to) {
    return (
      <Link
        to={to}
        className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
      >
        {children}
      </Link>
    );
  }
  return (
    <span className="text-sm text-slate-600 hover:text-slate-900 transition-colors cursor-default">{children}</span>
  );
};

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated, logout, user } = useAuth();

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

  return (
    <div className="min-h-screen bg-white">
      {/* Top nav */}
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
              <NavItem to="/">Home</NavItem>
              <NavItem to="/courses">Courses</NavItem>
              <NavItem>AI Tutor</NavItem>
              <NavItem>Game</NavItem>
              <NavItem>Community</NavItem>
            </nav>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="hidden sm:inline-flex items-center justify-center h-9 w-9 rounded-full bg-[#e3f2fd] text-[#1976d2] border border-[#bbdefb]"
                aria-label="Search"
              >
                <span className="text-sm">⌕</span>
              </button>
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
                    <div className="h-8 w-8 rounded-full bg-[#1976d2] flex items-center justify-center text-white cursor-pointer group-hover:bg-[#1565c0] transition-colors">
                      <span className="font-semibold text-xs">
                        {user?.fullName ? user.fullName.charAt(0).toUpperCase() : <i className="fa-solid fa-user"></i>}
                      </span>
                    </div>
                  </Link>
                  <button
                    onClick={() => logout()}
                    className="text-xs font-medium text-slate-500 hover:text-red-600 transition-colors ml-1"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-semibold text-slate-700 hover:text-slate-900"
                  >
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

      <div className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">All Courses</h1>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <i className="fa-solid fa-spinner fa-spin text-3xl text-[#1976d2] mr-3"></i>
            <span className="text-slate-600">Loading courses...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center py-20">
            <i className="fa-solid fa-exclamation-circle text-3xl text-red-500 mb-2"></i>
            <span className="text-red-600">{error}</span>
          </div>
        ) : courses.length === 0 ? (
          <div className="flex flex-col items-center py-20">
            <i className="fa-solid fa-book text-5xl text-slate-300 mb-4"></i>
            <span className="text-slate-500">No courses found</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map(course => (
              <div key={course.id} className="bg-white rounded-xl shadow-md border border-slate-200 p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#e3f2fd] flex items-center justify-center">
                    <i className="fa-solid fa-book text-xl text-[#1976d2]"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-900 truncate">{course.title}</div>
                    <div className="text-xs text-slate-500 truncate">{course.categoryName}</div>
                  </div>
                </div>
                <div className="text-sm text-slate-700 mb-2 line-clamp-2">{course.description}</div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                  <span>By</span>
                  {course.teacherAvatar ? (
                    <img src={course.teacherAvatar} alt={course.teacherName} className="w-5 h-5 rounded-full object-cover" />
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] text-slate-500">
                      <i className="fa-solid fa-user"></i>
                    </span>
                  )}
                  <span className="font-medium text-slate-700">{course.teacherName}</span>
                </div>
                <div className="flex items-center gap-4 mt-auto">
                  <span className="text-[#1976d2] font-bold text-lg">{course.price === 0 ? 'Free' : `$${course.price}`}</span>
                  <span className="text-xs text-slate-500">{course.totalEnrollments} enrolled</span>
                  <span className="ml-auto flex items-center gap-1 text-xs text-yellow-500">
                    <i className="fa-solid fa-star"></i>
                    {course.averageRating.toFixed(1)}
                    <span className="text-slate-400">({course.totalRatings})</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
