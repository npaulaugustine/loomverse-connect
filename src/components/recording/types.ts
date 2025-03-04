
export type RecordingState = 'idle' | 'recording' | 'paused' | 'completed';

export interface RecordingOptions {
  video: boolean;
  audio: boolean;
  screen: boolean;
}
