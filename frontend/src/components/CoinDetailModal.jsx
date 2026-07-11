import React, { useEffect, useRef } from 'react'
import TradingViewWidget from './TradingViewWidget'

function formatValue(v) {
  if (v == null) return '-'
  if (v >= 1e12) return `$${(v / 1e12).toFixed(2)}T`
  if (v >= 1e9) return `$${(v / 1e9).toFixed(2)}B`
  if (v >= 1e6) return `$${(v / 1e6).toFixed(2)}M`
  return `$${Number(v).toLocaleString()}`
}

export default function CoinDetailModal({ coin, onClose }) {
  const overlayRef = useRef(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose()
  }

  if (!coin) return null

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: 'rgba(255,255,255,0.3)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}
    >
      <div
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-springIn"
        style={{
          background: 'rgba(255,255,255,0.5)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          borderRadius: '24px',
          border: '1px solid rgba(255,255,255,0.4)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.3)',
        }}
      >
        <div
          className="flex items-center justify-between p-6"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}
        >
          <div className="flex items-center gap-3">
            {coin.image && (
              <img src={coin.image} alt="" className="w-10 h-10 rounded-full" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
            )}
            <div>
              <h2 className="text-xl font-bold text-[#1a1a2e]">{coin.name}</h2>
              <span className="text-sm text-[#4a4a6a]/60 uppercase">{coin.symbol}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full text-[#4a4a6a] hover:text-[#1a1a2e] transition-all text-lg"
            style={{
              background: 'rgba(255,255,255,0.3)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.3)',
            }}
          >
            &times;
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass-card p-4 hover:translate-y-0">
              <p className="text-xs text-[#4a4a6a]/60 uppercase tracking-wider mb-1">Price</p>
              <p className="text-lg font-bold text-[#1a1a2e]">
                ${coin.current_price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
              </p>
            </div>
            <div className="glass-card p-4 hover:translate-y-0">
              <p className="text-xs text-[#4a4a6a]/60 uppercase tracking-wider mb-1">24h Change</p>
              <p className={`text-lg font-bold ${coin.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {coin.price_change_percentage_24h != null ? `${coin.price_change_percentage_24h >= 0 ? '+' : ''}${coin.price_change_percentage_24h.toFixed(2)}%` : '-'}
              </p>
            </div>
            <div className="glass-card p-4 hover:translate-y-0">
              <p className="text-xs text-[#4a4a6a]/60 uppercase tracking-wider mb-1">24h High</p>
              <p className="text-lg font-bold text-[#1a1a2e]">${coin.high_24h?.toLocaleString() || '-'}</p>
            </div>
            <div className="glass-card p-4 hover:translate-y-0">
              <p className="text-xs text-[#4a4a6a]/60 uppercase tracking-wider mb-1">24h Low</p>
              <p className="text-lg font-bold text-[#1a1a2e]">${coin.low_24h?.toLocaleString() || '-'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-4 hover:translate-y-0">
              <p className="text-xs text-[#4a4a6a]/60 uppercase tracking-wider mb-1">Market Cap</p>
              <p className="text-lg font-bold text-[#1a1a2e]">{formatValue(coin.market_cap)}</p>
            </div>
            <div className="glass-card p-4 hover:translate-y-0">
              <p className="text-xs text-[#4a4a6a]/60 uppercase tracking-wider mb-1">Volume 24h</p>
              <p className="text-lg font-bold text-[#1a1a2e]">{formatValue(coin.total_volume)}</p>
            </div>
          </div>

          <div className="glass-card p-4 hover:translate-y-0">
            <TradingViewWidget coinId={coin.id} />
          </div>
        </div>
      </div>
    </div>
  )
}