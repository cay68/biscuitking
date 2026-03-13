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

export default function App() {
  return (
    <>
      <Navbar />
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
      <ChatBot />
    </>
  )
}
