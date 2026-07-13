import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/', label: 'Home' },
  { to: '/market', label: 'Market' },
  { to: '/heatmap', label: 'Heatmap' },
  { to: '/airdrops', label: 'Airdrops' },
  { to: '/agents', label: 'AI Agents' },
  { to: '/news', label: 'News' },
  { to: '/news-sentiment', label: 'AI Sentiment' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/research', label: 'Research' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/40 backdrop-blur-xl shadow-lg shadow-black/5'
          : 'bg-white/20 backdrop-blur-lg'
      }`}
      style={{ borderBottom: scrolled ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.15)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan to-magenta flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-cyan/20 group-hover:shadow-cyan/40 transition-shadow">
              CA
            </div>
            <span className="font-semibold text-xl tracking-tight text-[#1a1a2e]">
              Crypto<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan to-magenta">Agents</span>ADP
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => {
              const isActive = location.pathname === l.to
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan/20 to-magenta/20 text-[#1a1a2e] shadow-sm border border-white/30'
                      : 'text-[#4a4a6a]/80 hover:text-[#1a1a2e] hover:bg-white/30'
                  }`}
                >
                  {l.label}
                </Link>
              )
            })}
          </div>

          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#4a4a6a]/70 px-3 py-1.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {user.email}
                </span>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-[#4a4a6a]/70 hover:text-[#FF4466] transition-all hover:bg-white/30"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:translate-y-[-1px]"
                style={{
                  background: 'linear-gradient(135deg, #00FFFF, #FF00FF)',
                  boxShadow: '0 4px 16px rgba(0,255,255,0.25), 0 4px 16px rgba(255,0,255,0.15)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,255,255,0.35), 0 8px 24px rgba(255,0,255,0.25)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,255,255,0.25), 0 4px 16px rgba(255,0,255,0.15)'
                }}
              >
                Login
              </Link>
            )}
          </div>
          <button
            className="md:hidden p-2 rounded-xl glass hover:bg-white/30 transition-all"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-[#4a4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div
          className="md:hidden animate-fadeIn"
          style={{
            background: 'rgba(255,255,255,0.6)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderTop: '1px solid rgba(255,255,255,0.3)',
          }}
        >
          <div className="px-4 py-3 space-y-1">
            {links.map((l) => {
              const isActive = location.pathname === l.to
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan/20 to-magenta/20 text-[#1a1a2e] border border-white/30'
                      : 'text-[#4a4a6a]/80 hover:text-[#1a1a2e] hover:bg-white/30'
                  }`}
                >
                  {l.label}
                </Link>
              )
            })}
            {user && (
              <div className="pt-2 mt-2 space-y-1" style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                <div className="px-4 py-2 text-xs text-[#4a4a6a]/50">{user.email}</div>
                <button
                  onClick={() => { logout(); setOpen(false) }}
                  className="block w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-[#4a4a6a]/80 hover:text-[#FF4466] hover:bg-white/30 transition-all"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}