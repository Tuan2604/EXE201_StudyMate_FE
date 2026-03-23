import React, { useEffect, useState } from 'react'
import LogoImg from '../accesory/picture/StudyMate 1.png'
import MainHeader from '../components/MainHeader'

interface UserSubscription {
  id: number
  planName?: string
  endDate: string
  daysRemaining: number
  isActive: boolean
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
  onButtonClick?: () => void
  loading?: boolean
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
  onButtonClick,
  loading = false,
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
        onClick={onButtonClick}
        disabled={loading}
        className={`w-full rounded-md py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
          isPremium
            ? 'bg-[#0d2a4e] text-white hover:bg-[#0a213d]'
            : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          buttonText
        )}
      </button>
    </div>
  )
}

const Membership: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [subscriptionLoading, setSubscriptionLoading] = useState(true)
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  // const [error, setError] = useState('')

  useEffect(() => {
    const fetchMySubscription = async () => {
      const token = localStorage.getItem('token')

      if (!token) {
        setSubscription(null)
        setSubscriptionLoading(false)
        return
      }

      try {
        const response = await fetch('https://localhost:7259/api/PremiumPlan/my-subscription', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const result = await response.json()
          setSubscription(result?.data || null)
        } else {
          setSubscription(null)
        }
      } catch (error) {
        console.error('Failed to fetch subscription:', error)
        setSubscription(null)
      } finally {
        setSubscriptionLoading(false)
      }
    }

    fetchMySubscription()
  }, [])

  const formatDate = (dateValue?: string) => {
    if (!dateValue) return '--'
    const date = new Date(dateValue)
    if (isNaN(date.getTime())) return '--'
    return date.toLocaleDateString('vi-VN')
  }

  const handlePremiumPayment = async () => {
    setLoading(true)
    // setError('')

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        alert('Vui lòng đăng nhập để thanh toán')
        window.location.href = '/login'
        return
      }

      const response = await fetch('https://localhost:7259/api/PremiumPlan/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          planId: 1
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Có lỗi xảy ra khi tạo liên kết thanh toán')
      }

      const result = await response.json()
      
      // Get checkoutUrl from response
      const checkoutUrl = result.data?.checkoutUrl || result.checkoutUrl
      
      if (checkoutUrl) {
        // Redirect to PayOS payment page
        window.location.href = checkoutUrl
      } else {
        throw new Error('Không nhận được URL thanh toán')
      }
    } catch (err: any) {
      console.error('Payment error:', err)
      // setError(err.message || 'Có lỗi xảy ra khi xử lý thanh toán')
      alert(err.message || 'Có lỗi xảy ra khi xử lý thanh toán')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <MainHeader />

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

        {!subscriptionLoading && subscription?.isActive && (
          <div className="mx-auto max-w-6xl px-4 mb-8">
            <div className="rounded-xl border border-[#bbdefb] bg-[#eef6ff] px-4 py-3 text-sm text-slate-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="font-semibold text-[#145ca5]">
                Premium của bạn đang hoạt động ({subscription.planName || 'Premium Plan'})
              </div>
              <div className="text-slate-600">
                Còn <span className="font-bold text-slate-900">{Math.max(0, subscription.daysRemaining)}</span> ngày • Hết hạn: <span className="font-semibold">{formatDate(subscription.endDate)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="mx-auto max-w-lg px-4">
          <div className="flex justify-center">
            <PricingCard
              title="Premium"
              subtitle="Full platform access"
              price="80,000"
              period="VND/month"
              priceSubtitle={subscription?.isActive
                ? `Đang hoạt động • Còn <span class='font-bold'>${Math.max(0, subscription.daysRemaining)}</span> ngày<br/>Hết hạn: <span class='font-bold'>${formatDate(subscription.endDate)}</span>`
                : "<span class='font-bold'>800,000</span> VND/year <span class='text-yellow-300 font-bold'>(Save 17%)</span><br/>Auto-cancels when expired if not renewed"}
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
              onButtonClick={subscription?.isActive ? undefined : handlePremiumPayment}
              buttonText={subscription?.isActive ? 'Active' : 'Get Started'}
              loading={loading || subscriptionLoading}
            />
          </div>
        </div>


      </main>
    </div>
  )
}

export default Membership
