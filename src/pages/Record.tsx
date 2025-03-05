
import React, { useEffect } from 'react';
import SmoothScroll from '../components/ui/SmoothScroll';
import Navbar from '../components/layout/Navbar';
import RecordingStudio from '../components/recording/RecordingStudio';
import { Tag } from 'lucide-react';
import { analytics } from '@/services/firebase';
import { logEvent } from 'firebase/analytics';

const Record: React.FC = () => {
  // Log page view to Firebase Analytics
  useEffect(() => {
    logEvent(analytics, 'page_view', {
      page_title: 'Record',
      page_location: window.location.href,
      page_path: window.location.pathname
    });

    // Request permissions early to initialize camera
    const requestEarlyPermissions = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          // Just request access - we'll stop the stream immediately
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          // Stop all tracks to release camera
          stream.getTracks().forEach(track => track.stop());
          console.log('Camera and microphone permissions granted early');
        }
      } catch (error) {
        console.log('Early permission request failed:', error);
      }
    };

    requestEarlyPermissions();
  }, []);

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
