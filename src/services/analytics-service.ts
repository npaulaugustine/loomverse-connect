
import { Recording } from "@/components/recording/types";

/**
 * Analytics Service for video engagement and user insights
 * In a production app, this would use real analytics data.
 * For now, we'll simulate analytics based on recording data.
 */

export interface VideoEngagement {
  viewTimePercentage: number;
  dropOffPoints: { timestamp: number; dropPercentage: number }[];
  peakInterestPoints: { timestamp: number; interestLevel: number }[];
  averageWatchTime: number;
}

export interface UserInsights {
  topWatchedTopics: string[];
  watchTimeByDay: { day: string; minutes: number }[];
  recommendedTopics: string[];
  contentPreferences: { type: string; percentage: number }[];
}

// Generate mock engagement data for a video
export const getVideoEngagement = async (recordingId: string): Promise<VideoEngagement> => {
  console.log("Generating engagement data for recording:", recordingId);
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock engagement data
  return {
    viewTimePercentage: Math.floor(Math.random() * 100),
    dropOffPoints: [
      { timestamp: 15, dropPercentage: Math.floor(Math.random() * 20) },
      { timestamp: 45, dropPercentage: Math.floor(Math.random() * 30) },
      { timestamp: 90, dropPercentage: Math.floor(Math.random() * 25) }
    ],
    peakInterestPoints: [
      { timestamp: 30, interestLevel: Math.floor(Math.random() * 100) },
      { timestamp: 60, interestLevel: Math.floor(Math.random() * 100) },
      { timestamp: 120, interestLevel: Math.floor(Math.random() * 100) }
    ],
    averageWatchTime: Math.floor(Math.random() * 180)
  };
};

// Generate mock user insights based on their recordings
export const getUserInsights = async (recordings: Recording[]): Promise<UserInsights> => {
  console.log("Generating user insights from recordings:", recordings.length);
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Extract all unique topics from recordings
  const allTopics = recordings
    .flatMap(rec => rec.topics || [])
    .filter((value, index, self) => self.indexOf(value) === index);
  
  // Select random top topics
  const topWatchedTopics = allTopics
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(3, allTopics.length));
  
  // Generate random recommended topics
  const possibleRecommendations = [
    "Product Updates", "Customer Experience", "Design Systems", 
    "Technical Tutorials", "Quick Tips", "Market Analysis"
  ];
  
  const recommendedTopics = possibleRecommendations
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  
  // Generate mock content preferences
  const contentPreferences = [
    { type: "Tutorial", percentage: Math.floor(Math.random() * 100) },
    { type: "Team Update", percentage: Math.floor(Math.random() * 100) },
    { type: "Product Demo", percentage: Math.floor(Math.random() * 100) }
  ];
  
  // Generate watch time by day for the last 7 days
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const watchTimeByDay = days.map(day => ({
    day,
    minutes: Math.floor(Math.random() * 60)
  }));
  
  return {
    topWatchedTopics,
    watchTimeByDay,
    recommendedTopics,
    contentPreferences
  };
};

// Generate AI insights on content performance
export const getContentInsights = async (recording: Recording): Promise<string> => {
  console.log("Generating content insights for:", recording.title);
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Generate a random insight
  const possibleInsights = [
    `This video performed well with viewers, keeping their attention for an average of 85% of the duration. The section at 1:30 generated the most interest.`,
    `Consider keeping future videos under 3 minutes for optimal engagement. Videos with demonstrations have 40% higher retention rates than explanation-only content.`,
    `Topics related to "${recording.tags?.[0] || "this content"}" are trending among your viewers. Consider creating more content on this subject.`,
    `This video had a high drop-off rate at the 45-second mark. Consider making your introductions more concise in future videos.`,
    `This content resonated well with your audience, receiving 30% more views than your average video.`
  ];
  
  return possibleInsights[Math.floor(Math.random() * possibleInsights.length)];
};

// Suggest video improvements based on analytics
export const suggestImprovements = async (recording: Recording): Promise<string[]> => {
  console.log("Generating improvement suggestions for:", recording.title);
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Generate random suggestions
  const possibleSuggestions = [
    "Add a clear call-to-action at the end of the video",
    "Consider breaking longer content into shorter, more focused videos",
    "Include visual aids or demonstrations to increase engagement",
    "Start with the most important information to hook viewers",
    "Add timestamps to help viewers navigate to relevant sections",
    "Improve lighting and audio quality for better viewer experience",
    "Include a brief agenda at the beginning to set expectations"
  ];
  
  // Return 2-3 random suggestions
  const numSuggestions = Math.floor(Math.random() * 2) + 2;
  return possibleSuggestions
    .sort(() => Math.random() - 0.5)
    .slice(0, numSuggestions);
};
