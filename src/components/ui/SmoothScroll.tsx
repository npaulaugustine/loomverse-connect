
import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SmoothScrollProps {
  children: React.ReactNode;
  className?: string;
}

const SmoothScroll: React.FC<SmoothScrollProps> = ({ children, className }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const handleScrollAnimation = () => {
      const elements = document.querySelectorAll('.reveal');
      
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Element is in viewport
        if (rect.top < windowHeight * 0.85) {
          el.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', handleScrollAnimation);
    handleScrollAnimation(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScrollAnimation);
    };
  }, []);

  return (
    <div 
      ref={scrollRef} 
      className={cn('scroll-container', className)}
    >
      {children}
    </div>
  );
};

export default SmoothScroll;
