import Link from 'next/link'

export const metadata = {
  title: '404 – Page Not Found | BlogVerse',
}

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-8xl font-black text-slate-100 dark:text-slate-800 select-none mb-4">404</div>
      <h1 className="text-3xl font-extrabold text-foreground mb-3">Page Not Found</h1>
      <p className="text-slate-500 dark:text-slate-400 max-w-md mb-10">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          href="/"
          className="px-8 py-3 rounded-2xl bg-foreground text-background font-bold hover:scale-105 transition-transform shadow-lg"
        >
          ← Back Home
        </Link>
        <Link
          href="/search"
          className="px-8 py-3 rounded-2xl border border-border bg-surface font-bold hover:border-emerald-400 transition-colors"
        >
          Search Posts
        </Link>
      </div>
    </div>
  )
}
