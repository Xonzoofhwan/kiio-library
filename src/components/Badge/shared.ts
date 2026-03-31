/* ─── Badge shared types & color maps ─────────────────────────────────────── */

export const BADGE_COLORS = [
  'gray', 'indigo', 'purple', 'fuchsia', 'pink', 'rose', 'red',
  'orange', 'amber', 'yellow', 'lime', 'green', 'emerald',
  'teal', 'cyan', 'sky', 'blue',
] as const

export const BADGE_SIZES = ['nano', 'xSmall', 'small', 'medium', 'large'] as const
export const BADGE_SHAPES = ['basic', 'circular', 'square'] as const
export const BADGE_WEIGHTS = ['light', 'heavy'] as const
export const BADGE_DOT_SIZES = [4, 8] as const

export type BadgeColor = (typeof BADGE_COLORS)[number]
export type BadgeSize = (typeof BADGE_SIZES)[number]
export type BadgeShape = (typeof BADGE_SHAPES)[number]
export type BadgeWeight = (typeof BADGE_WEIGHTS)[number]
export type BadgeDotSize = (typeof BADGE_DOT_SIZES)[number]

/* ─── Figma color name → primitive token family mapping ───────────────────── */

type ColorWeightStyles = { bg: string; content: string }

export const labelColorMap: Record<BadgeColor, Record<BadgeWeight, ColorWeightStyles>> = {
  gray: {
    light: { bg: 'bg-primitive-gray-100', content: 'text-primitive-gray-700' },
    heavy: { bg: 'bg-primitive-gray-800', content: 'text-primitive-gray-0' },
  },
  indigo: {
    light: { bg: 'bg-primitive-indigo-100', content: 'text-primitive-indigo-700' },
    heavy: { bg: 'bg-primitive-indigo-500', content: 'text-primitive-gray-0' },
  },
  purple: {
    light: { bg: 'bg-primitive-purple-100', content: 'text-primitive-purple-700' },
    heavy: { bg: 'bg-primitive-purple-500', content: 'text-primitive-gray-0' },
  },
  fuchsia: {
    light: { bg: 'bg-primitive-violet-100', content: 'text-primitive-violet-700' },
    heavy: { bg: 'bg-primitive-violet-500', content: 'text-primitive-gray-0' },
  },
  pink: {
    light: { bg: 'bg-primitive-pink-100', content: 'text-primitive-pink-700' },
    heavy: { bg: 'bg-primitive-pink-500', content: 'text-primitive-gray-0' },
  },
  rose: {
    light: { bg: 'bg-primitive-rose-100', content: 'text-primitive-rose-700' },
    heavy: { bg: 'bg-primitive-rose-500', content: 'text-primitive-gray-0' },
  },
  red: {
    light: { bg: 'bg-primitive-red-bright-100', content: 'text-primitive-red-bright-600' },
    heavy: { bg: 'bg-primitive-red-bright-500', content: 'text-primitive-gray-0' },
  },
  orange: {
    light: { bg: 'bg-primitive-orange-100', content: 'text-primitive-orange-600' },
    heavy: { bg: 'bg-primitive-orange-500', content: 'text-primitive-gray-0' },
  },
  amber: {
    light: { bg: 'bg-primitive-amber-100', content: 'text-primitive-amber-600' },
    heavy: { bg: 'bg-primitive-amber-500', content: 'text-primitive-gray-0' },
  },
  yellow: {
    light: { bg: 'bg-primitive-yellow-100', content: 'text-primitive-yellow-700' },
    heavy: { bg: 'bg-primitive-yellow-400', content: 'text-primitive-yellow-950' },
  },
  lime: {
    light: { bg: 'bg-primitive-lime-200', content: 'text-primitive-lime-800' },
    heavy: { bg: 'bg-primitive-lime-500', content: 'text-primitive-gray-0' },
  },
  green: {
    light: { bg: 'bg-primitive-edamame-100', content: 'text-primitive-edamame-700' },
    heavy: { bg: 'bg-primitive-edamame-500', content: 'text-primitive-gray-0' },
  },
  emerald: {
    light: { bg: 'bg-primitive-forest-100', content: 'text-primitive-forest-600' },
    heavy: { bg: 'bg-primitive-forest-500', content: 'text-primitive-gray-0' },
  },
  teal: {
    light: { bg: 'bg-primitive-emerald-100', content: 'text-primitive-emerald-600' },
    heavy: { bg: 'bg-primitive-emerald-500', content: 'text-primitive-gray-0' },
  },
  cyan: {
    light: { bg: 'bg-primitive-cyan-100', content: 'text-primitive-cyan-700' },
    heavy: { bg: 'bg-primitive-cyan-500', content: 'text-primitive-gray-0' },
  },
  sky: {
    light: { bg: 'bg-primitive-sky-100', content: 'text-primitive-sky-700' },
    heavy: { bg: 'bg-primitive-sky-500', content: 'text-primitive-gray-0' },
  },
  blue: {
    light: { bg: 'bg-primitive-blue-100', content: 'text-primitive-blue-700' },
    heavy: { bg: 'bg-primitive-blue-500', content: 'text-primitive-gray-0' },
  },
}

/* ─── Dot color map (gray=300, others=500) ───────────────────────────────── */

export const dotColorMap: Record<BadgeColor, string> = {
  gray:    'bg-primitive-gray-300',
  indigo:  'bg-primitive-indigo-500',
  purple:  'bg-primitive-purple-500',
  fuchsia: 'bg-primitive-violet-500',
  pink:    'bg-primitive-pink-500',
  rose:    'bg-primitive-rose-500',
  red:     'bg-primitive-red-bright-500',
  orange:  'bg-primitive-orange-500',
  amber:   'bg-primitive-amber-500',
  yellow:  'bg-primitive-yellow-500',
  lime:    'bg-primitive-lime-500',
  green:   'bg-primitive-edamame-500',
  emerald: 'bg-primitive-forest-500',
  teal:    'bg-primitive-emerald-500',
  cyan:    'bg-primitive-cyan-500',
  sky:     'bg-primitive-sky-500',
  blue:    'bg-primitive-blue-500',
}
