import Link from "next/link";

export function Navbar() {
  return (
    <nav className="border-b border-gray-200 dark:border-gray-800">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold tracking-tight">
          SmartPickup
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link
            href="/matches"
            className="hover:text-gray-600 dark:hover:text-gray-300"
          >
            Matches
          </Link>
          <Link
            href="/saved"
            className="hover:text-gray-600 dark:hover:text-gray-300"
          >
            Saved
          </Link>
        </div>
      </div>
    </nav>
  );
}
