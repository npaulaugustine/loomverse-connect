
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import MagneticButton from '../ui/MagneticButton';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 md:px-12 lg:px-24',
        isScrolled ? 'backdrop-blur-md bg-background/70 py-4 shadow-sm' : 'py-6'
      )}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <a 
          href="#hero" 
          className="text-xl font-semibold tracking-tight flex items-center gap-2 transition-opacity hover:opacity-80"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('hero');
          }}
        >
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-accent animate-pulse-subtle"></div>
          </div>
          <span>Loomverse</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {['features', 'about', 'contact'].map((item) => (
            <button
              key={item}
              onClick={() => scrollToSection(item)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors capitalize"
            >
              {item}
            </button>
          ))}
          <MagneticButton 
            className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow-sm hover:shadow transition-all"
            onClick={() => scrollToSection('contact')}
          >
            Get Started
          </MagneticButton>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden w-10 h-10 flex items-center justify-center"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <div className="relative w-6 h-5">
            <span className={cn(
              "absolute left-0 w-full h-0.5 bg-foreground transition-all duration-300",
              mobileMenuOpen ? "top-2 rotate-45" : "top-0"
            )}></span>
            <span className={cn(
              "absolute left-0 top-2 w-full h-0.5 bg-foreground transition-opacity duration-300",
              mobileMenuOpen ? "opacity-0" : "opacity-100"
            )}></span>
            <span className={cn(
              "absolute left-0 w-full h-0.5 bg-foreground transition-all duration-300",
              mobileMenuOpen ? "top-2 -rotate-45" : "top-4"
            )}></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "md:hidden fixed inset-0 bg-background z-40 pt-20 pb-6 px-6 transition-all duration-300 flex flex-col",
        mobileMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <nav className="flex flex-col gap-6 items-start">
          {['features', 'about', 'contact'].map((item) => (
            <button
              key={item}
              onClick={() => scrollToSection(item)}
              className="text-lg font-medium hover:text-accent transition-colors capitalize"
            >
              {item}
            </button>
          ))}
        </nav>
        <div className="mt-auto">
          <button 
            className="w-full py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow-sm"
            onClick={() => {
              scrollToSection('contact');
              setMobileMenuOpen(false);
            }}
          >
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
