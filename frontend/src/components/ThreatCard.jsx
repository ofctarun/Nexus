import { ChevronDown } from 'lucide-react'

const leftThreats = [
  'Inserting Backdoors in AI Models',
  'Extraction of AI Models and Data',
  'Jailbreaks',
  'Model DoS Attacks',
  'FinOps Attacks',
]

const rightThreats = [
  'Hallucination',
  'Bias and Discrimination',
  'Toxicity, Aggression and Disinformation',
  'Social Engineering',
  'Misalignment',
]

export default function ThreatCard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden mt-8 sm:mt-12">
      {/* Left: Dark visual */}
      <div className="relative bg-black p-8 sm:p-12 flex flex-col justify-end min-h-[280px] sm:min-h-[350px] overflow-hidden">
        {/* Abstract green glow shape */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[200px] h-[300px] relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[180px] h-[150px] rounded-full bg-nexus-glow/10 blur-[40px]" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[180px] h-[150px] rounded-full bg-nexus-glow/10 blur-[40px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60px] h-[60px] rounded-full bg-nexus-glow/20 blur-[20px]" />
          </div>
        </div>
        {/* Floating green icons */}
        <div className="absolute top-6 left-8 flex gap-3">
          <div className="w-8 h-8 rounded-full bg-nexus-glow/20 border border-nexus-glow/30 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-nexus-glow/60" />
          </div>
          <div className="w-8 h-8 rounded-full bg-nexus-forest/40 border border-nexus-forest/50 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-nexus-forest/80" />
          </div>
        </div>
        <h3 className="relative z-10 text-2xl sm:text-3xl font-bold text-nexus-white">
          New Threats
        </h3>
      </div>

      {/* Right: Light green threat list */}
      <div className="bg-nexus-mint p-6 sm:p-10">
        <h4 className="text-lg sm:text-xl font-bold text-nexus-black mb-4 sm:mb-6">The Problem</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
          <div className="space-y-2.5">
            {leftThreats.map((t) => (
              <div key={t} className="flex items-start gap-2">
                <span className="text-nexus-glow mt-1 text-xs">▶</span>
                <span className="text-nexus-charcoal text-xs sm:text-sm leading-tight">{t}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2.5">
            {rightThreats.map((t) => (
              <div key={t} className="flex items-start gap-2">
                <span className="text-nexus-glow mt-1 text-xs">▶</span>
                <span className="text-nexus-charcoal text-xs sm:text-sm leading-tight">{t}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button className="flex items-center gap-1 bg-nexus-emerald text-nexus-white text-xs font-medium px-4 py-2 rounded-full hover:bg-nexus-forest transition-colors">
            View Solutions <ChevronDown size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
