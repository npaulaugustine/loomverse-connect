
import React, { useEffect, useRef } from 'react';
import MagneticButton from '../ui/MagneticButton';

const Hero: React.FC = () => {
  const videoBgRef = useRef<HTMLDivElement>(null);
  
  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!videoBgRef.current) return;
      
      const scrollPos = window.scrollY;
      const translateY = scrollPos * 0.15; // Control the parallax intensity
      
      videoBgRef.current.style.transform = `translateY(${translateY}px)`;
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToFeatures = () => {
    const element = document.getElementById('features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background elements */}
      <div 
        ref={videoBgRef} 
        className="absolute inset-0 -z-10 opacity-60"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] max-w-none h-[150vh] bg-gradient-to-b from-accent/10 via-background to-background rounded-full blur-3xl"></div>
      </div>
      
      <div className="section-container relative z-10 flex flex-col items-center justify-center text-center">
        <div className="reveal">
          <span className="chip bg-accent/10 text-accent mb-6">Introducing Loomverse</span>
          <h1 className="heading-xl mb-6">
            Share your message <br className="hidden sm:block" />
            with <span className="text-accent inline-block relative">
              video
              <svg className="absolute -bottom-1 left-0 w-full h-2" viewBox="0 0 100 15" preserveAspectRatio="none">
                <path d="M0,5 Q50,15 100,5" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </span>
          </h1>
          <p className="paragraph mx-auto mb-8">
            Create, share, and collaborate with stunning videos that speak louder than words. Elevate your communication with a platform designed for clarity and impact.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <MagneticButton 
              className="px-8 py-4 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl"
              onClick={scrollToFeatures}
            >
              Discover Loomverse
            </MagneticButton>
            <MagneticButton 
              className="px-8 py-4 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Get Started
            </MagneticButton>
          </div>
        </div>
        
        {/* Hero Image/Mockup */}
        <div className="reveal mt-16 relative w-full max-w-4xl mx-auto">
          <div className="bg-gradient-to-b from-background to-transparent absolute -top-20 left-0 right-0 h-20 z-10"></div>
          
          <div className="relative bg-card rounded-2xl shadow-2xl overflow-hidden border border-border/50">
            <div className="absolute top-0 left-0 right-0 h-12 bg-secondary flex items-center px-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive/70"></div>
                <div className="w-3 h-3 rounded-full bg-muted-foreground/30"></div>
                <div className="w-3 h-3 rounded-full bg-muted-foreground/30"></div>
              </div>
            </div>
            
            <div className="pt-12 p-4 md:p-8">
              <div className="aspect-video rounded-lg bg-accent/5 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-1/4 -right-16 w-32 h-32 rounded-full bg-accent/10 blur-3xl"></div>
          <div className="absolute bottom-1/4 -left-16 w-32 h-32 rounded-full bg-accent/10 blur-3xl"></div>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
          <path d="M12 5v14"></path>
          <path d="m19 12-7 7-7-7"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
