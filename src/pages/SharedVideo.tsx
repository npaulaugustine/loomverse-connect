
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Eye, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SharedVideo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isPasswordProtected, setIsPasswordProtected] = useState(true);
  const [password, setPassword] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<{ text: string, timestamp: number, user: string }[]>([]);
  const [viewCount, setViewCount] = useState(1); // Start at 1 for the current view

  // Mock video URL - in a real app, this would come from an API
  const videoUrl = 'https://example.com/video.mp4';

  const checkPassword = () => {
    // In a real app, this would validate against a server
    if (password === 'demo') {
      setUnlocked(true);
      setIsPasswordProtected(false);
      incrementViewCount();
    } else {
      toast({
        title: "Incorrect Password",
        description: "Please try again or contact the owner",
        variant: "destructive",
      });
    }
  };

  const incrementViewCount = () => {
    // In a real app, this would call an API
    setViewCount(prevCount => prevCount + 1);
  };

  const addComment = () => {
    if (comment.trim()) {
      // Get current video time - in a real app, you'd get this from the video player
      const timestamp = 30; // seconds - mock value
      
      const newComment = {
        text: comment,
        timestamp,
        user: 'Anonymous Viewer'
      };
      
      setComments(prev => [...prev, newComment]);
      setComment('');
      
      toast({
        title: "Comment Added",
        description: "Your comment has been posted",
      });
    }
  };

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (isPasswordProtected && !unlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted">
        <div className="bg-card border rounded-xl p-8 max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <Lock className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-2">Password Protected</h1>
            <p className="text-muted-foreground">This video requires a password to view</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Enter Password</label>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <Button 
              className="w-full" 
              onClick={checkPassword}
            >
              Unlock Video
            </Button>
          </div>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Need access? Contact the person who shared this with you.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Shared Video</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Eye className="h-4 w-4" />
            <span>{viewCount} views</span>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="bg-black aspect-video rounded-lg mb-6 overflow-hidden">
              <video 
                src={videoUrl} 
                controls 
                className="w-full h-full"
                autoPlay
              />
            </div>
            
            <Button 
              variant="outline" 
              className="gap-2 mb-6"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="h-4 w-4" />
              {showComments ? 'Hide Comments' : 'Show Comments'}
            </Button>
            
            {showComments && (
              <div className="border rounded-lg p-4">
                <h2 className="text-xl font-bold mb-4">Comments</h2>
                
                <div className="mb-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <Button onClick={addComment}>Post</Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {comments.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No comments yet</p>
                  ) : (
                    comments.map((c, i) => (
                      <div key={i} className="border-b pb-3">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">{c.user}</span>
                          <button 
                            className="text-primary text-sm"
                            onClick={() => {
                              // In a real app, this would seek the video to the timestamp
                              toast({
                                title: "Seeking to timestamp",
                                description: `Jumping to ${formatTime(c.timestamp)}`,
                              });
                            }}
                          >
                            {formatTime(c.timestamp)}
                          </button>
                        </div>
                        <p>{c.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="lg:w-1/3">
            <div className="bg-card border rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">About This Video</h2>
              <p className="text-muted-foreground mb-4">
                This video was shared with you. You can watch, comment, and provide feedback.
              </p>
              
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium mb-2">Need to share this?</h3>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast({
                      title: "Link Copied",
                      description: "Video link copied to clipboard",
                    });
                  }}
                >
                  Copy Link
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedVideo;
