import { StrengthScore } from '@/types/strengths';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DOMAIN_COLORS, DOMAIN_LABELS } from '@/data/strengths';

interface TopStrengthsReportProps {
  scores: StrengthScore[];
}

export function TopStrengthsReport({ scores }: TopStrengthsReportProps) {
  const top5 = scores.slice(0, 5);
  const remaining = scores.slice(5);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Detailed Report</h2>

      {/* Top 5 Detailed */}
      {top5.map((s, i) => {
        const colors = DOMAIN_COLORS[s.strength.domain];
        return (
          <Card key={s.strengthId} className="overflow-hidden">
            <div className={`h-2 ${colors.bg}`} />
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <span className="text-3xl font-bold text-primary">#{i + 1}</span>
                <div>
                  <span className="text-xl">{s.strength.name}</span>
                  <span className={`ml-2 text-sm ${colors.text}`}>
                    {DOMAIN_LABELS[s.strength.domain]}
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-1">What it means</h4>
                <p className="text-sm text-muted-foreground">{s.strength.description}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Key Behaviors</h4>
                <ul className="text-sm text-muted-foreground list-disc list-inside">
                  {s.strength.keyBehaviors.map((b, j) => <li key={j}>{b}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Strengths in Action</h4>
                <p className="text-sm text-muted-foreground">{s.strength.inAction}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Blind Spots</h4>
                <p className="text-sm text-muted-foreground">{s.strength.blindSpots}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Tips</h4>
                <ul className="text-sm text-muted-foreground list-disc list-inside">
                  {s.strength.tips.map((t, j) => <li key={j}>{t}</li>)}
                </ul>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Remaining 29 Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Other Strengths (6-34)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2">
            {remaining.map(s => (
              <div key={s.strengthId} className="flex items-center gap-2 p-2 rounded bg-muted/50">
                <span className="text-sm font-medium w-6">#{s.rank}</span>
                <span className="text-sm">{s.strength.name}</span>
                <span className="text-xs text-muted-foreground ml-auto">{s.score}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
