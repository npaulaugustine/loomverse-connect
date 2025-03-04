
import React, { useRef, useEffect } from 'react';

const About: React.FC = () => {
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!imageRef.current) return;
      
      const { clientX, clientY } = e;
      const { left, top, width, height } = imageRef.current.getBoundingClientRect();
      
      const x = (clientX - (left + width / 2)) / 25;
      const y = (clientY - (top + height / 2)) / 25;
      
      imageRef.current.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg)`;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section id="about" className="py-20 relative overflow-hidden">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="reveal order-2 lg:order-1">
            <span className="chip bg-accent/10 text-accent mb-4">About Us</span>
            <h2 className="heading-lg mb-6">The Future of Video Messaging</h2>
            <p className="paragraph mb-6">
              Loomverse was born from a simple belief: video communication should be effortless, elegant, and effective. We've designed a platform that strips away complexity while enhancing clarity.
            </p>
            <p className="paragraph mb-8">
              Our team of designers and engineers have crafted every detail with intention, creating a seamless experience that respects your time and amplifies your message.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div>
                  <div className="font-medium">Easy to Use</div>
                  <div className="text-sm text-muted-foreground">Intuitive interface</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                </div>
                <div>
                  <div className="font-medium">Secure</div>
                  <div className="text-sm text-muted-foreground">End-to-end encryption</div>
                </div>
              </div>
            </div>
          </div>
          
          <div 
            ref={imageRef}
            className="reveal order-1 lg:order-2 transition-transform duration-200"
          >
            <div className="relative">
              <div className="aspect-square lg:aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-tr from-accent/20 to-primary/5 p-1">
                <div className="w-full h-full rounded-xl overflow-hidden bg-card flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                  
                  <div className="relative w-3/4 aspect-video bg-accent/5 rounded-lg flex items-center justify-center shadow-lg border border-border/50">
                    <div className="absolute top-0 left-0 right-0 h-8 bg-secondary/80 flex items-center px-3">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-destructive/70"></div>
                        <div className="w-2 h-2 rounded-full bg-muted-foreground/30"></div>
                        <div className="w-2 h-2 rounded-full bg-muted-foreground/30"></div>
                      </div>
                    </div>
                    
                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-accent/5 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/5 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
