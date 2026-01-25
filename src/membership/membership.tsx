import React from 'react'
import { Link } from 'react-router-dom'
import LogoImg from '../accesory/picture/StudyMate 1.png'

const NavItem: React.FC<{ children: React.ReactNode; href?: string }> = ({
  children,
  href = '#',
}) => {
  return (
    <a
      href={href}
      className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
    >
      {children}
    </a>
  )
}

const CheckIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    className={`h-4 w-4 text-[#1976d2] ${className}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
)

const PricingCard: React.FC<{
  title: string
  subtitle: string
  price: string
  period?: string
  priceSubtitle?: string
  features: string[]
  isPopular?: boolean
  buttonText?: string
  isPremium?: boolean
}> = ({
  title,
  subtitle,
  price,
  period,
  priceSubtitle,
  features,
  isPopular = false,
  buttonText = 'Get Started',
  isPremium = false,
}) => {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border ${
        isPremium
          ? 'border-[#1976d2] bg-[#1976d2] text-white shadow-xl scale-105 z-10'
          : 'border-slate-200 bg-white text-slate-900 shadow-sm hover:shadow-md'
      } p-6 transition-all`}
    >
      {isPopular && (
        <div className="absolute top-4 right-4 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white border border-white/30">
          Best offer
        </div>
      )}

      <div className="mb-4">
        <div
          className={`h-10 w-10 rounded-lg flex items-center justify-center mb-4 ${
            isPremium ? 'bg-white/10 text-white' : 'bg-[#e3f2fd]'
          }`}
        >
          {isPremium ? (
            <span className="text-xl">♛</span>
          ) : (
            <img
              src={LogoImg}
              alt="StudyMate"
              className="h-6 w-auto object-contain"
            />
          )}
        </div>
        <h3 className="text-xl font-bold">{title}</h3>
        <p
          className={`mt-1 text-xs ${
            isPremium ? 'text-blue-100' : 'text-slate-500'
          }`}
        >
          {subtitle}
        </p>
      </div>

      <div className="mb-6">
        <div className="flex items-end gap-1">
          <span className="text-3xl font-bold">{price}</span>
          {period && (
            <span
              className={`text-xs mb-1 ${
                isPremium ? 'text-blue-100' : 'text-slate-500'
              }`}
            >
              {period}
            </span>
          )}
        </div>
        {priceSubtitle && (
          <div
            className={`mt-1 text-xs ${
              isPremium ? 'text-blue-100' : 'text-slate-500'
            }`}
            dangerouslySetInnerHTML={{ __html: priceSubtitle }}
          />
        )}
      </div>

      <div className="flex-1 space-y-3 mb-6">
        {features.map((feature, idx) => (
          <div key={idx} className="flex items-start gap-3 text-xs">
            <CheckIcon
              className={`mt-0.5 flex-shrink-0 ${
                isPremium ? 'text-white' : 'text-[#1976d2]'
              }`}
            />
            <span className={isPremium ? 'text-blue-50' : 'text-slate-600'}>
              {feature}
            </span>
          </div>
        ))}
      </div>

      <button
        className={`w-full rounded-md py-2.5 text-sm font-semibold transition-colors ${
          isPremium
            ? 'bg-[#0d2a4e] text-white hover:bg-[#0a213d]'
            : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
        }`}
      >
        {buttonText}
      </button>
    </div>
  )
}

const Membership: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Top nav - Reused from Home */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200">
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
              <Link
                to="/"
                className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
              >
                Home
              </Link>
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
                className="hidden sm:inline-flex items-center gap-2 rounded-md border border-[#bbdefb] bg-[#e3f2fd] px-3 py-2 text-xs font-semibold text-[#1976d2]"
              >
                <span className="text-sm">♛</span>
                Upgrade
              </Link>
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
            </div>
          </div>
        </div>
      </header>

      <main className="pb-20">
        {/* Header Section */}
        <div className="pt-16 pb-12 text-center px-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            Find Your Perfect Plan
          </h1>
          <p className="mt-3 text-slate-600">
            Unlock your learning potential with StudyMate
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <PricingCard
              title="Freemium"
              subtitle="Free basic access"
              price="0"
              period="VND"
              features={[
                'Limited course access',
                'Limited AI chatbot usage',
                'Quiz & Flashcard games',
                'Community access',
                'Progress tracking',
              ]}
            />

            <PricingCard
              title="Pay-per-Course"
              subtitle="Buy individual courses"
              price="50,000 - 100,000"
              period="VND/course"
              features={[
                'Lifetime course ownership',
                'Unlimited AI chatbot',
                'Unlimited Quiz & Flashcards',
                'Download course materials',
                'Ad-free experience',
                'Priority support',
              ]}
            />

            <PricingCard
              title="Premium"
              subtitle="Full platform access"
              price="80,000"
              period="VND/month"
              priceSubtitle="<span class='font-bold'>800,000</span> VND/year <span class='text-yellow-300 font-bold'>(Save 17%)</span><br/>Auto-cancels when expired if not renewed"
              features={[
                'Access to all courses',
                'Unlimited AI chatbot',
                'Unlimited Quiz & Flashcards',
                'Download course materials',
                'Ad-free experience',
                'Priority support',
                'New content updates',
              ]}
              isPremium={true}
              isPopular={true}
            />
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="mx-auto max-w-5xl px-4 mt-20">
          <h2 className="text-2xl font-bold text-center mb-10 text-slate-900">
            Feature Comparison
          </h2>

          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="py-5 px-6 text-left text-sm font-bold text-slate-900 w-1/4">
                      Features
                    </th>
                    <th className="py-5 px-6 text-center text-sm font-bold text-slate-900 w-1/4">
                      Freemium
                    </th>
                    <th className="py-5 px-6 text-center text-sm font-bold text-slate-900 w-1/4">
                      Pay-per-Course
                    </th>
                    <th className="py-5 px-6 text-center text-sm font-bold text-slate-900 w-1/4">
                      Premium
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-4 px-6 text-sm text-slate-600">
                      Course Access
                    </td>
                    <td className="py-4 px-6 text-center text-sm text-slate-600">
                      Limited
                    </td>
                    <td className="py-4 px-6 text-center text-sm text-slate-600">
                      Purchased Only
                    </td>
                    <td className="py-4 px-6 text-center text-sm text-slate-600">
                      All Courses
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-sm text-slate-600">
                      AI Chatbot
                    </td>
                    <td className="py-4 px-6 text-center text-sm text-slate-600">
                      Limited
                    </td>
                    <td className="py-4 px-6 text-center text-sm text-[#1976d2]">
                      ✓
                    </td>
                    <td className="py-4 px-6 text-center text-sm text-[#1976d2]">
                      ✓
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-sm text-slate-600">
                      Quiz & Flashcard
                    </td>
                    <td className="py-4 px-6 text-center text-sm text-slate-600">
                      Basic
                    </td>
                    <td className="py-4 px-6 text-center text-sm text-[#1976d2]">
                      ✓
                    </td>
                    <td className="py-4 px-6 text-center text-sm text-[#1976d2]">
                      ✓
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-sm text-slate-600">
                      Advertisements
                    </td>
                    <td className="py-4 px-6 text-center text-sm text-slate-600">
                      Yes
                    </td>
                    <td className="py-4 px-6 text-center text-sm text-slate-600">
                      No
                    </td>
                    <td className="py-4 px-6 text-center text-sm text-slate-600">
                      No
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-sm text-slate-600">
                      Lifetime Ownership
                    </td>
                    <td className="py-4 px-6 text-center text-sm text-slate-600">
                      —
                    </td>
                    <td className="py-4 px-6 text-center text-sm text-[#1976d2]">
                      ✓
                    </td>
                    <td className="py-4 px-6 text-center text-sm text-slate-600">
                      While Subscribed
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Membership
