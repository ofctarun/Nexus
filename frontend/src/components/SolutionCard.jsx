export default function SolutionCard() {
  const solutions = [
    {
      title: 'AI Document Intelligence',
      description: 'Upload, manage, and query enterprise documents with local AI processing.',
    },
    {
      title: 'Enterprise Security',
      description: 'Role-based access control and multi-tenant data isolation.',
    },
    {
      title: 'AI Safeguards',
      description: 'Comprehensive audit logging and security guardrails throughout.',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden mt-8 sm:mt-12 shadow-xl">
      {/* Left: Dark green with "Verifiable" text */}
      <div className="relative bg-nexus-emerald p-8 sm:p-12 flex flex-col justify-center min-h-[200px] sm:min-h-[300px] overflow-hidden">
        {/* Floating accent dots */}
        <div className="absolute top-8 right-12 w-3 h-3 rounded-full bg-nexus-glow/50" />
        <div className="absolute top-16 left-1/2 w-2 h-2 rounded-full bg-nexus-glow/30" />
        <div className="absolute bottom-12 left-10 w-2.5 h-2.5 rounded-full bg-nexus-glow/40" />
        <div className="absolute top-1/2 right-8 w-4 h-4 rounded-full bg-nexus-glow/60" />
        
        <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-nexus-white leading-tight">
          Verifiable
        </h3>
      </div>

      {/* Right: White with solution features */}
      <div className="bg-white p-6 sm:p-10 flex flex-col justify-center">
        {solutions.map((sol, i) => (
          <div key={i} className={`${i > 0 ? 'mt-5 pt-5 border-t border-gray-100' : ''}`}>
            <h4 className="text-base sm:text-lg font-bold text-nexus-black mb-1">
              {sol.title}
            </h4>
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
              {sol.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
