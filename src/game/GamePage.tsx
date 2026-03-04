import React, { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LogoImg from '../accesory/picture/StudyMate 1.png'
import { gameQuestions } from './data'

const GamePage: React.FC = () => {
  const navigate = useNavigate()

  // Game States
  const [gameState, setGameState] = useState<'start' | 'playing' | 'result'>('start')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [, setIsCorrect] = useState<boolean | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)

  const currentQuestion = gameQuestions[currentQuestionIndex]

  // Start the game
  const startGame = () => {
    setGameState('playing')
    setCurrentQuestionIndex(0)
    setScore(0)
    setStreak(0)
    setTimeLeft(gameQuestions[0].timeLimit)
    setIsAnswered(false)
    setSelectedOption(null)
  }

  // Handle Answer Submission
  const handleAnswer = useCallback((optionIndex: number) => {
    if (isAnswered) return
    
    setIsAnswered(true)
    setSelectedOption(optionIndex)
    
    const correct = optionIndex === currentQuestion.correctAnswer
    setIsCorrect(correct)
    
    if (correct) {
      const bonus = Math.floor(timeLeft * 10) // Speed bonus
      const pointsGained = currentQuestion.points + bonus
      setScore(prev => prev + pointsGained)
      setStreak(prev => prev + 1)
    } else {
      setStreak(0)
    }

    // Wait 1.5s before moving to next question
    setTimeout(() => {
      const nextIndex = currentQuestionIndex + 1
      if (nextIndex < gameQuestions.length) {
        setCurrentQuestionIndex(nextIndex)
        setTimeLeft(gameQuestions[nextIndex].timeLimit)
        setIsAnswered(false)
        setSelectedOption(null)
        setIsCorrect(null)
      } else {
        setGameState('result')
      }
    }, 1500)
  }, [currentQuestionIndex, isAnswered, timeLeft, currentQuestion])

  // Timer logic
  useEffect(() => {
    let timer: any
    if (gameState === 'playing' && timeLeft > 0 && !isAnswered) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && gameState === 'playing' && !isAnswered) {
      // Time's up! Treat as wrong answer
      handleAnswer(-1)
    }
    return () => clearInterval(timer)
  }, [gameState, timeLeft, isAnswered, handleAnswer])

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Header */}
      <header className="h-16 px-6 border-b border-white/10 flex items-center justify-between bg-slate-800 shadow-xl z-10">
        <div className="flex items-center gap-3">
          <Link to="/">
            <img src={LogoImg} alt="StudyMate" className="h-8 w-auto" />
          </Link>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Quiz Sprint
          </span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Score</span>
            <span className="text-xl font-black text-yellow-400">{score.toLocaleString()}</span>
          </div>
          <div className="h-10 w-px bg-white/10 hidden sm:block"></div>
          <button 
            onClick={() => navigate('/')}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>
      </header>

      {/* Game Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        {gameState === 'start' && (
          <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="space-y-4">
              <div className="h-24 w-24 bg-blue-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-blue-500/20 rotate-12">
                <i className="fa-solid fa-bolt text-5xl text-white"></i>
              </div>
              <h1 className="text-5xl font-black tracking-tight">QUIZ SPRINT</h1>
              <p className="text-slate-400 max-w-sm mx-auto">
                Trả lời nhanh để ghi điểm cao nhất. Bạn đã sẵn sàng để thử thách trí tuệ?
              </p>
            </div>
            
            <div className="space-y-4 pt-8">
              <button 
                onClick={startGame}
                className="w-full sm:w-64 bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-black text-xl shadow-xl shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
              >
                PLAY NOW
              </button>
              <div className="flex justify-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <span>5 Questions</span>
                <span>•</span>
                <span>Time Bonus</span>
                <span>•</span>
                <span>Streak x2</span>
              </div>
            </div>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="w-full max-w-4xl space-y-8 animate-in slide-in-from-bottom-8 duration-500">
            {/* Stats Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-slate-800 flex items-center justify-center text-xl font-bold border border-white/10">
                  {currentQuestionIndex + 1}/{gameQuestions.length}
                </div>
                {streak > 1 && (
                  <div className="bg-orange-600 px-3 py-1 rounded-full text-xs font-black animate-bounce">
                    🔥 STREAK {streak}
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <i className="fa-solid fa-clock text-blue-400"></i>
                <div className="w-48 h-3 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className={`h-full transition-all duration-1000 ${timeLeft < 5 ? 'bg-red-500' : 'bg-blue-500'}`}
                    style={{ width: `${(timeLeft / currentQuestion.timeLimit) * 100}%` }}
                  ></div>
                </div>
                <span className={`text-xl font-bold w-8 ${timeLeft < 5 ? 'text-red-500 animate-pulse' : 'text-blue-400'}`}>
                  {timeLeft}s
                </span>
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-slate-800 p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50"></div>
              <h2 className="text-3xl md:text-4xl font-bold text-center leading-tight py-6">
                {currentQuestion.question}
              </h2>
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option, idx) => {
                let statusClass = "bg-slate-800 border-white/10 hover:border-blue-500 hover:bg-slate-700"
                if (isAnswered) {
                  if (idx === currentQuestion.correctAnswer) statusClass = "bg-green-600 border-green-400 scale-[1.02]"
                  else if (idx === selectedOption) statusClass = "bg-red-600 border-red-400 opacity-70"
                  else statusClass = "bg-slate-800 border-white/10 opacity-40"
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleAnswer(idx)}
                    className={`p-6 rounded-2xl border-2 text-xl font-bold transition-all flex items-center gap-4 ${statusClass} group`}
                  >
                    <span className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-white">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {option}
                    {isAnswered && idx === currentQuestion.correctAnswer && (
                      <i className="fa-solid fa-check-circle ml-auto text-2xl"></i>
                    )}
                    {isAnswered && idx === selectedOption && idx !== currentQuestion.correctAnswer && (
                      <i className="fa-solid fa-xmark-circle ml-auto text-2xl"></i>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {gameState === 'result' && (
          <div className="text-center space-y-10 animate-in zoom-in duration-500">
            <div className="space-y-4">
              <div className="h-32 w-32 bg-yellow-500 rounded-full mx-auto flex items-center justify-center shadow-2xl shadow-yellow-500/20">
                <i className="fa-solid fa-trophy text-6xl text-white"></i>
              </div>
              <h1 className="text-5xl font-black">GAME OVER!</h1>
              <p className="text-slate-400">Bạn đã hoàn thành thử thách xuất sắc.</p>
            </div>

            <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
              <div className="bg-slate-800 p-6 rounded-3xl border border-white/10">
                <span className="text-xs font-bold text-slate-500 uppercase">Final Score</span>
                <p className="text-4xl font-black text-yellow-400 mt-2">{score.toLocaleString()}</p>
              </div>
              <div className="bg-slate-800 p-6 rounded-3xl border border-white/10">
                <span className="text-xs font-bold text-slate-500 uppercase">Correct Rate</span>
                <p className="text-4xl font-black text-blue-400 mt-2">80%</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
              <button 
                onClick={startGame}
                className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-black text-xl shadow-xl shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
              >
                REPLAY
              </button>
              <button 
                onClick={() => navigate('/')}
                className="bg-slate-800 hover:bg-slate-700 text-white px-10 py-4 rounded-2xl font-black text-xl border border-white/10 transition-all hover:scale-105 active:scale-95"
              >
                HOME
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer hint */}
      {gameState === 'playing' && (
        <div className="py-6 text-center text-slate-500 text-xs font-bold uppercase tracking-widest animate-pulse">
          Trình độ: Trung cấp • Thể loại: Lập trình Web
        </div>
      )}
    </div>
  )
}

export default GamePage
