"use client"

import React from "react"

interface AVMLoaderProps {
  size?: "xs" | "sm" | "md" | "lg"
  className?: string
  fullScreen?: boolean
  label?: string
}

export function AVMLoader({
  size = "md",
  className = "",
  fullScreen = false,
  label
}: AVMLoaderProps) {
  const sizeMap = {
    xs: { dim: 20, thickness: 2.5 },
    sm: { dim: 32, thickness: 3.5 },
    md: { dim: 80, thickness: 8 },
    lg: { dim: 80, thickness: 8 }
  }

  const { dim, thickness } = sizeMap[size] || sizeMap.md

  const spinnerStyle: React.CSSProperties = {
    width: `${dim}px`,
    height: `${dim}px`,
    borderRadius: "50%",
    background: "conic-gradient(var(--avm-red, #ED3237) 0deg, var(--avm-navy, #1B2A75) 300deg, transparent 300deg 360deg)",
    WebkitMask: `radial-gradient(farthest-side, transparent calc(100% - ${thickness}px), #000 calc(100% - ${thickness}px))`,
    mask: `radial-gradient(farthest-side, transparent calc(100% - ${thickness}px), #000 calc(100% - ${thickness}px))`,
    animation: "spin 1.2s linear infinite",
    display: "inline-block",
    flexShrink: 0
  }

  const content = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`.trim()}>
      <div className="spinner" style={spinnerStyle} />
      {label && <p className="text-xs font-semibold text-slate-600">{label}</p>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        {content}
      </div>
    )
  }

  return content
}

export default AVMLoader
