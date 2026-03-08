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
        primary: 'bg-semantic-primary-500 hover:bg-semantic-primary-600 text-white',
        secondary: 'bg-semantic-neutral-solid-100 hover:bg-semantic-neutral-solid-200',
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

```tsx
interface ButtonProps {
  iconLeading?: React.ReactNode
  iconTrailing?: React.ReactNode
  children: React.ReactNode
  size?: 'small' | 'medium' | 'large'
}

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
        <span className={cn('flex-shrink-0', iconSizes[size])}>
          {iconLeading}
        </span>
      )}
      {children && <span>{children}</span>}
      {iconTrailing && (
        <span className={cn('flex-shrink-0', iconSizes[size])}>
          {iconTrailing}
        </span>
      )}
    </button>
  )
}
```

---

## Pattern 3: Loading State

```tsx
import { cn } from '@/lib/utils'
import { Spinner } from '@/components/Spinner' // project spinner component

interface ButtonProps {
  loading?: boolean
  iconLeading?: React.ReactNode
  children: React.ReactNode
  size?: 'small' | 'medium' | 'large'
}

const iconSizes = {
  small: 'w-4 h-4',
  medium: 'w-5 h-5',
  large: 'w-6 h-6',
}

export function Button({
  loading,
  iconLeading,
  children,
  size = 'medium',
  ...props
}: ButtonProps) {
  const spinner = (
    <Spinner className={cn('animate-spin', iconSizes[size])} />
  )

  return (
    <button
      disabled={loading}
      {...props}
    >
      {loading ? spinner : iconLeading}
      {children}
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
