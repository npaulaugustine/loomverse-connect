
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import MagneticButton from '../ui/MagneticButton';
import { Link, useLocation } from 'react-router-dom';
import { Video } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    // Only scroll to sections on the homepage
    if (location.pathname !== '/') {
      return;
    }
    
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
        <Link 
          to="/"
          className="text-xl font-semibold tracking-tight flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-accent animate-pulse-subtle"></div>
          </div>
          <span>Loomverse</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {location.pathname === '/' ? (
            // Show home navigation on homepage
            ['features', 'about', 'contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors capitalize"
              >
                {item}
              </button>
            ))
          ) : (
            // Show simple navigation on other pages
            <Link
              to="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
          )}
          
          <Link to="/record">
            <MagneticButton 
              className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow-sm hover:shadow transition-all flex items-center gap-2"
            >
              <Video className="h-4 w-4" />
              Record
            </MagneticButton>
          </Link>
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
          <Link
            to="/"
            className="text-lg font-medium hover:text-accent transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          
          {location.pathname === '/' && 
            ['features', 'about', 'contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className="text-lg font-medium hover:text-accent transition-colors capitalize"
              >
                {item}
              </button>
            ))
          }
          
          <Link
            to="/record"
            className="text-lg font-medium hover:text-accent transition-colors flex items-center gap-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Video className="h-4 w-4" />
            Record
          </Link>
        </nav>
        
        <div className="mt-auto">
          <Link to="/record" onClick={() => setMobileMenuOpen(false)}>
            <button 
              className="w-full py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow-sm flex items-center justify-center gap-2"
            >
              <Video className="h-4 w-4" />
              Start Recording
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
