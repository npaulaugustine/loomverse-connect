
import React, { useState, useEffect } from 'react';
import SmoothScroll from '../components/ui/SmoothScroll';
import Navbar from '../components/layout/Navbar';
import Dashboard from '../components/dashboard/Dashboard';
import { Recording } from '@/components/recording/types';

const DashboardPage: React.FC = () => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  
  // Load recordings from localStorage
  useEffect(() => {
    const savedRecordings = JSON.parse(localStorage.getItem('recordings') || '[]');
    const mappedRecordings = savedRecordings.map((rec: any) => ({
      ...rec,
      createdAt: new Date(rec.createdAt),
      duration: rec.duration || 0,
      views: rec.views || 0,
      isPublic: rec.isPublic || false,
      tags: rec.tags || [],
      topics: rec.topics || [],
    }));
    setRecordings(mappedRecordings);
  }, []);
  
  return (
    <SmoothScroll className="relative">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="section-container max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 reveal">Dashboard</h1>
          <p className="text-muted-foreground mb-6 reveal">Analytics and insights for your video recordings</p>
          
          <Dashboard recordings={recordings} />
        </div>
      </main>
    </SmoothScroll>
  );
};

export default DashboardPage;
