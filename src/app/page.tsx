import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        SmartPickup
      </h1>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
        AI-powered tactical analysis for soccer fans.
        <br />
        Understand why things happened on the pitch.
      </p>
      <Link
        href="/matches"
        className="mt-8 inline-block rounded-lg bg-foreground px-6 py-3 text-sm font-medium text-background hover:opacity-90 transition-opacity"
      >
        Browse Matches
      </Link>
    </div>
  );
}
