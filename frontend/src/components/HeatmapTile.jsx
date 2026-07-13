import React from 'react'
import { Tooltip } from 'react-tooltip'

function formatMarketCap(v) {
  if (!v) return '-'
  if (v >= 1e12) return `$${(v / 1e12).toFixed(2)}T`
  if (v >= 1e9) return `$${(v / 1e9).toFixed(2)}B`
  if (v >= 1e6) return `$${(v / 1e6).toFixed(2)}M`
  return `$${Number(v).toLocaleString()}`
}

function getTileStyle(changePct, marketCap, maxCap) {
  const isPositive = changePct >= 0
  const absPct = Math.min(Math.abs(changePct || 0), 100)
  const intensity = absPct / 100
  const sizeRatio = marketCap ? Math.max(0.4, Math.min(1, marketCap / maxCap)) : 0.4

  if (isPositive) {
    const g = Math.round(136 + (119 * intensity))
    const b = Math.round(136 - (136 * intensity))
    const r = Math.round(0 + (20 * intensity))
    return {
      background: `linear-gradient(135deg, rgba(0,${g},${b},${0.15 + intensity * 0.5}), rgba(0,${Math.round(g * 0.7)},${Math.round(b * 0.6)},${0.1 + intensity * 0.3}))`,
      borderColor: `rgba(0, 255, 136, ${0.2 + intensity * 0.6})`,
      boxShadow: `0 4px 20px rgba(0, 255, 136, ${0.05 + intensity * 0.15}), inset 0 1px 0 rgba(255,255,255,0.15)`,
      color: intensity > 0.5 ? '#00FF88' : '#00CC66',
      sizeRatio,
    }
  }
  const r = Math.round(255 + (0 * intensity))
  const g = Math.round(0 + (20 * intensity))
  const b = Math.round(68 - (68 * intensity))
  return {
    background: `linear-gradient(135deg, rgba(${r},${g},${b},${0.15 + intensity * 0.5}), rgba(${Math.round(r * 0.7)},${Math.round(g * 0.6)},${Math.round(b * 0.6)},${0.1 + intensity * 0.3}))`,
    borderColor: `rgba(255, 0, 68, ${0.2 + intensity * 0.6})`,
    boxShadow: `0 4px 20px rgba(255, 0, 68, ${0.05 + intensity * 0.15}), inset 0 1px 0 rgba(255,255,255,0.15)`,
    color: intensity > 0.5 ? '#FF4466' : '#FF4466',
    sizeRatio,
  }
}

export default function HeatmapTile({ coin, maxCap, onClick }) {
  const pct = coin.price_change_percentage_24h ?? 0
  const style = getTileStyle(pct, coin.market_cap, maxCap)
  const size = style.sizeRatio

  const area = Math.round(100 + (200 * size))
  const fontSize = Math.max(11, Math.round(11 + (5 * size)))

  return (
    <>
      <button
        data-tooltip-id={`tooltip-${coin.id}`}
        onClick={() => onClick(coin)}
        className="relative flex flex-col items-center justify-center rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.04] focus:outline-none"
        style={{
          background: style.background,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: `1px solid ${style.borderColor}`,
          boxShadow: style.boxShadow,
          width: `${area}px`,
          height: `${area}px`,
          minWidth: '80px',
          minHeight: '80px',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
>
        {coin.image && (
          <img src={coin.image} alt="" className="w-6 h-6 rounded-full mb-1" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }} />
        )}
        <span
          className="font-bold uppercase leading-tight text-center"
          style={{
            fontSize: `${fontSize}px`,
            color: '#ffffff',
            textShadow: '0 1px 4px rgba(0,0,0,0.3)',
          }}
        >
          {coin.symbol}
        </span>
        <span
          className="font-semibold mt-0.5"
          style={{
            fontSize: `${Math.max(9, fontSize - 3)}px`,
            color: style.color,
            textShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }}
        >
          {pct >= 0 ? '+' : ''}{pct.toFixed(2)}%
        </span>
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 50%)',
          }}
        />
      </button>
      <Tooltip
        id={`tooltip-${coin.id}`}
        place="top"
        variant="light"
        className="z-50 !rounded-xl !p-0 !opacity-100 !shadow-xl"
        style={{
          background: 'rgba(20,20,40,0.9)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '16px',
          color: '#ffffff',
          boxShadow: '0 16px 48px rgba(0,0,0,0.3)',
        }}
      >
        <div className="flex items-start gap-3 p-3 min-w-[200px]">
          {coin.image && (
            <img src={coin.image} alt="" className="w-10 h-10 rounded-full mt-0.5" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }} />
          )}
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-base text-white">{coin.name}</span>
            <span className="text-xs text-white/50 uppercase">{coin.symbol}</span>
            <span className="text-sm font-semibold text-white/90 mt-1">
              ${coin.current_price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
            </span>
            <span className={`text-sm font-bold ${pct >= 0 ? 'text-[#00FF88]' : 'text-[#FF4466]'}`}>
              {pct >= 0 ? '+' : ''}{pct.toFixed(2)}% 24h
            </span>
            <span className="text-xs text-white/60 mt-0.5">MCap: {formatMarketCap(coin.market_cap)}</span>
          </div>
        </div>
      </Tooltip>
    </>
  )
}