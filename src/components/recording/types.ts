
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
  tags?: string[];
  aiSummary?: string;
  topics?: string[];
}
