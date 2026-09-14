/**
 * 쇼케이스 페이지 등록 — **여기 한 곳이다.**
 *
 * 2026-09-14 전에는 두 곳이었다: `App.tsx` 의 `SHOWCASE_MAP`(라우팅 + 목차)과
 * `Sidebar.tsx` 의 `NAV_GROUPS`(메뉴). 한쪽만 고치면 페이지가 라우팅은 되는데 메뉴에
 * 없거나 그 반대가 됐고, 그 어긋남은 `docs:check` D5 가 두 파일을 각각 파싱해서 잡고
 * 있었다 — 검사가 필요했던 이유 자체가 등록처가 둘이라는 것이었다.
 *
 * ## 이 파일이 정하는 것
 * - **순서**: 배열 순서가 사이드바 순서다. 그룹은 처음 나온 순서로 묶인다.
 * - **코드 분할**: `load` 는 동적 `import()` 다. 페이지를 열 때 그 청크만 받는다.
 *   정적 import 시절에는 17 페이지가 전부 초기 번들에 들어갔다.
 * - **목차**: 페이지 모듈이 함께 내보내는 `*_TOC` 를 같은 `load` 에서 가져온다.
 *   그래서 목차도 페이지와 함께 늦게 도착한다 — 도착 전에는 목차 열이 비어 있다.
 *
 * ## 새 페이지 추가
 * 아래 배열에 한 줄 더한다. 그게 전부다 — 라우팅·메뉴·목차·코드 분할이 따라온다.
 * `id` 는 URL 해시(`#/button`)이자 `docs:check` D5 가 컴포넌트·스펙과 대조하는 키다.
 */
import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import type { TocEntry } from '@/components/showcase-layout'

/** 페이지 모듈이 내놓아야 하는 형태. 컴포넌트는 필수, 목차는 없으면 빈 배열로 취급한다. */
export interface ShowcaseModule {
  default: ComponentType
  toc: TocEntry[]
}

export interface ShowcaseEntry {
  /** URL 해시이자 spec·컴포넌트 대조 키. kebab-case. */
  id: string
  /** 사이드바에 보이는 이름. */
  label: string
  /** 사이드바 그룹. 같은 문자열끼리 묶이고, 처음 나온 순서로 정렬된다. */
  group: string
  /** 동적 import. named export 를 `default` 로 옮겨 `React.lazy` 가 받을 수 있게 한다. */
  load: () => Promise<ShowcaseModule>
}

export const SHOWCASES: ShowcaseEntry[] = [
  {
    id: 'tokens',
    label: 'Tokens',
    group: 'Foundation',
    load: () => import('./TokenShowcase').then((m) => ({ default: m.TokenShowcase, toc: m.TOKEN_TOC })),
  },
  {
    id: 'block-catalog',
    label: 'Block Catalog',
    group: 'Foundation',
    load: () =>
      import('./BlockCatalogShowcase').then((m) => ({
        default: m.BlockCatalogShowcase,
        toc: m.BLOCK_CATALOG_TOC,
      })),
  },

  {
    id: 'button',
    label: 'Button',
    group: 'Actions',
    load: () => import('./ButtonShowcase').then((m) => ({ default: m.ButtonShowcase, toc: m.BUTTON_TOC })),
  },
  {
    id: 'icon-button',
    label: 'IconButton',
    group: 'Actions',
    load: () =>
      import('./IconButtonShowcase').then((m) => ({
        default: m.IconButtonShowcase,
        toc: m.ICON_BUTTON_TOC,
      })),
  },
  {
    id: 'text-button',
    label: 'TextButton',
    group: 'Actions',
    load: () =>
      import('./TextButtonShowcase').then((m) => ({
        default: m.TextButtonShowcase,
        toc: m.TEXT_BUTTON_TOC,
      })),
  },
  {
    id: 'switch',
    label: 'Switch',
    group: 'Actions',
    load: () => import('./SwitchShowcase').then((m) => ({ default: m.SwitchShowcase, toc: m.SWITCH_TOC })),
  },
  {
    id: 'checkbox',
    label: 'Checkbox',
    group: 'Actions',
    load: () =>
      import('./CheckboxShowcase').then((m) => ({ default: m.CheckboxShowcase, toc: m.CHECKBOX_TOC })),
  },
  {
    id: 'radio',
    label: 'Radio',
    group: 'Actions',
    load: () => import('./RadioShowcase').then((m) => ({ default: m.RadioShowcase, toc: m.RADIO_TOC })),
  },

  {
    id: 'badge',
    label: 'Badge',
    group: 'Indicators',
    load: () => import('./BadgeShowcase').then((m) => ({ default: m.BadgeShowcase, toc: m.BADGE_TOC })),
  },
  {
    id: 'chip-universal',
    label: 'Chip.Universal',
    group: 'Indicators',
    load: () => import('./ChipShowcase').then((m) => ({ default: m.ChipShowcase, toc: m.CHIP_TOC })),
  },
  {
    id: 'chip-badgelike',
    label: 'Chip.BadgeLike',
    group: 'Indicators',
    load: () =>
      import('./ChipBadgeLikeShowcase').then((m) => ({
        default: m.ChipBadgeLikeShowcase,
        toc: m.CHIP_BADGELIKE_TOC,
      })),
  },

  {
    id: 'tab',
    label: 'Tab',
    group: 'Navigation',
    load: () => import('./TabShowcase').then((m) => ({ default: m.TabShowcase, toc: m.TAB_TOC })),
  },
  {
    id: 'nav-vertical',
    label: 'NavVertical',
    group: 'Navigation',
    load: () =>
      import('./NavVerticalShowcase').then((m) => ({
        default: m.NavVerticalShowcase,
        toc: m.NAV_VERTICAL_TOC,
      })),
  },
  {
    id: 'segment-bar',
    label: 'SegmentBar',
    group: 'Navigation',
    load: () =>
      import('./SegmentBarShowcase').then((m) => ({
        default: m.SegmentBarShowcase,
        toc: m.SEGMENT_BAR_TOC,
      })),
  },

  {
    id: 'tooltip',
    label: 'Tooltip',
    group: 'Overlay',
    load: () => import('./TooltipShowcase').then((m) => ({ default: m.TooltipShowcase, toc: m.TOOLTIP_TOC })),
  },
  {
    id: 'callout',
    label: 'Callout',
    group: 'Overlay',
    load: () => import('./CalloutShowcase').then((m) => ({ default: m.CalloutShowcase, toc: m.CALLOUT_TOC })),
  },

  {
    id: 'skeleton',
    label: 'Skeleton',
    group: 'Feedback',
    load: () => import('./SkeletonShowcase').then((m) => ({ default: m.SkeletonShowcase, toc: m.SKELETON_TOC })),
  },
]

/** 해시 라우팅이 유효한 id 인지 판정할 때 쓴다. 배열에서 파생하므로 등록 누락이 불가능하다. */
export const SHOWCASE_IDS = new Set(SHOWCASES.map((entry) => entry.id))

/**
 * id → lazy 컴포넌트. **모듈 로드 시점에 한 번** 만든다.
 *
 * `lazy()` 를 렌더 중에 부르면(예: `useMemo(() => lazy(...))`) 매번 새 컴포넌트 타입이 되어
 * 같은 페이지가 언마운트·재마운트되고, `react-hooks/static-components` 가 그것을 막는다.
 * 여기서 미리 만들어 두면 각 페이지의 타입이 앱 수명 동안 하나로 고정된다.
 * `lazy` 는 로더를 감싸 둘 뿐이라 실제 `import()` 는 그 페이지가 처음 렌더될 때 일어난다 —
 * 코드 분할은 그대로다.
 */
export const SHOWCASE_PAGES: Map<string, LazyExoticComponent<ComponentType>> = new Map(
  SHOWCASES.map((entry) => [entry.id, lazy(entry.load)]),
)

/** 한 페이지가 속한 그룹 이름. 쇼케이스 헤더가 "Group Name" 자리에 쓴다. */
export function showcaseGroupOf(id: string): string {
  return SHOWCASES.find((entry) => entry.id === id)?.group ?? ''
}

/** 사이드바용 그룹 묶음. 그룹 순서와 그룹 안 순서 모두 배열 순서를 따른다. */
export function groupedShowcases(): Array<{ label: string; items: ShowcaseEntry[] }> {
  const groups: Array<{ label: string; items: ShowcaseEntry[] }> = []
  for (const entry of SHOWCASES) {
    const existing = groups.find((group) => group.label === entry.group)
    if (existing) existing.items.push(entry)
    else groups.push({ label: entry.group, items: [entry] })
  }
  return groups
}
