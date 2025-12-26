"use client"

import { useState } from "react"
import { X, Edit2, Pin, Trash2 } from "lucide-react"

interface NoteMenuProps {
  noteId: string
  isPinned: boolean
  onEdit: () => void
  onPin: () => void
  onDelete: () => void
  onClose: () => void
}

export default function NoteMenu({ noteId, isPinned, onEdit, onPin, onDelete, onClose }: NoteMenuProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleDelete = () => {
    setShowDeleteConfirm(true)
  }

  const confirmDelete = () => {
    onDelete()
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end animate-in fade-in duration-200" onClick={onClose}>
        <div
          className="w-full bg-card border-t border-border rounded-t-2xl p-4 animate-in slide-in-from-bottom-4 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Note Options</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-muted rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
          </div>

          {/* Menu options */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                onEdit()
                onClose()
              }}
              className="w-full px-4 py-3 text-left bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-all duration-200 font-medium flex items-center gap-3 active:scale-95"
            >
              <Edit2 className="w-5 h-5" />
              Edit
            </button>
            <button
              onClick={() => {
                onPin()
                onClose()
              }}
              className="w-full px-4 py-3 text-left bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-all duration-200 font-medium flex items-center gap-3 active:scale-95"
            >
              <Pin className="w-5 h-5" />
              {isPinned ? "Unpin" : "Pin"}
            </button>
            <button
              onClick={handleDelete}
              className="w-full px-4 py-3 text-left bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-all duration-200 font-medium flex items-center gap-3 active:scale-95"
            >
              <Trash2 className="w-5 h-5" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-sm mx-4 animate-in zoom-in-95 duration-300">
            <h3 className="text-lg font-semibold text-foreground mb-2">Delete Note?</h3>
            <p className="text-muted-foreground mb-6">
              This action cannot be undone. Your note will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
