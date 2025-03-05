
import React, { useEffect, useState } from 'react';

interface RecordingPreviewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  duration: number;
  isPaused: boolean;
}

const RecordingPreview: React.FC<RecordingPreviewProps> = ({ videoRef, duration, isPaused }) => {
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);
  
  // Format duration as MM:SS
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Ensure video element is properly sized and displayed
  useEffect(() => {
    if (videoRef.current) {
      // Force a repaint to ensure proper rendering
      videoRef.current.style.display = 'none';
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.style.display = 'block';
        }
      }, 0);
    }
  }, [videoRef]);

  // Handle visibility issues
  useEffect(() => {
    const checkVisibility = () => {
      if (videoRef.current) {
        if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
          setIsPreviewVisible(false);
        } else {
          setIsPreviewVisible(true);
        }
      }
    };
    
    const interval = setInterval(checkVisibility, 1000);
    return () => clearInterval(interval);
  }, [videoRef]);

  return (
    <div className="relative w-full">
      <video 
        ref={videoRef} 
        className="w-full aspect-video rounded-lg object-cover" 
        autoPlay 
        muted 
        playsInline
      />
      
      {!isPreviewVisible && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground bg-background/80 px-3 py-1 rounded-md">
            Recording in progress...
          </p>
        </div>
      )}
      
      <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'}`}></div>
        {formatDuration(duration)}
      </div>
      
      {isPaused && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-white text-xl font-medium">Recording Paused</div>
        </div>
      )}
    </div>
  );
};

export default RecordingPreview;
