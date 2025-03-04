
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import MagneticButton from "@/components/ui/MagneticButton";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-background">
      <div className="text-center max-w-md mx-auto">
        <h1 className="text-9xl font-bold text-accent/30 mb-6">404</h1>
        <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <MagneticButton 
          className="px-6 py-3 rounded-full bg-primary text-primary-foreground shadow-lg"
          onClick={() => window.location.href = '/'}
        >
          Return to Home
        </MagneticButton>
      </div>
      
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl opacity-50"></div>
      </div>
    </div>
  );
};

export default NotFound;
