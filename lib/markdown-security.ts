import type { Block, ImageBlock } from 'create-markdown'

export function safeMarkdownUrl(value: string, image = false): boolean {
  try {
    const url = new URL(value, 'https://markdown.invalid/')
    const protocols = image ? ['http:', 'https:'] : ['http:', 'https:', 'mailto:', 'tel:']
    return protocols.includes(url.protocol) && !url.username && !url.password
  } catch {
    return false
  }
}

export function secureMarkdownBlocks(blocks: Block[]): Block[] {
  return blocks.map((block) => ({
    ...block,
    props:
      block.type === 'image' && !safeMarkdownUrl((block as ImageBlock).props.url, true)
        ? { ...block.props, url: undefined }
        : block.props,
    content: block.content.map((span) => {
      if (!span.styles.link || safeMarkdownUrl(span.styles.link.url)) return span
      const styles = { ...span.styles }
      delete styles.link
      return { ...span, styles }
    }),
    children: secureMarkdownBlocks(block.children),
  })) as Block[]
}
