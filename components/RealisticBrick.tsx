
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
 * - Proportional logic ensures studs look identical across different brick sizes (1x4, 2x2, 2x4).
 */
const RealisticBrick: React.FC<RealisticBrickProps> = ({ 
  x, y, w, h, color, studs = 0, rotate = 0, className = "", opacity = "1" 
}) => {
  const cornerRadius = 8;
  const faceDepth = 12; 
  const studTopHeight = 6; 
  const outlineColor = "rgba(0,0,0,0.15)";
  const outlineWidth = 1.2;
  
  // Logic to determine stud grid arrangement
  // Standard LEGO bricks are categorized by stud rows (usually 1 or 2)
  const isSquare = Math.abs(w - h) < 15;
  const isNarrow = Math.min(w, h) < 30; // Typically 1x bricks or plates
  
  let studRows = 1;
  if (studs > 4) {
    studRows = 2; // e.g. 2x3, 2x4
  } else if (isSquare && studs === 4) {
    studRows = 2; // 2x2 configuration
  } else if (studs === 4 && !isNarrow) {
    // Catch-all for compact bricks that might not be perfectly square
    studRows = 2; 
  }

  const studsPerRow = Math.ceil(studs / studRows);

  // Calculate the physical area each stud occupies
  const cellW = w / studsPerRow;
  const cellH = h / studRows;
  
  // To keep studs consistent across different shapes (e.g. 1x4 plate vs 2x2 brick),
  // we use a proportional radius based on the smallest grid dimension.
  // We use 0.42 of the cell dimension for a "chunky", high-quality look.
  const studRadius = Math.min(cellW, cellH) * 0.42;

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
        opacity="0.12" 
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

      {/* 3. Top Face (Main body color) */}
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

      {/* 4. Studs (Matching Body Color exactly) */}
      {Array.from({ length: studs }).map((_, i) => {
        const row = Math.floor(i / studsPerRow);
        const col = i % studsPerRow;
        
        // Center the stud in its allocated grid cell
        const cx = x + (col + 0.5) * cellW;
        const cy = y + (row + 0.5) * cellH;

        return (
          <g key={i}>
            {/* Stud Side */}
            <circle cx={cx} cy={cy} r={studRadius} fill={color} />
            <circle cx={cx} cy={cy} r={studRadius} fill="black" opacity="0.08" />
            <circle cx={cx} cy={cy} r={studRadius} fill="none" stroke={outlineColor} strokeWidth={outlineWidth} />
            
            {/* Stud Top - Using same base color */}
            <circle cx={cx} cy={cy - studTopHeight} r={studRadius} fill={color} />
            
            {/* Stud Highlight (Stylized cartoon shine) */}
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
