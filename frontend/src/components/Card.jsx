import React from 'react'

export default function Card({ title, subtitle, children, className = '', accent = false, onClick, hoverable = true }) {
  return (
    <div
      onClick={onClick}
      className={`glass-card p-5 ${accent ? 'border-cyan/20' : ''} ${onClick ? 'cursor-pointer' : ''} ${hoverable ? '' : 'hover:translate-y-0 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)]'} ${className}`}
      style={{
        background: accent
          ? 'linear-gradient(135deg, rgba(0,255,255,0.08), rgba(255,0,255,0.05), rgba(255,255,255,0.1))'
          : 'rgba(255,255,255,0.12)',
      }}
    >
      {title && (
        <div className="mb-3">
          <h3 className={`text-lg font-semibold ${accent ? 'text-[#1a1a2e]' : 'text-[#1a1a2e]'}`}>{title}</h3>
          {subtitle && <p className="text-sm text-[#4a4a6a]/70 mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  )
}