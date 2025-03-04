
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
    <div className="flex items-center justify-between bg-background border-t p-4">
      <div className="flex items-center gap-4">
        {recordingState === 'recording' ? (
          <Button variant="outline" size="icon" onClick={onPause}>
            <Pause className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="outline" size="icon" onClick={onResume}>
            <Play className="h-4 w-4" />
          </Button>
        )}
        <Button variant="destructive" size="icon" onClick={onStop}>
          <Square className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-destructive animate-pulse"></div>
        <span className="font-mono">{formatDuration(duration)}</span>
      </div>
    </div>
  );
};

export default RecordingControls;
