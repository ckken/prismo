export function AgenicMark() {
  return (
    <svg className="brand-mark" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 3 29 28h-7.1L16 16.6 10.1 28H3L16 3Z" fill="currentColor" />
      <path d="m16 16.6 4.2 8.2h-8.4l4.2-8.2Z" fill="var(--surface, currentColor)" />
    </svg>
  )
}

export function LogoMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="brand-lockup" aria-label="Agenic">
      <AgenicMark />
      {!compact && (
        <span className="brand-name">
          <strong>Agenic</strong>
          <em>Agent-first UI delivery</em>
        </span>
      )}
    </span>
  )
}
