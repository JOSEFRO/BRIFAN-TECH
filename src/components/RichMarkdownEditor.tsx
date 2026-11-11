import { useEffect } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import { Markdown } from '@tiptap/markdown'
import { Bold, Code2, Heading1, Heading2, Heading3, ImagePlus, Italic, Link2, List, ListOrdered, Minus, Quote, Redo2, Underline as UnderlineIcon, Undo2, Video } from 'lucide-react'

type Props = {
  value: string
  onChange: (value: string) => void
}

export default function RichMarkdownEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false, autolink: true, protocols: ['http', 'https'] }),
      Image.configure({ allowBase64: false, inline: false }),
      Markdown,
    ],
    content: value || '',
    contentType: 'markdown',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'brifan-prose-editor',
        'aria-label': 'Editor visual de contenido técnico',
        spellcheck: 'true',
      },
    },
    onUpdate: ({ editor: current }) => onChange(current.getMarkdown()),
  })

  useEffect(() => {
    if (editor && editor.getMarkdown() !== value) {
      editor.commands.setContent(value || '', { contentType: 'markdown', emitUpdate: false })
    }
  }, [editor, value])

  if (!editor) return <div className="brifan-editor-loading">Preparando editor…</div>

  const insertMarkdown = (markdown: string) => {
    editor.chain().focus().insertContent(markdown, { contentType: 'markdown' }).run()
  }
  const toolbar = [
    { label: 'Título 1', icon: Heading1, run: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive('heading', { level: 1 }) },
    { label: 'Título 2', icon: Heading2, run: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }) },
    { label: 'Título 3', icon: Heading3, run: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive('heading', { level: 3 }) },
    { label: 'Negrita', icon: Bold, run: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold') },
    { label: 'Cursiva', icon: Italic, run: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic') },
    { label: 'Subrayado', icon: UnderlineIcon, run: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive('underline') },
    { label: 'Lista', icon: List, run: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList') },
    { label: 'Lista numerada', icon: ListOrdered, run: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive('orderedList') },
    { label: 'Cita', icon: Quote, run: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive('blockquote') },
    { label: 'Código', icon: Code2, run: () => editor.chain().focus().toggleCodeBlock().run(), active: editor.isActive('codeBlock') },
    { label: 'Separador', icon: Minus, run: () => editor.chain().focus().setHorizontalRule().run(), active: false },
  ]

  return (
    <div className="brifan-rich-editor">
      <div className="brifan-editor-toolbar" role="toolbar" aria-label="Formato del contenido">
        {toolbar.map(({ label, icon: Icon, run, active }) => (
          <button type="button" key={label} title={label} aria-label={label} aria-pressed={active} className={active ? 'is-active' : ''} onClick={run}><Icon size={16}/></button>
        ))}
        <span className="brifan-toolbar-divider"/>
        <button type="button" title="Deshacer" aria-label="Deshacer" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}><Undo2 size={16}/></button>
        <button type="button" title="Rehacer" aria-label="Rehacer" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}><Redo2 size={16}/></button>
        <button type="button" title="Insertar enlace" aria-label="Insertar enlace" onClick={() => { const href = window.prompt('Pega el enlace HTTPS'); if (href && /^https:\/\//i.test(href)) editor.chain().focus().extendMarkRange('link').setLink({ href }).run() }}><Link2 size={16}/></button>
        <button type="button" title="Insertar imagen" aria-label="Insertar imagen" onClick={() => { const src = window.prompt('Pega el enlace HTTPS directo de la imagen'); if (src && /^https:\/\//i.test(src)) insertMarkdown('![Descripción de la imagen](' + src + ')') }}><ImagePlus size={16}/></button>
        <button type="button" title="Insertar video de YouTube" aria-label="Insertar video de YouTube" onClick={() => { const url = window.prompt('Pega el enlace de YouTube'); if (url && /^(https:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/i.test(url)) insertMarkdown('\n' + url + '\n') }}><Video size={16}/></button>
      </div>
      <EditorContent editor={editor}/>
      <div className="brifan-editor-footer"><span>EDITOR VISUAL · MARKDOWN · AUTOCOMPATIBLE</span><span>{editor.getText().trim() ? editor.getText().trim().split(/\s+/).length : 0} palabras · {Math.max(1, Math.ceil(editor.getText().trim().split(/\s+/).filter(Boolean).length / 200))} min de lectura</span></div>
    </div>
  )
}
