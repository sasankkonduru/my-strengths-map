import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAssessment } from '@/hooks/useAssessment';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Play, RotateCcw, BarChart3, LogOut, Loader2 } from 'lucide-react';

export default function Dashboard() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const { hasInProgress, hasResults, progress, totalQuestions, startAssessment, resetAssessment, isLoading: assessmentLoading } = useAssessment();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || assessmentLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const handleStartNew = () => {
    if (hasInProgress || hasResults) {
      resetAssessment();
    }
    startAssessment();
    navigate('/assessment');
  };

  const handleContinue = () => {
    navigate('/assessment');
  };

  const handleViewResults = () => {
    navigate('/results');
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const progressPercentage = progress 
    ? Math.round((progress.answers.length / totalQuestions) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <span className="font-semibold text-foreground">Strengths Insight</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user.name}
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="animate-fade-in">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome, {user.name.split(' ')[0]}!
            </h1>
            <p className="text-muted-foreground">
              Discover your unique strengths profile through our comprehensive assessment.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Assessment Card */}
            <Card className="border-border/50 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="w-5 h-5 text-primary" />
                  Assessment
                </CardTitle>
                <CardDescription>
                  170 questions across 34 strengths
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {hasInProgress ? (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{progress?.answers.length} / {totalQuestions}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={handleContinue} className="flex-1">
                        Continue
                      </Button>
                      <Button variant="outline" onClick={handleStartNew}>
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <Button onClick={handleStartNew} className="w-full">
                    <Play className="w-4 h-4 mr-2" />
                    Start Assessment
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Results Card */}
            <Card className={`border-border/50 shadow-md ${hasResults ? 'hover:shadow-lg' : 'opacity-75'} transition-all`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Results
                </CardTitle>
                <CardDescription>
                  View your strengths profile and report
                </CardDescription>
              </CardHeader>
              <CardContent>
                {hasResults ? (
                  <Button onClick={handleViewResults} className="w-full">
                    View Results
                  </Button>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    Complete the assessment to view your results
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Info Section */}
          <Card className="mt-8 border-border/50 bg-accent/30">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-3">About the Assessment</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Answer each question honestly based on how you naturally behave</li>
                <li>• There are no right or wrong answers</li>
                <li>• The assessment takes approximately 30-45 minutes</li>
                <li>• Your progress is saved automatically</li>
                <li>• You'll receive a personalized report with your Top 5 strengths</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
