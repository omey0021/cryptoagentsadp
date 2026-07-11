import React, { useState, useEffect } from 'react'
import Card from '../components/Card'
import Loader from '../components/Loader'
import { getNews } from '../services/api'

const categories = ['all', 'Markets', 'Technology', 'Regulation', 'DeFi', 'AI', 'Mining']

export default function News() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [category, setCategory] = useState('all')

  useEffect(() => {
    setLoading(true)
    setError(null)
    getNews(category === 'all' ? undefined : category)
      .then(setArticles)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [category])

  return (
    <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8 animate-fadeInUp">
        <h1 className="text-3xl font-bold text-[#1a1a2e]">Crypto News</h1>
        <p className="text-[#4a4a6a]/70 mt-1">Stay informed with the latest crypto news and analysis</p>
      </div>

      {error && (
        <Card className="mb-6 border-red-400/30" hoverable={false}>
          <p className="text-red-500">{error}</p>
        </Card>
      )}

      <div className="flex flex-wrap gap-2 mb-8 animate-fadeInUp" style={{ animationDelay: '0.05s' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              category === cat
                ? 'bg-gradient-to-r from-cyan/20 to-magenta/20 text-[#1a1a2e] border border-white/30 shadow-sm'
                : 'text-[#4a4a6a]/70 hover:text-[#1a1a2e]'
            }`}
            style={{
              background: category === cat ? undefined : 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: category === cat ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.15)',
            }}
          >
            {cat === 'all' ? 'All' : cat}
          </button>
        ))}
      </div>

      {loading ? <Loader fullScreen /> : (
        <div className="space-y-4">
          {articles.map((article, i) => (
            <a key={article.id} href={article.url} target="_blank" rel="noopener noreferrer" className="block animate-fadeInUp" style={{ animationDelay: `${i * 0.05}s` }}>
              <Card className="group" hoverable={false}>
                <div className="flex flex-col sm:flex-row gap-4">
                  {article.image && (
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full sm:w-48 h-32 object-cover rounded-xl"
                      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                      onError={(e) => { e.target.style.display = 'none' }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-xs text-cyan font-medium">{article.source}</span>
                      <span
                        className="text-xs px-1.5 py-0.5 rounded"
                        style={{ background: 'rgba(255,255,255,0.15)', color: '#4a4a6a' }}
                      >
                        {article.category}
                      </span>
                      <span className="text-xs text-[#4a4a6a]/50">{article.date ? new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-[#1a1a2e] group-hover:text-cyan transition-colors mb-2">{article.title}</h3>
                    {article.summary && (
                      <p className="text-sm text-[#4a4a6a]/70 line-clamp-2">{article.summary}</p>
                    )}
                    <span className="text-xs text-cyan/70 group-hover:text-cyan transition-colors mt-2 inline-block">Read more &rarr;</span>
                  </div>
                </div>
              </Card>
            </a>
          ))}
          {articles.length === 0 && (
            <div className="text-center py-16 text-[#4a4a6a]/50">
              No news articles available for this category
            </div>
          )}
        </div>
      )}
    </div>
  )
}