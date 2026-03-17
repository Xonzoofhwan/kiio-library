# Advanced Component Patterns

> 이 문서는 복합 컴포넌트(Modal, Dropdown, Tabs 등) 구현 시 참고할 고급 패턴을 정리한다.
> 단일 컴포넌트 패턴(CVA + cn, Icon, Loading, asChild)은 [CLAUDE.md](../CLAUDE.md)의 "Common Component Patterns" 참고.

---

## 목차

- [A. Compound Component 패턴](#a-compound-component-패턴)
- [B. Context 분리 패턴](#b-context-분리-패턴)
- [C. 커스텀 훅 추출 패턴](#c-커스텀-훅-추출-패턴)
- [D. 복합 컴포넌트 파일 구조](#d-복합-컴포넌트-파일-구조)
- [E. Children 분석 패턴](#e-children-분석-패턴)
- [F. Controlled Component 패턴](#f-controlled-component-패턴)
- [G. 테스트 구조 패턴](#g-테스트-구조-패턴)
- [H. Storybook 스토리 패턴](#h-storybook-스토리-패턴)
- [I. 타입 설계 패턴](#i-타입-설계-패턴)
- [J. Form Context 상태 전파 패턴](#j-form-context-상태-전파-패턴)

---

## A. Compound Component 패턴

### 언제 사용하는가

| 조건 | 단일 컴포넌트 | Compound 컴포넌트 |
|------|:---:|:---:|
| 서브컴포넌트 2개 이상 | | O |
| 서브컴포넌트 간 상태 공유 필요 | | O |
| 사용자가 구조를 제어해야 함 | | O |
| Props로 모든 것을 전달 가능 | O | |
| 내부 레이아웃이 고정적 | O | |

**예시**: Button → 단일, Modal/Dialog → Compound, Tabs → Compound, Badge → 단일

### 패턴 구조

```tsx
// Dialog.tsx

// ─── Root ───
export interface DialogRootProps {
  children: React.ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
}

function DialogRoot({ children, open, onOpenChange }: DialogRootProps) {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  )
}

// ─── Trigger ───
export interface DialogTriggerProps {
  children: React.ReactNode
  asChild?: boolean
}

function DialogTrigger({ children, asChild = false }: DialogTriggerProps) {
  const { onOpenChange } = useDialogContext()
  const Comp = asChild ? Slot : 'button'
  return <Comp onClick={() => onOpenChange(true)}>{children}</Comp>
}

// ─── Content ───
export interface DialogContentProps {
  children: React.ReactNode
  className?: string
}

function DialogContent({ children, className }: DialogContentProps) {
  const { open } = useDialogContext()
  if (!open) return null
  return (
    <div className={cn('fixed inset-0 z-50 flex items-center justify-center', className)}>
      {children}
    </div>
  )
}

// ─── Compound Export ───
export const Dialog = Object.assign(DialogRoot, {
  Trigger: DialogTrigger,
  Content: DialogContent,
  Close: DialogClose,
})
```

### 사용법 (Dot notation)

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <Dialog.Trigger>
    <Button>열기</Button>
  </Dialog.Trigger>
  <Dialog.Content>
    <h2>제목</h2>
    <p>내용</p>
    <Dialog.Close />
  </Dialog.Content>
</Dialog>
```

### Radix Primitive 래핑 패턴

Radix UI 프리미티브를 기반으로 할 때, 프리미티브를 직접 노출하지 않고 래핑하여 우리 디자인 시스템의 스타일과 동작을 강제한다.

```tsx
import * as PopoverPrimitive from '@radix-ui/react-popover'

function TooltipContent({
  children,
  side = 'bottom',
  sideOffset = 8,
  className,
  ...props
}: TooltipContentProps) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        className={cn(
          'bg-sys-neutral-solid-950 text-sys-text-on-dim-900',
          'rounded-2 px-3 py-2 typography-14-medium',
          className,
        )}
        side={side}
        sideOffset={sideOffset}
        {...props}
      >
        {children}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  )
}
```

**원칙**:
- Radix의 `className`을 우리 sys 토큰으로 고정
- `side`, `sideOffset` 등 레이아웃 props는 기본값을 설정하되 오버라이드 허용
- `...props`로 Radix의 나머지 기능(이벤트 핸들러 등)은 그대로 패스스루

### Radix Primitive 래핑 3단계 판단

| 단계 | 조건 | 방법 | 예시 |
|------|------|------|------|
| **FULL WRAP** | 커스텀 스타일 + 기본 props + 동작 제약 필요 | sys-token 스타일 강제, 기본값 설정, aria 추가 | Dialog, Popover, Tooltip |
| **PARTIAL WRAP** | 일부 서브컴포넌트만 커스텀 필요 | 변경 필요한 것만 래핑, 나머지 re-export | Accordion (Content만 래핑, Trigger는 그대로) |
| **SKIP** | 프리미티브가 이미 DS 요구사항 충족 | 타입 좁히기만 하고 re-export | Slot (asChild 패턴에서 직접 사용 중) |

**판단 순서**: SKIP 가능한가? → PARTIAL로 충분한가? → FULL WRAP

---

## B. Context 분리 패턴

### 언제 분리하는가

- 서브컴포넌트가 2개 이상이고 공유 상태가 있을 때 → **분리**
- 상태가 단순하고 서브컴포넌트가 1~2개일 때 → props 전달로 충분

### 파일 구조

```
ComponentContext.tsx
```

```tsx
// DialogContext.tsx
import { createContext, useContext } from 'react'

export type DialogVariant = 'default' | 'danger'

interface DialogContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
  variant: DialogVariant
}

export const DialogContext = createContext<DialogContextValue | null>(null)

export function useDialogContext() {
  const context = useContext(DialogContext)
  if (!context) {
    throw new Error('useDialogContext must be used within <Dialog>')
  }
  return context
}
```

**핵심 규칙**:
- 기본값을 `null`로 설정하고 커스텀 훅에서 `null` 체크
- 타입 union(예: `DialogVariant`)은 Context 파일에서 정의하고 re-export
- 커스텀 훅 이름: `use{Component}Context`

### Context null 처리: 2가지 전략

| 전략 | 언제 사용 | 패턴 | 예시 |
|------|----------|------|------|
| **THROW** | 서브컴포넌트가 부모 없이 의미 없을 때 | `if (!ctx) throw new Error(...)` | Dialog.Trigger, Tabs.Panel |
| **FALLBACK** | 독립 사용 가능하되, Context가 기본값/오버라이드 제공 | `return useContext(Ctx)` (null 허용) | Input (단독 or FormField 내) |

**THROW 패턴** (위 예시와 동일):
```tsx
export function useDialogContext() {
  const context = useContext(DialogContext)
  if (!context) throw new Error('useDialogContext must be used within <Dialog>')
  return context
}
```

**FALLBACK 패턴** (Form 컴포넌트에 적합):
```tsx
// Context 없으면 null 반환 — 소비자가 null 체크
export function useFormField() {
  return useContext(FormFieldContext)  // null = 독립 사용
}

// 사용 시
function Input({ disabled: disabledProp, ...props }: InputProps) {
  const field = useFormField()  // null이면 standalone
  const disabled = disabledProp ?? field?.disabled
  // ...
}
```

**판단 기준**: 해당 컴포넌트가 Provider 없이 단독으로 사용될 수 있는가? → YES면 FALLBACK, NO면 THROW

---

## C. 커스텀 훅 추출 패턴

### 언제 추출하는가

| 조건 | 훅 추출 | 인라인 유지 |
|------|:---:|:---:|
| 로직이 여러 컴포넌트에서 재사용됨 | O | |
| 트리거 모드가 다양함 (mount, scroll, state 등) | O | |
| 로직이 해당 컴포넌트에서만 사용됨 | | O |
| 상태 + 이펙트가 3개 이하 | | O |

### 기본 패턴

```tsx
// useComponentTrigger.ts
import { useCallback, useEffect, useState } from 'react'

interface UseTooltipTriggerOptions {
  delay?: number
  closeOnScroll?: boolean
}

interface UseTooltipTriggerReturn {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function useTooltipTrigger(
  options: UseTooltipTriggerOptions = {},
): UseTooltipTriggerReturn {
  const { delay = 0 } = options
  const [open, setOpen] = useState(false)

  const onOpenChange = useCallback((next: boolean) => {
    setOpen(next)
  }, [])

  useEffect(() => {
    if (!delay) return
    const timer = setTimeout(() => setOpen(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return { open, onOpenChange }
}
```

### 고급: 모드별 조건부 반환 타입

트리거 모드에 따라 반환 타입이 달라지는 경우, 제네릭 + conditional types를 활용한다.

```tsx
type TriggerMode = 'onClick' | 'onScroll' | 'onMount'

// 모드별 옵션 타입
type TriggerOptions<T extends TriggerMode> =
  T extends 'onMount' ? { delay?: number } :
  T extends 'onScroll' ? { threshold?: number } :
  never

// 모드별 반환 타입
interface TriggerResultBase {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface TriggerResultWithRef extends TriggerResultBase {
  ref: React.RefObject<HTMLElement | null>
}

type TriggerResult<T extends TriggerMode> =
  T extends 'onScroll' ? TriggerResultWithRef : TriggerResultBase

// 훅 시그니처
export function useTrigger<T extends TriggerMode>(
  mode: T,
  options?: TriggerOptions<T>,
): TriggerResult<T> {
  // 구현...
}

// 사용
const { open, onOpenChange } = useTrigger('onMount', { delay: 500 })
const { open, onOpenChange, ref } = useTrigger('onScroll', { threshold: 0.5 })
//                          ^^^ onScroll일 때만 ref가 반환됨
```

---

## D. 복합 컴포넌트 파일 구조

### 판단 기준

| 복잡도 | 파일 구조 | 예시 |
|--------|----------|------|
| **Simple** | `Component.tsx` + `index.ts` | Button, Badge, Avatar |
| **Medium** | + `ComponentContext.tsx` | Tabs, Accordion |
| **Complex** | + `useComponent.ts` | Modal, Popover, Callout |

### Simple (현재 Button)

```
Button/
├── Button.tsx       # 컴포넌트 + CVA + 타입
└── index.ts         # barrel export
```

### Medium (Context 필요)

```
Tabs/
├── Tabs.tsx         # Root + Trigger + Content + compound export
├── TabsContext.tsx   # Context + useTabsContext + 타입
└── index.ts
```

### Complex (Context + 훅 + 테스트)

```
Modal/
├── Modal.tsx            # Root + Overlay + Content + Title + Close + compound export
├── ModalContext.tsx      # Context + useModalContext + 타입
├── useModalTrigger.ts   # 트리거 로직 (선택)
├── Modal.test.tsx       # 테스트
└── index.ts
```

### index.ts 패턴

```tsx
// Simple
export { Button } from './Button'
export type { ButtonProps } from './Button'

// Compound
export { Modal } from './Modal'
export type {
  ModalRootProps,
  ModalContentProps,
  ModalCloseProps,
  ModalVariant,
} from './Modal'
export { useModalTrigger } from './useModalTrigger'
```

---

## E. Children 분석 패턴

### 언제 사용하는가

- Content 내부에서 자식을 **특정 위치에 배치**해야 할 때 (예: Text는 상단, Action은 하단)
- 자식의 **타입에 따라 레이아웃이 달라질** 때

### 패턴

```tsx
import { Children, isValidElement } from 'react'

function CardContent({ children }: { children: React.ReactNode }) {
  const childArray = Children.toArray(children)

  const header = childArray.find(
    (child) => isValidElement(child) && child.type === CardHeader,
  )
  const body = childArray.find(
    (child) => isValidElement(child) && child.type === CardBody,
  )
  const footer = childArray.find(
    (child) => isValidElement(child) && child.type === CardFooter,
  )

  return (
    <div className="flex flex-col rounded-3 bg-sys-background-0">
      {header && <div className="border-b border-sys-divider-solid-100">{header}</div>}
      {body && <div className="flex-1 p-4">{body}</div>}
      {footer && <div className="border-t border-sys-divider-solid-100 p-3">{footer}</div>}
    </div>
  )
}
```

### 대안: Slot/Prop 기반 접근

Children 분석이 복잡하거나 순서가 중요하지 않으면, **named prop**으로 전달하는 것이 더 단순하다.

```tsx
// Children 분석 대신
<Card
  header={<CardHeader>제목</CardHeader>}
  footer={<CardFooter>하단</CardFooter>}
>
  본문 내용
</Card>
```

**판단 기준**:
| 조건 | Children 분석 | Named Prop |
|------|:---:|:---:|
| 서브컴포넌트 위치가 고정적 | O | |
| 서브컴포넌트가 선택적 (있을 수도 없을 수도) | O | |
| 구조가 단순하고 슬롯이 2개 이하 | | O |
| 컴포넌트 합성이 자유로워야 함 | O | |

---

## F. Controlled Component 패턴

### 언제 사용하는가

- 오버레이(Modal, Popover, Tooltip, Callout) 컴포넌트
- 열림/닫힘 상태를 부모가 관리해야 할 때
- 외부에서 프로그래밍 방식으로 열고 닫아야 할 때

### 기본 패턴: open / onOpenChange

```tsx
export interface ModalRootProps {
  children: React.ReactNode
  /** 열림 상태 (controlled) */
  open: boolean
  /** 열림 상태 변경 콜백 */
  onOpenChange: (open: boolean) => void
}

function ModalRoot({ children, open, onOpenChange }: ModalRootProps) {
  return (
    <ModalContext.Provider value={{ open, onOpenChange }}>
      {children}
    </ModalContext.Provider>
  )
}
```

### Dismiss 동작 추상화

오버레이 컴포넌트가 닫히는 방식을 추상화하면, 사용처에서 동작을 쉽게 제어할 수 있다.

```tsx
type DismissBehavior = 'none' | 'manual' | 'auto'

export interface PopoverRootProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /**
   * 닫기 동작
   * - 'none': 프로그래밍 방식으로만 닫힘
   * - 'manual': ESC / 바깥 클릭 / 닫기 버튼으로 닫힘
   * - 'auto': 지정 시간 후 자동 닫힘 + manual 동작도 포함
   * @default 'manual'
   */
  dismiss?: DismissBehavior
  /** 자동 닫힘 시간(ms). dismiss='auto'일 때만 적용. @default 5000 */
  autoDismissDuration?: number
}
```

### 자동 닫힘 타이머 패턴

```tsx
import { useEffect, useRef } from 'react'

function PopoverRoot({
  open,
  onOpenChange,
  dismiss = 'manual',
  autoDismissDuration = 5000,
}: PopoverRootProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (open && dismiss === 'auto') {
      timerRef.current = setTimeout(() => {
        onOpenChange(false)
      }, autoDismissDuration)
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [open, dismiss, autoDismissDuration, onOpenChange])

  // ...
}
```

### Radix와 함께 사용할 때: 이벤트 차단

`dismiss='none'`일 때 ESC / 바깥 클릭을 차단해야 한다.

```tsx
const handlePointerDownOutside = useCallback(
  (e: Event) => {
    if (dismiss === 'none') e.preventDefault()
  },
  [dismiss],
)

const handleEscapeKeyDown = useCallback(
  (e: KeyboardEvent) => {
    if (dismiss === 'none') e.preventDefault()
  },
  [dismiss],
)

<PopoverPrimitive.Content
  onPointerDownOutside={handlePointerDownOutside}
  onEscapeKeyDown={handleEscapeKeyDown}
/>
```

---

## G. 테스트 구조 패턴

> **Phase 5 예정.** 현재 프로젝트에 테스트 프레임워크(vitest, @testing-library) 미설정. 아래는 도입 시 참고할 패턴.

### 도구

- **vitest** — 테스트 러너
- **@testing-library/react** — 렌더링 + 쿼리
- **@testing-library/user-event** — 사용자 인터랙션 시뮬레이션

### 파일 위치

```
Component/
├── Component.tsx
├── Component.test.tsx   # 컴포넌트와 같은 폴더
└── index.ts
```

### 렌더 헬퍼 함수 패턴

테스트마다 반복되는 렌더링 코드를 헬퍼로 추출한다.

```tsx
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Modal } from './Modal'

const renderModal = (props?: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  variant?: 'default' | 'danger'
}) => {
  const {
    open = true,
    onOpenChange = vi.fn(),
    variant,
  } = props ?? {}

  return render(
    <Modal open={open} onOpenChange={onOpenChange}>
      <Modal.Trigger>
        <button type="button">열기</button>
      </Modal.Trigger>
      <Modal.Content variant={variant}>
        <Modal.Title>제목</Modal.Title>
        <p>본문 내용</p>
        <Modal.Close />
      </Modal.Content>
    </Modal>,
  )
}
```

### describe 그룹핑

행동(behavior) 기준으로 그룹화한다.

```tsx
describe('Modal', () => {
  afterEach(() => cleanup())

  describe('기본 렌더링', () => {
    it('트리거를 렌더링해야 한다', () => { ... })
    it('open=true일 때 콘텐츠가 표시되어야 한다', async () => { ... })
    it('open=false일 때 콘텐츠가 숨겨져야 한다', () => { ... })
  })

  describe('닫기', () => {
    it('닫기 버튼 클릭 시 onOpenChange(false) 호출', async () => { ... })
    it('ESC 키 누르면 onOpenChange(false) 호출', async () => { ... })
    it('바깥 클릭 시 onOpenChange(false) 호출', async () => { ... })
  })

  describe('자동 닫힘', () => {
    it('지정 시간 후 onOpenChange(false) 호출', async () => {
      vi.useFakeTimers()
      // ...
      vi.advanceTimersByTime(5000)
      expect(onOpenChange).toHaveBeenCalledWith(false)
      vi.useRealTimers()
    })
  })

  describe('variant', () => {
    it.each([['default'], ['danger']])('%s variant로 렌더링', async (variant) => {
      renderModal({ variant })
      // ...
    })
  })
})
```

### 테스트 작성 원칙

- **사용자 관점**으로 테스트 (구현 내부가 아닌 행동 테스트)
- `screen.getByRole`, `screen.getByText`로 요소 찾기 (testId 최소화)
- 비동기 UI는 `waitFor` 사용
- 타이머 관련: `vi.useFakeTimers()` / `vi.advanceTimersByTime()` / `vi.useRealTimers()`
- `vi.fn()`으로 콜백 mock

---

## H. Storybook 스토리 패턴

> **Phase 5 예정.** 현재 프로젝트에 Storybook 미설정. 아래는 도입 시 참고할 패턴.

### 파일 위치

```
Component/
├── Component.tsx
├── Component.stories.tsx   # 컴포넌트와 같은 폴더
└── index.ts
```

### meta 설정

```tsx
import { Modal } from './Modal'

const meta = {
  title: 'Components/Overlay/Modal',  // 카테고리/서브카테고리/컴포넌트명
  component: Modal,
  parameters: {
    layout: 'centered',  // 'centered' | 'fullscreen' | 'padded'
  },
  tags: ['autodocs'],  // 자동 문서 생성
}

export default meta
```

### argTypes / args 패턴

```tsx
interface DefaultArgs {
  variant: 'default' | 'danger'
  showClose: boolean
  showOverlay: boolean
}

export const Default = {
  argTypes: {
    variant: { control: 'select', options: ['default', 'danger'] },
    showClose: { control: 'boolean' },
    showOverlay: { control: 'boolean' },
  },
  args: {
    variant: 'default',
    showClose: true,
    showOverlay: true,
  },
  render: (args: DefaultArgs) => {
    const [open, setOpen] = useState(true)
    return (
      <Modal open={open} onOpenChange={setOpen}>
        {/* args를 사용해 조건부 렌더링 */}
      </Modal>
    )
  },
}
```

### 스토리 변형 컨벤션

| 스토리 이름 | 용도 |
|------------|------|
| `Default` | 기본 상태 + argTypes 컨트롤러 |
| `AllVariants` | 모든 variant를 한 화면에 나열 |
| `WithFeature` | 특정 기능이 켜진 상태 (예: WithAction, WithShadow) |
| `AllSides` / `AllSizes` | 모든 방향/크기 변형 나열 |
| `InteractiveState` | 특정 인터랙션 상태 (예: NonDismissable, AutoDismiss) |

---

## I. 타입 설계 패턴

### 서브컴포넌트별 Props

Compound 컴포넌트의 각 서브컴포넌트마다 별도 interface를 정의하고 export한다.

```tsx
// 전부 export — 소비자가 래핑할 때 필요
export interface ModalRootProps { ... }
export interface ModalContentProps { ... }
export interface ModalTriggerProps { ... }
export interface ModalCloseProps { ... }
```

### Variant 타입 독립 정의

variant union은 Context 파일에서 정의하고, 컴포넌트 파일에서 re-export한다.

```tsx
// ModalContext.tsx
export type ModalVariant = 'default' | 'danger'

// Modal.tsx
export type { ModalVariant } from './ModalContext'
```

**이유**: variant 타입을 Context와 컴포넌트 양쪽에서 사용하므로, 한 곳에서 정의하고 re-export하는 것이 DRY.

### Radix Primitive 타입 확장

Radix 프리미티브를 래핑할 때, `ComponentPropsWithoutRef`로 프리미티브의 props를 상속받되 `Omit`으로 우리가 고정하는 props를 제외한다.

```tsx
import { type ComponentPropsWithoutRef } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'

export interface ModalContentProps
  extends Omit<
    ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    'className'  // 우리가 내부적으로 관리하는 props는 제외
  > {
  variant?: ModalVariant
  className?: string  // 재정의 (필요 시)
}
```

**핵심**:
- `ComponentPropsWithoutRef` — ref를 제외한 프리미티브 props 상속 (React 19에서는 ref가 일반 prop이므로, Radix가 아직 forwardRef 기반이면 이 타입 사용)
- `Omit<..., 'avoidCollisions' | 'className'>` — 내부에서 고정하는 props를 인터페이스에서 제거
- 제거한 props 중 사용자에게 노출할 것은 다시 선언

### Callback Props 타입

이벤트 핸들러는 원래 DOM 이벤트 타입을 유지하되, 단순화가 필요하면 `() => void`로 축소한다.

```tsx
export interface ModalActionProps
  extends Omit<ComponentPropsWithoutRef<'button'>, 'onClick'> {
  onClick?: () => void         // DOM의 MouseEvent 대신 단순화
  closeOnClick?: boolean       // 추가 동작
}
```

---

## 패턴 선택 가이드 (요약)

컴포넌트 구현 전 아래 질문으로 어떤 패턴 조합이 필요한지 판단한다.

```
1. 서브컴포넌트가 2개 이상인가?
   → Yes: Compound 패턴 (A) + Context (B) + 파일 분리 (D)
   → No: 단일 컴포넌트 (CLAUDE.md Pattern 1)

2. 열림/닫힘 상태가 있는가?
   → Yes: Controlled 패턴 (F)
   → 자동 닫힘 필요?: Dismiss 추상화 (F)

3. 트리거 로직이 복잡하거나 재사용 가능한가?
   → Yes: 커스텀 훅 추출 (C)

4. 자식의 위치를 컴포넌트가 결정해야 하는가?
   → Yes (3개 이상 슬롯): Children 분석 (E)
   → Yes (2개 이하 슬롯): Named prop

5. Radix 프리미티브를 기반으로 하는가?
   → Yes: Radix 래핑 (A 하단) + 타입 확장 (I)

6. 폼 입력 컴포넌트인가?
   → Yes: Form Context 전파 (J) + FALLBACK 전략 (B)
```

---

## J. Form Context 상태 전파 패턴

### 언제 사용하는가

폼 입력 컴포넌트(Input, Select, Textarea, Checkbox 등)가 `FormField` 래퍼 안에서 error/disabled/required 상태와 aria 속성을 **자동으로** 공유해야 할 때.

### FormField Context 구조

```tsx
// FormFieldContext.tsx
import { createContext, useContext, useId } from 'react'

interface FormFieldContextValue {
  /** 자동 생성 ID — label과 input을 연결 */
  id: string
  /** 에러 메시지 (있을 때만) */
  error?: string
  /** 모든 자식에게 전파되는 disabled 상태 */
  disabled?: boolean
  /** 모든 자식에게 전파되는 required 상태 */
  required?: boolean
  /** aria-describedby 대상 ID (에러 메시지 영역) */
  describedBy?: string
}

const FormFieldContext = createContext<FormFieldContextValue | null>(null)

/**
 * FormField Context 소비 훅.
 * FALLBACK 전략: Context 없으면 null 반환 → 독립 사용 가능.
 */
export function useFormField() {
  return useContext(FormFieldContext)
}
```

### FormField 컴포넌트

```tsx
// FormField.tsx
import { useId } from 'react'
import { cn } from '@/lib/utils'

interface FormFieldProps {
  children: React.ReactNode
  /** 에러 메시지 */
  error?: string
  /** 모든 자식 입력을 disabled 처리 */
  disabled?: boolean
  /** 모든 자식 입력을 required 처리 */
  required?: boolean
  className?: string
}

export function FormField({ children, error, disabled, required, className }: FormFieldProps) {
  const id = useId()
  const errorId = error ? `${id}-error` : undefined

  return (
    <FormFieldContext.Provider value={{ id, error, disabled, required, describedBy: errorId }}>
      <div role="group" className={cn('flex flex-col gap-1.5', className)}>
        {children}
        {error && (
          <p
            id={errorId}
            role="alert"
            className="typography-13-regular text-sys-error-500"
          >
            {error}
          </p>
        )}
      </div>
    </FormFieldContext.Provider>
  )
}
```

### Input에서 Context 소비

```tsx
// Input.tsx
export function Input({ disabled: disabledProp, required: requiredProp, ...props }: InputProps) {
  const field = useFormField()  // null이면 standalone

  const disabled = disabledProp ?? field?.disabled
  const required = requiredProp ?? field?.required

  return (
    <input
      id={field?.id}
      disabled={disabled}
      required={required}
      aria-invalid={!!field?.error}
      aria-describedby={field?.describedBy}
      {...props}
    />
  )
}
```

### 사용법

```tsx
{/* Standalone — FormField 없이도 동작 */}
<Input placeholder="검색어 입력" />

{/* FormField 내 — aria 자동 연결 */}
<FormField error="이메일 형식이 올바르지 않습니다" required>
  <Label>이메일</Label>
  <Input type="email" />
</FormField>
```

### 핵심 설계 결정

1. **FALLBACK 전략 사용**: `useFormField()`는 Context 없으면 `null` 반환 (throw 아님). Input은 검색바, 로그인 폼 등 FormField 없이 단독 사용되는 경우가 빈번하기 때문.
2. **Props 우선**: 컴포넌트의 직접 prop(`disabledProp`)이 Context 값(`field?.disabled`)보다 우선한다 (`??` 연산자).
3. **aria 자동 연결**: `id`, `aria-invalid`, `aria-describedby`가 Context를 통해 자동 설정되어 접근성 보일러플레이트를 제거한다.
