import { StrengthScore, Domain } from '@/types/strengths';
import { DOMAIN_COLORS, DOMAIN_LABELS, getStrengthsByDomain } from '@/data/strengths';
import { cn } from '@/lib/utils';

interface DomainGridProps {
  scores: StrengthScore[];
  top5Ids: string[];
}

export function DomainGrid({ scores, top5Ids }: DomainGridProps) {
  const domains: Domain[] = ['executing', 'influencing', 'relationship', 'strategic'];

  const getScoreForStrength = (strengthId: string) => {
    return scores.find(s => s.strengthId === strengthId);
  };

  const getOpacity = (score: number) => {
    // Score range is 5-25, map to opacity 0.3-1
    const normalized = (score - 5) / 20;
    return 0.3 + normalized * 0.7;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {domains.map(domain => {
        const domainStrengths = getStrengthsByDomain(domain);
        const colors = DOMAIN_COLORS[domain];

        return (
          <div key={domain} className="space-y-2">
            <h3 className={cn("font-semibold text-sm text-center py-2 rounded-lg", colors.light, colors.text)}>
              {DOMAIN_LABELS[domain]}
            </h3>
            <div className="space-y-1">
              {domainStrengths.map(strength => {
                const scoreData = getScoreForStrength(strength.id);
                const isTop5 = top5Ids.includes(strength.id);

                return (
                  <div
                    key={strength.id}
                    className={cn(
                      "px-3 py-2 rounded-md text-xs font-medium transition-all",
                      colors.bg,
                      "text-white",
                      isTop5 && "ring-2 ring-offset-2 ring-primary"
                    )}
                    style={{ opacity: scoreData ? getOpacity(scoreData.score) : 0.5 }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="truncate">{strength.name}</span>
                      <span className="ml-1 opacity-80">{scoreData?.score}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
