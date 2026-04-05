'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

const MenuButton = ({ onClick, active, children, title }) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-2 rounded-lg text-sm transition-colors ${
      active
        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
        : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300'
    }`}
    title={title}
  >
    {children}
  </button>
)

export default function Editor({ content, onUpdate }) {
  // FIX: Guard prevents cursor-jump infinite loop
  const initialised = useRef(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: false,
        codeBlock: {
          HTMLAttributes: { class: 'relative' },
        },
      }),
      Image.configure({
        HTMLAttributes: { class: 'rounded-lg my-6 w-full' },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-blue-600 dark:text-blue-400 underline' },
      }),
      Placeholder.configure({
        placeholder: 'Start writing your story...',
      }),
    ],
    content: content || '',
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      if (onUpdate) onUpdate(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose-content min-h-[400px] focus:outline-none px-1',
      },
    },
  })

  // Only seed content once (edit page loading a saved draft)
  useEffect(() => {
    if (!editor || !content) return
    if (initialised.current) return
    if (editor.getHTML() === content) return
    editor.commands.setContent(content, false)
    initialised.current = true
  }, [content, editor])

  // FEAT: Add copy button to code blocks after render
  useEffect(() => {
    if (!editor) return
    const addCopyButtons = () => {
      const codeBlocks = document.querySelectorAll('.tiptap pre')
      codeBlocks.forEach(pre => {
        if (pre.querySelector('.copy-code-btn')) return
        const btn = document.createElement('button')
        btn.className = 'copy-code-btn absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 rounded transition-colors'
        btn.textContent = 'Copy'
        btn.addEventListener('click', () => {
          const code = pre.querySelector('code')?.textContent || ''
          navigator.clipboard.writeText(code)
          btn.textContent = 'Copied!'
          setTimeout(() => { btn.textContent = 'Copy' }, 2000)
        })
        pre.style.position = 'relative'
        pre.appendChild(btn)
      })
    }
    const observer = new MutationObserver(addCopyButtons)
    const editorEl = document.querySelector('.tiptap')
    if (editorEl) observer.observe(editorEl, { childList: true, subtree: true })
    addCopyButtons()
    return () => observer.disconnect()
  }, [editor])

  const [uploading, setUploading] = useState(false)
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const fileInputRef = useRef(null)

  if (!editor) return null

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (res.ok && data.url) {
        editor.chain().focus().setImage({ src: data.url }).run()
        toast.success('Image uploaded!')
      } else {
        toast.error('Upload failed: ' + (data.error || 'Unknown error'))
      }
    } catch (err) {
      toast.error('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const toggleLink = () => {
    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run()
      return
    }
    setLinkUrl(editor.getAttributes('link').href || '')
    setShowLinkInput(true)
  }

  const setLink = () => {
    if (linkUrl) editor.chain().focus().setLink({ href: linkUrl }).run()
    setShowLinkInput(false)
    setLinkUrl('')
  }

  const charCount = editor.getText().length
  const wordCount = editor.getText().split(/\s+/).filter(Boolean).length
  const readMins = Math.max(1, Math.ceil(wordCount / 200))

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-900">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
          <strong>B</strong>
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
          <em>I</em>
        </MenuButton>
        <div className="w-px bg-gray-200 dark:bg-gray-700 mx-1" />
        <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2">
          H2
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3">
          H3
        </MenuButton>
        <div className="w-px bg-gray-200 dark:bg-gray-700 mx-1" />
        <MenuButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote">
          ❝
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List">
          •≡
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered List">
          1.
        </MenuButton>
        {/* FEAT: Code block button */}
        <MenuButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code Block">
          {'</>'}
        </MenuButton>
        <div className="w-px bg-gray-200 dark:bg-gray-700 mx-1" />
        <MenuButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">
          ─
        </MenuButton>
        <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleUpload} />
        <MenuButton onClick={() => fileInputRef.current?.click()} title="Upload Image" active={uploading}>
          {uploading ? '⏳' : '🖼'}
        </MenuButton>
        <div className="relative flex items-center">
          <MenuButton onClick={toggleLink} active={editor.isActive('link')} title="Insert Link">
            🔗
          </MenuButton>
          {showLinkInput && (
            <div className="absolute top-full left-0 mt-2 z-50 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl flex gap-2 min-w-[280px]">
              <input
                type="url"
                value={linkUrl}
                onChange={e => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                autoFocus
                onKeyDown={e => { if (e.key === 'Enter') setLink(); if (e.key === 'Escape') setShowLinkInput(false) }}
                className="flex-1 px-2 py-1 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button onClick={setLink} className="px-2 py-1 bg-emerald-500 text-white text-xs font-bold rounded hover:bg-emerald-600">
                Set
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Editor Content */}
      <div className="p-4 sm:p-6">
        <EditorContent editor={editor} />
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-400">
        <span>{charCount} characters · {wordCount} words</span>
        <span>~{readMins} min read</span>
      </div>
    </div>
  )
}
