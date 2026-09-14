// ============================================================
// TYPOGRAPHY TOKENS
// Source: Figma Kiio-Library (3ZDIVn83opF9OYSzWYE1iF) → 00 Foundation / Typography (6089:461)
// 2026-09-14 실측: 68개 텍스트 스타일 전수. 자간 17개는 전부 아래와 같고,
// 행간은 5개(32·28·24·22·20)가 Figma 보다 2~4px 넓다 — Figma 의 폰트가 아직 Geist 라
// 교체 뒤 다시 재기로 했다(docs/STABILIZATION_PLAN.md B4).
// Font: Wanted Sans (SIL OFL) — 라틴 + 한글 한 패밀리
// Scale: 17 sizes × 4 weights = 68 composite tokens
// Naming: {size}-{weight} e.g. "40-bold", "16-semibold"
// ============================================================

export type TypographyWeight = 'regular' | 'medium' | 'semibold' | 'bold';

export type TypographySize =
  | '64' | '48' | '40' | '32' | '28' | '24' | '22' | '20' | '18'
  | '17' | '16' | '15' | '14' | '13' | '12' | '11' | '10';

export type TypographyKey = `${TypographySize}-${TypographyWeight}`;

export interface TypographyTokenValue {
  /** rem units (base 16px) */
  fontSize: string;
  /** px units — fixed per size step */
  lineHeight: string;
  /** em units — fixed per size step */
  letterSpacing: string;
  /** numeric font-weight value */
  fontWeight: number;
  /** font-family stack */
  fontFamily: string;
}

export type TypographyScale = Record<TypographyKey, TypographyTokenValue>;

const FONT_FAMILY = "'Wanted Sans Variable', 'Wanted Sans', system-ui, 'Apple SD Gothic Neo', sans-serif";

// size → [fontSize(rem), lineHeight(px), letterSpacing(em)]
const sizes: Record<TypographySize, [string, string, string]> = {
  '64': ['4rem',      '72px', '-0.012em'],
  '48': ['3rem',      '56px', '-0.012em'],
  '40': ['2.5rem',    '48px', '-0.012em'],
  '32': ['2rem',      '38px', '-0.012em'],
  '28': ['1.75rem',   '34px', '-0.010em'],
  '24': ['1.5rem',    '30px', '-0.008em'],
  '22': ['1.375rem',  '28px', '-0.016em'],
  '20': ['1.25rem',   '28px', '-0.024em'],
  '18': ['1.125rem',  '28px', '-0.012em'],
  '17': ['1.0625rem', '24px', '-0.010em'],
  '16': ['1rem',      '24px', '-0.009em'],
  '15': ['0.9375rem', '24px', '-0.004em'],
  '14': ['0.875rem',  '20px',  '0em'],
  '13': ['0.8125rem', '16px',  '0em'],
  '12': ['0.75rem',   '16px',  '0em'],
  '11': ['0.6875rem', '12px',  '0em'],
  '10': ['0.625rem',  '12px',  '0em'],
};

const weights: Record<TypographyWeight, number> = {
  regular:  400,
  medium:   500,
  semibold: 600,
  bold:     700,
};

// Build all 68 composite tokens
export const typography = Object.fromEntries(
  (Object.keys(sizes) as TypographySize[]).flatMap((size) =>
    (Object.keys(weights) as TypographyWeight[]).map((weight) => [
      `${size}-${weight}` as TypographyKey,
      {
        fontSize:      sizes[size][0],
        lineHeight:    sizes[size][1],
        letterSpacing: sizes[size][2],
        fontWeight:    weights[weight],
        fontFamily:    FONT_FAMILY,
      } satisfies TypographyTokenValue,
    ]),
  ),
) as TypographyScale;
