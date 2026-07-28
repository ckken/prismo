export function LogoMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="brand-lockup" aria-label="Prismo">
      <svg className="brand-mark" viewBox="0 0 32 32" aria-hidden="true">
        <defs>
          <linearGradient id="prismo-violet" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="#9B87FF" />
            <stop offset="1" stopColor="#5B35E5" />
          </linearGradient>
          <linearGradient id="prismo-cyan" x1="16" y1="5" x2="28" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#74F1FF" />
            <stop offset="1" stopColor="#178CFF" />
          </linearGradient>
          <linearGradient id="prismo-coral" x1="11" y1="17" x2="24" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFB19A" />
            <stop offset="1" stopColor="#FF5E7D" />
          </linearGradient>
        </defs>
        <path className="prismo-plane prismo-plane-violet" d="M5.5 11.4 15.8 5v20.8L5.5 19.4Z" />
        <path className="prismo-plane prismo-plane-cyan" d="m16.2 5 10.3 6.4v8L16.2 25.8Z" />
        <path className="prismo-plane prismo-plane-coral" d="m5.5 19.4 10.3 6.4 10.7-6.4-10.7 7.6Z" />
        <path className="prismo-seam" d="M15.8 5v20.8M5.5 19.4l10.3 6.4 10.7-6.4" />
      </svg>
      {!compact && (
        <span className="brand-name">
          <strong>Prismo</strong>
          <em>Local UI delivery</em>
        </span>
      )}
    </span>
  )
}
