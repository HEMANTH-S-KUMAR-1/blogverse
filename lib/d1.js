import { getCloudflareContext } from '@opennextjs/cloudflare';

export async function getDB() {
  const ctx = await getCloudflareContext({ async: true });
  if (!ctx || !ctx.env || !ctx.env.DB) {
    throw new Error('Cloudflare D1 binding (DB) not found in request context.');
  }
  return ctx.env.DB;
}

export async function getR2() {
  const ctx = await getCloudflareContext({ async: true });
  if (!ctx || !ctx.env || !ctx.env.R2_BUCKET) {
    throw new Error('Cloudflare R2 binding (R2_BUCKET) not found in request context.');
  }
  return ctx.env.R2_BUCKET;
}

export const CATEGORY_CONFIG = {
  health: {
    label: 'Health & Wellness', color: 'health', emoji: '🌿',
    badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    borderClass: 'border-emerald-200 text-emerald-600 dark:border-emerald-800 dark:text-emerald-400',
    bgClass: 'bg-emerald-50 dark:bg-emerald-900/10',
    btnClass: 'bg-emerald-500 hover:bg-emerald-600',
    affiliate: { name: 'Healthkart', url: 'https://www.healthkart.com', desc: 'Shop quality supplements, protein, and wellness products.' },
  },
  tech: {
    label: 'AI & Tech', color: 'tech', emoji: '🤖',
    badgeClass: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    borderClass: 'border-blue-200 text-blue-600 dark:border-blue-800 dark:text-blue-400',
    bgClass: 'bg-blue-50 dark:bg-blue-900/10',
    btnClass: 'bg-blue-500 hover:bg-blue-600',
    affiliate: { name: 'Hostinger', url: 'https://www.hostinger.in', desc: 'Get reliable web hosting starting at just Rs 69/month.' },
  },
  finance: {
    label: 'Personal Finance', color: 'finance', emoji: '💰',
    badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    borderClass: 'border-amber-200 text-amber-600 dark:border-amber-800 dark:text-amber-400',
    bgClass: 'bg-amber-50 dark:bg-amber-900/10',
    btnClass: 'bg-amber-500 hover:bg-amber-600',
    affiliate: { name: 'Groww', url: 'https://groww.in', desc: 'Start investing in stocks, mutual funds, and more.' },
  },
  student: {
    label: 'Student Life', color: 'student', emoji: '📚',
    badgeClass: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    borderClass: 'border-violet-200 text-violet-600 dark:border-violet-800 dark:text-violet-400',
    bgClass: 'bg-violet-50 dark:bg-violet-900/10',
    btnClass: 'bg-violet-500 hover:bg-violet-600',
    affiliate: { name: 'Coursera', url: 'https://www.coursera.org', desc: 'Learn from top universities with free and paid courses.' },
  },
  business: {
    label: 'Micro Business', color: 'business', emoji: '🚀',
    badgeClass: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    borderClass: 'border-red-200 text-red-600 dark:border-red-800 dark:text-red-400',
    bgClass: 'bg-red-50 dark:bg-red-900/10',
    btnClass: 'bg-red-500 hover:bg-red-600',
    affiliate: { name: 'Razorpay', url: 'https://razorpay.com', desc: 'Accept payments online with India\'s best payment gateway.' },
  },
  eco: {
    label: 'Eco Living', color: 'eco', emoji: '🌱',
    badgeClass: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
    borderClass: 'border-teal-200 text-teal-600 dark:border-teal-800 dark:text-teal-400',
    bgClass: 'bg-teal-50 dark:bg-teal-900/10',
    btnClass: 'bg-teal-500 hover:bg-teal-600',
    affiliate: { name: 'Amazon', url: 'https://www.amazon.in', desc: 'Shop eco-friendly and sustainable products on Amazon.' },
  },
};

export const CATEGORIES = Object.keys(CATEGORY_CONFIG);

export function safeImageUrl(url) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return url;
    }
  } catch {
  }
  return null;
}

export const getSessionId = () => {
  if (typeof window === 'undefined') return null;
  let sessionId = localStorage.getItem('blogverse_session');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('blogverse_session', sessionId);
  }
  return sessionId;
};
