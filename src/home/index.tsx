import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LogoImg from '../accesory/picture/StudyMate 1.png'
import BanerImg from '../accesory/picture/Students learning together.png'

const NavItem: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <a
      href="#"
      className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
    >
      {children}
    </a>
  )
}

const Stat: React.FC<{ value: string; label: string }> = ({ value, label }) => {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-[#1976d2]">{value}</div>
      <div className="mt-1 text-[11px] text-slate-500">{label}</div>
    </div>
  )
}

const FeatureCard: React.FC<{
  title: string
  desc: string
  icon: React.ReactNode
}> = ({ title, desc, icon }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="h-10 w-10 rounded-lg bg-[#e3f2fd] text-[#1976d2] flex items-center justify-center">
        {icon}
      </div>
      <div className="mt-4 text-sm font-semibold text-slate-900">{title}</div>
      <div className="mt-2 text-xs leading-5 text-slate-600">{desc}</div>
    </div>
  )
}

const Home: React.FC = () => {
  const { isAuthenticated, logout } = useAuth()
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
              <NavItem>Home</NavItem>
              <NavItem>Courses</NavItem>
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
                  <button
                    onClick={() => logout()}
                    className="text-sm font-semibold text-slate-700 hover:text-slate-900"
                  >
                    Logout
                  </button>
                  <div className="h-8 w-8 rounded-full bg-[#1976d2] flex items-center justify-center text-white">
                    <i className="fa-solid fa-user"></i>
                  </div>
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

      {/* Hero */}
      <main>
        <section className="bg-gradient-to-b from-[#eef6ff] to-white border-b border-slate-200">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="text-[11px] font-semibold text-[#1976d2] flex items-center gap-2">
                  <span>✦</span>
                  <span>AI-Powered Learning Platform</span>
                </div>
                <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold leading-tight text-slate-900">
                  Transform Your <br />
                  Learning Journey with{' '}
                  <span className="text-[#1976d2]">StudyMate</span>
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600">
                  Experience the future of education with AI-powered personalized
                  learning, interactive courses, and a vibrant community of
                  learners.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    to="/register"
                    className="rounded-md bg-[#1976d2] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#145ca5] transition-colors"
                  >
                    Start learning free
                  </Link>
                  <a
                    href="#features"
                    className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                  >
                    Explore Courses
                  </a>
                </div>
              </div>

              <div className="relative">
                {/* Thẻ div bao ngoài ảnh */}
                <div className="overflow-hidden">
                  <img
                    src={BanerImg}
                    alt="Students learning together"
                    className="w-full h-auto object-contain block"
                  />
                </div>

                {/* Giữ nguyên cái Badge này vì nó nằm đè lên ảnh, trông rất hiện đại */}
                <div className="absolute -bottom-6 -left-6 rounded-xl border border-slate-200 bg-white shadow-md px-4 py-3">
    <div className="text-xs font-semibold text-slate-900">
      10,000+
    </div>
    <div className="text-[11px] text-slate-500">Active Students</div>
  </div>
</div>
            </div>

            {/* Stats row */}
            <div className="mt-14 rounded-xl bg-white/70 border border-slate-200 px-6 py-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <Stat value="10,000+" label="Active Students" />
                <Stat value="500+" label="Expert Teachers" />
                <Stat value="1,000+" label="Courses Available" />
                <Stat value="95%" label="Success Rate" />
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-6xl px-4 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-900">
              Everything You Need to{' '}
              <span className="text-[#1976d2]">Excel</span>
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Our platform combines cutting-edge AI technology with proven
              learning methods to help you achieve your goals.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <FeatureCard
              title="AI-Powered Learning"
              desc="Get personalized learning assistance with our advanced AI chatbot that adapts to your learning style."
              icon={<span className="text-lg">✺</span>}
            />
            <FeatureCard
              title="Rich Course Library"
              desc="Access thousands of courses created by expert teachers across all subjects and skill levels."
              icon={<span className="text-lg">📘</span>}
            />
            <FeatureCard
              title="Gamified Experience"
              desc="Learn through interactive quizzes and flashcard games. Earn points and track your progress."
              icon={<span className="text-lg">🏆</span>}
            />
            <FeatureCard
              title="Learning Community"
              desc="Connect with fellow learners, share resources, and collaborate on your educational journey."
              icon={<span className="text-lg">👥</span>}
            />
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#2e7ecf]">
          <div className="mx-auto max-w-6xl px-4 py-16 text-center text-white">
            <h3 className="text-3xl font-extrabold leading-tight">
              Ready to Start Your Learning <br />
              Journey?
            </h3>
            <p className="mt-3 text-sm text-white/80">
              Join thousands of students already learning smarter with StudyMate
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                to="/register"
                className="rounded-md bg-white px-5 py-2 text-sm font-semibold text-[#1976d2] hover:bg-white/90"
              >
                Create Free Account
              </Link>
              <a
                href="#features"
                className="rounded-md bg-[#0b5dbb] px-5 py-2 text-sm font-semibold text-white hover:bg-[#094fa0]"
              >
                Browse Courses
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
              <div>
                <div className="flex items-center gap-2">
                  <img
                    src={LogoImg}
                    alt="StudyMate Logo"
                    className="h-7 w-auto object-contain"
                  />
                  <span className="font-semibold text-slate-900">StudyMate</span>
                </div>
                <p className="mt-3 text-xs text-slate-600 leading-5">
                  Empowering learners across Vietnam with AI-powered education.
                </p>
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  Platform
                </div>
                <div className="mt-3 space-y-2 text-xs text-slate-600">
                  <a href="#" className="block hover:text-slate-900">
                    Courses
                  </a>
                  <a href="#" className="block hover:text-slate-900">
                    Dashboard
                  </a>
                  <Link to="/login" className="block hover:text-slate-900">
                    Sign in
                  </Link>
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  Resources
                </div>
                <div className="mt-3 space-y-2 text-xs text-slate-600">
                  <a href="#" className="block hover:text-slate-900">
                    Help Center
                  </a>
                  <a href="#" className="block hover:text-slate-900">
                    Community
                  </a>
                  <a href="#" className="block hover:text-slate-900">
                    Blog
                  </a>
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900">Company</div>
                <div className="mt-3 space-y-2 text-xs text-slate-600">
                  <a href="#" className="block hover:text-slate-900">
                    About Us
                  </a>
                  <a href="#" className="block hover:text-slate-900">
                    Contact
                  </a>
                  <a href="#" className="block hover:text-slate-900">
                    Privacy Policy
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-10 border-t border-slate-200 pt-6 text-center text-[11px] text-slate-500">
              © 2025 StudyMate. All rights reserved.
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default Home

