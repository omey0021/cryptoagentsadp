import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { authLogin, authRegister, authMe } from '../services/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  const saveToken = useCallback((t) => {
    setToken(t)
    if (t) localStorage.setItem('token', t)
    else localStorage.removeItem('token')
  }, [])

  useEffect(() => {
    if (!token) { setLoading(false); return }
    authMe(token).then(u => setUser(u)).catch(() => saveToken(null)).finally(() => setLoading(false))
  }, [token])

  const login = useCallback(async (email, password) => {
    const res = await authLogin(email, password)
    saveToken(res.token)
    setUser(res.user)
    return res.user
  }, [saveToken])

  const register = useCallback(async (email, password) => {
    const res = await authRegister(email, password)
    saveToken(res.token)
    setUser(res.user)
    return res.user
  }, [saveToken])

  const logout = useCallback(() => {
    saveToken(null)
    setUser(null)
  }, [saveToken])

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}