import { supabase } from '@/lib/supabase'

export const metadata = {
  title: 'Learn & Grow — BlogVerse',
  description: 'Courses, webinars, and workshops from the BlogVerse community.',
}

export const revalidate = 60

export default async function CoursesPage() {
  const { data: webinars } = await supabase
    .from('webinars')
    .select('*')
    .eq('is_active', true)
    .order('event_date', { ascending: true })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Learn & Grow</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Courses, webinars, and workshops from our community</p>
      </div>

      {webinars && webinars.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {webinars.map(w => {
            const isPast = new Date(w.event_date) < new Date()
            const date = new Date(w.event_date).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'long', year: 'numeric',
            })
            const time = new Date(w.event_date).toLocaleTimeString('en-IN', {
              hour: '2-digit', minute: '2-digit',
            })

            return (
              <div key={w.id} className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">🎓</span>
                    {isPast ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                        Completed
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                        Upcoming
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{w.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{w.description}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                    <span>📅 {date}</span>
                    <span>🕐 {time}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`text-lg font-bold ${w.price === 'Free' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>
                      {w.price}
                    </span>
                    {isPast ? (
                      <span className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 text-sm cursor-not-allowed">
                        Event Ended
                      </span>
                    ) : (
                      <a
                        href={w.google_form_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white text-sm font-medium transition-all"
                      >
                        Register Now
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-16 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
          <p className="text-gray-400 text-lg">No upcoming webinars. Check back soon!</p>
        </div>
      )}
    </div>
  )
}
