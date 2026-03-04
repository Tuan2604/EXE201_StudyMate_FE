export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
  timeLimit: number; // seconds
}

export const gameQuestions: Question[] = [
  {
    id: 1,
    question: "Ngôn ngữ nào được sử dụng phổ biến nhất cho phát triển Web Frontend?",
    options: ["Python", "Java", "JavaScript", "C++"],
    correctAnswer: 2,
    points: 100,
    timeLimit: 15
  },
  {
    id: 2,
    question: "Trong React, Hook nào được dùng để quản lý trạng thái (state)?",
    options: ["useEffect", "useContext", "useReducer", "useState"],
    correctAnswer: 3,
    points: 150,
    timeLimit: 10
  },
  {
    id: 3,
    question: "CSS là viết tắt của cụm từ nào?",
    options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"],
    correctAnswer: 1,
    points: 100,
    timeLimit: 15
  },
  {
    id: 4,
    question: "Thẻ HTML nào dùng để tạo một liên kết (link)?",
    options: ["<link>", "<a>", "<href>", "<url>"],
    correctAnswer: 1,
    points: 100,
    timeLimit: 10
  },
  {
    id: 5,
    question: "Đâu là một Framework của JavaScript?",
    options: ["Django", "Laravel", "React", "Flask"],
    correctAnswer: 2,
    points: 150,
    timeLimit: 15
  }
];
