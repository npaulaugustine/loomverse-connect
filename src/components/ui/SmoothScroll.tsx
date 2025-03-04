
import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SmoothScrollProps {
  children: React.ReactNode;
  className?: string;
}

const SmoothScroll: React.FC<SmoothScrollProps> = ({ children, className }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Setup intersection observer for reveal animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all elements with 'reveal' class
    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => observer.observe(el));

    // Cleanup
    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
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
