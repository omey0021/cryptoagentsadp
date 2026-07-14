import React, { useReducer, useEffect, useRef, useCallback, useState } from 'react'
import { useAuth } from '../context/AuthContext'

const SATS_PER_CLICK = 10
const SAVE_INTERVAL = 5000

const UPGRADES = [
  { id: 'autoMiner', name: 'Auto Miner', desc: 'Mines sats automatically every second', baseCost: 100, costMultiplier: 1.5, effect: () => 1, icon: '⚡' },
  { id: 'clickPower', name: 'Click Power', desc: 'More sats per click', baseCost: 50, costMultiplier: 1.8, effect: (lv) => SATS_PER_CLICK * Math.pow(2, lv), icon: '🖱️' },
  { id: 'miningRig', name: 'Mining Rig', desc: '2x auto-mining speed', baseCost: 500, costMultiplier: 2.5, effect: () => 2, icon: '🖥️' },
  { id: 'asic', name: 'ASIC Miner', desc: '5x all mining power', baseCost: 2500, costMultiplier: 3, effect: () => 5, icon: '🔌' },
  { id: 'dataCenter', name: 'Data Center', desc: '10x massive boost', baseCost: 10000, costMultiplier: 4, effect: () => 10, icon: '🏢' },
]

function formatSats(n) {
  if (n >= 1e8) return `${(n / 1e8).toFixed(4)} BTC`
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M sats`
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K sats`
  return `${Math.floor(n)} sats`
}

function getCost(upgrade, level) {
  return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, level))
}

function reducer(state, action) {
  switch (action.type) {
    case 'MINE':
      return { ...state, sats: state.sats + state.clickPower, totalEarned: state.totalEarned + state.clickPower, totalClicks: state.totalClicks + 1 }
    case 'BUY': {
      const upg = action.upgrade
      const cost = getCost(upg, state.upgradeLevels[upg.id] || 0)
      if (state.sats < cost) return state
      const newLevels = { ...state.upgradeLevels, [upg.id]: (state.upgradeLevels[upg.id] || 0) + 1 }
      const newMultiplier = [1, ...UPGRADES.filter(u => ['miningRig', 'asic', 'dataCenter'].includes(u.id)).map(u => u.effect(newLevels[u.id] || 0))].reduce((a, b) => a * b, 1)
      const autoBase = (newLevels.autoMiner || 0) * 1 * newMultiplier
      const clickBase = SATS_PER_CLICK * Math.pow(2, newLevels.clickPower || 0) * newMultiplier
      return { ...state, sats: state.sats - cost, upgradeLevels: newLevels, autoPerSec: autoBase, clickPower: clickBase }
    }
    case 'TICK':
      return { ...state, sats: state.sats + state.autoPerSec, totalEarned: state.totalEarned + state.autoPerSec }
    case 'LOAD':
      return { ...state, ...action.data }
    default:
      return state
  }
}

function FloatingText({ x, y, text }) {
  return (
    <span className="absolute pointer-events-none animate-floatUp text-xs font-bold" style={{ left: x, top: y, color: '#FFD700' }}>
      +{text}
    </span>
  )
}

function CoinButton({ onClick, scale }) {
  return (
    <button
      onClick={onClick}
      className="relative select-none transition-transform duration-75 active:scale-90"
      style={{ transform: `scale(${scale})` }}
    >
      <div
        className="w-36 h-36 rounded-full flex items-center justify-center text-6xl font-bold text-white transition-all duration-200 hover:shadow-2xl"
        style={{
          background: 'radial-gradient(circle at 35% 30%, #FFD700, #F7931A 50%, #8B5E00)',
          boxShadow: '0 8px 40px rgba(247,147,26,0.4), inset 0 -4px 12px rgba(0,0,0,0.3), inset 0 4px 12px rgba(255,255,255,0.2)',
          textShadow: '0 2px 8px rgba(0,0,0,0.3)',
        }}
      >
        ₿
      </div>
      <div className="absolute inset-0 rounded-full" style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 50%)',
        pointerEvents: 'none',
      }} />
    </button>
  )
}

export default function Game() {
  const { user } = useAuth()
  const initialState = {
    sats: 0, totalEarned: 0, totalClicks: 0,
    upgradeLevels: {}, autoPerSec: 0, clickPower: SATS_PER_CLICK,
  }
  const [state, dispatch] = useReducer(reducer, initialState)
  const [floats, setFloats] = useState([])
  const [coinScale, setCoinScale] = useState(1)
  const floatId = useRef(0)
  const loaded = useRef(false)

  useEffect(() => {
    if (loaded.current) return
    loaded.current = true
    try {
      const key = `cryptoMiner_${user?.email || 'guest'}`
      const saved = localStorage.getItem(key)
      if (saved) dispatch({ type: 'LOAD', data: JSON.parse(saved) })
    } catch {}
  }, [user])

  useEffect(() => {
    const key = `cryptoMiner_${user?.email || 'guest'}`
    const timer = setInterval(() => {
      localStorage.setItem(key, JSON.stringify(state))
    }, SAVE_INTERVAL)
    return () => clearInterval(timer)
  }, [state, user])

  useEffect(() => {
    const timer = setInterval(() => dispatch({ type: 'TICK' }), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleMine = useCallback((e) => {
    dispatch({ type: 'MINE' })
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left + (Math.random() - 0.5) * 40
    const y = e.clientY - rect.top - 20
    const id = ++floatId.current
    setFloats(f => [...f, { id, x, y, text: state.clickPower }])
    setCoinScale(0.92)
    setTimeout(() => setCoinScale(1), 100)
    setTimeout(() => setFloats(f => f.filter(fi => fi.id !== id)), 800)
  }, [state.clickPower])

  const btc = state.totalEarned / 1e8

  return (
    <div className="pt-24 pb-16 max-w-lg mx-auto px-4 sm:px-6 animate-fadeIn">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a2e]">⛏️ Crypto Miner</h1>
        <p className="text-sm text-[#4a4a6a]/60 mt-1">Click the Bitcoin to earn satoshis!</p>
      </div>

      <div className="rounded-2xl p-6 mb-6 text-center relative" style={{
        background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.12)',
      }}>
        <p className="text-xs uppercase tracking-widest text-[#4a4a6a]/40 mb-1">Balance</p>
        <p className="text-4xl font-bold" style={{ color: '#F7931A' }}>{formatSats(state.sats)}</p>
        <p className="text-lg mt-1 text-[#4a4a6a]/50">{btc.toFixed(8)} BTC</p>
      </div>

      <div className="flex justify-center mb-6 relative">
        <CoinButton onClick={handleMine} scale={coinScale} />
        <div className="absolute inset-0 pointer-events-none">
          {floats.map(f => <FloatingText key={f.id} x={f.x} y={f.y} text={f.text} />)}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(0,255,255,0.06)', border: '1px solid rgba(0,255,255,0.1)' }}>
          <p className="text-lg font-bold text-cyan">{state.totalClicks}</p>
          <p className="text-[10px] text-[#4a4a6a]/50 uppercase tracking-wider">Clicks</p>
        </div>
        <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.1)' }}>
          <p className="text-lg font-bold" style={{ color: '#00FF88' }}>{formatSats(state.clickPower)}</p>
          <p className="text-[10px] text-[#4a4a6a]/50 uppercase tracking-wider">Per Click</p>
        </div>
        <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(180,130,255,0.06)', border: '1px solid rgba(180,130,255,0.1)' }}>
          <p className="text-lg font-bold" style={{ color: '#B482FF' }}>{formatSats(state.autoPerSec)}</p>
          <p className="text-[10px] text-[#4a4a6a]/50 uppercase tracking-wider">Per Sec</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wider text-[#4a4a6a]/40 mb-2">Upgrades</p>
        {UPGRADES.map(upg => {
          const lv = state.upgradeLevels[upg.id] || 0
          const cost = getCost(upg, lv)
          const canBuy = state.sats >= cost
          return (
            <button
              key={upg.id}
              onClick={() => dispatch({ type: 'BUY', upgrade: upg })}
              disabled={!canBuy}
              className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all disabled:opacity-40 hover:scale-[1.01]"
              style={{
                background: canBuy ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${canBuy ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)'}`,
              }}
            >
              <span className="text-xl">{upg.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[#1a1a2e]">{upg.name}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(247,147,26,0.15)', color: '#F7931A' }}>Lv.{lv}</span>
                </div>
                <p className="text-xs text-[#4a4a6a]/50 truncate">{upg.desc}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${canBuy ? 'text-[#F7931A]' : 'text-[#4a4a6a]/40'}`}>{formatSats(cost)}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}