---
name: frontend-review
description: "디자인 시스템 컴포넌트 코드 품질 리뷰 — React 성능, 클린 코드, 안티패턴 검사"
argument-hint: "[ComponentName?]"
---

# Frontend Review — 컴포넌트 코드 품질 리뷰

디자인 시스템 컴포넌트의 코드 품질을 체계적으로 리뷰한다.
`/verify`(디자인 시스템 컴플라이언스)를 통과한 컴포넌트를 대상으로 React 엔지니어링 패턴을 점검한다.
토큰/CVA/파일 구조/접근성은 CLAUDE.md와 docs/에서 다루므로, 이 스킬은 **React 성능, 클린 코드, 안티패턴**에 집중한다.

**입력**: `$ARGUMENTS` = 컴포넌트명 (선택). 없으면 최근 변경된 컴포넌트를 대상으로 한다.

---

## 리뷰 워크플로

1. 대상 컴포넌트 소스 파일 읽기
2. 아래 3개 섹션(성능 / 클린 코드 / 안티패턴)으로 검사
3. 결과 리포트 출력

### 출력 형식

```markdown
## Review: {ComponentName}

### Performance (X issues)
- Line NN: [규칙명] — 설명 + 수정 방향

### Code Quality (X issues)
- Line NN: [규칙명] — 설명 + 수정 방향

### Anti-patterns (X issues)
- Line NN: [안티패턴명] — 설명 + 올바른 패턴

### OK
- [이상 없는 카테고리 목록]
```

---

## A. 엔지니어링 원칙

리뷰 시 판단 기준이 되는 핵심 원칙:

| 원칙 | 설명 |
|------|------|
| **최소 추상화** | 3줄 중복이 조기 추상화보다 낫다. 모든 소비자가 자연스럽게 맞을 때만 추상화 |
| **명시적 의존성** | 암묵적 전역 상태 금지. 의존성은 파라미터/props/Context로 명시 전달 |
| **네이밍 정밀성** | 이름만 보고 역할 파악 가능. 도메인 특화명 vs 범용명 구분 |
| **단일 표현 방식** | 같은 작업에 여러 방식 혼용 금지. cn() 객체 문법으로 통일 |
| **복잡성은 인프라가 흡수** | 소비자에게 CSS/레이아웃 명세 이해를 전가하지 않음. 컴포넌트가 캡슐화 |

---

## B. React 성능 규칙

> 출처: [Vercel React Best Practices](https://vercel.com/blog/introducing-react-best-practices) 기반, 디자인 시스템 라이브러리에 해당하는 규칙만 추출.

### B-1. Re-render 최적화

**[RR-01] Derived State — 렌더 중 계산**

props/state에서 파생 가능한 값은 state에 저장하지 않고 렌더링 중 계산한다.

```tsx
// ❌ useEffect로 파생 상태
const [filtered, setFiltered] = useState([])
useEffect(() => { setFiltered(items.filter(f)) }, [items])

// ✅ 렌더 중 계산
const filtered = items.filter(f)
```

**[RR-02] Functional setState — stale closure 방지**

이전 상태 기반 업데이트는 함수형 `prev =>` 사용.

```tsx
// ❌ stale closure 위험
setCount(count + 1)

// ✅ 함수형 업데이트
setCount(prev => prev + 1)
```

**[RR-03] Lazy State Init — 비싼 초기값**

`useState`에 함수를 전달하여 초기값 계산을 최초 렌더에만 실행.

```tsx
// ❌ 매 렌더마다 실행
const [data] = useState(expensiveComputation())

// ✅ 최초 렌더에만 실행
const [data] = useState(() => expensiveComputation())
```

**[RR-04] React.memo — 변하는 부모, 안정적 자식**

자주 리렌더되는 부모 아래의 변하지 않는 자식을 `React.memo`로 분리.

```tsx
const StableChild = React.memo(function StableChild({ label }: { label: string }) {
  return <span>{label}</span>
})
```

**[RR-05] Memo Default Values — 모듈 레벨 상수**

`memo` 컴포넌트의 props 기본값은 모듈 레벨에 선언. 인라인 객체/배열은 매 렌더 새 참조 생성.

```tsx
// ❌ 매 렌더 새 객체 → memo 무효화
function List({ items = [] }) { ... }

// ✅ 모듈 레벨 상수
const DEFAULT_ITEMS: Item[] = []
function List({ items = DEFAULT_ITEMS }) { ... }
```

**[RR-06] Side Effect → Event Handler**

side effect는 `useEffect` 대신 이벤트 핸들러에 배치. Effect는 동기화(sync)용.

```tsx
// ❌ Effect에서 side effect
useEffect(() => { analytics.track('open') }, [isOpen])

// ✅ 이벤트 핸들러에서
const handleOpen = () => { setIsOpen(true); analytics.track('open') }
```

**[RR-07] Defer Reads — 상태 읽기를 하위로 위임**

상태를 읽는 지점을 실제 사용하는 하위 컴포넌트로 이동. 불필요한 부모 리렌더 방지.

```tsx
// ❌ 부모가 모든 상태 읽기
function Parent() {
  const value = useContext(MyCtx) // 부모 전체 리렌더
  return <Child value={value} />
}

// ✅ 자식이 직접 읽기
function Child() {
  const value = useContext(MyCtx) // 자식만 리렌더
  return <span>{value}</span>
}
```

**[RR-08] Effect Dependencies — 원시값으로 좁히기**

effect 의존성에 전체 객체 대신 필요한 원시값만 포함.

```tsx
// ❌ 객체 참조 → 불필요한 effect 재실행
useEffect(() => { ... }, [config])

// ✅ 필요한 값만
useEffect(() => { ... }, [config.size, config.variant])
```

**[RR-09] useRef — 렌더 무관 값**

타이머 ID, 이전 값, DOM 참조 등 렌더링에 영향 없는 값은 `useRef`.

```tsx
const timerRef = useRef<number | null>(null)
const pointerRef = useRef(false) // 마우스/키보드 포커스 구분 등
```

**[RR-10] useTransition — 비긴급 업데이트**

긴급하지 않은 상태 업데이트(필터링, 정렬 등)는 `useTransition`으로 래핑.

```tsx
const [isPending, startTransition] = useTransition()
const handleFilter = (query: string) => {
  startTransition(() => setFilteredItems(items.filter(...)))
}
```

**[RR-11] Simple Expressions — useMemo 불필요**

단순 계산(`a + b`, `arr.length`)에 `useMemo`는 오버헤드만 추가.

```tsx
// ❌ 과도한 메모이제이션
const total = useMemo(() => a + b, [a, b])

// ✅ 그냥 계산
const total = a + b
```

### B-2. 렌더링

**[RD-01] 명시적 조건부 렌더링**

`{count && <span>}` 금지 — `count`가 0이면 `0`이 렌더됨.

```tsx
// ❌ falsy 값 렌더 위험
{count && <Badge>{count}</Badge>}

// ✅ 명시적 비교
{count > 0 && <Badge>{count}</Badge>}
```

**[RD-02] 정적 JSX Hoist**

렌더마다 변하지 않는 JSX는 컴포넌트 바깥 모듈 레벨에 선언.

```tsx
// ✅ 모듈 레벨에 hoist
const PLACEHOLDER = <span className="text-semantic-text-on-bright-500">선택하세요</span>

function Select() {
  return hasValue ? <Value /> : PLACEHOLDER
}
```

**[RD-03] SVG Animate Wrapper**

SVG 애니메이션은 SVG 자체가 아닌 wrapper div에 적용. SVG에 직접 transform하면 레이아웃 깨짐 가능.

```tsx
// ✅ wrapper에 애니메이션
<div className="animate-spin"><SpinnerSVG /></div>
```

### B-3. JS 성능

**[JS-01] Early Return**

조건 불만족 시 즉시 반환. 중첩 if 감소.

```tsx
// ❌ 깊은 중첩
if (isValid) { if (hasPermission) { doWork() } }

// ✅ early return
if (!isValid) return
if (!hasPermission) return
doWork()
```

**[JS-02] toSorted — 불변 정렬**

`.sort()`는 원본 배열을 변경. React 상태에서는 `.toSorted()` 사용.

```tsx
// ❌ 원본 변경
const sorted = items.sort((a, b) => a.order - b.order)

// ✅ 새 배열 반환
const sorted = items.toSorted((a, b) => a.order - b.order)
```

**[JS-03] Set/Map Lookup**

반복 `includes()` 대신 `Set.has()` 사용 (O(n) → O(1)).

```tsx
// ❌ O(n) 반복 검색
const isSelected = selectedIds.includes(id)

// ✅ O(1) 검색
const selectedSet = new Set(selectedIds)
const isSelected = selectedSet.has(id)
```

**[JS-04] RegExp Hoist**

함수 내 RegExp 리터럴은 매 호출마다 재컴파일. 모듈 레벨로 hoist.

```tsx
// ❌ 매 호출 재컴파일
function validate(input: string) { return /^[a-z]+$/i.test(input) }

// ✅ 모듈 레벨
const ALPHA_REGEX = /^[a-z]+$/i
function validate(input: string) { return ALPHA_REGEX.test(input) }
```

### B-4. 고급

**[ADV-01] Event Handler Ref — 안정적 구독**

이벤트 핸들러를 ref에 저장하여 effect 재실행 방지. 항상 최신 핸들러를 참조하면서 effect는 재실행되지 않음.

```tsx
const handlerRef = useRef(onValueChange)
handlerRef.current = onValueChange

useEffect(() => {
  element.addEventListener('change', (...args) => handlerRef.current(...args))
  return () => element.removeEventListener('change', ...)
}, []) // 의존성 없음 — 재실행 방지
```

**[ADV-02] Module-level Init Guard — 1회 초기화**

앱/라이브러리 전역 초기화는 `useEffect([])` 대신 모듈 레벨 guard.

```tsx
// ✅ 모듈 레벨 1회 초기화
let initialized = false
function initOnce() {
  if (initialized) return
  initialized = true
  // 초기화 로직
}
```

---

## C. 클린 코드 원칙

> CLAUDE.md의 TypeScript/스타일 컨벤션과 겹치지 않는 원칙만 포함.

### [CC-01] 단일 책임 (SRP)
- 한 컴포넌트는 한 가지 역할만
- 200~300줄 이상이면 분리 고려
- 비즈니스 로직과 UI 렌더링을 별도 hook/컴포넌트로 분리

### [CC-02] 순수 함수 + 불변 데이터
- 부작용 없는 함수 지향
- 직접 수정 금지 → 새 객체/배열 생성 (`.toSorted()`, spread operator)
- State 업데이트 시 새 참조 생성

### [CC-03] Early Return
- 조건 불만족 시 즉시 반환으로 중첩 감소
- guard clause 패턴 적극 활용

### [CC-04] Hook 규칙
- Hook은 **반드시** 최상위에서만 호출 (조건문/반복문 안 금지)
- `useEffect` 의존성 배열에 모든 외부 값 포함
- `useEffect`에서 cleanup 함수 반환 (타이머, 구독, ResizeObserver 등)
- 복잡한 hook은 작은 단위로 분리 후 합성 (Hook Composition)

---

## D. 안티패턴 체크리스트

> 디자인 시스템 라이브러리에 해당하는 항목만 추출.

| # | 안티패턴 | 올바른 패턴 |
|---|----------|------------|
| 1 | `as` 타입 캐스팅으로 렌더링 분기 | 타입 가드 함수 사용 (→ 패턴 E-1) |
| 2 | TS `enum` 사용 | `as const` 배열 + 타입 추출 (CLAUDE.md "Variant Metadata Export") |
| 3 | Prop drilling 3단계 이상 | Context로 상태 전파 (예: FormField 패턴) |
| 4 | 인라인 이벤트 핸들러 (복잡한 로직) | `handle` 접두사 함수로 분리 |
| 5 | `cn()` 안에서 `&&` 패턴 (`isActive && 'class'`) | 객체 문법 `{ 'class': isActive }` |
| 6 | `cn()` 안에서 삼항 (`isActive ? 'a' : 'b'`) | 객체 문법 `{ 'a': isActive, 'b': !isActive }` |
| 7 | className을 별도 변수로 분리 | `className` prop에 `cn()` 인라인 |
| 8 | 배열+join/템플릿 리터럴로 className 조합 | `cn()` 함수 사용 |
| 9 | `disabled`로 read-only 표현 | `readOnly` prop 추가 구분 (pointer-events-none, opacity 유지) |
| 10 | Skeleton이 로드 상태와 다른 공간 차지 | Root/Skeleton 모두 동일 크기 규칙. 레이아웃 시프트 방지 |
| 11 | 컴포넌트명에 특정 도메인 포함 (`MetricBadge`) | 범용 이름 사용 (`Badge`). 역할이 범용이면 이름도 범용 |
| 12 | 2~3곳에서만 쓰는 상수를 별도 `constants.ts` 분리 | 주 소비자에 인라인 + export. 파일 수 최소화 |
| 13 | CSS 렌더링 트릭으로 시각적 결함 해결 | DOM 구조로 근본 수정 (native anti-aliasing 활용) |
| 14 | 대부분 사용처에 맞추고 나머지는 escape hatch | 모든 사용처가 자연스러울 때만 추상화. override 필요 시 보류 |
| 15 | 복잡한 hook을 단일 파일에 모두 작성 | 관심사별 분리 후 합성 (→ 패턴 E-2) |

---

## E. 패턴

### E-1. Discriminated Union + Type Guard

```tsx
// 판별 필드로 타입 분기
type Notification = InfoNotification | ErrorNotification | WarningNotification

interface InfoNotification extends BaseNotification {
  kind: 'info'
}

interface ErrorNotification extends BaseNotification {
  kind: 'error'
  errorCode: string
}

// 타입 가드 함수
function isErrorNotification(n: Notification): n is ErrorNotification {
  return n.kind === 'error'
}

// ✅ 안전한 narrowing
if (isErrorNotification(notification)) {
  console.log(notification.errorCode) // 타입 안전
}
```

**적용 기준**:
- `as` 캐스팅으로 분기하고 있으면 이 패턴으로 교체
- 판별 필드는 string literal로 명확히 구분
- 공통 필드는 Base interface에, 분기별 필드는 각 interface에

### E-2. Hook Composition

```tsx
// 복잡한 hook → 작은 단위로 분리 후 합성
function useTabNavigation(tabCount: number) {
  const { activeIndex, setActiveIndex } = useActiveTab()
  const { handleKeyDown } = useKeyboardNav({ tabCount, activeIndex, setActiveIndex })
  const { indicatorStyle } = useIndicator({ activeIndex })

  return { activeIndex, setActiveIndex, handleKeyDown, indicatorStyle }
}
```

**분리 기준**:
- 각 hook이 하나의 관심사만 담당
- hook 간 의존성은 파라미터/콜백으로 명시적 전달
- 최상위 hook은 조합만 수행, 직접 로직 최소화

---

## 참조

이 스킬이 다루지 않는 영역의 참조:

| 영역 | 참조 문서 |
|------|----------|
| 토큰/CVA/cn 컨벤션 | CLAUDE.md "Styling Rules" |
| TypeScript 컨벤션 | CLAUDE.md "TypeScript Conventions" |
| 컴포넌트 파일 구조 | CLAUDE.md "File Structure" |
| 컴포넌트 체크리스트 | docs/COMPONENT_CHECKLIST.md |
| CVA+cn, Icon, Loading, asChild 패턴 | docs/COMPONENT_PATTERNS.md |
| Compound Component, Context, Hook | docs/ADVANCED_PATTERNS.md |
| 접근성, 인터랙션 | docs/INTERACTION_DESIGN.md |
