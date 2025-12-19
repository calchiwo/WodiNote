"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

interface PWAInstallPromptProps {
  onClose: () => void
}

export default function PWAInstallPrompt({ onClose }: PWAInstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)

  useEffect(() => {
    // Exit if already installed
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true
    ) {
      onClose()
      return
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setIsInstallable(true)
    }

    const handleAppInstalled = () => {
      setDeferredPrompt(null)
      setIsInstallable(false)
      onClose()
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      )
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [onClose])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      await deferredPrompt.userChoice
    } catch (error) {
      console.error("PWA install error:", error)
    } finally {
      setDeferredPrompt(null)
      setIsInstallable(false)
      onClose()
    }
  }

  // Do not render if install is not possible
  if (!isInstallable) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card text-card-foreground rounded-lg shadow-lg max-w-sm w-full">
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 pb-6 text-center">
          <p className="text-2xl mb-2">🎉</p>
          <h2 className="text-xl font-semibold mb-3">
            You just saved your first note
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Install WodiNote to use it offline and keep all your notes private.
          </p>

          <button
            onClick={handleInstallClick}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Install Now ✅
          </button>

          <button
            onClick={onClose}
            className="w-full mt-3 text-muted-foreground text-sm py-2 hover:text-foreground"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}
