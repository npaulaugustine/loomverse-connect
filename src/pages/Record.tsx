
import React, { useEffect } from 'react';
import SmoothScroll from '../components/ui/SmoothScroll';
import RecordingStudio from '../components/recording/RecordingStudio';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Start your recording journey</h1>
              <p className="text-slate-500">4 easy steps to becoming a recording pro</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white shadow-sm border border-slate-200">
                <div className="bg-blue-100 text-blue-500 h-8 w-8 rounded-full flex items-center justify-center">
                  1
                </div>
                <span className="font-medium">Download</span>
                <div className="ml-auto text-slate-400">✓</div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 shadow-sm border border-blue-200">
                <div className="bg-blue-500 text-white h-8 w-8 rounded-full flex items-center justify-center">
                  2
                </div>
                <span className="font-medium">Record</span>
                <div className="ml-auto text-slate-400">✓</div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white shadow-sm border border-slate-200">
                <div className="bg-slate-100 text-slate-500 h-8 w-8 rounded-full flex items-center justify-center">
                  3
                </div>
                <span className="font-medium">Share</span>
                <div className="ml-auto text-slate-400">⟩</div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white shadow-sm border border-slate-200">
                <div className="bg-slate-100 text-slate-500 h-8 w-8 rounded-full flex items-center justify-center">
                  4
                </div>
                <span className="font-medium">Invite</span>
                <div className="ml-auto text-slate-400">⟩</div>
              </div>
            </div>
            
            <div className="mt-12">
              <h2 className="text-xl font-bold mb-4">Tips and tricks for recording a video</h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-blue-100 h-8 w-8 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="font-medium">How to use screen recording</h3>
                  </div>
                  <p className="text-sm text-slate-500">1 min</p>
                </div>
                
                <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-blue-100 h-8 w-8 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="font-medium">Best practices for recording</h3>
                  </div>
                  <p className="text-sm text-slate-500">2 min</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-md p-6 mb-4">
              <h2 className="text-2xl font-bold mb-2">Share your recording</h2>
              <p className="text-slate-500 mb-6">Easily copy the link or send your recording in an email</p>
              
              <RecordingStudio />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Record;
