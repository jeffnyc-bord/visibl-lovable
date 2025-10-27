import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

interface ScoreDialProps {
  currentScore: number;
  previousScore: number;
  change: number;
  label: string;
  icon?: React.ReactNode;
}

export const ScoreDial = ({ 
  currentScore, 
  previousScore, 
  change,
  label,
  icon
}: ScoreDialProps) => {
  const [animatedScore, setAnimatedScore] = useState(previousScore);
  const [animatedProgress, setAnimatedProgress] = useState(previousScore);
  const [showChange, setShowChange] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const size = 140;
  const strokeWidth = 10;
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    // Start animation after a brief delay
    const startDelay = setTimeout(() => {
      const duration = 1500; // 1.5 seconds
      const frameDuration = 1000 / 60; // 60fps
      const totalFrames = Math.round(duration / frameDuration);
      let frame = 0;

      const animate = () => {
        frame++;
        const progress = frame / totalFrames;
        
        // Ease-out-back function for overshoot effect
        const easeOutBack = (x: number): number => {
          const c1 = 1.70158;
          const c3 = c1 + 1;
          return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
        };

        const easedProgress = easeOutBack(progress);
        const diff = currentScore - previousScore;
        const newValue = previousScore + (diff * easedProgress);

        // Update both the number and the progress
        setAnimatedScore(Math.min(currentScore, Math.round(newValue)));
        setAnimatedProgress(Math.min(currentScore, newValue));

        if (frame < totalFrames) {
          requestAnimationFrame(animate);
        } else {
          // Ensure we end exactly at current score
          setAnimatedScore(currentScore);
          setAnimatedProgress(currentScore);
          // Show the change badge after animation completes
          setTimeout(() => setShowChange(true), 100);
        }
      };

      requestAnimationFrame(animate);
    }, 300);

    return () => clearTimeout(startDelay);
  }, [currentScore, previousScore]);

  // Calculate the stroke dash offset for the circular progress
  const progress = (animatedProgress / 100) * circumference;
  const offset = circumference - progress;

  return (
    <div 
      className="relative flex flex-col items-center justify-center group cursor-pointer transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Label and Icon */}
      <div className="flex items-center space-x-2 mb-4">
        {icon}
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      </div>

      {/* Circular Dial */}
      <div className="relative">
        <svg
          width={size}
          height={size}
          className="transform -rotate-90 transition-all duration-300"
          style={{
            filter: isHovered ? 'drop-shadow(0 0 20px hsl(var(--primary) / 0.4))' : 'none'
          }}
        >
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="hsl(var(--muted))"
            strokeWidth={strokeWidth}
            fill="none"
          />
          
          {/* Animated progress circle with gradient */}
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--primary) / 0.6)" />
            </linearGradient>
          </defs>
          
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="url(#scoreGradient)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-300"
            style={{
              filter: isHovered ? 'drop-shadow(0 0 8px hsl(var(--primary) / 0.6))' : 'none'
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-bold text-foreground tabular-nums">
            {animatedScore}
          </div>
          
          {/* Change indicator with pop animation */}
          {showChange && (
            <div className="mt-1">
              {isHovered ? (
                <div className="text-xs text-muted-foreground animate-fade-in whitespace-nowrap">
                  Up from {previousScore} last week
                </div>
              ) : (
                <Badge 
                  variant="secondary" 
                  className="bg-success/10 text-success border-success/20 animate-scale-in"
                >
                  +{change}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Subtle glow effect on hover */}
      {isHovered && (
        <div className="absolute inset-0 rounded-full bg-primary/5 animate-scale-in -z-10" />
      )}
    </div>
  );
};
