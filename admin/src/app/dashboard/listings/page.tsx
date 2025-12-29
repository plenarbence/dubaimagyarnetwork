import Link from "next/link";

export default function ListingsPage() {
  return (
    <div className="min-h-screen flex flex-col w-full">
      {/* TOP BAR – FULL WIDTH */}
      <header className="flex items-center justify-between border-b border-zinc-700 px-6 py-4">
        <h1 className="text-xl font-semibold">
          Listings
        </h1>

        <Link
          href="/dashboard"
          className="text-zinc-400 hover:text-white"
        >
          ← Back to dashboard
        </Link>
      </header>

      {/* CONTENT BELOW TOP BAR */}
      <div className="flex flex-1 w-full">
        {/* LEFT SIDE – STATE SELECTOR */}
        <aside className="w-1/4 border-r border-zinc-700 p-6">
          <ul className="space-y-2 text-zinc-300">
            <li className="hover:text-white cursor-pointer">
              Pending approval
            </li>
            <li className="hover:text-white cursor-pointer">
              Active
            </li>
            <li className="hover:text-white cursor-pointer">
              Rejected
            </li>
            <li className="hover:text-white cursor-pointer">
              Suspended
            </li>
          </ul>
        </aside>

        {/* RIGHT SIDE – WORK AREA */}
        <main className="flex-1 p-6">
          <div className="text-zinc-400">
            {/* Listing work area */}
          </div>
        </main>
      </div>
    </div>
  );
}
