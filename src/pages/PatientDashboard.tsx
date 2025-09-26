import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import PHQ9Questionnaire from '@/components/questionnaires/PHQ9Questionnaire';
import GAD7Questionnaire from '@/components/questionnaires/GAD7Questionnaire';
import CounselorBooking from '@/components/CounselorBooking';
import EmergencyToolkit from '@/components/EmergencyToolkit';
import WellnessGames from '@/components/WellnessGames';
import HealthFacts from '@/components/HealthFacts';
import ResourceVideos from '@/components/ResourceVideos';
import ChatSessions from '@/components/ChatSessions';
import FeedbackForm from '@/components/FeedbackForm';
import AnimeAvatar from '@/components/AnimeAvatar';
import MentalHealthVideos from '@/components/MentalHealthVideos';
import { 
  Brain, 
  Calendar, 
  TrendingUp, 
  Heart, 
  MessageCircle, 
  BookOpen, 
  Video,
  LogOut,
  Lightbulb,
  Smile,
  Shield,
  Gamepad2,
  Stethoscope,
  Sparkles,
  Star
} from 'lucide-react';
import JournalEntries from '@/components/JournalEntries';
import DailyInspiration from '@/components/DailyInspiration';
import { toast } from '@/hooks/use-toast';
import animeMascot from '@/assets/anime-hero-mascot.jpg';
import animeBgPattern from '@/assets/anime-bg-pattern.jpg';

interface AssessmentScore {
  questionnaire_type: string;
  total_score: number;
  severity_level: string;
  completed_at: string;
}

export default function PatientDashboard() {
  const { user, profile, signOut } = useAuth();
  const [showPHQ9, setShowPHQ9] = useState(false);
  const [showGAD7, setShowGAD7] = useState(false);
  const [journalEntry, setJournalEntry] = useState('');
  const [moodRating, setMoodRating] = useState<number | null>(null);
  const [assessmentScores, setAssessmentScores] = useState<AssessmentScore[]>([]);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    fetchAssessmentScores();
    checkForInitialAssessment();
  }, [user]);

  const checkForInitialAssessment = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('questionnaire_responses')
      .select('questionnaire_type')
      .eq('user_id', user.id);

    const hasCompletedPHQ9 = data?.some(d => d.questionnaire_type === 'PHQ9');
    const hasCompletedGAD7 = data?.some(d => d.questionnaire_type === 'GAD7');

    if (!hasCompletedPHQ9 || !hasCompletedGAD7) {
      setShowWelcomeModal(true);
    }
  };

  const fetchAssessmentScores = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('questionnaire_responses')
      .select('questionnaire_type, total_score, severity_level, completed_at')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching assessments:', error);
    } else {
      setAssessmentScores(data || []);
    }
  };

  const saveJournalEntry = async () => {
    if (!journalEntry.trim() || !user) return;

    try {
      const { error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          content: journalEntry,
          mood_rating: moodRating
        });

      if (error) throw error;

      toast({
        title: "Journal entry saved",
        description: "Your thoughts have been recorded.",
      });

      setJournalEntry('');
      setMoodRating(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to save journal entry.",
        variant: "destructive",
      });
    }
  };

  const getMoodEmoji = (rating: number) => {
    if (rating <= 2) return '😢';
    if (rating <= 4) return '😔';
    if (rating <= 6) return '😐';
    if (rating <= 8) return '🙂';
    return '😊';
  };

  const getLatestScores = () => {
    const phq9 = assessmentScores.find(s => s.questionnaire_type === 'PHQ9');
    const gad7 = assessmentScores.find(s => s.questionnaire_type === 'GAD7');
    return { phq9, gad7 };
  };

  const { phq9, gad7 } = getLatestScores();

  if (showPHQ9) {
    return (
      <PHQ9Questionnaire
        onComplete={(score, severity) => {
          setShowPHQ9(false);
          fetchAssessmentScores();
        }}
        onClose={() => setShowPHQ9(false)}
      />
    );
  }

  if (showGAD7) {
    return (
      <GAD7Questionnaire
        onComplete={(score, severity) => {
          setShowGAD7(false);
          fetchAssessmentScores();
        }}
        onClose={() => setShowGAD7(false)}
      />
    );
  }

  return (
    <div className="min-h-screen anime-page" style={{
      backgroundImage: `url(${animeBgPattern})`,
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed'
    }}>
      {/* Welcome Modal */}
      {showWelcomeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md card-anime fade-in-up">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <img src={animeMascot} alt="Kawaii Mascot" className="w-24 h-24 mx-auto rounded-full floating-animation" />
              </div>
              <CardTitle className="flex items-center justify-center gap-2 text-gradient">
                <Sparkles className="w-6 h-6" />
                Welcome to MindWell! ✨
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-muted-foreground">
                Let's start with a quick assessment to understand your mental wellness better! 
                Don't worry, I'll be here to support you every step of the way! 💕
              </p>
              <div className="space-y-2">
                <Button 
                  onClick={() => {
                    setShowWelcomeModal(false);
                    setShowPHQ9(true);
                  }}
                  className="w-full kawaii-button hover:animate-wiggle"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Start Depression Assessment
                </Button>
                <Button 
                  onClick={() => {
                    setShowWelcomeModal(false);
                    setShowGAD7(true);
                  }}
                  variant="outline"
                  className="w-full border-kawaii-blue hover:bg-kawaii-blue hover:text-white"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Start Anxiety Assessment
                </Button>
              </div>
              <Button 
                onClick={() => setShowWelcomeModal(false)}
                variant="ghost"
                className="w-full text-sm hover:bg-kawaii-pink/20"
              >
                Skip for now (´∀｀)
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Anime Hero Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-90" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="floating-animation">
                <img src={animeMascot} alt="MindWell Mascot" className="w-16 h-16 rounded-full shadow-kawaii" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  MindWell ✨
                </h1>
                <p className="text-white/90">Your kawaii mental health companion!</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <AnimeAvatar 
                name={profile?.full_name || user?.email || 'Student'}
                size="lg"
                showMoodBadge={true}
                mood="happy"
                isOnline={true}
              />
              <div className="text-right text-white">
                <p className="font-semibold">
                  Welcome back, {profile?.full_name?.split(' ')[0] || 'Student'}! (｡◕‿◕｡)
                </p>
                <Button onClick={signOut} variant="outline" size="sm" className="mt-2 border-white/30 text-white hover:bg-white/20">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid grid-cols-8 w-full bg-white/80 backdrop-blur-sm rounded-xl p-2">
            <TabsTrigger value="dashboard" className="kawaii-button text-xs">
              <Sparkles className="w-4 h-4 mr-1" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="videos" className="kawaii-button text-xs">
              <Video className="w-4 h-4 mr-1" />
              Videos
            </TabsTrigger>
            <TabsTrigger value="counselors" className="kawaii-button text-xs">
              <Stethoscope className="w-4 h-4 mr-1" />
              Counselors
            </TabsTrigger>
            <TabsTrigger value="resources" className="kawaii-button text-xs">
              <BookOpen className="w-4 h-4 mr-1" />
              Resources
            </TabsTrigger>
            <TabsTrigger value="chat" className="kawaii-button text-xs">
              <MessageCircle className="w-4 h-4 mr-1" />
              AI Friend
            </TabsTrigger>
            <TabsTrigger value="games" className="kawaii-button text-xs">
              <Gamepad2 className="w-4 h-4 mr-1" />
              Games
            </TabsTrigger>
            <TabsTrigger value="emergency" className="kawaii-button text-xs">
              <Shield className="w-4 h-4 mr-1" />
              Emergency
            </TabsTrigger>
            <TabsTrigger value="feedback" className="kawaii-button text-xs">
              <Heart className="w-4 h-4 mr-1" />
              Feedback
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6 fade-in-up">
            {/* Stats Cards with Anime Style */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="card-anime relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-kawaii-pink/20 rounded-full -mr-10 -mt-10" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Depression Assessment</CardTitle>
                  <div className="p-2 bg-kawaii-pink/20 rounded-full">
                    <Heart className="h-4 w-4 text-kawaii-pink animate-heartbeat" />
                  </div>
                </CardHeader>
                <CardContent>
                  {phq9 ? (
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-gradient">{phq9.total_score}/27</div>
                      <Badge 
                        variant={phq9.severity_level === 'Minimal' ? 'default' : 'destructive'}
                        className="animate-bounce-gentle"
                      >
                        {phq9.severity_level} ✨
                      </Badge>
                    </div>
                  ) : (
                    <Button onClick={() => setShowPHQ9(true)} size="sm" className="kawaii-button">
                      <Heart className="w-4 h-4 mr-2" />
                      Take Assessment
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card className="card-anime relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-kawaii-blue/20 rounded-full -mr-10 -mt-10" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Anxiety Assessment</CardTitle>
                  <div className="p-2 bg-kawaii-blue/20 rounded-full">
                    <Brain className="h-4 w-4 text-kawaii-blue animate-sparkle" />
                  </div>
                </CardHeader>
                <CardContent>
                  {gad7 ? (
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-gradient-secondary">{gad7.total_score}/21</div>
                      <Badge 
                        variant={gad7.severity_level === 'Minimal' ? 'default' : 'destructive'}
                        className="animate-bounce-gentle"
                      >
                        {gad7.severity_level} 💙
                      </Badge>
                    </div>
                  ) : (
                    <Button onClick={() => setShowGAD7(true)} size="sm" className="kawaii-button">
                      <Brain className="w-4 h-4 mr-2" />
                      Take Assessment
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card className="card-anime relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-kawaii-green/20 rounded-full -mr-10 -mt-10" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Weekly Progress</CardTitle>
                  <div className="p-2 bg-kawaii-green/20 rounded-full">
                    <TrendingUp className="h-4 w-4 text-kawaii-green animate-bounce-gentle" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold rainbow-text">Improving!</div>
                  <p className="text-xs text-muted-foreground">You're doing great! (◕‿◕)♡</p>
                </CardContent>
              </Card>
            </div>

            {/* Kawaii Mood Tracker */}
            <Card className="card-anime">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gradient">
                  <Smile className="w-5 h-5 animate-bounce-gentle" />
                  How are you feeling today? ♡(˃͈ દ ˂͈ ༶ )
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                    <Button
                      key={rating}
                      variant={moodRating === rating ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMoodRating(rating)}
                      className="w-12 h-12 text-2xl mood-button border-kawaii-pink/30 hover:border-kawaii-pink hover:shadow-kawaii"
                    >
                      {getMoodEmoji(rating)}
                    </Button>
                  ))}
                </div>
                {moodRating && (
                  <div className="text-center fade-in-up">
                    <p className="text-lg mb-2">
                      You selected: {getMoodEmoji(moodRating)} ({moodRating}/10)
                    </p>
                    <Badge className="bg-kawaii-pink text-white animate-sparkle">
                      Thanks for sharing! ✨
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Enhanced Journal with Anime Style */}
            <div className="fade-in-up">
              <JournalEntries />
            </div>

            {/* Daily Inspiration with Anime Twist */}
            <div className="fade-in-up">
              <DailyInspiration />
            </div>

            {/* Kawaii Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="card-anime cursor-pointer group" onClick={() => setShowPHQ9(true)}>
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <div className="p-4 bg-kawaii-pink/20 rounded-full mb-3 group-hover:animate-wiggle">
                    <Heart className="w-8 h-8 text-kawaii-pink" />
                  </div>
                  <h3 className="font-medium text-gradient">Retake PHQ-9</h3>
                  <p className="text-xs text-muted-foreground mt-1">Depression check ♡</p>
                </CardContent>
              </Card>
              
              <Card className="card-anime cursor-pointer group" onClick={() => setShowGAD7(true)}>
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <div className="p-4 bg-kawaii-blue/20 rounded-full mb-3 group-hover:animate-wiggle">
                    <Brain className="w-8 h-8 text-kawaii-blue" />
                  </div>
                  <h3 className="font-medium text-gradient-secondary">Retake GAD-7</h3>
                  <p className="text-xs text-muted-foreground mt-1">Anxiety check 💙</p>
                </CardContent>
              </Card>

              <Card className="card-anime cursor-pointer group">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <div className="p-4 bg-kawaii-green/20 rounded-full mb-3 group-hover:animate-wiggle">
                    <Shield className="w-8 h-8 text-kawaii-green" />
                  </div>
                  <h3 className="font-medium text-gradient">Coping Tools</h3>
                  <p className="text-xs text-muted-foreground mt-1">Stay strong! 💚</p>
                </CardContent>
              </Card>

              <Card className="card-anime cursor-pointer group">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <div className="p-4 bg-kawaii-yellow/20 rounded-full mb-3 group-hover:animate-wiggle">
                    <Lightbulb className="w-8 h-8 text-kawaii-yellow" />
                  </div>
                  <h3 className="font-medium rainbow-text">Daily Inspiration</h3>
                  <p className="text-xs text-muted-foreground mt-1">You got this! ✨</p>
                </CardContent>
              </Card>
            </div>

            {/* Embedded Components with Anime Style */}
            <div className="space-y-6 fade-in-up">
              <WellnessGames />
              <HealthFacts />
            </div>
          </TabsContent>

          <TabsContent value="videos" className="fade-in-up">
            <MentalHealthVideos />
          </TabsContent>

          <TabsContent value="counselors" className="fade-in-up">
            <CounselorBooking />
          </TabsContent>

          <TabsContent value="resources" className="fade-in-up">
            <ResourceVideos />
          </TabsContent>

          <TabsContent value="chat" className="fade-in-up">
            <ChatSessions />
          </TabsContent>

          <TabsContent value="games" className="fade-in-up">
            <WellnessGames />
          </TabsContent>

          <TabsContent value="emergency" className="fade-in-up">
            <EmergencyToolkit />
          </TabsContent>

          <TabsContent value="feedback" className="fade-in-up">
            <FeedbackForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}