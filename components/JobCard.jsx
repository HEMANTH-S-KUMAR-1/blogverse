import { CATEGORY_CONFIG } from '@/lib/d1'

export default function JobCard({ job }) {
  const cat = CATEGORY_CONFIG[job.category]
  const date = new Date(job.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  const categoryColorClasses = {
    health: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    tech: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    finance: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    student: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    business: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    eco: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{job.title}</h3>
          {job.company && <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-0.5">{job.company}</p>}
        </div>
        {job.category && cat && (
          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${categoryColorClasses[job.category]}`}>
            {cat.label}
          </span>
        )}
      </div>
      {job.description && (
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{job.description}</p>
      )}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-gray-400">Posted {date}</span>
        {job.apply_url && (
          <a
            href={job.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors"
          >
            Apply Now
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </a>
        )}
      </div>
    </div>
  )
}
