
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

declare class SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onaudiostart: (ev: Event) => any;
  onaudioend: (ev: Event) => any;
  onend: (ev: Event) => any;
  onerror: (ev: Event) => any;
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
