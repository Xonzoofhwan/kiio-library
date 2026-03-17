---
name: showcase
description: "구현된 컴포넌트의 쇼케이스 페이지 생성 (대화형 섹션 구성)"
argument-hint: "[ComponentName]"
---

# Showcase — 쇼케이스 페이지 구성

구현된 컴포넌트의 쇼케이스 페이지를 대화형으로 구성한다.
디자인 씽킹 + 체크리스트 방식으로 사용자와 함께 결정한다.

**입력**: `$ARGUMENTS` = 컴포넌트명

---

## 전제조건

1. `src/components/{Name}/{Name}.tsx`가 존재해야 한다.
2. `src/App.tsx`의 `SHOWCASE_MAP`에 등록되어 있어야 한다.
3. 전제 미충족 시 **중단**: "컴포넌트가 먼저 구현되어야 합니다. `/implement $ARGUMENTS`를 실행해주세요."

---

## Step 0 — 쇼케이스 디자인 씽킹

쇼케이스를 구성하기 전에 사용자와 대화하여 우선순위를 파악한다:

1. **"이 컴포넌트를 처음 보는 개발자가 가장 먼저 알아야 할 것은?"**
   - 어떤 variant 조합이 기본인지? 어떤 props가 핵심인지?

2. **"실제 프로덕트에서 가장 많이 쓰이는 조합은?"**
   - 주력 사이즈, 주력 variant, 일반적 사용 패턴

3. **"디자이너가 확인하고 싶어할 시각적 변형은?"**
   - 테마 차이, shape 차이, 상태별 색상 변화

→ 답변을 바탕으로 쇼케이스 섹션 구성 우선순위를 결정한다.

---

## Step 1 — 컴포넌트 분석

`src/components/{Name}/{Name}.tsx`를 읽고 추출한다:

- variant 축과 값 (as const 배열에서)
- 사이즈 축과 값
- 지원하는 상태 (disabled, loading, error 등)
- 아이콘 지원 여부 (iconLeading, iconTrailing)
- fullWidth 지원 여부
- asChild 지원 여부
- 기타 특수 props

기존 쇼케이스를 참조하여 이 컴포넌트에 적합한 패턴을 파악:
- `src/showcase/ButtonShowcase.tsx` — 매트릭스형 (variant x size grid)
- `src/showcase/TextFieldShowcase.tsx` — 입력형 (상태별 데모)
- `src/showcase/TabShowcase.tsx` — compound형 (사용 패턴별 데모)
- `src/showcase/BadgeShowcase.tsx` — 디스플레이형 (variant 나열)

---

## Step 2 — 섹션 체크리스트 제안

컴포넌트 유형에 맞는 섹션 체크리스트를 사용자에게 제안한다.

### 액션/폼 컴포넌트 (Button, TextField, Select 등)

```
- Variant x Size 매트릭스 — 모든 variant/size 조합을 Grid로
- 색상 스펙 — variant별 시맨틱 토큰명 (ColorSwatch 사용)
- 사이즈 스펙 — height, padding, gap, typography, radius, icon 값 표
- Shape variants — basic vs geo 비교
- With Icons — leading, trailing, both, icon-only 조합
- States — default, hover, active, focused, disabled, loading
- Full Width — fill 모드 데모
- 테마 비교 — 필요 시 data-theme 전환 데모
```

### 디스플레이 컴포넌트 (Badge, Avatar, Divider 등)

```
- Variant 매트릭스 — 모든 variant 나열
- 사이즈 비교
- 색상 스펙
- 콘텐츠 변형 — 긴 텍스트, 오버플로, 비어있음
- 다른 컴포넌트와 조합 — 카드 안, 리스트 안 등
```

### Compound 컴포넌트 (Tab, Select, DropdownMenu 등)

```
- 기본 사용법
- Variant 비교
- 사이즈 비교
- Controlled vs Uncontrolled
- 키보드 내비게이션 안내
- 엣지 케이스 — 많은 항목, 긴 텍스트, disabled 항목
```

→ 사용자가 원하는 섹션을 선택한다. 커스텀 섹션 추가도 가능.

---

## Step 3 — 섹션 빌드

선택된 섹션을 하나씩 구현한다.

### 사용 가능한 레이아웃 프리미티브 (`src/showcase/shared.tsx`)

| 컴포넌트 | 용도 |
|----------|------|
| `SectionTitle` | 섹션 제목 (h2) |
| `ColHeader` | Grid 열 헤더 |
| `RowHeader` | Grid 행 헤더 |
| `SpecLabel` | 스펙 레이블 (작은 회색) |
| `SpecValue` | 스펙 값 (작은 텍스트) |
| `ColorSwatch` | 색상 점 + 토큰명 |
| `PlusIcon`, `TrashIcon`, `HeartIcon`, ... | 플레이스홀더 아이콘 |

### 매트릭스 레이아웃 패턴

```tsx
<div className="grid grid-cols-[auto_repeat(N,1fr)] gap-x-4 gap-y-3 items-center">
  {/* 열 헤더 */}
  <div /> {/* 빈 칸 (행 헤더 자리) */}
  {SIZES.map(s => <ColHeader key={s}>{s}</ColHeader>)}

  {/* 행 */}
  {VARIANTS.map(v => (
    <Fragment key={v}>
      <RowHeader>{v}</RowHeader>
      {SIZES.map(s => (
        <div key={s} className="flex justify-center">
          <Component variant={v} size={s}>Label</Component>
        </div>
      ))}
    </Fragment>
  ))}
</div>
```

### TOC (Table of Contents)

각 섹션에 대응하는 `{COMPONENT}_TOC` 배열을 업데이트한다:

```tsx
import type { TocEntry } from '@/components/showcase-layout'

export const CARD_TOC: TocEntry[] = [
  { id: 'card', label: 'Card', level: 1 },
  { id: 'variant-size', label: 'Variant x Size' },
  { id: 'color-spec', label: 'Color Spec' },
  { id: 'states', label: 'States' },
]
```

섹션의 `id`와 실제 DOM `id` attribute를 일치시킨다.

### 서브에이전트 활용

독립적인 섹션이 3개 이상이면 Explore/General 서브에이전트를 활용하여 병렬로 작성할 수 있다:
- 에이전트 1: Variant x Size 매트릭스
- 에이전트 2: States 매트릭스
- 에이전트 3: Color/Size 스펙 테이블
→ 결과를 합체하여 하나의 파일로 조립

---

## Step 4 — 빌드 및 시각 확인

1. `npm run build` 실행하여 타입 에러 없는지 확인.
2. 사용자에게 안내: "`npm run dev` 후 브라우저에서 {Name} 페이지를 열어 시각적으로 확인해주세요."

확인 항목:
- [ ] 사이드바에서 컴포넌트 클릭 시 쇼케이스 표시
- [ ] TOC 네비게이션이 각 섹션으로 스크롤
- [ ] 모든 variant/size 조합이 올바르게 렌더링
- [ ] Shape 토글 (basic <-> geo) 시 radius 변화 확인
- [ ] 어두운 배경/밝은 배경에서 상태 오버레이 확인

→ "쇼케이스가 완성되었습니다. `/verify $ARGUMENTS`로 전체 검증을 실행할 수 있습니다."

---

## 참조 파일

| 목적 | 경로 |
|------|------|
| 컴포넌트 소스 | `src/components/{Name}/{Name}.tsx` |
| 레이아웃 프리미티브 | `src/showcase/shared.tsx` |
| 매트릭스 쇼케이스 참조 | `src/showcase/ButtonShowcase.tsx` |
| 입력형 쇼케이스 참조 | `src/showcase/TextFieldShowcase.tsx` |
| Compound 쇼케이스 참조 | `src/showcase/TabShowcase.tsx` |
| 디스플레이 쇼케이스 참조 | `src/showcase/BadgeShowcase.tsx` |
| TOC 타입 정의 | `src/components/showcase-layout/TableOfContents.tsx` |
