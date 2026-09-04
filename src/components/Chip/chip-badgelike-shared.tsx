/* ─── ChipBadgeLike shared component ──────────────────────────────────────── */

// Fast Refresh 를 살리기 위해 이 파일은 컴포넌트만 내보낸다.
// variant 상수·스타일 맵은 ./chip-badgelike-constants 에 있다.
// 타입 선언은 컴파일 시점에 지워져 Fast Refresh 경계에 영향을 주지 않으므로 여기 둘 수 있다.

import { cn } from '@/lib/utils'

/* ─── CloseIcon SVG ───────────────────────────────────────────────────────── */

export function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M4 4L12 12M4 12L12 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ─── Close part ──────────────────────────────────────────────────────────── */

// 닫기 버튼의 기본 접근 이름.
// Callout.Close 는 'Close' 지만 칩은 'Remove' 로 둔다 — 접근 이름은 사용자에게 일어나는
// **결과**를 말해야 하고(ANATOMY §5.3 C9), 칩은 닫히는 것이 아니라 목록에서 제거된다.
// 값을 상수로 묶는 이유: 3종이 같은 기본값을 쓰는데 세 파일에 흩어 두면 하나만 고쳐져
// 어휘가 갈린다. 기본값이 한 곳이어야 "Remove" 라는 결정도 한 곳에서 뒤집힌다.
const DEFAULT_CLOSE_LABEL = 'Remove'

/**
 * Close-part props shared by all three ChipBadgeLike components.
 *
 * 세 파일이 같은 prop 을 세 번 선언하면 JSDoc·기본값이 서로 어긋나므로 여기에서만 선언하고
 * 각 컴포넌트의 props interface 가 이것을 확장한다.
 */
export interface ChipBadgeLikeClosableProps {
  /** When provided, shows a close (X) icon. Clicking it calls this handler. */
  onClose?: () => void
  /**
   * Accessible name for the close button. The button is icon-only, so this string is its only name.
   *
   * 이름을 `'aria-label'` 로 두지 않는 이유: 루트가 `HTMLAttributes<HTMLSpanElement>` 를 확장해
   * 이미 `aria-label` 을 갖는다. 한 이름이 루트와 내부 버튼 두 곳을 가리키면 어디에 붙는지 알 수 없다.
   * `Callout.Close` 는 그 자체가 독립 서브컴포넌트라 충돌이 없어 `'aria-label'` 을 그대로 쓴다.
   * @default 'Remove'
   */
  closeLabel?: string
}

interface ChipBadgeLikeCloseProps {
  /** 접근 이름. 주지 않으면 `DEFAULT_CLOSE_LABEL`. */
  label?: string
  onClose: () => void
  disabled: boolean
  /** 사이즈별 아이콘 크기 클래스 — `chipBadgeLikeSizeMap[size].icon`. */
  iconClassName: string
}

/**
 * 닫기 버튼.
 *
 * 3종이 완전히 같은 마크업을 쓰므로 여기에서만 그린다 — 세 파일에 흩어져 있으면
 * 접근 이름을 다시 하드코딩하는 이탈이 조용히 생긴다(그것이 ANATOMY §5.1 A8 의 원인이었다).
 * 라이브러리 표면이 아니라 3종의 내부 파트이므로 `Chip/index.ts` 로 내보내지 않는다.
 */
export function ChipBadgeLikeClose({
  label = DEFAULT_CLOSE_LABEL,
  onClose,
  disabled,
  iconClassName,
}: ChipBadgeLikeCloseProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(e) => { e.stopPropagation(); onClose() }}
      disabled={disabled}
      className={cn(
        'relative z-[1] flex-shrink-0 cursor-pointer outline-none',
        iconClassName,
      )}
    >
      <CloseIcon className="size-full" />
    </button>
  )
}
