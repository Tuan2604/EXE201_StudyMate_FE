
import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { CourseProvider } from './contexts/CourseContext'
import Home from './home'
import StudentCourses from './home/StudentCourses'
import CourseDetail from './home/CourseDetail'
import TeacherCourses from './home/TeacherCourses'
import GamePage from './game/GamePage'
import { useAuth } from './contexts/AuthContext'
import Login from './login/login'
import Register from './register/register'
import ForgotPassword from './forgot-password/forgot-password'
import ChangePassword from './change-password/change-password'
import Membership from './membership/membership'
import Profile from './profile/profile'
import CreateNewCourse from './create-new-course/create-new-course'
import Curriculum from './create-new-course/curriculum'
import QuizSetup from './create-new-course/quiz-setup'
import Flashcards from './create-new-course/flashcards'
import AdminDashboard from './admin-dashboard/admin-dashboard'
import UserManagement from './user-management/user-management'
import CourseManagement from './course-management/course-management'
import Payment from './payment/payment'
import PaymentSuccess from './payment/payment-success'
import PaymentCancel from './payment/payment-cancel'
import AIChat from './chatbot/AIChat'
import CommunityPage from './community/CommunityPage'
import PostDetail from './community/PostDetail'

// Layout component to provide course context
import { Outlet } from 'react-router-dom'
const CourseCreationLayout = () => (
  <CourseProvider>
    <Outlet />
  </CourseProvider>
)

const CoursesRouter = () => {
  const { user } = useAuth()
  const isTeacher = user?.role?.toLowerCase() === 'teacher' || user?.role?.toLowerCase() === 'lecturer'
  
  if (isTeacher) {
    return <TeacherCourses />
  }
  return <StudentCourses />
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<CoursesRouter />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/game" element={<GamePage />} />
            <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/course-management" element={<CourseManagement />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/community/:postId" element={<PostDetail />} />
          
          {/* Payment Routes */}
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/cancel" element={<PaymentCancel />} />
          
          {/* Course Creation Routes wrapped in Provider */}
          <Route element={<CourseCreationLayout />}>
            <Route path="/create-new-course" element={<CreateNewCourse />} />
            <Route path="/create-new-course/curriculum" element={<Curriculum />} />
            <Route path="/create-new-course/quiz-setup" element={<QuizSetup />} />
            <Route path="/create-new-course/flashcards" element={<Flashcards />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        {/* AI Chat - Available on all pages */}
        <AIChat />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
