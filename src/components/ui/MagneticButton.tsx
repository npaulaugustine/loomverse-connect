
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  strength?: number;
}

const MagneticButton = ({ 
  children, 
  className, 
  onClick,
  strength = 40 
}: MagneticButtonProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    
    const x = (clientX - (left + width / 2)) / strength;
    const y = (clientY - (top + height / 2)) / strength;
    
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const animateOut = () => {
    if (!isHovered) return;
    
    requestAnimationFrame(() => {
      setPosition({ x: 0, y: 0 });
    });
  };

  useEffect(() => {
    if (!isHovered) animateOut();
  }, [isHovered]);

  return (
    <button
      ref={ref}
      className={cn('magnetic-btn relative transition-all duration-200 overflow-hidden', className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={onClick}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      <span 
        className="relative z-10 flex items-center justify-center"
        style={{
          transform: `translate(${position.x * 0.3}px, ${position.y * 0.3}px)`,
        }}
      >
        {children}
      </span>
    </button>
  );
};

export default MagneticButton;
