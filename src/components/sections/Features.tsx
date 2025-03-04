
import React from 'react';
import { cn } from '@/lib/utils';

interface Feature {
  icon: JSX.Element;
  title: string;
  description: string;
}

const Features: React.FC = () => {
  const features: Feature[] = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
          <path d="m22 8-6 4 6 4V8Z"></path>
          <rect width="14" height="12" x="2" y="6" rx="2" ry="2"></rect>
        </svg>
      ),
      title: "Effortless Recording",
      description: "Create stunning videos with just a few clicks. Our intuitive interface makes recording a breeze."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M8 12h8"></path>
          <path d="M12 8v8"></path>
        </svg>
      ),
      title: "Instant Sharing",
      description: "Share your videos instantly with a simple link. No downloads or complex permissions required."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
          <path d="M2 12h5"></path>
          <path d="M17 12h5"></path>
          <path d="M8.5 8.5a2.5 2.5 0 0 1 0 5 2.5 2.5 0 0 1 0-5z"></path>
          <path d="M14.5 8.5a2.5 2.5 0 0 1 0 5 2.5 2.5 0 0 1 0-5z"></path>
        </svg>
      ),
      title: "Seamless Integration",
      description: "Integrate with your favorite tools and platforms for a streamlined workflow."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <path d="M12 17h.01"></path>
        </svg>
      ),
      title: "Intelligent Insights",
      description: "Gain valuable insights into how your videos are performing with comprehensive analytics."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
          <rect width="18" height="18" x="3" y="3" rx="2"></rect>
          <path d="M9 14v1"></path>
          <path d="M9 19v2"></path>
          <path d="M9 3v2"></path>
          <path d="M9 9v1"></path>
          <path d="M15 14v1"></path>
          <path d="M15 19v2"></path>
          <path d="M15 3v2"></path>
          <path d="M15 9v1"></path>
        </svg>
      ),
      title: "Custom Controls",
      description: "Tailor the recording experience to your needs with customizable controls and settings."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
          <rect width="20" height="14" x="2" y="3" rx="2"></rect>
          <line x1="8" x2="16" y1="21" y2="21"></line>
          <line x1="12" x2="12" y1="17" y2="21"></line>
        </svg>
      ),
      title: "Multi-Device Support",
      description: "Access and create videos from any device, ensuring flexibility in your communication."
    }
  ];

  return (
    <section id="features" className="py-20 relative overflow-hidden">
      <div className="section-container">
        <div className="text-center mb-16 reveal">
          <span className="chip bg-accent/10 text-accent mb-4">Features</span>
          <h2 className="heading-lg mb-4">Elevate Your Communication</h2>
          <p className="paragraph mx-auto">
            Discover how Loomverse transforms the way you create and share video messages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={cn(
                "reveal flex flex-col bg-card p-6 rounded-xl border border-border/50 hover:border-accent/20 transition-all hover:shadow-lg",
                "hover:translate-y-[-4px]"
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center reveal">
          <div className="relative py-8 px-6 md:py-12 md:px-10 bg-gradient-to-r from-primary/5 via-accent/10 to-primary/5 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            <h3 className="heading-md mb-4">Ready to transform your communication?</h3>
            <p className="paragraph mx-auto mb-8">
              Join thousands of professionals who have already elevated their messaging with Loomverse.
            </p>
            <button 
              className="px-8 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Get Started Today
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
