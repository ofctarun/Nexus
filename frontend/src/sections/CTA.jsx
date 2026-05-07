import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight } from 'lucide-react'

export default function CTA() {
  const sectionRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(contentRef.current.children, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        y: 40, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out'
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="cta"
      ref={sectionRef}
      className="bg-black py-20 sm:py-32 px-5 sm:px-8"
    >
      <div ref={contentRef} className="max-w-3xl mx-auto text-center">
        {/* Headline */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-nexus-white mb-4 sm:mb-6 tracking-tight leading-tight">
          Ready to Transform Your
          <br />
          <span className="bg-gradient-to-r from-nexus-glow via-nexus-forest to-nexus-sage bg-clip-text text-transparent">
            Document Workflow?
          </span>
        </h2>

        {/* Subtitle */}
        <p className="text-nexus-soft-gray/60 text-sm sm:text-base md:text-lg mb-8 sm:mb-10 max-w-xl mx-auto">
          Join enterprises securing their AI document intelligence with Nexus.
        </p>

        {/* CTA button */}
        <div className="flex justify-center mb-4">
          <a
            href="#"
            className="group bg-nexus-glow text-nexus-black rounded-full px-8 py-4 font-semibold text-base flex items-center gap-2 hover:shadow-[0_0_40px_rgba(0,255,128,0.3)] transition-all duration-300"
          >
            Get Started
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Secondary link */}
        <a
          href="#"
          className="text-nexus-soft-gray/50 text-sm hover:text-nexus-glow transition-colors duration-300 inline-flex items-center gap-1"
        >
          Schedule a Demo →
        </a>
      </div>
    </section>
  )
}
