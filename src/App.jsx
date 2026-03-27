import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import OurStory from './components/OurStory'
import ValueProps from './components/ValueProps'
import FeaturedBy from './components/FeaturedBy'
import StoreInfo from './components/StoreInfo'
import Gallery from './components/Gallery'
import Footer from './components/Footer'
import ChatBot from './components/ChatBot'
import Shop from './pages/Shop'
import Admin from './pages/Admin'

function Landing() {
  return (
    <>
      <main>
        <Hero />
        <Marquee />
        <OurStory />
        <ValueProps />
        <FeaturedBy />
        <StoreInfo />
        <Gallery />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  const location = useLocation()
  const isAdmin = location.pathname === '/admin'

  return (
    <>
      {!isAdmin && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      {!isAdmin && <ChatBot />}
    </>
  )
}
