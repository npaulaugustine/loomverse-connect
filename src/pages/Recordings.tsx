
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SmoothScroll from '../components/ui/SmoothScroll';
import Navbar from '../components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { 
  Video, 
  Plus, 
  Clock, 
  Calendar, 
  Filter, 
  Search, 
  Eye,
  Share2,
  Lock,
  TrashIcon,
  MoreHorizontal,
  Link as LinkIcon
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Recording } from '@/components/recording/types';
import { useToast } from '@/hooks/use-toast';

const Recordings: React.FC = () => {
  const { toast } = useToast();
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecordings, setFilteredRecordings] = useState<Recording[]>([]);
  
  // Load recordings from localStorage (in a real app, this would be an API call)
  useEffect(() => {
    const savedRecordings = JSON.parse(localStorage.getItem('recordings') || '[]');
    const mappedRecordings = savedRecordings.map((rec: any) => ({
      ...rec,
      createdAt: new Date(rec.createdAt),
      duration: rec.duration || 0,
      views: rec.views || 0,
      isPublic: rec.isPublic || false,
    }));
    setRecordings(mappedRecordings);
    setFilteredRecordings(mappedRecordings);
  }, []);
  
  // Filter recordings based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredRecordings(recordings);
      return;
    }
    
    const filtered = recordings.filter(rec => 
      rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rec.description && rec.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    setFilteredRecordings(filtered);
  }, [searchQuery, recordings]);
  
  const deleteRecording = (id: string) => {
    const updatedRecordings = recordings.filter(rec => rec.id !== id);
    setRecordings(updatedRecordings);
    
    // Update localStorage
    localStorage.setItem('recordings', JSON.stringify(updatedRecordings));
    
    toast({
      title: "Recording Deleted",
      description: "The recording has been permanently deleted.",
    });
  };
  
  const shareRecording = (recording: Recording) => {
    // In a real app, this would make the recording public on the server
    const updatedRecordings = recordings.map(rec => {
      if (rec.id === recording.id) {
        return {
          ...rec,
          isPublic: true,
          shareUrl: `${window.location.origin}/share/${rec.id}`
        };
      }
      return rec;
    });
    
    setRecordings(updatedRecordings);
    localStorage.setItem('recordings', JSON.stringify(updatedRecordings));
    
    // Copy the share URL to clipboard
    const shareUrl = `${window.location.origin}/share/${recording.id}`;
    navigator.clipboard.writeText(shareUrl);
    
    toast({
      title: "Link Copied",
      description: "Shareable link copied to clipboard.",
    });
  };
  
  // Format seconds to MM:SS
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <SmoothScroll className="relative">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="section-container max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 reveal">My Recordings</h1>
              <p className="text-muted-foreground reveal">Manage and share your video recordings</p>
            </div>
            
            <Link to="/record">
              <Button className="gap-2 reveal">
                <Plus className="h-4 w-4" />
                New Recording
              </Button>
            </Link>
          </div>
          
          <div className="bg-card border rounded-xl overflow-hidden shadow-sm mb-10 reveal">
            <div className="p-4 border-b flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search recordings..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
                
                <Button variant="outline" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Date
                </Button>
              </div>
            </div>
            
            {/* Recordings list */}
            <div className="divide-y">
              {filteredRecordings.length === 0 ? (
                <div className="text-center py-16">
                  <Video className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-20" />
                  <h3 className="text-xl font-medium mb-2">No recordings found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? "No recordings match your search" : "You haven't created any recordings yet"}
                  </p>
                  <Link to="/record">
                    <Button>Create Your First Recording</Button>
                  </Link>
                </div>
              ) : (
                filteredRecordings.map((recording, index) => (
                  <div key={recording.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="md:w-1/4 aspect-video bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        <Link to={`/recording/${recording.id}`}>
                          <video 
                            src={recording.url} 
                            className="w-full h-full object-cover" 
                            muted
                          />
                        </Link>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <Link to={`/recording/${recording.id}`}>
                            <h3 className="text-lg font-medium hover:text-primary transition-colors">
                              {recording.title}
                            </h3>
                          </Link>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => shareRecording(recording)}>
                                <Share2 className="h-4 w-4 mr-2" />
                                Share
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => deleteRecording(recording.id)}>
                                <TrashIcon className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                          {recording.description || "No description"}
                        </p>
                        
                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{formatDuration(recording.duration)}</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{recording.createdAt.toLocaleDateString()}</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Eye className="h-3.5 w-3.5" />
                            <span>{recording.views} views</span>
                          </div>
                          
                          {recording.isPublic ? (
                            <div className="flex items-center gap-1 text-primary">
                              <LinkIcon className="h-3.5 w-3.5" />
                              <span>Public</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <Lock className="h-3.5 w-3.5" />
                              <span>Private</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </SmoothScroll>
  );
};

export default Recordings;
