import React from 'react'

export default function Loader({ fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative w-14 h-14">
        <div
          className="absolute inset-0 rounded-full animate-pulseGlow"
          style={{
            background: 'conic-gradient(from 0deg, transparent, rgba(0,255,255,0.6), rgba(255,0,255,0.6), transparent)',
            borderRadius: '50%',
          }}
        />
        <div
          className="absolute inset-1 rounded-full"
          style={{
            background: 'rgba(255,255,255,0.6)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        />
        <div
          className="absolute inset-0 rounded-full animate-spin"
          style={{
            border: '2px solid transparent',
            borderTopColor: '#00FFFF',
            borderRightColor: '#FF00FF',
            borderRadius: '50%',
          }}
        />
      </div>
      <span className="text-sm font-medium text-[#4a4a6a]/60">Loading...</span>
    </div>
  )

  if (fullScreen) {
    return <div className="min-h-[60vh] flex items-center justify-center">{content}</div>
  }
  return content
}