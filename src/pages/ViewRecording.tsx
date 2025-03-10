
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SmoothScroll from '../components/ui/SmoothScroll';
import Navbar from '../components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Share2, Lock, Link as LinkIcon, Eye, MessageCircle, Calendar, FileText, Tag, ListFilter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ShareVideo from '../components/sharing/ShareVideo';
import { Recording } from '@/components/recording/types';

const ViewRecording: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState('');
  const [viewCount, setViewCount] = useState(0);
  const [recording, setRecording] = useState<Recording | null>(null);

  // Load recording from localStorage
  useEffect(() => {
    const savedRecordings = JSON.parse(localStorage.getItem('recordings') || '[]');
    const foundRecording = savedRecordings.find((rec: any) => rec.id === id);
    
    if (foundRecording) {
      setRecording({
        ...foundRecording,
        createdAt: new Date(foundRecording.createdAt),
        expiresAt: foundRecording.expiresAt ? new Date(foundRecording.expiresAt) : undefined,
        views: (foundRecording.views || 0) + 1, // Increment view count
      });
      
      setIsPasswordProtected(foundRecording.isPasswordProtected || false);
      setExpiryDate(foundRecording.expiresAt ? new Date(foundRecording.expiresAt) : null);
      setViewCount((foundRecording.views || 0) + 1);
      
      // Update view count in localStorage
      const updatedRecordings = savedRecordings.map((rec: any) => {
        if (rec.id === id) {
          return {
            ...rec,
            views: (rec.views || 0) + 1,
          };
        }
        return rec;
      });
      
      localStorage.setItem('recordings', JSON.stringify(updatedRecordings));
    }
  }, [id]);

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: message,
    });
  };

  const togglePasswordProtection = () => {
    setIsPasswordProtected(!isPasswordProtected);
    setShowPasswordInput(!isPasswordProtected);
  };

  const setExpiration = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    setExpiryDate(date);
    toast({
      title: "Expiration Set",
      description: `This link will expire in ${days} days`,
    });
  };

  if (!recording) {
    return (
      <SmoothScroll className="relative">
        <Navbar />
        <main className="pt-24 pb-20">
          <div className="section-container max-w-6xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Recording Not Found</h1>
            <p className="text-muted-foreground mb-6">The recording you're looking for doesn't exist or has been deleted.</p>
            <Link to="/recordings">
              <Button>View All Recordings</Button>
            </Link>
          </div>
        </main>
      </SmoothScroll>
    );
  }

  return (
    <SmoothScroll className="relative">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="section-container max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Video Player */}
            <div className="lg:w-2/3">
              <h1 className="text-3xl md:text-4xl font-bold mb-3 reveal">{recording.title}</h1>
              <p className="text-muted-foreground mb-6 reveal">{recording.description}</p>
              
              <div className="bg-black aspect-video rounded-lg mb-6 overflow-hidden reveal">
                <video 
                  src={recording.url} 
                  controls 
                  className="w-full h-full"
                  poster={recording.thumbnail}
                />
              </div>

              <div className="flex items-center justify-between mb-8 reveal">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    <span>{viewCount} views</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{recording.createdAt.toLocaleDateString()}</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => copyToClipboard(recording.shareUrl || '', "Link copied to clipboard!")}
                >
                  <Copy className="h-4 w-4" />
                  Copy Link
                </Button>
              </div>

              <Tabs defaultValue="info" className="w-full reveal">
                <TabsList className="w-full">
                  <TabsTrigger value="info" className="flex-1">
                    <FileText className="mr-2 h-4 w-4" />
                    Info & Transcription
                  </TabsTrigger>
                  <TabsTrigger value="comments" className="flex-1">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Comments
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="flex-1">
                    <Eye className="mr-2 h-4 w-4" />
                    Analytics
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="info" className="p-4 border rounded-lg mt-4">
                  {recording.tags && recording.tags.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium mb-2">AI-Generated Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {recording.tags.map(tag => (
                          <div key={tag} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {tag}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {recording.topics && recording.topics.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium mb-2">Key Topics</h3>
                      <div className="flex flex-wrap gap-2">
                        {recording.topics.map(topic => (
                          <div key={topic} className="bg-muted px-3 py-1 rounded-full text-sm flex items-center gap-1">
                            <ListFilter className="h-3 w-3" />
                            {topic}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {recording.aiSummary && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium mb-2">AI Summary</h3>
                      <p className="text-sm text-muted-foreground p-3 bg-muted rounded-md">
                        {recording.aiSummary}
                      </p>
                    </div>
                  )}
                  
                  {recording.transcription ? (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Transcription</h3>
                      <div className="p-3 bg-muted rounded-md text-sm text-muted-foreground max-h-60 overflow-y-auto">
                        {recording.transcription}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-2 opacity-30" />
                      <p>No transcription available for this recording.</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="comments" className="p-4 border rounded-lg mt-4">
                  <div className="text-center text-muted-foreground p-8">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No comments yet. Share this video to get feedback.</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="analytics" className="p-4 border rounded-lg mt-4">
                  <div className="text-center text-muted-foreground p-8">
                    <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Analytics will be available after more views.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sharing Options */}
            <div className="lg:w-1/3">
              <div className="bg-card border rounded-xl p-6 mb-6 reveal">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Share Options
                </h2>
                
                <div className="mb-4">
                  <label className="text-sm font-medium mb-1 block">Share Link</label>
                  <div className="flex gap-2">
                    <Input 
                      value={recording.shareUrl || `${window.location.origin}/share/${recording.id}`} 
                      readOnly 
                      className="text-sm"
                    />
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => copyToClipboard(
                        recording.shareUrl || `${window.location.origin}/share/${recording.id}`, 
                        "Link copied to clipboard!"
                      )}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Button 
                      variant={isPasswordProtected ? "default" : "outline"} 
                      className="w-full justify-start gap-2 mb-2"
                      onClick={togglePasswordProtection}
                    >
                      <Lock className="h-4 w-4" />
                      Password Protection
                    </Button>
                    
                    {showPasswordInput && (
                      <div className="mt-2 mb-4">
                        <Input
                          type="password"
                          placeholder="Enter password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="mb-2"
                        />
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => {
                            setShowPasswordInput(false);
                            toast({
                              title: "Password Set",
                              description: "Your video is now password protected",
                            });
                            
                            // Update recording in localStorage
                            const savedRecordings = JSON.parse(localStorage.getItem('recordings') || '[]');
                            const updatedRecordings = savedRecordings.map((rec: any) => {
                              if (rec.id === id) {
                                return {
                                  ...rec,
                                  isPasswordProtected: true,
                                };
                              }
                              return rec;
                            });
                            
                            localStorage.setItem('recordings', JSON.stringify(updatedRecordings));
                          }}
                        >
                          Set Password
                        </Button>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Link Expiration</h3>
                    <div className="flex gap-2 flex-wrap">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setExpiration(1);
                          
                          // Update recording in localStorage
                          const savedRecordings = JSON.parse(localStorage.getItem('recordings') || '[]');
                          const date = new Date();
                          date.setDate(date.getDate() + 1);
                          
                          const updatedRecordings = savedRecordings.map((rec: any) => {
                            if (rec.id === id) {
                              return {
                                ...rec,
                                expiresAt: date.toISOString(),
                              };
                            }
                            return rec;
                          });
                          
                          localStorage.setItem('recordings', JSON.stringify(updatedRecordings));
                        }}
                      >
                        1 Day
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setExpiration(7);
                          
                          // Update recording in localStorage
                          const savedRecordings = JSON.parse(localStorage.getItem('recordings') || '[]');
                          const date = new Date();
                          date.setDate(date.getDate() + 7);
                          
                          const updatedRecordings = savedRecordings.map((rec: any) => {
                            if (rec.id === id) {
                              return {
                                ...rec,
                                expiresAt: date.toISOString(),
                              };
                            }
                            return rec;
                          });
                          
                          localStorage.setItem('recordings', JSON.stringify(updatedRecordings));
                        }}
                      >
                        7 Days
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setExpiration(30);
                          
                          // Update recording in localStorage
                          const savedRecordings = JSON.parse(localStorage.getItem('recordings') || '[]');
                          const date = new Date();
                          date.setDate(date.getDate() + 30);
                          
                          const updatedRecordings = savedRecordings.map((rec: any) => {
                            if (rec.id === id) {
                              return {
                                ...rec,
                                expiresAt: date.toISOString(),
                              };
                            }
                            return rec;
                          });
                          
                          localStorage.setItem('recordings', JSON.stringify(updatedRecordings));
                        }}
                      >
                        30 Days
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setExpiryDate(null);
                          toast({
                            title: "No Expiration",
                            description: "This link will never expire",
                          });
                          
                          // Update recording in localStorage
                          const savedRecordings = JSON.parse(localStorage.getItem('recordings') || '[]');
                          const updatedRecordings = savedRecordings.map((rec: any) => {
                            if (rec.id === id) {
                              return {
                                ...rec,
                                expiresAt: null,
                              };
                            }
                            return rec;
                          });
                          
                          localStorage.setItem('recordings', JSON.stringify(updatedRecordings));
                        }}
                      >
                        No Limit
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Embed Options</h3>
                    <div className="bg-muted p-3 rounded-md text-xs font-mono break-all">
                      {`<iframe src="${recording.shareUrl || `${window.location.origin}/share/${recording.id}`}/embed" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-2"
                      onClick={() => copyToClipboard(
                        `<iframe src="${recording.shareUrl || `${window.location.origin}/share/${recording.id}`}/embed" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`,
                        "Embed code copied to clipboard!"
                      )}
                    >
                      Copy Embed Code
                    </Button>
                  </div>
                </div>
              </div>

              {recording && <ShareVideo recording={recording} />}
            </div>
          </div>
        </div>
      </main>
    </SmoothScroll>
  );
};

export default ViewRecording;
