import React, { useMemo, useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/Card'
import Loader from '../components/Loader'
import { useApp } from '../context/AppContext'

function formatCurrency(value) {
  if (!value) return '$0'
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
  return `$${Number(value).toLocaleString()}`
}

function Skeleton({ className = '' }) {
  return (
    <div
      className={`rounded-2xl ${className}`}
      style={{
        background: 'rgba(255,255,255,0.15)',
        animation: 'shimmer 2s infinite',
        backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 100%)',
        backgroundSize: '200% 100%',
      }}
    />
  )
}

function FearGreedIndicator({ value }) {
  if (value == null) return null
  const colors = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e']
  const color = colors[Math.min(Math.floor(value / 20), 4)]
  const labels = ['Extreme Fear', 'Fear', 'Neutral', 'Greed', 'Extreme Greed']
  const label = labels[Math.min(Math.floor(value / 20), 4)]
  return (
    <div className="flex items-center gap-2">
      <div
        className="flex-1 h-2 rounded-full overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.15)' }}
      >
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-medium text-[#4a4a6a] min-w-[80px] text-right">{value} - {label}</span>
    </div>
  )
}

function AnimatedSection({ children, className = '' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {children}
    </div>
  )
}

export default function Home() {
  const { prices, airdrops, news, globalData, loading, error, fetchAllData } = useApp()

  const topGainers = useMemo(() => {
    if (!prices) return []
    return [...prices]
      .filter(p => p.price_change_percentage_24h > 0)
      .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
      .slice(0, 5)
  }, [prices])

  const topLosers = useMemo(() => {
    if (!prices) return []
    return [...prices]
      .filter(p => p.price_change_percentage_24h < 0)
      .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
      .slice(0, 5)
  }, [prices])

  const latestAirdrops = useMemo(() => {
    if (!airdrops) return []
    return airdrops.slice(0, 4)
  }, [airdrops])

  const breakingNews = useMemo(() => {
    if (!news) return []
    return news.slice(0, 5)
  }, [news])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="glass-card p-8 text-center max-w-md animate-springIn">
          <div className="text-4xl mb-4">&#9888;</div>
          <p className="text-[#4a4a6a] mb-4">{error}</p>
          <button onClick={fetchAllData} className="glass-button glass-button-cyan px-6 py-3">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 pb-16">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center mb-14 pt-8">
          <div className="inline-block mb-6 animate-float">
            <div
              className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-2xl font-bold text-white"
              style={{
                background: 'linear-gradient(135deg, #00FFFF, #FF00FF)',
                boxShadow: '0 8px 32px rgba(0,255,255,0.3), 0 0 60px rgba(255,0,255,0.2)',
              }}
            >
              CA
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-4 animate-fadeInUp">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan via-blue-500 to-magenta">Crypto</span>
            <span className="text-[#1a1a2e]">Agents</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-magenta via-pink-500 to-cyan">ADP</span>
          </h1>
          <p className="text-lg text-[#4a4a6a]/70 max-w-2xl mx-auto font-light animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            AI-powered intelligence platform for crypto markets, airdrops, and autonomous trading agents
          </p>
        </div>

        {loading && !globalData ? (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28" />)}
            </div>
            <Loader fullScreen />
          </div>
        ) : (
          <>
            <AnimatedSection>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
                <Card>
                  <p className="text-xs text-[#4a4a6a]/60 uppercase tracking-wider mb-1">Total Market Cap</p>
                  <p className="text-lg font-bold text-[#1a1a2e]">{formatCurrency(globalData?.total_market_cap)}</p>
                  {globalData?.market_cap_change_percentage_24h_usd != null && (
                    <p className={`text-sm ${globalData.market_cap_change_percentage_24h_usd >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {globalData.market_cap_change_percentage_24h_usd >= 0 ? '+' : ''}{globalData.market_cap_change_percentage_24h_usd.toFixed(2)}% (24h)
                    </p>
                  )}
                </Card>
                <Card>
                  <p className="text-xs text-[#4a4a6a]/60 uppercase tracking-wider mb-1">24h Volume</p>
                  <p className="text-lg font-bold text-[#1a1a2e]">{formatCurrency(globalData?.total_volume)}</p>
                </Card>
                <Card>
                  <p className="text-xs text-[#4a4a6a]/60 uppercase tracking-wider mb-1">BTC Dominance</p>
                  <p className="text-lg font-bold text-[#1a1a2e]">{globalData?.btc_dominance?.toFixed(1)}%</p>
                </Card>
                <Card>
                  <p className="text-xs text-[#4a4a6a]/60 uppercase tracking-wider mb-1">Fear & Greed</p>
                  <div className="mt-2">
                    {globalData?.fear_greed_index != null ? (
                      <FearGreedIndicator value={globalData.fear_greed_index} />
                    ) : (
                      <FearGreedIndicator value={55} />
                    )}
                  </div>
                </Card>
              </div>
            </AnimatedSection>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <AnimatedSection>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-[#1a1a2e]">Market Movers (24h)</h2>
                      <Link to="/market" className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan to-magenta hover:opacity-80 transition-opacity">View All &rarr;</Link>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Card className="border-green-400/20">
                        <h3 className="text-sm font-semibold text-green-600 mb-3">Top Gainers &uarr;</h3>
                        {topGainers.length > 0 ? (
                          <div className="space-y-2">
                            {topGainers.map((coin, i) => (
                              <div key={coin.id} className="flex items-center justify-between py-1.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="text-xs text-[#4a4a6a]/40 w-4">{i + 1}</span>
                                  {coin.image && <img src={coin.image} alt="" className="w-5 h-5 rounded-full flex-shrink-0" />}
                                  <span className="text-sm text-[#1a1a2e] truncate">{coin.name}</span>
                                </div>
                                <div className="text-right flex-shrink-0 ml-2">
                                  <p className="text-xs text-[#4a4a6a]/60">${coin.current_price?.toLocaleString()}</p>
                                  <p className="text-xs font-medium text-green-600">+{coin.price_change_percentage_24h?.toFixed(2)}%</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[#4a4a6a]/50 text-sm text-center py-4">No gainers data</p>
                        )}
                      </Card>
                      <Card className="border-red-400/20">
                        <h3 className="text-sm font-semibold text-red-500 mb-3">Top Losers &darr;</h3>
                        {topLosers.length > 0 ? (
                          <div className="space-y-2">
                            {topLosers.map((coin, i) => (
                              <div key={coin.id} className="flex items-center justify-between py-1.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="text-xs text-[#4a4a6a]/40 w-4">{i + 1}</span>
                                  {coin.image && <img src={coin.image} alt="" className="w-5 h-5 rounded-full flex-shrink-0" />}
                                  <span className="text-sm text-[#1a1a2e] truncate">{coin.name}</span>
                                </div>
                                <div className="text-right flex-shrink-0 ml-2">
                                  <p className="text-xs text-[#4a4a6a]/60">${coin.current_price?.toLocaleString()}</p>
                                  <p className="text-xs font-medium text-red-500">{coin.price_change_percentage_24h?.toFixed(2)}%</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[#4a4a6a]/50 text-sm text-center py-4">No losers data</p>
                        )}
                      </Card>
                    </div>
                  </div>
                </AnimatedSection>
              </div>

              <div className="space-y-6">
                <AnimatedSection>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-[#1a1a2e]">Latest Airdrops</h2>
                      <Link to="/airdrops" className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan to-magenta hover:opacity-80 transition-opacity">View All &rarr;</Link>
                    </div>
                    <div className="space-y-3">
                      {latestAirdrops.length > 0 ? latestAirdrops.map((ad) => (
                        <Card key={ad.id}>
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-sm font-semibold text-[#1a1a2e]">{ad.name}</h3>
                              <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded uppercase tracking-wider" style={{ background: 'rgba(255,255,255,0.15)', color: '#4a4a6a' }}>{ad.chain}</span>
                            </div>
                            <div className="text-right">
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                ad.status === 'active' || ad.status === 'upcoming'
                                  ? 'text-green-600'
                                  : ad.status === 'ended'
                                  ? 'text-[#4a4a6a]/50'
                                  : 'text-cyan'
                              }`} style={{ background: ad.status === 'active' || ad.status === 'upcoming' ? 'rgba(34,197,94,0.1)' : ad.status === 'ended' ? 'rgba(255,255,255,0.1)' : 'rgba(0,255,255,0.1)' }}>
                                {ad.status}
                              </span>
                              {ad.estimated_value && <p className="text-xs text-[#4a4a6a]/60 mt-1">~${ad.estimated_value}</p>}
                            </div>
                          </div>
                        </Card>
                      )) : (
                        <p className="text-[#4a4a6a]/50 text-sm">No airdrops available</p>
                      )}
                    </div>
                  </div>
                </AnimatedSection>

                <AnimatedSection>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-[#1a1a2e]">Breaking News</h2>
                      <Link to="/news" className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan to-magenta hover:opacity-80 transition-opacity">View All &rarr;</Link>
                    </div>
                    <div className="space-y-3">
                      {breakingNews.length > 0 ? breakingNews.map((article) => (
                        <Card key={article.id}>
                          <div className="flex items-start gap-3">
                            <div className="w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden" style={{ background: 'rgba(255,255,255,0.15)' }}>
                              {article.image ? (
                                <img src={article.image} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-2xl text-[#4a4a6a]/30">&#x1F4F0;</span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-sm font-semibold text-[#1a1a2e] line-clamp-2">{article.title}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-cyan">{article.source || 'CryptoAgents'}</span>
                                <span className="text-xs text-[#4a4a6a]/40">{article.date ? new Date(article.date).toLocaleDateString() : ''}</span>
                              </div>
                            </div>
                          </div>
                        </Card>
                      )) : (
                        <p className="text-[#4a4a6a]/50 text-sm">No news available</p>
                      )}
                    </div>
                  </div>
                </AnimatedSection>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  )
}