import { useEffect, useRef, useState } from 'react';
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
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function Results() {
  const { user, isLoading: authLoading } = useAuth();
  const { results, resetAssessment, isLoading: assessmentLoading } = useAssessment();
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

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

  const handleDownloadPDF = async () => {
    if (isExporting) return;
    
    setIsExporting(true);
    try {
      if (contentRef.current) {
        const element = contentRef.current;
        
        // Wait for content to be fully rendered
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const margin = 10;
        const headerHeight = 18;
        const usableWidth = pdfWidth - (margin * 2);
        
        // Find all exportable components (Cards and major sections)
        const exportableBlocks = element.querySelectorAll(':scope > .text-center, :scope > [class*="Card"], :scope > div > [class*="Card"], :scope > .space-y-6, :scope > .space-y-6 > [class*="Card"]');
        
        // Flatten to unique card elements
        const allCards: Element[] = [];
        
        // Add title section
        const titleSection = element.querySelector(':scope > .text-center');
        if (titleSection) allCards.push(titleSection);
        
        // Add all direct Cards in main content
        element.querySelectorAll(':scope > [class*="Card"]').forEach(card => {
          if (!allCards.includes(card)) allCards.push(card);
        });
        
        // Add cards from TopStrengthsReport (inside .space-y-6)
        const detailedSection = element.querySelector(':scope > .space-y-6');
        if (detailedSection) {
          // Add the h2 heading
          const heading = detailedSection.querySelector(':scope > h2');
          if (heading) allCards.push(heading);
          
          // Add each card
          detailedSection.querySelectorAll(':scope > [class*="Card"]').forEach(card => {
            allCards.push(card);
          });
        }
        
        let isFirstPage = true;
        
        for (let i = 0; i < allCards.length; i++) {
          const block = allCards[i] as HTMLElement;
          
          // Capture each block individually
          const canvas = await html2canvas(block, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
          });
          
          const imgWidth = usableWidth;
          const imgHeight = (canvas.height / canvas.width) * usableWidth;
          const imgData = canvas.toDataURL('image/png');
          
          if (!isFirstPage) {
            pdf.addPage();
          }
          
          let yOffset = margin;
          
          // Add header on first page only
          if (isFirstPage) {
            pdf.setFontSize(16);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(40, 40, 40);
            const headerText = `${user?.name || 'Your'}'s Final Results Strengths Report`;
            const textWidth = pdf.getTextWidth(headerText);
            pdf.text(headerText, (pdfWidth - textWidth) / 2, margin + 10);
            yOffset = margin + headerHeight;
            isFirstPage = false;
          }
          
          // Check if image fits on page, if not scale it down (but maintain aspect ratio)
          const availableHeight = pdfHeight - yOffset - margin;
          let finalWidth = imgWidth;
          let finalHeight = imgHeight;
          
          if (imgHeight > availableHeight) {
            const scale = availableHeight / imgHeight;
            finalWidth = imgWidth * scale;
            finalHeight = availableHeight;
          }
          
          // Center horizontally
          const xOffset = (pdfWidth - finalWidth) / 2;
          
          pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalWidth, finalHeight);
        }
        
        pdf.save(`${user?.name || 'Strengths'}_Final_Report.pdf`);
      } else {
        window.print();
      }
    } catch (error) {
      console.error('PDF export failed, falling back to print:', error);
      window.print();
    } finally {
      setIsExporting(false);
    }
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
            <Button variant="outline" size="sm" onClick={handleDownloadPDF} disabled={isExporting}>
              {isExporting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              PDF
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
              <Home className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main ref={contentRef} className="container mx-auto px-4 py-8 max-w-6xl bg-background">
        {/* Title */}
        <div className="text-center mb-8 animate-fade-in">
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
