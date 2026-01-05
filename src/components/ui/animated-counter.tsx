import { useEffect, useState, useRef } from "react";
import { motion, useSpring, useTransform, useInView, MotionValue } from "framer-motion";

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
  const [hasStarted, setHasStarted] = useState(false);
  
  const spring = useSpring(0, {
    mass: 0.8,
    stiffness: 50,
    damping: 15,
  });
  
  const display = useTransform(spring, (current) => {
    const rounded = Math.round(current);
    if (formatFn) {
      return formatFn(rounded);
    }
    return rounded.toLocaleString();
  });

  useEffect(() => {
    if (isInView && !hasStarted) {
      const timeout = setTimeout(() => {
        spring.set(value);
        setHasStarted(true);
      }, delay * 1000);
      return () => clearTimeout(timeout);
    }
  }, [isInView, hasStarted, spring, value, delay]);

  return (
    <span ref={ref} className="relative inline-flex items-baseline">
      {prefix && <span className={className}>{prefix}</span>}
      <motion.span
        className={`${className} tabular-nums`}
        style={{
          display: "inline-block",
        }}
      >
        {display}
      </motion.span>
      {suffix && <span className={className}>{suffix}</span>}
    </span>
  );
};

// Smooth count-up with easing
interface SmoothCounterProps {
  value: number;
  duration?: number;
  delay?: number;
  className?: string;
  formatFn?: (value: number) => string;
}

export const SmoothCounter = ({
  value,
  duration = 2,
  delay = 0,
  className = "",
  formatFn
}: SmoothCounterProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [displayValue, setDisplayValue] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  
  useEffect(() => {
    if (isInView && !hasStarted) {
      const timeout = setTimeout(() => {
        setHasStarted(true);
        const startTime = Date.now();
        const durationMs = duration * 1000;
        
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / durationMs, 1);
          
          // Ease out cubic for smooth deceleration
          const eased = 1 - Math.pow(1 - progress, 3);
          
          setDisplayValue(Math.round(eased * value));
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        
        requestAnimationFrame(animate);
      }, delay * 1000);
      
      return () => clearTimeout(timeout);
    }
  }, [isInView, hasStarted, value, duration, delay]);
  
  const formatted = formatFn ? formatFn(displayValue) : displayValue.toLocaleString();
  
  return (
    <motion.span 
      ref={ref} 
      className={`${className} tabular-nums`}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: hasStarted ? 1 : 0.5 }}
      transition={{ duration: 0.3 }}
    >
      {formatted}
    </motion.span>
  );
};

// Simplified slot counter - cleaner version
interface SlotCounterProps {
  value: number;
  duration?: number;
  delay?: number;
  className?: string;
  digitClassName?: string;
}

export const SlotCounter = ({
  value,
  duration = 2,
  delay = 0,
  className = "",
  digitClassName = ""
}: SlotCounterProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [displayValue, setDisplayValue] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  
  useEffect(() => {
    if (isInView && !hasStarted) {
      const timeout = setTimeout(() => {
        setHasStarted(true);
        const startTime = Date.now();
        const durationMs = duration * 1000;
        
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / durationMs, 1);
          
          // Ease out exponential for a smooth, satisfying finish
          const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          
          setDisplayValue(Math.round(eased * value));
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        
        requestAnimationFrame(animate);
      }, delay * 1000);
      
      return () => clearTimeout(timeout);
    }
  }, [isInView, hasStarted, value, duration, delay]);
  
  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.span
        className={`${digitClassName} tabular-nums`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ 
          opacity: hasStarted ? 1 : 0,
          y: hasStarted ? 0 : 8
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {displayValue.toLocaleString()}
      </motion.span>
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
