---
name: implement
description: "완성된 JSON 스펙으로 토큰 + 컴포넌트 구현 + 빌드 검증"
argument-hint: "[ComponentName]"
---

# Implement — 구현 및 빌드 검증

완성된 JSON spec으로부터 컴포넌트 토큰, 소스 코드, 쇼케이스 등록을 수행하고 빌드를 검증한다.

**입력**: `$ARGUMENTS` = 컴포넌트명

---

## 전제조건

1. `specs/$ARGUMENTS.json`이 **완성** 상태여야 한다 (시각 + 동작 섹션 모두).
   - `variants.size.*`, `variants.{visualAxis}.*` 존재 확인
   - `props`, `states`, `implementation` 섹션 존재 확인
   - 미완성이면 **중단**: "스펙이 완성되지 않았습니다. `/visual-spec`과 `/behavior-spec`을 먼저 실행해주세요."
2. `npm run build`가 현재 통과하는지 확인한다 (clean state).

---

## Step 1 — 토큰 설계

`src/tokens/tokens.css`에 컴포넌트 토큰 섹션을 추가한다.

### 토큰 네이밍

`--comp-{name}-{property}-{variant}[-{state}]`

| Property | 용도 | 예시 |
|----------|------|------|
| bg | 배경색 | `--comp-card-bg-default` |
| content | 텍스트+아이콘 색 | `--comp-card-content-default` |
| border | 테두리 색 | `--comp-card-border-default` |
| height | 높이 | `--comp-card-height-md` |
| px | 좌우 패딩 | `--comp-card-px-md` |
| gap | 내부 간격 | `--comp-card-gap-md` |
| radius | 테두리 둥글기 | `--comp-card-radius-md` |
| icon | 아이콘 크기 | `--comp-card-icon-md` |
| hover-on-dim/bright | hover overlay | `--comp-card-hover-on-dim` |
| active-on-dim/bright | pressed overlay | `--comp-card-active-on-dim` |
| focus-border | 포커스 링 | `--comp-card-focus-border` |

### 스코프 규칙 (절대 위반 금지)

| 토큰 종류 | CSS 스코프 | 값 참조 | 이유 |
|-----------|-----------|---------|------|
| 색상 (bg, content, border, state, focus) | `[data-theme="brand1"]`, `[data-theme="brand2"]` | `var(--semantic-*)` | 테마별 색상 전환 |
| 크기 (height, px, gap, icon, radius) | `:root` | `var(--spacing-*)`, `var(--radius-*)` | 테마와 무관 |

**위반 사례**: `:root`에서 `var(--semantic-*)` 참조 → var() 체인이 끊어져 값이 비어짐.

### Size abbreviations

xLarge → xl, large → lg, medium → md, small → sm, xSmall → xs

→ **토큰 목록을 사용자에게 제시. 확인 후 tokens.css에 작성.**

---

## Step 2 — 컴포넌트 구현

`src/components/{Name}/{Name}.tsx`를 생성한다.
`src/components/Button/Button.tsx`의 구조를 정확히 따른다.

### 파일 구조 순서

```
1. Imports
   - @radix-ui/react-slot (asChild 지원 시)
   - cva, VariantProps from 'class-variance-authority'
   - cn from '@/lib/utils'
   - Spinner from '@/components/icons' (loading 지원 시)

2. /* --- Variant metadata --- */
   - as const 배열: {COMPONENT}_{PROP}S
   - 파생 타입: (typeof ARRAY)[number]

3. /* --- CVA --- */
   - Base: group relative inline-flex items-center justify-center shrink-0 select-none
          transition-colors duration-fast ease-enter
   - Variants: var(--comp-{name}-*) arbitrary values만 사용
   - Radius는 CVA에 넣지 않음 — 컴포넌트에서 조건부 적용 (default vs icon-only)

4. /* --- Disabled classes --- */ (disabled 지원 시)
   - Record<VariantType, string>: variant별 disabled 색상 override

5. /* --- State overlay --- */ (hover/active 지원 시)
   - Record<VariantType, string>: variant별 group-hover/group-active 클래스

6. /* --- Radius map --- */
   - Record<SizeType, string>: 사이즈별 radius
   - (icon-only 있으면) radiusIconOnlyMap 추가

7. /* --- Icon size map --- */ (아이콘 지원 시)
   - Record<SizeType, string>: 사이즈별 아이콘 크기

8. /* --- Spinner size map --- */ (loading 지원 시)
   - Record<SizeType, string>: 사이즈별 스피너 크기

9. /* --- Props --- */
   - interface extending React.*HTMLAttributes + VariantProps + custom props
   - JSDoc: 모든 prop에 @default, @see

10. /* --- Component --- */
    - Comp = asChild ? Slot : '{element}'
    - State overlay <span aria-hidden> pointer-events-none absolute inset-0 rounded-[inherit]
    - Loading: absolute Spinner + invisible content
    - Icon containers: flex-shrink-0 relative
```

### 10대 규칙

1. **토큰만** — 색상, 스페이싱, 라디우스, 듀레이션, 이징 절대 하드코딩 금지
2. **테마 무인식** — brand1/brand2/basic/geo 이름을 컴포넌트 코드에서 참조 금지
3. **CVA + cn** — 모든 multi-variant에 class-variance-authority 사용
4. **as const 배열** — variant 값을 as const로 내보내고 타입 파생
5. **State overlay** — `<span aria-hidden>` + `pointer-events-none absolute inset-0 rounded-[inherit]`
6. **Focus** — `group-focus-visible` 사용 (group-focus 금지)
7. **Motion** — `transition-colors duration-fast ease-enter` (transition-all 금지, 직접 duration 금지)
8. **JSDoc** — 모든 exported prop에 `@default`와 `@see`
9. **Import** — `@/` alias로만 import
10. **기능 누락 금지** — JSON spec에 명시된 기능은 반드시 구현. 차단 시 `// TODO:` 코멘트

### Barrel export

`src/components/{Name}/index.ts`:
```tsx
export { ComponentName } from './ComponentName'
export type { ComponentNameProps } from './ComponentName'
export { COMPONENT_VARIANTS, COMPONENT_SIZES } from './ComponentName'
export type { ComponentVariant, ComponentSize } from './ComponentName'
```

---

## Step 3 — 쇼케이스 등록

### 3.1 최소 쇼케이스 파일

`src/showcase/{Name}Showcase.tsx` 생성:
- 컴포넌트 import
- `{COMPONENT}_TOC` export (`TocEntry[]` 타입)
- `{Name}Showcase` export — variant별 1개씩 기본 인스턴스 렌더링
- 레이아웃은 `src/showcase/shared.tsx`의 `SectionTitle` 사용

### 3.2 App.tsx 등록

`src/App.tsx`를 수정한다:

1. **Import 추가**: `import { {Name}Showcase, {COMPONENT}_TOC } from '@/showcase/{Name}Showcase'`
2. **ComponentId union 확장**: `type ComponentId = '...' | '{kebab-id}'`
3. **SHOWCASE_MAP entry 추가**: `'{kebab-id}': { component: {Name}Showcase, toc: {COMPONENT}_TOC },`

### 3.3 Sidebar 등록

`src/components/showcase-layout/Sidebar.tsx`의 `NAV_GROUPS`에 항목 추가:
- 적절한 그룹 찾기 (Actions, Inputs, Selection, Navigation, Overlay, Display)
- `{ id: '{kebab-id}', label: '{Name}' }` 추가

---

## Step 4 — 빌드 검증

`npm run build` 실행 (= `tsc -b && vite build`).

실패 시:
1. 에러 메시지 분석
2. 수정 (일반적: 누락 import, 타입 불일치, 잘못된 prop명)
3. 재실행
4. **최대 3회 재시도**

3회 모두 실패 시: 사용자에게 에러 상세를 보고. 커밋하지 않음.

---

## Step 5 — 자기 검증 체크리스트

빌드 통과 후, 다음을 점검한다:

- [ ] CVA의 `var(--comp-{name}-*)` 모두 tokens.css에 정의됨
- [ ] `{COMPONENT}_{PROP}S` as const 배열이 index.ts에서 export됨
- [ ] 타입이 배열에서 파생 (`(typeof ARRAY)[number]`)
- [ ] CVA base에 `group relative` 포함
- [ ] 모션: `transition-colors duration-fast ease-enter`
- [ ] State overlay: `<span aria-hidden>` + `pointer-events-none absolute inset-0 rounded-[inherit]`
- [ ] Focus: `group-focus-visible`
- [ ] Disabled: `cursor-not-allowed` + variant별 색상 override
- [ ] Loading (해당 시): `pointer-events-none` + `aria-disabled` + `aria-busy`
- [ ] 아이콘 컨테이너: `flex-shrink-0` + `relative`
- [ ] JSDoc: 모든 exported prop에 `@default`, `@see`
- [ ] 색상 토큰이 `[data-theme]` 스코프에 선언

점검 결과를 사용자에게 보고한다.

→ "빌드 통과, 검증 완료. 다음 단계는 `/showcase $ARGUMENTS`로 쇼케이스를 구성합니다."

---

## 참조 파일

| 목적 | 경로 |
|------|------|
| JSON spec | `specs/{component}.json` |
| 토큰 추가 위치 | `src/tokens/tokens.css` |
| 컴포넌트 gold standard | `src/components/Button/Button.tsx` |
| Barrel export 패턴 | `src/components/Button/index.ts` |
| 쇼케이스 등록 | `src/App.tsx` (SHOWCASE_MAP) |
| 사이드바 등록 | `src/components/showcase-layout/Sidebar.tsx` (NAV_GROUPS) |
| 쇼케이스 레이아웃 | `src/showcase/shared.tsx` |
| 토큰 배치 규칙 | `docs/TOKEN_LAYER_RULES.md` |
| 코드 패턴 | `docs/COMPONENT_PATTERNS.md` |
| 검증 체크리스트 | `docs/COMPONENT_CHECKLIST.md` |
