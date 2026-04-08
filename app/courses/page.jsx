import Link from 'next/link'
import AdSenseSlot from '@/components/AdSenseSlot'

export const metadata = {
  title: 'Courses & Learning – BlogVerse',
  description: 'Discover top online courses to level up your skills in tech, finance, health, business, and more.',
}

const COURSES = [
  {
    id: 1, title: 'The Complete Python Bootcamp', platform: 'Udemy', instructor: 'Jose Portilla',
    price: '₹499', originalPrice: '₹3,499', category: 'tech', emoji: '🐍',
    url: 'https://www.udemy.com/course/complete-python-bootcamp/',
    description: 'Go from zero to hero in Python 3. Learn by building 100 projects and games.',
    rating: 4.7, students: '1.7M',
  },
  {
    id: 2, title: 'Financial Markets', platform: 'Coursera', instructor: 'Robert Shiller · Yale',
    price: 'Free to audit', originalPrice: null, category: 'finance', emoji: '📈',
    url: 'https://www.coursera.org/learn/financial-markets-global',
    description: "Learn the fundamentals of finance and how markets work, taught by a Nobel Prize winner.",
    rating: 4.8, students: '800K',
  },
  {
    id: 3, title: 'Content Marketing Mastery', platform: 'Udemy', instructor: 'Brad Hussey',
    price: '₹649', originalPrice: '₹4,999', category: 'business', emoji: '✍️',
    url: 'https://www.udemy.com/course/content-marketing/',
    description: 'Build a content strategy that attracts, engages, and converts readers into customers.',
    rating: 4.5, students: '40K',
  },
  {
    id: 4, title: 'Machine Learning Specialization', platform: 'Coursera', instructor: 'Andrew Ng · Stanford',
    price: 'Free to audit', originalPrice: null, category: 'tech', emoji: '🤖',
    url: 'https://www.coursera.org/specializations/machine-learning-introduction',
    description: 'Master the fundamentals of machine learning from one of the field\'s top experts.',
    rating: 4.9, students: '1.2M',
  },
  {
    id: 5, title: 'Personal Finance & Wealth Building', platform: 'Udemy', instructor: 'Chris Haroun',
    price: '₹499', originalPrice: '₹2,999', category: 'finance', emoji: '💰',
    url: 'https://www.udemy.com/course/an-entire-mba-in-1-courseaward-winning-business-school-prof/',
    description: "Everything you need to know about personal finance, investing, and building wealth in India.",
    rating: 4.6, students: '320K',
  },
  {
    id: 6, title: 'Mindfulness & Stress Management', platform: 'Coursera', instructor: 'U of Monash',
    price: 'Free to audit', originalPrice: null, category: 'health', emoji: '🧘',
    url: 'https://www.coursera.org/learn/mindfulness',
    description: 'Evidence-based strategies to manage stress, improve focus, and build mental resilience.',
    rating: 4.7, students: '200K',
  },
  {
    id: 7, title: 'SEO 2024: Complete SEO Training', platform: 'Udemy', instructor: 'Joshua George',
    price: '₹499', originalPrice: '₹3,299', category: 'business', emoji: '🔍',
    url: 'https://www.udemy.com/course/seo-training/',
    description: 'Rank higher on Google with proven SEO strategies — perfect for bloggers and business owners.',
    rating: 4.7, students: '55K',
  },
  {
    id: 8, title: 'Web Development Bootcamp', platform: 'Udemy', instructor: 'Dr. Angela Yu',
    price: '₹649', originalPrice: '₹5,999', category: 'tech', emoji: '💻',
    url: 'https://www.udemy.com/course/the-complete-web-development-bootcamp/',
    description: 'Become a full-stack web developer with 65+ hours of content. Build real-world projects.',
    rating: 4.7, students: '900K',
  },
  {
    id: 9, title: 'Sustainable Living & Eco Choices', platform: 'Coursera', instructor: 'Copenhagen Business School',
    price: 'Free to audit', originalPrice: null, category: 'eco', emoji: '🌱',
    url: 'https://www.coursera.org/learn/sustainability-through-soccer',
    description: 'Learn how to make sustainable choices in everyday life and reduce your environmental footprint.',
    rating: 4.5, students: '70K',
  },
]

const categoryColors = {
  tech: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  finance: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  health: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  business: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  eco: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  student: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
}

const Stars = ({ rating }) => (
  <span className="flex items-center gap-1">
    <span className="text-amber-400 text-sm">★</span>
    <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{rating}</span>
  </span>
)

export default function CoursesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/10 dark:to-purple-900/10 border border-violet-100 dark:border-violet-900/30 p-8 lg:p-12 mb-12">
        <p className="text-xs font-black uppercase tracking-widest text-violet-400 mb-3">Level Up</p>
        <h1 className="text-4xl font-extrabold text-foreground mb-3">📚 Courses & Learning</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl">
          Top-rated courses handpicked for the BlogVerse community — from tech to finance to wellness.
        </p>
        <p className="text-xs text-slate-400 mt-4">
          ⚠️ Some links are affiliate links. We earn a small commission at no extra cost to you.
        </p>
      </div>

      <div className="mb-8">
        <AdSenseSlot size="leaderboard" />
      </div>

      {/* Courses grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {COURSES.map(course => (
          <a
            key={course.id}
            href={course.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col rounded-2xl border border-border bg-white dark:bg-gray-900 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center overflow-hidden">
              <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{course.emoji}</span>
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${categoryColors[course.category] || ''}`}>
                  {course.category}
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <span className="px-2 py-0.5 rounded-lg bg-white/90 dark:bg-black/70 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                  {course.platform}
                </span>
              </div>
            </div>

            <div className="flex flex-col p-5 flex-1">
              <h3 className="font-extrabold text-gray-900 dark:text-white text-base leading-snug mb-1.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {course.title}
              </h3>
              <p className="text-xs text-slate-500 mb-3">{course.instructor}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 flex-1">{course.description}</p>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                <div className="flex items-center gap-3">
                  <Stars rating={course.rating} />
                  <span className="text-xs text-slate-400">{course.students} students</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">{course.price}</div>
                  {course.originalPrice && (
                    <div className="text-xs text-slate-400 line-through">{course.originalPrice}</div>
                  )}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-10">
        <AdSenseSlot size="article" />
      </div>

      {/* CTA */}
      <div className="mt-16 text-center p-10 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 border border-emerald-100 dark:border-emerald-900/30">
        <span className="text-5xl block mb-4">🚀</span>
        <h3 className="text-2xl font-bold text-foreground mb-2">Share your knowledge</h3>
        <p className="text-slate-500 mb-8 max-w-lg mx-auto">
          Have something valuable to teach? Write a post about it on BlogVerse and grow your audience.
        </p>
        <Link
          href="/write"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40"
        >
          Start Writing
        </Link>
      </div>
    </div>
  )
}
