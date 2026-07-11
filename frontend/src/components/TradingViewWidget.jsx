import React, { useRef, useEffect } from 'react'
import { createChart, ColorType } from 'lightweight-charts'

function generateMockData(coinId, timeframe) {
  const now = Math.floor(Date.now() / 1000)
  const basePrice = {
    bitcoin: 65420,
    ethereum: 3450,
    solana: 142,
    cardano: 0.45,
    ripple: 0.62,
    polkadot: 7.8,
    avalanche: 38,
    polygon: 0.72,
    chainlink: 14.5,
    dogecoin: 0.12,
  }[coinId] || 10 + Math.random() * 100

  const dayMap = { '1d': 1, '7d': 7, '30d': 30, '90d': 90 }
  const days = dayMap[timeframe] || 1
  const intervalsPerDay = 24
  const totalBars = days * intervalsPerDay
  const intervalSeconds = 3600

  const volatility = basePrice * 0.02
  let price = basePrice
  const data = []

  for (let i = totalBars; i >= 0; i--) {
    const timestamp = now - i * intervalSeconds
    const change = (Math.random() - 0.48) * volatility
    price += change
    const open = price
    const close = price + (Math.random() - 0.5) * volatility * 0.5
    const high = Math.max(open, close) + Math.random() * volatility * 0.3
    const low = Math.min(open, close) - Math.random() * volatility * 0.3
    data.push({ time: timestamp, open, high, low, close })
  }

  return data
}

export default function TradingViewWidget({ coinId = 'bitcoin', timeframe = '7d' }) {
  const chartContainerRef = useRef(null)

  useEffect(() => {
    if (!chartContainerRef.current) return

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#1a1a2e' },
        textColor: '#9ca3af',
      },
      grid: {
        vertLines: { color: '#2a2a4e' },
        horzLines: { color: '#2a2a4e' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      crosshair: {
        mode: 0,
        vertLine: { color: '#00FFFF', width: 1, style: 2 },
        horzLine: { color: '#00FFFF', width: 1, style: 2 },
      },
      timeScale: {
        borderColor: '#3a3a5e',
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: '#3a3a5e',
      },
    })

    const candleSeries = chart.addCandlestickSeries({
      upColor: '#00FFFF',
      downColor: '#FF00FF',
      borderDownColor: '#FF00FF',
      borderUpColor: '#00FFFF',
      wickDownColor: '#FF00FF',
      wickUpColor: '#00FFFF',
    })

    const data = generateMockData(coinId, timeframe)
    candleSeries.setData(data)

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth })
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [coinId, timeframe])

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-[#4a4a6a]/60 uppercase tracking-wider">{coinId} / USD &middot; {timeframe}</span>
      </div>
      <div ref={chartContainerRef} className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }} />
    </div>
  )
}