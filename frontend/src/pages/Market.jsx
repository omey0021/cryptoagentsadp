import React, { useState, useMemo } from 'react'
import Card from '../components/Card'
import Loader from '../components/Loader'
import CoinDetailModal from '../components/CoinDetailModal'
import { useApp } from '../context/AppContext'

const columns = [
  { key: 'market_cap_rank', label: '#' },
  { key: 'name', label: 'Name', render: (v, row) => (
    <div className="flex items-center gap-2">
      {row.image && <img src={row.image} alt="" className="w-6 h-6 rounded-full" />}
      <span className="font-medium text-[#1a1a2e]">{v}</span>
      <span className="text-[#4a4a6a]/50 text-xs uppercase">{row.symbol}</span>
    </div>
  )},
  { key: 'current_price', label: 'Price', render: (v) => `$${Number(v)?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}` },
  { key: 'price_change_percentage_24h', label: '24h %', render: (v) => (
    <span className={Number(v) >= 0 ? 'text-green-600 font-medium' : 'text-red-500 font-medium'}>{v != null ? `${v >= 0 ? '+' : ''}${v.toFixed(2)}%` : '-'}</span>
  )},
  { key: 'price_change_percentage_7d_in_currency', label: '7d %', render: (v) => (
    <span className={Number(v) >= 0 ? 'text-green-600 font-medium' : 'text-red-500 font-medium'}>{v != null ? `${v >= 0 ? '+' : ''}${v.toFixed(2)}%` : '-'}</span>
  )},
  { key: 'market_cap', label: 'Market Cap', render: (v) => {
    if (!v) return '-'
    if (v >= 1e12) return `$${(v / 1e12).toFixed(2)}T`
    if (v >= 1e9) return `$${(v / 1e9).toFixed(2)}B`
    return `$${Number(v).toLocaleString()}`
  }},
  { key: 'total_volume', label: 'Volume 24h', render: (v) => {
    if (!v) return '-'
    if (v >= 1e9) return `$${(v / 1e9).toFixed(2)}B`
    if (v >= 1e6) return `$${(v / 1e6).toFixed(2)}M`
    return `$${Number(v).toLocaleString()}`
  }},
]

export default function Market() {
  const { prices, loading, error } = useApp()
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState('market_cap_rank')
  const [sortDir, setSortDir] = useState('asc')
  const [activeTab, setActiveTab] = useState('all')
  const [selectedCoin, setSelectedCoin] = useState(null)

  const filtered = useMemo(() => {
    if (!prices) return []
    let result = [...prices]

    if (activeTab === 'gainers') {
      result = result.filter(c => c.price_change_percentage_24h > 0)
      result.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
    } else if (activeTab === 'losers') {
      result = result.filter(c => c.price_change_percentage_24h < 0)
      result.sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
    }

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(c => c.name?.toLowerCase().includes(q) || c.symbol?.toLowerCase().includes(q))
    }

    if (activeTab === 'all') {
      result.sort((a, b) => {
        const aVal = a[sortKey] ?? 0
        const bVal = b[sortKey] ?? 0
        if (typeof aVal === 'string') {
          return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
        }
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal
      })
    }

    return result
  }, [prices, search, sortKey, sortDir, activeTab])

  const handleSort = (key) => {
    if (key === sortKey) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const tabs = [
    { key: 'all', label: 'All Coins' },
    { key: 'gainers', label: 'Top Gainers' },
    { key: 'losers', label: 'Top Losers' },
  ]

  return (
    <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="animate-fadeInUp">
          <h1 className="text-3xl font-bold text-[#1a1a2e]">Market</h1>
          <p className="text-[#4a4a6a]/70 mt-1">Live cryptocurrency prices and market data</p>
        </div>
        <div className="relative animate-fadeInUp" style={{ animationDelay: '0.05s' }}>
          <input
            type="text"
            placeholder="Search coins..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 px-4 py-2.5 rounded-xl text-sm transition-all"
            style={{
              background: 'rgba(255,255,255,0.3)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#1a1a2e',
              outline: 'none',
            }}
            onFocus={(e) => { e.target.style.borderColor = 'rgba(0,255,255,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,255,255,0.1)' }}
            onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.3)'; e.target.style.boxShadow = 'none' }}
          />
        </div>
      </div>

      <div className="flex gap-2 mb-6 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-gradient-to-r from-cyan/20 to-magenta/20 text-[#1a1a2e] border border-white/30 shadow-sm'
                : 'text-[#4a4a6a]/70 hover:text-[#1a1a2e]'
            }`}
            style={{
              background: activeTab === tab.key ? undefined : 'rgba(255,255,255,0.15)',
              backdropFilter: activeTab === tab.key ? undefined : 'blur(12px)',
              WebkitBackdropFilter: activeTab === tab.key ? undefined : 'blur(12px)',
              border: activeTab === tab.key ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.15)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && (
        <Card className="mb-6 border-red-400/30" hoverable={false}>
          <p className="text-red-500">{error}</p>
        </Card>
      )}

      {loading && prices.length === 0 ? <Loader fullScreen /> : (
        <div
          className="overflow-x-auto rounded-2xl animate-fadeInUp"
          style={{ animationDelay: '0.15s' }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                }}
              >
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => activeTab === 'all' && handleSort(col.key)}
                    className={`px-5 py-4 text-left font-medium whitespace-nowrap text-xs uppercase tracking-wider transition-colors ${
                      activeTab === 'all' ? 'cursor-pointer' : ''
                    }`}
                    style={{ color: sortKey === col.key ? '#1a1a2e' : '#4a4a6a/80' }}
                  >
                    {col.label}
                    {sortKey === col.key && activeTab === 'all' && (
                      <span className="ml-1">{sortDir === 'asc' ? '\u25B2' : '\u25BC'}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((coin, i) => (
                <tr
                  key={coin.id}
                  onClick={() => setSelectedCoin(coin)}
                  className="transition-all duration-200 cursor-pointer"
                  style={{
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    background: i % 2 === 0 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = i % 2 === 0 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)' }}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-5 py-3 text-[#1a1a2e] whitespace-nowrap">
                      {col.render ? col.render(coin[col.key], coin) : coin[col.key] ?? '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-10 text-[#4a4a6a]/50">
              {search ? 'No coins match your search' : 'No market data available'}
            </div>
          )}
        </div>
      )}

      {selectedCoin && (
        <CoinDetailModal coin={selectedCoin} onClose={() => setSelectedCoin(null)} />
      )}
    </div>
  )
}