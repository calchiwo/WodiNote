"use client"

import { getDeferredPrompt, clearDeferredPrompt } from "@/lib/pwa-install"
import { X } from "lucide-react"

interface PWAInstallPromptProps {
  onClose: () => void
}

export default function PWAInstallPrompt({ onClose }: PWAInstallPromptProps) {
  const deferredPrompt = getDeferredPrompt()

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      await deferredPrompt.userChoice
    } catch (error) {
      console.error("[v0] Error during PWA install:", error)
    }

    clearDeferredPrompt()
    onClose()
  }

  if (!deferredPrompt) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-card text-card-foreground rounded-lg shadow-lg max-w-sm w-full animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 pb-6">
          <div className="text-center mb-4">
            <p className="text-2xl mb-2">🎉</p>
            <h2 className="text-xl font-semibold mb-3">
              You just saved your first note!
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Install WodiNote to use it fully offline and keep all your notes private.
            </p>
          </div>

          <button
            onClick={handleInstallClick}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            Install Now ✅
          </button>

          <button
            onClick={onClose}
            className="w-full mt-3 text-muted-foreground hover:text-foreground transition-colors text-sm py-2"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}
