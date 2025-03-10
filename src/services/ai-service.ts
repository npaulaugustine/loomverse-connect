
/**
 * AI Service for transcription and metadata extraction
 * In a production app, this would connect to a real AI service.
 * For now, we'll simulate the AI functionality.
 */

import { EditableTranscript, Recording, TranscriptSegment } from "@/components/recording/types";

// Mock function to generate transcription
export const generateTranscription = async (audioBlob: Blob): Promise<string> => {
  // In a real app, this would send the audio to an AI service like Whisper
  console.log("Generating transcription for audio...");
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return a mock transcription
  return "This is a simulated transcription of the recording. In a real application, this would be generated by an AI service like OpenAI Whisper or AssemblyAI based on the actual audio content.";
};

// Generate tags based on content
export const generateTags = async (transcription: string): Promise<string[]> => {
  // In a real app, this would analyze the transcription with an AI model
  console.log("Generating tags from transcription...");
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return mock tags
  const possibleTags = [
    "Meeting", "Product Demo", "Tutorial", "Team Update", 
    "Brainstorm", "Customer Feedback", "Technical", "Planning",
    "Review", "Training", "Presentation"
  ];
  
  // Randomly select 2-4 tags
  const numTags = Math.floor(Math.random() * 3) + 2;
  const selectedTags: string[] = [];
  
  for (let i = 0; i < numTags; i++) {
    const randomIndex = Math.floor(Math.random() * possibleTags.length);
    const tag = possibleTags[randomIndex];
    
    if (!selectedTags.includes(tag)) {
      selectedTags.push(tag);
    }
  }
  
  return selectedTags;
};

// Generate AI summary of video content
export const generateSummary = async (transcription: string): Promise<string> => {
  // In a real app, this would use an LLM to summarize the content
  console.log("Generating AI summary...");
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Return a mock summary
  return "This is an AI-generated summary of the recording content. In a real application, this would be created by analyzing the transcription with a large language model to extract the key points.";
};

// Extract key topics from transcription
export const extractTopics = async (transcription: string): Promise<string[]> => {
  // In a real app, this would use NLP to extract key topics
  console.log("Extracting key topics...");
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock topics
  const possibleTopics = [
    "Project Planning", "UI Design", "Backend Development", 
    "Customer Experience", "Feature Implementation", "Bug Fixes", 
    "API Integration", "Performance Optimization", "User Feedback"
  ];
  
  // Randomly select 1-3 topics
  const numTopics = Math.floor(Math.random() * 3) + 1;
  const selectedTopics: string[] = [];
  
  for (let i = 0; i < numTopics; i++) {
    const randomIndex = Math.floor(Math.random() * possibleTopics.length);
    const topic = possibleTopics[randomIndex];
    
    if (!selectedTopics.includes(topic)) {
      selectedTopics.push(topic);
    }
  }
  
  return selectedTopics;
};

// Generate detailed transcript with timestamps and filler word detection
export const generateDetailedTranscript = async (audioBlob: Blob): Promise<EditableTranscript> => {
  console.log("Generating detailed transcript with timestamps...");
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generate mock transcript segments with timestamps
  const segments: TranscriptSegment[] = [
    { startTime: 0, endTime: 3.2, text: "Hello everyone, um, thanks for joining today's meeting." },
    { startTime: 3.5, endTime: 7.8, text: "Today we're going to discuss, you know, our product roadmap for Q3." },
    { startTime: 8.1, endTime: 12.5, text: "So, like, the first item on our agenda is the new feature rollout." },
    { startTime: 13.0, endTime: 18.2, text: "We have, uh, several key updates planned for the next release." },
    { startTime: 18.5, endTime: 25.0, text: "And I think this will really help us meet our objectives for the quarter." }
  ];
  
  // Identify filler words
  const fillerWords = ["um", "uh", "like", "you know", "so"];
  const markedSegments = segments.map(segment => {
    const words = segment.text.split(" ");
    const hasFillerWord = words.some(word => 
      fillerWords.some(filler => word.toLowerCase() === filler)
    );
    
    return {
      ...segment,
      isFillerWord: hasFillerWord
    };
  });
  
  const originalText = segments.map(s => s.text).join(" ");
  
  return {
    segments: markedSegments,
    originalText: originalText
  };
};

// Remove filler words from transcript
export const removeFillerWords = async (transcript: EditableTranscript): Promise<EditableTranscript> => {
  console.log("Removing filler words from transcript...");
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Filter out filler words
  const fillerWords = ["um", "uh", "like", "you know", "so,"];
  
  const cleanedSegments = transcript.segments.map(segment => {
    let text = segment.text;
    
    fillerWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      text = text.replace(regex, '');
      // Clean up double spaces
      text = text.replace(/\s+/g, ' ').trim();
    });
    
    return {
      ...segment,
      text: text
    };
  });
  
  const editedText = cleanedSegments.map(s => s.text).join(" ");
  
  return {
    segments: cleanedSegments,
    originalText: transcript.originalText,
    editedText: editedText
  };
};

// Generate AI title suggestion
export const generateAutoTitle = async (transcription: string): Promise<string> => {
  console.log("Generating auto title...");
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Simple mock function to generate a title
  const possibleTitles = [
    "Team Update: Q3 Roadmap Discussion",
    "Product Feature Rollout Planning",
    "Quarterly Objectives Review",
    "Development Team Sync-up",
    "Project Status and Next Steps"
  ];
  
  return possibleTitles[Math.floor(Math.random() * possibleTitles.length)];
};

// Process variables in transcript
export const processVariables = async (text: string, variables: { [key: string]: string }): Promise<string> => {
  console.log("Processing variables in transcript...");
  
  let processedText = text;
  
  // Replace all variables in format {{variable_name}}
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    processedText = processedText.replace(regex, value);
  });
  
  return processedText;
};

// Simulate searching videos based on search term
export const searchRecordings = (recordings: Recording[], searchTerm: string): Recording[] => {
  if (!searchTerm.trim()) return recordings;
  
  const term = searchTerm.toLowerCase();
  
  return recordings.filter(rec => {
    // Search in title, description
    if (rec.title.toLowerCase().includes(term) || 
        (rec.description && rec.description.toLowerCase().includes(term))) {
      return true;
    }
    
    // Search in transcription
    if (rec.transcription && rec.transcription.toLowerCase().includes(term)) {
      return true;
    }
    
    // Search in tags
    if (rec.tags && rec.tags.some(tag => tag.toLowerCase().includes(term))) {
      return true;
    }
    
    // Search in topics
    if (rec.topics && rec.topics.some(topic => topic.toLowerCase().includes(term))) {
      return true;
    }
    
    return false;
  });
};
