import React, { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { getNewsSentiment } from '../services/api'

const categories = ['all', 'Markets', 'Technology', 'Regulation', 'DeFi', 'AI', 'Mining']
const sentiments = ['all', 'Bullish', 'Neutral', 'Bearish']

function SentimentBadge({ label, score }) {
  const colors = {
    Bullish: { bg: 'rgba(0,255,136,0.12)', text: '#00FF88', border: 'rgba(0,255,136,0.25)' },
    Bearish: { bg: 'rgba(255,68,102,0.12)', text: '#FF4466', border: 'rgba(255,68,102,0.25)' },
    Neutral: { bg: 'rgba(255,215,0,0.12)', text: '#FFD700', border: 'rgba(255,215,0,0.25)' },
  }
  const c = colors[label] || colors.Neutral
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.text }} />
      {label}
    </span>
  )
}

function NewsCard({ article }) {
  const s = article.sentiment
  const barWidth = Math.abs(s.score) * 100
  const isPositive = s.label === 'Bullish'
  const barColor = isPositive ? '#00FF88' : s.label === 'Bearish' ? '#FF4466' : '#FFD700'

  return (
    <div
      className="group rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1"
      style={{
        background: 'rgba(255,255,255,0.45)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.35)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
      }}
    >
      <div className="flex flex-col sm:flex-row">
        {article.image && (
          <div className="sm:w-56 h-48 sm:h-auto shrink-0 overflow-hidden">
            <img src={article.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
        )}
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs font-medium px-2 py-0.5 rounded-md" style={{ background: 'rgba(255,255,255,0.3)', color: '#4a4a6a' }}>{article.source}</span>
              <span className="text-xs text-[#4a4a6a]/50">{new Date(article.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              <SentimentBadge label={s.label} score={s.score} />
            </div>
            <h3 className="text-lg font-bold text-[#1a1a2e] mb-1.5 leading-tight">{article.title}</h3>
            <p className="text-sm text-[#4a4a6a]/70 leading-relaxed">{article.summary}</p>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium transition-colors"
              style={{ color: '#4a4a6a' }}
            >
              Read More →
            </a>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#4a4a6a]/40 uppercase tracking-wider">AI Sentiment</span>
              <div className="w-20 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.3)' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${barWidth}%`, background: barColor }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function NewsSentiment() {
  const { newsSentiment, setNewsSentiment, loading, setLoading } = useApp()
  const [category, setCategory] = useState('all')
  const [sentiment, setSentiment] = useState('all')

  const fetchData = async (cat, sent) => {
    setLoading(true)
    try {
      const data = await getNewsSentiment(cat, sent)
      setNewsSentiment(data)
    } catch (err) {
      setNewsSentiment({ data: [], aggregates: { bullish: 0, bearish: 0, neutral: 0, total: 0 } })
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => { fetchData(category, sentiment) }, [category, sentiment])

  const articles = newsSentiment?.data || []
  const agg = newsSentiment?.aggregates || { bullish: 0, bearish: 0, neutral: 0, total: 0 }

  const sentimentScore = useMemo(() => {
    if (!agg.total) return 0
    return ((agg.bullish - agg.bearish) / agg.total * 100).toFixed(0)
  }, [agg])

  return (
    <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8 animate-fadeInUp">
        <h1 className="text-3xl font-bold text-[#1a1a2e]">AI News Sentiment</h1>
        <p className="text-[#4a4a6a]/70 mt-1">Every crypto news article scored by AI — bullish, bearish, or neutral</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.15)' }}>
          <p className="text-2xl font-bold" style={{ color: '#00FF88' }}>{agg.bullish}</p>
          <p className="text-xs text-[#4a4a6a]/60 mt-0.5">Bullish</p>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.15)' }}>
          <p className="text-2xl font-bold" style={{ color: '#FFD700' }}>{agg.neutral}</p>
          <p className="text-xs text-[#4a4a6a]/60 mt-0.5">Neutral</p>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(255,68,102,0.08)', border: '1px solid rgba(255,68,102,0.15)' }}>
          <p className="text-2xl font-bold" style={{ color: '#FF4466' }}>{agg.bearish}</p>
          <p className="text-xs text-[#4a4a6a]/60 mt-0.5">Bearish</p>
        </div>
      </div>

      {agg.total > 0 && (
        <div className="mb-8 p-4 rounded-xl text-center animate-fadeInUp" style={{ animationDelay: '0.15s', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <p className="text-sm text-[#4a4a6a]/60">Overall Market Sentiment</p>
          <p className="text-3xl font-bold mt-1" style={{ color: sentimentScore > 0 ? '#00FF88' : sentimentScore < 0 ? '#FF4466' : '#FFD700' }}>
            {sentimentScore > 0 ? '+' : ''}{sentimentScore}%
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-3 mb-6 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
        <div className="flex flex-wrap gap-2">
          {categories.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${category === c ? 'text-white' : 'text-[#4a4a6a]/70 hover:text-[#1a1a2e]'}`}
              style={category === c ? { background: 'linear-gradient(135deg, #00FFFF, #FF00FF)', boxShadow: '0 4px 12px rgba(0,255,255,0.2)' } : { background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.1)' }}
            >{c === 'all' ? 'All' : c}</button>
          ))}
        </div>
        <div className="flex gap-2">
          {sentiments.map(s => (
            <button key={s} onClick={() => setSentiment(s)}
              className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${sentiment === s ? 'text-white' : 'text-[#4a4a6a]/70 hover:text-[#1a1a2e]'}`}
              style={sentiment === s ? { background: 'linear-gradient(135deg, #00FFFF, #FF00FF)', boxShadow: '0 4px 12px rgba(0,255,255,0.2)' } : { background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.1)' }}
            >{s === 'all' ? 'All Sentiment' : s}</button>
          ))}
        </div>
      </div>

      {loading && !articles.length ? (
        <div className="space-y-4 animate-fadeIn">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.05)' }} />
          ))}
        </div>
      ) : articles.length > 0 ? (
        <div className="space-y-4 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
          {articles.map(a => <NewsCard key={a.id} article={a} />)}
        </div>
      ) : (
        <div className="text-center py-20 text-[#4a4a6a]/50 animate-fadeIn">No news articles match your filters</div>
      )}
    </div>
  )
}