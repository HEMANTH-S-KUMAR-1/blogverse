import Link from 'next/link'

// ✅ FIX: Replaced fake "own products" with real affiliate recommendations
// All links are affiliate/partner links - update with YOUR affiliate IDs

const AFFILIATE_PRODUCTS = [
  // 📚 Student Life
  {
    id: 1,
    title: 'Notion (Free Forever Plan)',
    description: 'The ultimate workspace for students — notes, to-dos, projects, and budgets all in one place. Used by millions of college students.',
    category: 'student',
    emoji: '📚',
    badge: 'Free',
    badgeColor: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    cta: 'Get Notion Free',
    // 🔑 REPLACE with your Notion affiliate link from notion.so/affiliates
    url: 'https://affiliate.notion.so/blogverse',
    highlight: 'Best for students',
  },
  {
    id: 2,
    title: 'Coursera — Learn from Top Universities',
    description: 'Courses from IITs, IIMs, Google, IBM and 200+ top institutions. Many free to audit. Perfect for upskilling alongside college.',
    category: 'student',
    emoji: '🎓',
    badge: 'Free + Paid',
    badgeColor: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    cta: 'Browse Free Courses',
    // 🔑 REPLACE with your Coursera affiliate link from impact.com
    url: 'https://imp.i384100.net/blogverse',
    highlight: 'Most popular',
  },
  {
    id: 3,
    title: 'Udemy — Skill-Based Courses',
    description: 'Over 220,000 courses on coding, design, marketing, finance and more. Frequent sales bring prices down to ₹400–₹600.',
    category: 'student',
    emoji: '💡',
    badge: 'From ₹399',
    badgeColor: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    cta: 'Explore Courses',
    // 🔑 REPLACE with your Udemy affiliate link from udemy.com/affiliate
    url: 'https://www.udemy.com/?utm_source=blogverse',
    highlight: 'Best deals',
  },

  // 💰 Finance
  {
    id: 4,
    title: 'Groww — Start Investing Today',
    description: 'India\'s simplest app to invest in mutual funds, stocks, FDs, and gold. Zero commission on mutual funds. Perfect for first-time investors.',
    category: 'finance',
    emoji: '📈',
    badge: '₹0 Commission',
    badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    cta: 'Start Investing Free',
    // 🔑 REPLACE with your Groww affiliate link from Cuelinks/affiliate program
    url: 'https://groww.in/?ref=blogverse',
    highlight: 'Editor\'s pick',
  },
  {
    id: 5,
    title: 'Zerodha — Stock Trading Platform',
    description: 'India\'s largest stockbroker. Zero brokerage on equity delivery. Best for serious investors and traders who want lower costs.',
    category: 'finance',
    emoji: '💹',
    badge: '₹0 Delivery Brokerage',
    badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    cta: 'Open Free Account',
    // 🔑 REPLACE with your Zerodha referral link from Console → Rewards
    url: 'https://zerodha.com/?ref=blogverse',
    highlight: 'India #1',
  },

  // 🤖 AI & Tech
  {
    id: 6,
    title: 'Hostinger — Web Hosting from ₹69/mo',
    description: 'Fast, reliable hosting with free domain and SSL. One-click WordPress installer. Best value hosting for Indian bloggers and devs.',
    category: 'tech',
    emoji: '🌐',
    badge: 'From ₹69/mo',
    badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    cta: 'Get Hosting Deal',
    // 🔑 REPLACE with your Hostinger affiliate link from hostinger.in/affiliates (~60% commission)
    url: 'https://hostinger.in/blogverse-affiliate',
    highlight: 'Best value',
  },
  {
    id: 7,
    title: 'Canva Pro — Design Everything',
    description: 'Create stunning graphics, presentations, social posts, and PDFs. The pro plan unlocks 100M+ assets, background remover and brand kits.',
    category: 'tech',
    emoji: '🎨',
    badge: 'Free + Pro',
    badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    cta: 'Try Canva Free',
    // 🔑 REPLACE with your Canva affiliate link from canva.com/affiliates
    url: 'https://www.canva.com/join/blogverse',
    highlight: 'Free forever',
  },

  // 🌿 Health & Wellness
  {
    id: 8,
    title: 'HealthKart — Supplements & Nutrition',
    description: 'India\'s largest online store for protein powders, vitamins, and health supplements. Trusted by 10M+ customers with authentic products guaranteed.',
    category: 'health',
    emoji: '💪',
    badge: 'Up to 15% off',
    badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    cta: 'Shop HealthKart',
    // 🔑 REPLACE with your HealthKart affiliate link from Cuelinks
    url: 'https://www.healthkart.com/?ref=blogverse',
    highlight: 'Most trusted',
  },

  // 🚀 Business
  {
    id: 9,
    title: 'Razorpay — Accept Payments Online',
    description: 'India\'s best payment gateway for freelancers and small businesses. Accept UPI, cards, net banking. Setup in under 10 minutes.',
    category: 'business',
    emoji: '💳',
    badge: 'Free Setup',
    badgeColor: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    cta: 'Start Accepting Payments',
    // 🔑 REPLACE with your Razorpay referral link
    url: 'https://razorpay.com/?ref=blogverse',
    highlight: 'India\'s best',
  },
]

const CATEGORY_LABELS = {
  student: { label: 'Student Life', emoji: '📚', color: 'bg-violet-500' },
  finance: { label: 'Personal Finance', emoji: '💰', color: 'bg-amber-500' },
  tech: { label: 'AI & Tech', emoji: '🤖', color: 'bg-blue-500' },
  health: { label: 'Health & Wellness', emoji: '🌿', color: 'bg-emerald-500' },
  business: { label: 'Micro Business', emoji: '🚀', color: 'bg-red-500' },
  eco: { label: 'Eco Living', emoji: '🌱', color: 'bg-teal-500' },
}

const CATEGORIES = ['all', 'student', 'finance', 'tech', 'health', 'business']

export const metadata = {
  title: 'Recommended Tools & Resources — BlogVerse',
  description: 'Handpicked tools, apps, and platforms recommended by the BlogVerse community. All affiliate links help support free content.',
}

export default function ProductsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Header */}
      <div className="text-center mb-12">
        <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4">
          Community Picks
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
          Recommended Tools & Resources
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Handpicked by the BlogVerse community — apps, platforms, and services we genuinely use and recommend.
        </p>

        {/* Affiliate Disclosure */}
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-xs">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            <strong>Disclosure:</strong> Some links below are affiliate links. We may earn a small commission at no extra cost to you. This helps keep BlogVerse free for everyone.
          </span>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {AFFILIATE_PRODUCTS.map((product) => {
          const cat = CATEGORY_LABELS[product.category]
          return (
            <div
              key={product.id}
              className="group flex flex-col rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-black transition-all duration-500 hover:-translate-y-1"
            >
              {/* Top banner */}
              <div className="flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{product.emoji}</span>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${product.badgeColor}`}>
                    {product.badge}
                  </span>
                </div>
                {product.highlight && (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-tight">
                    {product.highlight}
                  </span>
                )}
              </div>

              <div className="flex flex-col p-6 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-2 h-2 rounded-full ${cat?.color || 'bg-gray-400'}`} />
                  <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">{cat?.label}</span>
                </div>

                <h3 className="text-lg font-extrabold text-gray-900 dark:text-white leading-tight mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {product.title}
                </h3>

                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 flex-1 mb-6">
                  {product.description}
                </p>

                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-bold transition-all hover:bg-emerald-600 dark:hover:bg-emerald-500 hover:text-white shadow-lg active:scale-95"
                >
                  {product.cta}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom CTA */}
      <div className="mt-16 text-center p-8 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 border border-emerald-100 dark:border-emerald-900/30">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Want to recommend a tool?</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Write a review or guide on BlogVerse and help others discover great resources.
        </p>
        <Link
          href="/write"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/25"
        >
          ✍️ Write a Review
        </Link>
      </div>
    </div>
  )
}
