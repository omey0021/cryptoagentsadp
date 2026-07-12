import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { getPrices, getGlobalData, getAirdrops, getAgents, getNews, getCoinDetail, getNewsSentiment } from '../services/api'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [prices, setPrices] = useState([])
  const [airdrops, setAirdrops] = useState([])
  const [agents, setAgents] = useState([])
  const [news, setNews] = useState([])
  const [globalData, setGlobalData] = useState(null)
  const [coinDetail, setCoinDetail] = useState(null)
  const [newsSentiment, setNewsSentiment] = useState({ data: [], aggregates: { bullish: 0, bearish: 0, neutral: 0, total: 0 } })

  const pollingRef = useRef(null)

  const clearError = useCallback(() => setError(null), [])

  const fetchPrices = useCallback(async () => {
    try {
      const data = await getPrices()
      setPrices(data)
      return data
    } catch (err) {
      setError(err.message)
    }
  }, [])

  const fetchGlobalData = useCallback(async () => {
    try {
      const data = await getGlobalData()
      setGlobalData(data)
      return data
    } catch (err) {
      setError(err.message)
    }
  }, [])

  const fetchAirdrops = useCallback(async () => {
    try {
      const data = await getAirdrops()
      setAirdrops(data)
      return data
    } catch (err) {
      setError(err.message)
    }
  }, [])

  const fetchAgents = useCallback(async () => {
    try {
      const data = await getAgents()
      setAgents(data)
      return data
    } catch (err) {
      setError(err.message)
    }
  }, [])

  const fetchNews = useCallback(async (category) => {
    try {
      const data = await getNews(category)
      setNews(data)
      return data
    } catch (err) {
      setError(err.message)
    }
  }, [])

  const fetchCoinDetail = useCallback(async (id) => {
    try {
      const data = await getCoinDetail(id)
      setCoinDetail(data)
      return data
    } catch (err) {
      setError(err.message)
    }
  }, [])

  const fetchAllData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      await Promise.all([
        fetchPrices(),
        fetchGlobalData(),
        fetchAirdrops(),
        fetchAgents(),
        fetchNews()
      ])
    } finally {
      setLoading(false)
    }
  }, [fetchPrices, fetchGlobalData, fetchAirdrops, fetchAgents, fetchNews])

  useEffect(() => {
    fetchAllData()

    pollingRef.current = setInterval(() => {
      fetchPrices()
      fetchGlobalData()
    }, 30000)

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [fetchAllData, fetchPrices, fetchGlobalData])

  return (
    <AppContext.Provider value={{
      loading, setLoading,
      error, setError, clearError,
      prices, setPrices,
      airdrops, setAirdrops,
      agents, setAgents,
      news, setNews,
      globalData, setGlobalData,
      coinDetail, setCoinDetail,
      newsSentiment, setNewsSentiment,
      fetchAllData, fetchPrices, fetchGlobalData,
      fetchAirdrops, fetchAgents, fetchNews, fetchCoinDetail
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}