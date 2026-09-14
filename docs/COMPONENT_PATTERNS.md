# Component Patterns

> 이 문서는 kiio-library 컴포넌트 구현에 사용되는 핵심 코드 패턴을 다룬다.
> 토큰 사용 규칙은 [CLAUDE.md](../CLAUDE.md) §Token Architecture,
> 인터랙션 설계 원칙은 [INTERACTION_DESIGN.md](./INTERACTION_DESIGN.md),
> 고급 패턴(Compound Component, Context 등)은 [ADVANCED_PATTERNS.md](./ADVANCED_PATTERNS.md) 참고.

---

## Pattern 1: CVA + cn Structure

모든 multi-variant 컴포넌트의 기본 구조. `cva`로 variant를 선언하고, `cn`으로 className 충돌을 해결한다.

```tsx
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const componentVariants = cva(
  // Base styles - always applied
  'inline-flex items-center justify-center transition-colors duration-fast ease-enter',
  {
    variants: {
      variant: {
        primary: 'bg-semantic-emphasized-purple-500 hover:bg-semantic-emphasized-purple-600 text-semantic-text-on-dim-900',
        secondary: 'bg-semantic-neutral-solid-100 hover:bg-semantic-neutral-solid-200 text-semantic-text-on-bright-900',
      },
      size: {
        small: 'p-2 gap-2 typography-14-medium',
        medium: 'p-4 gap-2 typography-16-medium',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'medium',
    },
  }
)

interface ComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentVariants> {
  // Additional props
}

export function Component({
  variant,
  size,
  className,
  ...props
}: ComponentProps) {
  return (
    <div
      className={cn(componentVariants({ variant, size }), className)}
      {...props}
    />
  )
}
```

---

## Pattern 2: Icon Handling

**Naming**: `iconLeading` / `iconTrailing` 사용 (`iconLeft` / `iconRight` 아님). RTL 레이아웃에서도 올바른 방향을 보장한다.

### 아이콘 컨테이너 필수 규칙

아이콘 슬롯은 `ReactNode`를 받으므로 소비자가 어떤 요소를 전달할지 모른다. 외부 아이콘 폰트(Material Symbols 등)는 `.material-symbols-sharp { font-size: 24px }` 같은 **클래스 기반 크기 선언**을 포함하며, 이는 CSS 상속보다 우선한다. 따라서 아이콘 컨테이너 `<span>`에는 반드시 다음 두 가지를 모두 적용한다:

1. `style={{ fontSize: ... }}` — 컨테이너에 원하는 크기를 inline으로 설정
2. `[&>*]:[font-size:inherit]` — 자식 요소가 컨테이너의 font-size를 강제 상속하도록 보장

```tsx
{icon && (
  <span
    className={cn(
      'flex-shrink-0 flex items-center justify-center',
      '[&>*]:[font-size:inherit]',  // 필수: 외부 폰트 클래스의 font-size 오버라이드
      iconSizes[size],
    )}
    style={{ fontSize: iconFontSizeVar[size] }}
  >
    {icon}
  </span>
)}
```

> **왜 `[&>*]:[font-size:inherit]`가 필요한가?**
> `Icon` 컴포넌트는 `fontSize: 'inherit'`를 inline으로 설정하여 문제가 없지만,
> raw `<span class="material-symbols-sharp">` 등 외부 요소가 전달되면 클래스 선언(`font-size: 24px`)이
> 상속값을 덮어쓴다. `[&>*]:[font-size:inherit]`는 자식 선택자로 이를 방지한다.

### 쇼케이스에서 아이콘 사용

쇼케이스/데모 코드에서도 raw `<span>` 대신 반드시 `<Icon name="..." />` 컴포넌트를 사용한다.

```tsx
// DO: Icon 컴포넌트 사용
import { Icon } from '@/components/icons'
<NavVertical.Item icon={<Icon name="dashboard" />}>Dashboard</NavVertical.Item>

// DON'T: raw span 사용 금지
<NavVertical.Item icon={<span className="material-symbols-sharp">dashboard</span>}>
```

### 사이즈 매핑 예시

```tsx
// Icon size mapping from JSON spec
const iconSizes = {
  small: 'w-4 h-4',
  medium: 'w-5 h-5',
  large: 'w-6 h-6',
}

export function Button({
  iconLeading,
  iconTrailing,
  children,
  size = 'medium'
}: ButtonProps) {
  // Check if icon-only (no children)
  const isIconOnly = !children && (iconLeading || iconTrailing)

  return (
    <button className={cn(
      'inline-flex items-center',
      isIconOnly ? iconOnlyPadding[size] : regularPadding[size]
    )}>
      {iconLeading && (
        <span className={cn('flex-shrink-0 [&>*]:[font-size:inherit]', iconSizes[size])}>
          {iconLeading}
        </span>
      )}
      {children && <span>{children}</span>}
      {iconTrailing && (
        <span className={cn('flex-shrink-0 [&>*]:[font-size:inherit]', iconSizes[size])}>
          {iconTrailing}
        </span>
      )}
    </button>
  )
}
```

---

## Pattern 3: Loading State

`loading` 은 "불러오는 중"이 아니라 **"처리 중"** 이다 — 버튼은 처리가 끝날 때까지 자리를 지키고 스피너가 돈다. 그래서 세 가지를 지킨다.

1. **네이티브 `disabled` 를 켜지 않는다.** 켜면 눌러 놓은 버튼이 로딩에 들어가는 순간 포커스가 `<body>` 로 떨어지고 스크린리더는 `aria-busy` 를 읽을 대상을 잃는다. `aria-disabled` + `aria-busy` 를 세우고 활성화는 가드로 막는다.
2. **가드는 캡처 단계(`onClickCapture`)에 둔다.** `aria-disabled` 는 시맨틱일 뿐이고 `pointer-events-none` 은 키보드에 무력하다. bubble 단계 `onClick` 가드로도 부족하다 — Radix Slot 은 `asChild` 자식의 `onClick` 을 Slot 핸들러보다 먼저 부른다. 캡처에서 `stopPropagation` 하면 bubble 단계가 열리지 않아 자식·소비자·조상의 `onClick` 이 전부 막히고, `preventDefault` 가 이동·제출을 막는다.
3. **콘텐츠는 `opacity-0` 으로 감춘다.** `invisible`(`visibility:hidden`)은 콘텐츠를 접근성 트리에서 빼 버튼의 이름이 사라진다. 제거하지도 않는다 — 폭이 스피너 크기로 줄어 레이아웃이 튄다. 스피너 래퍼는 `aria-hidden`(장식).

버튼 계열 7종이 이 규칙을 [`src/components/Button/inert.ts`](../src/components/Button/inert.ts) 하나로 공유하고, `src/testing/buttonFamilyContract.test.tsx` 가 7종 전부에 대해 잠근다.

```tsx
import { cn } from '@/lib/utils'
import { Spinner } from '@/components/icons'
import { inertRootProps } from '@/components/Button/inert' // 내부 공통 — index 에서 export 하지 않는다

export function Button({
  loading = false, disabled = false, asChild = false, type = 'button',
  onClick, tabIndex, children, className, ...rest
}: ButtonProps) {
  // 가드 · type · disabled · tabIndex(소비자 값 보존) · aria 를 한 곳에서 만든다.
  const { isInert, rootProps } = inertRootProps({ disabled, loading, asChild, type, onClick, tabIndex })

  return (
    <button
      {...rest}
      {...rootProps} // rest 뒤 — 소비자가 가드·상태 속성을 덮어쓰지 못한다
      className={cn('relative inline-flex items-center', isInert && 'pointer-events-none', className)}
    >
      <span className={cn('relative flex items-center', loading && 'opacity-0')}>{children}</span>
      {loading && (
        <span aria-hidden className="absolute inset-0 flex items-center justify-center">
          <Spinner className="size-5" />
        </span>
      )}
    </button>
  )
}
```

---

## Pattern 4: Polymorphic Component (asChild)

`@radix-ui/react-slot`을 사용하여 소비자가 다른 요소를 렌더링하면서 컴포넌트의 스타일을 유지할 수 있게 한다. `asChild`가 true일 때, 컴포넌트의 props와 className이 기본 HTML 요소 대신 자식 요소에 병합된다.

```tsx
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

export function Button({ asChild, className, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn('...base-classes', className)} {...props} />
}

// Usage:
<Button>Normal button</Button>
<Button asChild><a href="/home">Link styled as button</a></Button>
```

> 복합 컴포넌트(Compound Component), Context 분리, 커스텀 훅 추출, 테스트/Storybook 구조 등 고급 패턴은 [ADVANCED_PATTERNS.md](./ADVANCED_PATTERNS.md) 참고.
