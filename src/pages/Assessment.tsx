import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAssessment } from '@/hooks/useAssessment';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Sparkles, ChevronLeft, ChevronRight, Home, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const LIKERT_OPTIONS = [
  { value: 1, label: 'Strongly Disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly Agree' },
];

export default function Assessment() {
  const { user, isLoading: authLoading } = useAuth();
  const { 
    progress, 
    currentQuestion, 
    currentAnswer,
    totalQuestions, 
    isComplete,
    answerQuestion, 
    goToQuestion,
    completeAssessment,
    startAssessment,
    isLoading: assessmentLoading 
  } = useAssessment();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    // Start assessment if not in progress
    if (!assessmentLoading && user && !progress) {
      startAssessment();
    }
  }, [assessmentLoading, user, progress, startAssessment]);

  if (authLoading || assessmentLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !progress || !currentQuestion) return null;

  const currentIndex = progress.currentQuestionIndex;
  const answeredCount = progress.answers.length;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const progressPercentage = ((currentIndex + 1) / totalQuestions) * 100;

  const handleAnswer = (value: number) => {
    answerQuestion(currentQuestion.id, value);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      goToQuestion(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      goToQuestion(currentIndex + 1);
    }
  };

  const handleComplete = () => {
    completeAssessment();
    navigate('/results');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <span className="font-medium text-sm text-foreground">Assessment</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            <Home className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-card/30 border-b border-border/30 px-4 py-3">
        <div className="container mx-auto max-w-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">
              Question {currentIndex + 1} of {totalQuestions}
            </span>
            <span className="text-xs font-medium text-primary">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl flex flex-col justify-center">
        <Card className="border-border/50 shadow-lg animate-slide-in" key={currentQuestion.id}>
          <CardContent className="pt-8 pb-6">
            <p className="text-lg md:text-xl text-foreground text-center leading-relaxed mb-8 px-2">
              "{currentQuestion.text}"
            </p>

            <div className="space-y-3">
              {LIKERT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className={cn(
                    "w-full p-4 rounded-xl border-2 text-left transition-all duration-200",
                    "hover:border-primary/50 hover:bg-primary/5",
                    "focus:outline-none focus:ring-2 focus:ring-primary/30",
                    currentAnswer === option.value
                      ? "border-primary bg-primary/10 text-primary font-medium"
                      : "border-border bg-card text-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                      currentAnswer === option.value
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/30"
                    )}>
                      {currentAnswer === option.value && (
                        <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                      )}
                    </div>
                    <span className="text-sm md:text-base">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          {isLastQuestion && isComplete ? (
            <Button onClick={handleComplete} className="px-8">
              Submit Assessment
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={handleNext}
              disabled={!currentAnswer || isLastQuestion}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>

        {/* Answer indicator */}
        <p className="text-center text-sm text-muted-foreground mt-4">
          {answeredCount} of {totalQuestions} questions answered
        </p>
      </main>
    </div>
  );
}
