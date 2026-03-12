import { useState } from 'react'
import { Select, SELECT_SIZES } from '@/components/Select'
import type { SelectOption, SelectGroup } from '@/components/Select'
import { FormField } from '@/components/FormField'
import type { TocEntry } from '@/components/showcase-layout/TableOfContents'
import { SectionTitle, SearchIcon, StarIcon, MailIcon, BookIcon } from './shared'

/* ─── ToC ─────────────────────────────────────────────────────────────────── */

export const SELECT_TOC: TocEntry[] = [
  { id: 'component-select', label: 'Select', level: 1 },
  { id: 'select-basic',      label: 'Basic Select' },
  { id: 'select-combobox',   label: 'Combobox' },
  { id: 'select-sizes',      label: 'Sizes' },
  { id: 'select-states',     label: 'States' },
  { id: 'select-clearable',  label: 'Clearable' },
  { id: 'select-groups',     label: 'Grouped Options' },
  { id: 'select-icons',      label: 'With Icons' },
  { id: 'select-formfield',  label: 'With FormField' },
]

/* ─── Sample data ──────────────────────────────────────────────────────────── */

const FRUIT_OPTIONS: SelectOption[] = [
  { value: 'apple', label: '사과' },
  { value: 'banana', label: '바나나' },
  { value: 'cherry', label: '체리' },
  { value: 'grape', label: '포도' },
  { value: 'mango', label: '망고' },
  { value: 'orange', label: '오렌지' },
  { value: 'peach', label: '복숭아' },
  { value: 'strawberry', label: '딸기' },
]

const COUNTRY_OPTIONS: SelectOption[] = [
  { value: 'kr', label: '한국' },
  { value: 'us', label: '미국' },
  { value: 'jp', label: '일본' },
  { value: 'cn', label: '중국' },
  { value: 'gb', label: '영국' },
  { value: 'de', label: '독일' },
  { value: 'fr', label: '프랑스' },
  { value: 'it', label: '이탈리아' },
  { value: 'au', label: '호주' },
  { value: 'ca', label: '캐나다' },
]

const GROUPED_OPTIONS: (SelectOption | SelectGroup)[] = [
  {
    label: '과일',
    options: [
      { value: 'apple', label: '사과' },
      { value: 'banana', label: '바나나' },
      { value: 'cherry', label: '체리' },
    ],
  },
  {
    label: '채소',
    options: [
      { value: 'carrot', label: '당근' },
      { value: 'broccoli', label: '브로콜리' },
      { value: 'spinach', label: '시금치' },
    ],
  },
  {
    label: '곡물',
    options: [
      { value: 'rice', label: '쌀' },
      { value: 'wheat', label: '밀' },
    ],
  },
]

const ICON_OPTIONS: SelectOption[] = [
  { value: 'search', label: '검색', icon: <SearchIcon /> },
  { value: 'star', label: '즐겨찾기', icon: <StarIcon /> },
  { value: 'mail', label: '메일', icon: <MailIcon /> },
  { value: 'book', label: '도서', icon: <BookIcon /> },
]

const DISABLED_OPTIONS: SelectOption[] = [
  { value: 'option1', label: '선택 가능 A' },
  { value: 'option2', label: '비활성 옵션', disabled: true },
  { value: 'option3', label: '선택 가능 B' },
  { value: 'option4', label: '비활성 옵션 2', disabled: true },
  { value: 'option5', label: '선택 가능 C' },
]

/* ─── Showcase ─────────────────────────────────────────────────────────────── */

export function SelectShowcase() {
  const [basicValue, setBasicValue] = useState('')
  const [comboValue, setComboValue] = useState('')
  const [clearableValue, setClearableValue] = useState('apple')
  const [formValue, setFormValue] = useState('')
  const [iconValue, setIconValue] = useState('')

  return (
    <div className="space-y-12">
      <h1 id="component-select" className="typography-28-bold text-semantic-text-on-bright-950">
        Select
      </h1>

      {/* ── Basic Select ── */}
      <section id="select-basic" className="space-y-4">
        <SectionTitle>Basic Select</SectionTitle>
        <div className="max-w-sm space-y-3">
          <Select
            options={FRUIT_OPTIONS}
            placeholder="과일을 선택하세요"
            value={basicValue}
            onValueChange={setBasicValue}
          />
          <p className="typography-13-regular text-semantic-text-on-bright-500">
            선택된 값: {basicValue || '(없음)'}
          </p>
        </div>
      </section>

      {/* ── Combobox ── */}
      <section id="select-combobox" className="space-y-4">
        <SectionTitle>Combobox</SectionTitle>
        <div className="max-w-sm space-y-3">
          <Select
            mode="combobox"
            options={COUNTRY_OPTIONS}
            placeholder="국가 검색..."
            value={comboValue}
            onValueChange={setComboValue}
          />
          <p className="typography-13-regular text-semantic-text-on-bright-500">
            선택된 값: {comboValue || '(없음)'}
          </p>
        </div>
      </section>

      {/* ── Sizes ── */}
      <section id="select-sizes" className="space-y-4">
        <SectionTitle>Sizes</SectionTitle>
        <div className="max-w-sm space-y-3">
          {SELECT_SIZES.map((s) => (
            <div key={s} className="flex items-center gap-3">
              <span className="typography-13-medium text-semantic-text-on-bright-500 w-16 flex-shrink-0">
                {s}
              </span>
              <Select
                size={s}
                options={FRUIT_OPTIONS}
                placeholder={`${s} size`}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── States ── */}
      <section id="select-states" className="space-y-4">
        <SectionTitle>States</SectionTitle>
        <div className="max-w-sm space-y-3">
          <div className="space-y-1">
            <span className="typography-12-medium text-semantic-text-on-bright-500">Default</span>
            <Select options={FRUIT_OPTIONS} placeholder="기본" />
          </div>
          <div className="space-y-1">
            <span className="typography-12-medium text-semantic-text-on-bright-500">Error</span>
            <Select options={FRUIT_OPTIONS} placeholder="에러 상태" error />
          </div>
          <div className="space-y-1">
            <span className="typography-12-medium text-semantic-text-on-bright-500">Disabled</span>
            <Select options={FRUIT_OPTIONS} placeholder="비활성" disabled />
          </div>
          <div className="space-y-1">
            <span className="typography-12-medium text-semantic-text-on-bright-500">Disabled with value</span>
            <Select options={FRUIT_OPTIONS} value="apple" disabled />
          </div>
          <div className="space-y-1">
            <span className="typography-12-medium text-semantic-text-on-bright-500">ReadOnly</span>
            <Select options={FRUIT_OPTIONS} value="banana" readOnly />
          </div>
          <div className="space-y-1">
            <span className="typography-12-medium text-semantic-text-on-bright-500">Disabled options</span>
            <Select options={DISABLED_OPTIONS} placeholder="일부 비활성 옵션" />
          </div>
        </div>
      </section>

      {/* ── Clearable ── */}
      <section id="select-clearable" className="space-y-4">
        <SectionTitle>Clearable</SectionTitle>
        <div className="max-w-sm space-y-3">
          <Select
            options={FRUIT_OPTIONS}
            placeholder="지우기 가능"
            value={clearableValue}
            onValueChange={setClearableValue}
            clearable
          />
          <Select
            mode="combobox"
            options={COUNTRY_OPTIONS}
            placeholder="Combobox + Clearable"
            clearable
          />
        </div>
      </section>

      {/* ── Grouped Options ── */}
      <section id="select-groups" className="space-y-4">
        <SectionTitle>Grouped Options</SectionTitle>
        <div className="max-w-sm space-y-3">
          <Select
            options={GROUPED_OPTIONS}
            placeholder="카테고리별 선택"
          />
          <Select
            mode="combobox"
            options={GROUPED_OPTIONS}
            placeholder="카테고리별 검색..."
          />
        </div>
      </section>

      {/* ── With Icons ── */}
      <section id="select-icons" className="space-y-4">
        <SectionTitle>With Icons</SectionTitle>
        <div className="max-w-sm space-y-3">
          <Select
            options={ICON_OPTIONS}
            placeholder="아이콘 옵션"
            value={iconValue}
            onValueChange={setIconValue}
          />
          <Select
            options={ICON_OPTIONS}
            placeholder="아이콘 검색..."
            mode="combobox"
            startEnhancer={<SearchIcon />}
          />
        </div>
      </section>

      {/* ── With FormField ── */}
      <section id="select-formfield" className="space-y-4">
        <SectionTitle>With FormField</SectionTitle>
        <div className="max-w-sm space-y-4">
          <FormField id="fruit-field" label="과일 선택" description="좋아하는 과일을 선택하세요.">
            <Select
              options={FRUIT_OPTIONS}
              placeholder="선택..."
              value={formValue}
              onValueChange={setFormValue}
            />
          </FormField>

          <FormField id="country-field" label="국가" error errorMessage="국가를 선택해 주세요.">
            <Select
              mode="combobox"
              options={COUNTRY_OPTIONS}
              placeholder="국가 검색..."
            />
          </FormField>

          <FormField id="disabled-field" label="비활성 필드" disabled>
            <Select options={FRUIT_OPTIONS} placeholder="비활성" />
          </FormField>

          <FormField id="readonly-field" label="읽기 전용" readOnly>
            <Select options={FRUIT_OPTIONS} value="cherry" />
          </FormField>
        </div>
      </section>
    </div>
  )
}
