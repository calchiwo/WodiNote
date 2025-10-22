"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import SearchBar from "@/components/search-bar"
import FloatingButton from "@/components/floating-button"
import NoteEditor from "@/components/note-editor"
import NoteCard from "@/components/note-card"
import { getDeviceKey } from "@/lib/device-key"
import { encryptText, decryptText, type EncryptedData } from "@/lib/crypto"
import { useToast, ToastContainer } from "@/components/toast"
import EmptyState from "@/components/empty-state"

interface EncryptedNote {
  id: string
  title: EncryptedData
  content: EncryptedData
  createdAt: Date
  isPinned?: boolean
}

interface DecryptedNote {
  id: string
  title: string
  content: string
  createdAt: Date
  isPinned?: boolean
}

export default function Home() {
  const [encryptedNotes, setEncryptedNotes] = useState<EncryptedNote[]>([])
  const [decryptedNotes, setDecryptedNotes] = useState<DecryptedNote[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [deviceKey, setDeviceKey] = useState<CryptoKey | null>(null)
  const [editingNote, setEditingNote] = useState<DecryptedNote | null>(null)
  const { toasts, addToast, removeToast } = useToast()

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Get or create device key
        const key = await getDeviceKey()
        setDeviceKey(key)

        // Load encrypted notes from localStorage
        const stored = localStorage.getItem("wodinote_encrypted_notes")
        if (stored) {
          const notes: EncryptedNote[] = JSON.parse(stored)
          setEncryptedNotes(notes)

          // Decrypt all notes for display
          const decrypted = await Promise.all(
            notes.map(async (note) => ({
              id: note.id,
              title: await decryptText(note.title, key),
              content: await decryptText(note.content, key),
              createdAt: new Date(note.createdAt),
              isPinned: note.isPinned,
            })),
          )
          setDecryptedNotes(decrypted)
        }
      } catch (error) {
        console.error("[v0] Error initializing app:", error)
        addToast("Failed to load notes", "error")
      } finally {
        setIsLoading(false)
      }
    }

    initializeApp()
  }, [])

  const filteredNotes = decryptedNotes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const pinnedNotes = filteredNotes.filter((note) => note.isPinned)
  const unpinnedNotes = filteredNotes.filter((note) => !note.isPinned)
  const sortedNotes = [...pinnedNotes, ...unpinnedNotes]

  const handleSaveNote = async (title: string, content: string) => {
    if (!deviceKey) return

    try {
      const [encryptedTitle, encryptedContent] = await Promise.all([
        encryptText(title, deviceKey),
        encryptText(content, deviceKey),
      ])

      if (editingNote) {
        // Update existing note
        const updatedEncrypted = encryptedNotes.map((note) =>
          note.id === editingNote.id
            ? {
                ...note,
                title: encryptedTitle,
                content: encryptedContent,
              }
            : note,
        )
        const updatedDecrypted = decryptedNotes.map((note) =>
          note.id === editingNote.id
            ? {
                ...note,
                title,
                content,
              }
            : note,
        )

        setEncryptedNotes(updatedEncrypted)
        setDecryptedNotes(updatedDecrypted)
        localStorage.setItem("wodinote_encrypted_notes", JSON.stringify(updatedEncrypted))
        setEditingNote(null)
        addToast("Note updated successfully", "success")
      } else {
        // Create new note
        const newEncryptedNote: EncryptedNote = {
          id: Date.now().toString(),
          title: encryptedTitle,
          content: encryptedContent,
          createdAt: new Date(),
          isPinned: false,
        }

        const updatedEncrypted = [newEncryptedNote, ...encryptedNotes]
        setEncryptedNotes(updatedEncrypted)

        // Save to localStorage
        localStorage.setItem("wodinote_encrypted_notes", JSON.stringify(updatedEncrypted))

        // Add decrypted version to display
        const newDecryptedNote: DecryptedNote = {
          id: newEncryptedNote.id,
          title,
          content,
          createdAt: newEncryptedNote.createdAt,
          isPinned: false,
        }
        setDecryptedNotes([newDecryptedNote, ...decryptedNotes])
        addToast("Note created successfully", "success")
      }

      setIsEditorOpen(false)
    } catch (error) {
      console.error("[v0] Error saving note:", error)
      addToast("Failed to save note", "error")
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    try {
      const updatedEncrypted = encryptedNotes.filter((note) => note.id !== noteId)
      const updatedDecrypted = decryptedNotes.filter((note) => note.id !== noteId)

      setEncryptedNotes(updatedEncrypted)
      setDecryptedNotes(updatedDecrypted)

      // Persist deletion to localStorage
      localStorage.setItem("wodinote_encrypted_notes", JSON.stringify(updatedEncrypted))
      addToast("Note deleted", "success")
    } catch (error) {
      console.error("[v0] Error deleting note:", error)
      addToast("Failed to delete note", "error")
    }
  }

  const handlePinNote = async (noteId: string) => {
    try {
      const updatedEncrypted = encryptedNotes.map((note) =>
        note.id === noteId ? { ...note, isPinned: !note.isPinned } : note,
      )
      const updatedDecrypted = decryptedNotes.map((note) =>
        note.id === noteId ? { ...note, isPinned: !note.isPinned } : note,
      )

      setEncryptedNotes(updatedEncrypted)
      setDecryptedNotes(updatedDecrypted)

      // Persist to localStorage
      localStorage.setItem("wodinote_encrypted_notes", JSON.stringify(updatedEncrypted))
      const isPinned = updatedDecrypted.find((n) => n.id === noteId)?.isPinned
      addToast(isPinned ? "Note pinned" : "Note unpinned", "success")
    } catch (error) {
      console.error("[v0] Error pinning note:", error)
      addToast("Failed to update note", "error")
    }
  }

  const handleEditNote = (note: DecryptedNote) => {
    setEditingNote(note)
    setIsEditorOpen(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading your notes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        {decryptedNotes.length === 0 ? (
          <EmptyState onAddNote={() => setIsEditorOpen(true)} />
        ) : sortedNotes.length === 0 ? (
          <div className="text-center animate-in fade-in duration-300">
            <p className="text-muted-foreground text-lg">No notes match your search</p>
          </div>
        ) : (
          <div className="w-full max-w-2xl">
            <div className="grid gap-4">
              {sortedNotes.map((note) => (
                <article key={note.id}>
                  <NoteCard note={note} onDelete={handleDeleteNote} onEdit={handleEditNote} onPin={handlePinNote} />
                </article>
              ))}
            </div>
          </div>
        )}
      </main>

      {isEditorOpen && (
        <NoteEditor
          onSave={handleSaveNote}
          onClose={() => {
            setIsEditorOpen(false)
            setEditingNote(null)
          }}
          initialTitle={editingNote?.title}
          initialContent={editingNote?.content}
          isEditing={!!editingNote}
        />
      )}

      <FloatingButton onClick={() => setIsEditorOpen(true)} />

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  )
}
