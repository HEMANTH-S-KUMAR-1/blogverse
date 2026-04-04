import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'All Courses – BlogVerse Academy',
  description: 'Explore our latest courses on tech, finance, health, and more.',
}

export default async function CoursesPage() {
  let courses = []

  try {
    const { data } = await supabase
      .from('courses')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
    courses = data || []
  } catch (e) {
    console.warn('CoursesPage: DB error:', e.message)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
        <div className="max-w-xl text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
            Learn something <span className="text-emerald-500">amazing</span> today.
          </h1>
          <p className="text-xl text-gray-400">
            Professional courses curated by experts to help you master new skills.
          </p>
        </div>
        <div className="relative w-full max-w-sm aspect-square bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center p-8">
          <div className="absolute inset-0 bg-emerald-500/10 blur-3xl rounded-full" />
          <span className="text-8xl">🎓</span>
        </div>
      </div>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map(course => (
            <div key={course.id} className="group flex flex-col bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="aspect-[16/9] relative bg-gray-100 dark:bg-gray-800 overflow-hidden">
                {course.thumbnail_url ? (
                  <Image src={course.thumbnail_url} alt={course.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-4xl">📚</div>
                )}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur text-xs font-bold text-gray-900 shadow-sm uppercase tracking-widest">
                  {course.category || 'Course'}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-emerald-500 transition-colors">
                  {course.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-6 flex-1">
                  {course.description}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Price</span>
                    <span className="text-xl font-black text-gray-900 dark:text-white">
                      {course.is_free ? 'FREE' : `₹ ${course.price}`}
                    </span>
                  </div>
                  <Link href={`/courses/${course.slug}`} className="inline-flex items-center justify-center h-12 px-6 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-black font-bold text-sm hover:scale-105 transition-transform active:scale-95">
                    Start Learning
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center rounded-3xl bg-gray-50 dark:bg-gray-900/50 border-2 border-dashed border-gray-200 dark:border-gray-800">
          <div className="text-4xl mb-4">✨</div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">New courses coming soon</h3>
          <p className="text-gray-500 max-w-sm mx-auto">We're currently crafting high-quality learning experiences for you.</p>
        </div>
      )}
    </div>
  )
}
