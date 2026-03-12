import type { TocEntry } from '@/components/showcase-layout'
import { SectionTitle } from '@/showcase/shared'
import { Callout, CALLOUT_VARIANTS, CALLOUT_SIDES } from '@/components/Callout'
import { Button } from '@/components/Button'
import { useState } from 'react'

/* ─── TOC ─────────────────────────────────────────────────────────────────── */

export const CALLOUT_TOC: TocEntry[] = [
  { id: 'component-callout', label: 'Callout', level: 1 },
  { id: 'callout-variants', label: 'Variants' },
  { id: 'callout-sides', label: 'Sides' },
  { id: 'callout-dismiss', label: 'Dismiss Modes' },
  { id: 'callout-action', label: 'With Action' },
  { id: 'callout-controlled', label: 'Controlled' },
]

/* ─── Showcase ────────────────────────────────────────────────────────────── */

export function CalloutShowcase() {
  const [controlledOpen, setControlledOpen] = useState(false)

  return (
    <div>
      {/* ── Title ── */}
      <section id="component-callout" className="mb-6">
        <h1 className="typography-24-bold text-semantic-text-on-bright-900 mb-1">
          Callout
        </h1>
        <p className="typography-14-regular text-semantic-text-on-bright-500">
          특정 요소에 부가 정보나 안내를 표시하는 팝오버 컴포넌트.
          black, white, brand 3가지 variant와 manual/auto/none dismiss 모드를 지원한다.
        </p>
      </section>

      {/* ── Variants ── */}
      <section id="callout-variants" className="mb-12 scroll-mt-6">
        <SectionTitle>Variants</SectionTitle>
        <div className="flex gap-6 items-center">
          {CALLOUT_VARIANTS.map((variant) => (
            <Callout key={variant} variant={variant} defaultOpen>
              <Callout.Anchor>
                <Button variant="outlined" size="medium">
                  {variant}
                </Button>
              </Callout.Anchor>
              <Callout.Content side="bottom" sideOffset={8}>
                <Callout.Arrow />
                <Callout.Text>
                  {variant} variant 스타일의 Callout입니다.
                </Callout.Text>
                <Callout.Close />
              </Callout.Content>
            </Callout>
          ))}
        </div>
        <p className="mt-3 typography-12-medium text-semantic-text-on-bright-400">
          버튼을 클릭하여 Callout을 토글할 수 있습니다.
        </p>
      </section>

      {/* ── Sides ── */}
      <section id="callout-sides" className="mb-12 scroll-mt-6">
        <SectionTitle>Sides</SectionTitle>
        <div className="flex gap-6 items-center justify-center py-12">
          {CALLOUT_SIDES.map((side) => (
            <Callout key={side}>
              <Callout.Anchor>
                <Button variant="outlined" size="small">
                  {side}
                </Button>
              </Callout.Anchor>
              <Callout.Content side={side} sideOffset={8}>
                <Callout.Arrow />
                <Callout.Text>{side} 방향</Callout.Text>
                <Callout.Close />
              </Callout.Content>
            </Callout>
          ))}
        </div>
      </section>

      {/* ── Dismiss Modes ── */}
      <section id="callout-dismiss" className="mb-12 scroll-mt-6">
        <SectionTitle>Dismiss Modes</SectionTitle>
        <div className="flex gap-6 items-center">
          <Callout dismiss="manual">
            <Callout.Anchor>
              <Button variant="outlined" size="medium">
                Manual
              </Button>
            </Callout.Anchor>
            <Callout.Content>
              <Callout.Arrow />
              <Callout.Text>
                클릭, ESC, 또는 Close 버튼으로 닫힙니다.
              </Callout.Text>
              <Callout.Close />
            </Callout.Content>
          </Callout>

          <Callout dismiss="auto" autoDismissDuration={3000}>
            <Callout.Anchor>
              <Button variant="outlined" size="medium">
                Auto (3초)
              </Button>
            </Callout.Anchor>
            <Callout.Content>
              <Callout.Arrow />
              <Callout.Text>
                3초 후 자동으로 닫힙니다. 수동으로도 닫을 수 있습니다.
              </Callout.Text>
              <Callout.Close />
            </Callout.Content>
          </Callout>

          <Callout dismiss="none">
            <Callout.Anchor>
              <Button variant="outlined" size="medium">
                None
              </Button>
            </Callout.Anchor>
            <Callout.Content>
              <Callout.Arrow />
              <Callout.Text>
                Close 버튼으로만 닫을 수 있습니다. 바깥 클릭과 ESC가 차단됩니다.
              </Callout.Text>
              <Callout.Close />
            </Callout.Content>
          </Callout>
        </div>
      </section>

      {/* ── With Action ── */}
      <section id="callout-action" className="mb-12 scroll-mt-6">
        <SectionTitle>With Action</SectionTitle>
        <div className="flex gap-6 items-center">
          <Callout>
            <Callout.Anchor>
              <Button variant="outlined" size="medium">
                Action 포함
              </Button>
            </Callout.Anchor>
            <Callout.Content>
              <Callout.Arrow />
              <Callout.Text>
                새로운 기능이 추가되었습니다.
              </Callout.Text>
              <Callout.Action onClick={() => alert('Action clicked!')}>
                자세히 보기
              </Callout.Action>
              <Callout.Close />
            </Callout.Content>
          </Callout>

          <Callout variant="brand">
            <Callout.Anchor>
              <Button variant="outlined" size="medium">
                Action + Close
              </Button>
            </Callout.Anchor>
            <Callout.Content>
              <Callout.Arrow />
              <Callout.Text>
                클릭 시 Callout이 자동으로 닫힙니다.
              </Callout.Text>
              <Callout.Action closeOnClick>
                확인
              </Callout.Action>
              <Callout.Close />
            </Callout.Content>
          </Callout>
        </div>
      </section>

      {/* ── Controlled ── */}
      <section id="callout-controlled" className="mb-12 scroll-mt-6">
        <SectionTitle>Controlled</SectionTitle>
        <div className="flex gap-4 items-center">
          <Callout open={controlledOpen} onOpenChange={setControlledOpen}>
            <Callout.Anchor>
              <Button variant="outlined" size="medium">
                Controlled Callout
              </Button>
            </Callout.Anchor>
            <Callout.Content>
              <Callout.Arrow />
              <Callout.Text>
                외부 상태로 제어되는 Callout입니다.
              </Callout.Text>
              <Callout.Close />
            </Callout.Content>
          </Callout>

          <Button
            variant="ghost"
            size="small"
            onClick={() => setControlledOpen(!controlledOpen)}
          >
            {controlledOpen ? 'Close' : 'Open'} externally
          </Button>
        </div>
        <p className="mt-3 typography-12-medium text-semantic-text-on-bright-400">
          open: {String(controlledOpen)}
        </p>
      </section>
    </div>
  )
}
