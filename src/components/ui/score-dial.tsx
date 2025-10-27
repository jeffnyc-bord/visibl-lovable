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

  return (
    <div 
      className="w-full transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Label and Icon */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {icon}
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
        </div>
      </div>

      {/* Score Display */}
      <div className="flex items-end gap-2 mb-2">
        <span className="text-3xl font-bold text-foreground tabular-nums">
          {animatedScore}
        </span>
        {showChange && (
          <>
            {isHovered ? (
              <span className="text-xs text-muted-foreground mb-1 animate-fade-in whitespace-nowrap">
                Up from {previousScore} last week
              </span>
            ) : (
              <Badge 
                variant="secondary" 
                className="bg-success/10 text-success border-success/20 animate-scale-in text-xs mb-1"
              >
                +{change}
              </Badge>
            )}
          </>
        )}
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
        <div 
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-300"
          style={{ 
            width: `${animatedProgress}%`,
            filter: isHovered ? 'drop-shadow(0 0 8px hsl(var(--primary) / 0.6))' : 'none'
          }}
        />
      </div>
    </div>
  );
};
