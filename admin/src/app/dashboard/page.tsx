import Link from "next/link";


export default function DashboardPage() {
  return (
    <div className="flex w-full">
      {/* LEFT SIDE */}
      <aside className="w-1/4 border-r border-zinc-700 p-6">
        <h2 className="text-lg font-semibold mb-4">
          Admin functions
        </h2>

        <ul className="space-y-2 text-zinc-300">
          <li>
            <Link href="/dashboard/textboxes" className="hover:text-white">
              Textboxes
            </Link>
          </li>

          <li>
            <Link href="/dashboard/categories" className="hover:text-white">
              Categories
            </Link>
          </li>

          <li className="hover:text-white cursor-pointer">
            <Link href="/dashboard/listings" className="hover:text-white">
              Listings
            </Link>
          </li>
          <li className="hover:text-white cursor-pointer">
            Users
          </li>

        </ul>
      </aside>






      {/* RIGHT SIDE */}
      <main className="w-3/4 p-6">
        <h1 className="text-xl font-semibold mb-4">
          Overview
        </h1>

        <div className="text-zinc-400">
          Dashboard metrics will appear here.
        </div>
      </main>
    </div>
  );
}
