import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import boardLabsIcon from "@/assets/board_labs_icon.png"
import chatGPTLogo from "@/assets/chatGPT_logo.png"
import geminiLogo from "@/assets/gemini_logo.png"
import perplexityLogo from "@/assets/perplexity_logo.png"
import grokLogo from "@/assets/grok_logo_new.png"

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

const chatbots = [
  { id: 'chatgpt', name: 'ChatGPT', logo: chatGPTLogo },
  { id: 'gemini', name: 'Gemini', logo: geminiLogo },
  { id: 'perplexity', name: 'Perplexity', logo: perplexityLogo },
  { id: 'grok', name: 'Grok', logo: grokLogo },
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
  const [promptsGenerated, setPromptsGenerated] = useState(0)
  const [responsesGathered, setResponsesGathered] = useState(0)
  const [analysisComplete, setAnalysisComplete] = useState(0)
  const [activeIndices, setActiveIndices] = useState<Record<string, number>>({
    chatgpt: -1,
    gemini: -1,
    perplexity: -1,
    grok: -1
  })
  const [completedIndices, setCompletedIndices] = useState<Record<string, number[]>>({
    chatgpt: [],
    gemini: [],
    perplexity: [],
    grok: []
  })

  useEffect(() => {
    if (!isOpen) {
      setPromptsGenerated(0)
      setResponsesGathered(0)
      setAnalysisComplete(0)
      setActiveIndices({ chatgpt: -1, gemini: -1, perplexity: -1, grok: -1 })
      setCompletedIndices({ chatgpt: [], gemini: [], perplexity: [], grok: [] })
      return
    }

    // Fast prompts generation
    const promptInterval = setInterval(() => {
      setPromptsGenerated(prev => prev >= 10 ? 10 : prev + 1)
    }, 150)

    // Staggered chatbot processing
    const chatbotDelays = [400, 600, 800, 1000]
    const chatbotIntervals: NodeJS.Timeout[] = []

    chatbots.forEach((bot, botIndex) => {
      const timeout = setTimeout(() => {
        let currentIndex = 0
        const interval = setInterval(() => {
          if (currentIndex < 10) {
            setActiveIndices(prev => ({ ...prev, [bot.id]: currentIndex }))
            
            // Complete previous after short delay
            setTimeout(() => {
              setCompletedIndices(prev => ({
                ...prev,
                [bot.id]: [...prev[bot.id], currentIndex]
              }))
              setResponsesGathered(prev => Math.min(prev + 1, 40))
            }, 300)
            
            currentIndex++
          } else {
            setActiveIndices(prev => ({ ...prev, [bot.id]: -1 }))
            clearInterval(interval)
          }
        }, 450 + (botIndex * 50))

        chatbotIntervals.push(interval)
      }, chatbotDelays[botIndex])

      chatbotIntervals.push(timeout as unknown as NodeJS.Timeout)
    })

    // Analysis phase
    const analysisTimeout = setTimeout(() => {
      const analysisInterval = setInterval(() => {
        setAnalysisComplete(prev => {
          if (prev >= 40) {
            clearInterval(analysisInterval)
            onComplete?.()
            return 40
          }
          return prev + 1
        })
      }, 200)

      return () => clearInterval(analysisInterval)
    }, 6000)

    return () => {
      clearInterval(promptInterval)
      clearTimeout(analysisTimeout)
      chatbotIntervals.forEach(interval => {
        clearInterval(interval)
        clearTimeout(interval as unknown as NodeJS.Timeout)
      })
    }
  }, [isOpen, onComplete])

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Pure White Background */}
      <div className="absolute inset-0 bg-white" />

      {/* Main Container */}
      <motion.div
        initial={{ scale: 0.98, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="relative w-full max-w-4xl mx-4 flex flex-col"
        style={{
          maxHeight: '90vh',
          background: '#FFFFFF',
          border: '1px solid rgba(209, 213, 219, 0.6)',
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
              fontSize: '2rem',
              color: '#1D1D1F',
              letterSpacing: '0.02em',
              lineHeight: 1.3
            }}
          >
            Building {brandName}'s AI future...
          </motion.h1>

          {/* Sequence Pills */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex items-center justify-center gap-3 flex-wrap"
          >
            {/* Input: Prompts Generated */}
            <div 
              className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                background: 'rgba(0, 122, 255, 0.08)',
                border: '1px solid rgba(0, 122, 255, 0.25)'
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
                Input
              </span>
              <span 
                style={{
                  fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  color: '#007AFF'
                }}
              >
                {promptsGenerated} Prompts Generated
              </span>
            </div>

            {/* Execution: Responses */}
            <div 
              className="flex items-center gap-2 px-4 py-2 rounded-full relative overflow-hidden"
              style={{
                background: 'rgba(99, 102, 241, 0.06)',
                border: '1px solid rgba(99, 102, 241, 0.25)'
              }}
            >
              {/* Progressive gradient fill */}
              <div 
                className="absolute inset-0 transition-all duration-300"
                style={{
                  background: 'linear-gradient(90deg, rgba(0, 122, 255, 0.12) 0%, rgba(99, 102, 241, 0.12) 100%)',
                  width: `${(responsesGathered / 40) * 100}%`
                }}
              />
              <span 
                className="relative z-10"
                style={{
                  fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                  fontWeight: 400,
                  fontSize: '0.8125rem',
                  color: '#6366F1'
                }}
              >
                Execution
              </span>
              <span 
                className="relative z-10"
                style={{
                  fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  color: '#6366F1'
                }}
              >
                {responsesGathered}/40 Responses
              </span>
            </div>

            {/* Insight: Analyzed */}
            <div 
              className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                background: analysisComplete > 0 ? 'rgba(34, 197, 94, 0.08)' : 'rgba(142, 142, 147, 0.08)',
                border: `1px solid ${analysisComplete > 0 ? 'rgba(34, 197, 94, 0.25)' : 'rgba(142, 142, 147, 0.25)'}`,
                animation: analysisComplete > 0 && analysisComplete < 40 ? 'subtlePulse 2s infinite' : 'none'
              }}
            >
              <span 
                style={{
                  fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                  fontWeight: 400,
                  fontSize: '0.8125rem',
                  color: analysisComplete > 0 ? '#22C55E' : '#8E8E93'
                }}
              >
                Insight
              </span>
              <span 
                style={{
                  fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  color: analysisComplete > 0 ? '#22C55E' : '#8E8E93'
                }}
              >
                {analysisComplete}/40 Analyzed
              </span>
            </div>
          </motion.div>
        </div>

        {/* Chatbot Matrix Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="px-6 flex-1 min-h-0"
        >
          {/* Section Title */}
          <div className="mb-4">
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
              Multi-Model Discovery
            </span>
          </div>

          {/* 4-Column Chatbot Grid */}
          <div 
            className="grid grid-cols-4 gap-4"
            style={{ maxHeight: '320px' }}
          >
            {chatbots.map((bot, botIndex) => {
              const isReceiving = activeIndices[bot.id] >= 0
              
              return (
                <motion.div
                  key={bot.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + (botIndex * 0.1), duration: 0.4 }}
                  className="flex flex-col rounded-2xl overflow-hidden"
                  style={{
                    background: 'rgba(250, 250, 252, 0.6)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(209, 213, 219, 0.4)',
                    animation: isReceiving ? 'columnPulse 1.5s ease-in-out infinite' : 'none'
                  }}
                >
                  {/* Chatbot Header */}
                  <div 
                    className="flex items-center gap-2 px-3 py-2.5"
                    style={{
                      borderBottom: '1px solid rgba(209, 213, 219, 0.3)'
                    }}
                  >
                    <img 
                      src={bot.logo} 
                      alt={bot.name}
                      className="w-5 h-5 object-contain rounded"
                    />
                    <span
                      style={{
                        fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                        fontWeight: 500,
                        fontSize: '0.75rem',
                        color: '#1D1D1F'
                      }}
                    >
                      {bot.name}
                    </span>
                    {isReceiving && (
                      <span 
                        className="ml-auto w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor: '#22C55E',
                          animation: 'livePulse 1s infinite',
                          boxShadow: '0 0 6px rgba(34, 197, 94, 0.6)'
                        }}
                      />
                    )}
                  </div>

                  {/* Prompts List */}
                  <div className="flex-1 overflow-y-auto px-3 py-2" style={{ maxHeight: '260px' }}>
                    {corePrompts.map((prompt, promptIndex) => {
                      const isActive = activeIndices[bot.id] === promptIndex
                      const isComplete = completedIndices[bot.id].includes(promptIndex)
                      
                      return (
                        <div 
                          key={promptIndex}
                          className="flex items-start gap-2 py-1.5"
                        >
                          {/* Status Icon */}
                          <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center mt-0.5">
                            {isComplete ? (
                              <svg 
                                className="w-3.5 h-3.5" 
                                viewBox="0 0 24 24" 
                                fill="none"
                              >
                                <circle cx="12" cy="12" r="10" fill="#22C55E" fillOpacity="0.15" />
                                <path 
                                  d="M8 12l2.5 2.5L16 9" 
                                  stroke="#22C55E" 
                                  strokeWidth="2" 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round"
                                />
                              </svg>
                            ) : isActive ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                className="w-3.5 h-3.5"
                              >
                                <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                                  <circle 
                                    cx="12" cy="12" r="9" 
                                    stroke="#F59E0B" 
                                    strokeWidth="2" 
                                    strokeOpacity="0.3"
                                  />
                                  <path 
                                    d="M12 3a9 9 0 0 1 9 9" 
                                    stroke="#F59E0B" 
                                    strokeWidth="2" 
                                    strokeLinecap="round"
                                  />
                                </svg>
                              </motion.div>
                            ) : (
                              <div 
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: '#D1D5DB' }}
                              />
                            )}
                          </div>
                          
                          <span 
                            style={{
                              fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                              fontWeight: 400,
                              fontSize: '0.6875rem',
                              lineHeight: 1.4,
                              color: isComplete ? '#22C55E' : isActive ? '#F59E0B' : '#9CA3AF'
                            }}
                          >
                            {prompt}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
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
            These 40 unique data points are optimizing your Intelligence Depth pillar. High-fidelity results expected in ~2 minutes.
          </p>
        </motion.div>
      </motion.div>

      {/* CSS Animations */}
      <style>{`
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.9); }
        }
        @keyframes columnPulse {
          0%, 100% { 
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
            border-color: rgba(209, 213, 219, 0.4);
          }
          50% { 
            box-shadow: 0 0 20px 0 rgba(99, 102, 241, 0.08);
            border-color: rgba(99, 102, 241, 0.3);
          }
        }
        @keyframes subtlePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </motion.div>
  )
}
