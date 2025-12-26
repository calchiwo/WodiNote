"use client"

import { Plus } from "lucide-react"

interface EmptyStateProps {
  onAddNote: () => void
}

export default function EmptyState({ onAddNote }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-in fade-in duration-500">
      <div className="mb-6 p-4 bg-green-500/10 rounded-full">
        <Plus className="w-12 h-12 text-green-500" />
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-2 text-center">No notes yet</h2>
      <p className="text-muted-foreground text-center mb-6 max-w-xs">
        Start creating your first encrypted note. Your notes are private and secure.
      </p>
      <button
        onClick={onAddNote}
        className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95"
      >
        Create First Note
      </button>
    </div>
  )
}
