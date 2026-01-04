import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, CreditCard } from "lucide-react"
import boardLabsIcon from "@/assets/board_labs_icon.png"

const corePrompts = [
  "Best running shoes for marathon training",
  "Top protein supplements for muscle recovery",
  "Sustainable athletic wear brands 2024",
  "High-performance basketball shoes comparison",
  "Best yoga pants for hot yoga sessions",
  "Trail running gear recommendations",
  "Compression wear benefits for athletes",
  "Best sports bras for high impact workouts",
  "Affordable gym equipment for home",
  "Eco-friendly workout clothing options",
]

interface BrandEmpowermentModalProps {
  isOpen: boolean
  brandName?: string
  onComplete?: () => void
}

export function BrandEmpowermentModal({ 
  isOpen, 
  brandName = "your brand",
  onComplete 
}: BrandEmpowermentModalProps) {
  const [activeIndex, setActiveIndex] = useState(-1)
  const [completedCount, setCompletedCount] = useState(0)
  const [phase, setPhase] = useState<'prompts' | 'analyzing' | 'preview'>('prompts')

  useEffect(() => {
    if (!isOpen) {
      setActiveIndex(-1)
      setCompletedCount(0)
      setPhase('prompts')
      return
    }

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
  }, [isOpen])

  // Analyzing phase timer
  useEffect(() => {
    if (phase !== 'analyzing') return

    const timeout = setTimeout(() => {
      setPhase('preview')
    }, 4000)

    return () => clearTimeout(timeout)
  }, [phase])

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white"
    >
      <AnimatePresence mode="wait">
        {phase === 'prompts' ? (
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
                  className="w-7 h-7 object-contain"
                />
              </div>
            </motion.div>

            {/* Title */}
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
              Building {brandName}'s AI future
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
                  className="w-7 h-7 object-contain"
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

            {/* Footer */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-12"
              style={{
                fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                fontWeight: 400,
                fontSize: '0.8125rem',
                color: '#86868B',
                letterSpacing: '-0.01em'
              }}
            >
              Almost there
            </motion.p>
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
                  className="w-7 h-7 object-contain"
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
              Here's a preview of what we found for {brandName}
            </motion.p>

            {/* Blurred Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative mb-10"
            >
              <div 
                className="rounded-2xl overflow-hidden"
                style={{ 
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  background: 'linear-gradient(180deg, #FAFAFA 0%, #F5F5F7 100%)'
                }}
              >
                {/* Dashboard Header */}
                <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.06)' }}>
                  <div className="flex items-center justify-between">
                    <div className="blur-sm select-none">
                      <div className="h-5 w-32 bg-slate-200 rounded mb-1" />
                      <div className="h-3 w-48 bg-slate-100 rounded" />
                    </div>
                    <div className="blur-sm select-none flex gap-2">
                      <div className="h-8 w-20 bg-slate-100 rounded" />
                      <div className="h-8 w-20 bg-slate-100 rounded" />
                    </div>
                  </div>
                </div>

                {/* Dashboard Stats Row */}
                <div className="px-6 py-5 grid grid-cols-4 gap-4" style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.06)' }}>
                  {[
                    { label: 'AI Visibility Score', value: '73' },
                    { label: 'Brand Mentions', value: '2.4K' },
                    { label: 'Sentiment', value: '+12%' },
                    { label: 'Share of Voice', value: '18%' }
                  ].map((stat, i) => (
                    <div key={i} className="blur-sm select-none">
                      <div 
                        className="text-2xl font-semibold mb-1"
                        style={{ color: '#1D1D1F' }}
                      >
                        {stat.value}
                      </div>
                      <div 
                        className="text-xs"
                        style={{ color: '#86868B' }}
                      >
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dashboard Chart Area */}
                <div className="px-6 py-5 blur-sm select-none">
                  <div className="flex items-end justify-between h-24 gap-2">
                    {[40, 65, 45, 80, 55, 70, 60, 75, 50, 85, 65, 72].map((h, i) => (
                      <div 
                        key={i}
                        className="flex-1 rounded-t"
                        style={{ 
                          height: `${h}%`,
                          background: 'linear-gradient(180deg, #007AFF 0%, #5856D6 100%)',
                          opacity: 0.6
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2">
                    <div className="h-3 w-8 bg-slate-100 rounded" />
                    <div className="h-3 w-8 bg-slate-100 rounded" />
                    <div className="h-3 w-8 bg-slate-100 rounded" />
                  </div>
                </div>

                {/* Dashboard Table */}
                <div className="px-6 py-4 blur-sm select-none">
                  {[1, 2, 3].map((row) => (
                    <div 
                      key={row}
                      className="flex items-center justify-between py-3"
                      style={{ borderTop: '1px solid rgba(0, 0, 0, 0.04)' }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-slate-200 rounded-full" />
                        <div>
                          <div className="h-3 w-32 bg-slate-200 rounded mb-1" />
                          <div className="h-2 w-24 bg-slate-100 rounded" />
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="h-3 w-12 bg-slate-100 rounded" />
                        <div className="h-3 w-16 bg-green-100 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Overlay gradient */}
              <div 
                className="absolute inset-0 pointer-events-none rounded-2xl"
                style={{
                  background: 'linear-gradient(180deg, transparent 0%, transparent 60%, rgba(255,255,255,0.9) 100%)'
                }}
              />
            </motion.div>

            {/* Friendly Payment Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center mb-8"
            >
              <p
                style={{
                  fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                  fontWeight: 400,
                  fontSize: '1rem',
                  color: '#1D1D1F',
                  letterSpacing: '-0.01em',
                  lineHeight: 1.6
                }}
              >
                To unlock your full dashboard, we'll just need to place a hold on your card.
                <br />
                <span style={{ color: '#86868B' }}>
                  You'll have a full week to explore — and if it's not for you, cancel anytime for a complete refund. No questions asked.
                </span>
              </p>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="flex items-center justify-center gap-6 mb-10"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" style={{ color: '#34C759' }} />
                <span 
                  style={{
                    fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                    fontWeight: 400,
                    fontSize: '0.8125rem',
                    color: '#86868B'
                  }}
                >
                  7-day free cancellation
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" style={{ color: '#007AFF' }} />
                <span 
                  style={{
                    fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                    fontWeight: 400,
                    fontSize: '0.8125rem',
                    color: '#86868B'
                  }}
                >
                  Secure payment
                </span>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
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
                  background: 'linear-gradient(135deg, #1D1D1F 0%, #3A3A3C 100%)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}
              >
                Continue to payment
              </button>
            </motion.div>

            {/* Fine Print */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-center mt-6"
              style={{
                fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                fontWeight: 400,
                fontSize: '0.75rem',
                color: '#AEAEB2',
                letterSpacing: '-0.01em'
              }}
            >
              By continuing, you agree to our Terms of Service
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
