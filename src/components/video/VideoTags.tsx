
import React from 'react';
import { Tag } from 'lucide-react';

interface VideoTagsProps {
  tags: string[];
  onClick?: (tag: string) => void;
  className?: string;
  interactive?: boolean;
}

const VideoTags: React.FC<VideoTagsProps> = ({ 
  tags, 
  onClick, 
  className = "",
  interactive = false
}) => {
  if (!tags || tags.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map(tag => (
        <div 
          key={tag} 
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs 
            ${interactive 
              ? 'cursor-pointer transition-colors bg-primary/10 text-primary hover:bg-primary/20' 
              : 'bg-muted text-muted-foreground'}`}
          onClick={() => interactive && onClick && onClick(tag)}
        >
          <Tag className="h-3 w-3" />
          {tag}
        </div>
      ))}
    </div>
  );
};

export default VideoTags;
