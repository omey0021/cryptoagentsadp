import React from 'react'
import Card from '../components/Card'

const REPORTS = [
  { id: 1, title: 'The State of AI x Crypto in 2026', summary: 'Comprehensive analysis of the convergence between artificial intelligence and blockchain technology, covering autonomous agents, decentralized compute, and AI-driven DeFi protocols.', category: 'AI', date: 'Jul 11, 2026', author: 'CryptoAgents Research', readTime: 15 },
  { id: 2, title: 'Layer-2 Landscape: Scaling Ethereum to Billions', summary: 'Deep dive into the Ethereum L2 ecosystem including rollups, validiums, and the emerging interoperability standards that will define the next phase of scaling.', category: 'Technology', date: 'Jul 9, 2026', author: 'CryptoAgents Research', readTime: 20 },
  { id: 3, title: 'Airdrop Farming Guide: Maximizing Your Claims', summary: 'Strategic guide to identifying high-value airdrop opportunities, optimizing wallet activity, and avoiding common pitfalls in the current airdrop season.', category: 'DeFi', date: 'Jul 7, 2026', author: 'CryptoAgents Research', readTime: 12 },
  { id: 4, title: 'BTC Dominance Shift: What the Data Says', summary: 'Analyzing on-chain metrics and market structure to understand Bitcoins shifting dominance and what it means for altcoin season.', category: 'Markets', date: 'Jul 5, 2026', author: 'CryptoAgents Research', readTime: 10 },
  { id: 5, title: 'DePIN: Decentralized Physical Infrastructure Networks', summary: 'Exploring the growing DePIN sector including decentralized compute, wireless networks, and sensor networks — and the tokenomics driving them.', category: 'Technology', date: 'Jul 2, 2026', author: 'CryptoAgents Research', readTime: 18 },
  { id: 6, title: 'Regulatory Outlook: US Crypto Policy in 2026', summary: 'Comprehensive overview of the US regulatory landscape including SEC, CFTC, and congressional actions shaping the crypto industry this year.', category: 'Regulation', date: 'Jun 28, 2026', author: 'CryptoAgents Research', readTime: 14 },
]

export default function Research() {
  return (
    <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8 animate-fadeInUp">
        <h1 className="text-3xl font-bold text-[#1a1a2e]">Research</h1>
        <p className="text-[#4a4a6a]/70 mt-1">Deep dives, market research, and analytical reports</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {REPORTS.map((report, i) => (
          <div key={report.id} className="animate-fadeInUp" style={{ animationDelay: `${i * 0.05}s` }}>
            <Card accent className="group h-full">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-xs px-2 py-0.5 rounded font-medium"
                  style={{
                    background: 'rgba(0,255,255,0.1)',
                    color: '#009999',
                  }}
                >
                  {report.category}
                </span>
                <span className="text-xs text-[#4a4a6a]/50">{report.date}</span>
              </div>
              <h3 className="text-lg font-semibold text-[#1a1a2e] group-hover:text-cyan transition-colors mb-2">{report.title}</h3>
              <p className="text-sm text-[#4a4a6a]/70 mb-4 line-clamp-3">{report.summary}</p>
              <div className="flex items-center gap-4 text-xs text-[#4a4a6a]/60">
                <span>By {report.author}</span>
                <span>{report.readTime} min read</span>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}