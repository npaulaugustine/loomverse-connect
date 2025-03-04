
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Camera, Monitor, Mic, MicOff, Video, AlertCircle, Edit, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import RecordingControls from './RecordingControls';
import RecordingPreview from './RecordingPreview';
import { RecordingOptions, RecordingState } from './types';

const RecordingStudio: React.FC = () => {
  const navigate = useNavigate();
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [recordingOptions, setRecordingOptions] = useState<RecordingOptions>({
    video: true,
    audio: true,
    screen: false,
  });
  const [countdown, setCountdown] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [permission, setPermission] = useState<{ video: boolean, audio: boolean }>({ video: false, audio: false });
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [videoTitle, setVideoTitle] = useState('Untitled Recording');
  const [videoDescription, setVideoDescription] = useState('');
  const [isEditingMetadata, setIsEditingMetadata] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<number | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      stopAllStreams();
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  const checkPermissions = async () => {
    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast({
          title: "Browser Not Supported",
          description: "Your browser doesn't support camera access.",
          variant: "destructive",
        });
        return false;
      }

      // Check camera and microphone permissions
      const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
      const micPermissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      
      setPermission({
        video: permissionStatus.state === 'granted',
        audio: micPermissionStatus.state === 'granted'
      });

      return permissionStatus.state === 'granted' && micPermissionStatus.state === 'granted';
    } catch (error) {
      console.error('Permission check error:', error);
      return false;
    }
  };

  const requestPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: recordingOptions.video, 
        audio: recordingOptions.audio 
      });
      
      // Clean up the temporary stream
      stream.getTracks().forEach(track => track.stop());
      
      setPermission({ video: true, audio: true });
      toast({
        title: "Permissions Granted",
        description: "Camera and microphone access allowed.",
      });
      
      return true;
    } catch (error) {
      console.error('Permission request error:', error);
      toast({
        title: "Permission Denied",
        description: "Please allow camera and microphone access to record.",
        variant: "destructive",
      });
      return false;
    }
  };

  const startCountdown = () => {
    setCountdown(3);
    const interval = window.setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          startRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const setupMediaStream = async () => {
    try {
      stopAllStreams();
      chunksRef.current = [];
      
      // Request camera/microphone
      if (recordingOptions.video || recordingOptions.audio) {
        const hasPermission = await checkPermissions();
        if (!hasPermission) {
          const granted = await requestPermissions();
          if (!granted) return false;
        }
        
        const userStream = await navigator.mediaDevices.getUserMedia({
          video: recordingOptions.video,
          audio: recordingOptions.audio
        });
        streamRef.current = userStream;
      }
      
      // Request screen share
      if (recordingOptions.screen) {
        try {
          const displayStream = await navigator.mediaDevices.getDisplayMedia({
            video: {
              displaySurface: 'monitor',
              logicalSurface: true,
              cursor: 'always',
            } as MediaTrackConstraints,
            audio: recordingOptions.audio
          });
          screenStreamRef.current = displayStream;
          
          // If we're recording both camera and screen, we need to create a composite stream
          if (recordingOptions.video && streamRef.current) {
            // Implement composite stream logic here if needed
            // For now just use screen stream
            if (videoRef.current) {
              videoRef.current.srcObject = displayStream;
            }
          } else {
            if (videoRef.current) {
              videoRef.current.srcObject = displayStream;
            }
          }
        } catch (error) {
          console.error('Screen sharing error:', error);
          toast({
            title: "Screen Sharing Error",
            description: "Unable to access your screen. Please try again.",
            variant: "destructive",
          });
          return false;
        }
      } else if (streamRef.current && videoRef.current) {
        videoRef.current.srcObject = streamRef.current;
      }
      
      return true;
    } catch (error) {
      console.error('Media stream setup error:', error);
      toast({
        title: "Setup Error",
        description: "Failed to set up recording. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const startRecording = async () => {
    try {
      const streamSetupSuccess = await setupMediaStream();
      if (!streamSetupSuccess) return;
      
      const stream = recordingOptions.screen 
        ? screenStreamRef.current 
        : streamRef.current;
      
      if (!stream) {
        throw new Error('No media stream available');
      }
      
      // Set up MediaRecorder
      const options = { mimeType: 'video/webm;codecs=vp9,opus' };
      mediaRecorderRef.current = new MediaRecorder(stream, options);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setRecordedBlob(blob);
        setRecordingState('completed');
        if (timerRef.current) window.clearInterval(timerRef.current);
      };
      
      // Start recording
      mediaRecorderRef.current.start(1000); // Collect data every second
      setRecordingState('recording');
      
      // Start duration timer
      setDuration(0);
      timerRef.current = window.setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Recording start error:', error);
      toast({
        title: "Recording Error",
        description: "Failed to start recording. Please try again.",
        variant: "destructive",
      });
      setRecordingState('idle');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setRecordingState('paused');
      if (timerRef.current) window.clearInterval(timerRef.current);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setRecordingState('recording');
      
      timerRef.current = window.setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && (mediaRecorderRef.current.state === 'recording' || mediaRecorderRef.current.state === 'paused')) {
      mediaRecorderRef.current.stop();
      stopAllStreams();
    }
  };

  const stopAllStreams = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
      screenStreamRef.current = null;
    }
    
    if (videoRef.current) {
      if (videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      videoRef.current.srcObject = null;
    }
  };

  const discardRecording = () => {
    setRecordedBlob(null);
    setRecordingState('idle');
    chunksRef.current = [];
    setDuration(0);
    setVideoTitle('Untitled Recording');
    setVideoDescription('');
  };

  const saveRecording = () => {
    if (recordedBlob) {
      // Generate a unique ID for the recording
      const recordingId = `rec_${Date.now()}`;
      
      // In a real app, you would upload the blob to a server
      // For now, we'll simulate by saving to localStorage and navigate to view
      
      // Create an object URL for the blob
      const url = URL.createObjectURL(recordedBlob);
      
      // Save metadata to localStorage (in a real app, this would go to a database)
      const recordingData = {
        id: recordingId,
        title: videoTitle,
        description: videoDescription,
        url: url,
        duration: duration,
        createdAt: new Date().toISOString(),
        views: 0,
        isPublic: false
      };
      
      // Store in localStorage (as a simplified demo)
      const savedRecordings = JSON.parse(localStorage.getItem('recordings') || '[]');
      savedRecordings.push(recordingData);
      localStorage.setItem('recordings', JSON.stringify(savedRecordings));
      
      toast({
        title: "Recording Saved",
        description: "Your recording has been saved successfully.",
      });
      
      // Navigate to the view recording page
      navigate(`/recording/${recordingId}`);
    }
  };

  const shareRecording = () => {
    if (recordedBlob) {
      // Generate a unique ID for the recording
      const recordingId = `rec_${Date.now()}`;
      
      // In a real app, you would upload the blob to a server
      // For now, we'll simulate by saving to localStorage and navigate to view
      
      // Create an object URL for the blob
      const url = URL.createObjectURL(recordedBlob);
      
      // Save metadata to localStorage (in a real app, this would go to a database)
      const recordingData = {
        id: recordingId,
        title: videoTitle,
        description: videoDescription,
        url: url,
        duration: duration,
        createdAt: new Date().toISOString(),
        views: 0,
        isPublic: true,
        shareUrl: `${window.location.origin}/share/${recordingId}`
      };
      
      // Store in localStorage (as a simplified demo)
      const savedRecordings = JSON.parse(localStorage.getItem('recordings') || '[]');
      savedRecordings.push(recordingData);
      localStorage.setItem('recordings', JSON.stringify(savedRecordings));
      
      setRecordingState('shared');
      
      toast({
        title: "Recording Shared",
        description: "Your recording is now ready to share.",
      });
      
      // Navigate to the view recording page with sharing options
      navigate(`/recording/${recordingId}`);
    }
  };

  const onOptionChange = (key: keyof RecordingOptions, value: boolean) => {
    setRecordingOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
      <Tabs defaultValue="camera" className="w-full">
        <TabsList className="w-full rounded-none border-b bg-muted/50 p-0">
          <TabsTrigger 
            value="camera" 
            className="rounded-none border-r data-[state=active]:bg-background py-3 flex-1"
            onClick={() => setRecordingOptions(prev => ({ ...prev, video: true, screen: false }))}
          >
            <Camera className="mr-2 h-4 w-4" />
            Camera Only
          </TabsTrigger>
          <TabsTrigger 
            value="screen" 
            className="rounded-none border-r data-[state=active]:bg-background py-3 flex-1"
            onClick={() => setRecordingOptions(prev => ({ ...prev, video: false, screen: true }))}
          >
            <Monitor className="mr-2 h-4 w-4" />
            Screen Only
          </TabsTrigger>
          <TabsTrigger 
            value="both" 
            className="rounded-none data-[state=active]:bg-background py-3 flex-1"
            onClick={() => setRecordingOptions(prev => ({ ...prev, video: true, screen: true }))}
          >
            <Video className="mr-2 h-4 w-4" />
            Camera & Screen
          </TabsTrigger>
        </TabsList>
        
        <div className="p-6">
          {recordingState === 'idle' && (
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-full aspect-video bg-muted rounded-lg mb-6 flex items-center justify-center overflow-hidden">
                {!permission.video && recordingOptions.video && (
                  <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Camera permission is required</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={requestPermissions}
                    >
                      Grant Permissions
                    </Button>
                  </div>
                )}
                {permission.video && recordingOptions.video && (
                  <video 
                    ref={videoRef} 
                    className="w-full h-full object-cover" 
                    autoPlay 
                    muted 
                    playsInline
                  />
                )}
                {recordingOptions.screen && (
                  <div className="text-center">
                    <Monitor className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Your screen will be shared when recording starts</p>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <Button
                  variant={recordingOptions.audio ? "default" : "outline"}
                  size="sm"
                  className="gap-2"
                  onClick={() => onOptionChange('audio', !recordingOptions.audio)}
                >
                  {recordingOptions.audio ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  {recordingOptions.audio ? "Microphone On" : "Microphone Off"}
                </Button>
              </div>
              
              <Button 
                size="lg" 
                className="gap-2 px-8" 
                onClick={startCountdown}
              >
                <Video className="h-5 w-5" />
                Start Recording
              </Button>
            </div>
          )}
          
          {countdown > 0 && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10">
              <div className="text-white text-9xl font-bold animate-pulse">
                {countdown}
              </div>
            </div>
          )}
          
          {(recordingState === 'recording' || recordingState === 'paused') && (
            <RecordingPreview 
              videoRef={videoRef} 
              duration={duration}
              isPaused={recordingState === 'paused'}
            />
          )}
          
          {recordingState === 'completed' && recordedBlob && (
            <div className="flex flex-col items-center">
              <div className="w-full mb-6">
                <div className="flex justify-between items-center mb-4">
                  {isEditingMetadata ? (
                    <div className="w-full space-y-3">
                      <Input
                        value={videoTitle}
                        onChange={(e) => setVideoTitle(e.target.value)}
                        placeholder="Video title"
                        className="text-xl font-bold"
                      />
                      <Input
                        value={videoDescription}
                        onChange={(e) => setVideoDescription(e.target.value)}
                        placeholder="Add a description..."
                        className="text-sm text-muted-foreground"
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsEditingMetadata(false)}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  ) : (
                    <div className="w-full">
                      <h2 className="text-xl font-bold mb-1">{videoTitle}</h2>
                      <p className="text-sm text-muted-foreground mb-2">
                        {videoDescription || 'No description'}
                      </p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-muted-foreground"
                        onClick={() => setIsEditingMetadata(true)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <video 
                className="w-full max-h-[70vh] rounded-lg mb-6" 
                controls
                src={URL.createObjectURL(recordedBlob)}
              />
              
              <div className="flex gap-4">
                <Button variant="outline" onClick={discardRecording}>
                  Discard
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={saveRecording}
                >
                  <Save className="h-4 w-4" />
                  Save Privately
                </Button>
                <Button className="gap-2" onClick={shareRecording}>
                  <Video className="h-4 w-4" />
                  Save & Share
                </Button>
              </div>
            </div>
          )}
          
          {recordingState === 'shared' && (
            <div className="text-center p-10">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Video className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Your Video is Ready to Share!</h2>
              <p className="text-muted-foreground mb-6">
                Your recording has been saved and can now be shared with others.
              </p>
              <Button 
                onClick={() => navigate('/recordings')}
                className="gap-2"
              >
                View My Recordings
              </Button>
            </div>
          )}
        </div>
      </Tabs>
      
      {(recordingState === 'recording' || recordingState === 'paused') && (
        <RecordingControls 
          recordingState={recordingState}
          duration={duration}
          onPause={pauseRecording}
          onResume={resumeRecording}
          onStop={stopRecording}
        />
      )}
    </div>
  );
};

export default RecordingStudio;
