"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

export interface Toast {
  id: string
  message: string
  type: "success" | "error" | "info"
  duration?: number
}

interface ToastProps {
  toast: Toast
  onClose: (id: string) => void
}

function ToastItem({ toast, onClose }: ToastProps) {
  useEffect(() => {
    if (toast.duration !== 0) {
      const timer = setTimeout(() => onClose(toast.id), toast.duration || 3000)
      return () => clearTimeout(timer)
    }
  }, [toast, onClose])

  const bgColor = {
    success: "bg-green-500/90",
    error: "bg-red-500/90",
    info: "bg-blue-500/90",
  }[toast.type]

  return (
    <div
      className={`${bgColor} text-white px-4 py-3 rounded-lg flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300`}
    >
      <p className="text-sm font-medium">{toast.message}</p>
      <button onClick={() => onClose(toast.id)} className="p-1 hover:bg-white/20 rounded transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onClose: (id: string) => void
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  )
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (message: string, type: "success" | "error" | "info" = "info", duration = 3000) => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { id, message, type, duration }])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return { toasts, addToast, removeToast }
}
