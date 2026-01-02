import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAssessment } from '@/hooks/useAssessment';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Home, Download, RotateCcw, Loader2 } from 'lucide-react';
import { DomainGrid } from '@/components/results/DomainGrid';
import { StrengthsChart } from '@/components/results/StrengthsChart';
import { TopStrengthsReport } from '@/components/results/TopStrengthsReport';
import { DOMAIN_LABELS } from '@/data/strengths';
import { Domain } from '@/types/strengths';

export default function Results() {
  const { user, isLoading: authLoading } = useAuth();
  const { results, resetAssessment, isLoading: assessmentLoading } = useAssessment();
  const navigate = useNavigate();
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!assessmentLoading && !results) {
      navigate('/dashboard');
    }
  }, [results, assessmentLoading, navigate]);

  if (authLoading || assessmentLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !results) return null;

  const top5 = results.scores.slice(0, 5);
  const top10 = results.scores.slice(0, 10);

  const handleDownloadPDF = () => {
    setIsPrinting(true);
    // Allow React to re-render with the print header visible
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  const handleRetake = () => {
    resetAssessment();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10 print:hidden">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <span className="font-medium text-foreground">Your Results</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
              <Home className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl bg-background">
        {/* Print-only header */}
        <h1 
          className="print-header hidden" 
          style={{ display: isPrinting ? 'block' : 'none' }}
        >
          {user.name}'s Final Results Strengths Report
        </h1>

        {/* Title */}
        <div className="text-center mb-8 animate-fade-in print-section">
          <h1 className="text-3xl font-bold text-foreground mb-2">{user.name}'s Strengths Report</h1>
          <p className="text-muted-foreground">Completed {new Date(results.completedAt).toLocaleDateString()}</p>
        </div>

        {/* Top 5 Summary */}
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-primary">Your Top 5 Strengths</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {top5.map((s, i) => (
                <div key={s.strengthId} className="flex items-center gap-2 bg-card px-4 py-2 rounded-lg border">
                  <span className="text-xl font-bold text-primary">#{i + 1}</span>
                  <span className="font-medium">{s.strength.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Domain Grid */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Strengths by Domain</CardTitle>
          </CardHeader>
          <CardContent>
            <DomainGrid scores={results.scores} top5Ids={top5.map(s => s.strengthId)} />
          </CardContent>
        </Card>

        {/* Domain Balance */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Domain Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(Object.keys(results.domainScores) as Domain[]).map(domain => (
                <div key={domain} className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold text-foreground">{results.domainScores[domain]}</p>
                  <p className="text-sm text-muted-foreground">{DOMAIN_LABELS[domain]}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>All 34 Strengths</CardTitle>
          </CardHeader>
          <CardContent>
            <StrengthsChart scores={results.scores} />
          </CardContent>
        </Card>

        {/* Detailed Report */}
        <TopStrengthsReport scores={results.scores} />

        {/* Disclaimer & Actions */}
        <div className="mt-8 text-center print:hidden">
          <Button variant="outline" onClick={handleRetake} className="mb-4">
            <RotateCcw className="w-4 h-4 mr-2" />
            Retake Assessment
          </Button>
          <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
            This is a strengths-based assessment inspired by psychology and is not an official Gallup CliftonStrengths® product.
          </p>
        </div>
      </main>
    </div>
  );
}
