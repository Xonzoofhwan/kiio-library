import type { TocEntry } from '@/components/showcase-layout'
import { SectionTitle } from '@/showcase/shared'
import { Tooltip, TOOLTIP_VARIANTS, TOOLTIP_SIDES } from '@/components/Tooltip'
import { Button } from '@/components/Button'

/* ─── TOC ─────────────────────────────────────────────────────────────────── */

export const TOOLTIP_TOC: TocEntry[] = [
  { id: 'component-tooltip', label: 'Tooltip', level: 1 },
  { id: 'tooltip-variants', label: 'Variants' },
  { id: 'tooltip-sides', label: 'Sides' },
  { id: 'tooltip-arrow', label: 'Arrow & Shadow' },
  { id: 'tooltip-multiline', label: 'Multiline' },
]

/* ─── Showcase ────────────────────────────────────────────────────────────── */

export function TooltipShowcase() {
  return (
    <Tooltip.Provider>
      <div>
        {/* ── Title ── */}
        <section id="component-tooltip" className="mb-6">
          <h1 className="typography-24-bold text-semantic-text-on-bright-900 mb-1">
            Tooltip
          </h1>
          <p className="typography-14-regular text-semantic-text-on-bright-500">
            호버 시 추가 정보를 표시하는 오버레이 컴포넌트.
            black, white, brand 3가지 variant와 4방향 배치를 지원한다.
          </p>
        </section>

        {/* ── Variants ── */}
        <section id="tooltip-variants" className="mb-12 scroll-mt-6">
          <SectionTitle>Variants</SectionTitle>
          <div className="flex gap-6 items-center">
            {TOOLTIP_VARIANTS.map((variant) => (
              <Tooltip key={variant}>
                <Tooltip.Trigger>
                  <Button variant="outlined" size="medium">
                    {variant}
                  </Button>
                </Tooltip.Trigger>
                <Tooltip.Content variant={variant}>
                  {variant} variant tooltip
                </Tooltip.Content>
              </Tooltip>
            ))}
          </div>
          <p className="mt-3 typography-12-medium text-semantic-text-on-bright-400">
            호버하여 각 variant의 스타일을 확인하세요.
          </p>
        </section>

        {/* ── Sides ── */}
        <section id="tooltip-sides" className="mb-12 scroll-mt-6">
          <SectionTitle>Sides</SectionTitle>
          <div className="flex gap-6 items-center justify-center py-12">
            {TOOLTIP_SIDES.map((side) => (
              <Tooltip key={side}>
                <Tooltip.Trigger>
                  <Button variant="outlined" size="small">
                    {side}
                  </Button>
                </Tooltip.Trigger>
                <Tooltip.Content side={side}>
                  {side} 방향 tooltip
                </Tooltip.Content>
              </Tooltip>
            ))}
          </div>
        </section>

        {/* ── Arrow & Shadow ── */}
        <section id="tooltip-arrow" className="mb-12 scroll-mt-6">
          <SectionTitle>Arrow &amp; Shadow</SectionTitle>
          <div className="flex gap-6 items-center">
            <Tooltip>
              <Tooltip.Trigger>
                <Button variant="outlined" size="medium">
                  Arrow (기본)
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content hasArrow>
                화살표 포함
              </Tooltip.Content>
            </Tooltip>

            <Tooltip>
              <Tooltip.Trigger>
                <Button variant="outlined" size="medium">
                  No Arrow
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content hasArrow={false}>
                화살표 없음
              </Tooltip.Content>
            </Tooltip>

            <Tooltip>
              <Tooltip.Trigger>
                <Button variant="outlined" size="medium">
                  Shadow
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content showShadow>
                그림자 효과 적용
              </Tooltip.Content>
            </Tooltip>

            <Tooltip>
              <Tooltip.Trigger>
                <Button variant="outlined" size="medium">
                  Shadow + No Arrow
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content showShadow hasArrow={false}>
                그림자만 적용
              </Tooltip.Content>
            </Tooltip>
          </div>
        </section>

        {/* ── Multiline ── */}
        <section id="tooltip-multiline" className="mb-12 scroll-mt-6">
          <SectionTitle>Multiline</SectionTitle>
          <div className="flex gap-6 items-center">
            <Tooltip>
              <Tooltip.Trigger>
                <Button variant="outlined" size="medium">
                  Short
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content>
                짧은 텍스트
              </Tooltip.Content>
            </Tooltip>

            <Tooltip>
              <Tooltip.Trigger>
                <Button variant="outlined" size="medium">
                  Long text
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content>
                여러 줄로 표시되는 긴 텍스트입니다. Tooltip의 max-width를 초과하면
                자동으로 줄바꿈됩니다.
              </Tooltip.Content>
            </Tooltip>

            <Tooltip>
              <Tooltip.Trigger>
                <Button variant="outlined" size="medium">
                  White long
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content variant="white" showShadow>
                White variant에서도 긴 텍스트는 동일하게 줄바꿈됩니다.
                max-width 토큰으로 제어됩니다.
              </Tooltip.Content>
            </Tooltip>
          </div>
        </section>
      </div>
    </Tooltip.Provider>
  )
}
