import { useState, useEffect } from "react"
import { Brain, TrendingUp, BarChart3, Eye, Zap, Search, Target, Activity, Layers, Radar } from "lucide-react"
import perplexityLogo from "@/assets/perplexity_logo.png"
import geminiLogo from "@/assets/gemini_logo.png"
import grokLogo from "@/assets/grok_logo.png"
import chatGPTLogo from "@/assets/chatGPT_logo.png"

const loadingMessages = [
  "Analyzing your brand presence across AI platforms...",
  "Scanning ChatGPT, Claude, Gemini for brand mentions...",
  "Gathering visibility insights from 50+ AI sources...",
  "Processing brand performance data in real-time...",
  "Calculating engagement metrics and sentiment...",
  "Mapping competitive landscape and opportunities...",
  "Identifying trending topics and conversations...",
]

const floatingElements = [
  { logo: chatGPTLogo, name: 'ChatGPT', position: { top: '10%', left: '15%' }, delay: 0 },
  { logo: geminiLogo, name: 'Gemini', position: { top: '20%', right: '10%' }, delay: 0.3 },
  { logo: perplexityLogo, name: 'Perplexity', position: { top: '60%', left: '8%' }, delay: 0.6 },
  { logo: grokLogo, name: 'Grok', position: { bottom: '25%', right: '15%' }, delay: 0.9 },
  { logo: chatGPTLogo, name: 'ChatGPT', position: { top: '45%', left: '85%' }, delay: 1.2 },
  { logo: geminiLogo, name: 'Gemini', position: { bottom: '15%', left: '25%' }, delay: 1.5 },
  { logo: perplexityLogo, name: 'Perplexity', position: { top: '75%', right: '25%' }, delay: 1.8 },
  { logo: grokLogo, name: 'Grok', position: { top: '35%', left: '5%' }, delay: 2.1 },
]

const centralIcons = [
  { logo: chatGPTLogo, name: 'ChatGPT', delay: 0 },
  { logo: geminiLogo, name: 'Gemini', delay: 0.4 },
  { logo: perplexityLogo, name: 'Perplexity', delay: 0.8 },
  { logo: grokLogo, name: 'Grok', delay: 1.2 },
]

const aiPlatforms = [
  { name: 'ChatGPT', logo: chatGPTLogo },
  { name: 'Gemini', logo: geminiLogo },
  { name: 'Perplexity', logo: perplexityLogo },
  { name: 'Grok', logo: grokLogo },
]

export function BrandLoadingCard() {
  const [currentMessage, setCurrentMessage] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % loadingMessages.length)
    }, 2000)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 10 // Reset to create continuous flow
        return prev + Math.random() * 15 + 5
      })
    }, 800)

    return () => {
      clearInterval(messageInterval)
      clearInterval(progressInterval)
    }
  }, [])

  return (
    <div className="relative w-full h-[calc(100vh-200px)] min-h-[600px] bg-gradient-to-br from-background via-primary/5 to-secondary/10 rounded-xl overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-30">
        <div 
          className="absolute inset-0 bg-grid-pattern animate-pulse"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
            animation: 'shimmer 3s ease-in-out infinite alternate'
          }}
        />
      </div>

      {/* Floating Background Elements */}
      {floatingElements.map(({ logo, name, position, delay }, index) => (
        <div
          key={index}
          className="absolute opacity-30 animate-bounce"
          style={{
            ...position,
            animationDelay: `${delay}s`,
            animationDuration: '3s',
          }}
        >
          <img 
            src={logo}
            alt={name}
            className="w-8 h-8 animate-pulse filter grayscale hover:grayscale-0 transition-all duration-300"
            style={{ animationDelay: `${delay + 1}s` }}
          />
        </div>
      ))}

      {/* Main Content Container */}
      <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
        
        {/* Central Animation Hub */}
        <div className="relative mb-12">
          {/* Outer Ring */}
          <div className="w-32 h-32 border-2 border-primary/30 rounded-full animate-spin" style={{ animationDuration: '8s' }}>
            <div className="absolute inset-2 border border-secondary/40 rounded-full animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }}>
              <div className="absolute inset-2 border border-primary/20 rounded-full animate-spin" style={{ animationDuration: '4s' }}>
              </div>
            </div>
          </div>
          
          {/* Central Icons Orbit */}
          {centralIcons.map(({ logo, name, delay }, index) => {
            const angle = (index * 90) - 45
            const radius = 50
            const x = Math.cos((angle * Math.PI) / 180) * radius
            const y = Math.sin((angle * Math.PI) / 180) * radius
            
            return (
              <div
                key={index}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                  animation: `spin ${8 + index}s linear infinite`,
                  animationDelay: `${delay}s`
                }}
              >
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm animate-pulse p-2">
                  <img 
                    src={logo} 
                    alt={name}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )
          })}
          
          {/* Center Brain Icon */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center shadow-lg animate-pulse backdrop-blur-sm p-3">
              <img 
                src={chatGPTLogo} 
                alt="AI Intelligence"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Loading Content */}
        <div className="space-y-6 max-w-2xl">
          <h2 className="text-3xl font-bold" style={{ color: '#162239' }}>
            Fetching Your Brand Intelligence
          </h2>
          
          <div className="relative h-8">
            <p 
              key={currentMessage}
              className="absolute inset-0 text-lg text-muted-foreground animate-fade-in font-medium"
            >
              {loadingMessages[currentMessage]}
            </p>
          </div>

          {/* Enhanced Progress Bar */}
          <div className="w-full max-w-md mx-auto space-y-3">
            <div className="relative h-3 bg-muted/50 rounded-full overflow-hidden">
              <div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-secondary to-primary rounded-full transition-all duration-1000 ease-out"
                style={{ 
                  width: `${progress}%`,
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 2s ease-in-out infinite'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Initializing...</span>
              <span>{Math.round(progress)}%</span>
              <span>Almost there!</span>
            </div>
          </div>
        </div>

        {/* AI Platform Indicators */}
        <div className="mt-12 grid grid-cols-4 gap-4 w-full max-w-md opacity-60">
          {aiPlatforms.map((platform, index) => (
            <div 
              key={platform.name}
              className="flex flex-col items-center space-y-2 animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="w-8 h-8 p-1 bg-white/10 rounded-full backdrop-blur-sm animate-pulse" style={{ animationDelay: `${index * 0.3}s` }}>
                <img 
                  src={platform.logo} 
                  alt={platform.name}
                  className="w-full h-full object-contain filter brightness-75"
                />
              </div>
              <span className="text-xs text-muted-foreground">{platform.name}</span>
            </div>
          ))}
        </div>

        {/* Fun Fact */}
        <div className="mt-8 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 max-w-lg animate-fade-in" style={{ animationDelay: '1s' }}>
          <p className="text-sm text-muted-foreground">
            🚀 <strong>Pro Tip:</strong> We're analyzing over 50+ AI platforms and processing millions of data points to give you the most comprehensive brand visibility insights!
          </p>
        </div>
      </div>
    </div>
  )
}