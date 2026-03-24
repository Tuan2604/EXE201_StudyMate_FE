const LOCAL_API_ORIGIN = 'https://localhost:7259'

const normalizeBaseUrl = (value?: string): string => {
  const trimmed = value?.trim()
  if (!trimmed) return LOCAL_API_ORIGIN
  return trimmed.replace(/\/+$/, '')
}

const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL)

const rewriteApiUrl = (url: string): string => {
  if (!url.startsWith(LOCAL_API_ORIGIN)) {
    return url
  }

  return `${API_BASE_URL}${url.slice(LOCAL_API_ORIGIN.length)}`
}

declare global {
  interface Window {
    __STUDYMATE_FETCH_REWRITTEN__?: boolean
  }
}

export const setupApiBaseUrlRewrite = (): void => {
  if (window.__STUDYMATE_FETCH_REWRITTEN__) {
    return
  }

  const originalFetch = window.fetch.bind(window)

  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    if (typeof input === 'string') {
      return originalFetch(rewriteApiUrl(input), init)
    }

    if (input instanceof URL) {
      return originalFetch(new URL(rewriteApiUrl(input.toString())), init)
    }

    const rewrittenUrl = rewriteApiUrl(input.url)
    if (rewrittenUrl !== input.url) {
      return originalFetch(new Request(rewrittenUrl, input), init)
    }

    return originalFetch(input, init)
  }

  window.__STUDYMATE_FETCH_REWRITTEN__ = true
}
