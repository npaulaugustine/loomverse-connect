
import React from 'react';

interface RecordingPreviewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  duration: number;
  isPaused: boolean;
}

const RecordingPreview: React.FC<RecordingPreviewProps> = ({ videoRef, duration, isPaused }) => {
  // Format duration as MM:SS
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative w-full">
      <video 
        ref={videoRef} 
        className="w-full aspect-video rounded-lg" 
        autoPlay 
        muted 
        playsInline
      />
      
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
