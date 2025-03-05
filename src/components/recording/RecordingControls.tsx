
import React from 'react';
import { Button } from '@/components/ui/button';
import { Pause, Play, Square } from 'lucide-react';
import { RecordingState } from './types';

interface RecordingControlsProps {
  recordingState: RecordingState;
  duration: number;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

const RecordingControls: React.FC<RecordingControlsProps> = ({
  recordingState,
  duration,
  onPause,
  onResume,
  onStop
}) => {
  // Format duration as MM:SS
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center justify-center p-3 mt-4 bg-black/80 rounded-full w-fit mx-auto">
      <div className="flex items-center gap-4">
        {recordingState === 'recording' ? (
          <button 
            className="h-9 w-9 rounded-full bg-transparent hover:bg-white/10 flex items-center justify-center text-white"
            onClick={onPause}
          >
            <Pause className="h-5 w-5" />
          </button>
        ) : (
          <button 
            className="h-9 w-9 rounded-full bg-transparent hover:bg-white/10 flex items-center justify-center text-white"
            onClick={onResume}
          >
            <Play className="h-5 w-5" />
          </button>
        )}
        
        <div className="text-white font-mono">{formatDuration(duration)}</div>
        
        <button 
          className="h-9 w-9 rounded-full bg-transparent hover:bg-white/10 flex items-center justify-center text-white"
          onClick={onStop}
        >
          <Square className="h-5 w-5" fill="white" />
        </button>
        
        <button className="h-9 w-9 rounded-full bg-transparent hover:bg-white/10 flex items-center justify-center text-white">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="2" fill="white" />
            <circle cx="6" cy="12" r="2" fill="white" />
            <circle cx="18" cy="12" r="2" fill="white" />
          </svg>
        </button>
        
        <button className="h-9 w-9 rounded-full bg-transparent hover:bg-white/10 flex items-center justify-center text-white">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 7L5 7" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <path d="M19 12L5 12" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <path d="M19 17L5 17" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        
        <button className="h-9 w-9 rounded-full bg-transparent hover:bg-white/10 flex items-center justify-center text-white">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <path d="M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default RecordingControls;
