'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect } from 'react'

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
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
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

  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!editor) return null

  const addImage = () => {
    const url = prompt('Enter image URL:')
    if (url) editor.chain().focus().setImage({ src: url }).run()
  }

  const addLink = () => {
    const url = prompt('Enter link URL:')
    if (url) editor.chain().focus().setLink({ href: url }).run()
  }

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
        <div className="w-px bg-gray-200 dark:bg-gray-700 mx-1" />
        <MenuButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">
          ─
        </MenuButton>
        <MenuButton onClick={addImage} title="Insert Image">
          🖼
        </MenuButton>
        <MenuButton onClick={addLink} active={editor.isActive('link')} title="Insert Link">
          🔗
        </MenuButton>
      </div>

      {/* Editor Content */}
      <div className="p-4 sm:p-6">
        <EditorContent editor={editor} />
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-400">
        <span>{editor.storage.characterCount?.characters?.() || editor.getText().length} characters</span>
        <span>~{Math.max(1, Math.ceil(editor.getText().split(/\s+/).filter(Boolean).length / 200))} min read</span>
      </div>
    </div>
  )
}
