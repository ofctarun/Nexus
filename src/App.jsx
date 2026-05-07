import Navbar from './components/Navbar';
import Hero from './components/Hero';
import RAGFlow from './components/RAGFlow';
import Features from './components/Features';
import ChatPreview from './components/ChatPreview';
import About from './components/About';
import TechStack from './components/TechStack';
import Footer from './components/Footer';
import MouseGlow from './components/MouseGlow';
import './App.css';

export default function App() {
  return (
    <div className="app">
      <MouseGlow />
      <Navbar />
      <main>
        <Hero />
        <RAGFlow />
        <Features />
        <ChatPreview />
        <About />
        <TechStack />
      </main>
      <Footer />
    </div>
  );
}
