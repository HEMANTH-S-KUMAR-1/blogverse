'use client'

import { useForm, ValidationError } from '@formspree/react'
import { useState } from 'react'

export default function AdvertisePage() {
  const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID || 'xdummyid'
  const [state, handleSubmit] = useForm(formspreeId)
  const [selectedPackage, setSelectedPackage] = useState('')

  const packages = [
    {
      name: 'Basic Sponsored Post',
      price: '₹500',
      features: ['One published post with Sponsored label', '7-day homepage feature', 'Category page listing'],
      color: 'from-blue-500 to-blue-600',
      popular: false,
    },
    {
      name: 'Featured Post',
      price: '₹1,500',
      features: ['Everything in Basic', 'Category page header banner for 7 days', 'Newsletter mention', 'Priority placement'],
      color: 'from-emerald-500 to-teal-600',
      popular: true,
    },
    {
      name: 'Category Sponsor',
      price: '₹3,000/mo',
      features: ['Persistent sidebar banner in one category', 'Monthly newsletter mention', 'Brand logo in category header', 'Analytics report'],
      color: 'from-violet-500 to-purple-600',
      popular: false,
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Partner With BlogVerse</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Reach our growing community of readers and writers</p>
      </div>

      {/* Packages */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {packages.map((pkg, i) => (
          <div
            key={i}
            className={`relative rounded-2xl border ${pkg.popular ? 'border-emerald-500 shadow-xl shadow-emerald-500/10' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-900 p-6 transition-all hover:-translate-y-1 hover:shadow-lg`}
          >
            {pkg.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-medium">
                Most Popular
              </span>
            )}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{pkg.name}</h3>
            <p className={`text-3xl font-bold bg-linear-to-r ${pkg.color} bg-clip-text text-transparent mt-2 `}>{pkg.price}</p>
            <ul className="mt-4 space-y-3">
              {pkg.features.map((f, j) => (
                <li key={j} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setSelectedPackage(pkg.name)}
              className={`mt-6 w-full py-2.5 rounded-xl text-sm font-medium transition-all ${
                selectedPackage === pkg.name
                  ? 'bg-emerald-500 text-white'
                  : 'border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {selectedPackage === pkg.name ? '✓ Selected' : 'Select Package'}
            </button>
          </div>
        ))}
      </div>

      {/* Contact Form */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">Get in Touch</h2>

        {state.succeeded ? (
          <div className="text-center py-16 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20">
            <span className="text-4xl mb-4 block">✅</span>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Message Sent!</h3>
            <p className="text-gray-500 mt-2">We&apos;ll get back to you within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input type="text" name="name" required className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input type="email" name="email" required className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                <ValidationError prefix="Email" field="email" errors={state.errors} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company</label>
              <input type="text" name="company" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Package Interested In</label>
              <select
                name="package"
                value={selectedPackage}
                onChange={e => setSelectedPackage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="">Select a package</option>
                <option value="Basic Sponsored Post">Basic Sponsored Post — ₹500</option>
                <option value="Featured Post">Featured Post — ₹1,500</option>
                <option value="Category Sponsor">Category Sponsor — ₹3,000/mo</option>
                <option value="Newsletter Sponsorship">Newsletter Sponsorship — ₹1,000/issue</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
              <textarea name="message" rows={4} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none" />
              <ValidationError prefix="Message" field="message" errors={state.errors} />
            </div>
            <button
              type="submit"
              disabled={state.submitting}
              className="w-full py-3 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600 disabled:opacity-50 transition-colors"
            >
              {state.submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}

        {/* Newsletter Sponsorship */}
        <div className="mt-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">📬 Newsletter Sponsorship</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Sponsor our weekly newsletter reaching our entire subscriber base.
          </p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">₹1,000 <span className="text-sm font-normal text-gray-400">per issue</span></p>
        </div>
      </div>
    </div>
  )
}
