import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import boardLabsIcon from "@/assets/board_labs_icon.png"

const probeQueries = [
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
  "Best tennis shoes for clay courts",
  "Swimming gear essentials for beginners",
  "Cross-training shoes vs running shoes",
  "Best moisture-wicking fabrics review",
  "Outdoor hiking boots comparison",
  "Golf apparel trends and recommendations",
  "Cycling shorts with best padding",
  "Weightlifting shoes for powerlifters",
  "Best athletic socks for long runs",
  "Winter sports gear essentials",
  "Recovery sandals after workout",
  "Best sports watches for training",
  "Breathable workout shirts ranking",
  "Kids athletic shoes recommendations",
  "Best headbands for sweaty workouts",
  "Resistance bands quality comparison",
  "Sports sunglasses for runners",
  "Best gym bags with shoe compartment",
  "Athletic wear for plus sizes",
  "Performance underwear for athletes",
  "Best arm sleeves for basketball",
  "Fitness tracker accuracy comparison",
  "Warm-up jacket recommendations",
  "Best cleats for soccer players",
  "Lightweight running shorts review",
  "Knee sleeves for CrossFit",
  "Best sports caps for sun protection",
  "Athletic tape alternatives",
  "Performance leggings with pockets",
  "Best ankle braces for basketball",
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
  const [promptsActivated, setPromptsActivated] = useState(0)
  const [responsesGathered, setResponsesGathered] = useState(0)
  const [analysisComplete, setAnalysisComplete] = useState(0)
  const [activeProbeIndex, setActiveProbeIndex] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) {
      setPromptsActivated(0)
      setResponsesGathered(0)
      setAnalysisComplete(0)
      setActiveProbeIndex(0)
      return
    }

    // Simulate prompts activation (fast)
    const promptInterval = setInterval(() => {
      setPromptsActivated((prev) => {
        if (prev >= 40) return 40
        return prev + 2
      })
    }, 100)

    // Simulate responses gathering (medium speed, starts after prompts)
    const responseTimeout = setTimeout(() => {
      const responseInterval = setInterval(() => {
        setResponsesGathered((prev) => {
          if (prev >= 40) {
            clearInterval(responseInterval)
            return 40
          }
          return prev + 1
        })
      }, 200)

      return () => clearInterval(responseInterval)
    }, 500)

    // Simulate analysis (slower, starts after responses begin)
    const analysisTimeout = setTimeout(() => {
      const analysisInterval = setInterval(() => {
        setAnalysisComplete((prev) => {
          if (prev >= 40) {
            clearInterval(analysisInterval)
            onComplete?.()
            return 40
          }
          return prev + 1
        })
      }, 350)

      return () => clearInterval(analysisInterval)
    }, 2000)

    // Active probe cycling
    const probeInterval = setInterval(() => {
      setActiveProbeIndex((prev) => (prev + 1) % 40)
    }, 400)

    return () => {
      clearInterval(promptInterval)
      clearTimeout(responseTimeout)
      clearTimeout(analysisTimeout)
      clearInterval(probeInterval)
    }
  }, [isOpen, onComplete])

  // Auto-scroll to keep active probe visible
  useEffect(() => {
    if (listRef.current && activeProbeIndex > 5) {
      const itemHeight = 28
      listRef.current.scrollTop = (activeProbeIndex - 3) * itemHeight
    }
  }, [activeProbeIndex])

  if (!isOpen) return null

  const getProbeStatus = (index: number) => {
    if (index < analysisComplete) return 'complete'
    if (index === activeProbeIndex) return 'active'
    if (index < responsesGathered) return 'gathered'
    return 'waiting'
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Pure White Background */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(180deg, 
              rgba(255, 255, 255, 1) 0%, 
              rgba(250, 250, 252, 1) 100%
            )
          `
        }}
      />

      {/* Subtle Warm Silver Mesh */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(ellipse at 30% 20%, rgba(99, 102, 241, 0.04) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(59, 130, 246, 0.03) 0%, transparent 50%)
          `
        }}
      />

      {/* Main Container */}
      <motion.div
        initial={{ scale: 0.98, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="relative w-full max-w-2xl mx-4 flex flex-col"
        style={{
          maxHeight: '85vh',
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(209, 213, 219, 0.5)',
          borderRadius: '20px',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div className="p-6 pb-5">
          {/* Logo */}
          <div className="flex items-center justify-center mb-5">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 20 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center"
            >
              <img 
                src={boardLabsIcon} 
                alt="Board Labs"
                className="w-6 h-6 object-contain"
              />
            </motion.div>
          </div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="text-center mb-6"
            style={{
              fontFamily: 'Google Sans Flex, system-ui, sans-serif',
              fontWeight: 300,
              fontSize: '1.625rem',
              color: '#1D1D1F',
              letterSpacing: '-0.01em',
              lineHeight: 1.3
            }}
          >
            Building {brandName}'s AI future...
          </motion.h1>

          {/* Progress Pills */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex items-center justify-center gap-3 flex-wrap"
          >
            {/* Prompts Activated */}
            <div 
              className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                background: promptsActivated >= 40 ? 'rgba(0, 122, 255, 0.1)' : 'rgba(0, 122, 255, 0.06)',
                border: '1px solid rgba(0, 122, 255, 0.2)'
              }}
            >
              <span 
                style={{
                  fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                  fontWeight: 400,
                  fontSize: '0.8125rem',
                  color: '#007AFF'
                }}
              >
                Prompts Activated
              </span>
              <span 
                style={{
                  fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  color: '#007AFF'
                }}
              >
                {promptsActivated}/40
              </span>
            </div>

            {/* Gathering Responses */}
            <div 
              className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                background: responsesGathered >= 40 ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.06)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                animation: responsesGathered < 40 && responsesGathered > 0 ? 'pulse 2s infinite' : 'none'
              }}
            >
              <span 
                style={{
                  fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                  fontWeight: 400,
                  fontSize: '0.8125rem',
                  color: '#6366F1'
                }}
              >
                Gathering Responses
              </span>
              <span 
                style={{
                  fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  color: '#6366F1'
                }}
              >
                {responsesGathered}/40
              </span>
            </div>

            {/* Final Analysis */}
            <div 
              className="flex items-center gap-2 px-4 py-2 rounded-full relative overflow-hidden"
              style={{
                background: analysisComplete >= 40 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(142, 142, 147, 0.08)',
                border: `1px solid ${analysisComplete >= 40 ? 'rgba(34, 197, 94, 0.3)' : 'rgba(142, 142, 147, 0.2)'}`
              }}
            >
              {/* Fill animation */}
              <div 
                className="absolute inset-0 transition-all duration-300"
                style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  width: `${(analysisComplete / 40) * 100}%`
                }}
              />
              <span 
                className="relative z-10"
                style={{
                  fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                  fontWeight: 400,
                  fontSize: '0.8125rem',
                  color: analysisComplete >= 40 ? '#22C55E' : '#8E8E93'
                }}
              >
                Final Analysis
              </span>
              <span 
                className="relative z-10"
                style={{
                  fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  color: analysisComplete >= 40 ? '#22C55E' : '#8E8E93'
                }}
              >
                {analysisComplete}/40
              </span>
            </div>
          </motion.div>
        </div>

        {/* Real-Time Probes Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="px-6 flex-1 min-h-0"
        >
          {/* Section Title */}
          <div className="mb-3">
            <span 
              style={{
                fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                fontWeight: 700,
                fontSize: '0.625rem',
                color: '#8E8E93',
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}
            >
              Real-Time Probes
            </span>
          </div>

          {/* Probes List */}
          <div 
            ref={listRef}
            className="overflow-y-auto pr-2"
            style={{ 
              maxHeight: '220px',
              scrollBehavior: 'smooth'
            }}
          >
            {probeQueries.map((query, index) => {
              const status = getProbeStatus(index)
              return (
                <div 
                  key={index}
                  className="flex items-center gap-2 py-1.5"
                >
                  {/* Live indicator */}
                  {status === 'active' && (
                    <span 
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: '#22C55E',
                        animation: 'pulse 1s infinite',
                        boxShadow: '0 0 6px rgba(34, 197, 94, 0.6)'
                      }}
                    />
                  )}
                  {status === 'complete' && (
                    <svg 
                      className="w-3 h-3 flex-shrink-0" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="#22C55E" 
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {(status === 'waiting' || status === 'gathered') && (
                    <span className="w-3 flex-shrink-0" />
                  )}
                  
                  <span 
                    style={{
                      fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                      fontWeight: status === 'active' ? 500 : 300,
                      fontSize: '0.8125rem',
                      color: status === 'active' ? '#1D1D1F' : 
                             status === 'complete' ? '#22C55E' :
                             status === 'gathered' ? '#6366F1' : '#C7C7CC',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {query}
                  </span>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="mt-4 px-6 py-4"
          style={{
            borderTop: '0.5px solid rgba(209, 213, 219, 0.5)',
            background: 'rgba(250, 250, 252, 0.8)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)'
          }}
        >
          <p
            style={{
              fontFamily: 'Google Sans Flex, system-ui, sans-serif',
              fontWeight: 400,
              fontSize: '0.8125rem',
              color: '#6B7280',
              lineHeight: 1.5
            }}
          >
            <span style={{ color: '#1D1D1F', fontWeight: 500 }}>Insight:</span>{' '}
            These 40 probes are optimizing your Intelligence Depth pillar. Expect a score update in ~2 minutes.
          </p>
        </motion.div>
      </motion.div>

      {/* CSS for pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </motion.div>
  )
}
