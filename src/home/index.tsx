import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import TeacherHome from './TeacherHome'
import StudentHome from './StudentHome'

const Home: React.FC = () => {
  const { user } = useAuth()
  
  // Check if user is a teacher (case-insensitive)
  const isTeacher = user?.role?.toLowerCase() === 'teacher' || user?.role?.toLowerCase() === 'lecturer'

  if (isTeacher) {
    return <TeacherHome />
  }

  return <StudentHome />
}

export default Home
