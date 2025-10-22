"use client"

import { Plus } from "lucide-react"

interface FloatingButtonProps {
  onClick: () => void
}

export default function FloatingButton({ onClick }: FloatingButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95"
      aria-label="Add new note"
    >
      <Plus className="w-6 h-6" />
    </button>
  )
}
