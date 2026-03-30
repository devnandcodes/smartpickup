import type { Analysis } from "@/types/analysis";
import { KeyMoment } from "./KeyMoment";

export function AnalysisView({ analysis }: { analysis: Analysis }) {
  const { result } = analysis;

  const freqColors = {
    isolated: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
    recurring: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400",
    dominant: "bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400",
  };

  return (
    <div className="space-y-6">
      {/* Headline + Quick Take — THE priority */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-xl font-bold">{result.headline}</h2>
        <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 mb-4">
          <span className="capitalize">{analysis.audienceLevel}</span>
          <span>·</span>
          <span>{analysis.mode.replace("_", " ")}</span>
          {result.confidence.level !== "high" && (
            <>
              <span>·</span>
              <span className="text-yellow-500">
                {result.confidence.level} confidence
              </span>
            </>
          )}
        </div>
        <ul className="space-y-2">
          {result.quickTake.map((bullet, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span className="text-gray-400 font-bold shrink-0">→</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Match Narrative — expandable depth */}
      <section>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Match Story
        </h3>
        <div className="text-sm space-y-3">
          {result.matchNarrative.split("\n\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      {/* Two-column: Tactical + xG */}
      <div className="grid gap-4 sm:grid-cols-2">
        <section className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Tactics
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium">Home: </span>
              {result.tacticalSummary.homeTeamApproach}
            </div>
            <div>
              <span className="font-medium">Away: </span>
              {result.tacticalSummary.awayTeamApproach}
            </div>
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
              <span className="font-medium">Key battle: </span>
              {result.tacticalSummary.keyBattle}
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            xG Story
          </h3>
          <p className="text-sm">{result.xgStory}</p>
        </section>
      </div>

      {/* Vulnerabilities — compact risk card */}
      <section className="rounded-lg border border-red-200 dark:border-red-900/30 bg-red-50/30 dark:bg-red-950/10 p-4">
        <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide mb-3">
          Vulnerabilities
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 text-sm mb-3">
          <div>
            <span className="font-medium">Home: </span>
            {result.vulnerabilities.home}
          </div>
          <div>
            <span className="font-medium">Away: </span>
            {result.vulnerabilities.away}
          </div>
        </div>
        <div className="text-sm pt-2 border-t border-red-200/50 dark:border-red-900/20">
          <span className="font-medium text-amber-600 dark:text-amber-400">
            Missed opportunity:{" "}
          </span>
          {result.vulnerabilities.missedOpportunity}
        </div>
      </section>

      {/* Patterns — inline badges */}
      <section>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Tactical Patterns
        </h3>
        <div className="space-y-2">
          {result.patterns.map((pattern, i) => (
            <div
              key={i}
              className="rounded-lg border border-gray-200 dark:border-gray-800 p-3 flex gap-3 items-start"
            >
              <span
                className={`text-xs px-2 py-0.5 rounded shrink-0 mt-0.5 ${freqColors[pattern.frequency]}`}
              >
                {pattern.frequency}
              </span>
              <div className="text-sm">
                <span className="font-medium">{pattern.name}: </span>
                {pattern.description}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Key Moments — timeline */}
      <section>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Key Moments
        </h3>
        <div className="space-y-2">
          {result.keyMoments.map((moment, index) => (
            <KeyMoment key={index} moment={moment} index={index} />
          ))}
        </div>
      </section>

      {/* Player Ratings — compact grid */}
      <section>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Standout Performers
        </h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {result.playerRatings.map((player, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-800 p-3"
            >
              <span className="text-xl font-bold tabular-nums w-8 text-center">
                {player.rating}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">
                  {player.name}{" "}
                  <span className="text-xs text-gray-500 font-normal">
                    {player.team}
                  </span>
                </p>
                <p className="text-xs text-gray-400">{player.rationale}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer — attribution + caveats */}
      <footer className="text-xs text-gray-400 border-t border-gray-200 dark:border-gray-800 pt-3 space-y-1">
        <p>AI-generated analysis powered by SmartPickup. Based on match data — not a substitute for professional judgment.</p>
        {result.confidence.caveats.length > 0 && (
          <p>{result.confidence.caveats.join(" · ")}</p>
        )}
      </footer>
    </div>
  );
}
