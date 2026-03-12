import { useState } from 'react'
import { FormField } from '@/components/FormField'
import { TagInput, TAG_INPUT_SIZES } from '@/components/TagInput'
import type { TocEntry } from '@/components/showcase-layout/TableOfContents'
import { SectionTitle, SpecLabel } from './shared'

/* ─── ToC ─────────────────────────────────────────────────────────────────── */

export const TAGINPUT_TOC: TocEntry[] = [
  { id: 'component-taginput',    label: 'TagInput',          level: 1 },
  { id: 'taginput-inline',       label: 'Inline mode'                  },
  { id: 'taginput-below',        label: 'Below mode'                   },
  { id: 'taginput-states',       label: 'States'                       },
  { id: 'taginput-sizes',        label: 'Sizes'                        },
  { id: 'taginput-validation',   label: 'Max tags & validation'        },
]

/* ─── Showcase ────────────────────────────────────────────────────────────── */

export function TagInputShowcase() {
  const [inlineTags, setInlineTags] = useState<string[]>(['React', 'TypeScript'])
  const [belowTags, setBelowTags] = useState<string[]>(['Design', 'System'])
  const [errorTags, setErrorTags] = useState<string[]>(['error-tag'])
  const [disabledTags] = useState<string[]>(['frozen', 'tag'])
  const [readOnlyTags] = useState<string[]>(['read-only', 'tag'])
  const [sizeTags, setSizeTags] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(TAG_INPUT_SIZES.map(s => [s, []]))
  )

  return (
    <>
      <h1 id="component-taginput" className="typography-24-bold text-semantic-text-on-bright-900 mb-6 scroll-mt-6">
        TagInput
      </h1>

      {/* Inline mode */}
      <section id="taginput-inline" className="mb-12 scroll-mt-6">
        <SectionTitle>Inline mode — tags inside the input</SectionTitle>
        <div className="flex flex-col gap-6 max-w-md">
          <FormField id="taginput-inline-field" label="Tags (inline)">
            <TagInput
              tagsPosition="inline"
              value={inlineTags}
              onChange={setInlineTags}
              placeholder="Enter tag and press Enter or comma…"
            />
          </FormField>
        </div>
      </section>

      {/* Below mode */}
      <section id="taginput-below" className="mb-12 scroll-mt-6">
        <SectionTitle>Below mode — tags below the input</SectionTitle>
        <div className="flex flex-col gap-6 max-w-md">
          <FormField id="taginput-below-field" label="Tags (below)">
            <TagInput
              tagsPosition="below"
              value={belowTags}
              onChange={setBelowTags}
              placeholder="Enter tag and press Enter or comma…"
            />
          </FormField>
        </div>
      </section>

      {/* States */}
      <section id="taginput-states" className="mb-12 scroll-mt-6">
        <SectionTitle>States</SectionTitle>
        <div className="flex flex-col gap-6 max-w-md">
          <FormField id="taginput-default" label="Default">
            <TagInput value={[]} onChange={() => {}} placeholder="Add tags…" />
          </FormField>

          <FormField id="taginput-error" label="Error" error errorMessage="태그 입력에 오류가 있습니다.">
            <TagInput value={errorTags} onChange={setErrorTags} placeholder="Add tags…" />
          </FormField>

          <FormField id="taginput-disabled" label="Disabled" disabled>
            <TagInput value={disabledTags} placeholder="Disabled" />
          </FormField>

          <FormField id="taginput-readonly" label="Read Only" readOnly>
            <TagInput value={readOnlyTags} placeholder="Read Only" />
          </FormField>
        </div>
      </section>

      {/* Sizes */}
      <section id="taginput-sizes" className="mb-12 scroll-mt-6">
        <SectionTitle>Sizes (inline mode)</SectionTitle>
        <div className="flex flex-col gap-4 max-w-md">
          {TAG_INPUT_SIZES.map(size => (
            <div key={size}>
              <SpecLabel>{size}</SpecLabel>
              <TagInput
                size={size}
                tagsPosition="inline"
                value={sizeTags[size]}
                onChange={tags => setSizeTags(prev => ({ ...prev, [size]: tags }))}
                placeholder={`${size} — enter tags…`}
                className="mt-1"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Max tags + validation */}
      <section id="taginput-validation" className="mb-12 scroll-mt-6">
        <SectionTitle>Max tags &amp; validation</SectionTitle>
        <div className="flex flex-col gap-6 max-w-md">
          <FormField id="taginput-max" label="Max 3 tags">
            <TagInput
              tagsPosition="inline"
              value={inlineTags.slice(0, 3)}
              onChange={tags => setInlineTags(tags.slice(0, 3))}
              maxTags={3}
              placeholder="Max 3 tags…"
            />
          </FormField>
          <FormField id="taginput-nodup" label="No duplicates (default)">
            <TagInput
              tagsPosition="below"
              value={belowTags}
              onChange={setBelowTags}
              allowDuplicates={false}
              placeholder="Duplicate tags are rejected…"
            />
          </FormField>
        </div>
      </section>
    </>
  )
}
