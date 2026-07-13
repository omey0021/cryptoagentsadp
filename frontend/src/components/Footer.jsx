import React from 'react'
import { Link } from 'react-router-dom'

const socialLinks = [
  { label: 'Twitter', icon: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' },
  { label: 'Discord', icon: 'M8 2C5.243 2 3 4.243 3 7v8c0 2.757 2.243 5 5 5h1v4l6-4h1c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H8z' },
  { label: 'GitHub', icon: 'M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z' },
]

export default function Footer() {
  return (
    <footer
      style={{
        background: 'rgba(255,255,255,0.2)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.25)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan to-magenta flex items-center justify-center text-white text-[10px] font-bold">CA</div>
              <span className="font-semibold text-sm text-[#1a1a2e]">CryptoAgentsADP</span>
            </div>
            <p className="text-sm text-[#4a4a6a]/70">AI-powered crypto intelligence platform</p>
          </div>
          <div>
            <h4 className="text-[#1a1a2e] font-medium mb-3 text-sm">Platform</h4>
            <div className="space-y-2 text-sm">
              <Link to="/market" className="block text-[#4a4a6a]/70 hover:text-cyan transition-colors">Market</Link>
              <Link to="/portfolio" className="block text-[#4a4a6a]/70 hover:text-cyan transition-colors">Portfolio</Link>
              <Link to="/airdrops" className="block text-[#4a4a6a]/70 hover:text-cyan transition-colors">Airdrops</Link>
              <Link to="/agents" className="block text-[#4a4a6a]/70 hover:text-cyan transition-colors">AI Agents</Link>
            </div>
          </div>
          <div>
            <h4 className="text-[#1a1a2e] font-medium mb-3 text-sm">Resources</h4>
            <div className="space-y-2 text-sm">
              <Link to="/news" className="block text-[#4a4a6a]/70 hover:text-cyan transition-colors">News</Link>
              <Link to="/news-sentiment" className="block text-[#4a4a6a]/70 hover:text-cyan transition-colors">AI Sentiment</Link>
              <Link to="/research" className="block text-[#4a4a6a]/70 hover:text-cyan transition-colors">Research</Link>
            </div>
          </div>
          <div>
            <h4 className="text-[#1a1a2e] font-medium mb-3 text-sm">Community</h4>
            <div className="flex gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                  aria-label={s.label}
                >
                  <svg className="w-4 h-4 text-[#4a4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={s.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
        <div
          className="mt-10 pt-6 text-center text-sm text-[#4a4a6a]/50"
          style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}
        >
          &copy; {new Date().getFullYear()} CryptoAgentsADP.xyz. All rights reserved.
        </div>
      </div>
    </footer>
  )
}