import type { Analysis } from "@/types/analysis";
import { KeyMoment } from "./KeyMoment";

export function AnalysisView({ analysis }: { analysis: Analysis }) {
  const { result } = analysis;

  return (
    <div className="space-y-6">
      {/* Headline */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-xl font-bold">{result.headline}</h2>
        <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
          <span className="capitalize">{analysis.audienceLevel}</span>
          <span>-</span>
          <span>{analysis.mode.replace("_", " ")}</span>
          {result.confidence.level !== "high" && (
            <>
              <span>-</span>
              <span className="text-yellow-500">
                {result.confidence.level} confidence
              </span>
            </>
          )}
        </div>
      </div>

      {/* Match Narrative */}
      <section>
        <h3 className="text-lg font-semibold mb-3">Match Story</h3>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          {result.matchNarrative.split("\n\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      {/* Tactical Summary */}
      <section className="rounded-lg border border-gray-200 dark:border-gray-800 p-6 space-y-4">
        <h3 className="text-lg font-semibold">Tactical Breakdown</h3>
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-1">
            Home Team Approach
          </h4>
          <p className="text-sm">{result.tacticalSummary.homeTeamApproach}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-1">
            Away Team Approach
          </h4>
          <p className="text-sm">{result.tacticalSummary.awayTeamApproach}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-1">
            Key Battle
          </h4>
          <p className="text-sm">{result.tacticalSummary.keyBattle}</p>
        </div>
      </section>

      {/* xG Story */}
      <section className="rounded-lg border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-lg font-semibold mb-2">The xG Story</h3>
        <p className="text-sm">{result.xgStory}</p>
      </section>

      {/* Key Moments */}
      <section>
        <h3 className="text-lg font-semibold mb-3">Key Moments</h3>
        <div className="space-y-3">
          {result.keyMoments.map((moment, index) => (
            <KeyMoment key={index} moment={moment} index={index} />
          ))}
        </div>
      </section>

      {/* Stats Insight */}
      <section className="rounded-lg border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-lg font-semibold mb-2">Stats Insight</h3>
        <p className="text-sm">{result.statsInsight}</p>
      </section>

      {/* Player Ratings */}
      <section>
        <h3 className="text-lg font-semibold mb-3">Player Ratings</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {result.playerRatings.map((player, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-800 p-3"
            >
              <span className="text-2xl font-bold tabular-nums w-10 text-center">
                {player.rating}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{player.name}</p>
                <p className="text-xs text-gray-500">{player.team}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {player.rationale}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Confidence Caveats */}
      {result.confidence.caveats.length > 0 && (
        <section className="text-xs text-gray-400 border-t border-gray-200 dark:border-gray-800 pt-4">
          <p className="font-medium mb-1">Analysis caveats:</p>
          <ul className="list-disc pl-4 space-y-1">
            {result.confidence.caveats.map((caveat, i) => (
              <li key={i}>{caveat}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
