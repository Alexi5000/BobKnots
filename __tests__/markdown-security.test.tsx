import React from 'react'
import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { parse } from 'create-markdown'
import { BlockRenderer } from 'create-markdown/react'
import { secureMarkdownBlocks } from '../lib/markdown-security'

function render(markdown: string) {
  const element = document.createElement('div')
  element.innerHTML = renderToStaticMarkup(<BlockRenderer blocks={secureMarkdownBlocks(parse(markdown))} />)
  return element
}

describe('markdown renderer URL boundary', () => {
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
