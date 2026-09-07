"use client"

import { useEffect, useState, useTransition } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function NavigationLoader() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)

  // Reset loader when route changes complete
  useEffect(() => {
    setLoading(false)
  }, [pathname, searchParams])

  // Listen to link clicks across the application
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a")
      if (!target) return

      const href = target.getAttribute("href")
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || target.target === "_blank") {
        return
      }

      // Check if it's an internal route change
      try {
        const url = new URL(href, window.location.href)
        if (url.origin === window.location.origin) {
          const targetPath = url.pathname + url.search
          const currentPath = window.location.pathname + window.location.search
          if (targetPath !== currentPath) {
            setLoading(true)
          }
        }
      } catch (err) {
        // Ignore invalid URLs
      }
    }

    document.addEventListener("click", handleLinkClick)
    return () => document.removeEventListener("click", handleLinkClick)
  }, [])

  if (!loading) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div className="h-1 w-full bg-slate-100 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-[#1B2A75] via-[#ED3237] to-[#1B2A75] animate-pulse"
          style={{
            width: "100%",
            animation: "progress-indeterminate 1.5s infinite linear"
          }}
        />
      </div>
      <style jsx>{`
        @keyframes progress-indeterminate {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}
