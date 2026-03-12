import type { TocEntry } from '@/components/showcase-layout'
import { SectionTitle } from '@/showcase/shared'
import { FormField } from '@/components/FormField'
import { TextField } from '@/components/TextField'
import { Textarea } from '@/components/Textarea'
import { Select } from '@/components/Select'
import { useState } from 'react'

/* ─── TOC ─────────────────────────────────────────────────────────────────── */

export const FORMFIELD_TOC: TocEntry[] = [
  { id: 'component-formfield', label: 'FormField', level: 1 },
  { id: 'formfield-top-layout', label: 'Top Layout' },
  { id: 'formfield-left-layout', label: 'Left Layout' },
  { id: 'formfield-states', label: 'States' },
  { id: 'formfield-character-count', label: 'Character Count' },
  { id: 'formfield-with-inputs', label: 'With Various Inputs' },
]

/* ─── Showcase ────────────────────────────────────────────────────────────── */

export function FormFieldShowcase() {
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [errorName, setErrorName] = useState('홍길동')

  return (
    <div>
      {/* ── Title ── */}
      <section id="component-formfield" className="mb-6">
        <h1 className="typography-24-bold text-semantic-text-on-bright-900 mb-1">
          FormField
        </h1>
        <p className="typography-14-regular text-semantic-text-on-bright-500">
          입력 컴포넌트를 감싸는 구조적 컨테이너. Label, description, helper/error text, character count를 제공하고
          error/disabled/readOnly 상태를 Context로 자식에게 전파한다.
        </p>
      </section>

      {/* ── Top Layout ── */}
      <section id="formfield-top-layout" className="mb-12 scroll-mt-6">
        <SectionTitle>Top Layout (기본)</SectionTitle>
        <div className="flex flex-col gap-6 max-w-md">
          <FormField
            id="ff-top-basic"
            label="이름"
            helperText="실명을 입력해주세요."
          >
            <TextField placeholder="홍길동" />
          </FormField>

          <FormField
            id="ff-top-desc"
            label="이메일"
            required
            description="알림을 받을 이메일 주소입니다."
            helperText="개인 이메일을 권장합니다."
          >
            <TextField placeholder="user@example.com" />
          </FormField>

          <FormField
            id="ff-top-optional"
            label="닉네임"
            description="다른 사용자에게 표시됩니다."
          >
            <TextField placeholder="nickname" />
          </FormField>
        </div>
      </section>

      {/* ── Left Layout ── */}
      <section id="formfield-left-layout" className="mb-12 scroll-mt-6">
        <SectionTitle>Left Layout</SectionTitle>
        <div className="flex flex-col gap-3 max-w-lg">
          <FormField
            id="ff-left-name"
            label="이름"
            layout="left"
            required
          >
            <TextField placeholder="홍길동" />
          </FormField>

          <FormField
            id="ff-left-email"
            label="이메일"
            layout="left"
            required
            helperText="알림을 받을 이메일입니다."
          >
            <TextField placeholder="user@example.com" />
          </FormField>

          <FormField
            id="ff-left-phone"
            label="전화번호"
            layout="left"
            description="선택 항목입니다."
          >
            <TextField placeholder="010-0000-0000" />
          </FormField>
        </div>
      </section>

      {/* ── States ── */}
      <section id="formfield-states" className="mb-12 scroll-mt-6">
        <SectionTitle>States</SectionTitle>
        <div className="grid grid-cols-2 gap-6 max-w-2xl">
          {/* Default */}
          <FormField
            id="ff-state-default"
            label="Default"
            helperText="기본 상태입니다."
          >
            <TextField placeholder="입력해주세요" />
          </FormField>

          {/* Required */}
          <FormField
            id="ff-state-required"
            label="Required"
            required
            helperText="필수 입력 항목입니다."
          >
            <TextField placeholder="입력해주세요" />
          </FormField>

          {/* Error */}
          <FormField
            id="ff-state-error"
            label="Error"
            error
            errorMessage="이름은 2자 이상이어야 합니다."
          >
            <TextField
              value={errorName}
              onChange={(e) => setErrorName(e.target.value)}
            />
          </FormField>

          {/* Disabled */}
          <FormField
            id="ff-state-disabled"
            label="Disabled"
            disabled
            helperText="비활성화된 필드입니다."
          >
            <TextField value="비활성화" />
          </FormField>

          {/* ReadOnly */}
          <FormField
            id="ff-state-readonly"
            label="Read Only"
            readOnly
            helperText="읽기 전용 필드입니다."
          >
            <TextField value="수정 불가" />
          </FormField>

          {/* Error + Required */}
          <FormField
            id="ff-state-error-required"
            label="Error + Required"
            required
            error
            errorMessage="필수 항목을 입력해주세요."
          >
            <TextField placeholder="입력해주세요" />
          </FormField>
        </div>
      </section>

      {/* ── Character Count ── */}
      <section id="formfield-character-count" className="mb-12 scroll-mt-6">
        <SectionTitle>Character Count</SectionTitle>
        <div className="flex flex-col gap-6 max-w-md">
          <FormField
            id="ff-count-normal"
            label="이름"
            count={name.length}
            maxCount={20}
            helperText="최대 20자까지 입력 가능합니다."
          >
            <TextField
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름 입력"
            />
          </FormField>

          <FormField
            id="ff-count-over"
            label="자기소개"
            count={bio.length}
            maxCount={100}
            error={bio.length > 100}
            errorMessage="100자를 초과했습니다."
            helperText="간단한 자기소개를 작성해주세요."
          >
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="자기소개를 입력해주세요"
              size="large"
            />
          </FormField>
        </div>
      </section>

      {/* ── With Various Inputs ── */}
      <section id="formfield-with-inputs" className="mb-12 scroll-mt-6">
        <SectionTitle>With Various Inputs</SectionTitle>
        <div className="flex flex-col gap-6 max-w-md">
          <FormField
            id="ff-input-textfield"
            label="TextField"
            required
            helperText="기본 텍스트 입력"
          >
            <TextField placeholder="텍스트 입력" />
          </FormField>

          <FormField
            id="ff-input-textarea"
            label="Textarea"
            description="긴 텍스트를 입력할 수 있습니다."
          >
            <Textarea placeholder="내용을 입력해주세요" size="large" />
          </FormField>

          <FormField
            id="ff-input-select"
            label="Select"
            required
            helperText="옵션을 선택해주세요."
          >
            <Select
              placeholder="선택해주세요"
              options={[
                { value: 'option1', label: '옵션 1' },
                { value: 'option2', label: '옵션 2' },
                { value: 'option3', label: '옵션 3' },
              ]}
            />
          </FormField>
        </div>
      </section>
    </div>
  )
}
