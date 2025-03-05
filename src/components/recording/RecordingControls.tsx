
import React from 'react';
import { Button } from '@/components/ui/button';
import { Pause, Play, Square, Camera, MoreVertical, MoreHorizontal } from 'lucide-react';
import { RecordingState } from './types';

interface RecordingControlsProps {
  recordingState: RecordingState;
  duration: number;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onToggleCameraPosition?: () => void;
}

const RecordingControls: React.FC<RecordingControlsProps> = ({
  recordingState,
  duration,
  onPause,
  onResume,
  onStop,
  onToggleCameraPosition
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
        
        {onToggleCameraPosition && (
          <button 
            className="h-9 w-9 rounded-full bg-transparent hover:bg-white/10 flex items-center justify-center text-white"
            onClick={onToggleCameraPosition}
          >
            <Camera className="h-5 w-5" />
          </button>
        )}
        
        <button className="h-9 w-9 rounded-full bg-transparent hover:bg-white/10 flex items-center justify-center text-white">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default RecordingControls;
