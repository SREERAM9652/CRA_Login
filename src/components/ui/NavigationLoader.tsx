"use client"

import { useEffect, useState, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function NavigationLoader() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startLoading = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setVisible(true)
    setProgress(15)

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev < 60) return prev + 15
        if (prev < 85) return prev + 5
        if (prev < 95) return prev + 1
        return prev
      })
    }, 150)
  }

  const stopLoading = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setProgress(100)
    setTimeout(() => {
      setVisible(false)
      setTimeout(() => setProgress(0), 200)
    }, 250)
  }

  // Complete progress whenever route change completes
  useEffect(() => {
    stopLoading()
  }, [pathname, searchParams])

  // Listen to all link clicks and programmatic navigation
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a")
      if (!target) return

      const href = target.getAttribute("href")
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("javascript:") ||
        target.target === "_blank" ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey
      ) {
        return
      }

      try {
        const url = new URL(href, window.location.href)
        if (url.origin === window.location.origin) {
          const targetPath = url.pathname + url.search
          const currentPath = window.location.pathname + window.location.search
          if (targetPath !== currentPath) {
            startLoading()
          }
        }
      } catch {
        // Ignore invalid URLs
      }
    }

    // Intercept pushState for router.push() asynchronously outside React effect loops
    const originalPushState = window.history.pushState

    window.history.pushState = function (...args) {
      const url = args[2]
      if (url && typeof url === "string") {
        try {
          const target = new URL(url, window.location.href)
          if (target.pathname !== window.location.pathname) {
            // Defer execution outside the current synchronous call stack / useInsertionEffect
            setTimeout(() => {
              startLoading()
            }, 0)
          }
        } catch {
          // Ignore URL parsing errors
        }
      }
      return originalPushState.apply(this, args)
    }

    // Listen to custom loading events
    const handleCustomStart = () => {
      setTimeout(() => startLoading(), 0)
    }
    const handleCustomStop = () => stopLoading()

    document.addEventListener("click", handleLinkClick, true)
    window.addEventListener("avm-start-loading", handleCustomStart)
    window.addEventListener("avm-stop-loading", handleCustomStop)

    return () => {
      document.removeEventListener("click", handleLinkClick, true)
      window.removeEventListener("avm-start-loading", handleCustomStart)
      window.removeEventListener("avm-stop-loading", handleCustomStop)
      window.history.pushState = originalPushState
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  if (!visible && progress === 0) return null

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[999999] pointer-events-none transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden="true"
    >
      <div className="h-[3.5px] w-full bg-slate-200/40 relative">
        <div
          className="h-full bg-gradient-to-r from-[#1B2A75] via-[#ED3237] to-[#2563eb] transition-all duration-200 ease-out relative shadow-[0_0_10px_rgba(237,50,55,0.7),0_0_5px_rgba(27,42,117,0.7)]"
          style={{ width: `${progress}%` }}
        >
          {/* Glowing head dot */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-white shadow-[0_0_8px_#ED3237] animate-pulse" />
        </div>
      </div>
    </div>
  )
}

export default NavigationLoader
