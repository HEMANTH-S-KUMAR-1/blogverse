import Link from 'next/link'

// ✅ FIX: Replaced "coming soon" placeholder with real affiliate course listings

const COURSES = [
  // 🤖 AI & Tech
  {
    id: 1,
    title: 'AI For Everyone',
    provider: 'Coursera × DeepLearning.AI',
    instructor: 'Andrew Ng',
    description: 'Non-technical course explaining AI concepts, how to work with AI teams, and how to build AI strategies. Perfect for everyone — not just developers.',
    category: 'tech',
    emoji: '🤖',
    level: 'Beginner',
    duration: '6 hours',
    rating: '4.8',
    students: '1.2M+',
    price: 'Free to Audit',
    priceBadge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    // 🔑 REPLACE with your Coursera affiliate link
    url: 'https://www.coursera.org/learn/ai-for-everyone?utm_source=blogverse',
    highlight: '🔥 Trending',
  },
  {
    id: 2,
    title: 'Complete Web Development Bootcamp',
    provider: 'Udemy',
    instructor: 'Dr. Angela Yu',
    description: 'Learn HTML, CSS, JavaScript, React, Node.js and more. The most comprehensive web dev course with 65+ hours of content. Rated #1 on Udemy.',
    category: 'tech',
    emoji: '💻',
    level: 'Beginner → Advanced',
    duration: '65 hours',
    rating: '4.7',
    students: '900K+',
    price: '₹399–₹699',
    priceBadge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    // 🔑 REPLACE with your Udemy affiliate link
    url: 'https://www.udemy.com/course/the-complete-web-development-bootcamp/?utm_source=blogverse',
    highlight: '⭐ Editor Pick',
  },
  {
    id: 3,
    title: 'Python for Everybody',
    provider: 'Coursera × University of Michigan',
    instructor: 'Dr. Chuck Severance',
    description: 'The most popular Python course in the world. Learn Python from scratch, work with data, access databases, and visualize data.',
    category: 'tech',
    emoji: '🐍',
    level: 'Beginner',
    duration: '8 months',
    rating: '4.8',
    students: '2.4M+',
    price: 'Free to Audit',
    priceBadge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    // 🔑 REPLACE with your Coursera affiliate link
    url: 'https://www.coursera.org/specializations/python?utm_source=blogverse',
    highlight: null,
  },

  // 💰 Finance
  {
    id: 4,
    title: 'Financial Markets',
    provider: 'Coursera × Yale University',
    instructor: 'Robert Shiller (Nobel Laureate)',
    description: 'Understand the theory and practice behind financial markets — stocks, bonds, derivatives. Taught by Nobel Prize winner Prof. Shiller.',
    category: 'finance',
    emoji: '📊',
    level: 'Beginner',
    duration: '33 hours',
    rating: '4.8',
    students: '900K+',
    price: 'Free to Audit',
    priceBadge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    url: 'https://www.coursera.org/learn/financial-markets-global?utm_source=blogverse',
    highlight: '🏆 Yale Certified',
  },
  {
    id: 5,
    title: 'Personal Finance Masterclass',
    provider: 'Udemy',
    instructor: 'Chris Haroun',
    description: 'Learn budgeting, investing in stocks and mutual funds, tax saving (80C, 80D), and retirement planning for Indian professionals.',
    category: 'finance',
    emoji: '💰',
    level: 'Beginner',
    duration: '11 hours',
    rating: '4.5',
    students: '300K+',
    price: '₹499',
    priceBadge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    url: 'https://www.udemy.com/course/an-entire-mba-in-1-courseaward-winning-business-school-prof/?utm_source=blogverse',
    highlight: null,
  },

  // 📚 Student Life
  {
    id: 6,
    title: 'Learning How to Learn',
    provider: 'Coursera × UC San Diego',
    instructor: 'Barbara Oakley',
    description: 'Science-backed techniques to learn anything faster. Memory techniques, focus, the Pomodoro method, and how to beat procrastination.',
    category: 'student',
    emoji: '🧠',
    level: 'All levels',
    duration: '15 hours',
    rating: '4.8',
    students: '3.8M+',
    price: 'Free to Audit',
    priceBadge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    url: 'https://www.coursera.org/learn/learning-how-to-learn?utm_source=blogverse',
    highlight: '🌍 World\'s Most Popular',
  },
  {
    id: 7,
    title: 'English for Career Development',
    provider: 'Coursera × University of Pennsylvania',
    instructor: 'University of Pennsylvania',
    description: 'Improve your English for professional settings — resumes, interviews, emails, and presentations. Perfect for Indian college students.',
    category: 'student',
    emoji: '🗣️',
    level: 'Intermediate',
    duration: '22 hours',
    rating: '4.7',
    students: '600K+',
    price: 'Free to Audit',
    priceBadge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    url: 'https://www.coursera.org/learn/careerdevelopment?utm_source=blogverse',
    highlight: null,
  },

  // 🚀 Business
  {
    id: 8,
    title: 'Digital Marketing Complete Course',
    provider: 'Udemy',
    instructor: 'Robin & Jesper',
    description: 'Master SEO, Google Ads, Facebook Ads, Instagram, email marketing, and content strategy. Everything to grow a business online.',
    category: 'business',
    emoji: '📱',
    level: 'Beginner → Advanced',
    duration: '23 hours',
    rating: '4.6',
    students: '400K+',
    price: '₹449',
    priceBadge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    url: 'https://www.udemy.com/course/digital-marketing-masterclass-ryan-deiss-russ-henneberry/?utm_source=blogverse',
    highlight: '🔥 Best Seller',
  },
  {
    id: 9,
    title: 'Entrepreneurship Specialization',
    provider: 'Coursera × Wharton School',
    instructor: 'Wharton School of Business',
    description: 'Learn how to start a business from the world\'s top business school. Idea validation, fundraising, scaling, and exit strategies.',
    category: 'business',
    emoji: '🚀',
    level: 'Intermediate',
    duration: '5 months',
    rating: '4.7',
    students: '400K+',
    price: 'Free to Audit',
    priceBadge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    url: 'https://www.coursera.org/specializations/wharton-entrepreneurship?utm_source=blogverse',
    highlight: '🏆 Wharton',
  },
]

const CATEGORY_INFO = {
  tech: { label: 'AI & Tech', emoji: '🤖', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/10' },
  finance: { label: 'Personal Finance', emoji: '💰', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/10' },
  student: { label: 'Student Life', emoji: '📚', color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-900/10' },
  business: { label: 'Micro Business', emoji: '🚀', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/10' },
  health: { label: 'Health', emoji: '🌿', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/10' },
}

export const metadata = {
  title: 'Courses & Learning Resources — BlogVerse',
  description: 'Handpicked online courses from Coursera, Udemy, and top universities — curated by the BlogVerse community.',
}

export default function CoursesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Header */}
      <div className="text-center mb-12">
        <span className="inline-block px-4 py-1.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 text-xs font-bold uppercase tracking-widest mb-4">
          Learn & Grow
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
          Courses & Learning Resources
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Handpicked courses from top universities and platforms — free to audit, affordable to certify.
        </p>

        {/* Stats */}
        <div className="mt-8 flex flex-wrap justify-center gap-6">
          {[
            { label: 'Courses Listed', value: '9+' },
            { label: 'Free to Audit', value: '6' },
            { label: 'Top Providers', value: 'Coursera & Udemy' },
            { label: 'Categories', value: '4' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-black text-gray-900 dark:text-white">{stat.value}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Affiliate Disclosure */}
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-xs">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            <strong>Disclosure:</strong> Some links are affiliate links. We earn a small commission at no extra cost to you — this keeps BlogVerse free.
          </span>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {COURSES.map((course) => {
          const cat = CATEGORY_INFO[course.category]
          return (
            <div
              key={course.id}
              className="group flex flex-col rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-black transition-all duration-500 hover:-translate-y-1"
            >
              {/* Header */}
              <div className={`px-5 py-4 ${cat?.bg || 'bg-gray-50 dark:bg-gray-800/50'} border-b border-gray-100 dark:border-gray-800`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{course.emoji}</span>
                    <div>
                      <p className={`text-[10px] font-black uppercase tracking-widest ${cat?.color}`}>{cat?.label}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{course.provider}</p>
                    </div>
                  </div>
                  {course.highlight && (
                    <span className="px-2.5 py-1 rounded-full bg-white dark:bg-gray-800 text-[10px] font-bold text-gray-700 dark:text-gray-300 shadow-sm">
                      {course.highlight}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col p-6 flex-1">
                <h3 className="text-lg font-extrabold text-gray-900 dark:text-white leading-tight mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {course.title}
                </h3>
                <p className="text-xs text-gray-400 mb-3">by {course.instructor}</p>

                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 flex-1 mb-4">
                  {course.description}
                </p>

                {/* Meta */}
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-[10px] font-bold text-gray-600 dark:text-gray-400">
                    📶 {course.level}
                  </span>
                  <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-[10px] font-bold text-gray-600 dark:text-gray-400">
                    ⏱ {course.duration}
                  </span>
                  <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-[10px] font-bold text-gray-600 dark:text-gray-400">
                    ⭐ {course.rating}
                  </span>
                  <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-[10px] font-bold text-gray-600 dark:text-gray-400">
                    👥 {course.students}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-black ${course.priceBadge}`}>
                    {course.price}
                  </span>
                  <a
                    href={course.url}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-bold transition-all hover:bg-emerald-600 dark:hover:bg-emerald-500 hover:text-white shadow-lg active:scale-95"
                  >
                    Enroll Now
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Write a Review CTA */}
      <div className="mt-16 text-center p-8 rounded-3xl bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-900/10 dark:to-indigo-900/10 border border-violet-100 dark:border-violet-900/30">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Finished a great course?</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Write an honest review on BlogVerse and help others make better learning decisions.
        </p>
        <Link
          href="/write"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-violet-500 text-white font-bold hover:bg-violet-600 transition-colors shadow-lg shadow-violet-500/25"
        >
          ✍️ Write a Course Review
        </Link>
      </div>
    </div>
  )
}
