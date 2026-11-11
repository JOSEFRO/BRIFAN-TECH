import type { ReactNode } from 'react'

type GuideMarkdownProps = { content: string }

function renderInline(value: string): ReactNode[] {
  return value.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).filter(Boolean).map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={index}>{part.slice(1, -1)}</code>
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>
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

    if (line.startsWith('```')) {
      const code: string[] = []
      index += 1
      while (index < lines.length && !lines[index].trim().startsWith('```')) {
        code.push(lines[index])
        index += 1
      }
      if (index < lines.length) index += 1
      blocks.push(<pre key={blocks.length}><code>{code.join('\n')}</code></pre>)
      continue
    }

    const video = line.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
    if (video) {
      blocks.push(<div className="article-video" key={blocks.length}><iframe src={'https://www.youtube-nocookie.com/embed/' + video[1]} title="Video de YouTube" loading="lazy" allow="accelerometer; encrypted-media; picture-in-picture" allowFullScreen /></div>)
      index += 1
      continue
    }

    const image = line.match(/^!\[([^\]]*)\]\((https?:\/\/[^)]+)\)$/)
    if (image) {
      blocks.push(<figure key={blocks.length}><img className="article-inline-image" src={image[2]} alt={image[1]} loading="lazy" decoding="async" /></figure>)
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
      blocks.push(<div className="guide-table-wrap" key={blocks.length}><table><thead><tr>{headers.map((cell, cellIndex) => <th key={cellIndex}>{renderInline(cell)}</th>)}</tr></thead><tbody>{rows.map((row, rowIndex) => <tr key={rowIndex}>{headers.map((_, cellIndex) => <td key={cellIndex}>{renderInline(row[cellIndex] ?? '')}</td>)}</tr>)}</tbody></table></div>)
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
    while (index < lines.length && lines[index].trim() && !/^(#{1,3})\s+/.test(lines[index].trim()) && !lines[index].trim().startsWith('```') && !/^[-*]\s+/.test(lines[index].trim()) && !/^\d+\.\s+/.test(lines[index].trim()) && !lines[index].trim().startsWith('|')) {
      paragraph.push(lines[index].trim())
      index += 1
    }
    blocks.push(<p key={blocks.length}>{renderInline(paragraph.join(' '))}</p>)
  }

  return <div className="guide-markdown">{blocks}</div>
}
