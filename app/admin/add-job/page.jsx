'use client'

import { useState, useEffect } from 'react'
import { CATEGORY_CONFIG } from '@/lib/d1'
import { getJobs, postJob, deactivateJobAction } from '@/app/actions'
import toast from 'react-hot-toast'

export default function AdminAddJobPage() {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [applyUrl, setApplyUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [jobs, setJobs] = useState([])

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuthenticated(true)
      toast.success('Logged in as admin')
      fetchJobs()
    } else {
      toast.error('Wrong password')
    }
  }

  const fetchJobs = async () => {
    const data = await getJobs()
    if (data) setJobs(data)
  }

  const handleAddJob = async (e) => {
    e.preventDefault()
    if (!title.trim()) return toast.error('Title is required')
    setSubmitting(true)

    const { success } = await postJob({
      title: title.trim(),
      company: company.trim() || null,
      description: description.trim() || null,
      category: category || null,
      apply_url: applyUrl.trim() || null,
    })

    if (!success) {
      toast.error('Failed to add listing')
    } else {
      toast.success('Job listing added! 🎉')
      setTitle('')
      setCompany('')
      setDescription('')
      setCategory('')
      setApplyUrl('')
      fetchJobs()
    }
    setSubmitting(false)
  }

  const handleDeactivate = async (id) => {
    const { success } = await deactivateJobAction(id)

    if (!success) {
      toast.error('Failed to deactivate')
    } else {
      toast.success('Listing deactivated')
      fetchJobs()
    }
  }

  if (!authenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Admin Panel</h2>
          <p className="text-sm text-gray-400 mb-6">Enter admin password to continue</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Admin password"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-center text-sm mb-4 focus:ring-2 focus:ring-emerald-500 outline-none"
              required
              id="admin-password-input"
            />
            <button type="submit" className="w-full py-3 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors" id="admin-login-btn">
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Admin — Job Listings</h1>

      {/* Add Job Form */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New Job Listing</h2>
        <form onSubmit={handleAddJob} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Job title"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              required
            />
            <input
              type="text"
              value={company}
              onChange={e => setCompany(e.target.value)}
              placeholder="Company name"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Job description"
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="">Select category</option>
              {Object.entries(CATEGORY_CONFIG).map(([key, cat]) => (
                <option key={key} value={key}>{cat.emoji} {cat.label}</option>
              ))}
            </select>
            <input
              type="url"
              value={applyUrl}
              onChange={e => setApplyUrl(e.target.value)}
              placeholder="Apply URL"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 disabled:opacity-50 transition-colors"
          >
            {submitting ? 'Adding...' : '+ Add Listing'}
          </button>
        </form>
      </div>

      {/* Existing Listings */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">All Listings ({jobs.length})</h2>
        <div className="space-y-3">
          {jobs.map(job => (
            <div key={job.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">{job.title}</h3>
                <p className="text-sm text-gray-400">
                  {job.company && `${job.company} · `}
                  {job.is_active ? '🟢 Active' : '🔴 Inactive'}
                </p>
              </div>
              {job.is_active && (
                <button
                  onClick={() => handleDeactivate(job.id)}
                  className="px-4 py-2 rounded-lg border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  Deactivate
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
