import React, { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

// Define the shape of your course data matching the API requirements
export interface SectionMaterial {
  title: string
  description: string
  materialType: string
  fileUrl: string
  fileName: string
  fileSize: number
  orderIndex: number
}

export interface CourseSection {
  title: string
  description: string
  orderIndex: number
  materials: SectionMaterial[]
}

export interface QuizOption {
  optionText: string
  isCorrect: boolean
}

export interface QuizQuestion {
  questionText: string
  questionType: 'multiple_choice' | 'true_false' | 'short_answer'
  options: QuizOption[]
}

export interface CourseQuiz {
  title: string
  questions: QuizQuestion[]
}

export interface CourseFlashcard {
  front: string
  back: string
}

export interface CourseData {
  title: string
  description: string
  price: number
  categoryId: number
  level: string
  duration: number
  prerequisites: string
  sections: CourseSection[]
  quizzes: CourseQuiz[]
  flashcards: CourseFlashcard[]
}

interface CourseContextType {
  courseData: CourseData
  updateCourseData: (data: Partial<CourseData>) => void
  resetCourseData: () => void
}

const CourseContext = createContext<CourseContextType | undefined>(undefined)

const initialCourseData: CourseData = {
  title: '',
  description: '',
  price: 0,
  categoryId: 0,
  level: 'beginner',
  duration: 0,
  prerequisites: '',
  sections: [],
  quizzes: [],
  flashcards: []
}

export const CourseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [courseData, setCourseData] = useState<CourseData>(initialCourseData)

  const updateCourseData = (data: Partial<CourseData>) => {
    setCourseData((prev) => ({ ...prev, ...data }))
  }

  const resetCourseData = () => {
    setCourseData(initialCourseData)
  }

  return (
    <CourseContext.Provider value={{ courseData, updateCourseData, resetCourseData }}>
      {children}
    </CourseContext.Provider>
  )
}

export const useCourse = () => {
  const context = useContext(CourseContext)
  if (!context) {
    throw new Error('useCourse must be used within a CourseProvider')
  }
  return context
}
