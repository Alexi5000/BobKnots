import { describe, it, expect, beforeEach } from 'vitest'
import { safePreviewUrl, safeSpotifyHandoff } from '../lib/safe-navigation'
import { storeDeviceToken, loadDeviceToken } from '../lib/device-auth'

describe('untrusted navigation and token keys', () => {
  beforeEach(() => localStorage.clear())
  it('permits HTTP development previews and rejects executable schemes', () => {
    expect(safePreviewUrl('http://localhost:3000/page')).toBe('http://localhost:3000/page')
    for (const value of [
      'javascript:alert(1)',
      'data:text/html,<script>alert(1)</script>',
      'file:///etc/passwd',
      'https://user:pass@example.com',
      'invalid',
    ]) {
      expect(safePreviewUrl(value)).toBeNull()
    }
  })
  it('limits handoffs to the Spotify authorization endpoint', () => {
    expect(safeSpotifyHandoff('https://accounts.spotify.com/authorize?client_id=example')).toBe(
      'https://accounts.spotify.com/authorize?client_id=example',
    )
    for (const value of [
      'https://accounts.spotify.com.attacker.test/authorize',
      'https://attacker.test/accounts.spotify.com',
      'javascript:alert(1)',
      'https://accounts.spotify.com/other',
      'https://user@accounts.spotify.com/authorize',
    ]) {
      expect(safeSpotifyHandoff(value)).toBeNull()
    }
  })
  it('stores hostile property names as own data without modifying prototypes', () => {
    storeDeviceToken('__proto__', 'role', 'example', [])
    expect(loadDeviceToken('__proto__', 'role')).toBe('example')
    expect(Object.hasOwn(Object.prototype, 'role')).toBe(false)
    storeDeviceToken('device', '__proto__', 'second', [])
    expect(loadDeviceToken('device', '__proto__')).toBe('second')
    expect(loadDeviceToken('toString', 'role')).toBeNull()
  })
})
