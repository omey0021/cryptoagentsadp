import React, { useState } from 'react'
import { analyzePortfolio } from '../services/api'

function formatCurrency(v) {
  if (!v && v !== 0) return '-'
  if (v >= 1e12) return `$${(v / 1e12).toFixed(2)}T`
  if (v >= 1e9) return `$${(v / 1e9).toFixed(2)}B`
  if (v >= 1e6) return `$${(v / 1e6).toFixed(2)}M`
  return `$${Number(v).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function PortfolioHolding({ h, index }) {
  const isPositive = (h.change24h || 0) >= 0
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl transition-all hover:scale-[1.01]" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <span className="text-xs font-bold text-[#4a4a6a]/40 w-6">{index + 1}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-[#1a1a2e]">{h.symbol}</span>
          <span className="text-xs text-[#4a4a6a]/50 truncate">{h.name}</span>
        </div>
        <div className="text-xs text-[#4a4a6a]/50 mt-0.5">{h.amount.toLocaleString()} tokens</div>
      </div>
      <div className="w-24 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(h.allocation, 100)}%`, background: isPositive ? 'linear-gradient(90deg, #00FF88, #00CC66)' : 'linear-gradient(90deg, #FF4466, #FF6644)' }} />
      </div>
      <div className="text-right min-w-[100px]">
        <p className="text-sm font-semibold text-[#1a1a2e]">{formatCurrency(h.value)}</p>
        <p className={`text-xs font-medium ${isPositive ? 'text-[#00FF88]' : 'text-[#FF4466]'}`}>
          {h.change24h != null ? `${isPositive ? '+' : ''}${h.change24h.toFixed(2)}%` : '-'}
        </p>
      </div>
    </div>
  )
}

export default function Portfolio() {
  const [wallet, setWallet] = useState('')
  const [holdings, setHoldings] = useState('')
  const [mode, setMode] = useState('wallet')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [portfolio, setPortfolio] = useState(null)

  const analyze = async () => {
    setError('')
    setPortfolio(null)
    if (mode === 'wallet' && !wallet.trim()) { setError('Enter a wallet address'); return }
    if (mode === 'manual' && !holdings.trim()) { setError('Paste your holdings'); return }

    setLoading(true)
    try {
      const body = mode === 'wallet' ? { wallet: wallet.trim() } : { holdings }
      const res = await analyzePortfolio(body)
      setPortfolio(res)
    } catch (err) {
      setError(err.message || 'Failed to analyze portfolio')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8 animate-fadeInUp">
        <h1 className="text-3xl font-bold text-[#1a1a2e]">Wallet Portfolio Tracker</h1>
        <p className="text-[#4a4a6a]/70 mt-1">Enter any wallet address or paste holdings to see your complete portfolio</p>
      </div>

      <div className="mb-8 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        <div className="flex gap-2 mb-4" style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '16px', padding: '4px', display: 'inline-flex' }}>
          <button onClick={() => setMode('wallet')} className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${mode === 'wallet' ? 'text-white' : 'text-[#4a4a6a]/60'}`}
            style={mode === 'wallet' ? { background: 'linear-gradient(135deg, #00FFFF, #FF00FF)', boxShadow: '0 4px 12px rgba(0,255,255,0.2)' } : {}}>
            Wallet Address
          </button>
          <button onClick={() => setMode('manual')} className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${mode === 'manual' ? 'text-white' : 'text-[#4a4a6a]/60'}`}
            style={mode === 'manual' ? { background: 'linear-gradient(135deg, #00FFFF, #FF00FF)', boxShadow: '0 4px 12px rgba(0,255,255,0.2)' } : {}}>
            Paste Holdings
          </button>
        </div>

        <div className="flex gap-3 items-start">
          {mode === 'wallet' ? (
            <input
              value={wallet} onChange={e => setWallet(e.target.value)}
              placeholder="0x... or Solana address..."
              className="flex-1 px-5 py-3.5 rounded-2xl text-sm outline-none text-[#1a1a2e] placeholder:text-[#4a4a6a]/40"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}
            />
          ) : (
            <textarea
              value={holdings} onChange={e => setHoldings(e.target.value)}
              placeholder="2.5 BTC&#10;10 ETH&#10;500 SOL&#10;1000 MATIC"
              rows={4}
              className="flex-1 px-5 py-3.5 rounded-2xl text-sm outline-none text-[#1a1a2e] placeholder:text-[#4a4a6a]/40 resize-none"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}
            />
          )}
          <button
            onClick={analyze} disabled={loading}
            className="px-6 py-3.5 rounded-2xl text-sm font-semibold text-white transition-all disabled:opacity-50 whitespace-nowrap"
            style={{ background: 'linear-gradient(135deg, #00FFFF, #FF00FF)', boxShadow: '0 4px 16px rgba(0,255,255,0.25)' }}
          >
            {loading ? (
              <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Analyzing</span>
            ) : 'Analyze'}
          </button>
        </div>
        {error && <p className="text-xs text-red-400 mt-2 ml-2">{error}</p>}
        {mode === 'manual' && (
          <p className="text-xs text-[#4a4a6a]/40 mt-2 ml-2">One token per line: amount + symbol (e.g. "2.5 BTC")</p>
        )}
      </div>

      {loading && (
        <div className="space-y-3 animate-fadeIn">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.03)' }} />
          ))}
        </div>
      )}

      {portfolio && !loading && (
        <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <div className="mb-6 p-6 rounded-2xl text-center" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-xs uppercase tracking-widest text-[#4a4a6a]/40 mb-2">Total Portfolio Value</p>
            <p className="text-4xl font-bold text-[#1a1a2e]">{formatCurrency(portfolio.totalValue)}</p>
            <p className="text-xs text-[#4a4a6a]/40 mt-2">{portfolio.holdings.length} assets tracked</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {portfolio.holdings.slice(0, 8).map(h => (
              <div key={h.symbol} className="px-3 py-1.5 rounded-xl text-xs font-medium" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.06)' }}>
                {h.symbol} <span className="text-[#4a4a6a]/50">{h.allocation.toFixed(1)}%</span>
              </div>
            ))}
            {portfolio.holdings.length > 8 && (
              <div className="px-3 py-1.5 rounded-xl text-xs text-[#4a4a6a]/50" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.04)' }}>
                +{portfolio.holdings.length - 8} more
              </div>
            )}
          </div>

          <div className="space-y-2">
            {portfolio.holdings.map((h, i) => <PortfolioHolding key={h.symbol + i} h={h} index={i} />)}
          </div>
        </div>
      )}
    </div>
  )
}