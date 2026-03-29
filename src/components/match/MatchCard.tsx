import Link from "next/link";
import type { MatchSummary } from "@/types/match";
import { formatDate, formatScore, formatMatchStatus } from "@/lib/utils/format";

export function MatchCard({ match }: { match: MatchSummary }) {
  const statusColor =
    match.status === "live"
      ? "text-red-500"
      : match.status === "halftime"
        ? "text-yellow-500"
        : "text-gray-500";

  return (
    <Link
      href={`/matches/${match.id}`}
      className="block rounded-lg border border-gray-200 dark:border-gray-800 p-4 hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-500">{match.competition}</span>
        <span className={`text-xs font-medium ${statusColor}`}>
          {formatMatchStatus(match.status)}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="font-medium">{match.homeTeam}</p>
          <p className="font-medium">{match.awayTeam}</p>
        </div>
        {match.status !== "scheduled" && (
          <div className="text-right">
            <p className="text-2xl font-bold tabular-nums">
              {formatScore(match.homeScore, match.awayScore)}
            </p>
          </div>
        )}
      </div>
      <p className="mt-2 text-xs text-gray-400">
        {formatDate(match.kickoffAt)}
      </p>
    </Link>
  );
}
