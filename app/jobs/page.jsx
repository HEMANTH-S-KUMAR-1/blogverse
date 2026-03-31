import { getDB } from '@/lib/d1'
import JobCard from '@/components/JobCard'
import Link from 'next/link'

export const metadata = {
  title: 'Find Opportunities — BlogVerse',
  description: 'Explore job listings and career opportunities in the BlogVerse community.',
}

export const revalidate = 60
export const dynamic = 'force-dynamic'

export default async function JobsPage() {
  const db = await getDB()
  const { results: jobs } = await db.prepare("SELECT * FROM job_listings WHERE is_active = TRUE ORDER BY created_at DESC").all()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Find Opportunities</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Discover jobs and gigs in our community</p>
        </div>
        <a
          href="#post-a-job"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors"
        >
          Post a Job
        </a>
      </div>

      {/* Jobs Grid */}
      {jobs && jobs.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {jobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 mb-16">
          <p className="text-gray-400 text-lg mb-2">No job listings yet.</p>
          <p className="text-gray-400 text-sm">Be the first to post a job!</p>
        </div>
      )}

      {/* Post a Job Section */}
      <section id="post-a-job" className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-linear-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10  p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Post a Job Listing</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Reach our growing community of writers and creators</p>

        <div className="inline-block bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 text-left max-w-md mx-auto">
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">₹199</p>
          <p className="text-sm text-gray-500 mb-4">per listing</p>

          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
            <p>📱 <strong>Step 1:</strong> Pay ₹199 to the UPI ID below</p>
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
              <span className="font-mono text-sm">{process.env.NEXT_PUBLIC_UPI_ID || 'your_upi_id_here'}</span>
            </div>
            <p>📧 <strong>Step 2:</strong> Email your job details with subject &quot;Job Listing Payment&quot;</p>
            <p>✅ <strong>Step 3:</strong> Your listing goes live within 24 hours</p>
          </div>
        </div>
      </section>
    </div>
  )
}
