export function safePreviewUrl(value: string): string | null {
  try {
    const url = new URL(value)
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null
    return url.href
  } catch {
    return null
  }
}

export function safeSpotifyHandoff(value: string): string | null {
  try {
    const url = new URL(value)
    if (
      url.origin !== 'https://accounts.spotify.com' ||
      url.pathname !== '/authorize' ||
      url.username ||
      url.password
    )
      return null
    return url.href
  } catch {
    return null
  }
}
