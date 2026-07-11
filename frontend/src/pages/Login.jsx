import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function FloatingOrb({ size, top, left, delay, duration, color }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        top,
        left,
        background: `radial-gradient(circle, ${color}, transparent 70%)`,
        opacity: 0.4,
        animation: `float ${duration}s ease-in-out ${delay}s infinite`,
        filter: 'blur(40px)',
      }}
    />
  )
}

function GlassInput({ label, type, value, onChange, error, showToggle, onToggle, placeholder }) {
  const [focused, setFocused] = useState(false)
  const inputType = showToggle ? (type === 'password' && !showToggle ? 'password' : value === 'show' ? 'text' : type) : type

  return (
    <div className="relative mb-4">
      <label className="block text-sm font-medium text-[#4a4a6a]/80 mb-1.5 tracking-wide">{label}</label>
      <div
        className={`flex items-center rounded-2xl transition-all duration-300 ${
          focused
            ? 'ring-2 ring-cyan/40 border-cyan/30'
            : error
              ? 'ring-2 ring-red-400/40 border-red-400/30'
              : ''
        }`}
        style={{
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.2)',
        }}
      >
        <input
          type={showToggle ? (value === 'show' ? 'text' : type) : type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder || ''}
          className="w-full bg-transparent px-4 py-3.5 text-[#1a1a2e] placeholder:text-[#4a4a6a]/40 outline-none text-sm"
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="px-3 py-3.5 text-[#4a4a6a]/50 hover:text-[#4a4a6a]/80 transition-colors"
            tabIndex={-1}
          >
            {showToggle === 'show' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            )}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-400 mt-1.5 ml-1">{error}</p>}
    </div>
  )
}

function SocialButton({ icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center gap-3 w-full py-3 rounded-2xl text-sm font-medium text-[#4a4a6a] transition-all duration-300 hover:translate-y-[-1px]"
      style={{
        background: 'rgba(255,255,255,0.12)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.2)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.22)'
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {icon}
      {label}
    </button>
  )
}

export default function Login() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState('hide')
  const [showConfirm, setShowConfirm] = useState('hide')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const toggleMode = () => {
    setMode(m => m === 'login' ? 'signup' : 'login')
    setErrors({})
    setSubmitting(false)
  }

  const validate = () => {
    const e = {}
    if (!email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Invalid email address'
    if (!password) e.password = 'Password is required'
    else if (password.length < 6) e.password = 'At least 6 characters'
    if (mode === 'signup' && password !== confirmPassword) e.confirmPassword = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
    }, 1200)
  }

  const handleWalletConnect = () => {}

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-16 px-4 relative overflow-hidden">
      <FloatingOrb size="300px" top="-5%" left="-5%" delay="0" duration="8" color="rgba(0,255,255,0.5)" />
      <FloatingOrb size="250px" top="60%" left="80%" delay="2" duration="10" color="rgba(255,0,255,0.4)" />
      <FloatingOrb size="200px" top="30%" left="70%" delay="4" duration="9" color="rgba(180,130,255,0.3)" />
      <FloatingOrb size="180px" top="70%" left="10%" delay="1" duration="11" color="rgba(255,150,200,0.3)" />

      <div className="w-full max-w-[420px] animate-springIn">
        <div
          className="rounded-[24px] p-8 sm:p-10"
          style={{
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            border: '1px solid rgba(255,255,255,0.25)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.06), 0 0 0 1px rgba(255,255,255,0.15) inset',
          }}
        >
          <div className="text-center mb-8">
            <div className="inline-block mb-4 animate-float">
              <div
                className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center text-lg font-bold text-white animate-pulseGlow"
                style={{
                  background: 'linear-gradient(135deg, #00FFFF, #FF00FF)',
                  boxShadow: '0 8px 32px rgba(0,255,255,0.3), 0 0 60px rgba(255,0,255,0.2)',
                }}
              >
                CA
              </div>
            </div>
            <h1 className="text-2xl font-bold text-[#1a1a2e] mb-1">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-sm text-[#4a4a6a]/60 font-light">
              {mode === 'login' ? 'Sign in to your CryptoAgents account' : 'Join the CryptoAgents ecosystem'}
            </p>
          </div>

          <div className="flex items-center bg-white/10 rounded-2xl p-1 mb-6" style={{ border: '1px solid rgba(255,255,255,0.15)' }}>
            <button
              type="button"
              onClick={() => { if (mode !== 'login') toggleMode() }}
              className={`flex-1 py-2.5 text-sm font-medium rounded-xl transition-all duration-500 ${
                mode === 'login'
                  ? 'text-[#1a1a2e] shadow-sm'
                  : 'text-[#4a4a6a]/50 hover:text-[#4a4a6a]/80'
              }`}
              style={mode === 'login' ? {
                background: 'rgba(255,255,255,0.25)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.3)',
              } : {}}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => { if (mode !== 'signup') toggleMode() }}
              className={`flex-1 py-2.5 text-sm font-medium rounded-xl transition-all duration-500 ${
                mode === 'signup'
                  ? 'text-[#1a1a2e] shadow-sm'
                  : 'text-[#4a4a6a]/50 hover:text-[#4a4a6a]/80'
              }`}
              style={mode === 'signup' ? {
                background: 'rgba(255,255,255,0.25)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.3)',
              } : {}}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <GlassInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: '' }) }}
              error={errors.email}
              placeholder="you@example.com"
            />

            <GlassInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors({ ...errors, password: '' }) }}
              error={errors.password}
              showToggle={showPassword}
              onToggle={() => setShowPassword(sp => sp === 'show' ? 'hide' : 'show')}
              placeholder="Enter your password"
            />

            {mode === 'signup' && (
              <GlassInput
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' }) }}
                error={errors.confirmPassword}
                showToggle={showConfirm}
                onToggle={() => setShowConfirm(sc => sc === 'show' ? 'hide' : 'show')}
                placeholder="Confirm your password"
              />
            )}

            {mode === 'login' && (
              <div className="text-right mb-4">
                <button type="button" className="text-xs text-[#4a4a6a]/50 hover:text-cyan transition-colors">
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-2xl text-sm font-semibold text-white transition-all duration-300 disabled:opacity-60"
              style={{
                background: 'linear-gradient(135deg, #00FFFF, #FF00FF)',
                boxShadow: '0 4px 20px rgba(0,255,255,0.3), 0 4px 20px rgba(255,0,255,0.2)',
              }}
              onMouseEnter={(e) => {
                if (!submitting) {
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,255,255,0.4), 0 8px 32px rgba(255,0,255,0.3)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,255,255,0.3), 0 4px 20px rgba(255,0,255,0.2)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                </span>
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }} />
            <span className="text-xs text-[#4a4a6a]/40 font-medium tracking-wider uppercase">or continue with</span>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }} />
          </div>

          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={handleWalletConnect}
              className="flex items-center justify-center gap-3 w-full py-3.5 rounded-2xl text-sm font-medium text-[#4a4a6a] transition-all duration-300 hover:translate-y-[-1px]"
              style={{
                background: 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.22)'
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)'
                e.currentTarget.style.borderColor = 'rgba(0,255,255,0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="16" cy="12" r="2" fill="currentColor" />
              </svg>
              Connect Wallet
            </button>

            <div className="flex gap-3">
              <SocialButton
                onClick={() => {}}
                label="Google"
                icon={
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                }
              />
              <SocialButton
                onClick={() => {}}
                label="GitHub"
                icon={
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                }
              />
            </div>
          </div>

          <div className="text-center space-y-3">
            {mode === 'login' ? (
              <p className="text-xs text-[#4a4a6a]/50">
                Don't have an account?{' '}
                <button type="button" onClick={toggleMode} className="text-cyan font-medium hover:underline">
                  Sign up
                </button>
              </p>
            ) : (
              <p className="text-xs text-[#4a4a6a]/50">
                Already have an account?{' '}
                <button type="button" onClick={toggleMode} className="text-cyan font-medium hover:underline">
                  Sign in
                </button>
              </p>
            )}
            <div>
              <Link to="/" className="text-xs text-[#4a4a6a]/40 hover:text-[#4a4a6a]/70 transition-colors">
                Continue without account &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}