import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import boardLabsIcon from "@/assets/board_labs_icon.png"

const progressMessages = [
  "Analyzing your brand voice for ChatGPT...",
  "Mapping your influence across the AI ecosystem...",
  "Preparing your content for the next generation of search...",
  "Discovering opportunities in conversational AI...",
  "Building your visibility blueprint...",
  "Connecting the dots across platforms...",
]

const collageImages = [
  {
    src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80",
    alt: "Modern minimalist retail storefront"
  },
  {
    src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&auto=format&fit=crop&q=80",
    alt: "Entrepreneur smiling while working on laptop"
  },
  {
    src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80",
    alt: "Sleek modern office space"
  },
  {
    src: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&auto=format&fit=crop&q=80",
    alt: "Professional business growth meeting"
  },
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
  const [currentImage, setCurrentImage] = useState(0)
  const [currentMessage, setCurrentMessage] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isOpen) {
      setCurrentImage(0)
      setCurrentMessage(0)
      setProgress(0)
      return
    }

    // Image rotation every 2.5 seconds
    const imageInterval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % collageImages.length)
    }, 2500)

    // Message rotation every 3 seconds
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % progressMessages.length)
    }, 3000)

    // Progress simulation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          onComplete?.()
          return 100
        }
        return prev + 0.5
      })
    }, 150)

    return () => {
      clearInterval(imageInterval)
      clearInterval(messageInterval)
      clearInterval(progressInterval)
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
      {/* White Background with Subtle Mesh Gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(255, 255, 255, 1) 0%, 
              rgba(248, 248, 250, 1) 25%,
              rgba(245, 245, 248, 1) 50%,
              rgba(250, 250, 252, 1) 75%,
              rgba(255, 255, 255, 1) 100%
            )
          `
        }}
      />

      {/* Subtle Warm Silver Mesh Overlay */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, rgba(200, 200, 210, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(180, 185, 195, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(190, 195, 205, 0.08) 0%, transparent 70%)
          `
        }}
      />

      {/* Glassmorphism Container */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-4xl mx-6 rounded-3xl overflow-hidden"
        style={{
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(255, 255, 255, 0.8)'
        }}
      >
        <div className="p-8 md:p-12">
          {/* Header with Logo */}
          <div className="flex items-center justify-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center shadow-lg"
            >
              <img 
                src={boardLabsIcon} 
                alt="Board Labs"
                className="w-8 h-8 object-contain"
              />
            </motion.div>
          </div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-center mb-2"
            style={{
              fontFamily: 'Google Sans Flex, system-ui, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              color: '#1D1D1F',
              letterSpacing: '-0.02em',
              lineHeight: 1.2
            }}
          >
            Building {brandName}'s AI future...
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-center mb-10"
            style={{
              fontFamily: 'Google Sans Flex, system-ui, sans-serif',
              fontWeight: 300,
              fontSize: '1rem',
              color: '#86868B',
              letterSpacing: '0.01em'
            }}
          >
            Preparing your visibility dashboard
          </motion.p>

          {/* Dynamic Image Collage with Ken Burns Effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="relative w-full aspect-[16/9] max-h-[320px] rounded-2xl overflow-hidden mb-8 shadow-xl"
            style={{
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1), 0 8px 24px rgba(0, 0, 0, 0.06)'
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImage}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1.05,
                  x: currentImage % 2 === 0 ? [0, 10] : [0, -10],
                  y: currentImage % 2 === 0 ? [0, -5] : [0, 5]
                }}
                exit={{ opacity: 0 }}
                transition={{ 
                  opacity: { duration: 0.8 },
                  scale: { duration: 2.5, ease: "easeOut" },
                  x: { duration: 2.5, ease: "easeOut" },
                  y: { duration: 2.5, ease: "easeOut" }
                }}
                className="absolute inset-0"
              >
                <img
                  src={collageImages[currentImage].src}
                  alt={collageImages[currentImage].alt}
                  className="w-full h-full object-cover"
                />
                {/* Subtle gradient overlay for text readability */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to top, rgba(255,255,255,0.1) 0%, transparent 30%)'
                  }}
                />
              </motion.div>
            </AnimatePresence>

            {/* Image indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {collageImages.map((_, idx) => (
                <div
                  key={idx}
                  className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: idx === currentImage ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)',
                    transform: idx === currentImage ? 'scale(1.2)' : 'scale(1)'
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Progress Feed */}
          <div className="text-center mb-6 h-6 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentMessage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                style={{
                  fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                  fontWeight: 400,
                  fontSize: '0.9rem',
                  color: '#007AFF',
                  letterSpacing: '0.01em'
                }}
              >
                {progressMessages[currentMessage]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Elegant Progress Bar */}
          <div className="w-full max-w-md mx-auto">
            <div 
              className="h-1 rounded-full overflow-hidden"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.06)' }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #007AFF 0%, #5AC8FA 100%)',
                  width: `${progress}%`
                }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center mt-4"
              style={{
                fontFamily: 'Google Sans Flex, system-ui, sans-serif',
                fontWeight: 300,
                fontSize: '0.8rem',
                color: '#86868B',
                letterSpacing: '0.02em'
              }}
            >
              This usually takes about 30 seconds
            </motion.p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
