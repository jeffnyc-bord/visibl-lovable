import { useEffect, useState, useRef } from "react";
import { motion, useSpring, useTransform, useInView } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  delay?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
  formatFn?: (value: number) => string;
  showGlow?: boolean;
  glowColor?: string;
}

export const AnimatedCounter = ({
  value,
  duration = 2,
  delay = 0,
  className = "",
  suffix = "",
  prefix = "",
  formatFn,
  showGlow = true,
  glowColor = "hsl(var(--primary))"
}: AnimatedCounterProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [hasAnimated, setHasAnimated] = useState(false);
  
  const spring = useSpring(0, {
    mass: 1,
    stiffness: 75,
    damping: 15,
    restDelta: 0.001
  });
  
  const display = useTransform(spring, (current) => {
    const rounded = Math.round(current);
    if (formatFn) {
      return formatFn(rounded);
    }
    return rounded.toLocaleString();
  });

  useEffect(() => {
    if (isInView && !hasAnimated) {
      const timeout = setTimeout(() => {
        spring.set(value);
        setHasAnimated(true);
      }, delay * 1000);
      return () => clearTimeout(timeout);
    }
  }, [isInView, hasAnimated, spring, value, delay]);

  return (
    <span ref={ref} className="relative inline-flex items-baseline">
      {prefix && <span className={className}>{prefix}</span>}
      <motion.span
        className={className}
        style={{
          display: "inline-block",
          textShadow: showGlow && hasAnimated 
            ? `0 0 40px ${glowColor}40, 0 0 80px ${glowColor}20` 
            : "none",
        }}
      >
        {display}
      </motion.span>
      {suffix && <span className={className}>{suffix}</span>}
      
      {/* Sparkle effect on completion */}
      {showGlow && hasAnimated && (
        <motion.span
          className="absolute -inset-2 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.6, delay: duration }}
        >
          <span 
            className="absolute inset-0 rounded-lg"
            style={{
              background: `radial-gradient(ellipse at center, ${glowColor}15 0%, transparent 70%)`,
            }}
          />
        </motion.span>
      )}
    </span>
  );
};

// Slot machine style counter for more dramatic effect
interface SlotCounterProps {
  value: number;
  duration?: number;
  delay?: number;
  className?: string;
  digitClassName?: string;
}

export const SlotCounter = ({
  value,
  duration = 1.5,
  delay = 0,
  className = "",
  digitClassName = ""
}: SlotCounterProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [displayValue, setDisplayValue] = useState("0");
  const [isAnimating, setIsAnimating] = useState(false);
  
  const digits = value.toString();
  
  useEffect(() => {
    if (isInView && !isAnimating) {
      const timeout = setTimeout(() => {
        setIsAnimating(true);
        
        // Animate through random digits before settling
        const totalSteps = 20;
        const stepDuration = (duration * 1000) / totalSteps;
        let step = 0;
        
        const interval = setInterval(() => {
          step++;
          
          if (step >= totalSteps) {
            setDisplayValue(value.toLocaleString());
            clearInterval(interval);
          } else {
            // Show random digits, progressively locking in from left to right
            const progress = step / totalSteps;
            const lockedDigits = Math.floor(progress * digits.length);
            
            let newDisplay = "";
            for (let i = 0; i < digits.length; i++) {
              if (i < lockedDigits) {
                newDisplay += digits[i];
              } else {
                newDisplay += Math.floor(Math.random() * 10).toString();
              }
            }
            // Add commas
            setDisplayValue(parseInt(newDisplay).toLocaleString());
          }
        }, stepDuration);
        
        return () => clearInterval(interval);
      }, delay * 1000);
      
      return () => clearTimeout(timeout);
    }
  }, [isInView, isAnimating, value, digits.length, duration, delay]);
  
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.span
        className={digitClassName}
        initial={{ filter: "blur(4px)" }}
        animate={{ 
          filter: isAnimating ? "blur(0px)" : "blur(4px)",
        }}
        transition={{ duration: 0.3 }}
      >
        {displayValue}
      </motion.span>
      
      {/* Scan line effect */}
      {isAnimating && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: duration, ease: "easeOut" }}
        >
          <motion.div
            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent"
            initial={{ top: "0%" }}
            animate={{ top: "100%" }}
            transition={{ duration: duration * 0.8, ease: "easeInOut" }}
          />
        </motion.div>
      )}
    </div>
  );
};

// Percentage counter with ring animation
interface PercentageCounterProps {
  value: number;
  duration?: number;
  delay?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export const PercentageCounter = ({
  value,
  duration = 2,
  delay = 0,
  size = 120,
  strokeWidth = 8,
  className = ""
}: PercentageCounterProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  const circumference = (size - strokeWidth) * Math.PI;
  
  const spring = useSpring(0, {
    mass: 1,
    stiffness: 50,
    damping: 20
  });
  
  const strokeDashoffset = useTransform(
    spring,
    (current) => circumference - (current / 100) * circumference
  );
  
  const displayValue = useTransform(spring, (current) => Math.round(current));
  
  useEffect(() => {
    if (isInView) {
      const timeout = setTimeout(() => {
        spring.set(value);
      }, delay * 1000);
      return () => clearTimeout(timeout);
    }
  }, [isInView, spring, value, delay]);
  
  return (
    <div ref={ref} className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Background circle */}
      <svg className="absolute inset-0 -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={(size - strokeWidth) / 2}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={(size - strokeWidth) / 2}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset }}
        />
      </svg>
      
      {/* Center value */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span className="text-2xl font-light text-foreground tabular-nums">
          {displayValue}
        </motion.span>
        <span className="text-sm text-muted-foreground">%</span>
      </div>
    </div>
  );
};
