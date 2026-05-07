import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function GlowingChip() {
  const chipRef = useRef(null)
  const linesRef = useRef([])
  const nodesRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate chip appearance
      gsap.from(chipRef.current, {
        scale: 0.8, opacity: 0, duration: 1, delay: 0.5, ease: 'back.out(1.5)'
      })
      // Animate circuit lines drawing
      linesRef.current.forEach((line, i) => {
        if (!line) return
        const length = line.getTotalLength()
        gsap.set(line, { strokeDasharray: length, strokeDashoffset: length, opacity: 0 })
        gsap.to(line, {
          strokeDashoffset: 0, opacity: 1, duration: 1.5, delay: 0.8 + i * 0.15, ease: 'power2.out'
        })
      })
      // Animate nodes appearing
      gsap.from(nodesRef.current.filter(Boolean), {
        scale: 0, opacity: 0, duration: 0.4, stagger: 0.12, delay: 1.5, ease: 'back.out(2)'
      })
    })
    return () => ctx.revert()
  }, [])

  // Circuit line paths (8 lines extending from chip center outward)
  const circuitPaths = [
    { d: 'M200,130 L200,60 L120,60', node: { cx: 115, cy: 55 } },
    { d: 'M200,130 L200,40 L200,20', node: { cx: 200, cy: 15 } },
    { d: 'M200,130 L200,60 L280,60', node: { cx: 285, cy: 55 } },
    { d: 'M170,150 L100,150 L60,120', node: { cx: 55, cy: 115 } },
    { d: 'M230,150 L300,150 L340,120', node: { cx: 345, cy: 115 } },
    { d: 'M170,170 L100,170 L60,200', node: { cx: 55, cy: 205 } },
    { d: 'M200,190 L200,240 L140,270', node: { cx: 135, cy: 275 } },
    { d: 'M230,170 L300,170 L340,200', node: { cx: 345, cy: 205 } },
  ]

  return (
    <div className="relative w-[320px] sm:w-[400px] h-[240px] sm:h-[300px] mx-auto">
      <svg viewBox="0 0 400 300" className="w-full h-full">
        {/* Circuit lines */}
        {circuitPaths.map((path, i) => (
          <path
            key={i}
            ref={el => linesRef.current[i] = el}
            d={path.d}
            fill="none"
            stroke="rgba(0,255,128,0.4)"
            strokeWidth="1.5"
          />
        ))}
        {/* Connection nodes */}
        {circuitPaths.map((path, i) => (
          <circle
            key={`node-${i}`}
            ref={el => nodesRef.current[i] = el}
            cx={path.node.cx}
            cy={path.node.cy}
            r="4"
            fill="#00FF80"
            className="animate-node-pulse"
            style={{ animationDelay: `${i * 0.25}s` }}
          />
        ))}
        {/* Central chip */}
        <g ref={chipRef}>
          <rect
            x="160" y="120" width="80" height="60" rx="12"
            fill="#014433"
            stroke="#00FF80"
            strokeWidth="1.5"
          />
          <text x="200" y="157" textAnchor="middle" fill="#FEFEFE" fontSize="14" fontWeight="700" fontFamily="Inter, sans-serif" letterSpacing="2">
            NEXUS
          </text>
        </g>
      </svg>
      {/* Chip glow overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] h-[70px] rounded-xl animate-chip-glow pointer-events-none" />
    </div>
  )
}
