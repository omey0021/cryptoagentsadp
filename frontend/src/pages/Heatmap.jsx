import React, { useState, useMemo } from 'react'
import HeatmapTile from '../components/HeatmapTile'
import CoinDetailModal from '../components/CoinDetailModal'
import { useApp } from '../context/AppContext'

const CATEGORIES = {
  all: { label: 'All', filter: () => true },
  top10: { label: 'Top 10', filter: (_, i) => i < 10 },
  top25: { label: 'Top 25', filter: (_, i) => i < 25 },
  top50: { label: 'Top 50', filter: (_, i) => i < 50 },
  top100: { label: 'Top 100', filter: () => true },
  defi: { label: 'DeFi', filter: c => /defi|uni|aave|comp|mkr|sushi|curve|crv|ldo|rune|inj/i.test(c.name) },
  ai: { label: 'AI', filter: c => /ai|fetch|singularity|ocean|render|bittensor|agix|fet/i.test(c.name) },
  meme: { label: 'Meme', filter: c => /doge|shib|pepe|wif|bonk|floki|meme/i.test(c.name) },
  l1: { label: 'Layer 1', filter: c => /bitcoin|ethereum|solana|avalanche|cardano|near|aptos|sui|polkadot|cosmos/i.test(c.name) },
  l2: { label: 'Layer 2', filter: c => /optimism|arbitrum|polygon|loopring|immutable|starknet|zksync|base/i.test(c.name) },
}

const SORTS = {
  cap: { label: 'Market Cap', sort: (a, b) => (b.market_cap || 0) - (a.market_cap || 0) },
  gainers: { label: 'Top Gainers', sort: (a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0) },
  losers: { label: 'Top Losers', sort: (a, b) => (a.price_change_percentage_24h || 0) - (b.price_change_percentage_24h || 0) },
  volume: { label: 'Volume', sort: (a, b) => (b.total_volume || 0) - (a.total_volume || 0) },
}

function SkeletonTile() {
  return (
    <div className="rounded-2xl animate-pulse" style={{
      width: '150px', height: '150px',
      background: 'rgba(255,255,255,0.06)',
      borderRadius: '16px',
      border: '1px solid rgba(255,255,255,0.05)',
    }} />
  )
}

export default function Heatmap() {
  const { prices, loading } = useApp()
  const [selectedCoin, setSelectedCoin] = useState(null)
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('cap')
  const [search, setSearch] = useState('')

  const sorted = useMemo(() => {
    if (!prices) return []
    const s = SORTS[sort] || SORTS.cap
    return [...prices].sort(s.sort)
  }, [prices, sort])

  const filtered = useMemo(() => {
    const cat = CATEGORIES[category] || CATEGORIES.all
    return sorted.filter((c, i) => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.symbol.toLowerCase().includes(search.toLowerCase())) return false
      if (category === 'top100') return true
      return cat.filter(c, i)
    })
  }, [sorted, category, search])

  const maxCap = useMemo(() => {
    if (!filtered.length) return 1
    return filtered[0].market_cap || 1
  }, [filtered])

  const stats = useMemo(() => {
    if (!filtered.length) return { gainers: 0, losers: 0, avgChange: 0 }
    const gainers = filtered.filter(c => (c.price_change_percentage_24h || 0) > 0).length
    const losers = filtered.filter(c => (c.price_change_percentage_24h || 0) < 0).length
    const avgChange = filtered.reduce((s, c) => s + (c.price_change_percentage_24h || 0), 0) / filtered.length
    return { gainers, losers, avgChange }
  }, [filtered])

  const skeletonCount = 24

  return (
    <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6 animate-fadeInUp">
        <h1 className="text-3xl font-bold text-[#1a1a2e]">Market Heatmap</h1>
        <p className="text-[#4a4a6a]/70 mt-1">Real-time crypto market — sized by cap, colored by 24h performance</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 animate-fadeInUp" style={{ animationDelay: '0.05s' }}>
        <div className="rounded-xl px-4 py-3 text-center" style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.12)' }}>
          <p className="text-xl font-bold" style={{ color: '#00FF88' }}>{stats.gainers}</p>
          <p className="text-[10px] text-[#4a4a6a]/50 uppercase tracking-wider">Gainers</p>
        </div>
        <div className="rounded-xl px-4 py-3 text-center" style={{ background: 'rgba(255,68,102,0.08)', border: '1px solid rgba(255,68,102,0.12)' }}>
          <p className="text-xl font-bold" style={{ color: '#FF4466' }}>{stats.losers}</p>
          <p className="text-[10px] text-[#4a4a6a]/50 uppercase tracking-wider">Losers</p>
        </div>
        <div className="rounded-xl px-4 py-3 text-center" style={{ background: 'rgba(0,255,255,0.08)', border: '1px solid rgba(0,255,255,0.12)' }}>
          <p className="text-xl font-bold text-cyan">{filtered.length}</p>
          <p className="text-[10px] text-[#4a4a6a]/50 uppercase tracking-wider">Assets</p>
        </div>
        <div className="rounded-xl px-4 py-3 text-center" style={{ background: 'rgba(180,130,255,0.08)', border: '1px solid rgba(180,130,255,0.12)' }}>
          <p className={`text-xl font-bold ${stats.avgChange > 0 ? 'text-[#00FF88]' : stats.avgChange < 0 ? 'text-[#FF4466]' : 'text-[#FFD700]'}`}>
            {stats.avgChange > 0 ? '+' : ''}{stats.avgChange.toFixed(1)}%
          </p>
          <p className="text-[10px] text-[#4a4a6a]/50 uppercase tracking-wider">Avg Change</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search coin..." className="px-4 py-2 rounded-xl text-sm outline-none text-[#1a1a2e] placeholder:text-[#4a4a6a]/40 min-w-[160px] flex-1 max-w-[240px]"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }} />
        <div className="flex flex-wrap gap-1">
          {Object.entries(CATEGORIES).map(([key, cat]) => (
            <button key={key} onClick={() => setCategory(key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${category === key ? 'text-white' : 'text-[#4a4a6a]/60 hover:text-[#1a1a2e]'}`}
              style={category === key ? { background: 'linear-gradient(135deg, #00FFFF, #FF00FF)', boxShadow: '0 2px 8px rgba(0,255,255,0.15)' } : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)' }}
            >{cat.label}</button>
          ))}
        </div>
        <div className="flex gap-1 ml-auto">
          {Object.entries(SORTS).map(([key, s]) => (
            <button key={key} onClick={() => setSort(key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${sort === key ? 'text-white' : 'text-[#4a4a6a]/60 hover:text-[#1a1a2e]'}`}
              style={sort === key ? { background: 'linear-gradient(135deg, #00FFFF, #FF00FF)', boxShadow: '0 2px 8px rgba(0,255,255,0.15)' } : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)' }}
            >{s.label}</button>
          ))}
        </div>
      </div>

      {loading && filtered.length === 0 ? (
        <div className="flex flex-wrap justify-center gap-3 animate-fadeIn">
          {Array.from({ length: skeletonCount }).map((_, i) => <SkeletonTile key={i} />)}
        </div>
      ) : filtered.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-3 animate-fadeIn" style={{ animationDelay: '0.15s' }}>
          {filtered.map((coin, i) => (
            <HeatmapTile key={coin.id} coin={coin} maxCap={maxCap} onClick={setSelectedCoin} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-[#4a4a6a]/50 animate-fadeIn">No coins match your filters</div>
      )}

      {selectedCoin && <CoinDetailModal coin={selectedCoin} onClose={() => setSelectedCoin(null)} />}
    </div>
  )
}