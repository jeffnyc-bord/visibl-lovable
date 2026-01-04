import { useState, useEffect } from "react"
import { motion } from "framer-motion"
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

  useEffect(() => {
    if (!isOpen) {
      setActiveIndex(-1)
      setCompletedCount(0)
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
          onComplete?.()
        }, 800)
      }
    }, 800)

    return () => clearInterval(interval)
  }, [isOpen, onComplete])

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white"
    >
      <div className="w-full max-w-xl mx-auto px-8">
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
      </div>
    </motion.div>
  )
}
