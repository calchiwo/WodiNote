"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Trash2, Pin } from "lucide-react"
import NoteMenu from "./note-menu"

interface Note {
  id: string
  title: string
  content: string
  createdAt: Date
  isPinned?: boolean
}

interface NoteCardProps {
  note: Note
  onDelete?: (noteId: string) => void
  onEdit?: (note: Note) => void
  onPin?: (noteId: string) => void
}

export default function NoteCard({ note, onDelete, onEdit, onPin }: NoteCardProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [swipeOffset, setSwipeOffset] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const touchStartX = useRef(0)
  const touchStartTime = useRef(0)
  const isSwiping = useRef(false)

  const formatDateTime = (date: Date) => {
    const dateObj = new Date(date)
    const dateStr = dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    const timeStr = dateObj.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    return `${dateStr} • ${timeStr}`
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartTime.current = Date.now()
    isSwiping.current = false
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentX = e.touches[0].clientX
    const diff = touchStartX.current - currentX

    // Only consider it a swipe if movement is significant
    if (Math.abs(diff) > 10) {
      isSwiping.current = true
      if (diff > 0) {
        setSwipeOffset(Math.min(diff, 80))
      }
    }
  }

  const handleTouchEnd = () => {
    if (swipeOffset > 60) {
      setIsDeleting(true)
      setTimeout(() => {
        onDelete?.(note.id)
      }, 300)
    } else {
      setSwipeOffset(0)
    }
    isSwiping.current = false
  }

  const handleCardTap = () => {
    // Only open menu if not swiping
    if (!isSwiping.current && swipeOffset === 0) {
      setShowMenu(true)
    }
  }

  const handleDeleteClick = () => {
    setIsDeleting(true)
    setTimeout(() => {
      onDelete?.(note.id)
    }, 300)
  }

  return (
    <>
      <div
        className={`relative overflow-hidden rounded-lg transition-all duration-300 ${
          isDeleting ? "animate-out fade-out slide-out-to-right-1-2" : "animate-in fade-in"
        }`}
      >
        {/* Delete background */}
        <div className="absolute inset-0 bg-red-500/90 flex items-center justify-end pr-4 rounded-lg">
          <Trash2 className="w-5 h-5 text-white" />
        </div>

        {/* Card content */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={handleCardTap}
          onPointerDown={() => {
            // Reset swipe state on new pointer down
            setSwipeOffset(0)
            isSwiping.current = false
          }}
          style={{ transform: `translateX(-${swipeOffset}px)` }}
          className="bg-card border border-border rounded-lg p-4 text-card-foreground hover:border-green-500 transition-all duration-200 cursor-pointer active:scale-95 select-none"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              {note.isPinned && (
                <div className="flex items-center gap-1 mb-2">
                  <Pin className="w-4 h-4 text-green-500 fill-green-500" />
                  <p className="text-xs text-green-500 font-semibold">PINNED</p>
                </div>
              )}
              <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{note.title || "Untitled"}</h3>
              <p className="text-muted-foreground text-sm mb-3 line-clamp-3">{note.content}</p>
              <p className="text-xs text-muted-foreground">{formatDateTime(note.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>

      {showMenu && (
        <NoteMenu
          noteId={note.id}
          isPinned={note.isPinned || false}
          onEdit={() => onEdit?.(note)}
          onPin={() => onPin?.(note.id)}
          onDelete={handleDeleteClick}
          onClose={() => {
            setShowMenu(false)
            setSwipeOffset(0)
          }}
        />
      )}
    </>
  )
}
