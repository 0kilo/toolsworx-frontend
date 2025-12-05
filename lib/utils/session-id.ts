// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

// Get GA4 Client ID as session identifier
export function getSessionId(): string {
  if (typeof window === 'undefined') return ''

  // Try to get GA4 Client ID from cookie
  const gaCookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('_ga='))
  
  if (gaCookie) {
    // GA4 cookie format: _ga=GA1.1.{clientId}
    const clientId = gaCookie.split('.').slice(-2).join('.')
    return `ga_${clientId}`
  }

  // Fallback: use localStorage if GA4 not loaded yet
  const fallbackId = localStorage.getItem('toolsworx_session_id')
  if (fallbackId) return fallbackId

  // Last resort: generate temporary ID
  const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  localStorage.setItem('toolsworx_session_id', tempId)
  return tempId
}

// Get GA4 Client ID directly from gtag (preferred method)
export async function getGA4ClientId(): Promise<string> {
  if (typeof window === 'undefined' || !window.gtag) {
    return getSessionId() // Fallback
  }

  return new Promise((resolve) => {
    window.gtag!('get', 'G-6KELGGJCTR', 'client_id', (clientId: string) => {
      resolve(clientId ? `ga_${clientId}` : getSessionId())
    })
  })
}
