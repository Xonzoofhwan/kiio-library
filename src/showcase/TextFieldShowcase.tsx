import { useState } from 'react'
import { FormField } from '@/components/FormField'
import { TextField, TEXTFIELD_SIZES } from '@/components/TextField'
import type { TocEntry } from '@/components/showcase-layout/TableOfContents'
import { SectionTitle, ColHeader, SpecLabel, SpecValue, SearchIcon, MailIcon } from './shared'

/* ─── ToC ─────────────────────────────────────────────────────────────────── */

export const TEXTFIELD_TOC: TocEntry[] = [
  { id: 'component-textfield',    label: 'TextField',                   level: 1 },
  { id: 'textfield-states',       label: 'States (with FormField)'               },
  { id: 'textfield-sizes',        label: 'Sizes'                                 },
  { id: 'textfield-patterns',     label: 'Patterns'                              },
  { id: 'textfield-layout-left',  label: 'Layout: Left'                          },
  { id: 'textfield-pill',         label: 'Pill'                                  },
  { id: 'textfield-standalone',   label: 'Standalone'                            },
]

/* ─── Showcase ────────────────────────────────────────────────────────────── */

export function TextFieldShowcase() {
  const [nameValue, setNameValue] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [pwValue, setPwValue] = useState('MyPassword123')
  const [emailValue, setEmailValue] = useState('')
  const [countValue, setCountValue] = useState('안녕하세요')
  const MAX_COUNT = 30

  return (
    <>
      <h1 id="component-textfield" className="typography-24-bold text-semantic-text-on-bright-900 mb-6 scroll-mt-6">
        TextField
      </h1>

      {/* States */}
      <section id="textfield-states" className="mb-12 scroll-mt-6">
        <SectionTitle>States (with FormField)</SectionTitle>
        <div className="grid grid-cols-2 gap-6 max-w-2xl">
          <FormField id="tf-default" label="이름" helperText="실명을 입력해 주세요.">
            <TextField
              placeholder="홍길동"
              value={nameValue}
              onChange={e => setNameValue(e.target.value)}
              clearable
              onClear={() => setNameValue('')}
            />
          </FormField>

          <FormField id="tf-error" label="이메일" error errorMessage="올바른 이메일 형식이 아닙니다.">
            <TextField type="email" defaultValue="invalid-email" placeholder="user@example.com" />
          </FormField>

          <FormField id="tf-positive" label="사용자명" helperText="사용 가능한 아이디입니다.">
            <TextField positive defaultValue="john_doe" placeholder="아이디" />
          </FormField>

          <FormField id="tf-disabled" label="회사명" disabled>
            <TextField defaultValue="Kiio Corp." placeholder="회사명" />
          </FormField>

          <FormField id="tf-readonly" label="가입일" readOnly>
            <TextField defaultValue="2026-03-11" />
          </FormField>

          <FormField id="tf-required" label="전화번호" required helperText="'-' 없이 입력하세요.">
            <TextField type="tel" placeholder="01012345678" />
          </FormField>
        </div>
      </section>

      {/* Sizes */}
      <section id="textfield-sizes" className="mb-12 scroll-mt-6">
        <SectionTitle>Sizes</SectionTitle>
        <div className="grid grid-cols-[80px_repeat(5,1fr)] gap-x-4 gap-y-2 max-w-4xl items-center">
          <div />
          {TEXTFIELD_SIZES.map(size => (
            <ColHeader key={size}>{size}</ColHeader>
          ))}

          <SpecLabel>Input</SpecLabel>
          {TEXTFIELD_SIZES.map(size => (
            <TextField key={size} size={size} placeholder={size} />
          ))}

          <SpecLabel>Height</SpecLabel>
          {(['24px', '32px', '40px', '48px', '56px'] as const).map((h, i) => (
            <SpecValue key={i}>{h}</SpecValue>
          ))}

          <SpecLabel>Font</SpecLabel>
          {(['12px', '13px', '14px', '15px', '16px'] as const).map((f, i) => (
            <SpecValue key={i}>{f}</SpecValue>
          ))}
        </div>
      </section>

      {/* Patterns */}
      <section id="textfield-patterns" className="mb-12 scroll-mt-6">
        <SectionTitle>Patterns</SectionTitle>
        <div className="grid grid-cols-2 gap-6 max-w-2xl">
          <FormField id="tf-search" label="검색">
            <TextField
              type="search"
              placeholder="검색어를 입력하세요"
              startEnhancer={<SearchIcon />}
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              clearable
              onClear={() => setSearchValue('')}
            />
          </FormField>

          <FormField id="tf-password" label="비밀번호" required description="영문, 숫자, 특수문자 포함 8자 이상">
            <TextField
              type="password"
              value={pwValue}
              onChange={e => setPwValue(e.target.value)}
              placeholder="비밀번호 입력"
            />
          </FormField>

          <FormField id="tf-email" label="이메일 주소">
            <TextField
              type="email"
              placeholder="user@company.com"
              startEnhancer={<MailIcon />}
              value={emailValue}
              onChange={e => setEmailValue(e.target.value)}
            />
          </FormField>

          <FormField id="tf-url" label="웹사이트">
            <TextField type="text" placeholder="mysite" startEnhancer="https://" endEnhancer=".com" />
          </FormField>

          <FormField id="tf-currency" label="금액">
            <TextField type="text" placeholder="0" startEnhancer="₩" endEnhancer="원" />
          </FormField>

          <FormField
            id="tf-count"
            label="소개"
            count={countValue.length}
            maxCount={MAX_COUNT}
            error={countValue.length > MAX_COUNT}
            errorMessage={countValue.length > MAX_COUNT ? `${MAX_COUNT}자를 초과했습니다.` : undefined}
          >
            <TextField
              value={countValue}
              onChange={e => setCountValue(e.target.value)}
              placeholder="자기소개를 입력하세요"
            />
          </FormField>
        </div>
      </section>

      {/* Layout: Left */}
      <section id="textfield-layout-left" className="mb-12 scroll-mt-6">
        <SectionTitle>Layout: Left</SectionTitle>
        <div className="flex flex-col gap-3 max-w-lg">
          <FormField id="left-name" label="이름" layout="left">
            <TextField placeholder="홍길동" />
          </FormField>
          <FormField id="left-email" label="이메일" layout="left">
            <TextField type="email" placeholder="user@example.com" />
          </FormField>
          <FormField id="left-pw" label="비밀번호" layout="left" required>
            <TextField type="password" placeholder="비밀번호 입력" />
          </FormField>
        </div>
      </section>

      {/* Pill */}
      <section id="textfield-pill" className="mb-12 scroll-mt-6">
        <SectionTitle>Pill</SectionTitle>
        <p className="typography-13-regular text-semantic-text-on-bright-400 mb-4">
          shape="pill"로 완전 둥근 끝(9999px) 적용.
        </p>
        <div className="flex flex-col gap-3 max-w-md">
          <TextField shape="pill" placeholder="Pill 텍스트 입력" />
          <TextField shape="pill" placeholder="Pill + 검색" startEnhancer={<SearchIcon />} />
          <TextField shape="pill" placeholder="Pill + 에러" error />
          <TextField shape="pill" size="large" placeholder="Pill Large" />
        </div>
      </section>

      {/* Standalone */}
      <section id="textfield-standalone" className="mb-12 scroll-mt-6">
        <SectionTitle>Standalone (without FormField)</SectionTitle>
        <div className="flex flex-col gap-3 max-w-xs">
          <TextField placeholder="기본 텍스트 입력" />
          <TextField placeholder="에러 상태" error />
          <TextField placeholder="성공 상태" positive defaultValue="유효한 값" />
          <TextField placeholder="비활성 상태" disabled defaultValue="비활성 값" />
          <TextField placeholder="읽기 전용" readOnly defaultValue="읽기 전용 값" />
        </div>
      </section>
    </>
  )
}
