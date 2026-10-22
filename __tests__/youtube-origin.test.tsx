import React from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, render } from '@testing-library/react'
import { YouTubePlugin, useYouTubeEngine } from '../components/plugins/youtube/youtube-plugin'
const plugins = vi.hoisted(() => ({ registerPlugin: vi.fn(), unregisterPlugin: vi.fn() }))
vi.mock('@/context/plugin-context', () => ({ usePlugins: () => plugins }))
vi.mock('../components/plugins/youtube/youtube-player', () => ({ YouTubePlayer: () => null }))
vi.mock('../components/plugins/youtube/youtube-settings', () => ({ YouTubeSettings: () => null }))
vi.mock('../components/plugins/youtube/youtube-status-bar', () => ({ YouTubeStatusBar: () => null }))
function State() {
  const engine = useYouTubeEngine()
  return <output>{engine.isPlaying ? 'playing' : 'paused'}</output>
}
afterEach(() => { cleanup(); localStorage.clear() })
describe('YouTube message identity', () => {
  it('accepts playback state only from its own trusted iframe', () => {
    localStorage.setItem('knot:youtube-playlist', JSON.stringify({ type: 'video', id: 'abc123', url: '', label: 'Test' }))
    const view = render(<><YouTubePlugin /><State /></>)
    const frame = view.container.querySelector('iframe')!
    const send = (origin: string, source: MessageEventSource | null) => act(() => {
      window.dispatchEvent(new MessageEvent('message', { origin, source, data: JSON.stringify({ event: 'infoDelivery', info: { playerState: 2 } }) }))
    })
    expect(view.container.querySelector('output')?.textContent).toBe('playing')
    send('https://attacker.example', frame.contentWindow)
    send('https://www.youtube-nocookie.com.attacker.example', frame.contentWindow)
    send('https://www.youtube-nocookie.com', window)
    send('https://www.youtube-nocookie.com', null)
    expect(view.container.querySelector('output')?.textContent).toBe('playing')
    send('https://www.youtube-nocookie.com', frame.contentWindow)
    expect(view.container.querySelector('output')?.textContent).toBe('paused')
  })
})
