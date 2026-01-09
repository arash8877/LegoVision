
import React from 'react';

interface RealisticBrickProps {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  studs?: number;
  rotate?: number;
  className?: string;
  opacity?: string;
}

/**
 * Cartoon-Style LEGO Brick Component (SVG Implementation)
 * Enforces uniform color rules:
 * - Sides use the same base color with a simple opacity overlay for shading.
 * - Studs match the body color perfectly.
 */
const RealisticBrick: React.FC<RealisticBrickProps> = ({ 
  x, y, w, h, color, studs = 0, rotate = 0, className = "", opacity = "1" 
}) => {
  const cornerRadius = 10;
  const faceDepth = 12; 
  const studTopHeight = 6; 
  const outlineColor = "rgba(0,0,0,0.2)";
  const outlineWidth = 1.5;
  
  const studRows = studs > 4 ? 2 : 1;
  const studsPerRow = Math.ceil(studs / studRows);
  const studSpacingX = w / (studsPerRow + 1);
  const studSpacingY = h / (studRows + 1);
  const studRadius = (w / (studsPerRow + 1)) * 0.42;

  return (
    <g transform={`rotate(${rotate} ${x + w/2} ${y + h/2})`} className={`${className} select-none`} opacity={opacity}>
      {/* 1. Ground Shadow */}
      <rect x={x + 4} y={y + faceDepth + 4} width={w} height={h} rx={cornerRadius} fill="black" opacity="0.05" />

      {/* 2. Side Face (Ensuring uniform color with subtle darkening) */}
      <rect 
        x={x} 
        y={y + (faceDepth / 2)} 
        width={w} 
        height={h + (faceDepth / 2)} 
        rx={cornerRadius} 
        fill={color} 
      />
      <rect 
        x={x} 
        y={y + (faceDepth / 2)} 
        width={w} 
        height={h + (faceDepth / 2)} 
        rx={cornerRadius} 
        fill="black" 
        opacity="0.15" 
      />
      <rect 
        x={x} 
        y={y + (faceDepth / 2)} 
        width={w} 
        height={h + (faceDepth / 2)} 
        rx={cornerRadius} 
        fill="none" 
        stroke={outlineColor} 
        strokeWidth={outlineWidth} 
      />

      {/* 3. Top Face (Main color) */}
      <rect 
        x={x} 
        y={y} 
        width={w} 
        height={h} 
        rx={cornerRadius} 
        fill={color} 
      />
      <rect 
        x={x} 
        y={y} 
        width={w} 
        height={h} 
        rx={cornerRadius} 
        fill="none" 
        stroke={outlineColor} 
        strokeWidth={outlineWidth} 
      />

      {/* 4. Studs (Matching Body Color) */}
      {Array.from({ length: studs }).map((_, i) => {
        const row = Math.floor(i / studsPerRow);
        const col = i % studsPerRow;
        const cx = x + (col + 1) * studSpacingX;
        const cy = y + (row + 1) * studSpacingY;

        return (
          <g key={i}>
            {/* Stud Side */}
            <circle cx={cx} cy={cy} r={studRadius} fill={color} />
            <circle cx={cx} cy={cy} r={studRadius} fill="black" opacity="0.1" />
            <circle cx={cx} cy={cy} r={studRadius} fill="none" stroke={outlineColor} strokeWidth={outlineWidth} />
            
            {/* Stud Top - Same Color */}
            <circle cx={cx} cy={cy - studTopHeight} r={studRadius} fill={color} />
            
            {/* Stud Highlight (Stylized) */}
            <circle cx={cx - (studRadius * 0.3)} cy={cy - studTopHeight - (studRadius * 0.3)} r={studRadius * 0.25} fill="white" opacity="0.3" />
            
            {/* Stud Outline */}
            <circle cx={cx} cy={cy - studTopHeight} r={studRadius} fill="none" stroke={outlineColor} strokeWidth={outlineWidth} />
          </g>
        );
      })}
    </g>
  );
};

export default RealisticBrick;
