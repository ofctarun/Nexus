import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import Features from './sections/Features'
import Security from './sections/Security'
import VoiceAI from './sections/VoiceAI'
import CTA from './sections/CTA'
import Footer from './sections/Footer'

function App() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main>
        <Hero />
        <div className="py-8 sm:py-12">
          <Features />
        </div>
        <Security />
        <div className="py-8 sm:py-12">
          <VoiceAI />
        </div>
        <CTA />
      </main>
      <Footer />
    </div>
  )
}

export default App
