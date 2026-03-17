# Design Principles

> 이 문서는 kiio-library 디자인 시스템의 **설계 철학과 판단 프레임워크**를 정리한다.
> "왜 이렇게 설계하는가"와 "언제 어떤 방식을 선택하는가"에 답한다.
> 구체적인 코드 패턴과 구현 규칙은 [CLAUDE.md](../CLAUDE.md), 복합 컴포넌트 패턴은 [ADVANCED_PATTERNS.md](./ADVANCED_PATTERNS.md), 인터랙션 설계는 [INTERACTION_DESIGN.md](./INTERACTION_DESIGN.md), 페이지 레벨 UI 패턴은 [UI_PATTERNS.md](./UI_PATTERNS.md) 참고.

---

## 목차

- [F. 디자인 판단의 기초 원칙 (Meta)](#f-디자인-판단의-기초-원칙-meta)
- [A. 컴포넌트 API 설계 원칙](#a-컴포넌트-api-설계-원칙)
- [B. 시각적 설계 원칙](#b-시각적-설계-원칙)
- [C. 접근성 설계 원칙](#c-접근성-설계-원칙)
- [D. 디자인-코드 일관성 원칙](#d-디자인-코드-일관성-원칙)

---

## F. 디자인 판단의 기초 원칙 (Meta)

> 이 섹션의 8가지 원칙은 A~D 섹션의 **상위 판단 프레임워크**다.
> A~D는 "무엇을 어떻게 하는가"를 규정하고, F는 "왜 그렇게 판단하는가"를 규정한다.
> 구체적 규칙이 충돌할 때 이 원칙이 판단 기준이 된다.

### 상시 원칙 (모든 판단의 기본 렌즈)

| # | 원칙 | 이 프로젝트에서의 적용 |
|:-:|------|----------------------|
| 1 | **고정점 우선 사고** — 변하지 않는 것을 먼저 정의하고 나머지를 파생 | 토큰 계층에서 Primitive가 고정점, Semantic이 파생, Component가 바인딩. 컴포넌트 API에서 Figma variant 이름이 고정점, 코드 prop 이름이 파생. |
| 2 | **시스템으로 판단을 대체** — 반복적 판단을 구조와 규칙으로 흡수 | CVA variant 시스템, 토큰 계층, JSON spec 워크플로, 체크리스트 — 모두 개별 판단을 구조로 대체한 결과. 새 규칙이 필요하면 문서에 흡수. |
| 3 | **실증 지향** — 데이터 > 레퍼런스 > 전제 의심 | 디자인 결정 시 Figma 데이터 먼저, 없으면 유사 컴포넌트 참조, 그래도 안 맞으면 spec/토큰 전제를 의심. |
| 4 | **시각적 디테일은 시스템 통제 대상** — 개별 픽셀 판단을 불필요하게 만드는 구조 설계 | 하드코딩 금지 규칙(B절), 토큰 레이어 규칙(TOKEN_LAYER_RULES.md), 복합 타이포그래피 토큰 — 모두 이 원칙의 구현. |

### 조건부 원칙 (특정 상황에서 트리거)

| # | 원칙 | 트리거 상황 | 적용 방법 |
|:-:|------|-----------|----------|
| 5 | **전체 흐름 > 개별 화면 최적화** | 새 화면/플로우 설계, 컴포넌트 간 일관성 검토 시 | 개별 컴포넌트를 최적화하기 전에 시스템 전체 흐름과의 일관성을 점검. 예외는 시각 경험 자체가 기능인 화면뿐. |
| 6 | **문제 정의 > 시각물** | 새 컴포넌트/기능 기획 초기 | JSON spec 작성 전에 "이 컴포넌트가 해결하는 문제"를 먼저 정의. UI는 문제가 명확하면 소수 선택지로 귀결. |
| 7 | **사용자 자율성 보호** | UX 패턴 선택, 인터랙션 설계 시 | 개별 유도(nudge)는 수용하되, 중첩되어 사용자 의지를 조직적으로 소모시키는 구조는 거부. |
| 8 | **시스템 이탈 = 수정 신호** | 규칙 예외 요청, 반복적 workaround 발견 시 | 이탈에 근거를 요구하고 기록. 동일 이탈이 3회 반복되면 시스템(토큰/규칙/구조) 수정을 검토. |

### F절과 A~D절의 관계

```
F (왜 이렇게 판단하는가)
├── A. 컴포넌트 API 설계 ← F1(고정점), F2(시스템 흡수), F6(문제 정의 선행)
├── B. 시각적 설계       ← F4(시스템 통제), F1(토큰 고정점), F3(실증)
├── C. 접근성 설계       ← F5(전체 흐름), F7(사용자 자율성)
└── D. 디자인-코드 일관성 ← F2(시스템 흡수), F8(이탈=수정 신호), F3(실증)
```

---

## A. 컴포넌트 API 설계 원칙

### Props 추가 판단 트리

Props를 추가하기 전에 다음 순서로 판단한다:

```
1. Figma 디자인 스펙의 variant인가? (hierarchy, size, state 등)
   → YES: 추가. JSON spec에서 매핑.

2. 앱마다 다른 동작인가? (예: "클릭 시 특정 모달 열기")
   → YES: 추가하지 않음. onClick이나 composition으로 해결.

3. className 또는 children으로 동일 결과 가능한가?
   → YES: 전용 prop 불필요. composition 패턴을 문서화.

4. 표준 HTML attribute인가? (disabled, type 등)
   → React.*HTMLAttributes로 이미 상속됨. 재선언 금지.

5. 위 어디에도 해당하지 않고, 시각적/행동적 변형을 제어하는가?
   → JSDoc(@default, @see)과 함께 추가.
```

### children vs 구조화 props

| 기준 | `children` 사용 | 구조화 props 사용 |
|------|:---:|:---:|
| 소비자가 내용의 구조를 결정해야 함 | O | |
| 내부 레이아웃이 고정적 | | O |
| 디자인 일관성이 최우선 | | O |
| 다양한 컨텐츠 유형 허용 | O | |
| 특정 위치에 특정 요소 강제 | | O |

**예시**:
- `children`: `<Card>{자유로운 내용}</Card>`
- 구조화 props: `<Button iconLeading={<Icon />}>텍스트</Button>` — 아이콘 위치가 디자인에 의해 고정

### Variant 네이밍 원칙

1. **용도(intent) 기반 이름 사용**
   - `primary` / `secondary` / `ghost` (O) — 역할을 설명
   - `blue` / `gray` / `transparent` (X) — 시각적 속성을 설명 (테마 변경에 깨짐)

2. **Figma 디자인의 계층 이름과 1:1 매핑**
   - Figma에서 "Hierarchy: Primary"이면 코드에서도 `hierarchy: 'primary'`
   - 이름을 바꾸거나 축약하지 않는다

3. **상태(state)는 variant가 아닌 별도 prop으로**
   - `disabled`, `loading`, `selected` → boolean prop
   - variant에 `disabledPrimary` 같은 상태 조합을 넣지 않는다

### 컴포넌트 분류 기준

| 분류 | 설명 | 예시 | 패턴 |
|------|------|------|------|
| **Primitive** | 단일 HTML 요소 래핑 | Button, Input, Badge, Avatar | CVA + cn (CLAUDE.md) |
| **Composite** | 여러 primitive 조합 | FormField, Card, Alert | Props 전달 or 간단한 Context |
| **Pattern** | 동작 패턴 제공 (열림/닫힘, 선택 등) | Dialog, Popover, Tabs, Select | Compound + Context (ADVANCED_PATTERNS.md) |

**판단**: 서브컴포넌트가 2개 이상이고 상태 공유가 필요하면 **Pattern**, 아니면 **Primitive** 또는 **Composite**.

### 컴포넌트 계층과 Atom 설계

모든 것을 atom으로 분리하면 재사용성은 높아지지만, **소비자 API 복잡성**과 **디자인 무결성 훼손** 리스크가 함께 증가한다. 아래 5계층으로 노출 수준을 판단한다.

| 계층 | 설명 | 노출 | 예시 |
|------|------|------|------|
| **Internal atom** | 컴포넌트 내부에서만 사용. 외부 비노출 | 파일 내부 `const` | StateOverlay, LoadingOverlay |
| **Shared utility** | 여러 컴포넌트가 공유하는 스타일/로직 | `src/lib/` 또는 내부 훅 | `stateOverlayClasses()`, `useLoadingState()` |
| **Public atom** | 소비자가 직접 사용하는 최소 단위 | `export` | Badge, Avatar, Icon, Divider, Spinner |
| **Public component** | Atom을 내부적으로 조합한 완성된 컴포넌트 | `export` | Button, Input, Card |
| **Compound component** | 구조를 소비자에게 위임하는 복합 컴포넌트 | `export` (dot notation) | Dialog, Tabs, Select |

#### Atom 분리 판단 트리

```
이 요소를 별도 컴포넌트/유틸리티로 분리해야 하는가?

1. 소비자가 이 요소를 독립적으로 사용할 수 있는가?
   → YES: Public atom으로 export (예: Spinner, Badge)
   → NO: 계속

2. 3개 이상의 컴포넌트에서 동일 패턴이 반복되는가?
   → YES: Shared utility로 추출 (예: stateOverlayClasses)
   → NO: 계속

3. 현재 1-2곳에서만 사용되는가?
   → YES: Internal atom으로 유지. 나중에 반복이 보이면 그때 추출.
   → 아직 1곳: 분리하지 않는다 (조기 추상화 금지).
```

**핵심 원칙: "3회 반복 시 추출"** — 1곳에서만 사용되는 것을 미리 분리하면 조기 추상화. 동일 패턴이 3곳에서 확인되면 그때 확신을 갖고 분리한다.

#### 계층별 설계 지침

**Internal atom (비노출)**:
- 부모 컴포넌트의 Context에 암묵적으로 의존해도 됨 (예: `group` 클래스 필요)
- 별도 파일로 분리할 필요 없음. 같은 파일 내 `const`로 충분
- 예: Button의 state overlay span, loading overlay span

**Shared utility (내부 공유)**:
- 순수 함수 또는 클래스 생성 함수로 추출 (컴포넌트가 아닌 유틸리티)
- Context 의존 금지 — 인자로 모든 정보를 받는다
- 예: `getStateOverlayClasses(hierarchy: 'primary' | ..., variant: 'on-dim' | 'on-bright')`

**Public atom (소비자용 최소 단위)**:
- 독립 동작 필수 — Context 없이도 완전히 동작해야 함
- Props 인터페이스 간결하게 유지 (5개 이하 권장)
- 예: `<Spinner className="size-5" />`, `<Badge variant="info">3</Badge>`

**Public component (조합된 완성품)**:
- 소비자는 Props만으로 모든 변형을 제어
- 내부 atom/utility의 존재를 소비자가 알 필요 없음
- 잘못된 조합을 원천 차단 (예: ghost 계층에 on-dim 오버레이 불가)
- 예: `<Button hierarchy="ghost" loading>저장</Button>` — 내부에서 올바른 조합 자동 적용

**Compound component (구조 위임)**:
- 소비자에게 구조 제어를 위임해야 할 때만 사용
- [ADVANCED_PATTERNS.md](./ADVANCED_PATTERNS.md)의 Compound 패턴 따르기
- 예: `<Dialog><Dialog.Trigger>...</Dialog.Trigger><Dialog.Content>...</Dialog.Content></Dialog>`

#### 판단 예시: 현재 Button의 내부 요소

| 요소 | 현재 | 올바른 계층 | 이유 |
|------|------|----------|------|
| State overlay span | 인라인 | **Internal atom** → 3곳 반복 시 **Shared utility** | 소비자가 제어할 필요 없음. Card/ListItem에서 반복되면 추출 |
| Spinner | Public atom (`@/components/icons`) | **Public atom** (현재 올바름) | 소비자가 단독 사용 가능 |
| Icon slot (leading/trailing) | 인라인 span | **Internal atom** | 아이콘 크기/위치는 Button이 제어. 소비자는 `iconLeading` prop으로 접근 |
| Loading overlay | 인라인 span | **Internal atom** | 로딩 UX는 Button이 제어. 소비자는 `loading` prop으로 접근 |

---

## B. 시각적 설계 원칙

### 토큰 사용 원칙

디자인 시스템의 시각적 일관성은 **토큰 계층 준수**에 달려있다.

```
Ref (Primitive) → Sys (Semantic) → Component
```

| 규칙 | 설명 |
|------|------|
| **ref 토큰 직접 사용 금지** | 컴포넌트에서 `bg-ref-indigo-500` 사용 금지. 반드시 `bg-sys-primary-500` 사용. |
| **하드코딩 값 금지** | `text-[16px]`, `bg-[#5B4FFF]`, `style={{ padding: '16px' }}`, `transition-duration: 200ms` 금지. |
| **Tailwind 기본 유틸리티 제한** | `text-base font-medium` 대신 `typography-16-medium`. `duration-100` 대신 `duration-fast`. `ease-out` 대신 `ease-enter`. |
| **토큰이 없으면 추가** | 필요한 값이 토큰에 없으면 코드에 하드코딩하지 말고, ref 토큰을 먼저 추가 → sys에 매핑한다. |

**이 원칙은 색상·타이포그래피뿐 아니라 모션(duration, easing)에도 동일하게 적용된다.** 자세한 모션 토큰 체계는 [INTERACTION_DESIGN.md §A](./INTERACTION_DESIGN.md#a-motion--timing-원칙) 참고.

### 일관성 규칙

1. **동일 계층 = 동일 토큰**
   - 모든 `primary` 계층 컴포넌트는 동일한 `sys-neutral-solid-950` 배경을 사용
   - 새 컴포넌트 추가 시 기존 컴포넌트의 토큰 매핑을 참고

2. **상태 오버레이 통일**
   - 어두운 배경 위 (primary): `on-dim` 상태 토큰 (`sys-state-on-dim-50/100`)
   - 밝은 배경 위 (secondary, outlined, ghost): `on-bright` 상태 토큰 (`sys-state-on-bright-50/70`)

3. **포커스 링 통일**
   - 전 컴포넌트 동일: `border-2 border-sys-primary-300`
   - `focus-visible`로 키보드 전용 표시

### 스페이싱 원칙

1. **4px 기반 그리드**
   - 모든 스페이싱은 4px 배수 (Tailwind: 1 = 4px)
   - 예외: 2px(`0.5`), 6px(`1.5`) — 세밀한 조정에만

2. **컴포넌트 내부: padding으로 제어**
   - 컴포넌트 크기는 `height` + `padding`으로 결정
   - 예: Button medium = `h-10 px-2.5`

3. **컴포넌트 간: gap으로 제어**
   - 형제 요소 간격은 부모의 `gap`으로 제어
   - `margin`은 최소화 — 컴포넌트가 배치 컨텍스트에 의존하지 않도록

4. **컴포넌트 내부 요소 간: gap으로 제어**
   - 아이콘-텍스트 간격: `gap-1` ~ `gap-2` (size variant에 따라)

### 모션 원칙

색상·스페이싱과 동일하게 모션도 Ref → Sys 토큰 계층을 따른다.

| 카테고리 | Ref (직접 사용 금지) | Sys (컴포넌트에서 사용) | Tailwind |
|---------|:-------------------:|:---------------------:|---------|
| **Duration** | `ref-duration-{0\|100\|200\|300\|500}` | `sys-duration-{instant\|fast\|normal\|slow\|slower}` | `duration-{instant\|fast\|normal\|slow\|slower}` |
| **Easing** | `ref-easing-{ease-out\|ease-in\|ease-in-out\|linear}` | `sys-easing-{enter\|exit\|move\|linear}` | `ease-{enter\|exit\|move\|linear}` |

1. **모션에도 ref 직접 사용 금지**
   ```tsx
   // DO NOT
   className="duration-100 ease-out"

   // DO — sys 토큰 사용
   className="duration-fast ease-enter"
   ```

2. **모션 통일 규칙**
   - 동일 유형의 전이는 동일 토큰: 모든 호버 전이는 `duration-fast ease-enter`
   - 퇴장은 진입의 2/3 시간: 진입 `duration-slow` → 퇴장 `duration-normal`

3. **테마별 모션 조절 가능**
   - sys 토큰이 CSS 변수이므로 `data-theme` 셀렉터에서 재매핑 가능
   - 예: 한 테마에서 전체적으로 빠른 모션을 원하면 `--sys-duration-normal: var(--ref-duration-100)`

> 모션 토큰의 전체 스케일, 판단 트리, 진입/퇴장 패턴, `prefers-reduced-motion` 대응은 [INTERACTION_DESIGN.md §A](./INTERACTION_DESIGN.md#a-motion--timing-원칙) 참고.

### 테마 대응 원칙

1. **컴포넌트 내부에 테마 분기 로직 금지**
   ```tsx
   // DO NOT
   const bg = theme === 'foo' ? 'bg-purple-500' : 'bg-orange-500'

   // DO — semantic 토큰이 자동 처리
   className="bg-semantic-primary-500"
   ```

2. **light와 dark 모드 모두에서 검증 필수**
   - `data-theme="light"`와 `data-theme="dark"` 모두에서 의도한 대비/가독성 확인
   - 특히 `on-bright` / `on-dim` 텍스트 가독성 주의 (dark 모드에서는 역할이 반전됨)

3. **테마 전환 메커니즘**
   - 조상 요소의 `data-theme` attribute로 제어 (`"light"` 또는 `"dark"`)
   - CSS 변수가 자동 전환됨 — JS 로직 불필요

---

## C. 접근성 설계 원칙

### 시맨틱 HTML 우선

```
판단 트리:
1. 네이티브 HTML 요소로 원하는 역할을 표현할 수 있는가?
   → YES: 네이티브 요소 사용 (<button>, <input>, <dialog>, <nav>)
   → NO: <div> + role 속성 사용 (최후의 수단)
```

| 역할 | 네이티브 요소 | role 불필요 |
|------|------------|:---:|
| 버튼 | `<button>` | O |
| 링크 | `<a href>` | O |
| 텍스트 입력 | `<input>` | O |
| 모달 | `<dialog>` | O |
| 내비게이션 | `<nav>` | O |
| 탭 패널 | `<div>` | X → `role="tabpanel"` 필요 |

### 포커스 관리 원칙

1. **`focus-visible` 통일**
   - 마우스 클릭 시 포커스 링 미표시 (사용자 경험)
   - 키보드 탐색 시에만 포커스 링 표시
   - `focus` 대신 `focus-visible` 사용

2. **오버레이 포커스 관리**
   - 열릴 때: 오버레이 내부로 포커스 이동 + 포커스 트래핑
   - 닫힐 때: 트리거 요소로 포커스 복원
   - Radix UI 프리미티브가 자동 처리 (직접 구현 불필요)

3. **탭 순서**
   - 시각적 순서 = 탭 순서 (`tabIndex` 조작 최소화)
   - `tabIndex={-1}`: 프로그래밍적 포커스만 (키보드 탐색 제외)
   - `tabIndex={0}`: 커스텀 인터랙티브 요소에만

### 키보드 내비게이션 패턴

| 컴포넌트 유형 | Enter/Space | Arrow Keys | Escape | Tab |
|---|---|---|---|---|
| 버튼 | 활성화 | - | - | 다음 요소 |
| 링크 | 이동 | - | - | 다음 요소 |
| 메뉴/드롭다운 | 항목 선택 | 항목 이동 | 닫기 | 닫기 + 다음 |
| 탭 | 탭 전환 | 탭 이동 | - | 탭 패널로 |
| 모달 | - | - | 닫기 | 내부 순환 |
| 라디오 그룹 | 선택 | 옵션 이동 | - | 그룹 밖으로 |

### ARIA 사용 가이드

**상태 표현**:

| 속성 | 용도 | 주의사항 |
|------|------|---------|
| `aria-disabled` | 비활성화 표시 | `disabled` attribute와 달리 탭 순서에서 제거하지 않음. 로딩 상태에 적합. |
| `aria-busy` | 로딩 중 표시 | 스피너가 있는 컴포넌트에 사용 |
| `aria-invalid` | 유효성 검증 실패 | `aria-describedby`와 함께 사용하여 에러 메시지 연결 |
| `aria-expanded` | 펼침/접힘 상태 | 드롭다운, 아코디언 트리거에 사용 |
| `aria-selected` | 선택 상태 | 탭, 리스트 아이템에 사용 |

**관계 표현**:

| 속성 | 용도 | 예시 |
|------|------|------|
| `aria-labelledby` | 시각적 레이블 요소 참조 | `<h2 id="title">제목</h2> <div aria-labelledby="title">` |
| `aria-describedby` | 보충 설명 요소 참조 | 에러 메시지, 도움말 텍스트 연결 |
| `aria-controls` | 제어 대상 요소 참조 | 탭 트리거 → 탭 패널 |

### 색상 대비 기준

| 요소 유형 | WCAG AA 최소 대비 | 확인 방법 |
|----------|:-:|---|
| 일반 텍스트 (< 18px) | 4.5:1 | DevTools 접근성 패널 |
| 큰 텍스트 (>= 18px bold 또는 >= 24px) | 3:1 | DevTools 접근성 패널 |
| UI 컴포넌트 경계 / 그래픽 | 3:1 | 배경 대비 border/icon 색 |
| 비활성화 요소 | 면제 | 대비 요구 없음 (WCAG 예외) |

---

## D. 디자인-코드 일관성 원칙

### Figma↔Code 1:1 매핑

디자인 시스템의 핵심 가치는 **Figma 디자인이 코드와 정확히 일치**하는 것이다.

| Figma | Code | 규칙 |
|-------|------|------|
| Variant 이름 (예: "Primary") | prop 값 (예: `hierarchy="primary"`) | 이름을 바꾸거나 축약하지 않는다 |
| Property 이름 (예: "Hierarchy") | prop 이름 (예: `hierarchy`) | camelCase로 변환만 |
| Spacing 값 (예: 16px) | Tailwind class (예: `px-4`) | 토큰 매핑 테이블 참고 |
| 색상 (예: Primary/500) | sys 토큰 (예: `bg-sys-primary-500`) | ref 토큰 직접 매핑 금지 |
| 타이포그래피 (예: 16px Semibold) | 복합 토큰 (예: `typography-16-semibold`) | 개별 font-size/weight 금지 |
| Duration (예: 200ms) | sys 토큰 (예: `duration-normal`) | `duration-200` 등 ref 직접 사용 금지 |
| Easing (예: ease-out) | sys 토큰 (예: `ease-enter`) | `ease-out` 등 ref 직접 사용 금지 |

### JSON Spec의 역할

JSON spec(`specs/*.json`)은 Figma↔Code 사이의 **번역 계층**이다:

```
Figma 디자인 → JSON spec (기계 판독 가능) → React 컴포넌트
```

1. **구현 전 검증**: spec을 먼저 작성하고, Figma 디자인과 대조하여 누락을 확인
2. **AI 인터페이스**: Claude에게 spec을 전달하면 일관된 컴포넌트 생성 가능
3. **변경 추적**: 디자인 변경 시 spec을 먼저 업데이트 → 코드에 반영

### 디자인 변경 전파 순서

```
1. Figma 디자인 변경
   ↓
2. JSON spec 업데이트 (specs/{component}.json)
   ↓
3. 코드 업데이트 (src/components/{Component}/)
   ↓
4. 양 테마에서 검증
```

**원칙**: spec이 single source of truth. 코드에서 "디자인과 다르게" 구현하고 싶으면, spec을 먼저 수정하고 이유를 기록한다.

---

## 원칙 선택 가이드 (요약)

```
새 컴포넌트를 만들기 전:
0. 이 컴포넌트가 해결하는 문제를 정의 → F절 (원칙 6)
1. Figma 디자인을 열고 variant/size/state를 모두 파악 → D절
2. JSON spec을 먼저 작성 → D절
3. 컴포넌트 분류 판단 (Primitive/Composite/Pattern) → A절
4. Props 설계 (판단 트리 적용) → A절
5. 토큰 매핑 (sys 토큰만, ref 직접 사용 금지) → B절
6. 상태 처리 설계 (오버레이, disabled, loading) → B절
7. 모션 설계 (duration, easing, 진입/퇴장 패턴) → B절 + INTERACTION_DESIGN.md §A
8. 접근성 요구사항 확인 (시맨틱 요소, ARIA, 키보드) → C절
9. 인터랙션 패턴 결정 (피드백, 로딩, 반응형) → INTERACTION_DESIGN.md
10. 구현 시작 — CLAUDE.md의 코드 패턴 따르기

규칙 예외가 필요할 때:
1. 근거를 명시적으로 기록 → F절 (원칙 8)
2. 동일 이탈 3회 반복 시 시스템 수정 검토 → F절 (원칙 8)
```
