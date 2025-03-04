
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Eye, TrendingUp, LineChart as LineChartIcon, BarChart as BarChartIcon, Zap, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getVideoEngagement, getContentInsights, suggestImprovements } from '@/services/analytics-service';
import { Recording } from '@/components/recording/types';

interface VideoAnalyticsProps {
  recording: Recording;
}

const VideoAnalytics: React.FC<VideoAnalyticsProps> = ({ recording }) => {
  const [engagement, setEngagement] = useState<any | null>(null);
  const [insights, setInsights] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      setIsLoading(true);
      try {
        const engagementData = await getVideoEngagement(recording.id);
        const contentInsights = await getContentInsights(recording);
        const improvementSuggestions = await suggestImprovements(recording);
        
        setEngagement(engagementData);
        setInsights(contentInsights);
        setSuggestions(improvementSuggestions);
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAnalytics();
  }, [recording]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10 text-muted-foreground">
        <LineChartIcon className="h-6 w-6 animate-pulse mr-2" />
        <span>Loading analytics...</span>
      </div>
    );
  }

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="overview">
          <Eye className="h-4 w-4 mr-2" />
          Overview
        </TabsTrigger>
        <TabsTrigger value="engagement">
          <TrendingUp className="h-4 w-4 mr-2" />
          Engagement
        </TabsTrigger>
        <TabsTrigger value="insights">
          <Lightbulb className="h-4 w-4 mr-2" />
          AI Insights
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Performance Summary</CardTitle>
            <CardDescription>Key metrics for this recording</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <p className="text-muted-foreground text-sm mb-1">View Time</p>
                <p className="text-3xl font-bold">{engagement?.viewTimePercentage}%</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <p className="text-muted-foreground text-sm mb-1">Avg. Watch Time</p>
                <p className="text-3xl font-bold">{engagement?.averageWatchTime}s</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Views Over Time</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[
                  { day: 'Mon', views: Math.floor(Math.random() * 10) },
                  { day: 'Tue', views: Math.floor(Math.random() * 10) },
                  { day: 'Wed', views: Math.floor(Math.random() * 10) },
                  { day: 'Thu', views: Math.floor(Math.random() * 10) },
                  { day: 'Fri', views: Math.floor(Math.random() * 10) },
                  { day: 'Sat', views: Math.floor(Math.random() * 10) },
                  { day: 'Sun', views: Math.floor(Math.random() * 10) },
                ]}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="engagement" className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Viewer Retention</CardTitle>
            <CardDescription>Where viewers drop off</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={engagement?.dropOffPoints.map((point: any) => ({
                  timestamp: `${point.timestamp}s`,
                  viewers: 100 - point.dropPercentage,
                }))}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="viewers" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Interest Points</CardTitle>
            <CardDescription>Moments of highest engagement</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={engagement?.peakInterestPoints.map((point: any) => ({
                  timestamp: `${point.timestamp}s`,
                  interest: point.interestLevel,
                }))}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="interest" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="insights" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              AI-Generated Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{insights}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Suggested Improvements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {suggestions?.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="mt-1 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-muted-foreground">{suggestion}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">
              Generate More Suggestions
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default VideoAnalytics;
