import { getProducts } from '@/app/actions'
import ProductCard from '@/components/ProductCard'
import AffiliateBanner from '@/components/AffiliateBanner'
import AdSenseSlot from '@/components/AdSenseSlot'

export const metadata = {
  title: 'Recommended Tools & Products – BlogVerse',
  description: 'Discover tools, resources, and products recommended by the BlogVerse community to help you write, earn, and grow.',
}

export const revalidate = 3600

// Fallback curated products if DB is empty
const CURATED_PRODUCTS = [
  {
    id: 'c1', title: 'Notion — All-in-One Workspace', description: 'Organise your writing, research, and life in one beautiful tool. Free plan available.',
    price: 'Free / $10/mo', category: 'tech', gumroad_url: 'https://notion.so', thumbnail_url: null,
  },
  {
    id: 'c2', title: 'Canva Pro — Design Everything', description: 'Create stunning featured images, social graphics, and more. Perfect for bloggers.',
    price: 'Free / $15/mo', category: 'business', gumroad_url: 'https://canva.com', thumbnail_url: null,
  },
  {
    id: 'c3', title: 'Hostinger Web Hosting', description: 'Launch your own blog or website with reliable Indian hosting from just ₹69/month.',
    price: 'From ₹69/mo', category: 'tech', gumroad_url: 'https://www.hostinger.in', thumbnail_url: null,
  },
  {
    id: 'c4', title: 'HealthKart Nutrition', description: 'Quality proteins, vitamins, and wellness supplements trusted by millions in India.',
    price: 'Various', category: 'health', gumroad_url: 'https://www.healthkart.com', thumbnail_url: null,
  },
  {
    id: 'c5', title: 'Groww — Start Investing Today', description: 'Invest in stocks, SIPs, and mutual funds with zero complexity. 100% free to start.',
    price: 'Free', category: 'finance', gumroad_url: 'https://groww.in', thumbnail_url: null,
  },
  {
    id: 'c6', title: 'Coursera Learning Subscription', description: 'Access 7,000+ courses from world-class universities. Build real skills, earn certificates.',
    price: 'Free / $59/mo', category: 'student', gumroad_url: 'https://www.coursera.org', thumbnail_url: null,
  },
  {
    id: 'c7', title: 'Razorpay Payment Gateway', description: "Accept UPI, cards, and wallets on your site. India's best payment infrastructure.",
    price: '2% per txn', category: 'business', gumroad_url: 'https://razorpay.com', thumbnail_url: null,
  },
  {
    id: 'c8', title: 'Amazon Eco-Friendly Products', description: 'Sustainable home goods, reusable products, and zero-waste alternatives shipped to your door.',
    price: 'Various', category: 'eco', gumroad_url: 'https://www.amazon.in', thumbnail_url: null,
  },
  {
    id: 'c9', title: 'Grammarly — Write Better', description: 'AI-powered writing assistant to fix grammar, improve clarity, and level up your writing.',
    price: 'Free / $30/mo', category: 'student', gumroad_url: 'https://www.grammarly.com', thumbnail_url: null,
  },
]

export default async function ProductsPage() {
  const dbProducts = await getProducts()
  const products = dbProducts.length > 0 ? dbProducts : CURATED_PRODUCTS

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900/50 dark:to-gray-900/50 border border-border p-8 lg:p-12 mb-12">
        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Community Picks</p>
        <h1 className="text-4xl font-extrabold text-foreground mb-3">📦 Recommended Tools</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl">
          Products and tools trusted by our community — handpicked to help you write, earn, and grow.
        </p>
        <p className="text-xs text-slate-400 mt-4">
          ⚠️ Some links below are affiliate links. We earn a small commission at no extra cost to you.
        </p>
      </div>

      {/* AdSense */}
      <div className="mb-8">
        <AdSenseSlot size="leaderboard" />
      </div>

      {/* Products grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Affiliate Banners */}
      <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AffiliateBanner category="tech" />
        <AffiliateBanner category="finance" />
        <AffiliateBanner category="student" />
      </div>

      <div className="mt-8">
        <AdSenseSlot size="article" />
      </div>
    </div>
  )
}
