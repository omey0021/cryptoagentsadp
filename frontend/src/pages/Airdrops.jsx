import React, { useState, useMemo } from 'react'
import Card from '../components/Card'
import Loader from '../components/Loader'
import { useApp } from '../context/AppContext'

function CountdownTimer({ endDate }) {
  const [now, setNow] = useState(Date.now())
  React.useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t) }, [])
  const diff = new Date(endDate).getTime() - now
  if (diff <= 0) return <span className="text-[#FF4466] text-xs font-medium">Ended</span>
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const mins = Math.floor((diff % 3600000) / 60000)
  return <span className="text-cyan text-xs font-mono">{days}d {hours}h {mins}m</span>
}

const difficultyColors = { Easy: '#00FF88', Medium: '#FFD700', Hard: '#FF4466' }

export default function Airdrops() {
  const { airdrops, loading, error } = useApp()
  const [filterChain, setFilterChain] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterDifficulty, setFilterDifficulty] = useState('all')
  const [sort, setSort] = useState('value_desc')
  const [search, setSearch] = useState('')

  const insights = useMemo(() => {
    if (!airdrops?.length) return { totalValue: 0, activeCount: 0, activeValue: 0, upcomingCount: 0, upcomingValue: 0 }
    const active = airdrops.filter(a => a.status === 'active')
    const upcoming = airdrops.filter(a => a.status === 'upcoming')
    return {
      totalValue: airdrops.reduce((s, a) => s + (a.estimated_value || 0), 0),
      activeCount: active.length,
      activeValue: active.reduce((s, a) => s + (a.estimated_value || 0), 0),
      upcomingCount: upcoming.length,
      upcomingValue: upcoming.reduce((s, a) => s + (a.estimated_value || 0), 0),
    }
  }, [airdrops])

  const chains = useMemo(() => { if (!airdrops) return []; return [...new Set(airdrops.map(a => a.chain))].sort() }, [airdrops])
  const categories = useMemo(() => { if (!airdrops) return []; return [...new Set(airdrops.map(a => a.category))].sort() }, [airdrops])

  const filtered = useMemo(() => {
    if (!airdrops) return []
    return airdrops.filter(a => {
      if (filterChain !== 'all' && a.chain !== filterChain) return false
      if (filterStatus !== 'all' && a.status !== filterStatus) return false
      if (filterCategory !== 'all' && a.category !== filterCategory) return false
      if (filterDifficulty !== 'all' && a.difficulty !== filterDifficulty) return false
      if (search && !a.name.toLowerCase().includes(search.toLowerCase()) && !a.description.toLowerCase().includes(search.toLowerCase())) return false
      return true
    }).sort((a, b) => {
      if (sort === 'value_desc') return (b.estimated_value || 0) - (a.estimated_value || 0)
      if (sort === 'value_asc') return (a.estimated_value || 0) - (b.estimated_value || 0)
      if (sort === 'deadline') return new Date(a.end_date) - new Date(b.end_date)
      return 0
    })
  }, [airdrops, filterChain, filterStatus, filterCategory, filterDifficulty, sort, search])

  return (
    <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8 animate-fadeInUp">
        <h1 className="text-3xl font-bold text-[#1a1a2e]">Airdrop Dashboard</h1>
        <p className="text-[#4a4a6a]/70 mt-1">Track, filter, and claim the best crypto airdrops</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 animate-fadeInUp" style={{ animationDelay: '0.05s' }}>
        <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(0,255,255,0.06)', border: '1px solid rgba(0,255,255,0.1)' }}>
          <p className="text-lg font-bold text-cyan">{insights.activeCount}</p>
          <p className="text-xs text-[#4a4a6a]/60 mt-0.5">Active Airdrops</p>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(255,215,0,0.06)', border: '1px solid rgba(255,215,0,0.1)' }}>
          <p className="text-lg font-bold" style={{ color: '#FFD700' }}>{insights.upcomingCount}</p>
          <p className="text-xs text-[#4a4a6a]/60 mt-0.5">Upcoming</p>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.1)' }}>
          <p className="text-lg font-bold" style={{ color: '#00FF88' }}>${(insights.activeValue / 1000).toFixed(0)}K</p>
          <p className="text-xs text-[#4a4a6a]/60 mt-0.5">Active Value</p>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(180,130,255,0.06)', border: '1px solid rgba(180,130,255,0.1)' }}>
          <p className="text-lg font-bold" style={{ color: '#B482FF' }}>${(insights.totalValue / 1000).toFixed(0)}K</p>
          <p className="text-xs text-[#4a4a6a]/60 mt-0.5">Total Value</p>
        </div>
      </div>

      {error && (
        <Card className="mb-6 border-red-400/30" hoverable={false}>
          <p className="text-red-500">{error}</p>
        </Card>
      )}

      <div className="flex flex-wrap gap-3 mb-8 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search airdrops..." className="px-4 py-2.5 rounded-xl text-sm outline-none text-[#1a1a2e] placeholder:text-[#4a4a6a]/40 flex-1 min-w-[200px]"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }} />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-4 py-2.5 rounded-xl text-sm outline-none text-[#1a1a2e]"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="upcoming">Upcoming</option>
        </select>
        <select value={filterChain} onChange={e => setFilterChain(e.target.value)} className="px-4 py-2.5 rounded-xl text-sm outline-none text-[#1a1a2e]"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}>
          <option value="all">All Chains</option>
          {chains.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="px-4 py-2.5 rounded-xl text-sm outline-none text-[#1a1a2e]"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}>
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterDifficulty} onChange={e => setFilterDifficulty(e.target.value)} className="px-4 py-2.5 rounded-xl text-sm outline-none text-[#1a1a2e]"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}>
          <option value="all">All Difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)} className="px-4 py-2.5 rounded-xl text-sm outline-none text-[#1a1a2e]"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}>
          <option value="value_desc">Highest Value</option>
          <option value="value_asc">Lowest Value</option>
          <option value="deadline">Deadline</option>
        </select>
      </div>

      {loading && airdrops.length === 0 ? <Loader fullScreen /> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((ad, i) => (
            <div key={ad.id} className="animate-fadeInUp" style={{ animationDelay: `${i * 0.03}s` }}>
              <Card accent className="group h-full flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {ad.logo ? (
                      <img src={ad.logo} alt="" className="w-10 h-10 rounded-full" onError={(e) => { e.target.style.display = 'none' }} />
                    ) : (
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: 'rgba(0,255,255,0.15)' }}>
                        <span style={{ filter: 'grayscale(1) brightness(0.5)' }}>🪂</span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-[#1a1a2e] group-hover:text-cyan transition-colors">{ad.name}</h3>
                      <span className="text-xs text-[#4a4a6a]/60">{ad.chain} · {ad.category}</span>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${ad.status === 'active' ? 'text-[#00FF88]' : 'text-[#FFD700]'}`}
                    style={{ background: ad.status === 'active' ? 'rgba(0,255,136,0.1)' : 'rgba(255,215,0,0.1)' }}>
                    {ad.status}
                  </span>
                </div>
                <p className="text-sm text-[#4a4a6a]/70 mb-3 line-clamp-2 flex-1">{ad.description}</p>
                <div className="flex items-center gap-3 text-sm mb-3 flex-wrap">
                  <span className="text-[#4a4a6a]/60">Est. <span className="text-[#1a1a2e] font-medium">${ad.estimated_value?.toLocaleString()}</span></span>
                  <span className="text-xs px-2 py-0.5 rounded" style={{ background: `${difficultyColors[ad.difficulty]}15`, color: difficultyColors[ad.difficulty] }}>
                    {ad.difficulty}
                  </span>
                  {ad.participants !== '0' && <span className="text-xs text-[#4a4a6a]/50">{ad.participants} users</span>}
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
                <div className="flex items-center justify-between text-xs pt-3 mt-auto" style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
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
                  <a href={ad.link} target="_blank" rel="noopener noreferrer" className="text-cyan hover:text-cyan/80 transition-colors font-medium">
                    Visit →
                  </a>
                </div>
              </Card>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16 text-[#4a4a6a]/50">No airdrops match your filters</div>
          )}
        </div>
      )}
    </div>
  )
}