import React, { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Market from './pages/Market'
import Heatmap from './pages/Heatmap'
import Airdrops from './pages/Airdrops'
import Agents from './pages/Agents'
import News from './pages/News'
import Research from './pages/Research'

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
          <Route path="/market" element={<Market />} />
          <Route path="/heatmap" element={<Heatmap />} />
          <Route path="/airdrops" element={<Airdrops />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/news" element={<News />} />
          <Route path="/research" element={<Research />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}