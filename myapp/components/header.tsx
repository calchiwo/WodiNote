"use client"

import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"
import Image from "next/image"

export default function Header() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("wodinote_theme")
    const isDarkMode =
      savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)

    if (isDarkMode) {
      document.documentElement.classList.add("dark")
      setIsDark(true)
    } else {
      document.documentElement.classList.remove("dark")
      setIsDark(false)
    }
  }, [])

  const toggleTheme = () => {
    if (!mounted) return

    const html = document.documentElement
    if (isDark) {
      html.classList.remove("dark")
      setIsDark(false)
      localStorage.setItem("wodinote_theme", "light")
    } else {
      html.classList.add("dark")
      setIsDark(true)
      localStorage.setItem("wodinote_theme", "dark")
    }
  }

  if (!mounted) return null

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="flex items-center justify-between px-4 py-4">
        {/* Left spacer */}
        <div className="w-10" />

        {/* Center: Logo and Title */}
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <Image src="/wodi-logo.jpg" alt="WodiNote Logo" fill className="object-contain" />
          </div>
          <h1 className="text-xl font-bold text-foreground">WodiNote</h1>
        </div>

        {/* Right: Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-muted transition-colors text-foreground"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </header>
  )
}
