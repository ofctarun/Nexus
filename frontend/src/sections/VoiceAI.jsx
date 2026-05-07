import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import FloatingDots from '../components/FloatingDots'
import SolutionCard from '../components/SolutionCard'

export default function VoiceAI() {
  const sectionRef = useRef(null)
  const badgeRef = useRef(null)
  const headlineRef = useRef(null)
  const cardRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(badgeRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        y: 20, opacity: 0, duration: 0.6, ease: 'power3.out'
      })
      gsap.from(headlineRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        y: 30, opacity: 0, duration: 0.8, delay: 0.15, ease: 'power3.out'
      })
      gsap.from(cardRef.current, {
        scrollTrigger: { trigger: cardRef.current, start: 'top 85%' },
        y: 40, opacity: 0, duration: 0.8, delay: 0.2, ease: 'power3.out'
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="voice-ai"
      ref={sectionRef}
      className="relative bg-nexus-white rounded-3xl mx-4 sm:mx-8 py-16 sm:py-24 px-5 sm:px-8 overflow-hidden"
    >
      {/* Floating dots overlay */}
      <FloatingDots />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Pill badge */}
        <div ref={badgeRef} className="flex justify-center mb-4 sm:mb-6">
          <span className="text-nexus-charcoal bg-white border border-nexus-border rounded-full px-4 py-1 text-xs sm:text-sm font-medium">
            Solutions
          </span>
        </div>

        {/* Headline */}
        <h2
          ref={headlineRef}
          className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-nexus-black mb-4"
        >
          Evolving trust for{' '}
          <span className="text-nexus-glow">AI</span>
          {' '}with
        </h2>

        {/* Solution Card */}
        <div ref={cardRef}>
          <SolutionCard />
        </div>
      </div>
    </section>
  )
}
