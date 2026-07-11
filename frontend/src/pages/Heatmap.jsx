import React, { useState, useMemo } from 'react'
import HeatmapTile from '../components/HeatmapTile'
import CoinDetailModal from '../components/CoinDetailModal'
import { useApp } from '../context/AppContext'

function SkeletonTile() {
  return (
    <div
      className="rounded-xl animate-pulse"
      style={{
        width: '160px',
        height: '160px',
        background: 'rgba(255,255,255,0.06)',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.05)',
      }}
    />
  )
}

export default function Heatmap() {
  const { prices, loading } = useApp()
  const [selectedCoin, setSelectedCoin] = useState(null)

  const top100 = useMemo(() => {
    if (!prices) return []
    return [...prices]
      .sort((a, b) => (b.market_cap || 0) - (a.market_cap || 0))
      .slice(0, 100)
  }, [prices])

  const maxCap = useMemo(() => {
    if (!top100.length) return 1
    return top100[0].market_cap || 1
  }, [top100])

  const skeletonCount = 24

  return (
    <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8 animate-fadeInUp">
        <h1 className="text-3xl font-bold text-[#1a1a2e]">Market Heatmap</h1>
        <p className="text-[#4a4a6a]/70 mt-1">
          Top 100 cryptocurrencies by market cap — sized by cap, colored by 24h change
        </p>
      </div>

      {loading && top100.length === 0 ? (
        <div className="flex flex-wrap justify-center gap-3 animate-fadeIn">
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <SkeletonTile key={i} />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-3 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          {top100.map((coin) => (
            <HeatmapTile
              key={coin.id}
              coin={coin}
              maxCap={maxCap}
              onClick={setSelectedCoin}
            />
          ))}
        </div>
      )}

      {top100.length === 0 && !loading && (
        <div className="text-center py-20 text-[#4a4a6a]/50 animate-fadeIn">
          No market data available
        </div>
      )}

      {selectedCoin && (
        <CoinDetailModal coin={selectedCoin} onClose={() => setSelectedCoin(null)} />
      )}
    </div>
  )
}