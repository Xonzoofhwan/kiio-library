# Anatomy — 파트 명명 표준

> 이 문서는 컴포넌트를 이루는 **조각(파트)에 붙이는 이름**과, 그 이름이 **prop 표면으로 나오는 문법**을 규정한다.
> "이 조각을 뭐라고 부를 것인가"와 "그 조각을 소비자에게 어떤 형태로 넘길 것인가"에 답한다.
> 왜 그렇게 판단하는가는 [DESIGN_PRINCIPLES.md](./DESIGN_PRINCIPLES.md), 구현 코드 패턴은 [COMPONENT_PATTERNS.md](./COMPONENT_PATTERNS.md),
> 복합 컴포넌트 구조는 [ADVANCED_PATTERNS.md](./ADVANCED_PATTERNS.md), 검사 도입 계획은 [QUALITY_GATES_PLAN.md](./QUALITY_GATES_PLAN.md) 참고.
>
> 기준 시점 2026-09-05 · 대상 `src/components/` 13개 (`icons`·`showcase-layout` 제외).
>
> **인용 규약: 줄 번호를 쓰지 않고 심볼로 가리킨다.** 이 문서의 모든 prop 이름·타입 이름·주석 문자열은 소스에서 직접 읽은 값이지만,
> 줄 번호는 옆 커밋 하나에 어긋난다 — 이 문서를 쓰는 동안에도 `NavVertical.tsx` 의 해당 블록이 두 줄 밀렸다.
> 그래서 "파일 이름 + 줄 번호" 대신 ``NavVerticalItemProps` 의 `icon``, `` `{/* Bottom border indicator */}` `` 처럼 **이름으로** 적는다.
> 심볼은 이름이 바뀌면 같이 바뀌어야 하는 것이므로, 틀리면 §6.2 D7b 같은 검사가 잡을 수 있는 형태이기도 하다.

---

## 목차

- [0. 왜 이 문서가 있는가](#0-왜-이-문서가-있는가)
- [1. 표준 파트 어휘](#1-표준-파트-어휘)
- [2. prop 문법 — 파트를 API 표면으로 옮기는 규칙](#2-prop-문법--파트를-api-표면으로-옮기는-규칙)
- [3. 해체 절차 — 새 컴포넌트를 받았을 때](#3-해체-절차--새-컴포넌트를-받았을-때)
- [4. 컴포넌트 해체표 (13개 전수)](#4-컴포넌트-해체표-13개-전수)
- [5. 불일치 판정](#5-불일치-판정)
- [6. 강제 수단 — 문서로만 남지 않게](#6-강제-수단--문서로만-남지-않게)
- [부록 A — 어휘 인덱스](#부록-a--어휘-인덱스)

---

## 0. 왜 이 문서가 있는가

파트 이름이 컴포넌트마다 갈리면 두 가지가 깨진다.

1. **소비자가 컴포넌트마다 다른 어휘를 외운다.** `badge` 를 어디서는 문자열로, 어디서는 `true` 로 넘긴다는 것을 타입 오류로 배우게 된다. 이것은 문서로 메울 수 없다 — 이름 자체가 틀린 약속을 하고 있기 때문이다.
2. **AI 도구가 패턴을 일반화하지 못한다.** 이 저장소는 `{COMPONENT}_{PROP}S` as const 배열을 내보내 "유효한 variant 값을 프로그래밍적으로 발견"할 수 있게 만들어 두었다([CLAUDE.md](../CLAUDE.md) Variant Metadata Export). 파트 이름에는 그런 고정점이 없다. 그래서 새 컴포넌트를 만들 때마다 기존 13개 중 **어느 것을 흉내 낼지**가 매번 새 판단이 된다 — 원칙 2(시스템으로 판단 대체)가 적용되지 않은 영역이다.

### 0.1 지금 무엇이 갈려 있는가 — 실측

전부 오늘 소스에서 확인했다. 추측이 아니다.

| # | 갈라진 것 | 근거 |
|---|---|---|
| P1 | **`badge` 가 같은 이름으로 두 가지 뜻이다.** `ChipUniversal` 은 `badge?: ReactNode` 로 받아 `BadgeLabel nano` 를 그리고, `SegmentBar.Item`·`Tab.Item` 은 `badge?: boolean` 로 받아 `BadgeDot` 을 그린다 | [ChipUniversal.tsx](../src/components/Chip/ChipUniversal.tsx) · [SegmentBar.tsx](../src/components/SegmentBar/SegmentBar.tsx) · [Tab.tsx](../src/components/Tab/Tab.tsx) |
| P2 | 같은 개념을 **이미 정확히 나눠 부르는 곳이 있다.** `NavVertical.Item` 은 `badgeLabel` 과 `badgeDot` 을 따로 받는다. 즉 올바른 어휘가 저장소 안에 이미 존재하는데 두 컴포넌트가 따르지 않는다 | [NavVertical.tsx](../src/components/NavVertical/NavVertical.tsx) |
| P3 | **JSDoc 은 `Leading icon` 이라고 적는데 prop 이름은 `icon` 이다.** 이름이 문서와 어긋난 채로 두 컴포넌트에 있다 | [NavVertical.tsx](../src/components/NavVertical/NavVertical.tsx) · [SegmentBar.tsx](../src/components/SegmentBar/SegmentBar.tsx) |
| P4 | **루트 props 타입 이름이 3형이다.** `CalloutProps`·`NavVerticalProps`·`SegmentBarProps` / `TabGroupProps` / `TooltipRootProps` | 각 컴포넌트 `index.ts` |
| P5 | **화살표를 노출하는 형태가 2형이다.** `Callout.Arrow` 는 서브컴포넌트, `Tooltip.Content` 는 `hasArrow?: boolean` | [Callout.tsx](../src/components/Callout/Callout.tsx) · [Tooltip.tsx](../src/components/Tooltip/Tooltip.tsx) |
| P6 | **닫기를 노출하는 형태가 2형이고, 접근명 정책도 다르다.** `Callout.Close` 는 `'aria-label'?: string` 을 받아 기본값 `'Close'` 를 쓰고, Chip 3종의 닫기 버튼은 `aria-label="Remove"` 가 하드코딩돼 밖에서 바꿀 수 없다 | [Callout.tsx](../src/components/Callout/Callout.tsx) · [ChipBadgeLikeUniversal.tsx](../src/components/Chip/ChipBadgeLikeUniversal.tsx) |

**왜 지금인가.** 컴포넌트가 13개인 지금 고치면 수정 지점이 84곳(§5.4)이다. 40개가 되면 같은 비율로 260곳이 된다. 그리고 첫 compound 오버레이(Dialog·Dropdown·Table)는 파트가 가장 많은 부류라, 어휘가 확정되기 전에 만들면 P1~P6 이 그대로 복제된다. [QUALITY_GATES_PLAN.md](./QUALITY_GATES_PLAN.md) Phase 6 의 트리거가 "컴포넌트 20개 도달 전, 또는 첫 compound 오버레이 착수 전"인 이유가 이것이다.

### 0.2 용어 모델

네 층을 구분한다. 이 문서는 두 번째 층만 규정한다.

| 층 | 정의 | 이름의 출처 | 예 |
|---|---|---|---|
| **컴포넌트** | 소비자가 `import` 하는 단위 | Figma 컴포넌트 세트 이름 (원칙 1: Figma 가 고정점) | `Button`, `SegmentBar`, `Tooltip` |
| **파트** | 컴포넌트를 이루는, 화면에서 구분되는 조각 | **이 문서의 §1** | `Root`, `Ring`, `Overlay`, `Item`, `Label` |
| **상태** | 시간에 따라 변하는 컴포넌트의 조건 | §2.3 표 | `disabled`, `loading`, `selected`, `open` |
| **변형** | 같은 컴포넌트의 서로 다른 고정된 형태 | `{COMPONENT}_{PROP}S` as const 배열 | `hierarchy`, `size`, `shape`, `variant` |

**파트와 변형은 다른 축이다.** `size` 는 파트가 아니라 모든 파트에 동시에 걸리는 변형이고, `Ring` 은 변형이 아니라 특정 상태에서만 보이는 파트다. 둘을 섞으면 `size` 를 파트처럼 슬롯으로 열거나(`<Button.Size>`) `Ring` 을 variant 로 만드는(`variant="ring"`) 잘못이 나온다.

**파트는 계층을 갖는다.** `Root > Content > Item > Label` 처럼 포함 관계로 읽는다. 이 계층은 DOM 구조와 대체로 일치하지만 **DOM 과 같을 필요는 없다** — 레이아웃 편의를 위한 래퍼 `<span>` 은 파트가 아니다(§1.6).

---

## 1. 표준 파트 어휘

각 표의 **사용처** 열은 오늘 소스에 실제로 있는 것만 적는다. 아직 쓰이지 않은 이름은 `예약` 으로 표시하고, 예약된 이름은 "통과"가 아니라 "미검증"이다 — 첫 사용 시점에 이 정의가 맞는지 다시 확인해야 한다.

### 1.1 구조

| 파트 | 정의 | 이 저장소의 사용처 |
|---|---|---|
| **Root** | compound 의 최상위 요소. 상태와 Context 를 소유하고, 나머지 파트는 여기서 값을 읽는다 | `CalloutRoot` · `NavVerticalRoot` · `SegmentBarRoot` · `TooltipRoot` — 넷 다 `Object.assign(Root, { … })` 으로 기본 export 된다. Tab 만 `TabGroup` 이라 이름이 다르다(§5.1 A6) |
| **Content** | Root 가 **여닫는 대상인 표면**. 열림 상태에 따라 마운트가 바뀐다 | `Callout.Content` · `Tooltip.Content` · `Collapsible.Content`(NavVertical.Group 내부) |
| **Group** | 형제 `Item` 을 묶는 중간 컨테이너. 자체 제목을 가질 수 있다 | `NavVertical.Group`(`label` 필수) · `RadioGroup` |
| **Container** | 파트를 담기만 하는 레이아웃 상자 | 예약 — 노출된 사용처 0. 내부 래퍼는 이름을 붙이지 않는다(§1.6) |

> **`Content` 의 두 용법을 섞지 마라.** 노출 파트로서의 `Content` 는 위 정의(여닫는 표면) **하나만** 뜻한다. 컴포넌트 내부의 콘텐츠 정렬용 `<span>` 은 파트가 아니므로 노출되지 않고, 주석에서는 `Content wrapper` 로 적어 구분한다 — [Button.tsx](../src/components/Button/Button.tsx) 이 이미 그렇게 쓴다. 이 구분이 무너지면 `Button.Content` 같은 것을 열게 되고, 그 순간 Button 의 아이콘 배치 규칙(항상 앞 1개·뒤 1개)이 소비자에게 넘어간다.

### 1.2 텍스트

| 파트 | 정의 | 이 저장소의 사용처 |
|---|---|---|
| **Label** | 파트를 식별하는 짧은 텍스트. 값은 소비자가 준다 | `NavVertical.Group` 의 `label: string` ([NavVertical.tsx](../src/components/NavVertical/NavVertical.tsx)). 컴포넌트 이름으로는 `BadgeLabel` |
| **Description** | Label 아래 보조 설명. 결정에 필요한 정보를 담는다 | **예약** — 사용처 0 |
| **HelpText** | 입력 방법·제약 안내. 에러 시 에러 메시지로 교체된다 | **예약** — 사용처 0 |
| **Counter** | 수량·잔여를 나타내는 숫자 표시 | **개념만 존재.** `BadgeLabel` 의 `nano` 사이즈가 "counter-only (numbers only)"로 정의돼 있다([BadgeLabel.tsx](../src/components/Badge/BadgeLabel.tsx)). 파트 이름으로는 미사용 |
| **Placeholder** | 값이 비었을 때 보여 주는 예시 텍스트 | **예약** — 사용처 0 |

> 이 절 5개 중 4개가 예약이다. 이유는 단순하다 — `src/components/` 에 **폼 입력 계열(TextField·Textarea·FormField)이 아직 없다.** 이 어휘가 처음 쓰이는 시점이 그 컴포넌트들이고([ROADMAP.md](./ROADMAP.md)), 그때 이 정의가 Figma 와 맞는지 재확인해야 한다. "표준으로 정해 뒀으니 통과"가 아니다.

### 1.3 인터랙션

| 파트 | 정의 | 이 저장소의 사용처 |
|---|---|---|
| **Trigger** | 오버레이·펼침을 **여는** 요소. 누르면 열린다 | `Tooltip.Trigger`(노출). 내부 위임: `RadixTabs.Trigger`(Tab.Item), `Collapsible.Trigger`(NavVertical.Group) |
| **Close** | **닫는** 요소 | `Callout.Close`(서브컴포넌트, 기본 `aria-label="Close"`) · Chip 3종의 `onClose` 핸들러 |
| **Item** | Group·List 안의 선택 가능한 한 개 | `NavVertical.Item` · `SegmentBar.Item` · `Tab.Item` |
| **Action** | 표면 안에서 다음 동작으로 넘어가는 버튼 | `Callout.Action`(`closeOnClick` 지원) |
| **Anchor** | 오버레이의 **위치 기준점**. 여는 주체가 아니다 | `Callout.Anchor` |

> **Anchor 와 Trigger 를 합치지 마라.** Callout 은 클릭으로 열리지 않는다 — `open`/`defaultOpen`/`onOpenChange` 로 밖에서 제어된다([Callout.tsx](../src/components/Callout/Callout.tsx)). 그 요소는 "무엇을 가리켜 뜰지"만 정하므로 Trigger 가 아니라 Anchor 다. 이름을 Trigger 로 바꾸면 소비자는 클릭 핸들러가 붙는다고 기대하고, 붙지 않는 이유를 소스를 읽어야 알게 된다.

### 1.4 장식·시그널

| 파트 | 정의 | 이 저장소의 사용처 |
|---|---|---|
| **Indicator** | 상태를 나타내는 비상호작용 시각 요소 | Tab 활성 밑줄([Tab.tsx](../src/components/Tab/Tab.tsx) `Bottom border indicator`) · NavVertical.Group 셰브론([NavVertical.tsx](../src/components/NavVertical/NavVertical.tsx)) |
| **Badge** | Item 에 붙는 작은 라벨·카운트. **내용이 있다** | `BadgeLabel` · `ChipUniversal` 의 `badge`(ReactNode) · `NavVertical.Item` 의 `badgeLabel` |
| **Dot** | **내용 없는** 점 표시. "무언가 있다"만 알린다 | `BadgeDot` · `NavVertical.Item` 의 `badgeDot` · `SegmentBar.Item`·`Tab.Item` 의 `badge`(boolean, §5.1) |
| **Overlay** | 루트 위에 절대 배치돼 hover/press 틴트를 그리는 형제 `<span>` | `State overlay` 주석 **18곳**. Button 4종 · Chip 4종 · Tab 2곳 · NavVertical 2곳 · Switch · SegmentBar 등 |
| **Ring** | 키보드 포커스에서만 보이는 테두리 | `Focus ring` 주석 **16곳**. 색 토큰은 `--comp-*-focus-border` |
| **Arrow** | 오버레이가 Anchor 를 가리키는 삼각형 | `Callout.Arrow` · `Tooltip.Content` 의 `hasArrow` |
| **Spinner** | 진행 중임을 나타내는 회전 표시 | `src/components/icons/Spinner.tsx` — Button 4종·TextButton 의 `loading` 에서 사용 |
| **Divider** | 구획선 | **예약** — 컴포넌트 파트로는 사용처 0. `--semantic-divider-*` 토큰만 존재 |

> **Badge 와 Dot 은 다른 파트다.** 내용의 유무가 아니라 **소비자 API 가 갈리기 때문**이다. Badge 는 `ReactNode` 를 받아야 하고 Dot 은 `boolean` 이면 충분하다. 한 이름으로 두 개를 덮으면 타입이 `ReactNode | boolean` 이 되고, `badge={0}` 같은 falsy 값에서 의도가 갈린다. 이미 `NavVertical.Item` 이 둘을 나눠 두었다(P2).
>
> **Ring 은 파트, `focus-border` 는 토큰 속성이다.** 토큰 이름은 `--comp-{component}-{property}-{variant}` 규약을 따르고 `{property}` 자리에는 CSS 역할(`bg`·`content`·`border`)이 온다([CLAUDE.md](../CLAUDE.md) Component Tokens). Ring 파트의 색은 그 요소의 `border-color` 이므로 `focus-border` 가 맞다. 파트 이름과 토큰 이름이 달라 보이는 것은 불일치가 아니라 **두 어휘가 다른 것을 가리키기 때문**이다(§5.3 C4).

### 1.5 위치 수식어 — Leading / Trailing

**Left/Right 를 쓰지 않는다.** 이름은 렌더 위치가 아니라 **읽기 순서상의 역할**을 가리켜야 하기 때문이다. RTL 레이아웃(아랍어·히브리어)에서 시각적 왼쪽은 논리적 시작이 아니다. `iconLeft` 라고 부르면 RTL 에서 그 아이콘은 오른쪽에 그려지고, 이름이 거짓말이 된다. `iconLeading` 은 어느 방향에서든 "텍스트보다 먼저 오는 것"으로 참이다.

이것은 새 결정이 아니다. [COMPONENT_PATTERNS.md](./COMPONENT_PATTERNS.md) Pattern 2 가 이미 `iconLeading`/`iconTrailing` 을 명문화했고, 오늘 **5개 컴포넌트가 그 이름을 쓴다**(Button · ButtonEmphasized · ButtonError · TextButton · ChipUniversal). 이 문서는 그 어휘를 아이콘 밖으로 확장한다.

| 축 | 수식어 | 이유 |
|---|---|---|
| 가로(읽기 방향) | `Leading` / `Trailing` | RTL 에서 물리 방향이 뒤집힌다 |
| 세로 | `Top` / `Bottom` | 읽기 방향이 뒤집혀도 위아래는 그대로다. 논리 이름을 만들 필요가 없다 |

확장 규칙: 같은 종류의 슬롯이 텍스트 앞뒤 두 자리에 있으면 `{part}Leading` / `{part}Trailing` 으로 붙인다. 자리가 하나뿐이고 그 자리가 고정이면 수식어를 붙이지 않는다(§2.2).

> **정직하게 남길 한계:** API 는 RTL 안전하지만 **레이아웃은 아직 아니다.** 오늘 `src/` 에 논리 속성 유틸(`ps-`·`pe-`·`ms-`·`me-`)은 **0곳**이고, 물리 방향 유틸을 쓴다 — NavVertical 의 `pl-`/`pr-`, ChipUniversal 배지의 `-top-1 -right-1`, Tab 배지의 `right-[…]`, 여러 곳의 `text-left`. 즉 지금 RTL 을 켜면 아이콘 **이름**은 맞지만 **위치**는 틀린다. 이 문서는 어휘만 고정하며, RTL 을 실제 지원하는 시점에 §1.5 는 CSS 규칙으로 확장돼야 한다. 그때까지 이 항목은 "통과"가 아니라 **미검증**이다.

### 1.6 파트가 아닌 것 — 전역 경계

아래는 컴포넌트가 이름을 붙일 대상이 아니다. 파트로 취급하면 컴포넌트마다 중복된 축이 생긴다.

| 경계 | 왜 파트가 아닌가 |
|---|---|
| **테마** | `data-theme` 은 **조상 요소**에 붙는 전역 계약이다([CLAUDE.md](../CLAUDE.md) Theme Support). 컴포넌트는 시맨틱 토큰만 쓰고 테마 이름을 직접 참조하지 않는다. `<Button.Theme>` 같은 파트는 존재할 수 없다 |
| **토큰** | `--comp-*` 의 `{property}` 세그먼트는 CSS 역할이지 파트 이름이 아니다(§1.4 노트) |
| **레이아웃 셸** | `src/components/showcase-layout/` 은 쇼케이스 껍데기이고 라이브러리 표면이 아니다. `Sidebar`·`TableOfContents` 의 `label`·`active` 는 이 문서의 대상이 아니다 |
| **측정·계산** | `usePretext` · `PretextMeasurement` 는 화면 조각이 아니라 계산이다. 훅과 그 반환 타입에는 파트 어휘를 쓰지 않는다 |
| **내부 래퍼** | 정렬·간격만 담당하고 그것만 사라져도 사용자가 알아채지 못하는 `<span>`. 이름을 붙이지 않고 노출하지도 않는다 |

---

## 2. prop 문법 — 파트를 API 표면으로 옮기는 규칙

파트에 이름이 붙었다고 전부 API 가 되지 않는다. 이 절은 **어떤 파트가, 어떤 형태로** 표면에 나오는지를 정한다. 여기서 정한 이름은 [QUALITY_GATES_PLAN.md](./QUALITY_GATES_PLAN.md) §4.1 이 정의한 **공개 표면**(props interface 의 prop 이름·타입, `index.ts` 의 export 이름)에 그대로 들어간다 — 즉 개명은 L3 이다.

### 2.1 노출 형태 — 값 prop · 슬롯 prop · 서브컴포넌트

판단 트리. 위에서부터 내려가며 처음 참인 곳에서 멈춘다.

1. 소비자가 주는 것이 **문자열 하나**인가 → **값 prop** (`label: string`)
2. 임의 노드지만 **위치와 개수를 컴포넌트가 정하는가** → **슬롯 prop** (`iconLeading?: ReactNode`)
3. **순서·개수·조합을 소비자가 정하는가** → **서브컴포넌트** (`Callout.Text` + `Callout.Close` + `Callout.Action`)
4. 위 어디에도 해당하지 않으면 → **노출하지 않는다**

근거는 이 저장소의 실제 형태다.

- Button 의 아이콘은 **항상 앞 1개·뒤 1개**로 자리가 정해져 있다. 그래서 슬롯 prop 이고, 컴포넌트가 크기(`iconSizeMap`)와 `flex-shrink-0` 을 강제할 수 있다. 서브컴포넌트로 열었다면 그 강제가 소비자에게 넘어간다.
- Callout 의 본문·닫기·액션은 **조합이 사례마다 다르다** — 닫기만 있는 것, 액션만 있는 것, 둘 다인 것. 그래서 서브컴포넌트다([Callout.tsx](../src/components/Callout/Callout.tsx) 의 6개 서브컴포넌트).
- `NavVertical.Group` 의 제목은 **언제나 문자열 한 줄**이다. 그래서 `label: string` 이고 `ReactNode` 가 아니다 — 타입이 좁을수록 잘못 쓸 방법이 적다.
- Overlay·Ring 은 소비자가 관여할 것이 하나도 없다. 그래서 prop 이 없다. 이것이 4번의 정상 결과다.

> **하이브리드 유니온은 새로 만들지 않는다.** `badgeLabel?: ReactNode | BadgeLabelConfig` 와 `badgeDot?: boolean | BadgeDotConfig`([NavVertical.tsx](../src/components/NavVertical/NavVertical.tsx))는 슬롯과 값의 합집합이다. 호출부는 짧아지지만 타입이 유니온이라 소비자가 매번 "어느 쪽으로 줄지"를 판단해야 하고, 자동완성이 두 갈래로 갈린다. 기존 2곳은 §5.3 C6 에 예외로 기록하고, **새 컴포넌트에서는 쓰지 않는다.**
>
> **render prop 은 네 번째 형태다.** `TextReservation` 의 `children: (text: string) => ReactNode`([TextReservation.tsx](../src/components/Skeleton/TextReservation.tsx))는 위 셋 중 무엇도 아니다. 컴포넌트가 **측정한 값을 되돌려 줘야** 성립하는 경우에만 쓴다(§5.2 B7).

### 2.2 아이콘 3형

| 형 | 시그니처 | 사용처 | 언제 |
|---|---|---|---|
| **단독** | `icon: ReactNode` (필수) + `'aria-label': string` (필수) | `IconButton` · `IconButtonEmphasized` · `IconButtonError` — 선언 3곳, `aria-label` 필수 선언도 정확히 3곳 | **보이는 텍스트가 없어** 앞/뒤 개념이 성립하지 않을 때. 텍스트가 없으므로 접근명을 타입으로 강제한다 |
| **좌우** | `iconLeading?: ReactNode` · `iconTrailing?: ReactNode` | Button · ButtonEmphasized · ButtonError · TextButton · ChipUniversal — 선언 5곳 | 텍스트가 있고 아이콘이 그 앞/뒤에 붙을 때 |
| **잘못 쓴 단독** | `icon?: ReactNode` 인데 텍스트가 있다 | `NavVertical.Item` · `SegmentBar.Item` | 해당 없음 — 좌우형으로 가야 한다(§5.1 A1·A2). 두 곳 다 JSDoc 은 이미 "Leading icon" 이라고 적고 있다 |

**타입은 언제나 `ReactNode` 다.** 이 저장소의 아이콘 슬롯 중 `ComponentType`/`FC` 를 받는 곳은 **0곳**이다. 근거:

- 아이콘 컨테이너가 `style={{ fontSize }}` 와 `[&>*]:[font-size:inherit]` 로 크기를 **주입**한다([CLAUDE.md](../CLAUDE.md) Icon System, [COMPONENT_PATTERNS.md](./COMPONENT_PATTERNS.md) Pattern 2). 주입하는 쪽이 크기를 쥐고 있으므로 받는 쪽은 엘리먼트면 충분하다.
- `FC` 를 받으면 컴포넌트가 크기를 prop 으로 넘겨야 하고, `<Icon name="…"/>` 와 인라인 `<svg>` 의 경로가 갈린다. 지금은 둘 다 그냥 엘리먼트로 들어온다.
- `Icon` 자체가 `name: string` 을 받는 얇은 래퍼라([icons/Icon.tsx](../src/components/icons/Icon.tsx)) 소비자가 `<Icon name="search" />` 를 쓰는 것이 이미 가장 짧은 형태다.

### 2.3 상태 prop 어휘

| prop | 의미 | 이 저장소의 구현 | 사용처 |
|---|---|---|---|
| `disabled` | **지금 쓸 수 없다.** 값도 제출되지 않는다 | native `disabled` + `aria-disabled` + `pointer-events-none` | Button 4종 · TextButton · Chip 3종 · NavVertical.Item · SegmentBar.Item · Tab.Item |
| `loading` | **요청 중이다.** 결과가 오면 다시 쓸 수 있다 | `isInert = disabled \|\| loading` 을 만들어 `disabled` 와 **똑같이** native `disabled` 를 켜고, `aria-busy` 를 더한다([Button.tsx](../src/components/Button/Button.tsx)) | Button 4종 · TextButton |
| `readOnly` | 값은 보이지만 바꿀 수 없다. **포커스와 복사는 된다** | 사용처 0 — 입력 컴포넌트가 없다 | **예약** |
| `selected` | 여러 개 중 이것이 골라져 있다. 폼 값이 아니다 | `aria-pressed={selected}`([ChipUniversal.tsx](../src/components/Chip/ChipUniversal.tsx)) | ChipUniversal |
| `checked` | **불리언 값 자체.** 폼에 제출된다 | Radix 가 소유하고 `data-state="checked \| unchecked \| indeterminate"` 로 내려준다 | Checkbox · Radio · Switch |
| `active` | **지금 보고 있는 것** | prop 이 아니라 파생 상태다. Root 의 `value` 와 Item 의 `value` 를 비교해 `data-active` + `aria-current="page"` 를 만든다([NavVertical.tsx](../src/components/NavVertical/NavVertical.tsx)) | NavVertical.Item · SegmentBar.Item · Tab.Item |
| `open` | 표면이 열려 있다 | `open` / `defaultOpen` / `onOpenChange` 3종 세트 | Callout · Tooltip. NavVertical.Group 은 `defaultOpen` 만(uncontrolled 전용) |

규칙:

1. **`active` 를 prop 으로 만들지 않는다.** 진실은 Root 의 `value` 한 곳에 둔다. Item 마다 `active` 를 받으면 두 곳이 어긋날 수 있고, 어긋난 상태를 소비자가 만들 수 있다.
2. **`selected` 와 `checked` 를 섞지 않는다.** `checked` 는 폼 값이라 제출되고 `name`/`value` 와 함께 다닌다. `selected` 는 시각·의미상의 선택이고 폼과 무관하다. ChipUniversal 이 `checked` 가 아니라 `selected` + `aria-pressed` 인 이유가 이것이다 — 칩은 폼 필드가 아니다.
3. **`disabled` 와 `loading` 은 의미가 다르지만 지금 결과가 같다.** 둘 다 탭 순서에서 빠지고 클릭이 무시된다. 표준 접근성 지침은 `loading` 을 `aria-disabled` 로만 처리해 **포커스를 유지**하라고 말한다 — native `disabled` 를 켜면 누르는 순간 포커스가 `<body>` 로 튀어, 키보드 사용자는 자기가 어디 있었는지 잃는다. 이 차이를 낼 것인지는 결정 대상이다(§5.3 C7, 오케스트레이터 판단 필요).

### 2.4 이벤트 핸들러 네이밍

| 형태 | 규칙 | 이 저장소의 사용처 |
|---|---|---|
| `on{State}Change` | controlled 상태를 되돌려 준다. `{state}` / `default{State}` / `on{State}Change` **3종 세트**로만 존재한다 | `onValueChange`(NavVertical · SegmentBar · Tab) · `onOpenChange`(Callout · Tooltip) |
| `on{Part}` | 파트 이름이 곧 동사인 경우. 이벤트 이름을 덧붙이지 않는다 | `onClose`(Chip 3종) |
| `on{Part}{Event}` | 파트 이름이 명사인 경우 | 현재 정확히 이 형태인 것 **없음**. 첫 사례는 Dialog·Dropdown 에서 나올 것이다(`onItemSelect` 등) |
| React 표준 그대로 | DOM 이벤트를 그대로 전달하면 이름을 바꾸지 않는다 | `onClick`(Callout.Action) · 각 컴포넌트가 spread 하는 `...rest` |

규칙: `onCloseClick` 처럼 **동사 파트에 이벤트를 덧붙이지 않는다** — `Close` 가 이미 무슨 일이 일어났는지 말한다. 반대로 `onItem` 은 무슨 일이 일어났는지 말하지 않으므로 `onItemSelect` 가 필요하다.

---

## 3. 해체 절차 — 새 컴포넌트를 받았을 때

### 3.1 절차

1. **렌더 트리에서 눈에 보이는 조각을 센다.** 판정 기준: *그 조각만 사라져도 사용자가 알아채는가.* 알아채지 못하면 내부 래퍼다(§1.6).
2. **각 조각을 세 질문으로 분류한다.** (a) 소비자가 내용을 정하는가 (b) 위치·개수가 컴포넌트에 고정인가 (c) 상태에만 반응하는가.
3. **§1 표에서 이름을 찾는다.** 있으면 그 이름을 쓴다. **없으면 §5.2 에 확장을 제안한다** — 새 이름을 조용히 만들지 않는다. 이것이 원칙 8(시스템 이탈 = 수정 신호)의 적용점이다.
4. **§2.1 판단 트리로 노출 형태를 정한다.** (c) 뿐인 조각은 노출하지 않는다.
5. **§1.5 로 위치 수식어를 붙인다.** 같은 파트가 텍스트 앞뒤 두 자리에 있으면 `Leading`/`Trailing`.
6. **§2.3 표와 상태 prop 을 대조한다.** 새 상태 이름을 만들기 전에 표를 먼저 본다.
7. **spec 에 기록한다.** `specs/{name}.json` 의 `anatomy` 블록(§6.1). 기록하지 않으면 §6 의 어떤 검사도 그 컴포넌트를 보지 못한다.

### 3.2 워크드 예제 — `NavVertical.Item` 을 처음 받았다고 가정한다

소스: [NavVertical.tsx](../src/components/NavVertical/NavVertical.tsx) 의 `NavVerticalItem`.

**1단계 — 조각 세기.** 렌더 트리에서:

| 조각 | 소스에서 찾는 법 | 사라지면 알아채는가 |
|---|---|---|
| 루트 | `data-nav-vertical-item` 를 붙인 `<button>` | 예 |
| Focus ring | `{/* Focus ring — keyboard only */}` | 예(키보드 사용자) |
| State overlay | `{/* State overlay — hover/active */}` | 예(hover 시) |
| 아이콘 래퍼 `<span>` | `{/* Icon */}` | 예 |
| 텍스트 `<span>` | `{/* Text */}` | 예 |
| 배지 라벨 | `{/* Badge label */}` | 예 |
| 배지 점 | `{/* Badge dot */}` | 예 |

내부 래퍼는 없다 — 7개 전부 파트다.

**2단계 — 분류.**

| 조각 | (a) 내용을 소비자가? | (b) 위치 고정? | (c) 상태에만 반응? |
|---|:-:|:-:|:-:|
| 루트 | — | — | 예(active/disabled) |
| Focus ring | 아니오 | 예 | 예 |
| State overlay | 아니오 | 예 | 예 |
| 아이콘 | **예** | 예(텍스트 앞) | 아니오 |
| 텍스트 | **예** | 예 | 아니오 |
| 배지 라벨 | **예** | 예(텍스트 뒤) | 아니오 |
| 배지 점 | 아니오(있다/없다만) | 예 | 아니오 |

**3단계 — 어휘 매핑.** 루트→`Root`(단, 여기서는 Group 안의 하나이므로 `Item`), Focus ring→`Ring`, State overlay→`Overlay`, 아이콘→`Icon`(§1.5 로 수식어 필요), 텍스트→`Label`, 배지 라벨→`Badge`, 배지 점→`Dot`. **전부 §1 에 있다 — 확장 제안 없음.**

**4단계 — 노출 형태.**

- `Ring`·`Overlay` → (c) 뿐이다 → **노출하지 않는다.** 실제로 prop 이 없다. ✅
- `Icon` → 임의 노드 + 자리 고정 → **슬롯 prop.** ✅
- `Label` → 임의 노드(텍스트뿐 아니라 노드가 올 수 있다) + 자리 고정 → **슬롯 prop.** 실제 구현은 `children` 이다 — 파트가 하나뿐인 주 콘텐츠는 `children` 을 쓴다. ✅
- `Badge` → 임의 노드 + 자리 고정 → **슬롯 prop** `badgeLabel`. ✅
- `Dot` → 있다/없다뿐 → **값 prop** `badgeDot: boolean`. ✅

**5단계 — 위치 수식어.** 아이콘은 텍스트 **앞** 자리에 고정이다(코드도 `{/* Text */}` 보다 앞인 `{/* Icon */}` 에서 그린다). 배지는 뒤다. 따라서 아이콘의 이름은 **`iconLeading`** 이어야 한다.

> **여기서 불일치가 나온다.** 실제 prop 이름은 `NavVerticalItemProps` 의 `icon` 이다. 그런데 바로 윗줄 JSDoc 은 이미 `Leading icon slot.` 이라고 적는다 — 의도는 leading 이었고 이름만 따라오지 않았다. §5.1 **A1** 으로 등록한다.

**6단계 — 상태 대조.** `disabled` ✅(표에 있다). `active` 는 prop 이 아니라 Root 의 `value` 와 비교해 파생한다 ✅(§2.3 규칙 1을 지키고 있다).

**7단계 — 기록.** `specs/nav-vertical.json` 에 `anatomy` 블록을 추가한다(§6.1). 오늘 이 파일에는 `props` 는 있지만 `anatomy` 는 없다.

**결론:** 7개 파트 중 6개는 표준을 지키고 있고, 1개(`icon` → `iconLeading`)가 개명 대상이다. 절차가 실제로 결함을 하나 잡아냈다는 것이 이 예제의 요점이다 — 절차가 아무것도 잡지 못했다면 그 절차는 검사가 아니라 의식이다.

---

## 4. 컴포넌트 해체표 (13개 전수)

`src/components/` 전부. `icons`·`showcase-layout` 은 라이브러리 표면이 아니므로 제외한다(§1.6).
**prop 이름은 각 컴포넌트의 `export interface *Props` 에서 직접 읽었다.** Radix 에 위임해 우리가 이름을 정하지 않는 prop(`checked`·`onCheckedChange`·`name`·`value` 등)은 `+ Radix` 로 줄인다.

| # | 컴포넌트 | 노출된 파트 (현재 prop / 서브컴포넌트 이름) | 노출하지 않는 파트 | 표준 일치 |
|:-:|---|---|---|---|
| 1 | **Badge** — `BadgeLabel`·`BadgeDot` | Label: `children` · `size`·`shape`·`weight`·`color` / Dot: `size`·`outlined`·`color` | 없음(단일 `<span>`) | ✅ 컴포넌트 이름이 곧 파트 이름인 드문 경우. `nano` 가 Counter 용도임은 JSDoc 에만 있다 |
| 2 | **Button** — `Button`·`ButtonEmphasized`·`ButtonError`·`IconButton`×3 | `iconLeading`·`iconTrailing`·`children` · `hierarchy`·`size`·`shape`·`fullWidth`·`disabled`·`loading`·`asChild` / IconButton 3종은 `icon` + `'aria-label'`(필수) | Ring · Overlay · Content wrapper · Spinner | ✅ **기준 컴포넌트.** `iconLeading`/`iconTrailing` 어휘의 출처 |
| 3 | **Callout** | `.Anchor`·`.Content`·`.Arrow`·`.Text`·`.Close`·`.Action` / Root: `variant`·`size`·`shape`·`dismiss`·`autoDismissDuration`·`open`·`defaultOpen`·`onOpenChange` / Content: `side`·`align`·`showShadow`·`sideOffset`·`collisionPadding` / Close: `'aria-label'` / Action: `onClick`·`closeOnClick` | 내장 `CloseIcon`·`ArrowForwardIcon` | ✅ **파트 어휘가 가장 완전하다.** `Anchor` 는 의도적으로 `Trigger` 가 아니다(§5.3 C2) |
| 4 | **Checkbox** | `size`·`variant` + Radix | Visual square · glyph `<svg>` · Ring | ⚠️ `Visual` 이 §1 에 없다 → §5.2 **B3** |
| 5 | **Chip** — `ChipUniversal`·`ChipBadgeLike`×3 | Universal: `selected`·`size`·`iconLeading`·`iconTrailing`·**`badge`**·`asChild`·`children` / BadgeLike: `size`·`shape`·`weight`·`color`·`onClose`·`disabled`·`children` | Universal: Ring·Overlay·Content·Badge / BadgeLike: Ring·Overlay·Text·Close 버튼(`aria-label="Remove"` 하드코딩) | ⚠️ `badge: ReactNode` 가 종류를 말하지 않는다 → **A5**. Close 접근명이 고정 → **A8**(additive) |
| 6 | **NavVertical** — Root·`.Group`·`.Item` | Root: `value`·`defaultValue`·`onValueChange`·`size`·`shape` / Group: `label`·`collapsible`·`defaultOpen` / Item: `value`·**`icon`**·`badgeLabel`·`badgeDot`·`disabled` | Group: Ring·Overlay·Chevron / Item: Ring·Overlay·Icon·Text·BadgeLabel·BadgeDot | ⚠️ `icon` → `iconLeading` **A1**. **`badgeLabel`/`badgeDot` 는 저장소에서 가장 정확한 형태로, 다른 컴포넌트가 여기에 맞춘다** |
| 7 | **Radio** — `RadioGroup`·`Radio` | Group: `size` + Radix / Item: `size` + Radix | Visual circle · glyph · Ring | ⚠️ `Visual` **B3**. `Radio`/`RadioGroup` 가 형제 export 라 다른 5개 compound(`Object.assign`)와 형태가 다르다 → §5.3 C5(결정 필요) |
| 8 | **SegmentBar** — Root·`.Item` | Root: `size`·`shape`·`fullWidth`·`value`·`defaultValue`·`onValueChange` / Item: `value`·**`icon`**·**`badge`**·`disabled` | Rail(컨테이너) · Item Ring·Overlay·Content·BadgeDot | ⚠️ `icon` → `iconLeading` **A2** · `badge` → `badgeDot` **A3**. `Rail` 이 §1 에 없다 → **B2** |
| 9 | **Skeleton** — `SkeletonBlock`·`TextReservation`·`usePretext` | Block: `width`·`height`·`shape`·`disableAnimation` / TextReservation: `text`·`typography`·`ready`·`children`(render prop)·`estimatedLines`·`lastLineRatio`·`disableAnimation` | Shimmer overlay · 측정 canvas | ⚠️ `Shimmer` **B6** · render prop **B7**. `usePretext` 는 파트가 아니다(§1.6) |
| 10 | **Switch** | `size`·`shape` + Radix | Track(root) · Overlay · Ring · Thumb/placer · Knob | ⚠️ `Track`·`Thumb`·`Knob` **B4**. 주석의 `placer` 는 `Thumb` 의 중복 별칭 → 정리 대상(비파괴) |
| 11 | **Tab** — Root(`TabGroup`)·`.List`·`.Item`·`.Panel` | Group: `variant`·`size`·`value`·`defaultValue`·`onValueChange`·`activationMode` / List: `children` / Item: `value`·`disabled`·**`badge`** / Panel: `value`·`forceMount` | Ring · Overlay · Content · Indicator | ⚠️ `badge` → `badgeDot` **A4** · `TabGroupProps` → `TabProps` **A6**. `Panel` 은 유지(§5.3 C3) |
| 12 | **TextButton** | `color`·`size`·`onDim`·`fullWidth`·`disabled`·`loading`·`iconLeading`·`iconTrailing`·`asChild` | Ring · Content wrapper · Spinner. **Overlay 없음** — 색 변화만으로 상태를 표현한다 | ✅ |
| 13 | **Tooltip** — Root·`.Provider`·`.Trigger`·`.Content` | Provider: `delayDuration`·`skipDelayDuration`·`disableHoverableContent` / Root: `open`·`defaultOpen`·`onOpenChange`·`delayDuration`·`disableHoverableContent` / Trigger: `asChild` / Content: `variant`·`size`·`side`·`align`·**`hasArrow`**·`shape`·`showShadow`·`sideOffset`·`collisionPadding` | Portal · Arrow | ⚠️ `TooltipRootProps` → `TooltipProps` **A7**. `hasArrow` 는 `Callout.Arrow` 와 형태가 다르지만 규칙으로 설명된다(§5.3 C1) |

---

## 5. 불일치 판정

### 5.1 (a) 개명 — **A1–A8 전부 적용 완료 (2026-09-05)**

> 아래 8건은 이 문서가 판정한 뒤 **같은 날 전부 적용됐다.** 옛 이름은 deprecated alias 없이
> 완전히 삭제했다 — 외부 소비자가 0이라 alias 를 남길 이유가 없고, 남기면 어휘가 둘이 되어
> 이 문서가 막으려던 상태로 돌아간다. `docs:check` D5 와 `npm run build` 가 잔존을 잡는다.
>
> 표는 **판정 근거의 기록**으로 남긴다. "현재 → 표준" 열의 왼쪽이 옛 이름이다.

| ID | 대상 | 옛 이름 → 표준 | 근거 |
|:-:|---|---|---|
| **A1** | `NavVertical.Item` | `icon` → `iconLeading` | 텍스트가 있고 아이콘이 그 앞 자리에 고정이다(§2.2). JSDoc 이 이미 `Leading icon slot.` 이라고 적는다 — 이름만 따라오지 않았다 |
| **A2** | `SegmentBar.Item` | `icon` → `iconLeading` | 동일. JSDoc 은 `Leading icon.` |
| **A3** | `SegmentBar.Item` | `badge: boolean` → `badgeDot: boolean` | `BadgeDot` 을 그린다. `boolean` 인데 이름은 내용이 있는 Badge 를 암시한다(§1.4) |
| **A4** | `Tab.Item` | `badge: boolean` → `badgeDot: boolean` | 동일. JSDoc 도 `Show badge dot indicator.` 라고 적는다 |
| **A5** | `ChipUniversal` | `badge: ReactNode` → `badgeLabel: ReactNode` | `BadgeLabel size="nano"` 를 그린다. A3·A4 와 같은 이름으로 **다른 타입**을 받는 것이 P1 의 핵심이다 |
| **A6** | `Tab` | 타입 `TabGroupProps` → `TabProps` | 다른 4개 compound 의 루트 타입은 `CalloutProps`·`NavVerticalProps`·`SegmentBarProps` 다. `Tab` 자체가 루트로 export 되므로 `TabGroupProps` 는 존재하지 않는 컴포넌트를 가리킨다. **타입 전용 — 런타임 영향 없음** |
| **A7** | `Tooltip` | 타입 `TooltipRootProps` → `TooltipProps` | 동일. **타입 전용** |
| **A8** | Chip 3종 | 닫기 버튼 `aria-label="Remove"` 하드코딩 → `'aria-label'?: string` prop 으로 개방 | `Callout.Close` 는 이미 `'aria-label'?: string` 을 받고 기본값 `'Close'` 를 쓴다. 지금은 영어 문자열이 컴포넌트 안에 박혀 있어 i18n 이 불가능하다. **prop 추가이므로 additive — 파괴적이지 않다** |

### 5.2 (b) 표준 확장 — 이 저장소에만 있는 정당한 파트

§1 어휘에 **추가**한다. 확장은 늘리는 방향이므로 근거를 요구한다.

| ID | 이름 | 분류 | 정의 | 근거 |
|:-:|---|---|---|---|
| **B1** | `Anchor` | 인터랙션 | 오버레이의 위치 기준점. 여는 주체가 아니다 | `Callout.Anchor`. Trigger 와 합치면 클릭 동작을 잘못 기대하게 된다(§1.3) |
| **B2** | `Rail` | 구조 | 여러 `Item` 을 담는 트랙형 컨테이너. **높이를 스스로 선언하지 않고** 아이템 + 패딩으로 결정된다 | SegmentBar. [QUALITY_GATES_PLAN.md](./QUALITY_GATES_PLAN.md) §2.2 가 이미 "레일"이라는 말을 쓰고, 컨트롤 높이 계약(T4)이 레일 기준으로 판정된다 |
| **B3** | `Visual` | 장식·시그널 | 컨트롤의 시각 본체. 레이아웃 박스와 크기가 다를 수 있다 | Checkbox·Radio 의 `--comp-checkbox-visual-*`·`--comp-radio-visual-*`. 두 컴포넌트가 `visual + inset` 구조라 소스만으로 높이를 확정할 수 없어 `UNMEASURED_CONTROLS` 에 올라가 있다 — 즉 이 개념은 이미 검사 코드에도 반영돼 있다 |
| **B4** | `Track` · `Thumb` · `Knob` | 장식·시그널 | Track: 이동 경로가 되는 배경 / Thumb: 그 위를 움직이는 요소 / Knob: Thumb 안의 시각 레이어 | Switch. `Thumb` 은 Radix 가 정한 이름이고(`RadixSwitch.Thumb`), `Knob` 은 그 안에 우리가 덧그린 것이다. 두 층이 실제로 다르게 움직인다 — Thumb 은 이동, Knob 은 크기·색·그림자 |
| **B5** | `Chevron` | 장식·시그널 | 펼침 방향을 나타내는 꺾쇠. `Indicator` 의 하위 | NavVertical.Group. `--comp-nav-vertical-group-chevron-*` 토큰이 이미 그 이름이다 |
| **B6** | `Shimmer` | 장식·시그널 | 로딩 표면 위를 지나가는 그라디언트 | SkeletonBlock:79 |
| **B7** | render prop | §2.1 노출 형태 | 컴포넌트가 **측정·계산한 값을 되돌려 줘야** 성립하는 슬롯 | `TextReservation` 의 `children: (text: string) => ReactNode`. 텍스트 길이를 재서 스켈레톤 줄 수를 정하는 것이 이 컴포넌트의 일이므로, 값을 되돌려 주지 않으면 소비자가 같은 계산을 반복해야 한다 |

**제거 대상 1건(비파괴):** Switch 주석의 `placer` 는 `Thumb` 의 별칭이다([Switch.tsx](../src/components/Switch/Switch.tsx) `Thumb (placer)`). 같은 파트에 두 이름을 두면 `placerSizeMap`·`placerTranslateMap` 같은 내부 식별자가 어휘 밖으로 자란다. 주석과 내부 변수명만 바뀌므로 공개 표면에 영향이 없다.

### 5.3 (c) 예외 — 고치지 않기로 한 것

예외 목록은 **줄이기만 한다.** 여기에 항목을 더해야 하는 순간이 곧 승인을 받아야 하는 시점이다(원칙 8).

| ID | 항목 | 고치지 않는 이유 |
|:-:|---|---|
| **C1** | `Tooltip` 은 `hasArrow: boolean`, `Callout` 은 `Callout.Arrow` 서브컴포넌트 | **규칙으로 설명된다:** 화살표의 노출 형태는 그 표면의 조합 모델을 따른다. `Callout.Content` 는 Text·Close·Action 을 소비자가 조합하는 compound 표면이므로 Arrow 도 서브컴포넌트가 자연스럽고, `Tooltip.Content` 는 `children` 을 그대로 받는 단순 표면이므로 boolean 이 자연스럽다. 이 규칙을 §2.1 의 판단 트리와 함께 적용하면 새 오버레이에서도 답이 하나로 나온다 |
| **C2** | `Callout.Anchor` 를 `Trigger` 로 바꾸지 않는다 | Callout 은 클릭으로 열리지 않는다. §1.3 노트 참고 |
| **C3** | `Tab.Panel` 을 Radix 이름인 `Content` 로 바꾸지 않는다 | `Content`(§1.1)는 "Root 가 여닫는 표면"이고, tabpanel 은 여닫히는 것이 아니라 **선택에 따라 교체되는 영역**이다. ARIA role 도 `tabpanel` 이다. 이름이 role 과 일치하는 편이 낫다 |
| **C4** | Ring 파트의 토큰이 `--comp-*-focus-border` 인 것 | 토큰의 `{property}` 자리는 CSS 역할을 가리키며 파트 이름이 아니다(§1.4 노트). 11개 토큰 개명은 [QUALITY_GATES_PLAN.md](./QUALITY_GATES_PLAN.md) §4.1 기준 공개 표면 변경(L3)인데, 얻는 것은 어휘 통일뿐이고 실제로는 두 어휘가 다른 것을 가리키고 있다 |
| **C5** | `Radio` / `RadioGroup` 가 형제 export 인 것 | **보류 — 결정 필요.** 다른 5개 compound 는 `Object.assign` 이다. `RadioGroup.Item` 이 Radix 원형에 가깝지만, `Radio.Group` 으로 묶으면 `Radio` 가 루트인 것처럼 읽혀 실제 구조(Group 이 루트)와 어긋난다. 어느 쪽이든 개명 비용이 있어 이 문서에서 단독으로 정하지 않는다 |
| **C6** | `badgeLabel?: ReactNode \| BadgeLabelConfig` 유니온 2곳 | 이미 쓰이고 있고 타입이 좁아지는 방향의 개명이 아니다. **새로 만들지 않는다**는 규칙만 §2.1 에 둔다 |
| **C7** | `loading` 이 native `disabled` 를 켜는 것 | **보류 — 결정 필요.** 접근성상으로는 `aria-disabled` 만 켜고 포커스를 유지하는 편이 낫지만(§2.3 규칙 3), 5개 컴포넌트의 상호작용 동작이 바뀌는 변경이라 시각·키보드 검증이 함께 필요하다. Phase 3 의 `keyboardContract`(`disabled` 와 `loading` 의 탭 순서 차이)가 이 결정의 검증 수단이 된다 |
| **C8** | Radix 위임 prop 의 이름(`checked`·`onCheckedChange`·`value`·`required` 등) | 우리가 이름을 정하지 않는다. 바꾸면 Radix 타입과 어긋나 위임 자체가 깨진다 |
| **C9** | Chip 닫기의 접근명이 `"Remove"`, Callout 이 `"Close"` 인 것 | 파트는 둘 다 `Close` 지만 **접근명은 사용자에게 일어나는 결과**를 말해야 한다. 칩은 사라지고(remove), 콜아웃은 닫힌다(close). 다만 값이 하드코딩된 것은 별개 문제이므로 A8 로 고친다 |

### 5.4 파괴적 변경 총량 (적용 완료)

| 구분 | 이름 개수 | 컴포넌트 수 | 수정 지점(grep 기준) |
|---|:-:|:-:|:-:|
| **런타임 prop 개명** (A1–A5) | 5 | 4 — Chip · NavVertical · SegmentBar · Tab | 80 |
| **타입 전용 개명** (A6–A7) | 2 | 2 — Tab · Tooltip | 6 |
| **additive** (A8, 파괴적 아님) | 1 | 1 — Chip | 3 |
| **합계** | **7 개명 + 1 추가** | **5** | **89** |

지점 내역(전부 오늘 grep 으로 센 값):

| ID | 구현 | 스펙 | 호출부 | 계 |
|:-:|:-:|:-:|:-:|:-:|
| A1 `NavVertical.Item.icon` | 5줄 | 1줄(`nav-vertical.json` 의 `icon`) | 40 (전부 `NavVerticalShowcase.tsx`) | 46 |
| A2 `SegmentBar.Item.icon` | 5줄 | 1줄(`segment-bar.json` 의 `icon`) | 6 | 12 |
| A3 `SegmentBar.Item.badge` | 3줄 | 1줄(`segment-bar.json` 의 `badge`) | 4 | 8 |
| A4 `Tab.Item.badge` | 5줄 | 1줄(`tab.json` 의 `badge`) | 2 | 8 |
| A5 `ChipUniversal.badge` | 4줄 | 1줄(`chip-universal.json` 의 `badge`) | 1 | 6 |
| A6 `TabGroupProps` | 3줄 | — | — | 3 |
| A7 `TooltipRootProps` | 3줄 | — | — | 3 |
| A8 Chip 닫기 `aria-label` | 3줄 | — | — | 3 |

영향 파일 **15개**: `NavVertical.tsx` · `NavVerticalShowcase.tsx` · `specs/nav-vertical.json` · `SegmentBar.tsx` · `SegmentBarShowcase.tsx` · `specs/segment-bar.json` · `Tab.tsx` · `Tab/index.ts` · `TabShowcase.tsx` · `specs/tab.json` · `ChipUniversal.tsx` · `ChipShowcase.tsx` · `specs/chip-universal.json` · `Tooltip.tsx` · `Tooltip/index.ts` (A8 을 포함하면 Chip BadgeLike 3파일이 더해져 18개).

> 집계 기준: `specs/tab.json`·`specs/chip-universal.json` 은 이 문서와 **동시에 추가된 파일**이다([QUALITY_GATES_PLAN.md](./QUALITY_GATES_PLAN.md) F11 해소분).

**적용 결과 (2026-09-05):** 8건 전부 반영. 개명 뒤 `npm run check` = lint 0 problems · ✓ built ·
293 passed · docs:check 6종 통과. 계약 테스트 3곳(`a11ySmoke`)이 옛 이름을 쓰고 있어 함께 고쳤다 —
**타입 검사가 그 셋을 전부 잡아냈다.** 개명이 조용히 새어나갈 수 있는 경로는 타입이 없는 곳
(문서·스펙 산문)뿐이고, 그쪽은 `docs:check` 가 본다.

> **표준을 이미 지킨 증거 하나:** `specs/chip-universal.json` 은 같은 파일 안에서 `iconLeading`·`iconTrailing` 은 표준대로 적고 `badge` 만 어긋나 있다. 스펙 작성자가 아이콘 어휘는 이미 내면화했고 배지 어휘는 아직 없다는 뜻이다 — §1.4 의 Badge/Dot 구분이 문서에 없었기 때문이다.

> **⚠️ 이 저장소는 `package.json` 에 `private: true` 이고 외부 소비자가 0이다.** 그 사실이 비용 판단을 바꾼다:
>
> - **없는 비용:** npm 배포 · 버전 범프 · CHANGELOG · deprecation 기간 · 마이그레이션 가이드 · 소비자 조율. [QUALITY_GATES_PLAN.md](./QUALITY_GATES_PLAN.md) §1 이 이 셋을 명시적 **비목표**로 두었다.
> - **있는 비용:** 위 15~18개 파일의 수정과 `npm run check` 재확인. 그뿐이다.
> - **결론:** 개명은 지금 **거의 공짜에 가깝고**, 소비자가 생긴 뒤에는 영구히 비싸진다. "breaking 이라 미룬다"는 이 저장소에서 성립하지 않는 논거다.
>
> **단, 등급은 여전히 L3 이다.** [QUALITY_GATES_PLAN.md](./QUALITY_GATES_PLAN.md) §4.2 는 "export·prop 삭제/개명"을 L3 으로 두고 **RFC + 명시적 승인 전에는 코드를 만들지 않는다**고 정한다. 비용이 싸다는 것과 승인 없이 해도 된다는 것은 다르다 — 이 문서는 근거와 총량을 제공할 뿐 승인을 대신하지 않는다.

---

## 6. 강제 수단 — 문서로만 남지 않게

어휘가 문서에만 있으면 지켜지지 않는다. 이 저장소가 이미 그것을 실측했다 — [QUALITY_GATES_PLAN.md](./QUALITY_GATES_PLAN.md) §0.1 의 F1~F14 는 전부 "규칙은 있었지만 검사가 없어서 새어나간 것"이다. 아래 셋을 제안한다.

> 아래 §6.1·§6.2 는 **제안이며 이 문서 작업에서 구현하지 않았다.** `specs/_TEMPLATE.json` 에는 병행 작업이 `a11y` 블록을 넣었고 `anatomy` 는 아직 없다. `scripts/docs-check.mjs` 도 병행 작업으로 추가돼 **D1–D6 까지 존재한다** — §6.2 가 제안하는 것은 그 위에 얹는 D7 이다. 오늘 존재하는 검사만 통과 조건이 된다는 게이트 운영 원칙 1에 따라, D7 은 아직 통과 조건이 아니다.

### 6.1 `specs/_TEMPLATE.json` 에 `anatomy` 섹션 필수화

```jsonc
"anatomy": {
  "_comment": "docs/ANATOMY.md §1 의 표준 어휘만 쓴다. 새 이름이 필요하면 §5.2 확장으로 먼저 승인받는다.",
  "parts": [
    { "name": "Root",    "exposed": "component",        "element": "button" },
    { "name": "Ring",    "exposed": "none",             "note": "focus-visible 전용" },
    { "name": "Overlay", "exposed": "none" },
    { "name": "Icon",    "exposed": "prop:iconLeading", "type": "ReactNode" },
    { "name": "Label",   "exposed": "prop:children" },
    { "name": "Spinner", "exposed": "none",             "note": "loading 시에만" }
  ],
  "extensions": []
}
```

- **잡는 것:** 새 컴포넌트가 파트를 **선언하지 않고** 지나가는 것. `/behavior-spec` 이 이 블록을 채우지 않으면 스펙이 완성되지 않는다. `exposed` 필드가 §2.1 판단 트리를 강제로 통과하게 만든다.
- **못 잡는 것:** **선언과 구현의 괴리.** 스펙에 `iconLeading` 이라 적고 코드가 `icon` 이어도, 스펙만 보는 검사는 통과시킨다. 오늘의 A1·A2 가 정확히 이 유형이다 — 그래서 §6.2 D7b 가 필요하다.
- `a11y` 블록과 `anatomy` 블록은 형제이며 서로 겹치지 않는다. `a11y` 는 role·키보드 경로를, `anatomy` 는 조각의 이름과 노출 형태를 기록한다.

### 6.2 `scripts/docs-check.mjs` 에 D7 추가 — 세 방향

| 하위 ID | 검사 | 잡는 것 | 못 잡는 것 |
|:-:|---|---|---|
| **D7a** | `specs/*.json` 의 `anatomy.parts[].name` 이 **이 문서 부록 A** 에 있는가. 어휘 인덱스를 `docs/ANATOMY.md` 에서 파싱한다 | 새 파트 이름을 조용히 만드는 것 | 코드. 스펙이 코드와 어긋나면 조용히 통과 |
| **D7b** | `src/components/**` 의 `export interface *Props` 안에서 **파트로 보이는 prop 이름**만 골라 어휘와 대조. 후보 패턴: `icon*` · `badge*` · `label` · `text` · `close*` · `arrow*` · `*Leading` · `*Trailing` | **오늘의 A1~A5 다섯 건 전부.** 코드가 진실이므로 세 검사 중 가장 강하다 | 정규식이 TS 를 파싱하지 못한다 — 여러 줄에 걸친 유니온·조건부 타입·`Omit<…>` 로 상속된 prop 은 놓친다 |
| **D7c** | 금칙어 — `iconLeft`·`iconRight`·`leftIcon`·`rightIcon`·`startIcon`·`endIcon` 이 `src/**` 에 등장하면 실패 | 새 코드가 물리 방향 어휘로 되돌아가는 것 | 이미 있는 이름의 오용. **오늘 red 0 — 가드다** |

`start`/`end` 도 금칙어에 넣는 이유: 그 자체는 RTL 안전하지만(CSS 논리 속성이 쓰는 어휘다) 이 저장소는 `Leading`/`Trailing` 을 골랐다. **두 어휘를 섞지 않기 위해서**이지 `start`/`end` 가 틀려서가 아니다.

D7 은 기존 `scripts/docs-check.mjs`(D1–D6)에 얹는다. 그 스크립트는 이미 의존성 없는 Node 스크립트이고 각 검사의 **못 잡는 것**을 자기 안에 목록으로 들고 있으므로, D7 도 같은 형식으로 한계를 함께 등록한다.

### 6.3 JSDoc `@anatomy` 컨벤션

```tsx
/**
 * 세로 내비게이션 항목.
 *
 * @anatomy Item > Ring · Overlay · Icon(iconLeading) · Label(children) · Badge(badgeLabel) · Dot(badgeDot)
 */
```

- **잡는 것:** 자동으로는 **아무것도 잡지 못한다.** 읽는 사람에게 파트 구조를 한 줄로 준다. `/frontend-review` 와 `/verify` 의 "읽고 판단" 항목에서만 효력이 있다.
- **기계로 잡을 수 있는 것 하나:** 태그의 **존재 여부**. 컴포넌트 파일마다 `@anatomy` 가 1개 이상 있는가는 정규식으로 판정된다(D7d 후보). 내용의 정확성은 여전히 못 잡는다.
- 그래도 두는 이유: 파트 목록이 스펙 JSON 에만 있으면 코드를 고치는 사람이 그것을 보지 않는다. 어휘를 **고치는 자리 옆에** 둬야 한다.

### 6.4 세 수단을 다 합쳐도 남는 것

**파트 이름이 옳은지는 아무도 판정하지 못한다.** `Knob` 을 `Nub` 이라 불러도 D7a·D7b·D7c 는 전부 통과한다 — 부록 A 에 `Nub` 을 등록하면 그만이기 때문이다. 검사가 판정하는 것은 "어휘표와 코드가 일치하는가"이지 "어휘표가 옳은가"가 아니다.

그래서 §5.2 의 확장은 **승인 대상**이고, §5.3 의 예외와 같은 규율을 받는다:

- 확장과 예외는 **줄이기만 한다.**
- 늘려야 하는 순간이 곧 승인을 받아야 하는 시점이다(원칙 8, [DESIGN_PRINCIPLES.md §F](./DESIGN_PRINCIPLES.md#f-디자인-판단의-기초-원칙-meta)).
- 같은 확장 요청이 3회 반복되면 어휘표가 아니라 **§1 의 분류 자체**를 고칠 신호다.

반복되는 이탈은 [DEVIATIONS.md](./DEVIATIONS.md) 에 기록한다.

---

## 부록 A — 어휘 인덱스

알파벳순. **상태** 열: `표준` = §1 정의 · `확장` = §5.2 에서 추가 · `예약` = 정의는 있으나 사용처 0(미검증).
이 표는 §6.2 D7a 가 파싱하는 대상이므로 **행 형식을 바꾸지 않는다.**

| 파트 | 분류 | 상태 | 대표 사용처 |
|---|---|:-:|---|
| `Action` | 인터랙션 | 표준 | `Callout.Action` |
| `Anchor` | 인터랙션 | 확장 | `Callout.Anchor` |
| `Arrow` | 장식·시그널 | 표준 | `Callout.Arrow` · `Tooltip.Content` 의 `hasArrow` |
| `Badge` | 장식·시그널 | 표준 | `NavVertical.Item` 의 `badgeLabel` · `BadgeLabel` |
| `Chevron` | 장식·시그널 | 확장 | `NavVertical.Group` |
| `Close` | 인터랙션 | 표준 | `Callout.Close` · Chip 3종의 `onClose` |
| `Container` | 구조 | 예약 | — |
| `Content` | 구조 | 표준 | `Callout.Content` · `Tooltip.Content` |
| `Counter` | 텍스트 | 예약 | 개념만: `BadgeLabel` 의 `nano` |
| `Description` | 텍스트 | 예약 | — |
| `Divider` | 장식·시그널 | 예약 | — |
| `Dot` | 장식·시그널 | 표준 | `BadgeDot` · `NavVertical.Item` 의 `badgeDot` |
| `Group` | 구조 | 표준 | `NavVertical.Group` · `RadioGroup` |
| `HelpText` | 텍스트 | 예약 | — |
| `Indicator` | 장식·시그널 | 표준 | Tab 활성 밑줄 |
| `Item` | 인터랙션 | 표준 | `NavVertical.Item` · `SegmentBar.Item` · `Tab.Item` |
| `Knob` | 장식·시그널 | 확장 | `Switch` |
| `Label` | 텍스트 | 표준 | `NavVertical.Group` 의 `label` |
| `Overlay` | 장식·시그널 | 표준 | `State overlay` 주석 18곳 |
| `Placeholder` | 텍스트 | 예약 | — |
| `Rail` | 구조 | 확장 | `SegmentBar` |
| `Ring` | 장식·시그널 | 표준 | `Focus ring` 주석 16곳 |
| `Root` | 구조 | 표준 | `CalloutRoot` · `NavVerticalRoot` · `SegmentBarRoot` · `TooltipRoot` |
| `Shimmer` | 장식·시그널 | 확장 | `SkeletonBlock` |
| `Spinner` | 장식·시그널 | 표준 | Button 4종 · TextButton 의 `loading` |
| `Thumb` | 장식·시그널 | 확장 | `Switch`(Radix 가 정한 이름) |
| `Track` | 장식·시그널 | 확장 | `Switch` |
| `Trigger` | 인터랙션 | 표준 | `Tooltip.Trigger` |
| `Visual` | 장식·시그널 | 확장 | `Checkbox` · `Radio` |

### 위치 수식어

| 수식어 | 축 | 사용 |
|---|---|---|
| `Leading` | 가로(읽기 방향 시작) | `iconLeading` — 5개 컴포넌트 |
| `Trailing` | 가로(읽기 방향 끝) | `iconTrailing` — 5개 컴포넌트 |
| `Top` / `Bottom` | 세로 | 예약 — 사용처 0 |

### 금지 어휘

| 쓰지 않는다 | 대신 | 이유 |
|---|---|---|
| `iconLeft` · `leftIcon` · `iconRight` · `rightIcon` | `iconLeading` · `iconTrailing` | RTL 에서 이름이 거짓이 된다(§1.5) |
| `startIcon` · `endIcon` | `iconLeading` · `iconTrailing` | RTL 안전하지만 **어휘를 섞지 않기 위해** |
| `Wrapper` · `Inner` · `Box` | (노출하지 않는다) | 내부 래퍼는 파트가 아니다(§1.6) |
| `badge`(boolean) | `badgeDot` | 내용 유무로 Badge 와 Dot 이 갈린다(§1.4) |
