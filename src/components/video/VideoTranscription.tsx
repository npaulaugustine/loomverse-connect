
import React from 'react';
import { FileText } from 'lucide-react';

interface VideoTranscriptionProps {
  transcription: string | null | undefined;
  searchTerm?: string;
  maxHeight?: string;
  className?: string;
}

const VideoTranscription: React.FC<VideoTranscriptionProps> = ({ 
  transcription, 
  searchTerm = "", 
  maxHeight = "max-h-60",
  className = ""
}) => {
  if (!transcription) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <FileText className="h-12 w-12 mx-auto mb-2 opacity-30" />
        <p>No transcription available for this recording.</p>
      </div>
    );
  }

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) {
      return <p className="whitespace-pre-line">{text}</p>;
    }
    
    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return (
      <p className="whitespace-pre-line">
        {parts.map((part, i) => 
          regex.test(part) ? (
            <mark key={i} className="bg-primary/20 text-primary px-1 rounded">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </p>
    );
  };

  return (
    <div className={`p-3 bg-muted rounded-md text-sm text-muted-foreground ${maxHeight} overflow-y-auto ${className}`}>
      {highlightText(transcription, searchTerm)}
    </div>
  );
};

export default VideoTranscription;
