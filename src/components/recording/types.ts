
export type RecordingState = 'idle' | 'recording' | 'paused' | 'completed' | 'shared';

export interface RecordingOptions {
  video: boolean;
  audio: boolean;
  screen: boolean;
}

export interface Recording {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnail?: string;
  duration: number;
  createdAt: Date;
  views: number;
  shareUrl?: string;
  isPasswordProtected?: boolean;
  expiresAt?: Date;
  isPublic: boolean;
  transcription?: string;
  editedTranscription?: string;
  tags?: string[];
  aiSummary?: string;
  topics?: string[];
  fillerWordsRemoved?: boolean;
  variables?: { [key: string]: string };
  
  // Analytics-related properties
  engagementScore?: number;
  averageViewDuration?: number;
  viewerRetention?: number;
  completionRate?: number;
  dropOffPoints?: { timestamp: number, percentage: number }[];
}

export interface TranscriptSegment {
  startTime: number;
  endTime: number;
  text: string;
  isFillerWord?: boolean;
}

export interface EditableTranscript {
  segments: TranscriptSegment[];
  originalText: string;
  editedText?: string;
}
