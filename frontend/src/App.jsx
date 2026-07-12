import React, { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PrivateRoute from './components/PrivateRoute'
import Home from './pages/Home'
import Market from './pages/Market'
import Heatmap from './pages/Heatmap'
import Airdrops from './pages/Airdrops'
import Agents from './pages/Agents'
import News from './pages/News'
import NewsSentiment from './pages/NewsSentiment'
import Research from './pages/Research'
import Login from './pages/Login'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 animate-fadeIn">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/market" element={<PrivateRoute><Market /></PrivateRoute>} />
          <Route path="/heatmap" element={<PrivateRoute><Heatmap /></PrivateRoute>} />
          <Route path="/airdrops" element={<PrivateRoute><Airdrops /></PrivateRoute>} />
          <Route path="/agents" element={<PrivateRoute><Agents /></PrivateRoute>} />
          <Route path="/news" element={<PrivateRoute><News /></PrivateRoute>} />
          <Route path="/news-sentiment" element={<PrivateRoute><NewsSentiment /></PrivateRoute>} />
          <Route path="/research" element={<PrivateRoute><Research /></PrivateRoute>} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}