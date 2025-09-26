import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Volume2, VolumeX, Maximize2, X } from 'lucide-react';

interface VideoPlayerProps {
  title: string;
  description?: string;
  thumbnailUrl: string;
  videoId: string; // YouTube video ID
  category: string;
  duration?: string;
  onClose?: () => void;
  autoplay?: boolean;
  isModal?: boolean;
}

export default function VideoPlayer({
  title,
  description,
  thumbnailUrl,
  videoId,
  category,
  duration,
  onClose,
  autoplay = false,
  isModal = false
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const handlePlay = () => {
    setShowVideo(true);
    setIsPlaying(true);
  };

  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'meditation': return 'bg-kawaii-green text-white';
      case 'anxiety': return 'bg-kawaii-blue text-white';
      case 'depression': return 'bg-kawaii-purple text-white';
      case 'motivation': return 'bg-kawaii-yellow text-gray-800';
      case 'breathing': return 'bg-kawaii-pink text-white';
      default: return 'bg-primary text-primary-foreground';
    }
  };

  if (isModal && showVideo) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
        <div className="w-full max-w-4xl bg-card rounded-lg overflow-hidden card-anime">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-semibold">{title}</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowVideo(false);
                setIsPlaying(false);
                onClose?.();
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="video-container">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&rel=0`}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
          {description && (
            <div className="p-4">
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className="card-anime overflow-hidden group">
      <div className="relative">
        {!showVideo ? (
          <>
            <img
              src={thumbnailUrl}
              alt={title}
              className="w-full aspect-video object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <Button
              onClick={handlePlay}
              className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-white/90 hover:bg-white text-primary hover:text-primary-glow transition-all duration-300 hover:scale-110 glow-primary"
            >
              <Play className="w-6 h-6 ml-1" />
            </Button>
            {duration && (
              <Badge className="absolute bottom-2 right-2 bg-black/70 text-white">
                {duration}
              </Badge>
            )}
            <Badge className={`absolute top-2 left-2 ${getCategoryColor(category)}`}>
              {category}
            </Badge>
          </>
        ) : (
          <div className="video-container">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&rel=0`}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-sm mb-1 line-clamp-2">{title}</h3>
        {description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
            {description}
          </p>
        )}
        <div className="flex justify-between items-center">
          <Badge variant="outline" className={getCategoryColor(category)}>
            {category}
          </Badge>
          {duration && (
            <span className="text-xs text-muted-foreground">{duration}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}