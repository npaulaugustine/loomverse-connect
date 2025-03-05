
import React, { useEffect, useState } from 'react';
import { X, Camera } from 'lucide-react';

interface RecordingPreviewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  duration: number;
  isPaused: boolean;
  userVideoRef?: React.RefObject<HTMLVideoElement>;
  isScreenSharing?: boolean;
  cameraPosition?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  onToggleCameraPosition?: () => void;
}

const RecordingPreview: React.FC<RecordingPreviewProps> = ({ 
  videoRef, 
  duration, 
  isPaused,
  userVideoRef,
  isScreenSharing,
  cameraPosition = 'bottom-right',
  onToggleCameraPosition
}) => {
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);
  
  // Format duration as MM:SS
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Ensure proper initialization and display of video stream
  useEffect(() => {
    const checkVideoDisplay = () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.style.display = 'block';
        setIsPreviewVisible(true);
      } else {
        setIsPreviewVisible(false);
      }
    };

    // Check immediately and again after a short delay
    checkVideoDisplay();
    const timeout = setTimeout(checkVideoDisplay, 500);
    
    return () => clearTimeout(timeout);
  }, [videoRef, videoRef.current?.srcObject]);

  // Monitor video visibility
  useEffect(() => {
    if (!videoRef.current) return;
    
    const videoElement = videoRef.current;
    
    const checkVisibility = () => {
      if (videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
        if (videoElement.srcObject) {
          // Try to refresh the display
          const stream = videoElement.srcObject as MediaStream;
          if (stream.active && stream.getVideoTracks().length > 0 && stream.getVideoTracks()[0].readyState === 'live') {
            setIsPreviewVisible(true);
          } else {
            setIsPreviewVisible(false);
          }
        } else {
          setIsPreviewVisible(false);
        }
      } else {
        setIsPreviewVisible(true);
      }
    };
    
    const interval = setInterval(checkVisibility, 1000);
    
    // Add event listeners to detect when video starts playing
    videoElement.addEventListener('play', () => setIsPreviewVisible(true));
    videoElement.addEventListener('loadedmetadata', () => setIsPreviewVisible(true));
    
    return () => {
      clearInterval(interval);
      videoElement.removeEventListener('play', () => setIsPreviewVisible(true));
      videoElement.removeEventListener('loadedmetadata', () => setIsPreviewVisible(true));
    };
  }, [videoRef]);

  // Helper to get position classes for the webcam PiP
  const getPositionClasses = () => {
    switch (cameraPosition) {
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      default:
        return 'bottom-4 right-4';
    }
  };

  return (
    <div className="relative w-full rounded-lg overflow-hidden bg-slate-800">
      <video 
        ref={videoRef} 
        className="w-full aspect-video object-cover" 
        autoPlay 
        muted 
        playsInline
        style={{ transform: 'none' }} // Prevent mirroring
      />
      
      {/* Picture-in-picture webcam when screen sharing */}
      {isScreenSharing && userVideoRef && (
        <div className={`absolute ${getPositionClasses()} w-1/4 aspect-video rounded-lg overflow-hidden border-2 border-white/20 shadow-lg`}>
          <video 
            ref={userVideoRef} 
            className="w-full h-full object-cover" 
            autoPlay 
            muted 
            playsInline
            style={{ transform: 'none' }} // Prevent mirroring
          />
          {onToggleCameraPosition && (
            <button 
              onClick={onToggleCameraPosition}
              className="absolute top-1 right-1 bg-black/50 rounded-full p-1 text-white hover:bg-black/70"
            >
              <Camera className="h-3 w-3" />
            </button>
          )}
        </div>
      )}
      
      {!isPreviewVisible && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800/30">
          <p className="text-sm text-white bg-slate-800/80 px-3 py-1 rounded-md">
            Recording in progress...
          </p>
        </div>
      )}
      
      <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'}`}></div>
        {formatDuration(duration)}
      </div>
      
      <div className="absolute top-2 right-2">
        <button className="h-8 w-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70">
          <X className="h-4 w-4" />
        </button>
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
