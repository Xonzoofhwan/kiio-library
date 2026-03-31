# Showcase Template

컴포넌트 쇼케이스 페이지 작성 가이드. 새 컴포넌트 추가 시 이 문서의 구조를 따른다.

---

## 1. 페이지 레이아웃

```
┌─────────────────────────────────────────────────────────────────┐
│  Sidebar (240px fixed)  │           .con (flex, justify-center) │
│                         │  ┌─── max-w-960, px-48, gap-32 ───┐  │
│  ┌───────────────────┐  │  │                                 │  │
│  │ Logo              │  │  │  mainColumn (flex-1)     ToC    │  │
│  ├───────────────────┤  │  │  ┌─────────────┐     (192px)   │  │
│  │ NavVertical       │  │  │  │ Header      │  ┌─────────┐  │  │
│  │  · Foundation     │  │  │  │  group name │  │ sticky  │  │  │
│  │  · Actions        │  │  │  │  comp name  │  │ top-0   │  │  │
│  │  · Indicators     │  │  │  │  desc       │  │ py-96   │  │  │
│  │  · Navigation     │  │  │  ├─────────────┤  │         │  │  │
│  │  · Overlay        │  │  │  │ Tab (sticky)│  │ NavVert │  │  │
│  │  · Feedback       │  │  │  ├─────────────┤  │ size=32 │  │  │
│  │                   │  │  │  │ Content     │  │         │  │  │
│  │                   │  │  │  │  (scroll)   │  │         │  │  │
│  └───────────────────┘  │  │  └─────────────┘  └─────────┘  │  │
│  [Theme Toggle]         │  └─────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 수치 (피그마 확정)

| 요소 | 값 | 토큰 |
|------|-----|------|
| Sidebar 너비 | 240px | — |
| max-width 컨테이너 | 960px | — |
| 좌우 패딩 | 48px | `spacing/s-12` |
| 상단 패딩 | 96px | `spacing/s-24` |
| main ↔ ToC gap | 32px | `spacing/s-8` |
| ToC 너비 | 192px | — |
| ToC 상하 패딩 | 96px | `spacing/s-24` |
| ToC position | `sticky top-0` | — |
| main column | `flex-1` | — |

### ToC 배치 원리
ToC는 max-width 컨테이너 **안에** main과 나란히 배치. main이 `flex-1`로 남은 공간을 차지하므로, ToC(192px)가 있어도 전체 컨테이너의 **중앙 정렬은 유지**된다.

---

## 2. Header 구조

모든 쇼케이스 페이지의 최상단. 탭 위에 항상 고정 표시.

```
Group Name              ← 사이드바 NAV_GROUPS 그룹 label 연동
Component Name          ← 컴포넌트 export 이름
Description text here.  ← 1~2문장, "이것은 무엇이고 어떤 역할을 하는가"
```

| 요소 | 타이포그래피 | 색상 |
|------|-------------|------|
| Group Name | `typography-14-medium` | `text-semantic-text-on-bright-400` |
| Component Name | `typography-48-semibold` | `text-semantic-text-on-bright-950` |
| Description | `typography-16-regular` | `text-semantic-text-on-bright-600` |

**데이터 소스**: `extractHeader(spec)` (JSON spec) 또는 수동 props.
**렌더러**: `ShowcaseHeader` — Group Name 필드 추가 필요.

---

## 3. 탭 구조 — 관점별 페이지

탭은 "필터"가 아닌 **관점별 페이지**. 같은 컴포넌트를 세 가지 렌즈로 본다.

| # | 탭 | 핵심 질문 | 대상 독자 |
|---|-----|----------|-----------|
| 1 | **Spec** | "이 컴포넌트가 뭘 할 수 있는가?" | 처음 접하는 개발자, 빠른 참조 |
| 2 | **Visual** | "다시 디자인/퍼블리싱할 수 있을 만큼 상세한 시각 구조는?" | 디자이너, UI 퍼블리셔 |
| 3 | **Recipes** | "이 상황에서 어떤 props 조합을 쓰는가?" | 실제 구현하는 개발자 |

### 탭별 섹션 매핑

#### Spec 탭
| 섹션 | 분류 | 설명 |
|------|------|------|
| Playground | Recommended | 인터랙티브 프리뷰 + 컨트롤 |
| All Variants Grid | Required | 모든 variant 조합의 매트릭스 (빠른 참조용) |
| Props Table | Recommended | 전체 props 명세 (정렬 가능) |
| Design Tokens | Optional | `--comp-*` 토큰 목록 |

#### Visual 탭
| 섹션 | 분류 | 설명 |
|------|------|------|
| Anatomy | Optional | Compound 컴포넌트의 구조 트리 |
| Visual Demos | Required | 각 축(variant, size, shape…)별 상세 갤러리 |
| States | Recommended | 상태별(hover, focus, disabled…) 시각 차이 |
| Token Chain | Optional | 컴포넌트 → 시맨틱 → 프리미티브 3레이어 체인 |
| Spacing/Sizing | Optional | 측정 다이어그램 (padding, gap, height) |

#### Recipes 탭
| 섹션 | 분류 | 설명 |
|------|------|------|
| Usage Guidelines | Recommended | Do/Don't 리스트 |
| Code Recipes | Recommended | 상황별 코드 예시 (점진적 복잡도) |
| Accessibility | Optional | 키보드 인터랙션, ARIA, 포커스 관리 |
| Related Components | Optional | 자매/대안 컴포넌트 링크 |

### Spec vs Visual — "All Variants Grid" vs "Visual Demos"

| | Spec: All Variants Grid | Visual: Visual Demos |
|---|------------------------|---------------------|
| **목적** | 빠른 참조/탐색 | 디자인 이해/재현 |
| **형태** | 매트릭스 (행=variant, 열=size 등) | 축별 독립 섹션 |
| **설명** | 최소 (라벨만) | 상세 (주석, 비교, 설명) |
| **예시** | Button 20개를 한 그리드에 | "Sizes" 섹션에서 각 size를 baseline 정렬로 비교 |

### 탭 동작
- 탭 전환 → 해당 탭 콘텐츠로 교체, 스크롤 초기화
- ToC → 현재 활성 탭의 섹션만 표시
- Header + 탭 바 → 항상 표시, **탭 바는 스크롤 시 sticky**

### 탭 표시 규칙
- 해당 탭에 표시할 섹션이 **하나도 없으면** 탭 미표시
- Tier 1: Spec만 → 탭 바 자체 숨김, 단일 페이지
- Tier 2: Spec + Visual → 2탭
- Tier 3: 3탭 모두

---

## 4. 섹션 카탈로그

### 4.1 Header (Required)

**탭**: 없음 (항상 표시)
**렌더러**: `ShowcaseHeader`
**데이터**: `extractHeader(spec)` 또는 수동 `{ id, name, description, classification?, groupName }`

| 필드 | 규칙 |
|------|------|
| `id` | `component-{kebab-name}` (예: `component-segment-bar`) |
| `name` | 컴포넌트 export 이름 그대로 (예: `Button`, `SegmentBar`) |
| `description` | 1~2문장. "이것은 무엇이고 어떤 역할인가". 구현 디테일 제외 |
| `classification` | `Primitive` · `Compound` · `Layout` · `Display` · `Feedback` 중 하나. 선택적 |
| `groupName` | 사이드바 NAV_GROUPS의 그룹 label (예: `Actions`, `Navigation`) |

---

### 4.2 Playground (Recommended) — Spec 탭

**조건**: 조작 가능 prop 2개 이상
**렌더러**: `ShowcaseSection` + `Playground`
**데이터**: 수동 `PlaygroundConfig`

**컨트롤 가이드**:
| prop 유형 | control kind | 예시 |
|-----------|-------------|------|
| Union 문자열 | `select` | variant, size, shape, side |
| Boolean | `boolean` | disabled, loading, hasArrow |
| 텍스트 내용 | `text` | children, label, placeholder |
| ReactNode 슬롯 | `slot` | iconLeading, iconTrailing |

**규칙**:
- `defaults`는 가장 대표적/일반적 설정 (알파벳순 X)
- `render` 함수는 "hero" 설정 — 가장 흔한 실제 사용 모습
- **생략 조건**: 조작 가능 축이 1개 이하인 display-only 컴포넌트 (Skeleton, Divider)

---

### 4.3 All Variants Grid (Required in Spec) — Spec 탭

**렌더러**: `ShowcaseSection` + 직접 JSX (grid/flex layout)
**데이터**: 컴포넌트 exported 상수 배열 (`BUTTON_HIERARCHIES`, `BUTTON_SIZES` 등)

모든 주요 variant 조합을 **한눈에** 보여주는 매트릭스.

**레이아웃 패턴**:
- 단일 축: 가로 나열 (`flex flex-wrap gap-3`)
- 2축 교차: 그리드 (`RowHeader` × `ColHeader`)
- 3축 이상: 축 하나를 섹션 분리하고 나머지 2축 그리드

**최소 포함 축**: variant/hierarchy, size. 나머지(shape, color, icon)는 컴포넌트에 따라 선택.

---

### 4.4 Props Table (Recommended) — Spec 탭

**조건**: JSON spec 파일 존재
**렌더러**: `ShowcaseSection` + `PropsTable`
**데이터**: `extractProps(spec)` 또는 `extractSubComponentProps(spec)`

| 컬럼 | 설명 |
|------|------|
| Prop | prop 이름 (mono, purple 강조) |
| Type | TypeScript 타입 |
| Default | 기본값 |
| Description | 동작 설명 |

- Compound 컴포넌트: sub-component별 `PropsTable` (title에 서브컴포넌트명)
- 단일 컴포넌트: title 없이 하나의 테이블
- **생략 조건**: JSON spec 미존재 → TODO 주석 남기기

---

### 4.5 Design Tokens (Optional) — Spec 탭

**조건**: `--comp-*` CSS custom properties 정의 시
**렌더러**: `ShowcaseSection` + `TokensReference`
**데이터**: 수동 `TokenGroupData[]`

| 그룹 분류 | scope | 예시 |
|-----------|-------|------|
| Layout (height, px, gap, radius, icon) | `:root` | `--comp-button-height-xl: 56px` |
| Color (bg, content, border, state) | `[data-theme]` | `--comp-button-bg-primary` |

- `TokensReference`: name-value 리스트 (간결)
- 색상 토큰은 Token Chain (Visual 탭)에서 상세히 다루므로, 여기서는 목록만

---

### 4.6 Anatomy (Optional) — Visual 탭

**조건**: Compound 컴포넌트 (subComponents 있을 때)
**렌더러**: `ShowcaseSection` + `AnatomyBox` 또는 `<pre>` (ASCII 트리)
**데이터**: spec의 `subComponents` 배열

```
Tooltip.Provider          — 전역 delay/hover 설정
└── Tooltip (Root)        — open state, theme context
    ├── Tooltip.Trigger   — hover/focus 대상 (asChild)
    └── Tooltip.Content   — Portal 렌더링 오버레이
        ├── children      — 툴팁 텍스트
        └── Arrow         — 선택적 SVG 화살표
```

- 각 노드: export 이름 + 역할 한 줄 주석
- **생략 조건**: 단일 요소 컴포넌트 (Button, Badge)

---

### 4.7 Visual Demos (Required) — Visual 탭

**렌더러**: `ShowcaseSection` 또는 raw `<section>` + `SectionTitle` / `ColHeader` / `RowHeader`
**데이터**: 컴포넌트 exported 상수 배열

각 축을 **독립 서브섹션**으로 분리하여 상세 설명.

#### 서브섹션 유형

| 서브섹션 | 레이아웃 | 적용 조건 |
|----------|---------|-----------|
| Variants / Hierarchy | 가로 나열 | `variant` / `hierarchy` prop |
| Sizes | baseline 정렬 가로 나열 | `size` prop |
| Shapes | 나란히 비교 | `shape` prop |
| Colors | Grid / Wrap | color palette |
| With Icons | leading / trailing / both / icon-only | icon slot props |
| Width modes | hug vs fill 수직 비교 | `fullWidth` prop |
| Sides / Positions | 중앙 + padding | popover 유형 |
| Controlled | 토글/인풋 연동 | compound with value/onChange |

**순서 규칙**: variant/hierarchy → size → shape → color → 특수 props (icons, width, controlled)

**주석 스타일**: 데모 하단에 `typography-12-medium text-semantic-text-on-bright-400`로 보충 설명

**All Variants Grid(Spec)와의 차이**: Grid는 "전체 조합 한눈에", Demos는 "각 축을 왜 이렇게 나눴는지 설명"

---

### 4.8 States (Recommended) — Visual 탭

**조건**: interactive state 지원 시 (disabled, loading, hover, focus, error)
**렌더러**: Grid layout (`RowHeader` × variant 열)

| 상태 | 렌더링 방식 |
|------|------------|
| Default | 정적 렌더 |
| Hover | "Hover to preview" 주석 또는 Playground에서 확인 유도 |
| Focus | "Focus to preview" 주석 |
| Active/Pressed | 정적 렌더 (CSS pseudo 적용 불가 시 주석) |
| Disabled | `disabled` prop으로 정적 렌더 |
| Loading | `loading` prop으로 정적 렌더 |

- 행: 상태, 열: variant/hierarchy
- Hover/Focus는 CSS 상태라 정적 렌더 불가 → Playground 또는 직접 조작 유도
- **생략 조건**: display-only (Badge, Divider)
- States를 Visual Demos 내부에 병합해도 됨 (컴포넌트가 단순할 때)

---

### 4.9 Token Chain (Optional) — Visual 탭

**조건**: 컴포넌트 색상 토큰이 `[data-theme]` 스코프에 정의될 때
**렌더러**: `ShowcaseSection` + `TokenChainTable`
**데이터**: 수동 `TokenChainData[]`

3레이어 토큰 체인을 light/dark 비교로 시각화:

| Component Token | Semantic | Light (Primitive → Hex) | Dark (Primitive → Hex) |
|----------------|----------|------------------------|----------------------|
| `--comp-button-bg-primary` | `--semantic-primary-500` | `indigo-500` `#5B4FFF` | `indigo-400` `#7B71FF` |

- Design Tokens (Spec)과의 차이: Spec은 목록, Token Chain은 **3레이어 추적 + 테마 비교**

---

### 4.10 Usage Guidelines (Recommended) — Recipes 탭

**조건**: 사용/비사용 판단이 필요할 때
**렌더러**: `ShowcaseSection` + `UsageGuidelines`
**데이터**: 수동 `UsageGuidelineData`

| 필드 | 가이드 |
|------|--------|
| `doUse` | 2~4항목. "When you need…", "For [specific scenario]…" 형태 |
| `dontUse` | 2~4항목. 안티패턴 + `alternative`(대안 컴포넌트 ID) + `alternativeLabel` |
| `related` | 1~4개 자매/대안 컴포넌트. `id`는 `SHOWCASE_MAP` 키와 일치해야 함 |

- **생략 조건**: 유틸리티/프리미티브에서 용도가 자명할 때 (Skeleton, Icon). 그래도 간단한 가이드라인 권장

---

### 4.11 Code Recipes (Recommended) — Recipes 탭

**조건**: 기본 사용법이 자명하지 않을 때
**렌더러**: `ShowcaseSection` + `CodeBlock`
**데이터**: 수동 `CodeExampleData[]`

**점진적 복잡도 순서** (Toss 패턴):
1. **Basic usage** — 최소한의 import + 렌더. import문은 여기에만
2. **Variants** — 주요 variant 전환
3. **Feature-specific** — 기능별 1예시 (icons, controlled state, compound sub)
4. **Advanced** — 실제 프로덕션 패턴 (조건부 렌더, 다른 컴포넌트와 조합)

**코드 스타일**: `const` 선언, destructuring, 유의미한 변수명. 레이아웃 래퍼 불포함.

---

### 4.12 Accessibility (Optional) — Recipes 탭

**조건**: 키보드 인터랙션 또는 ARIA 역할이 있을 때
**렌더러**: `ShowcaseSection` + 직접 JSX (테이블 또는 리스트)

| 항목 | 내용 |
|------|------|
| Keyboard | 키별 동작 테이블 (Tab, Enter, Space, Arrow, Escape) |
| ARIA | 자동 적용되는 role, aria-* 속성 |
| Screen Reader | 음성 출력 동작 노트 |
| Focus Management | compound 컴포넌트의 포커스 이동 규칙 |

- **포함 대상**: Tab, SegmentBar, NavVertical, Dialog, Select, Tooltip 등
- **생략 대상**: 순수 시각 컴포넌트

---

### 4.13 Related Components (Optional) — Recipes 탭

`UsageGuidelines`의 `related` 필드로 내장 처리.
Usage Guidelines 없이 관련 컴포넌트 링크만 필요한 경우, 별도 `ShowcaseSection`에 pill-style 링크로 표시.

---

## 5. 복잡도 티어

컴포넌트 특성에 따라 어떤 탭과 섹션을 포함할지 결정하는 기준.

### 판단 플로차트

```
spec에 subComponents 있음?
  ├─ Yes → Tier 3 (Complex Compound)
  └─ No → interactive state (disabled/loading/selected) 지원?
           ├─ Yes → Tier 2 (Standard Interactive)
           └─ No → Tier 1 (Display-only)
```

### 티어별 최소/권장 구성

| | Tier 1 | Tier 2 | Tier 3 |
|---|--------|--------|--------|
| **예시** | Badge, Skeleton, Divider | Button, Chip, SegmentBar | Tooltip, Tab, Dialog |
| **탭** | 탭 바 숨김 (단일 페이지) | Spec + Visual | Spec + Visual + Recipes |
| **최소 섹션** | Header, All Variants Grid | + States, Props Table | + Playground, Anatomy, Usage, Code |
| **권장 추가** | Props Table | Playground, Usage, Code | Accessibility, Tokens, Token Chain |
| **전형 섹션 수** | 2~4 | 5~7 | 8~10 |

---

## 6. TOC 생성 규칙

| 규칙 | 설명 |
|------|------|
| Level | Header만 `level: 1`, 나머지 기본 (level 2) |
| ID 패턴 | `{name}-{section}` (예: `button-playground`, `tab-anatomy`) |
| Visual 서브섹션 | `{name}-variants`, `{name}-sizes` 등 서술적 ID |
| 탭 연동 | 활성 탭의 섹션만 ToC에 표시 |

**표준 TOC 구조** (Tier 3 풀 예시):
```ts
export const TOOLTIP_TOC: TocEntry[] = [
  // Spec 탭
  { id: 'component-tooltip',    label: 'Tooltip',        level: 1 },
  { id: 'tooltip-playground',   label: 'Playground'               },
  { id: 'tooltip-all-variants', label: 'All Variants'             },
  { id: 'tooltip-props',        label: 'Props'                    },
  { id: 'tooltip-tokens',       label: 'Design Tokens'            },
  // Visual 탭
  { id: 'tooltip-anatomy',      label: 'Anatomy'                  },
  { id: 'tooltip-variants',     label: 'Variants'                 },
  { id: 'tooltip-sizes',        label: 'Sizes'                    },
  { id: 'tooltip-sides',        label: 'Sides'                    },
  { id: 'tooltip-states',       label: 'States'                   },
  { id: 'tooltip-token-chain',  label: 'Token Chain'              },
  // Recipes 탭
  { id: 'tooltip-usage',        label: 'Usage Guidelines'         },
  { id: 'tooltip-code',         label: 'Code Recipes'             },
  { id: 'tooltip-a11y',         label: 'Accessibility'            },
]
```

---

## 7. 파일 내부 구조

쇼케이스 파일(`src/showcase/{Name}Showcase.tsx`)의 코드 구성 순서:

```
1. Imports (컴포넌트, 타입, showcase-blocks, spec-utils, spec JSON)
2. Spec data extraction (const header = extractHeader(...))
3. Playground config (PlaygroundConfig — if applicable)
4. Usage guidelines data (UsageGuidelineData — if applicable)
5. Code examples data (CodeExampleData[] — if applicable)
6. Token data (TokenGroupData[] / TokenChainData[] — if applicable)
7. TOC export (탭별 그룹 구분 주석 포함)
8. Showcase component export (탭별 콘텐츠를 canonical order로)
```

데이터 선언을 JSX 위에 모아두면:
- 각 쇼케이스가 **어떤 콘텐츠를 제공하는지** 한눈에 파악
- JSX는 순수 레이아웃에 집중

---

## 8. 콘텐츠 스타일 규칙

| 항목 | 규칙 |
|------|------|
| 섹션 제목 | 영어 |
| 설명/주석 | 한/영 혼용 허용 (기존 패턴 유지) |
| 섹션 description | 1문장 이내. 제목만으로 충분하면 생략 |
| Playground defaults | 가장 대표적 설정 (알파벳순 X) |
| Code examples | `const` 선언, destructuring, `import`문은 Basic usage에만 |
| 데모 주석 | `typography-12-medium text-semantic-text-on-bright-400` |
| 코드 블록 제목 | `CodeBlock`의 `title` prop 필수, `description`은 선택 |

---

## 9. 기존 showcase-blocks 매핑

| 섹션 | 블록 컴포넌트 | 파일 |
|------|-------------|------|
| Header | `ShowcaseHeader` | `showcase-blocks.tsx` |
| Playground | `Playground` | `showcase-blocks.tsx` |
| Anatomy | `AnatomyBox` / `<pre>` | `showcase-blocks.tsx` |
| Visual Demos | `SectionTitle`, `ColHeader`, `RowHeader` | `shared.tsx` |
| States | `RowHeader` + grid layout | `shared.tsx` |
| Props Table | `PropsTable` | `showcase-blocks.tsx` |
| Usage Guidelines | `UsageGuidelines` | `showcase-blocks.tsx` |
| Code Recipes | `CodeBlock` | `showcase-blocks.tsx` |
| Design Tokens | `TokensReference` | `showcase-blocks.tsx` |
| Token Chain | `TokenChainTable` | `showcase-blocks.tsx` |
| 섹션 래퍼 | `ShowcaseSection` | `showcase-blocks.tsx` |

---

## 10. 레퍼런스 기반 인사이트

| 레퍼런스 | 채택 포인트 |
|----------|------------|
| **Toss** | 점진적 복잡도 순서 (basic → variant → complex) → Code Recipes 순서에 적용 |
| **AI SDK Elements** | Preview (Playground) 최상단 배치 → Spec 탭 첫 섹션 |
| **Motion Core** | Demo-centric, Props 후순위 → Visual Demos Required 근거 |
| **M3 Material** | Do/Don't 가이드라인 + 스펙 분리 → Recipes 탭 분리 근거, 탭 구조 참고 |
| **Uber Base** | 분류 태그(stable/beta) + 상태 표시 → classification badge 활용 |
