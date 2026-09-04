# Component Roadmap

> **기준일 2026-09-05** — `src/components/`·`specs/`·`src/App.tsx`를 직접 읽어 대조했다.
> 체크박스는 "계획"이 아니라 **오늘 저장소에 있는 것**만 표시한다. 없는 것은 비워 둔다.

## 현재 상태 요약

| 항목 | 수 | 근거 |
|---|:-:|---|
| 구현된 컴포넌트 폴더 | 13 | `src/components/` (`icons`·`showcase-layout` 제외) |
| 쇼케이스 페이지 | 17 | `src/App.tsx`의 `SHOWCASE_MAP` (컴포넌트 15 + `tokens` + `block-catalog`) |
| JSON 스펙 | 14 | `specs/*.json` (`_TEMPLATE.json` 제외) |
| 스펙 없는 컴포넌트 | 0 | Tab·Skeleton·Chip.Universal 3건이 2026-09-05에 역추출돼 채워졌다 |

구현 목록 (알파벳순): Badge · Button · Callout · Checkbox · Chip · NavVertical · Radio · SegmentBar · Skeleton · Switch · Tab · TextButton · Tooltip.
IconButton은 별도 폴더가 아니라 `src/components/Button/IconButton.tsx`에 있고 Button과 `--comp-button-*` 토큰을 공유한다.

---

## Phase 1: Form Inputs

- [ ] Input (text, email, password, etc.)
- [ ] Textarea
- [x] **Checkbox** — `src/components/Checkbox/`, `specs/checkbox.json`, 쇼케이스 `checkbox`
- [x] **Radio** — `src/components/Radio/` (Radio + RadioGroup), `specs/radio.json`, 쇼케이스 `radio`
- [ ] Select/Dropdown
- [x] **Switch/Toggle** — `src/components/Switch/`, `specs/switch.json`, 쇼케이스 `switch`

## Phase 2: Layout & Display

- [ ] Card
- [x] **Badge** — `src/components/Badge/` (BadgeLabel + BadgeDot), `specs/badge.json`, 쇼케이스 `badge`
- [ ] Avatar
- [ ] Divider
- [x] **Skeleton** — `src/components/Skeleton/` (SkeletonBlock + TextReservation + `usePretext`), `specs/skeleton.json`, 쇼케이스 `skeleton`
- [x] **Chip** *(로드맵에 없던 항목 — 추가)* — `src/components/Chip/`: `ChipUniversal` + `ChipBadgeLike{Universal,Emphasized,Error}`. `specs/chip-universal.json` + `specs/chip-badgelike.json`, 쇼케이스 `chip-universal`·`chip-badgelike`

## Phase 3: Feedback & Overlay

- [ ] Modal/Dialog
- [ ] Toast/Notification
- [ ] Alert
- [x] **Tooltip** — `src/components/Tooltip/`, `specs/tooltip.json`, 쇼케이스 `tooltip`
- [ ] Progress Bar
- [x] **Callout** *(로드맵에 없던 항목 — 추가)* — Radix Popover 기반 콜아웃. `src/components/Callout/`, `specs/callout.json`, 쇼케이스 `callout`

## Phase 4: Navigation

- [x] **Tabs** — 구현 이름은 **`Tab`** (compound: root `<Tab>` + `Tab.List`/`Tab.Item`/`Tab.Panel`). `src/components/Tab/`, `specs/tab.json`, 쇼케이스 `tab`
- [ ] Breadcrumb
- [ ] Pagination
- [ ] Menu/Dropdown
- [x] **NavVertical** *(로드맵에 없던 항목 — 추가)* — 세로 내비게이션. 방향키 roving을 직접 구현한 유일한 컴포넌트. `src/components/NavVertical/`, `specs/nav-vertical.json`, 쇼케이스 `nav-vertical`
- [x] **SegmentBar** *(로드맵에 없던 항목 — 추가)* — 세그먼티드 컨트롤. `src/components/SegmentBar/`, `specs/segment-bar.json`, 쇼케이스 `segment-bar`

## Phase 0: Actions (로드맵에 없던 그룹 — 추가)

Button 계열은 Phase 1 이전에 이미 완성돼 있었으나 로드맵에 항목이 없었다.

- [x] **Button** — hierarchy/intent/size/shape + loading + `asChild`. `Button` · `ButtonEmphasized` · `ButtonError`. `specs/button.json`, 쇼케이스 `button`
- [x] **IconButton** — `IconButton` · `IconButtonEmphasized` · `IconButtonError`. 스펙은 `specs/button.json`에 포함, 쇼케이스 `icon-button`
- [x] **TextButton** — `src/components/TextButton/`, `specs/text-button.json`, 쇼케이스 `text-button`

## Phase 5: Documentation

- [x] ~~Storybook setup~~ → **자체 쇼케이스로 대체 — `src/showcase/`** (17 페이지). Storybook은 도입하지 않기로 확정했다 ([QUALITY_GATES_PLAN.md §1 비목표](./QUALITY_GATES_PLAN.md#1-목표와-비목표))
- [x] Component documentation — `specs/*.json` 14종 + 쇼케이스 17 페이지 + `docs/` 문서. 13개 컴포넌트 전부 스펙을 갖췄다
- [x] Token documentation — [token-reference.md](./token-reference.md) (3레이어 전체 값 + Tailwind 매핑), [TOKEN_LAYER_RULES.md](./TOKEN_LAYER_RULES.md) (배치 판단 규칙)
- [x] Theme switching demo — `src/App.tsx`의 `data-theme` light/dark 토글이 쇼케이스 전체에 적용된다
- [x] Usage examples — 쇼케이스 Recipes 탭의 `UsageGuidelines` 블록. **미완**: 현재 Callout·Tooltip·BlockCatalog 3곳에만 작성돼 있다

> Phase 5의 남은 일은 "문서 체계를 만드는 것"이 아니라 **Usage 누락 12건을 채우는 것**뿐이다.

## Phase 6: Distribution

**착수하지 않는다.** `package.json`이 `private: true`이고 `main`·`types`·`exports` 필드가 없으며 이 라이브러리를 소비하는 저장소가 아직 0개다 — 배포 대상이 없는 상태에서 패키징을 만들면 검증되지 않은 계약만 늘어난다. 첫 소비자가 생기는 시점이 착수 신호다.

- [ ] npm package configuration
- [ ] Build optimization
- [ ] Type definitions export
- [ ] Comprehensive README
- [ ] GitHub repository setup

---

## 이 문서를 갱신하는 규칙

1. 체크는 **구현이 존재할 때만** 한다. "곧 할 것"에 체크하지 않는다.
2. 로드맵에 없는 컴포넌트를 만들었으면 **적절한 Phase에 항목을 추가하고** 체크한다. 목록에서 빠진 구현은 로드맵을 무용지물로 만든다.
3. 구현 이름이 로드맵 이름과 다르면(예: 로드맵 "Tabs" ↔ 구현 `Tab`) **양쪽을 함께 적는다.**
4. 스펙·쇼케이스가 빠진 항목은 체크하되 **"스펙 없음"을 같이 적는다** — 통과와 미완을 구분한다.
