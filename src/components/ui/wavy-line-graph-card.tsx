import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HelpCircle } from "lucide-react";

interface DataPoint {
  month: string;
  mentions: number;
}

interface WavyLineGraphCardProps {
  title: string;
  description: string;
  data: DataPoint[];
  icon?: string;
  onTooltipToggle?: () => void;
  showTooltip?: boolean;
  tooltipContent?: string;
}

export const WavyLineGraphCard: React.FC<WavyLineGraphCardProps> = ({
  title,
  description,
  data,
  icon,
  onTooltipToggle,
  showTooltip,
  tooltipContent
}) => {
  const maxValue = Math.max(...data.map(d => d.mentions));
  const minValue = Math.min(...data.map(d => d.mentions));
  const range = maxValue - minValue;
  
  // Create SVG path for wavy line
  const createWavyPath = () => {
    const width = 400;
    const height = 200;
    const padding = 40;
    const chartWidth = width - (padding * 2);
    const chartHeight = height - (padding * 2);
    
    const points = data.map((d, i) => {
      const x = padding + (i / (data.length - 1)) * chartWidth;
      const y = padding + chartHeight - ((d.mentions - minValue) / range) * chartHeight;
      return { x, y, value: d.mentions };
    });
    
    // Create smooth curve using bezier curves
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prevPoint = points[i - 1];
      const currentPoint = points[i];
      
      // Control points for smooth curve
      const cp1x = prevPoint.x + (currentPoint.x - prevPoint.x) * 0.3;
      const cp1y = prevPoint.y;
      const cp2x = currentPoint.x - (currentPoint.x - prevPoint.x) * 0.3;
      const cp2y = currentPoint.y;
      
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${currentPoint.x} ${currentPoint.y}`;
    }
    
    return { path, points };
  };
  
  const { path, points } = createWavyPath();
  const lastPoint = points[points.length - 1];
  
  // Create area fill path with diagonal stripes
  const createAreaPath = () => {
    const areaPath = path + ` L ${lastPoint.x} 240 L ${points[0].x} 240 Z`;
    return areaPath;
  };
  
  return (
    <Card className="group relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 border border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {icon && <img src={icon} alt={title} className="w-5 h-5" />}
            <span className="text-white">{title}</span>
          </div>
          {onTooltipToggle && (
            <div className="relative">
              <HelpCircle 
                className="w-4 h-4 text-white/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" 
                onClick={onTooltipToggle}
              />
              {showTooltip && tooltipContent && (
                <div className="absolute right-0 top-6 z-50 w-64 p-3 text-xs bg-black/90 border border-white/20 rounded-md shadow-xl backdrop-blur-sm">
                  <p className="text-white">{tooltipContent}</p>
                </div>
              )}
            </div>
          )}
        </CardTitle>
        <CardDescription className="text-white/70">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {/* Main metrics */}
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-white">
              {lastPoint.value.toLocaleString()}
              <span className="text-lg text-white/70 ml-2">Total sent</span>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm text-white/70">
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
              176 Total Sent
            </Badge>
            <span>65% Open rate</span>
            <span>30% Click rate</span>
            <span>12% Reply rate</span>
            <span>4 New opportunities</span>
          </div>
        </div>
        
        {/* SVG Chart */}
        <div className="relative h-48">
          <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 400 200" 
            className="overflow-visible"
          >
            {/* Define gradient and pattern */}
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#60A5FA" />
              </linearGradient>
              
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#1E40AF" stopOpacity="0.2" />
              </linearGradient>
              
              <pattern id="diagonalStripes" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
                <rect width="8" height="8" fill="url(#areaGradient)" />
                <rect width="4" height="8" fill="#60A5FA" fillOpacity="0.3" />
              </pattern>
              
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Grid lines */}
            {[50, 100, 150, 200].map((y) => (
              <line
                key={y}
                x1="40"
                y1={40 + (200 - y) * 0.8}
                x2="360"
                y2={40 + (200 - y) * 0.8}
                stroke="white"
                strokeOpacity="0.1"
                strokeWidth="1"
                strokeDasharray="5,5"
              />
            ))}
            
            {/* Area fill with diagonal stripes */}
            <path
              d={createAreaPath()}
              fill="url(#diagonalStripes)"
              opacity="0.8"
            />
            
            {/* Main line with glow */}
            <path
              d={path}
              stroke="url(#lineGradient)"
              strokeWidth="3"
              fill="none"
              filter="url(#glow)"
            />
            
            {/* Data point highlight */}
            <circle
              cx={lastPoint.x}
              cy={lastPoint.y}
              r="5"
              fill="white"
              stroke="#3B82F6"
              strokeWidth="2"
            />
            
            {/* Tooltip for highlighted point */}
            <g>
              <rect
                x={lastPoint.x - 50}
                y={lastPoint.y - 40}
                width="100"
                height="30"
                rx="6"
                fill="rgba(0, 0, 0, 0.8)"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="1"
              />
              <text
                x={lastPoint.x}
                y={lastPoint.y - 30}
                textAnchor="middle"
                className="text-xs fill-white"
              >
                Fri, 27 Dec 2024
              </text>
              <text
                x={lastPoint.x}
                y={lastPoint.y - 18}
                textAnchor="middle"
                className="text-xs fill-white font-semibold"
              >
                {lastPoint.value} Total Sent
              </text>
            </g>
            
            {/* X-axis labels */}
            {data.map((d, i) => {
              const x = 40 + (i / (data.length - 1)) * 320;
              return (
                <text
                  key={d.month}
                  x={x}
                  y="190"
                  textAnchor="middle"
                  className="text-xs fill-white/70"
                >
                  {d.month}
                </text>
              );
            })}
          </svg>
        </div>
      </CardContent>
    </Card>
  );
};