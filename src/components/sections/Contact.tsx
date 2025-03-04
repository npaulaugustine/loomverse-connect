
import React, { useState } from 'react';
import MagneticButton from '../ui/MagneticButton';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    
    // Simulate form submission
    setTimeout(() => {
      setFormState('success');
      setFormData({ name: '', email: '', message: '' });
      
      // Reset form state after showing success message
      setTimeout(() => {
        setFormState('idle');
      }, 5000);
    }, 1500);
  };

  return (
    <section id="contact" className="py-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl opacity-50 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl opacity-50 -z-10"></div>
      
      <div className="section-container">
        <div className="text-center mb-16 reveal">
          <span className="chip bg-accent/10 text-accent mb-4">Get Started</span>
          <h2 className="heading-lg mb-4">Ready to Transform Your Communication?</h2>
          <p className="paragraph mx-auto">
            Join thousands of professionals who have already elevated their messaging with Loomverse.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="reveal">
            <div className="bg-card rounded-2xl p-8 border border-border/50 shadow-lg">
              <h3 className="text-2xl font-semibold mb-6">Contact Us</h3>
              
              {formState === 'success' ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-accent/20 mx-auto flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <h4 className="text-xl font-medium mb-2">Message Sent!</h4>
                  <p className="text-muted-foreground">
                    Thank you for reaching out. We'll get back to you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent/50"
                        placeholder="Your name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent/50"
                        placeholder="your@email.com"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
                        placeholder="How can we help you?"
                      ></textarea>
                    </div>
                    
                    <MagneticButton
                      className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium shadow-sm hover:shadow transition-all mt-2"
                      onClick={() => {}}
                    >
                      {formState === 'submitting' ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </div>
                      ) : 'Send Message'}
                    </MagneticButton>
                  </div>
                </form>
              )}
            </div>
          </div>
          
          <div className="reveal">
            <h3 className="text-2xl font-semibold mb-6">Why Choose Loomverse?</h3>
            
            <div className="space-y-6">
              {[
                {
                  title: "Elevated Experience",
                  description: "A platform designed with intention, where every detail enhances your message."
                },
                {
                  title: "Effortless Creation",
                  description: "Record, edit, and share with minimal friction, so you can focus on your message."
                },
                {
                  title: "Seamless Sharing",
                  description: "Share across platforms with a simple link, reaching your audience wherever they are."
                }
              ].map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex-shrink-0 flex items-center justify-center mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium mb-1">{item.title}</h4>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-6 rounded-xl bg-secondary/50 border border-border/50">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
                  </svg>
                </div>
                <div>
                  <div className="font-medium">Pro Tip</div>
                  <div className="text-sm text-muted-foreground">Start with a quick demo to see the magic in action</div>
                </div>
              </div>
              <button 
                className="w-full py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
                onClick={() => {
                  // Show a demo or scroll to a demo section
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                See Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
