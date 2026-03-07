// ============================================================
// MOTION TOKENS
// Duration (5 steps) + Easing (4 curves)
// Primitive → Semantic 2-layer like colors.
// Do NOT use primitive motion tokens directly in components.
// ============================================================

// --- Primitive ---

export type PrimitiveDurationKey = '0' | '100' | '200' | '300' | '500';
export type PrimitiveEasingKey = 'ease-out' | 'ease-in' | 'ease-in-out' | 'linear';

export type PrimitiveDurationScale = Record<PrimitiveDurationKey, string>;
export type PrimitiveEasingScale = Record<PrimitiveEasingKey, string>;

// --- Semantic ---

export type SemanticDurationKey = 'instant' | 'fast' | 'normal' | 'slow' | 'slower';
export type SemanticEasingKey = 'enter' | 'exit' | 'move' | 'linear';

export type SemanticDurationScale = Record<SemanticDurationKey, string>;
export type SemanticEasingScale = Record<SemanticEasingKey, string>;

// --- Combined ---

export interface MotionTokens {
  primitive: { duration: PrimitiveDurationScale; easing: PrimitiveEasingScale };
  semantic: { duration: SemanticDurationScale; easing: SemanticEasingScale };
}

export const motion: MotionTokens = {
  primitive: {
    duration: {
      '0':   '0ms',
      '100': '100ms',
      '200': '200ms',
      '300': '300ms',
      '500': '500ms',
    },
    easing: {
      'ease-out':    'cubic-bezier(0.0, 0.0, 0.2, 1)',
      'ease-in':     'cubic-bezier(0.4, 0.0, 1, 1)',
      'ease-in-out': 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      'linear':      'linear',
    },
  },
  semantic: {
    duration: {
      instant: 'var(--semantic-duration-instant)',
      fast:    'var(--semantic-duration-fast)',
      normal:  'var(--semantic-duration-normal)',
      slow:    'var(--semantic-duration-slow)',
      slower:  'var(--semantic-duration-slower)',
    },
    easing: {
      enter:  'var(--semantic-easing-enter)',
      exit:   'var(--semantic-easing-exit)',
      move:   'var(--semantic-easing-move)',
      linear: 'var(--semantic-easing-linear)',
    },
  },
};
