import React from 'react'
import { afterEach, expect, it, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { MarkdownPreview } from '@/components/markdown-preview'

afterEach(() => vi.unstubAllGlobals())

it('server-side code normalization decodes HTML entities only once', () => {
  vi.stubGlobal('window', undefined)
  vi.stubGlobal('React', React)
  const html = renderToStaticMarkup(
    <MarkdownPreview content={'<pre><code class="language-html">&amp;lt;script&amp;gt;</code></pre>'} />,
  )
  const container = document.createElement('div')
  container.innerHTML = html
  expect(container.querySelector('code')?.textContent).toBe('&lt;script&gt;')
  expect(container.querySelector('script')).toBeNull()
})
