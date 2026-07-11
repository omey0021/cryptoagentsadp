import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

async function handleRequest(fn) {
  try {
    const { data } = await fn()
    return data.data
  } catch (err) {
    const message = err.response?.data?.error || err.response?.data?.message || err.message || 'An error occurred'
    throw new Error(message)
  }
}

export function getPrices() {
  return handleRequest(() => api.get('/prices'))
}

export function getCoinDetail(id) {
  return handleRequest(() => api.get(`/prices/${id}`))
}

export function getGlobalData() {
  return handleRequest(() => api.get('/global'))
}

export function getAirdrops() {
  return handleRequest(() => api.get('/airdrops'))
}

export function getAgents() {
  return handleRequest(() => api.get('/agents'))
}

export function getNews(category) {
  const params = category && category !== 'all' ? { category } : {}
  return handleRequest(() => api.get('/news', { params }))
}

export default api