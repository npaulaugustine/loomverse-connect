
import React, { useEffect } from 'react';
import SmoothScroll from '../components/ui/SmoothScroll';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/sections/Hero';
import Features from '../components/sections/Features';
import About from '../components/sections/About';
import Contact from '../components/sections/Contact';

const Index: React.FC = () => {
  useEffect(() => {
    // Observe elements with 'reveal' class for scroll animations
    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    };

    const observer = new IntersectionObserver(callback, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    });

    const elements = document.querySelectorAll('.reveal');
    elements.forEach(el => observer.observe(el));

    return () => {
      elements.forEach(el => observer.unobserve(el));
    };
  }, []);

  return (
    <SmoothScroll className="relative">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <About />
        <Contact />
      </main>
      
      <footer className="py-10 border-t border-border">
        <div className="section-container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-accent"></div>
              </div>
              <span className="font-medium">Loomverse</span>
            </div>
            
            <div className="flex gap-6">
              {['Features', 'About', 'Contact'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
            
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Loomverse. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </SmoothScroll>
  );
};

export default Index;
