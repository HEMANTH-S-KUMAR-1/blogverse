import Link from 'next/link'

export const metadata = {
  title: 'Support BlogVerse – Help Keep Us Free',
  description: 'BlogVerse is free for everyone. Support the platform through Ko-fi, UPI, or by simply sharing content.',
}

export default function SupportPage() {
  const kofiUsername = process.env.NEXT_PUBLIC_KOFI_USERNAME || 'blogverse'
  const upiId = process.env.NEXT_PUBLIC_UPI_ID || 'hemanth.s.kumar2004109@okicici'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blogverse.vercel.app'

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-14">
        <div className="text-6xl mb-5">💚</div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-4">Support BlogVerse</h1>
        <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          BlogVerse is 100% free — no ads that track you, no paywalls, no registration required.
          Your support keeps it that way.
        </p>
      </div>

      {/* Support options */}
      <div className="grid sm:grid-cols-3 gap-6 mb-16">
        {/* Ko-fi */}
        <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/10 p-6 flex flex-col items-center text-center">
          <span className="text-4xl mb-3">☕</span>
          <h3 className="text-lg font-bold text-foreground mb-2">Buy Us a Coffee</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
            Support on Ko-fi. One-time or monthly. Every coffee helps us keep the servers running.
          </p>
          <a
            href={`https://ko-fi.com/${kofiUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold text-sm transition-colors shadow-lg shadow-yellow-400/20"
          >
            Support on Ko-fi ☕
          </a>
        </div>

        {/* UPI */}
        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/10 p-6 flex flex-col items-center text-center">
          <span className="text-4xl mb-3">📱</span>
          <h3 className="text-lg font-bold text-foreground mb-2">UPI Payment</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Send any amount via UPI directly. Fast, simple, Indian.
          </p>
          <div className="w-full bg-white dark:bg-gray-900 rounded-xl p-3 border border-emerald-200 dark:border-emerald-800 mb-3">
            <p className="font-mono text-sm text-foreground break-all select-all">{upiId}</p>
          </div>
          <p className="text-xs text-slate-400">Copy UPI ID and pay from any app</p>
        </div>

        {/* Share */}
        <div className="rounded-2xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10 p-6 flex flex-col items-center text-center">
          <span className="text-4xl mb-3">📣</span>
          <h3 className="text-lg font-bold text-foreground mb-2">Spread the Word</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
            The best support is sharing BlogVerse with your friends. It&apos;s free and takes 10 seconds.
          </p>
          <a
            href={`https://api.whatsapp.com/send?text=Check%20out%20BlogVerse%20-%20A%20free%20platform%20to%20write%2C%20share%2C%20and%20earn!%20${encodeURIComponent(siteUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-sm transition-colors shadow-lg shadow-green-500/20"
          >
            Share on WhatsApp
          </a>
        </div>
      </div>

      {/* What funds go to */}
      <div className="rounded-2xl border border-border bg-surface p-8 mb-12">
        <h2 className="text-xl font-bold text-foreground mb-6">Where does the money go?</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {[
            { icon: '🖥️', title: 'Server Costs', desc: 'Supabase, Vercel, and CDN hosting to keep the site fast and reliable' },
            { icon: '🛠️', title: 'Development', desc: 'Building new features, fixing bugs, and improving the writing experience' },
            { icon: '🔒', title: 'Security', desc: 'Cloudflare Turnstile, DOMPurify, and other tools to keep the community safe' },
            { icon: '📧', title: 'Newsletter', desc: 'Email infrastructure to deliver the community newsletter to subscribers' },
          ].map(item => (
            <div key={item.title} className="flex gap-4">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="font-semibold text-foreground">{item.title}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Other ways to help */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-8">Other Ways to Help</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/write"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-all shadow-lg shadow-emerald-500/25"
          >
            ✍️ Write a Post
          </Link>
          <Link
            href="/advertise"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-border bg-surface hover:border-emerald-300 font-bold transition-all"
          >
            📢 Advertise With Us
          </Link>
          <a
            href="https://github.com/HEMANTH-S-KUMAR-1/blogverse"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-border bg-surface hover:border-emerald-300 font-bold transition-all"
          >
            ⭐ Star on GitHub
          </a>
        </div>
      </div>
    </div>
  )
}
