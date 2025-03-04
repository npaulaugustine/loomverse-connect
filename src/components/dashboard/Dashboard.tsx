
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Camera, 
  MonitorPlay, 
  TrendingUp, 
  BarChart, 
  Clock, 
  Calendar, 
  Video, 
  Tag,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Recording } from '@/components/recording/types';
import { getUserInsights } from '@/services/analytics-service';
import VideoTags from '@/components/video/VideoTags';

interface DashboardProps {
  recordings: Recording[];
}

const Dashboard: React.FC<DashboardProps> = ({ recordings }) => {
  const [userInsights, setUserInsights] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadInsights = async () => {
      if (recordings.length > 0) {
        setIsLoading(true);
        try {
          const insights = await getUserInsights(recordings);
          setUserInsights(insights);
        } catch (error) {
          console.error('Error loading insights:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    
    loadInsights();
  }, [recordings]);
  
  // Get recent recordings (last 5)
  const recentRecordings = [...recordings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  
  // Get popular recordings (by views)
  const popularRecordings = [...recordings]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);
  
  // Calculate total stats
  const totalViews = recordings.reduce((sum, rec) => sum + rec.views, 0);
  const totalDuration = recordings.reduce((sum, rec) => sum + rec.duration, 0);
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} mins`;
  };
  
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recordings</CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recordings.length}</div>
            <p className="text-xs text-muted-foreground">
              videos in your library
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <MonitorPlay className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews}</div>
            <p className="text-xs text-muted-foreground">
              across all recordings
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDuration(totalDuration)}</div>
            <p className="text-xs text-muted-foreground">
              of recorded content
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* AI Insights */}
      {userInsights && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              AI-Powered Insights
            </CardTitle>
            <CardDescription>
              Based on your recording patterns and viewer engagement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userInsights.recommendedTopics.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Recommended Topics</h3>
                  <VideoTags tags={userInsights.recommendedTopics} className="mb-2" />
                  <p className="text-xs text-muted-foreground">
                    Topics likely to drive engagement with your audience
                  </p>
                </div>
              )}
              
              {userInsights.topWatchedTopics.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Most Engaging Topics</h3>
                  <VideoTags tags={userInsights.topWatchedTopics} className="mb-2" />
                  <p className="text-xs text-muted-foreground">
                    Your most-watched content categories
                  </p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button variant="outline" className="w-full" size="sm">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Detailed Analytics
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {/* Recordings Lists */}
      <Tabs defaultValue="recent" className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="recent" className="flex-1">
            <Calendar className="h-4 w-4 mr-2" />
            Recent Recordings
          </TabsTrigger>
          <TabsTrigger value="popular" className="flex-1">
            <BarChart className="h-4 w-4 mr-2" />
            Popular Recordings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="recent">
          {recentRecordings.length > 0 ? (
            <div className="space-y-2">
              {recentRecordings.map(recording => (
                <Link key={recording.id} to={`/recording/${recording.id}`}>
                  <Card className="hover:bg-muted/50 transition-colors">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="h-16 w-24 bg-muted rounded-md flex items-center justify-center overflow-hidden flex-shrink-0">
                        {recording.thumbnail ? (
                          <img src={recording.thumbnail} alt={recording.title} className="w-full h-full object-cover" />
                        ) : (
                          <Video className="h-8 w-8 text-muted-foreground/50" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm mb-1 truncate">{recording.title}</h3>
                        {recording.tags && recording.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-1">
                            {recording.tags.map(tag => (
                              <span 
                                key={tag}
                                className="inline-flex items-center gap-0.5 bg-muted px-1.5 py-0.5 rounded-full text-xs text-muted-foreground"
                              >
                                <Tag className="h-2.5 w-2.5" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground">
                          {new Date(recording.createdAt).toLocaleDateString()} • {recording.views} views
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="bg-muted/50">
              <CardContent className="p-8 text-center">
                <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="font-medium mb-2">No recordings yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start by creating your first video recording
                </p>
                <Link to="/record">
                  <Button>Create Recording</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="popular">
          {popularRecordings.length > 0 ? (
            <div className="space-y-2">
              {popularRecordings.map(recording => (
                <Link key={recording.id} to={`/recording/${recording.id}`}>
                  <Card className="hover:bg-muted/50 transition-colors">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="h-16 w-24 bg-muted rounded-md flex items-center justify-center overflow-hidden flex-shrink-0">
                        {recording.thumbnail ? (
                          <img src={recording.thumbnail} alt={recording.title} className="w-full h-full object-cover" />
                        ) : (
                          <Video className="h-8 w-8 text-muted-foreground/50" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm mb-1 truncate">{recording.title}</h3>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {recording.views} views
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Created {new Date(recording.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="bg-muted/50">
              <CardContent className="p-8 text-center">
                <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="font-medium mb-2">No popular recordings yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Share your recordings to start getting views
                </p>
                <Link to="/record">
                  <Button>Create Recording</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
