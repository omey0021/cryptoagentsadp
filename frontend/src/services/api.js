import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'https://cryptoagentsadp-api.onrender.com/api')

const api = axios.create({
  baseURL,
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

export function getNewsSentiment(category, sentiment) {
  const params = {}
  if (category && category !== 'all') params.category = category
  if (sentiment && sentiment !== 'all') params.sentiment = sentiment
  return handleRequest(() => api.get('/news-sentiment', { params }))
}

export function authLogin(email, password) {
  return handleRequest(() => api.post('/auth/login', { email, password }))
}

export function authRegister(email, password) {
  return handleRequest(() => api.post('/auth/register', { email, password }))
}

export function authMe(token) {
  return handleRequest(() => api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } }))
}

export { authMe as authMeByToken }

export function analyzePortfolio(body) {
  return handleRequest(() => api.post('/portfolio', body))
}

export default api