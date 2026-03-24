
import React, { useEffect, useState } from 'react';
import MainHeader from '../components/MainHeader';

interface Course {
  id: number;
  title: string;
  description: string;
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

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        const rawUser = localStorage.getItem('user');
        let role = '';

        try {
          role = JSON.parse(rawUser || '{}')?.role?.toLowerCase?.() || '';
        } catch {
          role = '';
        }

        const isAdmin = role === 'admin';
        const endpoint = isAdmin
          ? 'https://localhost:7259/api/Course/admin/all'
          : 'https://localhost:7259/api/Course/all';

        const response = await fetch(endpoint, {
          headers: isAdmin && token
            ? { Authorization: `Bearer ${token}` }
            : undefined,
        });

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
      <MainHeader />

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
