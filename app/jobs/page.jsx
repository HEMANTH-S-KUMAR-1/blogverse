import { getJobs } from '@/app/actions'
import JobCard from '@/components/JobCard'
import Link from 'next/link'

export const metadata = {
  title: 'Jobs Board – BlogVerse',
  description: 'Find remote, freelance, and full-time opportunities posted by the BlogVerse community.',
}

export const revalidate = 300

export default async function JobsPage() {
  const jobs = await getJobs()

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border border-blue-100 dark:border-blue-900/30 p-8 lg:p-12 mb-12">
        <h1 className="text-4xl font-extrabold text-foreground mb-3">
          💼 Community Jobs Board
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl">
          Discover remote, freelance, and full-time opportunities — curated for the BlogVerse community.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/70 dark:bg-white/5 border border-blue-100 dark:border-blue-900/30 text-sm text-slate-600 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            {jobs.length} active listings
          </div>
        </div>
      </div>

      {/* Jobs grid */}
      {jobs.length > 0 ? (
        <div className="grid gap-6">
          {jobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 rounded-3xl border-2 border-dashed border-border text-center px-6">
          <span className="text-6xl mb-4">💼</span>
          <h2 className="text-2xl font-bold text-foreground mb-2">No jobs yet</h2>
          <p className="text-slate-500 mb-8 max-w-sm">
            The jobs board is empty right now. Check back soon or advertise your own opportunity.
          </p>
          <Link
            href="/advertise"
            className="px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-500/20"
          >
            Post a Job
          </Link>
        </div>
      )}

      {/* CTA */}
      {jobs.length > 0 && (
        <div className="mt-16 text-center p-8 rounded-3xl border border-border bg-surface">
          <h3 className="text-xl font-bold text-foreground mb-2">Want to post a job?</h3>
          <p className="text-slate-500 mb-6">Reach thousands of writers, creators, and professionals in our community.</p>
          <Link
            href="/advertise"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-foreground text-background font-bold hover:scale-105 transition-transform"
          >
            Get in Touch
          </Link>
        </div>
      )}
    </div>
  )
}
