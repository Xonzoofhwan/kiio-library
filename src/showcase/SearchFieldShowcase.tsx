import { useState } from 'react'
import { FormField } from '@/components/FormField'
import { SearchField, SEARCHFIELD_SIZES } from '@/components/SearchField'
import type { TocEntry } from '@/components/showcase-layout/TableOfContents'
import { SectionTitle, SpecLabel, SpecValue } from './shared'

/* ─── ToC ─────────────────────────────────────────────────────────────────── */

export const SEARCHFIELD_TOC: TocEntry[] = [
  { id: 'component-searchfield',      label: 'SearchField',            level: 1 },
  { id: 'searchfield-basic',          label: 'Basic'                            },
  { id: 'searchfield-sizes',          label: 'Sizes'                            },
  { id: 'searchfield-loading',        label: 'Loading'                          },
  { id: 'searchfield-with-formfield', label: 'With FormField'                   },
  { id: 'searchfield-states',         label: 'States'                           },
]

/* ─── Size spec ───────────────────────────────────────────────────────────── */

const SIZE_SPECS: Record<string, { height: string; font: string }> = {
  xSmall: { height: '24px', font: '12' },
  small:  { height: '32px', font: '13' },
  medium: { height: '40px', font: '14' },
  large:  { height: '48px', font: '15' },
  xLarge: { height: '56px', font: '16' },
}

/* ─── Showcase ────────────────────────────────────────────────────────────── */

export function SearchFieldShowcase() {
  const [basicValue, setBasicValue] = useState('')
  const [formValue, setFormValue] = useState('')
  const [lastSearched, setLastSearched] = useState<string | null>(null)

  return (
    <>
      <h1
        id="component-searchfield"
        className="typography-24-bold text-semantic-text-on-bright-900 mb-6 scroll-mt-6"
      >
        SearchField
      </h1>

      {/* Basic */}
      <section id="searchfield-basic" className="mb-12 scroll-mt-6">
        <SectionTitle>Basic</SectionTitle>
        <div className="flex flex-col gap-4 max-w-sm">
          <SearchField
            value={basicValue}
            onChange={(e) => setBasicValue(e.target.value)}
            onSearch={(v) => setLastSearched(v)}
            onClear={() => { setBasicValue(''); setLastSearched(null) }}
          />
          {lastSearched !== null && (
            <p className="typography-13-regular text-semantic-text-on-bright-500">
              검색어: &ldquo;{lastSearched}&rdquo;
            </p>
          )}
        </div>
      </section>

      {/* Sizes */}
      <section id="searchfield-sizes" className="mb-12 scroll-mt-6">
        <SectionTitle>Sizes</SectionTitle>
        <div className="flex flex-col gap-4 max-w-lg">
          {SEARCHFIELD_SIZES.map((s) => (
            <div key={s} className="flex items-center gap-4">
              <div className="w-16 flex flex-col items-end gap-0.5">
                <SpecLabel>{s}</SpecLabel>
                <SpecValue>{SIZE_SPECS[s].height} / {SIZE_SPECS[s].font}px</SpecValue>
              </div>
              <div className="flex-1">
                <SearchField size={s} placeholder={`Size: ${s}`} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Loading */}
      <section id="searchfield-loading" className="mb-12 scroll-mt-6">
        <SectionTitle>Loading</SectionTitle>
        <div className="flex flex-col gap-4 max-w-sm">
          <SearchField loading placeholder="검색 중..." />
        </div>
      </section>

      {/* With FormField */}
      <section id="searchfield-with-formfield" className="mb-12 scroll-mt-6">
        <SectionTitle>With FormField</SectionTitle>
        <div className="grid grid-cols-2 gap-6 max-w-2xl">
          <FormField id="sf-default" label="검색" helperText="이름, 이메일 등으로 검색하세요.">
            <SearchField
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
              onClear={() => setFormValue('')}
            />
          </FormField>
          <FormField id="sf-error" label="검색" error errorMessage="검색어를 입력해 주세요.">
            <SearchField />
          </FormField>
        </div>
      </section>

      {/* States */}
      <section id="searchfield-states" className="mb-12 scroll-mt-6">
        <SectionTitle>States</SectionTitle>
        <div className="flex flex-col gap-4 max-w-sm">
          <SearchField disabled placeholder="Disabled" />
          <SearchField readOnly value="읽기 전용 검색어" />
        </div>
      </section>
    </>
  )
}
