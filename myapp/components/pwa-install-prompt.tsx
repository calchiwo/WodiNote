"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

interface PWAInstallPromptProps {
  onClose: () => void
}

export default function PWAInstallPrompt({ onClose }: PWAInstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setIsSupported(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === "accepted") {
        setDeferredPrompt(null)
        setIsSupported(false)
      }
    } catch (error) {
      console.error("[v0] Error during PWA install:", error)
    }

    onClose()
  }

  const handleFallbackClick = () => {
    alert(
      'To install WodiNote:\n\n1. Tap the menu (⋮) in your browser\n2. Select "Add to Home Screen"\n3. Confirm the installation\n\nYour notes will be accessible offline!',
    )
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-card text-card-foreground rounded-lg shadow-lg max-w-sm w-full animate-in slide-in-from-bottom-4 duration-300">
        {/* Close button */}
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <div className="text-center mb-4">
            <p className="text-2xl mb-2">🎉</p>
            <h2 className="text-xl font-semibold mb-3">You just saved your first note!</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Install WodiNote to use it fully offline and keep all your notes private.
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={isSupported ? handleInstallClick : handleFallbackClick}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            {isSupported ? "Install Now ✅" : "Add to Home Screen"}
          </button>

          {/* Dismiss option */}
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
