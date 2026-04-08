export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      {/* Featured skeleton */}
      <div className="rounded-3xl bg-surface border border-border h-64 mb-8" />

      {/* Grid skeleton */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-3xl border border-border bg-surface overflow-hidden">
            <div className="aspect-video bg-slate-100 dark:bg-slate-800" />
            <div className="p-5 space-y-3">
              <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded w-3/4" />
              <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full" />
              <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
