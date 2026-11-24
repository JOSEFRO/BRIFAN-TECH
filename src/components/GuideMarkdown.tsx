import type { ReactNode } from 'react'

type GuideMarkdownProps = { content: string }

function safeHttpUrl(value: string, httpsOnly = false): string | null {
  try {
    const url = new URL(value)
    const allowed = httpsOnly ? ['https:'] : ['https:', 'http:']
    if (!allowed.includes(url.protocol) || url.username || url.password) return null
    return url.toString()
  } catch {
    return null
  }
}

function youtubeVideoId(value: string): string | null {
  try {
    const url = new URL(value)
    const host = url.hostname.toLowerCase().replace(/^www\./, '')
    let id = ''
    if (host === 'youtu.be') {
      id = url.pathname.split('/').filter(Boolean)[0] ?? ''
    } else if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
      if (url.pathname === '/watch') id = url.searchParams.get('v') ?? ''
      else if (/^\/(shorts|embed)\//.test(url.pathname)) id = url.pathname.split('/')[2] ?? ''
    }
    return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null
  } catch {
    return null
  }
}

function renderInline(value: string): ReactNode[] {
  const tokenPattern = /(\[[^\]]+\]\(https?:\/\/[^)\s]+\)|\x60[^\x60]+\x60|\*\*[^*]+\*\*|\*[^*]+\*)/g
  return value.split(tokenPattern).filter(Boolean).map((part, index) => {
    const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/)
    if (link) {
      const href = safeHttpUrl(link[2])
      return href
        ? <a key={index} href={href} target="_blank" rel="noopener noreferrer">{link[1]}</a>
        : link[1]
    }
    if (part.startsWith('\x60') && part.endsWith('\x60')) {
      return <code key={index}>{part.slice(1, -1)}</code>
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={index}>{part.slice(1, -1)}</em>
    }
    return part
  })
}

function cells(line: string) {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(cell => cell.trim())
}

export default function GuideMarkdown({ content }: GuideMarkdownProps) {
  const lines = content.replace(/\r/g, '').split('\n')
  const blocks: ReactNode[] = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index].trim()
    if (!line) { index += 1; continue }

    if (line.startsWith('\x60\x60\x60')) {
      const code: string[] = []
      index += 1
      while (index < lines.length && !lines[index].trim().startsWith('\x60\x60\x60')) {
        code.push(lines[index])
        index += 1
      }
      if (index < lines.length) index += 1
      blocks.push(<pre key={blocks.length}><code>{code.join('\n')}</code></pre>)
      continue
    }

    const videoId = youtubeVideoId(line)
    if (videoId) {
      blocks.push(
        <div className="article-video" key={blocks.length}>
          <iframe
            src={'https://www.youtube-nocookie.com/embed/' + videoId}
            title={'Video de YouTube ' + videoId}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>,
      )
      index += 1
      continue
    }

    const image = line.match(/^!\[([^\]]*)\]\((https:\/\/[^)\s]+)\)$/)
    if (image) {
      const src = safeHttpUrl(image[2], true)
      if (src) {
        blocks.push(
          <figure key={blocks.length}>
            <img className="article-inline-image" src={src} alt={image[1]} loading="lazy" decoding="async" referrerPolicy="no-referrer" />
          </figure>,
        )
      }
      index += 1
      continue
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/)
    if (heading) {
      const level = heading[1].length
      const text = renderInline(heading[2])
      if (level === 1) blocks.push(<h1 key={blocks.length}>{text}</h1>)
      else if (level === 2) blocks.push(<h2 key={blocks.length}>{text}</h2>)
      else blocks.push(<h3 key={blocks.length}>{text}</h3>)
      index += 1
      continue
    }

    if (line.startsWith('|') && index + 1 < lines.length && /^\s*\|?\s*:?-{3,}/.test(lines[index + 1])) {
      const headers = cells(line)
      index += 2
      const rows: string[][] = []
      while (index < lines.length && lines[index].trim().startsWith('|')) {
        rows.push(cells(lines[index]))
        index += 1
      }
      blocks.push(
        <div className="guide-table-wrap" key={blocks.length}>
          <table>
            <thead><tr>{headers.map((cell, cellIndex) => <th key={cellIndex}>{renderInline(cell)}</th>)}</tr></thead>
            <tbody>{rows.map((row, rowIndex) => <tr key={rowIndex}>{headers.map((_, cellIndex) => <td key={cellIndex}>{renderInline(row[cellIndex] ?? '')}</td>)}</tr>)}</tbody>
          </table>
        </div>,
      )
      continue
    }

    if (/^>\s+/.test(line)) {
      const quote: string[] = []
      while (index < lines.length && /^\s*>\s?/.test(lines[index])) {
        quote.push(lines[index].replace(/^\s*>\s?/, '').trim())
        index += 1
      }
      blocks.push(<blockquote key={blocks.length}>{renderInline(quote.join(' '))}</blockquote>)
      continue
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = []
      while (index < lines.length && /^\s*[-*]\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^\s*[-*]\s+/, '').trim())
        index += 1
      }
      blocks.push(<ul key={blocks.length}>{items.map((item, itemIndex) => <li key={itemIndex}>{renderInline(item)}</li>)}</ul>)
      continue
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = []
      while (index < lines.length && /^\s*\d+\.\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^\s*\d+\.\s+/, '').trim())
        index += 1
      }
      blocks.push(<ol key={blocks.length}>{items.map((item, itemIndex) => <li key={itemIndex}>{renderInline(item)}</li>)}</ol>)
      continue
    }

    const paragraph = [line]
    index += 1
    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^(#{1,3})\s+/.test(lines[index].trim()) &&
      !lines[index].trim().startsWith('\x60\x60\x60') &&
      !/^>\s+/.test(lines[index].trim()) &&
      !/^[-*]\s+/.test(lines[index].trim()) &&
      !/^\d+\.\s+/.test(lines[index].trim()) &&
      !lines[index].trim().startsWith('|')
    ) {
      paragraph.push(lines[index].trim())
      index += 1
    }
    blocks.push(<p key={blocks.length}>{renderInline(paragraph.join(' '))}</p>)
  }

  return <div className="guide-markdown">{blocks}</div>
}
