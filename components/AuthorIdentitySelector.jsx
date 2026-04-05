'use client'

import { useState } from 'react'
import GlassCard from './GlassCard'

const identities = [
  {
    id: 'personal',
    name: 'Personal Brand',
    emoji: '👤',
    description: 'Write as yourself',
  },
  {
    id: 'business',
    name: 'Business/Company',
    emoji: '🏢',
    description: 'Represent your organization',
  },
  {
    id: 'anonymous',
    name: 'Anonymous',
    emoji: '🔒',
    description: 'Stay private',
  },
]

export default function AuthorIdentitySelector({ value, onChange }) {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-bold text-foreground">Author Identity</label>
      <div className="grid grid-cols-3 gap-3">
        {identities.map((identity) => (
          <button
            key={identity.id}
            onClick={() => onChange(identity.id)}
            className={`p-4 rounded-xl border-2 transition-all ${
              value === identity.id
                ? 'border-cyan-400 bg-cyan-500/20 shadow-lg shadow-cyan-500/30'
                : 'border-slate-600/30 bg-slate-900/20 hover:border-slate-400/50'
            }`}
          >
            <div className="text-3xl mb-2">{identity.emoji}</div>
            <div className="text-sm font-bold text-foreground">{identity.name}</div>
            <div className="text-xs text-slate-400 mt-1">{identity.description}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
