/* ─── ChipBadgeLike shared component ──────────────────────────────────────── */

// Fast Refresh 를 살리기 위해 이 파일은 컴포넌트만 내보낸다.
// variant 상수·스타일 맵은 ./chip-badgelike-constants 에 있다.

/* ─── CloseIcon SVG ───────────────────────────────────────────────────────── */

export function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M4 4L12 12M4 12L12 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
