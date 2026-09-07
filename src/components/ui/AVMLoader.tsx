"use client"

import React from "react"

interface AVMLoaderProps {
  size?: "xs" | "sm" | "md" | "lg"
  className?: string
  fullScreen?: boolean
}

export function AVMLoader({
  size = "md",
  className = "",
  fullScreen = false
}: AVMLoaderProps) {
  const sizeClass = {
    xs: "spinner-xs",
    sm: "spinner-sm",
    md: "",
    lg: "spinner-lg"
  }[size]

  const spinnerElement = (
    <div
      className={`spinner ${sizeClass} ${className}`.trim()}
      role="status"
      aria-label="Loading"
    />
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-xs transition-opacity duration-200">
        {spinnerElement}
      </div>
    )
  }

  return spinnerElement
}

export default AVMLoader
