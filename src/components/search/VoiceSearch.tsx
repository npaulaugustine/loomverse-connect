
import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface VoiceSearchProps {
  onTranscript: (transcript: string) => void;
}

const VoiceSearch: React.FC<VoiceSearchProps> = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if the browser supports speech recognition
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }

    // Create a new recognition instance
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognitionAPI();
    
    // Configure the recognition
    if (recognitionRef.current) {
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      // Set up event handlers
      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setIsLoading(false);
        setError(null);
      };
      
      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        
        if (event.results[0].isFinal) {
          onTranscript(transcript);
        }
      };
      
      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setError(`Error: ${event.error}`);
        setIsListening(false);
        setIsLoading(false);
        toast({
          title: "Voice Search Error",
          description: `${event.error}. Please try again.`,
          variant: "destructive",
        });
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
        setIsLoading(false);
      };
    }

    // Cleanup
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [onTranscript, toast]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsLoading(true);
      recognitionRef.current?.start();
      toast({
        title: "Voice Search Activated",
        description: "Speak now to search your recordings.",
      });
    }
  };

  if (error) {
    return (
      <Button 
        variant="outline" 
        size="icon" 
        onClick={() => {
          toast({
            title: "Not Supported",
            description: error,
            variant: "destructive",
          });
        }}
        className="relative"
        disabled
      >
        <MicOff className="h-4 w-4 text-muted-foreground" />
      </Button>
    );
  }

  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={toggleListening}
      className={`relative ${isListening ? 'bg-primary/10' : ''}`}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isListening ? (
        <>
          <Mic className="h-4 w-4 text-primary animate-pulse" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full animate-ping" />
        </>
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
};

export default VoiceSearch;
