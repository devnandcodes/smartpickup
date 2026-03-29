import type { MatchSummary } from "@/types/match";
import { MatchCard } from "./MatchCard";

export function MatchList({ matches }: { matches: MatchSummary[] }) {
  if (matches.length === 0) {
    return (
      <p className="text-center text-gray-500 py-12">No matches found.</p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  );
}
