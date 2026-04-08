'use client'

import { useForm, ValidationError } from '@formspree/react'

const PACKAGES = [
  {
    name: 'Starter', price: '₹999/month', emoji: '🌱',
    features: ['1 affiliate banner', '1 category placement', 'Email support'],
    highlight: false,
  },
  {
    name: 'Growth', price: '₹2,499/month', emoji: '🚀',
    features: ['3 affiliate banners', 'Featured section placement', 'Jobs board listing', 'Priority support'],
    highlight: true,
  },
  {
    name: 'Brand', price: '₹4,999/month', emoji: '👑',
    features: ['Unlimited banners', 'Homepage featured slot', 'Newsletter mention', 'Sponsored post', 'Dedicated account manager'],
    highlight: false,
  },
]

export default function AdvertisePage() {
  const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID || 'mjgpavqd'
  const [state, handleSubmit] = useForm(formspreeId)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center mb-14">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-4">
          Reach <span className="text-emerald-500">Real Readers</span>
        </h1>
        <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Advertise on BlogVerse and connect with thousands of engaged readers across Health, Tech, Finance, and more.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-16">
        {[
          { value: '10K+', label: 'Monthly Readers' },
          { value: '6', label: 'Content Categories' },
          { value: '500+', label: 'Articles Published' },
          { value: '₹0', label: 'Barrier to Entry' },
        ].map(stat => (
          <div key={stat.label} className="text-center p-5 rounded-2xl border border-border bg-surface">
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{stat.value}</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Packages */}
      <h2 className="text-2xl font-extrabold text-foreground mb-8 text-center">Advertising Packages</h2>
      <div className="grid sm:grid-cols-3 gap-6 mb-16">
        {PACKAGES.map(pkg => (
          <div
            key={pkg.name}
            className={`rounded-2xl p-6 border flex flex-col ${
              pkg.highlight
                ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/10 shadow-xl shadow-emerald-500/10 scale-105'
                : 'border-border bg-surface'
            }`}
          >
            {pkg.highlight && (
              <div className="text-xs font-black uppercase tracking-widest text-emerald-500 mb-3">Most Popular</div>
            )}
            <div className="text-3xl mb-2">{pkg.emoji}</div>
            <h3 className="text-xl font-bold text-foreground">{pkg.name}</h3>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 mb-4">{pkg.price}</div>
            <ul className="space-y-2 flex-1">
              {pkg.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[10px] font-bold">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Contact Form */}
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div>
          <h2 className="text-2xl font-extrabold text-foreground mb-4">Get in Touch</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            Tell us about your brand and we&apos;ll get back to you within 24 hours with a custom proposal.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
              <span className="text-2xl">📧</span>
              <div><p className="font-medium text-foreground">Fast Response</p><p>We reply within 24 hours</p></div>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
              <span className="text-2xl">💎</span>
              <div><p className="font-medium text-foreground">Custom Campaigns</p><p>Tailored to your goals</p></div>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
              <span className="text-2xl">📊</span>
              <div><p className="font-medium text-foreground">Transparent Reporting</p><p>Monthly performance reports</p></div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6">
          {state.succeeded ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-foreground mb-2">Message received!</h3>
              <p className="text-slate-500">We&apos;ll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Rahul Sharma"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="you@company.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                  <ValidationError field="email" prefix="Email" errors={state.errors} className="text-xs text-red-500 mt-1" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Brand / Company *</label>
                <input
                  type="text"
                  name="brand"
                  required
                  placeholder="Acme Corp"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Package Interest</label>
                <select
                  name="package"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                >
                  <option value="">Select a package</option>
                  <option value="starter">Starter — ₹999/month</option>
                  <option value="growth">Growth — ₹2,499/month</option>
                  <option value="brand">Brand — ₹4,999/month</option>
                  <option value="custom">Custom campaign</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Message *</label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  placeholder="Tell us about your campaign goals, target audience, and budget…"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm resize-none"
                />
                <ValidationError field="message" prefix="Message" errors={state.errors} className="text-xs text-red-500 mt-1" />
              </div>
              <button
                type="submit"
                disabled={state.submitting}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm transition-colors disabled:opacity-50 shadow-lg shadow-emerald-500/25"
              >
                {state.submitting ? 'Sending…' : 'Send Enquiry →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
