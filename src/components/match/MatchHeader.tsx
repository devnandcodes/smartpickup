import type { CanonicalMatch } from "@/types/match";
import { formatDate, formatScore, formatMatchStatus } from "@/lib/utils/format";

export function MatchHeader({ match }: { match: CanonicalMatch }) {
  const { match: m, stats } = match;

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500">{m.competition}</span>
        <span className="text-sm font-medium">{formatMatchStatus(m.status)}</span>
      </div>

      <div className="flex items-center justify-center gap-8 mb-4">
        <div className="text-right flex-1">
          <p className="text-xl font-bold">{m.homeTeam}</p>
        </div>
        <p className="text-3xl font-bold tabular-nums">
          {formatScore(m.homeScore, m.awayScore)}
        </p>
        <div className="text-left flex-1">
          <p className="text-xl font-bold">{m.awayTeam}</p>
        </div>
      </div>

      <p className="text-center text-sm text-gray-400 mb-4">
        {formatDate(m.kickoffAt)}
      </p>

      {stats.possessionHome != null && (
        <div className="grid grid-cols-3 gap-2 text-center text-sm border-t border-gray-200 dark:border-gray-800 pt-4">
          <StatRow label="Possession" home={`${stats.possessionHome}%`} away={`${stats.possessionAway}%`} />
          <StatRow label="Shots" home={stats.shotsHome} away={stats.shotsAway} />
          <StatRow label="On Target" home={stats.shotsOnTargetHome} away={stats.shotsOnTargetAway} />
          {stats.xgHome != null && (
            <StatRow label="xG" home={stats.xgHome?.toFixed(1)} away={stats.xgAway?.toFixed(1)} />
          )}
        </div>
      )}
    </div>
  );
}

function StatRow({
  label,
  home,
  away,
}: {
  label: string;
  home: string | number | null | undefined;
  away: string | number | null | undefined;
}) {
  return (
    <>
      <span className="text-right font-medium">{home ?? "-"}</span>
      <span className="text-gray-500">{label}</span>
      <span className="text-left font-medium">{away ?? "-"}</span>
    </>
  );
}
