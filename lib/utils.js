// Utility functions — safe to import anywhere (client or server)

/**
 * Parse tags safely from either a JSON string, plain array, or null.
 * Handles the legacy JSON.stringify storage format.
 */
export function parseTags(raw) {
  if (!raw) return []
  if (Array.isArray(raw)) return raw.filter(Boolean)
  if (typeof raw === 'string') {
    try { return JSON.parse(raw).filter(Boolean) } catch { return [] }
  }
  return []
}
