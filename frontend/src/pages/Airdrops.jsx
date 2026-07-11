import React, { useState, useMemo } from 'react'
import Card from '../components/Card'
import Loader from '../components/Loader'
import { useApp } from '../context/AppContext'

function CountdownTimer({ endDate }) {
  const [now, setNow] = useState(Date.now())

  React.useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  const diff = new Date(endDate).getTime() - now
  if (diff <= 0) return <span className="text-green-600 text-xs">Ended</span>

  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const mins = Math.floor((diff % 3600000) / 60000)

  return (
    <span className="text-cyan text-xs font-mono">
      {days}d {hours}h {mins}m
    </span>
  )
}

export default function Airdrops() {
  const { airdrops, loading, error } = useApp()
  const [filterChain, setFilterChain] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const chains = useMemo(() => {
    if (!airdrops) return []
    return [...new Set(airdrops.map(a => a.chain))].sort()
  }, [airdrops])

  const filtered = useMemo(() => {
    if (!airdrops) return []
    return airdrops.filter(a => {
      if (filterChain !== 'all' && a.chain !== filterChain) return false
      if (filterStatus !== 'all' && a.status !== filterStatus) return false
      return true
    })
  }, [airdrops, filterChain, filterStatus])

  return (
    <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8 animate-fadeInUp">
        <h1 className="text-3xl font-bold text-[#1a1a2e]">Airdrops</h1>
        <p className="text-[#4a4a6a]/70 mt-1">Track and claim the latest crypto airdrops</p>
      </div>

      {error && (
        <Card className="mb-6 border-red-400/30" hoverable={false}>
          <p className="text-red-500">{error}</p>
        </Card>
      )}

      <div className="flex flex-wrap gap-3 mb-8 animate-fadeInUp" style={{ animationDelay: '0.05s' }}>
        <select
          value={filterChain}
          onChange={(e) => setFilterChain(e.target.value)}
          className="px-4 py-2.5 rounded-xl text-sm transition-all"
          style={{
            background: 'rgba(255,255,255,0.3)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: '#1a1a2e',
            outline: 'none',
          }}
        >
          <option value="all">All Chains</option>
          {chains.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 rounded-xl text-sm transition-all"
          style={{
            background: 'rgba(255,255,255,0.3)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: '#1a1a2e',
            outline: 'none',
          }}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="upcoming">Upcoming</option>
        </select>
      </div>

      {loading && airdrops.length === 0 ? <Loader fullScreen /> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((ad, i) => (
            <div key={ad.id} className="animate-fadeInUp" style={{ animationDelay: `${i * 0.05}s` }}>
              <Card accent className="group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {ad.logo ? (
                      <img src={ad.logo} alt="" className="w-10 h-10 rounded-full" onError={(e) => { e.target.style.display = 'none' }} />
                    ) : (
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: 'rgba(0,255,255,0.15)' }}>
                        <span style={{ filter: 'grayscale(1) brightness(0.5)' }}>&#x1F4A7;</span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-[#1a1a2e] group-hover:text-cyan transition-colors">{ad.name}</h3>
                      <span className="text-xs text-[#4a4a6a]/60">{ad.chain}</span>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${ad.status === 'active' ? 'text-green-600' : 'text-cyan'}`}
                    style={{ background: ad.status === 'active' ? 'rgba(34,197,94,0.1)' : 'rgba(0,255,255,0.1)' }}
                  >
                    {ad.status}
                  </span>
                </div>
                <p className="text-sm text-[#4a4a6a]/70 mb-3 line-clamp-2">{ad.description}</p>
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="text-[#4a4a6a]/60">Est. Value</span>
                  <span className="text-[#1a1a2e] font-medium">${ad.estimated_value?.toLocaleString()}</span>
                </div>
                {ad.steps && (
                  <div className="mb-3">
                    <p className="text-xs text-[#4a4a6a]/60 mb-1">Steps:</p>
                    <ol className="text-xs text-[#4a4a6a]/70 space-y-0.5 list-decimal list-inside">
                      {ad.steps.slice(0, 3).map((s, idx) => <li key={idx} className="truncate">{s}</li>)}
                      {ad.steps.length > 3 && <li className="text-[#4a4a6a]/40">+{ad.steps.length - 3} more</li>}
                    </ol>
                  </div>
                )}
                <div className="flex items-center justify-between text-xs pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                  <div>
                    {ad.status === 'upcoming' ? (
                      <div className="flex items-center gap-1">
                        <span className="text-[#4a4a6a]/60">Starts in:</span>
                        <CountdownTimer endDate={ad.start_date} />
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <span className="text-[#4a4a6a]/60">Ends:</span>
                        <CountdownTimer endDate={ad.end_date} />
                      </div>
                    )}
                  </div>
                  <a
                    href={ad.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan hover:text-cyan/80 transition-colors font-medium"
                  >
                    Visit &rarr;
                  </a>
                </div>
              </Card>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16 text-[#4a4a6a]/50">
              No airdrops match your filters
            </div>
          )}
        </div>
      )}
    </div>
  )
}