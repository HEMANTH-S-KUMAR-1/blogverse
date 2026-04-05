'use client'

// ✅ FIX: Added working Formspree backend to contact form
// 🔑 REPLACE 'YOUR_FORMSPREE_ID' with your actual Formspree form ID
// Get it free at: https://formspree.io → New Form → copy the ID from the URL

import { useState } from 'react'
import toast from 'react-hot-toast'

const PACKAGES = [
  {
    id: 'starter',
    name: 'Starter',
    price: '₹500',
    duration: '7 days',
    emoji: '🌱',
    color: 'border-gray-200 dark:border-gray-700',
    headerBg: 'bg-gray-50 dark:bg-gray-800/50',
    features: [
      'Sidebar banner (300×250)',
      '1 category page',
      'Link to your website',
      '~500 impressions/week',
    ],
    best: false,
  },
  {
    id: 'growth',
    name: 'Growth',
    price: '₹1,500',
    duration: '30 days',
    emoji: '🚀',
    color: 'border-emerald-300 dark:border-emerald-700',
    headerBg: 'bg-emerald-50 dark:bg-emerald-900/20',
    features: [
      'Sidebar banner (300×250)',
      'All category pages',
      'Leaderboard slot (728×90)',
      'Affiliate banner slot',
      '~3,000 impressions/month',
    ],
    best: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '₹3,000',
    duration: '30 days',
    emoji: '💎',
    color: 'border-violet-300 dark:border-violet-700',
    headerBg: 'bg-violet-50 dark:bg-violet-900/20',
    features: [
      'All Growth features',
      'Sponsored newsletter issue',
      'Featured post slot (homepage)',
      'Custom affiliate banner',
      '~8,000 impressions/month',
    ],
    best: false,
  },
]

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID || 'YOUR_FORMSPREE_ID'

export default function AdvertisePage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    package: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    if (FORMSPREE_ID === 'YOUR_FORMSPREE_ID') {
      toast.error('Formspree ID not configured. Check NEXT_PUBLIC_FORMSPREE_ID in .env.local')
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company,
          package: form.package,
          message: form.message,
          _subject: `[BlogVerse Advertise] ${form.package || 'Enquiry'} from ${form.name}`,
        }),
      })

      const data = await res.json()

      if (res.ok && data.ok) {
        setSubmitted(true)
        toast.success('Message sent! We\'ll reply within 24 hours. 🎉')
        setForm({ name: '', email: '', company: '', package: '', message: '' })
      } else {
        toast.error(data?.errors?.[0]?.message || 'Failed to send message. Please try again.')
      }
    } catch (err) {
      toast.error('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Header */}
      <div className="text-center mb-14">
        <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">
          Advertise
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
          Reach Our Readers
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          BlogVerse readers are curious, engaged, and action-oriented. Get your brand in front of the right audience.
        </p>

        {/* Stats */}
        <div className="mt-8 flex flex-wrap justify-center gap-8">
          {[
            { value: '6', label: 'Niche Categories' },
            { value: '₹500', label: 'Starting From' },
            { value: '24h', label: 'Response Time' },
            { value: 'UPI', label: 'Easy Payment' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{stat.value}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wide mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Packages */}
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {PACKAGES.map(pkg => (
          <div
            key={pkg.id}
            className={`relative flex flex-col rounded-2xl border-2 ${pkg.color} overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1 duration-300`}
          >
            {pkg.best && (
              <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl">
                Most Popular
              </div>
            )}

            <div className={`px-6 py-5 ${pkg.headerBg} border-b border-inherit`}>
              <span className="text-3xl mb-2 block">{pkg.emoji}</span>
              <h3 className="text-xl font-black text-gray-900 dark:text-white">{pkg.name}</h3>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-gray-900 dark:text-white">{pkg.price}</span>
                <span className="text-sm text-gray-400">/ {pkg.duration}</span>
              </div>
            </div>

            <div className="p-6 flex-1">
              <ul className="space-y-3">
                {pkg.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="px-6 pb-6">
              <button
                onClick={() => {
                  setForm(prev => ({ ...prev, package: pkg.name }))
                  document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className={`w-full py-3 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                  pkg.best
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/25'
                    : 'border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-emerald-400 hover:text-emerald-600'
                }`}
              >
                Choose {pkg.name} →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Contact Form — Now with working Formspree backend */}
      <div id="contact-form" className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Get in Touch</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Fill out the form and we&apos;ll reply within 24 hours via email.
          </p>
        </div>

        {submitted ? (
          <div className="text-center p-10 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
            <p className="text-gray-500 dark:text-gray-400">
              We&apos;ve received your enquiry and will reply to <strong>{form.email || 'your email'}</strong> within 24 hours.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-6 px-6 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Hemanth Kumar"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
                  required
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Company / Brand
                </label>
                <input
                  type="text"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="Your Company"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Package Interested In
                </label>
                <select
                  name="package"
                  value={form.package}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
                >
                  <option value="">Select a package</option>
                  <option value="Starter">Starter — ₹500/7 days</option>
                  <option value="Growth">Growth — ₹1,500/month</option>
                  <option value="Premium">Premium — ₹3,000/month</option>
                  <option value="Custom">Custom requirement</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                placeholder="Tell us about your brand, campaign goals, target audience, and any specific requirements..."
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/25 active:scale-95"
            >
              {submitting ? 'Sending...' : '📨 Send Message'}
            </button>

            <p className="text-xs text-center text-gray-400">
              We respond within 24 hours on business days. Payment is via UPI after confirmation.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
