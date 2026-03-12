import { useState } from 'react'
import { FormField } from '@/components/FormField'
import { Textarea, TEXTAREA_SIZES } from '@/components/Textarea'
import type { TocEntry } from '@/components/showcase-layout/TableOfContents'
import { SectionTitle, ColHeader, SpecLabel, SpecValue } from './shared'

/* ─── ToC ─────────────────────────────────────────────────────────────────── */

export const TEXTAREA_TOC: TocEntry[] = [
  { id: 'component-textarea',    label: 'Textarea',               level: 1 },
  { id: 'textarea-states',       label: 'States (with FormField)'          },
  { id: 'textarea-sizes',        label: 'Sizes'                            },
  { id: 'textarea-auto-resize',  label: 'Auto Resize'                     },
  { id: 'textarea-pill',         label: 'Pill'                             },
  { id: 'textarea-standalone',   label: 'Standalone'                       },
]

/* ─── Showcase ────────────────────────────────────────────────────────────── */

export function TextareaShowcase() {
  const [bioValue, setBioValue] = useState('')
  const [autoValue, setAutoValue] = useState('')
  const [limitedValue, setLimitedValue] = useState('')
  const MAX_COUNT = 1000

  return (
    <>
      <h1 id="component-textarea" className="typography-24-bold text-semantic-text-on-bright-900 mb-6 scroll-mt-6">
        Textarea
      </h1>

      {/* States */}
      <section id="textarea-states" className="mb-12 scroll-mt-6">
        <SectionTitle>States (with FormField)</SectionTitle>
        <div className="grid grid-cols-2 gap-6 max-w-2xl">
          <FormField
            id="ta-default"
            label="소개"
            helperText="간략한 자기소개를 작성해 주세요."
            count={bioValue.length}
            maxCount={MAX_COUNT}
          >
            <Textarea
              placeholder="자기소개를 입력하세요"
              value={bioValue}
              onChange={e => setBioValue(e.target.value)}
            />
          </FormField>

          <FormField id="ta-error" label="사유" error errorMessage="필수 입력 항목입니다." count={0} maxCount={MAX_COUNT}>
            <Textarea placeholder="사유를 입력하세요" />
          </FormField>

          <FormField id="ta-positive" label="주소" helperText="주소가 확인되었습니다.">
            <Textarea positive defaultValue="서울특별시 강남구 테헤란로 123" />
          </FormField>

          <FormField id="ta-disabled" label="메모" disabled>
            <Textarea defaultValue="이 필드는 수정할 수 없습니다." />
          </FormField>

          <FormField id="ta-readonly" label="약관 내용" readOnly>
            <Textarea defaultValue="본 약관은 서비스 이용에 관한 기본적인 사항을 규정합니다. 이용자는 본 약관에 동의함으로써 서비스를 이용할 수 있습니다." />
          </FormField>

          <FormField
            id="ta-count"
            label="상세 설명"
            required
            count={limitedValue.length}
            maxCount={MAX_COUNT}
            error={limitedValue.length > MAX_COUNT}
            errorMessage={limitedValue.length > MAX_COUNT ? `${MAX_COUNT}자를 초과했습니다.` : undefined}
          >
            <Textarea
              value={limitedValue}
              onChange={e => setLimitedValue(e.target.value)}
              placeholder="상세 설명을 입력하세요"
            />
          </FormField>
        </div>
      </section>

      {/* Sizes */}
      <section id="textarea-sizes" className="mb-12 scroll-mt-6">
        <SectionTitle>Sizes</SectionTitle>
        <div className="grid grid-cols-[80px_repeat(2,1fr)] gap-x-6 gap-y-2 max-w-2xl items-start">
          <div />
          {TEXTAREA_SIZES.map(size => (
            <ColHeader key={size}>{size}</ColHeader>
          ))}

          <SpecLabel>Input</SpecLabel>
          {TEXTAREA_SIZES.map(size => (
            <Textarea key={size} size={size} placeholder={`${size} placeholder`} minRows={2} />
          ))}

          <SpecLabel>Font</SpecLabel>
          {(['16px', '18px'] as const).map((f, i) => (
            <SpecValue key={i}>{f}</SpecValue>
          ))}

          <SpecLabel>Px</SpecLabel>
          {(['12px', '16px'] as const).map((p, i) => (
            <SpecValue key={i}>{p}</SpecValue>
          ))}

          <SpecLabel>Py</SpecLabel>
          {(['12px', '14px'] as const).map((p, i) => (
            <SpecValue key={i}>{p}</SpecValue>
          ))}

          <SpecLabel>Radius</SpecLabel>
          {(['12px', '12px'] as const).map((r, i) => (
            <SpecValue key={i}>{r}</SpecValue>
          ))}
        </div>
      </section>

      {/* Auto Resize */}
      <section id="textarea-auto-resize" className="mb-12 scroll-mt-6">
        <SectionTitle>Auto Resize</SectionTitle>
        <div className="flex flex-col gap-6 max-w-md">
          <FormField id="ta-auto" label="무제한 자동 확장" helperText="minRows=2, maxRows 없음">
            <Textarea
              autoResize
              minRows={2}
              placeholder="입력하면 자동으로 높이가 늘어납니다..."
              value={autoValue}
              onChange={e => setAutoValue(e.target.value)}
            />
          </FormField>

          <FormField id="ta-auto-max" label="최대 행 제한" helperText="minRows=2, maxRows=6 — 초과 시 스크롤">
            <Textarea
              autoResize
              minRows={2}
              maxRows={6}
              placeholder="최대 6행까지 자동 확장됩니다..."
            />
          </FormField>

          <FormField id="ta-auto-xl" label="xLarge + Auto Resize" helperText="size=xLarge, minRows=2, maxRows=4">
            <Textarea
              size="xLarge"
              autoResize
              minRows={2}
              maxRows={4}
              placeholder="xLarge 사이즈 자동 확장..."
            />
          </FormField>
        </div>
      </section>

      {/* Pill */}
      <section id="textarea-pill" className="mb-12 scroll-mt-6">
        <SectionTitle>Pill</SectionTitle>
        <p className="typography-13-regular text-semantic-text-on-bright-400 mb-4">
          pill prop으로 둥근 끝 적용. basic에서 9999px, geo에서 대응 TextField 높이의 절반.
        </p>
        <div className="flex flex-col gap-3 max-w-md">
          <Textarea pill placeholder="Pill textarea" minRows={2} />
          <Textarea pill size="xLarge" placeholder="Pill xLarge textarea" minRows={2} />
          <Textarea pill placeholder="Pill + 에러" error minRows={2} />
        </div>
      </section>

      {/* Standalone */}
      <section id="textarea-standalone" className="mb-12 scroll-mt-6">
        <SectionTitle>Standalone (without FormField)</SectionTitle>
        <div className="flex flex-col gap-3 max-w-xs">
          <Textarea placeholder="기본 텍스트 입력" minRows={2} />
          <Textarea placeholder="에러 상태" error minRows={2} />
          <Textarea positive defaultValue="유효한 값" minRows={2} />
          <Textarea disabled defaultValue="비활성 상태" minRows={2} />
          <Textarea readOnly defaultValue="읽기 전용 값" minRows={2} />
        </div>
      </section>
    </>
  )
}
