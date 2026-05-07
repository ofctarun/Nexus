export default function VerifyStep({ icon, label, isLast = false }) {
  return (
    <div className="flex items-center gap-4 sm:gap-6">
      <div className="flex flex-col items-center text-center max-w-[140px] sm:max-w-[160px]">
        {/* Icon container */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-nexus-emerald/80 border border-nexus-glow/20 flex items-center justify-center mb-3">
          {icon}
        </div>
        {/* Label */}
        <p className="text-nexus-soft-gray text-xs sm:text-sm leading-snug">{label}</p>
      </div>
      {/* Connector arrow (not shown for last item) */}
      {!isLast && (
        <div className="hidden sm:flex items-center gap-1">
          <div className="w-8 sm:w-12 border-t border-dashed border-nexus-glow/30" />
          <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-nexus-glow/40" />
        </div>
      )}
    </div>
  )
}
