
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Twitter, 
  Facebook, 
  Linkedin, 
  Mail, 
  Slack, 
  Send, 
  MessageSquare,
  Trello
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Recording } from '../recording/types';

interface ShareVideoProps {
  recording: Recording;
}

const ShareVideo: React.FC<ShareVideoProps> = ({ recording }) => {
  const { toast } = useToast();

  const shareUrl = recording.shareUrl || window.location.href;
  const title = recording.title;

  const shareToService = (service: string) => {
    let url = '';
    
    switch (service) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'email':
        url = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this video: ${shareUrl}`)}`;
        break;
      case 'slack':
      case 'trello':
      case 'teams':
        // Simulate integration
        toast({
          title: `Shared to ${service}`,
          description: `The video has been shared to ${service}`,
        });
        return;
      default:
        return;
    }
    
    window.open(url, '_blank');
  };

  return (
    <div className="bg-card border rounded-xl p-6 reveal">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Send className="h-5 w-5" />
        Share with Others
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        <Button 
          variant="outline" 
          className="flex items-center gap-2 justify-start"
          onClick={() => shareToService('twitter')}
        >
          <Twitter className="h-4 w-4" />
          Twitter
        </Button>
        
        <Button 
          variant="outline" 
          className="flex items-center gap-2 justify-start"
          onClick={() => shareToService('facebook')}
        >
          <Facebook className="h-4 w-4" />
          Facebook
        </Button>
        
        <Button 
          variant="outline" 
          className="flex items-center gap-2 justify-start"
          onClick={() => shareToService('linkedin')}
        >
          <Linkedin className="h-4 w-4" />
          LinkedIn
        </Button>
        
        <Button 
          variant="outline" 
          className="flex items-center gap-2 justify-start"
          onClick={() => shareToService('email')}
        >
          <Mail className="h-4 w-4" />
          Email
        </Button>
        
        <Button 
          variant="outline" 
          className="flex items-center gap-2 justify-start"
          onClick={() => shareToService('slack')}
        >
          <Slack className="h-4 w-4" />
          Slack
        </Button>
        
        <Button 
          variant="outline" 
          className="flex items-center gap-2 justify-start"
          onClick={() => shareToService('trello')}
        >
          <Trello className="h-4 w-4" />
          Trello
        </Button>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-sm font-medium mb-3">Need feedback?</h3>
        <Button 
          variant="default" 
          className="w-full gap-2"
          onClick={() => {
            toast({
              title: "Feedback Link Created",
              description: "A link with feedback enabled has been copied to clipboard",
            });
            navigator.clipboard.writeText(`${shareUrl}?feedback=enabled`);
          }}
        >
          <MessageSquare className="h-4 w-4" />
          Enable Timestamped Comments
        </Button>
      </div>
    </div>
  );
};

export default ShareVideo;
