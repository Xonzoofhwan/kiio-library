import { cn } from '@/lib/utils'

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Material Symbols icon name (e.g. 'search', 'arrow_forward', 'settings').
   * @see https://fonts.google.com/icons */
  name: string
  /** Whether the icon should be filled.
   * @default true */
  filled?: boolean
}

/**
 * Material Symbols Sharp icon wrapper.
 * Inherits `font-size` and `color` from parent, so it works seamlessly
 * inside Button's icon slots which control sizing via the wrapper span.
 *
 * @example
 * <Button iconLeading={<Icon name="search" />}>Search</Button>
 * <Button iconTrailing={<Icon name="arrow_forward" />}>Next</Button>
 */
export function Icon({ name, filled = true, className, style, ...rest }: IconProps) {
  return (
    <span
      className={cn('material-symbols-sharp', className)}
      style={{
        display: 'block',
        fontSize: 'inherit',
        lineHeight: 1,
        width: '1em',
        height: '1em',
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24`,
        ...style,
      }}
      aria-hidden
      {...rest}
    >
      {name}
    </span>
  )
}
