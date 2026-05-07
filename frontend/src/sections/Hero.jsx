import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { CheckCircle, Upload, Shield, MessageSquare } from 'lucide-react'
import GlowingChip from '../components/GlowingChip'

export default function Hero() {
  const sectionRef = useRef(null)
  const chipRef = useRef(null)
  const headingRef = useRef(null)
  const subtitleRef = useRef(null)
  const ctaRef = useRef(null)
  const preorderRef = useRef(null)
  const cardsRef = useRef(null)
  const waveRef = useRef(null)
  const gridRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from(chipRef.current, { y: 30, opacity: 0, duration: 0.8, delay: 0.6 })
        .from(headingRef.current, { y: 40, opacity: 0, duration: 0.9 }, '-=0.3')
        .from(subtitleRef.current, { y: 20, opacity: 0, duration: 0.7 }, '-=0.4')
        .from(ctaRef.current, { y: 20, opacity: 0, duration: 0.6 }, '-=0.3')
        .from(preorderRef.current, { y: 10, opacity: 0, duration: 0.5 }, '-=0.2')
        .from(cardsRef.current.children, { y: 30, opacity: 0, stagger: 0.12, duration: 0.6 }, '-=0.2')

      // Wave glow breathing
      gsap.to(waveRef.current, {
        opacity: 0.8, duration: 4, yoyo: true, repeat: -1, ease: 'sine.inOut'
      })

      gsap.from(gridRef.current, { opacity: 0, duration: 2, delay: 1 })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const partnerCards = [
    { icon: <Upload size={24} className="text-nexus-glow" />, label: 'Smart Upload' },
    { icon: <Shield size={24} className="text-nexus-glow" />, label: 'Enterprise Security' },
    { icon: <MessageSquare size={24} className="text-nexus-glow" />, label: 'AI Document Chat' },
  ]

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-5 sm:px-8 overflow-hidden bg-black"
    >
      {/* Background grid */}
      <div
        ref={gridRef}
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(254,254,254,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(254,254,254,0.4) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Hero wave glow at bottom */}
      <div
        ref={waveRef}
        className="absolute bottom-0 left-0 w-full h-[400px] hero-wave-glow pointer-events-none"
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto pt-24 sm:pt-32">
        {/* Glowing Chip */}
        <div ref={chipRef} className="mb-6 sm:mb-8">
          <GlowingChip />
        </div>

        {/* Headline */}
        <h1
          ref={headingRef}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-center text-nexus-white tracking-tight leading-[1.1] mb-4 sm:mb-6"
        >
          Unlock the Power of
          <br />
          <span className="bg-gradient-to-r from-nexus-glow via-nexus-forest to-nexus-sage bg-clip-text text-transparent">
            AI
          </span>
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-nexus-soft-gray/70 text-sm sm:text-base md:text-lg text-center max-w-xl mx-auto mb-8 sm:mb-10"
        >
          Introducing AI Document Intelligence. Ready for the Enterprise Era.
        </p>

        {/* CTA button */}
        <div ref={ctaRef} className="flex justify-center mb-4">
          <a
            href="#cta"
            className="group bg-nexus-glow text-nexus-black font-semibold px-6 sm:px-8 py-3 sm:py-3.5 rounded-full flex items-center gap-2 hover:shadow-[0_0_40px_rgba(0,255,128,0.3)] transition-all duration-300"
          >
            <CheckCircle size={18} className="text-nexus-black" />
            Schedule Demo
          </a>
        </div>

        {/* Preorder text */}
        <p
          ref={preorderRef}
          className="text-nexus-soft-gray/50 text-xs sm:text-sm text-center mb-10"
        >
          Enterprise Ready • Q4 2025
        </p>

        {/* Partner cards */}
        <div
          ref={cardsRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-10"
        >
          {partnerCards.map((card) => (
            <div
              key={card.label}
              className="w-full sm:w-auto bg-nexus-card border border-nexus-border rounded-2xl px-6 py-4 text-center flex flex-col items-center gap-2 hover:border-nexus-border-hover transition-colors duration-300"
            >
              {card.icon}
              <span className="text-nexus-soft-gray text-sm font-medium">{card.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
