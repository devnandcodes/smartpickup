export default function MatchesLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="h-8 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-6" />
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-gray-200 dark:border-gray-800 p-4"
          >
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-3" />
            <div className="h-5 w-40 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2" />
            <div className="h-5 w-36 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
