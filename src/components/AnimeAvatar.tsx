import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AnimeAvatarProps {
  name: string;
  mood?: 'happy' | 'sad' | 'neutral' | 'excited' | 'calm';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showMoodBadge?: boolean;
  className?: string;
  imageUrl?: string;
  isOnline?: boolean;
}

export default function AnimeAvatar({ 
  name, 
  mood = 'neutral', 
  size = 'md', 
  showMoodBadge = false,
  className,
  imageUrl,
  isOnline
}: AnimeAvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24'
  };

  const getMoodEmoji = (m: string) => {
    switch (m) {
      case 'happy': return '😊';
      case 'sad': return '😢';
      case 'excited': return '🤗';
      case 'calm': return '😌';
      default: return '😐';
    }
  };

  const getMoodColor = (m: string) => {
    switch (m) {
      case 'happy': return 'bg-kawaii-green';
      case 'sad': return 'bg-kawaii-blue';
      case 'excited': return 'bg-kawaii-yellow';
      case 'calm': return 'bg-kawaii-purple';
      default: return 'bg-muted';
    }
  };

  const generateKawaiiAvatar = (name: string) => {
    // Generate a kawaii-style avatar URL based on name
    const colors = ['ff6b9d', '4ecdc4', 'ffd93d', 'b4a7d6', 'ff8a80'];
    const color = colors[name.length % colors.length];
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${color}&color=fff&size=200&format=svg&bold=true&rounded=true`;
  };

  return (
    <div className={cn("relative inline-block", className)}>
      <Avatar className={cn(
        sizeClasses[size], 
        "ring-2 ring-primary/20 ring-offset-2 transition-all duration-300 hover:ring-primary/40 hover:scale-105",
        "shadow-kawaii"
      )}>
        <AvatarImage 
          src={imageUrl || generateKawaiiAvatar(name)} 
          alt={name}
          className="object-cover"
        />
        <AvatarFallback className="bg-gradient-primary text-primary-foreground font-bold text-lg">
          {name.split(' ').map(n => n[0]).join('').toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      {/* Online status indicator */}
      {isOnline !== undefined && (
        <div className={cn(
          "absolute -bottom-1 -right-1 w-4 h-4 rounded-full ring-2 ring-background",
          isOnline ? "bg-success animate-pulse" : "bg-muted"
        )} />
      )}

      {/* Mood badge */}
      {showMoodBadge && (
        <Badge 
          className={cn(
            "absolute -top-1 -right-1 text-xs px-1 py-0 min-w-6 h-6 flex items-center justify-center rounded-full animate-bounce-gentle",
            getMoodColor(mood)
          )}
          variant="secondary"
        >
          {getMoodEmoji(mood)}
        </Badge>
      )}
    </div>
  );
}