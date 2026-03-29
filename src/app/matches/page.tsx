import { MatchList } from "@/components/match/MatchList";
import { createSportsProvider } from "@/lib/sports/provider";

export default async function MatchesPage() {
  const provider = createSportsProvider();
  const matches = await provider.getMatchList();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Matches</h1>
      <MatchList matches={matches} />
    </div>
  );
}
