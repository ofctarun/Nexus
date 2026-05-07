import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Shield, Code, FileCheck } from 'lucide-react'
import VerifyStep from '../components/VerifyStep'

export default function Security() {
  const sectionRef = useRef(null)
  const headlineRef = useRef(null)
  const stepsRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headlineRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        y: 30, opacity: 0, duration: 0.8, ease: 'power3.out'
      })
      gsap.from(stepsRef.current.children, {
        scrollTrigger: { trigger: stepsRef.current, start: 'top 80%' },
        y: 40, opacity: 0, duration: 0.7, stagger: 0.2, ease: 'power3.out'
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const steps = [
    {
      icon: <Shield size={28} className="text-nexus-glow" />,
      label: 'What data goes into an AI workflow',
    },
    {
      icon: <Code size={28} className="text-nexus-glow" />,
      label: 'What code is run and where it is executed',
    },
    {
      icon: <FileCheck size={28} className="text-nexus-glow" />,
      label: 'The output is genuine and secure',
    },
  ]

  return (
    <section
      id="security"
      ref={sectionRef}
      className="bg-black py-16 sm:py-24 px-5 sm:px-8"
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Headline */}
        <h2
          ref={headlineRef}
          className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-nexus-white mb-10 sm:mb-14"
        >
          Verifiable Compute{' '}
          <span className="text-nexus-glow">Verifies</span>
        </h2>

        {/* Verification steps */}
        <div
          ref={stepsRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-4"
        >
          {steps.map((step, i) => (
            <VerifyStep
              key={step.label}
              icon={step.icon}
              label={step.label}
              isLast={i === steps.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
