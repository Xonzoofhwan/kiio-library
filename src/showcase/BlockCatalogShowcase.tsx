import { useContext } from 'react'
import { Button, BUTTON_HIERARCHIES, BUTTON_SIZES, BUTTON_SHAPES } from '@/components/Button'
import { ButtonEmphasized, BUTTON_EMP_COLORS } from '@/components/Button'
import { IconButton } from '@/components/Button/IconButton'
import { Icon } from '@/components/icons'
import type { TocEntry } from '@/components/showcase-layout'
import { NavigateContext } from '@/showcase/NavigateContext'
import { SectionTitle, ColHeader, RowHeader } from '@/showcase/shared'
import {
  ShowcaseHeader,
  ShowcaseSection,
  Playground,
  AnatomyBox,
  PropsTable,
  UsageGuidelines,
  CodeBlock,
  TokensReference,
  TokenChainTable,
  type PlaygroundConfig,
  type UsageGuidelineData,
  type CodeExampleData,
  type TokenGroupData,
  type TokenChainData,
} from './showcase-blocks'
import type { PropRow } from './spec-utils'

/* ═══════════════════════════════════════════════════════════════════════════
   TOC
   ═══════════════════════════════════════════════════════════════════════════ */

export const BLOCK_CATALOG_TOC: TocEntry[] = [
  { id: 'bc-header',         label: 'Header',            level: 1 },
  { id: 'bc-playground',     label: 'Playground'                   },
  { id: 'bc-all-variants',   label: 'All Variants Grid'            },
  { id: 'bc-variants',       label: 'Variants'                     },
  { id: 'bc-sizes',          label: 'Sizes'                        },
  { id: 'bc-shapes',         label: 'Shapes'                       },
  { id: 'bc-colors',         label: 'Colors'                       },
  { id: 'bc-icons',          label: 'With Icons'                   },
  { id: 'bc-width',          label: 'Width Modes'                  },
  { id: 'bc-states',         label: 'States Grid'                  },
  { id: 'bc-anatomy',        label: 'Anatomy'                      },
  { id: 'bc-props',          label: 'Props Table'                  },
  { id: 'bc-usage',          label: 'Usage Guidelines'             },
  { id: 'bc-code',           label: 'Code Recipes'                 },
  { id: 'bc-a11y',           label: 'Accessibility'                },
  { id: 'bc-token-chain',    label: 'Token Chain'                  },
  { id: 'bc-tokens',         label: 'Design Tokens'                },
  { id: 'bc-spacing',        label: 'Spacing Diagram'              },
  { id: 'bc-related',        label: 'Related Components'           },
]

/* ═══════════════════════════════════════════════════════════════════════════
   Data
   ═══════════════════════════════════════════════════════════════════════════ */

/* ─── Playground ─────────────────────────────────────────────────────────── */

const playgroundConfig: PlaygroundConfig = {
  controls: {
    hierarchy: { kind: 'select', options: BUTTON_HIERARCHIES },
    size:      { kind: 'select', options: BUTTON_SIZES },
    shape:     { kind: 'select', options: BUTTON_SHAPES },
    disabled:  { kind: 'boolean' },
    loading:   { kind: 'boolean' },
    label:     { kind: 'text' },
  },
  defaults: {
    hierarchy: 'primary',
    size: 'large',
    shape: 'basic',
    disabled: false,
    loading: false,
    label: 'Button',
  },
  render: (props) => (
    <Button
      hierarchy={props.hierarchy as 'primary'}
      size={props.size as 'large'}
      shape={props.shape as 'basic'}
      disabled={props.disabled as boolean}
      loading={props.loading as boolean}
    >
      {props.label as string}
    </Button>
  ),
}

/* ─── Props ──────────────────────────────────────────────────────────────── */

const buttonProps: PropRow[] = [
  { name: 'hierarchy',    type: "'primary' | 'secondary' | 'outlined' | 'ghost'", default: "'primary'",  description: '버튼의 시각적 계층. 중요도에 따라 선택.' },
  { name: 'size',         type: "'xLarge' | 'large' | 'medium' | 'small'",        default: "'medium'",   description: '버튼 크기. 컨텍스트에 맞는 크기 사용.' },
  { name: 'shape',        type: "'basic' | 'circular' | 'square'",                default: "'basic'",    description: 'Border-radius 형태.' },
  { name: 'fullWidth',    type: 'boolean',                                        default: 'false',      description: '부모 너비에 맞춰 확장.' },
  { name: 'disabled',     type: 'boolean',                                        default: 'false',      description: '비활성 상태. 상호작용 불가.' },
  { name: 'loading',      type: 'boolean',                                        default: 'false',      description: '로딩 상태. 스피너 표시, 콘텐츠 숨김, 상호작용 불가.' },
  { name: 'iconLeading',  type: 'ReactNode',                                      default: '—',          description: '텍스트 앞 아이콘 슬롯. 내부에서 크기 자동 적용.' },
  { name: 'iconTrailing', type: 'ReactNode',                                      default: '—',          description: '텍스트 뒤 아이콘 슬롯.' },
  { name: 'asChild',      type: 'boolean',                                        default: 'false',      description: 'Radix Slot — 자식 요소에 스타일 위임.' },
  { name: 'children',     type: 'ReactNode',                                      default: '—',          description: '버튼 라벨 텍스트.' },
]

/* ─── Usage Guidelines ───────────────────────────────────────────────────── */

const usageData: UsageGuidelineData = {
  doUse: [
    '사용자 행동을 유도하는 주요 CTA (회원가입, 구매, 시작하기)',
    '폼 제출, 다이얼로그 확인/취소 등 명시적 액션',
    '한 화면에 primary는 1개, 보조 액션은 secondary/outlined 사용',
  ],
  dontUse: [
    { text: '페이지 이동이나 링크 역할', alternative: 'text-button', alternativeLabel: 'TextButton' },
    { text: '아이콘만 필요한 경우 (라벨 없음)', alternative: 'icon-button', alternativeLabel: 'IconButton' },
    { text: '상태 표시나 필터링 (토글 동작)', alternative: 'chip-universal', alternativeLabel: 'Chip' },
  ],
  related: [
    { id: 'text-button', label: 'TextButton' },
    { id: 'icon-button', label: 'IconButton' },
    { id: 'chip-universal', label: 'Chip' },
  ],
}

/* ─── Code examples ──────────────────────────────────────────────────────── */

const codeExamples: CodeExampleData[] = [
  {
    title: 'Basic usage',
    code: `import { Button } from '@/components/Button'

<Button hierarchy="primary" size="large">
  시작하기
</Button>`,
  },
  {
    title: 'With icons',
    description: 'iconLeading/iconTrailing에 ReactNode를 전달. 컴포넌트가 size에 맞게 아이콘 크기를 자동 조절.',
    code: `<Button
  hierarchy="secondary"
  size="large"
  iconLeading={<Icon name="add" />}
>
  새 항목 추가
</Button>

<Button
  hierarchy="outlined"
  size="medium"
  iconLeading={<Icon name="download" />}
  iconTrailing={<Icon name="chevron_right" />}
>
  다운로드
</Button>`,
  },
  {
    title: 'Loading state',
    description: '비동기 작업 진행 시 loading prop으로 스피너 표시. 콘텐츠는 invisible로 숨기고 레이아웃은 유지.',
    code: `const [loading, setLoading] = useState(false)

const handleSubmit = async () => {
  setLoading(true)
  await submitForm()
  setLoading(false)
}

<Button loading={loading} onClick={handleSubmit}>
  제출
</Button>`,
  },
]

/* ─── Token Chain ────────────────────────────────────────────────────────── */

const tokenChains: TokenChainData[] = [
  {
    title: 'Primary hierarchy — Background & Content',
    rows: [
      { component: '--comp-button-bg-primary',      semantic: '--semantic-neutral-solid-950', lightPrimitive: 'gray-950', lightHex: '#1a1a1e', darkPrimitive: 'gray-0',   darkHex: '#fdfefe' },
      { component: '--comp-button-content-primary',  semantic: '--semantic-neutral-solid-0',   lightPrimitive: 'gray-0',   lightHex: '#fdfefe', darkPrimitive: 'gray-950', darkHex: '#1a1a1e' },
    ],
  },
  {
    title: 'Secondary hierarchy — Background & Content',
    rows: [
      { component: '--comp-button-bg-secondary',     semantic: '--semantic-neutral-solid-200', lightPrimitive: 'gray-200', lightHex: '#e0e0e2', darkPrimitive: 'gray-800', darkHex: '#38383c' },
      { component: '--comp-button-content-secondary', semantic: '--semantic-text-on-bright-800', lightPrimitive: 'black-alpha-800', lightHex: 'rgba(16,19,19,0.82)', darkPrimitive: 'white-alpha-800', darkHex: 'rgba(255,255,255,0.82)' },
    ],
  },
]

/* ─── Design Tokens ──────────────────────────────────────────────────────── */

const tokenGroups: TokenGroupData[] = [
  {
    title: 'Height',
    scope: ':root',
    tokens: [
      { name: '--comp-button-height-xl', value: '56px' },
      { name: '--comp-button-height-lg', value: '48px' },
      { name: '--comp-button-height-md', value: '40px' },
      { name: '--comp-button-height-sm', value: '32px' },
    ],
  },
  {
    title: 'Horizontal padding',
    scope: ':root',
    tokens: [
      { name: '--comp-button-px-xl', value: '20px' },
      { name: '--comp-button-px-lg', value: '16px' },
      { name: '--comp-button-px-md', value: '12px' },
      { name: '--comp-button-px-sm', value: '10px' },
    ],
  },
  {
    title: 'Gap (icon ↔ label)',
    scope: ':root',
    tokens: [
      { name: '--comp-button-gap-xl', value: '8px' },
      { name: '--comp-button-gap-lg', value: '6px' },
      { name: '--comp-button-gap-md', value: '2px' },
      { name: '--comp-button-gap-sm', value: '2px' },
    ],
  },
  {
    title: 'Icon size',
    scope: ':root',
    tokens: [
      { name: '--comp-button-icon-xl', value: '24px' },
      { name: '--comp-button-icon-lg', value: '20px' },
      { name: '--comp-button-icon-md', value: '18px' },
      { name: '--comp-button-icon-sm', value: '16px' },
    ],
  },
  {
    title: 'Border radius',
    scope: ':root',
    tokens: [
      { name: '--comp-button-radius-xl', value: '12px' },
      { name: '--comp-button-radius-lg', value: '12px' },
      { name: '--comp-button-radius-md', value: '12px' },
      { name: '--comp-button-radius-sm', value: '8px' },
    ],
  },
]

/* ═══════════════════════════════════════════════════════════════════════════
   Showcase
   ═══════════════════════════════════════════════════════════════════════════ */

export function BlockCatalogShowcase() {
  const navigate = useContext(NavigateContext)

  return (
    <>
      {/* ────────────────────────────────────────────────────────────────
          1. ShowcaseHeader
          ──────────────────────────────────────────────────────────────── */}
      <ShowcaseSection id="bc-header" title="Block: ShowcaseHeader" description="페이지 최상단. Group Name + Component Name + Description + Classification badge.">
        <div className="border border-dashed border-semantic-divider-solid-200 rounded-3 p-6">
          <ShowcaseHeader
            id="_demo-header"
            name="Button"
            description="다양한 계층과 크기를 지원하는 범용 버튼 컴포넌트. 주요 액션부터 보조 액션까지, 문맥에 맞는 시각적 계층을 제공합니다."
            classification="Primitive"
            groupName="Actions"
          />
        </div>
      </ShowcaseSection>

      {/* ────────────────────────────────────────────────────────────────
          2. Playground
          ──────────────────────────────────────────────────────────────── */}
      <ShowcaseSection id="bc-playground" title="Block: Playground" description="인터랙티브 프리뷰 + 컨트롤 패널. select, boolean, text, slot 컨트롤 타입 지원.">
        <Playground config={playgroundConfig} />
      </ShowcaseSection>

      {/* ────────────────────────────────────────────────────────────────
          3. All Variants Grid
          ──────────────────────────────────────────────────────────────── */}
      <ShowcaseSection id="bc-all-variants" title="Block: All Variants Grid" description="모든 주요 variant 조합을 한눈에 보여주는 매트릭스. Spec 탭의 핵심 섹션.">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th />
                {BUTTON_SIZES.map(size => (
                  <th key={size} className="px-3 pb-3">
                    <ColHeader>{size}</ColHeader>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BUTTON_HIERARCHIES.map(hierarchy => (
                <tr key={hierarchy}>
                  <td className="pr-4 py-3">
                    <RowHeader>{hierarchy}</RowHeader>
                  </td>
                  {BUTTON_SIZES.map(size => (
                    <td key={size} className="px-3 py-3">
                      <Button hierarchy={hierarchy} size={size}>Button</Button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ShowcaseSection>

      {/* ────────────────────────────────────────────────────────────────
          4. Visual Demos — Variants
          ──────────────────────────────────────────────────────────────── */}
      <section id="bc-variants" className="mb-12 scroll-mt-6">
        <SectionTitle>Block: Visual Demos — Variants</SectionTitle>
        <p className="typography-13-regular text-semantic-text-on-bright-400 mb-4">
          각 variant를 가로로 나열. 시각적 차이를 직접 비교.
        </p>
        <div className="flex flex-wrap gap-3 items-center">
          {BUTTON_HIERARCHIES.map(h => (
            <Button key={h} hierarchy={h} size="large">{h}</Button>
          ))}
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────
          5. Visual Demos — Sizes
          ──────────────────────────────────────────────────────────────── */}
      <section id="bc-sizes" className="mb-12 scroll-mt-6">
        <SectionTitle>Block: Visual Demos — Sizes</SectionTitle>
        <p className="typography-13-regular text-semantic-text-on-bright-400 mb-4">
          Baseline 정렬로 크기 차이를 직관적으로 표현.
        </p>
        <div className="flex flex-wrap gap-3 items-end">
          {BUTTON_SIZES.map(s => (
            <Button key={s} size={s}>{s}</Button>
          ))}
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────
          6. Visual Demos — Shapes
          ──────────────────────────────────────────────────────────────── */}
      <section id="bc-shapes" className="mb-12 scroll-mt-6">
        <SectionTitle>Block: Visual Demos — Shapes</SectionTitle>
        <p className="typography-13-regular text-semantic-text-on-bright-400 mb-4">
          동일 콘텐츠로 shape만 변경하여 나란히 비교.
        </p>
        <div className="flex flex-wrap gap-6">
          {BUTTON_SHAPES.map(shape => (
            <div key={shape} className="flex flex-col items-center gap-2">
              <ColHeader>{shape}</ColHeader>
              <Button shape={shape} size="large">Button</Button>
            </div>
          ))}
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────
          7. Visual Demos — Colors
          ──────────────────────────────────────────────────────────────── */}
      <section id="bc-colors" className="mb-12 scroll-mt-6">
        <SectionTitle>Block: Visual Demos — Colors</SectionTitle>
        <p className="typography-13-regular text-semantic-text-on-bright-400 mb-4">
          색상 팔레트가 있는 컴포넌트 (ButtonEmphasized) — 각 color를 가로 나열.
        </p>
        <div className="flex flex-wrap gap-3 items-center">
          {BUTTON_EMP_COLORS.map(color => (
            <ButtonEmphasized key={color} color={color} hierarchy="primary" size="large">
              {color}
            </ButtonEmphasized>
          ))}
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────
          8. Visual Demos — With Icons
          ──────────────────────────────────────────────────────────────── */}
      <section id="bc-icons" className="mb-12 scroll-mt-6">
        <SectionTitle>Block: Visual Demos — With Icons</SectionTitle>
        <p className="typography-13-regular text-semantic-text-on-bright-400 mb-4">
          아이콘 슬롯 조합: leading, trailing, both, icon-only.
        </p>
        <div className="flex flex-wrap gap-3 items-center">
          <Button size="large" iconLeading={<Icon name="add" />}>
            Leading
          </Button>
          <Button size="large" iconTrailing={<Icon name="chevron_right" />}>
            Trailing
          </Button>
          <Button size="large" iconLeading={<Icon name="download" />} iconTrailing={<Icon name="chevron_right" />}>
            Both
          </Button>
          <IconButton size="large" icon={<Icon name="add" />} aria-label="추가" />
        </div>
        <p className="mt-3 typography-12-medium text-semantic-text-on-bright-400">
          Icon-only는 별도 컴포넌트 IconButton 사용. aria-label 필수.
        </p>
      </section>

      {/* ────────────────────────────────────────────────────────────────
          9. Visual Demos — Width Modes
          ──────────────────────────────────────────────────────────────── */}
      <section id="bc-width" className="mb-12 scroll-mt-6">
        <SectionTitle>Block: Visual Demos — Width Modes</SectionTitle>
        <p className="typography-13-regular text-semantic-text-on-bright-400 mb-4">
          hug(기본) vs fill(fullWidth) 수직 비교.
        </p>
        <div className="flex flex-col gap-3 max-w-[400px]">
          <div>
            <span className="typography-12-medium text-semantic-text-on-bright-400 mb-1 block">hug (default)</span>
            <Button size="large">Button</Button>
          </div>
          <div>
            <span className="typography-12-medium text-semantic-text-on-bright-400 mb-1 block">fill (fullWidth)</span>
            <Button size="large" fullWidth>Button</Button>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────────
          10. States Grid
          ──────────────────────────────────────────────────────────────── */}
      <ShowcaseSection id="bc-states" title="Block: States Grid" description="hierarchy(열) × state(행) 매트릭스. Hover/Focus는 직접 조작해야 하므로 주석 처리.">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th />
                {BUTTON_HIERARCHIES.map(h => (
                  <th key={h} className="px-3 pb-3">
                    <ColHeader>{h}</ColHeader>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Default */}
              <tr>
                <td className="pr-4 py-3"><RowHeader>Default</RowHeader></td>
                {BUTTON_HIERARCHIES.map(h => (
                  <td key={h} className="px-3 py-3">
                    <Button hierarchy={h} size="medium">Button</Button>
                  </td>
                ))}
              </tr>
              {/* Hover */}
              <tr>
                <td className="pr-4 py-3"><RowHeader>Hover</RowHeader></td>
                {BUTTON_HIERARCHIES.map(h => (
                  <td key={h} className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <Button hierarchy={h} size="medium">Button</Button>
                      <span className="typography-12-regular text-semantic-text-on-bright-400 italic">hover to preview</span>
                    </div>
                  </td>
                ))}
              </tr>
              {/* Focus */}
              <tr>
                <td className="pr-4 py-3"><RowHeader>Focus</RowHeader></td>
                {BUTTON_HIERARCHIES.map(h => (
                  <td key={h} className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <Button hierarchy={h} size="medium">Button</Button>
                      <span className="typography-12-regular text-semantic-text-on-bright-400 italic">tab to preview</span>
                    </div>
                  </td>
                ))}
              </tr>
              {/* Disabled */}
              <tr>
                <td className="pr-4 py-3"><RowHeader>Disabled</RowHeader></td>
                {BUTTON_HIERARCHIES.map(h => (
                  <td key={h} className="px-3 py-3">
                    <Button hierarchy={h} size="medium" disabled>Button</Button>
                  </td>
                ))}
              </tr>
              {/* Loading */}
              <tr>
                <td className="pr-4 py-3"><RowHeader>Loading</RowHeader></td>
                {BUTTON_HIERARCHIES.map(h => (
                  <td key={h} className="px-3 py-3">
                    <Button hierarchy={h} size="medium" loading>Button</Button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </ShowcaseSection>

      {/* ────────────────────────────────────────────────────────────────
          11. Anatomy
          ──────────────────────────────────────────────────────────────── */}
      <ShowcaseSection id="bc-anatomy" title="Block: Anatomy" description="Compound 컴포넌트의 구조 트리. 각 노드의 역할을 시각적으로 표현.">
        <div className="flex flex-col gap-6">
          {/* ASCII tree */}
          <pre className="typography-14-regular text-semantic-text-on-bright-700 leading-relaxed bg-semantic-neutral-solid-50 rounded-3 p-5">
{`Tab (TabGroup)              — 상태 관리 (value, variant, size)
├── Tab.List                — 탭 버튼 컨테이너, overflow 스크롤
│   ├── Tab.Item            — 개별 탭 버튼 (value, disabled, badge)
│   └── Indicator           — 슬라이딩 하단 인디케이터 (자동 위치/너비)
└── Tab.Panel               — value 매칭 시 렌더되는 콘텐츠 영역`}
          </pre>

          {/* AnatomyBox visual */}
          <AnatomyBox label="Tab (Root)">
            <div className="p-4 flex flex-col gap-3">
              <AnatomyBox label="Tab.List" dashed={false}>
                <div className="p-3 flex gap-2">
                  <AnatomyBox label="Tab.Item" className="px-4 py-2">
                    <span className="typography-13-regular text-semantic-text-on-bright-600 p-2">탭 1</span>
                  </AnatomyBox>
                  <AnatomyBox label="Tab.Item" className="px-4 py-2">
                    <span className="typography-13-regular text-semantic-text-on-bright-600 p-2">탭 2</span>
                  </AnatomyBox>
                </div>
              </AnatomyBox>
              <AnatomyBox label="Tab.Panel" dashed={false}>
                <div className="p-4">
                  <span className="typography-13-regular text-semantic-text-on-bright-400">탭 콘텐츠 영역</span>
                </div>
              </AnatomyBox>
            </div>
          </AnatomyBox>
        </div>
      </ShowcaseSection>

      {/* ────────────────────────────────────────────────────────────────
          12. Props Table
          ──────────────────────────────────────────────────────────────── */}
      <ShowcaseSection id="bc-props" title="Block: Props Table" description="정렬 가능한 props 명세 테이블. Prop/Default 열 정렬 지원.">
        <PropsTable props={buttonProps} title="Button" />
      </ShowcaseSection>

      {/* ────────────────────────────────────────────────────────────────
          13. Usage Guidelines
          ──────────────────────────────────────────────────────────────── */}
      <ShowcaseSection id="bc-usage" title="Block: Usage Guidelines" description="Do/Don't 리스트 + 대안 컴포넌트 링크 + Related Components.">
        <UsageGuidelines data={usageData} onNavigate={navigate} />
      </ShowcaseSection>

      {/* ────────────────────────────────────────────────────────────────
          14. Code Recipes
          ──────────────────────────────────────────────────────────────── */}
      <ShowcaseSection id="bc-code" title="Block: Code Recipes" description="점진적 복잡도 순서. Basic → Feature-specific → Advanced.">
        {codeExamples.map((ex) => (
          <CodeBlock key={ex.title} code={ex.code} title={ex.title} description={ex.description} />
        ))}
      </ShowcaseSection>

      {/* ────────────────────────────────────────────────────────────────
          15. Accessibility
          ──────────────────────────────────────────────────────────────── */}
      <ShowcaseSection id="bc-a11y" title="Block: Accessibility" description="키보드 인터랙션 테이블 + ARIA 속성 목록.">
        <div className="space-y-6">
          {/* Keyboard */}
          <div>
            <h3 className="typography-14-semibold text-semantic-text-on-bright-700 mb-2">Keyboard</h3>
            <div className="border border-semantic-divider-solid-100 rounded-2 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-semantic-divider-solid-200 bg-semantic-neutral-solid-50">
                    <th className="typography-13-semibold text-semantic-text-on-bright-500 px-4 py-2.5">Key</th>
                    <th className="typography-13-semibold text-semantic-text-on-bright-500 px-4 py-2.5">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Enter', '버튼 클릭 동작 실행'],
                    ['Space', '버튼 클릭 동작 실행'],
                    ['Tab', '다음 포커스 가능 요소로 이동'],
                    ['Shift + Tab', '이전 포커스 가능 요소로 이동'],
                  ].map(([key, action]) => (
                    <tr key={key} className="border-b border-semantic-divider-solid-50">
                      <td className="typography-13-medium text-semantic-text-on-bright-700 font-mono px-4 py-2.5 whitespace-nowrap">{key}</td>
                      <td className="typography-13-regular text-semantic-text-on-bright-600 px-4 py-2.5">{action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ARIA */}
          <div>
            <h3 className="typography-14-semibold text-semantic-text-on-bright-700 mb-2">ARIA</h3>
            <div className="border border-semantic-divider-solid-100 rounded-2 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-semantic-divider-solid-200 bg-semantic-neutral-solid-50">
                    <th className="typography-13-semibold text-semantic-text-on-bright-500 px-4 py-2.5">Attribute</th>
                    <th className="typography-13-semibold text-semantic-text-on-bright-500 px-4 py-2.5">Value</th>
                    <th className="typography-13-semibold text-semantic-text-on-bright-500 px-4 py-2.5">Condition</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['role', '"button"', '기본 (네이티브 <button>이므로 자동)'],
                    ['aria-disabled', '"true"', 'disabled={true}일 때'],
                    ['aria-busy', '"true"', 'loading={true}일 때'],
                    ['aria-label', '(string)', 'IconButton — 시각적 라벨 없을 때 필수'],
                  ].map(([attr, value, condition]) => (
                    <tr key={attr} className="border-b border-semantic-divider-solid-50">
                      <td className="typography-13-medium text-semantic-emphasized-purple-500 font-mono px-4 py-2.5 whitespace-nowrap">{attr}</td>
                      <td className="typography-13-regular text-semantic-text-on-bright-700 font-mono px-4 py-2.5">{value}</td>
                      <td className="typography-13-regular text-semantic-text-on-bright-600 px-4 py-2.5">{condition}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </ShowcaseSection>

      {/* ────────────────────────────────────────────────────────────────
          16. Token Chain Table
          ──────────────────────────────────────────────────────────────── */}
      <ShowcaseSection id="bc-token-chain" title="Block: Token Chain Table" description="컴포넌트 → 시맨틱 → 프리미티브 3레이어 색상 토큰 체인. Light/Dark 비교.">
        <TokenChainTable chains={tokenChains} />
      </ShowcaseSection>

      {/* ────────────────────────────────────────────────────────────────
          17. Design Tokens
          ──────────────────────────────────────────────────────────────── */}
      <ShowcaseSection id="bc-tokens" title="Block: Design Tokens" description="Layout 토큰 목록 (theme-agnostic). 그룹별 name-value 리스트.">
        <TokensReference groups={tokenGroups} />
      </ShowcaseSection>

      {/* ────────────────────────────────────────────────────────────────
          18. Spacing/Sizing Diagram
          ──────────────────────────────────────────────────────────────── */}
      <ShowcaseSection id="bc-spacing" title="Block: Spacing/Sizing Diagram" description="컴포넌트 내부 구조의 측정값을 시각화. 높이, 패딩, 갭, 아이콘 크기, border-radius.">
        <div className="flex flex-col gap-8">
          {/* Button Large 해부도 */}
          <div className="relative inline-flex flex-col items-start gap-3">
            <span className="typography-13-semibold text-semantic-text-on-bright-600">Button — size: large</span>

            <div className="relative">
              {/* Height indicator */}
              <div className="absolute -left-12 top-0 h-full flex flex-col items-center justify-center">
                <div className="w-px h-full bg-semantic-emphasized-purple-400" />
                <span className="absolute typography-11-medium text-semantic-emphasized-purple-500 bg-semantic-background-0 px-1 whitespace-nowrap" style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)' }}>
                  48px
                </span>
              </div>

              {/* Button with measurement overlays */}
              <div className="relative border-2 border-dashed border-semantic-emphasized-purple-300 rounded-3 overflow-hidden">
                {/* Padding left indicator */}
                <div className="absolute left-0 top-0 h-full w-4 bg-semantic-emphasized-purple-50 border-r border-dashed border-semantic-emphasized-purple-300 flex items-end justify-center pb-1">
                  <span className="typography-10-medium text-semantic-emphasized-purple-500 whitespace-nowrap" style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)' }}>16px</span>
                </div>

                {/* Padding right indicator */}
                <div className="absolute right-0 top-0 h-full w-4 bg-semantic-emphasized-purple-50 border-l border-dashed border-semantic-emphasized-purple-300 flex items-end justify-center pb-1">
                  <span className="typography-10-medium text-semantic-emphasized-purple-500 whitespace-nowrap" style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)' }}>16px</span>
                </div>

                {/* Actual button */}
                <Button size="large" iconLeading={<Icon name="add" />}>
                  Button Label
                </Button>
              </div>

              {/* Gap indicator */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1">
                <span className="typography-11-medium text-semantic-emphasized-purple-500">gap: 6px</span>
                <span className="typography-11-regular text-semantic-text-on-bright-400">·</span>
                <span className="typography-11-medium text-semantic-emphasized-purple-500">icon: 20px</span>
                <span className="typography-11-regular text-semantic-text-on-bright-400">·</span>
                <span className="typography-11-medium text-semantic-emphasized-purple-500">radius: 12px</span>
              </div>
            </div>
          </div>

          {/* Size comparison */}
          <div className="flex gap-6 items-end mt-4">
            {(['xLarge', 'large', 'medium', 'small'] as const).map(size => {
              const measurements: Record<string, { h: string; px: string; icon: string; r: string }> = {
                xLarge: { h: '56px', px: '20px', icon: '24px', r: '12px' },
                large:  { h: '48px', px: '16px', icon: '20px', r: '12px' },
                medium: { h: '40px', px: '12px', icon: '18px', r: '12px' },
                small:  { h: '32px', px: '10px', icon: '16px', r: '8px' },
              }
              const m = measurements[size]
              return (
                <div key={size} className="flex flex-col items-center gap-2">
                  <Button size={size} iconLeading={<Icon name="add" />}>Label</Button>
                  <div className="flex flex-col items-center">
                    <span className="typography-11-medium text-semantic-text-on-bright-500">{size}</span>
                    <span className="typography-10-regular text-semantic-text-on-bright-400">
                      {m.h} · px {m.px} · icon {m.icon} · r {m.r}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </ShowcaseSection>

      {/* ────────────────────────────────────────────────────────────────
          19. Related Components
          ──────────────────────────────────────────────────────────────── */}
      <ShowcaseSection id="bc-related" title="Block: Related Components" description="자매/대안 컴포넌트 pill-style 링크. UsageGuidelines 없이 단독으로도 사용 가능.">
        <div className="flex gap-2 flex-wrap">
          {[
            { id: 'text-button', label: 'TextButton' },
            { id: 'icon-button', label: 'IconButton' },
            { id: 'chip-universal', label: 'Chip' },
            { id: 'tab', label: 'Tab' },
          ].map(r => (
            <button
              key={r.id}
              onClick={() => navigate(r.id)}
              className="typography-13-medium text-semantic-emphasized-purple-500 bg-semantic-emphasized-purple-50 hover:bg-semantic-emphasized-purple-100 px-3 py-1.5 rounded-full transition-colors duration-fast ease-enter cursor-pointer"
            >
              {r.label}
            </button>
          ))}
        </div>
      </ShowcaseSection>
    </>
  )
}
