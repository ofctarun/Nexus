import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const dots = [
  { x: '10%', y: '15%', size: 8 },
  { x: '25%', y: '8%', size: 5 },
  { x: '40%', y: '20%', size: 10 },
  { x: '55%', y: '5%', size: 6 },
  { x: '70%', y: '18%', size: 12 },
  { x: '85%', y: '10%', size: 7 },
  { x: '15%', y: '75%', size: 9 },
  { x: '30%', y: '85%', size: 6 },
  { x: '50%', y: '80%', size: 11 },
  { x: '65%', y: '90%', size: 5 },
  { x: '80%', y: '78%', size: 8 },
  { x: '90%', y: '85%', size: 10 },
  { x: '20%', y: '45%', size: 4 },
  { x: '75%', y: '50%', size: 6 },
  { x: '45%', y: '65%', size: 7 },
  { x: '60%', y: '35%', size: 5 },
]

export default function FloatingDots() {
  const dotsRef = useRef([])

  useEffect(() => {
    const animations = dotsRef.current.map((dot) => {
      if (!dot) return null
      return gsap.to(dot, {
        x: `+=${gsap.utils.random(-15, 15)}`,
        y: `+=${gsap.utils.random(-15, 15)}`,
        duration: gsap.utils.random(3, 6),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: gsap.utils.random(0, 2),
      })
    })
    return () => animations.forEach(a => a && a.kill())
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {dots.map((dot, i) => (
        <div
          key={i}
          ref={el => dotsRef.current[i] = el}
          className="absolute rounded-full bg-nexus-glow"
          style={{
            left: dot.x,
            top: dot.y,
            width: dot.size,
            height: dot.size,
            opacity: dot.size > 8 ? 0.6 : 0.35,
          }}
        />
      ))}
    </div>
  )
}
