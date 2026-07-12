import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function OAuthCallback() {
  const navigate = useNavigate()
  const { loginWithToken } = useAuth()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('access_token')
    const error = params.get('error')

    if (error) {
      navigate('/login?error=oauth_failed', { replace: true })
      return
    }

    if (token) {
      loginWithToken(token)
      navigate('/', { replace: true })
    } else {
      navigate('/login', { replace: true })
    }
  }, [navigate, loginWithToken])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-cyan border-t-transparent rounded-full animate-spin" />
        <p className="text-[#4a4a6a]/60 text-sm">Completing sign in...</p>
      </div>
    </div>
  )
}