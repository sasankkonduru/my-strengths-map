import { StrengthScore } from '@/types/strengths';
import { DOMAIN_COLORS } from '@/data/strengths';

interface StrengthsChartProps {
  scores: StrengthScore[];
}

export function StrengthsChart({ scores }: StrengthsChartProps) {
  const maxScore = 25;

  return (
    <div className="space-y-1 max-h-[600px] overflow-y-auto">
      {scores.map((s, index) => {
        const percentage = (s.score / maxScore) * 100;
        const colors = DOMAIN_COLORS[s.strength.domain];
        const isTop5 = index < 5;

        return (
          <div key={s.strengthId} className="flex items-center gap-2 py-1">
            <span className={`w-6 text-xs text-right ${isTop5 ? 'font-bold text-primary' : 'text-muted-foreground'}`}>
              {index + 1}
            </span>
            <span className="w-28 text-xs truncate font-medium">{s.strength.name}</span>
            <div className="flex-1 h-5 bg-muted rounded-sm overflow-hidden">
              <div
                className={`h-full ${colors.bg} transition-all duration-500`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="w-6 text-xs text-right font-medium">{s.score}</span>
          </div>
        );
      })}
    </div>
  );
}
