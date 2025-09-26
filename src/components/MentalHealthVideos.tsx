import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import VideoPlayer from './VideoPlayer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Heart, Brain, Wind, Star, Sparkles } from 'lucide-react';

const mentalHealthVideos = [
  {
    id: 'meditation-1',
    title: '5-Minute Morning Meditation for Students',
    description: 'Start your day with calm and focus. Perfect for busy student schedules.',
    category: 'Meditation',
    duration: '5:32',
    videoId: 'O-6f5wQXSu8', // Example YouTube ID
    thumbnailUrl: 'https://img.youtube.com/vi/O-6f5wQXSu8/maxresdefault.jpg',
    views: '2.1K',
    featured: true
  },
  {
    id: 'anxiety-2',
    title: 'Managing Test Anxiety - Quick Techniques',
    description: 'Learn effective strategies to calm your nerves before exams.',
    category: 'Anxiety',
    duration: '7:45',
    videoId: 'YQIqgxeNtl0',
    thumbnailUrl: 'https://img.youtube.com/vi/YQIqgxeNtl0/maxresdefault.jpg',
    views: '5.8K'
  },
  {
    id: 'breathing-3',
    title: 'Box Breathing for Instant Calm',
    description: 'Simple breathing technique you can use anywhere, anytime.',
    category: 'Breathing',
    duration: '3:20',
    videoId: 'GZzhk9jEkkI',
    thumbnailUrl: 'https://img.youtube.com/vi/GZzhk9jEkkI/maxresdefault.jpg',
    views: '12.3K',
    featured: true
  },
  {
    id: 'motivation-4',
    title: 'Daily Affirmations for Self-Love',
    description: 'Boost your confidence with these powerful daily affirmations.',
    category: 'Motivation',
    duration: '6:15',
    videoId: '4pLUleLdwY4',
    thumbnailUrl: 'https://img.youtube.com/vi/4pLUleLdwY4/maxresdefault.jpg',
    views: '8.7K'
  },
  {
    id: 'depression-5',
    title: 'Understanding Depression: You Are Not Alone',
    description: 'Educational content about depression and finding support.',
    category: 'Depression',
    duration: '12:30',
    videoId: 'z-IR48Mb3W0',
    thumbnailUrl: 'https://img.youtube.com/vi/z-IR48Mb3W0/maxresdefault.jpg',
    views: '15.2K'
  },
  {
    id: 'sleep-6',
    title: 'Better Sleep for Better Mental Health',
    description: 'Tips and techniques for improving your sleep quality.',
    category: 'Sleep',
    duration: '9:18',
    videoId: 'nm1TxQj9IsQ',
    thumbnailUrl: 'https://img.youtube.com/vi/nm1TxQj9IsQ/maxresdefault.jpg',
    views: '6.4K',
    featured: true
  }
];

const categories = ['All', 'Meditation', 'Anxiety', 'Breathing', 'Motivation', 'Depression', 'Sleep'];

export default function MentalHealthVideos() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [playingVideo, setPlayingVideo] = useState<typeof mentalHealthVideos[0] | null>(null);

  const filteredVideos = selectedCategory === 'All' 
    ? mentalHealthVideos 
    : mentalHealthVideos.filter(video => video.category === selectedCategory);

  const featuredVideos = mentalHealthVideos.filter(video => video.featured);

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'meditation': return <Brain className="w-4 h-4" />;
      case 'anxiety': return <Heart className="w-4 h-4" />;
      case 'breathing': return <Wind className="w-4 h-4" />;
      case 'motivation': return <Star className="w-4 h-4" />;
      case 'depression': return <Heart className="w-4 h-4" />;
      case 'sleep': return <Sparkles className="w-4 h-4" />;
      default: return <Play className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'meditation': return 'hover:bg-kawaii-green hover:text-white';
      case 'anxiety': return 'hover:bg-kawaii-blue hover:text-white';
      case 'breathing': return 'hover:bg-kawaii-pink hover:text-white';
      case 'motivation': return 'hover:bg-kawaii-yellow hover:text-gray-800';
      case 'depression': return 'hover:bg-kawaii-purple hover:text-white';
      case 'sleep': return 'hover:bg-secondary hover:text-white';
      default: return 'hover:bg-primary hover:text-primary-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="card-anime">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gradient">
            <Play className="w-6 h-6" />
            Mental Wellness Videos
            <Badge className="ml-2 animate-sparkle bg-kawaii-pink">New!</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="featured" className="space-y-4">
            <TabsList className="grid grid-cols-2 w-full max-w-md">
              <TabsTrigger value="featured" className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                Featured
              </TabsTrigger>
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                All Videos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="featured" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredVideos.map((video) => (
                  <div key={video.id} className="relative group">
                    <VideoPlayer
                      title={video.title}
                      description={video.description}
                      thumbnailUrl={video.thumbnailUrl}
                      videoId={video.videoId}
                      category={video.category}
                      duration={video.duration}
                      onClose={() => setPlayingVideo(null)}
                      isModal={true}
                    />
                    <Badge className="absolute -top-2 -right-2 bg-kawaii-yellow text-gray-800 animate-bounce-gentle">
                      ⭐ Featured
                    </Badge>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="all" className="space-y-4">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={`transition-all duration-300 ${getCategoryColor(category)}`}
                  >
                    {getCategoryIcon(category)}
                    <span className="ml-1">{category}</span>
                  </Button>
                ))}
              </div>

              {/* Videos Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredVideos.map((video) => (
                  <VideoPlayer
                    key={video.id}
                    title={video.title}
                    description={video.description}
                    thumbnailUrl={video.thumbnailUrl}
                    videoId={video.videoId}
                    category={video.category}
                    duration={video.duration}
                    onClose={() => setPlayingVideo(null)}
                    isModal={true}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Modal for playing video */}
      {playingVideo && (
        <VideoPlayer
          title={playingVideo.title}
          description={playingVideo.description}
          thumbnailUrl={playingVideo.thumbnailUrl}
          videoId={playingVideo.videoId}
          category={playingVideo.category}
          duration={playingVideo.duration}
          onClose={() => setPlayingVideo(null)}
          autoplay={true}
          isModal={true}
        />
      )}
    </div>
  );
}