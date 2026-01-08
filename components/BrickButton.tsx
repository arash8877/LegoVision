
import React from 'react';

interface BrickButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'red' | 'yellow' | 'blue';
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

const BrickButton: React.FC<BrickButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'red', 
  className = '',
  type = 'button',
  disabled = false
}) => {
  const variants = {
    red: 'bg-legoRed text-white hover:bg-red-700 shadow-lego active:shadow-lego-pressed active:translate-y-1',
    yellow: 'bg-legoYellow text-black hover:bg-yellow-400 shadow-lego-yellow active:shadow-lego-pressed active:translate-y-1',
    blue: 'bg-legoBlue text-white hover:bg-blue-700 shadow-lego-blue active:shadow-lego-pressed active:translate-y-1',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        relative px-8 py-3 rounded-lg font-heading text-xl transition-all duration-75 
        brick-bevel disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} 
        ${className}
      `}
    >
      <div className="flex items-center justify-center gap-2">
        {children}
      </div>
    </button>
  );
};

export default BrickButton;
