import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Camera, Monitor, Mic, MicOff, Video, AlertCircle, Edit, Save, Loader2, Tag, X, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import RecordingControls from './RecordingControls';
import RecordingPreview from './RecordingPreview';
import { RecordingOptions, RecordingState } from './types';
import { 
  generateTranscription, 
  generateTags, 
  generateSummary,
  extractTopics 
} from '@/services/ai-service';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { storage, firestore } from '@/services/firebase';
import { v4 as uuidv4 } from 'uuid';

const RecordingStudio: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [topics, setTopics] = useState<string[]>([]);
  const [cameraPosition, setCameraPosition] = useState<'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'>('bottom-right');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      stopAllStreams();
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (recordingState === 'idle') {
      initializePreview();
    }
  }, [recordingOptions]);

  const initializePreview = async () => {
    try {
      stopAllStreams();
      
      if (recordingOptions.video) {
        const hasPermission = await checkPermissions();
        if (!hasPermission) {
          const granted = await requestPermissions();
          if (!granted) return;
        }
        
        const userStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
          audio: false
        });
        
        streamRef.current = userStream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = userStream;
          await videoRef.current.play().catch(e => console.error("Could not play video:", e));
        }
      }
    } catch (error) {
      console.error('Preview initialization error:', error);
    }
  };

  const checkPermissions = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast({
          title: "Browser Not Supported",
          description: "Your browser doesn't support camera access.",
          variant: "destructive",
        });
        return false;
      }

      try {
        const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
        const micPermissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        
        setPermission({
          video: permissionStatus.state === 'granted',
          audio: micPermissionStatus.state === 'granted'
        });

        return permissionStatus.state === 'granted' && micPermissionStatus.state === 'granted';
      } catch (e) {
        console.log("Permissions API not supported, trying direct access");
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        stream.getTracks().forEach(track => track.stop());
        setPermission({ video: true, audio: true });
        return true;
      }
    } catch (error) {
      console.error('Permission check error:', error);
      setPermission({ video: false, audio: false });
      return false;
    }
  };

  const requestPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: recordingOptions.video, 
        audio: recordingOptions.audio 
      });
      
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
      
      let combinedStream: MediaStream | null = null;
      let videoTracks: MediaStreamTrack[] = [];
      let audioTracks: MediaStreamTrack[] = [];
      
      if (recordingOptions.video || recordingOptions.audio) {
        const hasPermission = await checkPermissions();
        if (!hasPermission) {
          const granted = await requestPermissions();
          if (!granted) return false;
        }
        
        const userStream = await navigator.mediaDevices.getUserMedia({
          video: recordingOptions.video ? { width: 1280, height: 720 } : false,
          audio: recordingOptions.audio
        });
        
        streamRef.current = userStream;
        
        if (recordingOptions.video && userVideoRef.current) {
          userVideoRef.current.srcObject = userStream;
          await userVideoRef.current.play().catch(e => console.error("Could not play user video:", e));
        }
        
        if (recordingOptions.video) {
          videoTracks = [...videoTracks, ...userStream.getVideoTracks()];
        }
        
        if (recordingOptions.audio) {
          audioTracks = [...audioTracks, ...userStream.getAudioTracks()];
        }
      }
      
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
          
          if (videoRef.current) {
            videoRef.current.srcObject = displayStream;
            await videoRef.current.play().catch(e => console.error("Could not play screen video:", e));
          }
          
          videoTracks = [...videoTracks, ...displayStream.getVideoTracks()];
          
          if (recordingOptions.audio) {
            audioTracks = [...audioTracks, ...displayStream.getAudioTracks()];
          }
          
          displayStream.getVideoTracks()[0].onended = () => {
            stopRecording();
          };
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
        await videoRef.current.play().catch(e => console.error("Could not play video:", e));
      }
      
      combinedStream = new MediaStream([...videoTracks, ...audioTracks]);
      
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
      
      mediaRecorderRef.current.start(1000);
      setRecordingState('recording');
      
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
    setTranscription(null);
    setTags([]);
    setAiSummary(null);
    setTopics([]);
  };

  const processRecordingWithAI = async () => {
    if (!recordedBlob) return;
    
    setIsProcessing(true);
    toast({
      title: "Processing Recording",
      description: "Analyzing your recording with AI...",
    });
    
    try {
      const textTranscription = await generateTranscription(recordedBlob);
      setTranscription(textTranscription);
      
      const generatedTags = await generateTags(textTranscription);
      setTags(generatedTags);
      
      const summary = await generateSummary(textTranscription);
      setAiSummary(summary);
      
      const keyTopics = await extractTopics(textTranscription);
      setTopics(keyTopics);
      
      toast({
        title: "Analysis Complete",
        description: "Your recording has been processed with AI.",
      });
    } catch (error) {
      console.error('AI processing error:', error);
      toast({
        title: "Processing Error",
        description: "Failed to analyze recording with AI.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const saveRecording = async () => {
    if (recordedBlob) {
      setIsProcessing(true);
      
      try {
        if (!transcription) {
          await processRecordingWithAI();
        }
        
        const recordingId = `rec_${uuidv4()}`;
        
        const storageRef = ref(storage, `recordings/${recordingId}.webm`);
        await uploadBytes(storageRef, recordedBlob);
        const downloadURL = await getDownloadURL(storageRef);
        
        const recordingData = {
          id: recordingId,
          title: videoTitle,
          description: videoDescription,
          url: downloadURL,
          duration: duration,
          createdAt: serverTimestamp(),
          views: 0,
          isPublic: false,
          transcription: transcription,
          tags: tags,
          aiSummary: aiSummary,
          topics: topics
        };
        
        await addDoc(collection(firestore, "recordings"), recordingData);
        
        const localRecordingData = {
          ...recordingData,
          createdAt: new Date().toISOString(),
          url: URL.createObjectURL(recordedBlob)
        };
        
        const savedRecordings = JSON.parse(localStorage.getItem('recordings') || '[]');
        savedRecordings.push(localRecordingData);
        localStorage.setItem('recordings', JSON.stringify(savedRecordings));
        
        toast({
          title: "Recording Saved",
          description: "Your recording has been saved to the cloud.",
        });
        
        navigate(`/recording/${recordingId}`);
      } catch (error) {
        console.error('Error saving recording:', error);
        toast({
          title: "Save Error",
          description: "Failed to save recording. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const shareRecording = async () => {
    if (recordedBlob) {
      setIsProcessing(true);
      
      try {
        if (!transcription) {
          await processRecordingWithAI();
        }
        
        const recordingId = `rec_${uuidv4()}`;
        
        const storageRef = ref(storage, `recordings/${recordingId}.webm`);
        await uploadBytes(storageRef, recordedBlob);
        const downloadURL = await getDownloadURL(storageRef);
        
        const shareUrl = `${window.location.origin}/share/${recordingId}`;
        
        const recordingData = {
          id: recordingId,
          title: videoTitle,
          description: videoDescription,
          url: downloadURL,
          duration: duration,
          createdAt: serverTimestamp(),
          views: 0,
          isPublic: true,
          shareUrl: shareUrl,
          transcription: transcription,
          tags: tags,
          aiSummary: aiSummary,
          topics: topics
        };
        
        await addDoc(collection(firestore, "recordings"), recordingData);
        
        const localRecordingData = {
          ...recordingData,
          createdAt: new Date().toISOString(),
          url: URL.createObjectURL(recordedBlob)
        };
        
        const savedRecordings = JSON.parse(localStorage.getItem('recordings') || '[]');
        savedRecordings.push(localRecordingData);
        localStorage.setItem('recordings', JSON.stringify(savedRecordings));
        
        setRecordingState('shared');
        
        toast({
          title: "Recording Shared",
          description: `Your recording is now ready to share at ${shareUrl}`,
        });
        
        navigate(`/recording/${recordingId}`);
      } catch (error) {
        console.error('Error sharing recording:', error);
        toast({
          title: "Share Error",
          description: "Failed to share recording. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const onOptionChange = (key: keyof RecordingOptions, value: boolean) => {
    setRecordingOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleCameraPosition = () => {
    const positions: Array<'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'> = [
      'bottom-right', 'bottom-left', 'top-right', 'top-left'
    ];
    
    const currentIndex = positions.indexOf(cameraPosition);
    const nextIndex = (currentIndex + 1) % positions.length;
    
    setCameraPosition(positions[nextIndex]);
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden">
      {recordingState === 'idle' && (
        <div className="p-6">
          <div className="rounded-lg overflow-hidden mb-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-slate-100 rounded-lg">
                <Monitor className="h-5 w-5 text-slate-600" />
                <span className="text-slate-700 font-medium">Full Screen</span>
                <div className="ml-auto">
                  <div className="w-12 h-6 bg-slate-200 rounded-full relative flex items-center cursor-pointer"
                    onClick={() => onOptionChange('screen', !recordingOptions.screen)}>
                    <div className={`absolute h-5 w-5 rounded-full transition-all ${recordingOptions.screen ? 'right-0.5 bg-blue-500' : 'left-0.5 bg-white'}`}></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-slate-100 rounded-lg">
                <Camera className="h-5 w-5 text-slate-600" />
                <span className="text-slate-700 font-medium">FaceTime HD Camera</span>
                <div className="ml-auto">
                  <div className="w-12 h-6 bg-blue-500 rounded-full relative flex items-center cursor-pointer"
                    onClick={() => onOptionChange('video', !recordingOptions.video)}>
                    <div className={`absolute h-5 w-5 rounded-full transition-all ${recordingOptions.video ? 'right-0.5 bg-white' : 'left-0.5 bg-white'}`}></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-slate-100 rounded-lg">
                <Mic className="h-5 w-5 text-slate-600" />
                <span className="text-slate-700 font-medium">Default - MacBook Pro Microphone</span>
                <div className="ml-auto">
                  <div className="w-12 h-6 bg-blue-500 rounded-full relative flex items-center cursor-pointer"
                    onClick={() => onOptionChange('audio', !recordingOptions.audio)}>
                    <div className={`absolute h-5 w-5 rounded-full transition-all ${recordingOptions.audio ? 'right-0.5 bg-white' : 'left-0.5 bg-white'}`}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-full">
              {!permission.video && recordingOptions.video ? (
                <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="h-10 w-10 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-500 mb-4">Camera permission is required</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={requestPermissions}
                    >
                      Grant Permissions
                    </Button>
                  </div>
                </div>
              ) : permission.video && recordingOptions.video ? (
                <video 
                  ref={videoRef} 
                  className="w-full aspect-video rounded-lg object-cover" 
                  autoPlay 
                  muted 
                  playsInline
                  style={{ transform: 'none' }}
                />
              ) : (
                <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Monitor className="h-10 w-10 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-500">Your screen will be shared when recording starts</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <Button 
            size="lg" 
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-full" 
            onClick={startCountdown}
          >
            Start Recording
          </Button>
          
          <div className="flex justify-center gap-8 mt-6">
            <div className="flex flex-col items-center">
              <button className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center mb-1">
                <RefreshCw className="h-5 w-5 text-slate-600" />
              </button>
              <span className="text-xs text-slate-500">Effects</span>
            </div>
            <div className="flex flex-col items-center">
              <button className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center mb-1">
                <div className="h-5 w-5 bg-slate-600" style={{ borderRadius: '2px' }}></div>
              </button>
              <span className="text-xs text-slate-500">Blur</span>
            </div>
            <div className="flex flex-col items-center">
              <button className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center mb-1">
                <svg className="h-5 w-5 text-slate-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="2" fill="currentColor" />
                  <circle cx="19" cy="12" r="2" fill="currentColor" />
                  <circle cx="5" cy="12" r="2" fill="currentColor" />
                </svg>
              </button>
              <span className="text-xs text-slate-500">More</span>
            </div>
          </div>
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
        <div className="p-6">
          <RecordingPreview 
            videoRef={videoRef}
            userVideoRef={recordingOptions.screen && recordingOptions.video ? userVideoRef : undefined}
            isScreenSharing={recordingOptions.screen}
            duration={duration}
            isPaused={recordingState === 'paused'}
            cameraPosition={cameraPosition}
            onToggleCameraPosition={toggleCameraPosition}
          />
          <RecordingControls 
            recordingState={recordingState}
            duration={duration}
            onPause={pauseRecording}
            onResume={resumeRecording}
            onStop={stopRecording}
            onToggleCameraPosition={toggleCameraPosition}
          />
        </div>
      )}
      
      {recordingState === 'completed' && recordedBlob && (
        <div className="p-6">
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
            
            <div className="flex flex-col w-full">
              <Button
                size="lg"
                className="mb-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-md"
                onClick={shareRecording}
                disabled={isProcessing}
              >
                Share video
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                className="bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                onClick={saveRecording}
                disabled={isProcessing}
              >
                Edit video
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordingStudio;
