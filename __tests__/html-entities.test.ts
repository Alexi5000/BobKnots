import { describe, expect, it } from 'vitest'
import { decodeHtmlEntities } from '@/lib/html-entities'

describe('markdown HTML entity decoding', () => {
  it('preserves every supported entity conversion', () => {
    expect(decodeHtmlEntities('&amp;&lt;&gt;&quot;&#39;&nbsp;')).toBe('&<>"\' ')
  })

  it('decodes one layer without interpreting newly produced entity syntax', () => {
    expect(decodeHtmlEntities('&amp;lt;script&amp;gt;')).toBe('&lt;script&gt;')
    expect(decodeHtmlEntities('&amp;quot;&amp;#39;&amp;nbsp;&amp;amp;')).toBe(
      '&quot;&#39;&nbsp;&amp;',
    )
  })

  it('preserves literal text, unsupported entities, and incomplete entities', () => {
    expect(decodeHtmlEntities('A & B &unknown; &amp &LT; &#60;')).toBe(
      'A & B &unknown; &amp &LT; &#60;',
    )
  })
})
