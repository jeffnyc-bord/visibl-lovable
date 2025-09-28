import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, TrendingUp, BarChart3, Eye } from "lucide-react"

const loadingMessages = [
  "Analyzing your brand presence...",
  "Scanning AI platforms for mentions...",
  "Gathering visibility insights...",
  "Processing brand performance data...",
  "Calculating engagement metrics...",
]

const floatingIcons = [
  { Icon: Sparkles, delay: 0 },
  { Icon: TrendingUp, delay: 0.5 },
  { Icon: BarChart3, delay: 1 },
  { Icon: Eye, delay: 1.5 },
]

export function BrandLoadingCard() {
  const [currentMessage, setCurrentMessage] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % loadingMessages.length)
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8 bg-gradient-to-br from-primary/5 to-secondary/10 border-primary/20">
      <CardContent className="p-8 text-center">
        {/* Animated Icons */}
        <div className="relative h-24 mb-6">
          {floatingIcons.map(({ Icon, delay }, index) => (
            <div
              key={index}
              className="absolute inset-0 flex items-center justify-center"
              style={{
                animationDelay: `${delay}s`,
              }}
            >
              <div className="animate-bounce">
                <Icon 
                  className="w-8 h-8 text-primary opacity-70"
                  style={{
                    transform: `translateX(${(index - 1.5) * 30}px)`,
                    animationDuration: '2s',
                    animationDelay: `${delay}s`,
                  }}
                />
              </div>
            </div>
          ))}
          
          {/* Central loading spinner */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
        </div>

        {/* Loading Message */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground">
            Fetching Your Data
          </h3>
          <p 
            key={currentMessage}
            className="text-muted-foreground animate-fade-in"
          >
            {loadingMessages[currentMessage]}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 w-full bg-muted rounded-full h-2 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-secondary animate-pulse"></div>
        </div>

        {/* Fun Facts */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground italic">
            💡 Did you know? We analyze over 50+ AI platforms to track your brand visibility!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}