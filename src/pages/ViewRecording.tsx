
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SmoothScroll from '../components/ui/SmoothScroll';
import Navbar from '../components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Share2, Lock, Link as LinkIcon, Eye, MessageCircle, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ShareVideo from '../components/sharing/ShareVideo';

const ViewRecording: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState('');
  const [viewCount, setViewCount] = useState(0);

  // Mock data - in a real app, this would come from an API call
  const recording = {
    id: id || '1',
    title: 'Screen Recording Demo',
    description: 'A demonstration of the screen recording feature',
    url: 'https://example.com/video.mp4',
    thumbnail: 'https://example.com/thumbnail.jpg',
    duration: 120, // in seconds
    createdAt: new Date(),
    views: 5,
    shareUrl: `${window.location.origin}/share/${id}`,
    isPasswordProtected: isPasswordProtected,
    expiresAt: expiryDate,
    isPublic: true
  };

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

              <Tabs defaultValue="comments" className="w-full reveal">
                <TabsList className="w-full">
                  <TabsTrigger value="comments" className="flex-1">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Comments
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="flex-1">
                    <Eye className="mr-2 h-4 w-4" />
                    Analytics
                  </TabsTrigger>
                </TabsList>
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
                      value={recording.shareUrl} 
                      readOnly 
                      className="text-sm"
                    />
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => copyToClipboard(recording.shareUrl || '', "Link copied to clipboard!")}
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
                        onClick={() => setExpiration(1)}
                      >
                        1 Day
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setExpiration(7)}
                      >
                        7 Days
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setExpiration(30)}
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
                        }}
                      >
                        No Limit
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Embed Options</h3>
                    <div className="bg-muted p-3 rounded-md text-xs font-mono break-all">
                      {`<iframe src="${recording.shareUrl}/embed" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-2"
                      onClick={() => copyToClipboard(
                        `<iframe src="${recording.shareUrl}/embed" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`,
                        "Embed code copied to clipboard!"
                      )}
                    >
                      Copy Embed Code
                    </Button>
                  </div>
                </div>
              </div>

              <ShareVideo recording={recording} />
            </div>
          </div>
        </div>
      </main>
    </SmoothScroll>
  );
};

export default ViewRecording;
