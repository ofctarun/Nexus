import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Menu, X, ArrowRight } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navRef = useRef(null)

  useEffect(() => {
    gsap.from(navRef.current, {
      y: -60, opacity: 0, duration: 0.8, delay: 0.3, ease: 'power3.out'
    })

    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Overview', href: '#hero' },
    { label: 'Technology', href: '#features' },
    { label: 'Testimonials', href: '#security' },
    { label: 'Resources', href: '#voice-ai' },
  ]

  return (
    <nav
      ref={navRef}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] sm:w-auto"
    >
      <div
        className={`navbar-pill max-w-4xl flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 transition-all duration-500 ${
          scrolled ? 'bg-[rgba(26,26,26,0.85)]' : ''
        }`}
      >
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group shrink-0">
          <div className="w-8 h-8 rounded-lg bg-nexus-glow/20 border border-nexus-glow/30 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-nexus-glow/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="text-nexus-glow font-bold text-sm relative z-10">N</span>
          </div>
          <span className="text-nexus-white font-semibold text-lg tracking-tight">
            Nexus
          </span>
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6 mx-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-nexus-soft-gray/80 hover:text-nexus-white transition-colors duration-300 text-sm font-medium tracking-wide whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          <a
            href="#cta"
            className="text-nexus-soft-gray/80 hover:text-nexus-white transition-colors duration-300 text-sm font-medium"
          >
            Log In
          </a>
          <a
            href="#cta"
            className="group flex items-center gap-2 bg-nexus-white text-nexus-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-nexus-glow/90 hover:text-nexus-black transition-all duration-300"
          >
            Get Started
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-nexus-white p-1.5"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-2 navbar-pill px-5 py-5 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block text-nexus-soft-gray hover:text-nexus-white transition-colors text-base font-medium py-2"
            >
              {link.label}
            </a>
          ))}
          <div className="border-t border-nexus-border pt-3 space-y-2">
            <a
              href="#cta"
              onClick={() => setIsOpen(false)}
              className="block text-nexus-soft-gray hover:text-nexus-white transition-colors text-base font-medium py-2"
            >
              Log In
            </a>
            <a
              href="#cta"
              onClick={() => setIsOpen(false)}
              className="block bg-nexus-white text-nexus-black px-6 py-3 rounded-full font-semibold text-center text-sm"
            >
              Get Started
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
