export function LogoMark({ compact = false }: { compact?: boolean }) {
  const markSrc = `${__PUBLIC_BASE_PATH__.replace(/\/$/, "")}/brand/prismo-logo-mono-v1.png`
  return (
    <span className="brand-lockup" aria-label="Prismo">
      <img className="brand-mark" src={markSrc} alt="" aria-hidden="true" />
      {!compact && (
        <span className="brand-name">
          <strong>Prismo</strong>
          <em>Local UI delivery</em>
        </span>
      )}
    </span>
  )
}
