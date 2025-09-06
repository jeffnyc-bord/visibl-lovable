import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DataPoint {
  date: string;
  value: number;
  timestamp: string;
}

interface WavyLineGraphCardProps {
  title: string;
  subtitle?: string;
  data: DataPoint[];
  className?: string;
}

export const WavyLineGraphCard = ({ title, subtitle, data, className }: WavyLineGraphCardProps) => {
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Calculate dimensions and scaling
  const width = 320;
  const height = 180;
  const padding = 40;
  const graphWidth = width - padding * 2;
  const graphHeight = height - padding * 2;

  // Find min/max values for scaling
  const values = data.map(d => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valueRange = maxValue - minValue || 1;

  // Generate smooth wavy path
  const generateWavyPath = () => {
    if (data.length === 0) return '';

    const points = data.map((point, index) => {
      const x = padding + (index / (data.length - 1)) * graphWidth;
      const y = padding + graphHeight - ((point.value - minValue) / valueRange) * graphHeight;
      return { x, y, data: point };
    });

    // Create smooth curve using quadratic bezier curves
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prevPoint = points[i - 1];
      const currentPoint = points[i];
      
      // Control point for smooth curve
      const cpX = (prevPoint.x + currentPoint.x) / 2;
      const cpY = (prevPoint.y + currentPoint.y) / 2;
      
      if (i === 1) {
        path += ` Q ${cpX} ${prevPoint.y} ${currentPoint.x} ${currentPoint.y}`;
      } else {
        path += ` T ${currentPoint.x} ${currentPoint.y}`;
      }
    }

    return { path, points };
  };

  const pathData = generateWavyPath();
  const path = typeof pathData === 'string' ? pathData : pathData.path;
  const points = typeof pathData === 'string' ? [] : pathData.points;

  // Generate area fill path with diagonal stripes
  const generateAreaPath = () => {
    if (!path) return '';
    const lastPoint = points[points.length - 1];
    const firstPoint = points[0];
    return `${path} L ${lastPoint.x} ${height - padding} L ${firstPoint.x} ${height - padding} Z`;
  };

  const handleMouseMove = (event: React.MouseEvent<SVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    setMousePosition({ x, y });

    // Find closest data point
    const closest = points.reduce((prev, curr) => {
      const prevDistance = Math.abs(prev.x - x);
      const currDistance = Math.abs(curr.x - x);
      return currDistance < prevDistance ? curr : prev;
    });

    if (Math.abs(closest.x - x) < 20) {
      setHoveredPoint(closest.data);
    } else {
      setHoveredPoint(null);
    }
  };

  return (
    <Card className={cn(
      "relative overflow-hidden border-0 p-0 bg-gradient-to-br from-[#081729] via-[#0F2847] to-[#1A365D]",
      className
    )}>
      {/* Glassy border effect */}
      <div className="absolute inset-0 rounded-lg border border-white/10 pointer-events-none" />
      
      {/* Subtle grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 10px,
            rgba(255,255,255,0.1) 10px,
            rgba(255,255,255,0.1) 11px
          )`
        }}
      />

      {/* Top highlight reflection */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative p-6">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
          {subtitle && <p className="text-sm text-white/60">{subtitle}</p>}
        </div>

        {/* Graph Container */}
        <div className="relative">
          <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            className="overflow-visible"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredPoint(null)}
          >
            {/* Grid lines */}
            <defs>
              {/* Diagonal stripe pattern for area fill */}
              <pattern id="diagonalStripes" patternUnits="userSpaceOnUse" width="8" height="8">
                <path d="M0,8 L8,0" stroke="rgba(93,139,255,0.3)" strokeWidth="1"/>
              </pattern>
              
              {/* Glow filter for the line */}
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Horizontal grid lines */}
            {[0, 1, 2, 3, 4].map(i => {
              const y = padding + (i / 4) * graphHeight;
              return (
                <line
                  key={i}
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="1"
                />
              );
            })}

            {/* Area fill with diagonal stripes */}
            <path
              d={generateAreaPath()}
              fill="url(#diagonalStripes)"
              opacity="0.6"
            />

            {/* Main wavy line */}
            <path
              d={path}
              fill="none"
              stroke="#5D8BFF"
              strokeWidth="3"
              filter="url(#glow)"
              className="drop-shadow-lg"
            />

            {/* Data points */}
            {points.map((point, index) => (
              <circle
                key={index}
                cx={point.x}
                cy={point.y}
                r={hoveredPoint === point.data ? 6 : 3}
                fill={hoveredPoint === point.data ? "#FFFFFF" : "#5D8BFF"}
                stroke={hoveredPoint === point.data ? "#5D8BFF" : "transparent"}
                strokeWidth="2"
                className="transition-all duration-200 cursor-pointer"
                style={{
                  filter: hoveredPoint === point.data ? 'drop-shadow(0 0 8px rgba(93,139,255,0.8))' : 'none'
                }}
              />
            ))}

            {/* Y-axis labels */}
            {[0, 1, 2, 3, 4].map(i => {
              const value = minValue + (i / 4) * valueRange;
              const y = padding + ((4 - i) / 4) * graphHeight;
              return (
                <text
                  key={i}
                  x={padding - 10}
                  y={y + 4}
                  fill="rgba(255,255,255,0.6)"
                  fontSize="12"
                  textAnchor="end"
                  className="font-mono"
                >
                  {Math.round(value)}
                </text>
              );
            })}

            {/* X-axis labels */}
            {data.map((point, index) => {
              if (index % Math.ceil(data.length / 4) === 0) {
                const x = padding + (index / (data.length - 1)) * graphWidth;
                return (
                  <text
                    key={index}
                    x={x}
                    y={height - padding + 20}
                    fill="rgba(255,255,255,0.6)"
                    fontSize="12"
                    textAnchor="middle"
                    className="font-mono"
                  >
                    {point.date}
                  </text>
                );
              }
              return null;
            })}
          </svg>

          {/* Tooltip */}
          {hoveredPoint && (
            <div
              className="absolute pointer-events-none z-10 transition-all duration-200"
              style={{
                left: mousePosition.x + 10,
                top: mousePosition.y - 60,
              }}
            >
              <div className="bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 text-white shadow-xl">
                <div className="text-xs text-white/80 mb-1">{hoveredPoint.timestamp}</div>
                <div className="text-sm font-semibold">{hoveredPoint.value} Total Sent</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};