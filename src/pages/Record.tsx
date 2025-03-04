
import React from 'react';
import SmoothScroll from '../components/ui/SmoothScroll';
import Navbar from '../components/layout/Navbar';
import RecordingStudio from '../components/recording/RecordingStudio';

const Record: React.FC = () => {
  return (
    <SmoothScroll className="relative">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="section-container max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 reveal">Create New Recording</h1>
          <p className="text-muted-foreground mb-10 reveal">Share your message through screen recording, webcam, or both.</p>
          <RecordingStudio />
        </div>
      </main>
    </SmoothScroll>
  );
};

export default Record;
