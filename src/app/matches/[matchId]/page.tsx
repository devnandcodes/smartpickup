"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MatchHeader } from "@/components/match/MatchHeader";
import { AnalysisView } from "@/components/analysis/AnalysisView";
import type { CanonicalMatch } from "@/types/match";
import type { Analysis, AudienceLevel } from "@/types/analysis";

export default function MatchDetailPage() {
  const { matchId } = useParams<{ matchId: string }>();
  const [match, setMatch] = useState<CanonicalMatch | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [audienceLevel, setAudienceLevel] =
    useState<AudienceLevel>("beginner");
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMatch() {
      try {
        const res = await fetch(`/api/matches/${matchId}`);
        if (!res.ok) throw new Error("Failed to fetch match");
        const json = await res.json();
        setMatch(json.data.match);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load match");
      } finally {
        setLoading(false);
      }
    }
    fetchMatch();
  }, [matchId]);

  async function handleAnalyze() {
    setAnalyzing(true);
    setError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId,
          audienceLevel,
          mode:
            match?.match.status === "halftime"
              ? "halftime"
              : match?.match.status === "live"
                ? "live_snapshot"
                : "post_match",
        }),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error?.message ?? "Analysis failed");
      }
      const json = await res.json();
      setAnalysis(json.data.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
      </div>
    );
  }

  if (error && !match) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!match) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <MatchHeader match={match} />

      <div className="flex items-center gap-4">
        <div className="flex rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden text-sm">
          <button
            onClick={() => setAudienceLevel("beginner")}
            className={`px-4 py-2 transition-colors ${
              audienceLevel === "beginner"
                ? "bg-foreground text-background"
                : "hover:bg-gray-100 dark:hover:bg-gray-900"
            }`}
          >
            Beginner
          </button>
          <button
            onClick={() => setAudienceLevel("advanced")}
            className={`px-4 py-2 transition-colors ${
              audienceLevel === "advanced"
                ? "bg-foreground text-background"
                : "hover:bg-gray-100 dark:hover:bg-gray-900"
            }`}
          >
            Advanced
          </button>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={analyzing || match.match.status === "scheduled"}
          className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {analyzing ? "Analyzing..." : "Analyze Match"}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {analyzing && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-8 text-center">
          <p className="text-gray-500 animate-pulse">
            AI is analyzing the match...
          </p>
        </div>
      )}

      {analysis && !analyzing && <AnalysisView analysis={analysis} />}
    </div>
  );
}
