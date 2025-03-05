
import React from 'react';
import SmoothScroll from '../components/ui/SmoothScroll';
import Navbar from '../components/layout/Navbar';
import RecordingStudio from '../components/recording/RecordingStudio';
import { Tag } from 'lucide-react';

const Record: React.FC = () => {
  return (
    <SmoothScroll className="relative">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="section-container max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 reveal">Create New Recording</h1>
          <p className="text-muted-foreground mb-2 reveal">Share your message through screen recording, webcam, or both.</p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-1 reveal">
              <Tag className="h-3 w-3" />
              Filler word removal
            </div>
            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-1 reveal">
              <Tag className="h-3 w-3" />
              Auto titles and summaries
            </div>
            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-1 reveal">
              <Tag className="h-3 w-3" />
              AI workflows
            </div>
            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-1 reveal">
              <Tag className="h-3 w-3" />
              Edit by transcript
            </div>
            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-1 reveal">
              <Tag className="h-3 w-3" />
              Variables
            </div>
            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-1 reveal">
              <Tag className="h-3 w-3" />
              Advanced editing
            </div>
          </div>
          
          <RecordingStudio />
        </div>
      </main>
    </SmoothScroll>
  );
};

export default Record;
