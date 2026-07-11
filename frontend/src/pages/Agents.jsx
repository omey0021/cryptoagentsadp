import React, { useState, useMemo } from 'react'
import Card from '../components/Card'
import Loader from '../components/Loader'
import { useApp } from '../context/AppContext'

const categoryColors = {
  'Trading Bots': { bg: 'rgba(34,197,94,0.1)', text: '#16a34a' },
  'Portfolio Trackers': { bg: 'rgba(59,130,246,0.1)', text: '#2563eb' },
  'Analytics': { bg: 'rgba(147,51,234,0.1)', text: '#9333ea' },
  'Automation': { bg: 'rgba(234,88,12,0.1)', text: '#ea580c' },
  'Research': { bg: 'rgba(0,255,255,0.1)', text: '#009999' },
}

export default function Agents() {
  const { agents, loading } = useApp()
  const [filterCategory, setFilterCategory] = useState('all')

  const categories = useMemo(() => {
    if (!agents) return []
    return [...new Set(agents.map(a => a.category))].sort()
  }, [agents])

  const filtered = useMemo(() => {
    if (!agents) return []
    if (filterCategory === 'all') return agents
    return agents.filter(a => a.category === filterCategory)
  }, [agents, filterCategory])

  return (
    <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8 animate-fadeInUp">
        <h1 className="text-3xl font-bold text-[#1a1a2e]">AI Agents</h1>
        <p className="text-[#4a4a6a]/70 mt-1">Autonomous trading and analysis agents powered by AI</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8 animate-fadeInUp" style={{ animationDelay: '0.05s' }}>
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            filterCategory === 'all'
              ? 'bg-gradient-to-r from-cyan/20 to-magenta/20 text-[#1a1a2e] border border-white/30 shadow-sm'
              : 'text-[#4a4a6a]/70 hover:text-[#1a1a2e]'
          }`}
          style={{
            background: filterCategory === 'all' ? undefined : 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: filterCategory === 'all' ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.15)',
          }}
        >
          All
        </button>
        {categories.map(cat => {
          const cc = categoryColors[cat] || { bg: 'rgba(255,255,255,0.1)', text: '#4a4a6a' }
          return (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filterCategory === cat
                  ? 'shadow-sm'
                  : 'text-[#4a4a6a]/70 hover:text-[#1a1a2e]'
              }`}
              style={{
                background: filterCategory === cat ? cc.bg : 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: filterCategory === cat ? `1px solid ${cc.text}40` : '1px solid rgba(255,255,255,0.15)',
                color: filterCategory === cat ? cc.text : undefined,
              }}
            >
              {cat}
            </button>
          )
        })}
      </div>

      {loading && agents.length === 0 ? <Loader fullScreen /> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((agent, i) => (
            <div key={agent.id} className="animate-fadeInUp" style={{ animationDelay: `${i * 0.05}s` }}>
              <Card accent className="group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                    style={{ background: 'rgba(255,0,255,0.1)' }}
                  >
                    <span style={{ filter: 'grayscale(1) brightness(0.4)' }}>&#x1F916;</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#1a1a2e] group-hover:text-magenta transition-colors truncate">{agent.name}</h3>
                    <span className="text-xs text-[#4a4a6a]/60">{agent.platform}</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <span className="text-xs" style={{ color: '#eab308' }}>&#9733;</span>
                    <span className="text-xs text-[#4a4a6a]">{agent.rating}</span>
                  </div>
                </div>
                <span
                  className="text-xs px-2 py-0.5 rounded inline-block mb-3"
                  style={{
                    background: (categoryColors[agent.category] || { bg: 'rgba(255,255,255,0.1)' }).bg,
                    color: (categoryColors[agent.category] || { text: '#4a4a6a' }).text,
                  }}
                >
                  {agent.category}
                </span>
                <p className="text-sm text-[#4a4a6a]/70 mb-3 line-clamp-2">{agent.description}</p>
                <div className="text-xs text-[#4a4a6a]/60 mb-3">
                  <span className="font-medium text-[#4a4a6a]">Use case:</span> {agent.use_case}
                </div>
                <div className="flex items-center justify-between text-xs pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                  <span className="text-[#4a4a6a]/60">{agent.pricing}</span>
                  <a
                    href={agent.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-magenta hover:text-magenta/80 transition-colors font-medium"
                  >
                    Learn More &rarr;
                  </a>
                </div>
              </Card>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16 text-[#4a4a6a]/50">
              No AI agents match your filter
            </div>
          )}
        </div>
      )}
    </div>
  )
}