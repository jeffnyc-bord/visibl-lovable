import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, ArrowRight, Plus, X } from "lucide-react"
import boardLabsIcon from "@/assets/board-labs-icon-black.png"

const corePrompts = [
  "Best running shoes for marathon training",
  "Nike Air Max vs Adidas Ultraboost comparison",
  "Top basketball shoes for court performance",
  "Nike sustainable athletic wear 2024",
  "Best Nike shoes for daily workouts",
  "Nike vs competitors running shoes",
  "Most comfortable Nike sneakers review",
  "Nike Pegasus long distance running",
  "Best Nike training shoes for gym",
  "Nike Air Force 1 style guide",
]

// Shimmer text component for loading effect
const ShimmerText = ({ children }: { children: React.ReactNode }) => (
  <span className="relative inline-block">
    <span className="relative z-10">{children}</span>
    <span 
      className="absolute inset-0 z-20 overflow-hidden"
      style={{
        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 2s infinite linear',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
      }}
    />
    <style>{`
      @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `}</style>
  </span>
)

interface BrandEmpowermentModalProps {
  isOpen: boolean
  brandName?: string
  onComplete?: () => void
}

export function BrandEmpowermentModal({ 
  isOpen, 
  brandName: initialBrandName = "",
  onComplete 
}: BrandEmpowermentModalProps) {
  const [activeIndex, setActiveIndex] = useState(-1)
  const [completedCount, setCompletedCount] = useState(0)
  const [phase, setPhase] = useState<'input' | 'profile' | 'invite' | 'prompts' | 'analyzing' | 'preview'>('input')
  
  // Brand input state
  const [brandName, setBrandName] = useState(initialBrandName)
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [inputFocused, setInputFocused] = useState<'brand' | 'website' | 'name' | 'role' | 'email' | 'code' | null>(null)

  // Profile state
  const [userName, setUserName] = useState("")
  const [userRole, setUserRole] = useState("")

  // Invite state
  const [inviteEmails, setInviteEmails] = useState<string[]>([])
  const [currentEmail, setCurrentEmail] = useState("")

  // Bypass code state
  const [showBypassCode, setShowBypassCode] = useState(false)
  const [bypassCode, setBypassCode] = useState("")

  const canContinue = brandName.trim().length > 0
  const canContinueProfile = userName.trim().length > 0

  const handleStartAnalysis = () => {
    if (canContinue) {
      setPhase('profile')
    }
  }

  const handleContinueToInvite = () => {
    if (canContinueProfile) {
      setPhase('invite')
    }
  }

  const handleStartPrompts = () => {
    setPhase('prompts')
  }

  const handleAddEmail = () => {
    if (currentEmail.trim() && currentEmail.includes('@')) {
      setInviteEmails([...inviteEmails, currentEmail.trim()])
      setCurrentEmail("")
    }
  }

  const handleRemoveEmail = (index: number) => {
    setInviteEmails(inviteEmails.filter((_, i) => i !== index))
  }

  useEffect(() => {
    if (!isOpen) {
      setActiveIndex(-1)
      setCompletedCount(0)
      setPhase('input')
      setBrandName(initialBrandName)
      setWebsiteUrl("")
      setUserName("")
      setUserRole("")
      setInviteEmails([])
      setCurrentEmail("")
      return
    }
  }, [isOpen, initialBrandName])

  useEffect(() => {
    if (phase !== 'prompts') return

    let currentIndex = 0
    
    const interval = setInterval(() => {
      if (currentIndex < 10) {
        setActiveIndex(currentIndex)
        
        setTimeout(() => {
          setCompletedCount(prev => prev + 1)
        }, 600)
        
        currentIndex++
      } else {
        clearInterval(interval)
        setTimeout(() => {
          setPhase('analyzing')
        }, 800)
      }
    }, 800)

    return () => clearInterval(interval)
  }, [phase])

  // Analyzing phase timer
  useEffect(() => {
    if (phase !== 'analyzing') return

    const timeout = setTimeout(() => {
      setPhase('preview')
    }, 4000)

    return () => clearTimeout(timeout)
  }, [phase])

  if (!isOpen) return null

  const displayBrandName = brandName.trim() || "your brand"

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white"
    >
      <AnimatePresence mode="wait">
        {phase === 'input' ? (
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md mx-auto px-8"
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-12"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                <img 
                  src={boardLabsIcon} 
                  alt="Board Labs"
                  className="w-7 h-7 object-contain brightness-0 invert"
                />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center mb-3"
              style={{
                fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                fontWeight: 300,
                fontSize: '2.25rem',
                color: '#1D1D1F',
                letterSpacing: '-0.02em',
                lineHeight: 1.2
              }}
            >
              Let's get started
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-center mb-10"
              style={{
                fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                fontWeight: 400,
                fontSize: '1.0625rem',
                color: '#86868B',
                letterSpacing: '-0.01em'
              }}
            >
              Tell us about your brand
            </motion.p>

            {/* Input Fields */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-5"
            >
              {/* Brand Name Input */}
              <div className="relative">
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  onFocus={() => setInputFocused('brand')}
                  onBlur={() => setInputFocused(null)}
                  placeholder=" "
                  className="peer w-full outline-none transition-all duration-300"
                  style={{
                    fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                    fontWeight: 400,
                    fontSize: '1.0625rem',
                    color: '#1D1D1F',
                    letterSpacing: '-0.01em',
                    padding: '1.5rem 0 0.5rem 0',
                    borderRadius: 0,
                    border: 'none',
                    borderBottom: `1.5px solid ${inputFocused === 'brand' ? '#1D1D1F' : '#D1D1D6'}`,
                    backgroundColor: 'transparent'
                  }}
                />
                <label
                  className="absolute left-0 transition-all duration-200 pointer-events-none"
                  style={{
                    fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                    fontWeight: 400,
                    fontSize: brandName || inputFocused === 'brand' ? '0.75rem' : '1.0625rem',
                    color: inputFocused === 'brand' ? '#1D1D1F' : '#86868B',
                    letterSpacing: '-0.01em',
                    top: brandName || inputFocused === 'brand' ? '0' : '1rem',
                    transform: 'translateY(0)'
                  }}
                >
                  Brand name
                </label>
              </div>

              {/* Website URL Input */}
              <div className="relative">
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  onFocus={() => setInputFocused('website')}
                  onBlur={() => setInputFocused(null)}
                  placeholder=" "
                  className="peer w-full outline-none transition-all duration-300"
                  style={{
                    fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                    fontWeight: 400,
                    fontSize: '1.0625rem',
                    color: '#1D1D1F',
                    letterSpacing: '-0.01em',
                    padding: '1.5rem 0 0.5rem 0',
                    borderRadius: 0,
                    border: 'none',
                    borderBottom: `1.5px solid ${inputFocused === 'website' ? '#1D1D1F' : '#D1D1D6'}`,
                    backgroundColor: 'transparent'
                  }}
                />
                <label
                  className="absolute left-0 transition-all duration-200 pointer-events-none"
                  style={{
                    fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                    fontWeight: 400,
                    fontSize: websiteUrl || inputFocused === 'website' ? '0.75rem' : '1.0625rem',
                    color: inputFocused === 'website' ? '#1D1D1F' : '#86868B',
                    letterSpacing: '-0.01em',
                    top: websiteUrl || inputFocused === 'website' ? '0' : '1rem',
                    transform: 'translateY(0)'
                  }}
                >
                  Website <span style={{ color: '#AEAEB2', fontWeight: 400 }}>(optional)</span>
                </label>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-12"
            >
              <button
                onClick={handleStartAnalysis}
                disabled={!canContinue}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl transition-all duration-200"
                style={{
                  fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                  fontWeight: 500,
                  fontSize: '1.0625rem',
                  letterSpacing: '-0.01em',
                  color: canContinue ? '#FFFFFF' : '#86868B',
                  background: canContinue ? '#1D1D1F' : '#F5F5F7',
                  cursor: canContinue ? 'pointer' : 'not-allowed'
                }}
                onMouseEnter={(e) => {
                  if (canContinue) {
                    e.currentTarget.style.background = '#000000'
                  }
                }}
                onMouseLeave={(e) => {
                  if (canContinue) {
                    e.currentTarget.style.background = '#1D1D1F'
                  }
                }}
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Footer Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center mt-6"
              style={{
                fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                fontWeight: 400,
                fontSize: '0.8125rem',
                color: '#AEAEB2',
                letterSpacing: '-0.01em'
              }}
            >
              We'll confirm your brand before scanning 40+ AI platforms
            </motion.p>
          </motion.div>
        ) : phase === 'profile' ? (
          <motion.div
            key="profile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md mx-auto px-8"
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-12"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                <img 
                  src={boardLabsIcon} 
                  alt="Board Labs"
                  className="w-7 h-7 object-contain brightness-0 invert"
                />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center mb-3"
              style={{
                fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                fontWeight: 300,
                fontSize: '2.25rem',
                color: '#1D1D1F',
                letterSpacing: '-0.02em',
                lineHeight: 1.2
              }}
            >
              A little about you
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-center mb-10"
              style={{
                fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                fontWeight: 400,
                fontSize: '1.0625rem',
                color: '#86868B',
                letterSpacing: '-0.01em'
              }}
            >
              Help us personalize your experience
            </motion.p>

            {/* Input Fields */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-5"
            >
              {/* Name Input */}
              <div className="relative">
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  onFocus={() => setInputFocused('name')}
                  onBlur={() => setInputFocused(null)}
                  placeholder=" "
                  className="peer w-full outline-none transition-all duration-300"
                  style={{
                    fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                    fontWeight: 400,
                    fontSize: '1.0625rem',
                    color: '#1D1D1F',
                    letterSpacing: '-0.01em',
                    padding: '1.5rem 0 0.5rem 0',
                    borderRadius: 0,
                    border: 'none',
                    borderBottom: `1.5px solid ${inputFocused === 'name' ? '#1D1D1F' : '#D1D1D6'}`,
                    backgroundColor: 'transparent'
                  }}
                />
                <label
                  className="absolute left-0 transition-all duration-200 pointer-events-none"
                  style={{
                    fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                    fontWeight: 400,
                    fontSize: userName || inputFocused === 'name' ? '0.75rem' : '1.0625rem',
                    color: inputFocused === 'name' ? '#1D1D1F' : '#86868B',
                    letterSpacing: '-0.01em',
                    top: userName || inputFocused === 'name' ? '0' : '1rem',
                    transform: 'translateY(0)'
                  }}
                >
                  Your name
                </label>
              </div>

              {/* Role Input */}
              <div className="relative">
                <input
                  type="text"
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                  onFocus={() => setInputFocused('role')}
                  onBlur={() => setInputFocused(null)}
                  placeholder=" "
                  className="peer w-full outline-none transition-all duration-300"
                  style={{
                    fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                    fontWeight: 400,
                    fontSize: '1.0625rem',
                    color: '#1D1D1F',
                    letterSpacing: '-0.01em',
                    padding: '1.5rem 0 0.5rem 0',
                    borderRadius: 0,
                    border: 'none',
                    borderBottom: `1.5px solid ${inputFocused === 'role' ? '#1D1D1F' : '#D1D1D6'}`,
                    backgroundColor: 'transparent'
                  }}
                />
                <label
                  className="absolute left-0 transition-all duration-200 pointer-events-none"
                  style={{
                    fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                    fontWeight: 400,
                    fontSize: userRole || inputFocused === 'role' ? '0.75rem' : '1.0625rem',
                    color: inputFocused === 'role' ? '#1D1D1F' : '#86868B',
                    letterSpacing: '-0.01em',
                    top: userRole || inputFocused === 'role' ? '0' : '1rem',
                    transform: 'translateY(0)'
                  }}
                >
                  Role <span style={{ color: '#AEAEB2', fontWeight: 400 }}>(optional)</span>
                </label>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-12"
            >
              <button
                onClick={handleContinueToInvite}
                disabled={!canContinueProfile}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl transition-all duration-200"
                style={{
                  fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                  fontWeight: 500,
                  fontSize: '1.0625rem',
                  letterSpacing: '-0.01em',
                  color: canContinueProfile ? '#FFFFFF' : '#86868B',
                  background: canContinueProfile ? '#1D1D1F' : '#F5F5F7',
                  cursor: canContinueProfile ? 'pointer' : 'not-allowed'
                }}
                onMouseEnter={(e) => {
                  if (canContinueProfile) {
                    e.currentTarget.style.background = '#000000'
                  }
                }}
                onMouseLeave={(e) => {
                  if (canContinueProfile) {
                    e.currentTarget.style.background = '#1D1D1F'
                  }
                }}
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        ) : phase === 'invite' ? (
          <motion.div
            key="invite"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md mx-auto px-8"
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-12"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                <img 
                  src={boardLabsIcon} 
                  alt="Board Labs"
                  className="w-7 h-7 object-contain brightness-0 invert"
                />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center mb-3"
              style={{
                fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                fontWeight: 300,
                fontSize: '2.25rem',
                color: '#1D1D1F',
                letterSpacing: '-0.02em',
                lineHeight: 1.2
              }}
            >
              Invite your team
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-center mb-10"
              style={{
                fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                fontWeight: 400,
                fontSize: '1.0625rem',
                color: '#86868B',
                letterSpacing: '-0.01em'
              }}
            >
              Collaborate with teammates on {displayBrandName}
            </motion.p>

            {/* Email Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-4"
            >
              {/* Added Emails */}
              {inviteEmails.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {inviteEmails.map((email, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                      style={{
                        backgroundColor: '#F5F5F7',
                        fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                        fontSize: '0.875rem',
                        color: '#1D1D1F'
                      }}
                    >
                      <span>{email}</span>
                      <button
                        onClick={() => handleRemoveEmail(index)}
                        className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors"
                      >
                        <X className="w-3 h-3" style={{ color: '#86868B' }} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Email Input Field */}
              <div className="relative flex items-center gap-3">
                <div className="flex-1 relative">
                  <input
                    type="email"
                    value={currentEmail}
                    onChange={(e) => setCurrentEmail(e.target.value)}
                    onFocus={() => setInputFocused('email')}
                    onBlur={() => setInputFocused(null)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddEmail()
                      }
                    }}
                    placeholder=" "
                    className="peer w-full outline-none transition-all duration-300"
                    style={{
                      fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                      fontWeight: 400,
                      fontSize: '1.0625rem',
                      color: '#1D1D1F',
                      letterSpacing: '-0.01em',
                      padding: '1.5rem 0 0.5rem 0',
                      borderRadius: 0,
                      border: 'none',
                      borderBottom: `1.5px solid ${inputFocused === 'email' ? '#1D1D1F' : '#D1D1D6'}`,
                      backgroundColor: 'transparent'
                    }}
                  />
                  <label
                    className="absolute left-0 transition-all duration-200 pointer-events-none"
                    style={{
                      fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                      fontWeight: 400,
                      fontSize: currentEmail || inputFocused === 'email' ? '0.75rem' : '1.0625rem',
                      color: inputFocused === 'email' ? '#1D1D1F' : '#86868B',
                      letterSpacing: '-0.01em',
                      top: currentEmail || inputFocused === 'email' ? '0' : '1rem',
                      transform: 'translateY(0)'
                    }}
                  >
                    Email address
                  </label>
                </div>
                <button
                  onClick={handleAddEmail}
                  disabled={!currentEmail.includes('@')}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
                  style={{
                    backgroundColor: currentEmail.includes('@') ? '#1D1D1F' : '#F5F5F7',
                    cursor: currentEmail.includes('@') ? 'pointer' : 'not-allowed'
                  }}
                >
                  <Plus className="w-5 h-5" style={{ color: currentEmail.includes('@') ? '#FFFFFF' : '#86868B' }} />
                </button>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-12 space-y-3"
            >
              <button
                onClick={handleStartPrompts}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl transition-all duration-200"
                style={{
                  fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                  fontWeight: 500,
                  fontSize: '1.0625rem',
                  letterSpacing: '-0.01em',
                  color: '#FFFFFF',
                  background: '#1D1D1F',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#000000'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#1D1D1F'
                }}
              >
                {inviteEmails.length > 0 ? 'Send Invites & Continue' : 'Continue'}
                <ArrowRight className="w-4 h-4" />
              </button>

              {inviteEmails.length === 0 && (
                <button
                  onClick={handleStartPrompts}
                  className="w-full py-3 transition-all duration-200"
                  style={{
                    fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                    fontWeight: 400,
                    fontSize: '0.9375rem',
                    letterSpacing: '-0.01em',
                    color: '#86868B',
                    background: 'transparent',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#1D1D1F'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#86868B'
                  }}
                >
                  Skip for now
                </button>
              )}
            </motion.div>

            {/* Footer Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center mt-6"
              style={{
                fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                fontWeight: 400,
                fontSize: '0.8125rem',
                color: '#AEAEB2',
                letterSpacing: '-0.01em'
              }}
            >
              You can always invite more teammates later
            </motion.p>
          </motion.div>
        ) : phase === 'prompts' ? (
          <motion.div
            key="prompts"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-xl mx-auto px-8"
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-12"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                <img 
                  src={boardLabsIcon} 
                  alt="Board Labs"
                  className="w-7 h-7 object-contain brightness-0 invert"
                />
              </div>
            </motion.div>

            {/* Title with Shimmer */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center mb-4"
              style={{
                fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                fontWeight: 300,
                fontSize: '2.25rem',
                color: '#1D1D1F',
                letterSpacing: '-0.02em',
                lineHeight: 1.2
              }}
            >
              <ShimmerText>Building {displayBrandName}'s AI Visibility Dashboard</ShimmerText>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-center mb-12"
              style={{
                fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                fontWeight: 400,
                fontSize: '1.0625rem',
                color: '#86868B',
                letterSpacing: '-0.01em'
              }}
            >
              Analyzing {completedCount} of 10 discovery prompts
            </motion.p>

            {/* Prompts List */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-0"
            >
              {corePrompts.map((prompt, index) => {
                const isActive = activeIndex === index
                const isComplete = index < completedCount
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.25 + (index * 0.05) }}
                    className="flex items-center py-3"
                    style={{
                      borderBottom: index < 9 ? '1px solid rgba(0, 0, 0, 0.06)' : 'none'
                    }}
                  >
                    {/* Status */}
                    <div className="w-6 flex-shrink-0">
                      {isComplete ? (
                        <motion.svg 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 15 }}
                          className="w-5 h-5" 
                          viewBox="0 0 20 20" 
                          fill="none"
                        >
                          <path 
                            d="M4 10.5L8 14.5L16 6.5" 
                            stroke="#34C759" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          />
                        </motion.svg>
                      ) : isActive ? (
                        <motion.div
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                          className="w-2 h-2 rounded-full ml-1.5"
                          style={{ backgroundColor: '#007AFF' }}
                        />
                      ) : (
                        <div 
                          className="w-1.5 h-1.5 rounded-full ml-1.5"
                          style={{ backgroundColor: '#D1D1D6' }}
                        />
                      )}
                    </div>
                    
                    {/* Prompt Text */}
                    <span 
                      style={{
                        fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                        fontWeight: 400,
                        fontSize: '0.9375rem',
                        color: isComplete ? '#1D1D1F' : isActive ? '#1D1D1F' : '#86868B',
                        letterSpacing: '-0.01em',
                        transition: 'color 0.3s ease'
                      }}
                    >
                      {prompt}
                    </span>
                  </motion.div>
                )
              })}
            </motion.div>

            {/* Footer Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="text-center mt-12"
              style={{
                fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                fontWeight: 400,
                fontSize: '0.8125rem',
                color: '#86868B',
                letterSpacing: '-0.01em'
              }}
            >
              This takes about 2 minutes
            </motion.p>
          </motion.div>
        ) : phase === 'analyzing' ? (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md mx-auto px-8 text-center"
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-12"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                <img 
                  src={boardLabsIcon} 
                  alt="Board Labs"
                  className="w-7 h-7 object-contain brightness-0 invert"
                />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{
                fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                fontWeight: 300,
                fontSize: '2.25rem',
                color: '#1D1D1F',
                letterSpacing: '-0.02em',
                lineHeight: 1.2
              }}
            >
              Analyzing responses
            </motion.h1>

            {/* Animated dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center gap-1.5 mt-6"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    opacity: [0.3, 1, 0.3],
                    scale: [0.85, 1, 0.85]
                  }}
                  transition={{ 
                    duration: 1.2, 
                    repeat: Infinity, 
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: '#86868B' }}
                />
              ))}
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8"
              style={{
                fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                fontWeight: 400,
                fontSize: '1.0625rem',
                color: '#86868B',
                letterSpacing: '-0.01em'
              }}
            >
              Gathering insights from 40 AI responses across ChatGPT, Gemini, Perplexity, and Grok
            </motion.p>

            {/* Progress Bar Loader */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-16 w-full max-w-sm mx-auto"
            >
              {/* Progress text */}
              <p
                className="text-center mb-4"
                style={{
                  fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                  fontWeight: 400,
                  fontSize: '1rem',
                  color: '#007AFF',
                  letterSpacing: '-0.01em'
                }}
              >
                Building your visibility blueprint...
              </p>

              {/* Progress bar */}
              <div 
                className="h-1 w-full rounded-full overflow-hidden"
                style={{ backgroundColor: '#E5E5EA' }}
              >
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '60%' }}
                  transition={{ 
                    duration: 3.5, 
                    ease: "easeInOut"
                  }}
                  className="h-full rounded-full"
                  style={{ 
                    background: 'linear-gradient(90deg, #007AFF 0%, #5856D6 100%)'
                  }}
                />
              </div>

              {/* Time estimate */}
              <p
                className="text-center mt-4"
                style={{
                  fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                  fontWeight: 400,
                  fontSize: '0.8125rem',
                  color: '#86868B',
                  letterSpacing: '-0.01em'
                }}
              >
                This usually takes about 30 seconds
              </p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-3xl mx-auto px-8"
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-8"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                <img 
                  src={boardLabsIcon} 
                  alt="Board Labs"
                  className="w-7 h-7 object-contain brightness-0 invert"
                />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center mb-3"
              style={{
                fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                fontWeight: 300,
                fontSize: '2.25rem',
                color: '#1D1D1F',
                letterSpacing: '-0.02em',
                lineHeight: 1.2
              }}
            >
              Your insights are ready
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-center mb-10"
              style={{
                fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                fontWeight: 400,
                fontSize: '1.0625rem',
                color: '#86868B',
                letterSpacing: '-0.01em'
              }}
            >
              Here's a preview of what we found for {displayBrandName}
            </motion.p>

            {/* Clean Stats Display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-12"
            >
              {/* Main Score */}
              <div className="text-center mb-10">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.25 }}
                  style={{
                    fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                    fontWeight: 200,
                    fontSize: '5rem',
                    color: '#1D1D1F',
                    letterSpacing: '-0.04em',
                    lineHeight: 1
                  }}
                >
                  87
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.35 }}
                  style={{
                    fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                    fontWeight: 400,
                    fontSize: '0.9375rem',
                    color: '#86868B',
                    letterSpacing: '-0.01em',
                    marginTop: '0.5rem'
                  }}
                >
                  AI Visibility Score
                </motion.p>
              </div>

              {/* Secondary Stats */}
              <div className="flex justify-center gap-16">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="text-center"
                >
                  <div
                    style={{
                      fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                      fontWeight: 300,
                      fontSize: '1.75rem',
                      color: '#1D1D1F',
                      letterSpacing: '-0.02em'
                    }}
                  >
                    12,847
                  </div>
                  <div
                    style={{
                      fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                      fontWeight: 400,
                      fontSize: '0.8125rem',
                      color: '#86868B',
                      letterSpacing: '-0.01em',
                      marginTop: '0.25rem'
                    }}
                  >
                    Brand mentions
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  className="text-center"
                >
                  <div
                    style={{
                      fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                      fontWeight: 300,
                      fontSize: '1.75rem',
                      color: '#1D1D1F',
                      letterSpacing: '-0.02em'
                    }}
                  >
                    www.nike.com
                  </div>
                  <div
                    style={{
                      fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                      fontWeight: 400,
                      fontSize: '0.8125rem',
                      color: '#86868B',
                      letterSpacing: '-0.01em',
                      marginTop: '0.25rem'
                    }}
                  >
                    Top source
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Friendly Payment Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="text-center mb-10 max-w-md mx-auto"
            >
              <p
                style={{
                  fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                  fontWeight: 400,
                  fontSize: '0.9375rem',
                  color: '#86868B',
                  letterSpacing: '-0.01em',
                  lineHeight: 1.6
                }}
              >
                To see the full picture, we'll place a simple hold on your card. 
                Try it free for 7 days — cancel anytime for a full refund.
              </p>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex justify-center"
            >
              <button
                onClick={onComplete}
                className="px-8 py-3.5 rounded-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                  fontWeight: 500,
                  fontSize: '1rem',
                  color: '#FFFFFF',
                  background: '#1D1D1F',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)'
                }}
              >
                Continue
              </button>
            </motion.div>

            {/* Trust indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex items-center justify-center gap-2 mt-6"
            >
              <Shield className="w-3.5 h-3.5" style={{ color: '#AEAEB2' }} />
              <span 
                style={{
                  fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                  fontWeight: 400,
                  fontSize: '0.75rem',
                  color: '#AEAEB2',
                  letterSpacing: '-0.01em'
                }}
              >
                Secure checkout · Cancel anytime
              </span>
            </motion.div>

            {/* Bypass Code Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-8 flex flex-col items-center"
            >
              {!showBypassCode ? (
                <button
                  onClick={() => setShowBypassCode(true)}
                  className="transition-opacity duration-200 hover:opacity-80"
                  style={{
                    fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                    fontWeight: 400,
                    fontSize: '0.75rem',
                    color: '#C7C7CC',
                    letterSpacing: '-0.01em',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Have an access code?
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="relative">
                    <input
                      type="text"
                      value={bypassCode}
                      onChange={(e) => setBypassCode(e.target.value.toUpperCase())}
                      onFocus={() => setInputFocused('code')}
                      onBlur={() => setInputFocused(null)}
                      placeholder="Enter code"
                      maxLength={12}
                      className="text-center outline-none transition-all duration-300"
                      style={{
                        fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                        fontWeight: 500,
                        fontSize: '0.875rem',
                        color: '#1D1D1F',
                        letterSpacing: '0.1em',
                        padding: '0.5rem 1rem',
                        width: '140px',
                        borderRadius: 0,
                        border: 'none',
                        borderBottom: `1.5px solid ${inputFocused === 'code' ? '#1D1D1F' : '#D1D1D6'}`,
                        backgroundColor: 'transparent'
                      }}
                    />
                  </div>
                  {bypassCode.length > 0 && (
                    <button
                      onClick={onComplete}
                      className="transition-opacity duration-200 hover:opacity-80"
                      style={{
                        fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                        fontWeight: 500,
                        fontSize: '0.75rem',
                        color: '#007AFF',
                        letterSpacing: '-0.01em',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      Apply code
                    </button>
                  )}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
