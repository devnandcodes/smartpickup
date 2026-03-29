"use client";

import { useEffect, useState } from "react";

type SavedMoment = {
  id: string;
  analysis_id: string;
  moment_index: number;
  note: string | null;
  created_at: string;
};

export default function SavedPage() {
  const [moments, setMoments] = useState<SavedMoment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/saved-moments");
        if (res.ok) {
          const json = await res.json();
          setMoments(json.data.moments);
        }
      } catch {
        // silently fail for now
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Saved Moments</h1>
      {loading ? (
        <p className="text-gray-500 animate-pulse">Loading...</p>
      ) : moments.length === 0 ? (
        <p className="text-gray-500">
          No saved moments yet. Analyze a match and save key moments.
        </p>
      ) : (
        <div className="space-y-3">
          {moments.map((m) => (
            <div
              key={m.id}
              className="rounded-lg border border-gray-200 dark:border-gray-800 p-4"
            >
              <p className="text-sm">
                Moment #{m.moment_index + 1} from analysis
              </p>
              {m.note && (
                <p className="text-xs text-gray-500 mt-1">{m.note}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                Saved {new Date(m.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
