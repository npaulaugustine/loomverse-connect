
/// <reference types="vite/client" />

interface Window {
  SpeechRecognition: typeof SpeechRecognition;
  webkitSpeechRecognition: typeof SpeechRecognition;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  [index: number]: SpeechRecognitionAlternative;
  isFinal?: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

// Define a custom error event interface for SpeechRecognition
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

declare class SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onaudiostart: (ev: Event) => any;
  onaudioend: (ev: Event) => any;
  onend: (ev: Event) => any;
  onerror: (ev: SpeechRecognitionErrorEvent) => any;
  onnomatch: (ev: Event) => any;
  onresult: (ev: SpeechRecognitionEvent) => any;
  onsoundstart: (ev: Event) => any;
  onsoundend: (ev: Event) => any;
  onspeechstart: (ev: Event) => any;
  onspeechend: (ev: Event) => any;
  onstart: (ev: Event) => any;
  start(): void;
  stop(): void;
  abort(): void;
}
