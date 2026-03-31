import { getCloudflareContext } from '@opennextjs/cloudflare';

export async function getDB() {
  const ctx = await getCloudflareContext();
  if (!ctx || !ctx.env || !ctx.env.DB) {
    throw new Error('Cloudflare D1 binding (DB) not found in request context.');
  }
  return ctx.env.DB;
}

export async function getR2() {
  const ctx = await getCloudflareContext();
  if (!ctx || !ctx.env || !ctx.env.R2_BUCKET) {
    throw new Error('Cloudflare R2 binding (R2_BUCKET) not found in request context.');
  }
  return ctx.env.R2_BUCKET;
}

export const CATEGORY_CONFIG = {
  health: { label: 'Health & Wellness', color: 'health', emoji: '🌿', affiliate: { name: 'Healthkart', url: 'https://www.healthkart.com', desc: 'Shop quality supplements, protein, and wellness products.' } },
  tech: { label: 'AI & Tech', color: 'tech', emoji: '🤖', affiliate: { name: 'Hostinger', url: 'https://www.hostinger.in', desc: 'Get reliable web hosting starting at just Rs 69/month.' } },
  finance: { label: 'Personal Finance', color: 'finance', emoji: '💰', affiliate: { name: 'Groww', url: 'https://groww.in', desc: 'Start investing in stocks, mutual funds, and more.' } },
  student: { label: 'Student Life', color: 'student', emoji: '📚', affiliate: { name: 'Coursera', url: 'https://www.coursera.org', desc: 'Learn from top universities with free and paid courses.' } },
  business: { label: 'Micro Business', color: 'business', emoji: '🚀', affiliate: { name: 'Razorpay', url: 'https://razorpay.com', desc: 'Accept payments online with India\'s best payment gateway.' } },
  eco: { label: 'Eco Living', color: 'eco', emoji: '🌱', affiliate: { name: 'Amazon', url: 'https://www.amazon.in', desc: 'Shop eco-friendly and sustainable products on Amazon.' } },
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
