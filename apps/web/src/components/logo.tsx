export function LogoMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="brand-lockup" aria-label="shadcnagent">
      <svg className="brand-mark" viewBox="0 0 32 32" aria-hidden="true">
        <path d="M8 7h13l4 4v14H8z" />
        <path d="M12 13h9M12 18h6" />
        <path className="brand-check" d="m18.5 23 2 2 4-5" />
      </svg>
      {!compact && (
        <span className="brand-name">
          <strong>Shadcn</strong> Agent Kit
        </span>
      )}
    </span>
  )
}
