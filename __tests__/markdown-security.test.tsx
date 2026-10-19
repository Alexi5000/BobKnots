import React from 'react'
import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { parse } from 'create-markdown'
import { BlockRenderer } from 'create-markdown/react'
import { secureMarkdownBlocks, safeMarkdownUrl } from '../lib/markdown-security'

function render(markdown: string) {
  const element = document.createElement('div')
  element.innerHTML = renderToStaticMarkup(<BlockRenderer blocks={secureMarkdownBlocks(parse(markdown))} />)
  return element
}

describe('markdown renderer URL boundary', () => {
  it('rejects browser-normalized executable schemes and protocol-relative credentials', () => {
    for (const value of ['JaVaScRiPt:alert(1)', 'java\nscript:alert(1)', '\tjavascript:alert(1)', '//user:password@example.com/path']) {
      expect(safeMarkdownUrl(value)).toBe(false)
    }
    for (const value of ['./guide.md', '#heading', 'https://example.com/image.png']) {
      expect(safeMarkdownUrl(value)).toBe(true)
    }
    expect(safeMarkdownUrl('https://example.com/image.png', true)).toBe(true)
    expect(safeMarkdownUrl('mailto:a@example.com', true)).toBe(false)
    const element = render('![safe](https://example.com/image.png)\n\n[section](#heading) [relative](./guide.md)')
    expect(element.querySelector('img')?.getAttribute('src')).toBe('https://example.com/image.png')
    expect(Array.from(element.querySelectorAll('a')).map((anchor) => anchor.getAttribute('href'))).toEqual(['#heading', './guide.md'])
  })
  it.each(['data:text/html,payload', 'file:///etc/passwd', 'vbscript:alert', 'javascript:alert', 'https://user:password@example.com'])('removes active link destination %s while preserving text', (url) => {
    const element = render(`[label](${url})`)
    expect(element.querySelector('a')).toBeNull()
    expect(element.textContent).toBe('label')
  })
  it('filters links in nested lists and image sources', () => {
    const element = render('- [outer](file:///etc/passwd)\n  - [inner](data:text/html,payload)\n\n![image](file:///etc/passwd)')
    expect(element.querySelector('a')).toBeNull()
    expect(element.querySelector('img')?.getAttribute('src')).toBeNull()
  })
  it('preserves ordinary navigation, formatting and code examples', () => {
    const element = render('# Heading\n\n**bold** and [site](https://example.com/path) [local](./guide.md) [mail](mailto:a@example.com)\n\n```html\n<img src=x onerror=alert(1)>\n```')
    expect(element.querySelector('h1')?.textContent).toBe('Heading')
    expect(element.querySelector('strong')?.textContent).toBe('bold')
    expect(element.querySelectorAll('a')).toHaveLength(3)
    expect(element.querySelector('pre code')?.textContent).toBe('<img src=x onerror=alert(1)>')
    expect(element.querySelector('[onerror]')).toBeNull()
  })
})
