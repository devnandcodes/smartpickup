import type { KeyMoment as KeyMomentType } from "@/lib/ai/schema";

const impactColors = {
  low: "border-gray-300 dark:border-gray-700",
  medium: "border-yellow-400 dark:border-yellow-600",
  high: "border-red-400 dark:border-red-600",
};

export function KeyMoment({
  moment,
  index,
}: {
  moment: KeyMomentType;
  index: number;
}) {
  return (
    <div
      className={`rounded-lg border-l-4 ${impactColors[moment.impact]} border border-gray-200 dark:border-gray-800 p-4`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono bg-gray-100 dark:bg-gray-900 px-2 py-0.5 rounded">
              {moment.minute}&apos;
            </span>
            <h4 className="font-medium text-sm">{moment.title}</h4>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {moment.description}
          </p>
          {moment.involvedPlayers.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {moment.involvedPlayers.map((player) => (
                <span
                  key={player}
                  className="text-xs bg-gray-100 dark:bg-gray-900 px-2 py-0.5 rounded"
                >
                  {player}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
