"use client"

import { useState, useEffect } from "react"
import { X, Save } from "lucide-react"

interface NoteEditorProps {
  onSave: (title: string, content: string) => void
  onClose: () => void
  initialTitle?: string
  initialContent?: string
  isEditing?: boolean
}

export default function NoteEditor({
  onSave,
  onClose,
  initialTitle = "",
  initialContent = "",
  isEditing = false,
}: NoteEditorProps) {
  const [title, setTitle] = useState(initialTitle)
  const [content, setContent] = useState(initialContent)

  useEffect(() => {
    setTitle(initialTitle)
    setContent(initialContent)
  }, [initialTitle, initialContent])

  const handleSave = () => {
    if (title.trim() || content.trim()) {
      onSave(title, content)
    }
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col animate-in slide-in-from-bottom-full duration-300">
      {/* Header with close and save buttons */}
      <div className="flex items-center justify-between bg-card border-b border-border px-4 py-3 shadow-sm">
        <button
          onClick={onClose}
          className="p-2 hover:bg-muted rounded-lg transition-colors active:scale-95"
          aria-label="Close editor"
        >
          <X className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">{isEditing ? "Edit Note" : "New Note"}</h1>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 active:scale-95"
        >
          <Save className="w-4 h-4" />
          Save
        </button>
      </div>

      {/* Title input */}
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="bg-background text-foreground placeholder-muted-foreground px-4 py-3 border-b border-border outline-none text-lg font-medium transition-colors focus:bg-card/50"
      />

      {/* Note textarea */}
      <textarea
        placeholder="Note"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 bg-background text-foreground placeholder-muted-foreground px-4 py-3 outline-none resize-none transition-colors focus:bg-card/50"
      />
    </div>
  )
}
