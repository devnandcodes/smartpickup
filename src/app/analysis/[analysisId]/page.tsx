"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AnalysisView } from "@/components/analysis/AnalysisView";
import type { Analysis } from "@/types/analysis";

export default function AnalysisDetailPage() {
  const { analysisId } = useParams<{ analysisId: string }>();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/analyses/${analysisId}`);
        if (!res.ok) throw new Error("Failed to fetch analysis");
        const json = await res.json();
        setAnalysis(json.data.analysis);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load analysis"
        );
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [analysisId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <p className="text-gray-500 animate-pulse">Loading analysis...</p>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <p className="text-red-500">{error ?? "Analysis not found"}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <AnalysisView analysis={analysis} />
    </div>
  );
}
