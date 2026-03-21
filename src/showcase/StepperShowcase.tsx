import { useState, useContext } from 'react'
import { Stepper, StepItem, STEPPER_SIZES, STEPPER_ORIENTATIONS, STEPPER_VARIANTS } from '@/components/Stepper'
import type { StepperSize, StepperOrientation, StepperVariant } from '@/components/Stepper'
import type { TocEntry } from '@/components/showcase-layout/TableOfContents'
import { NavigateContext } from '@/showcase/NavigateContext'
import { SectionTitle } from './shared'
import {
  ShowcaseHeader,
  ShowcaseSection,
  Playground,
  UsageGuidelines,
  CodeBlock,
  TokensReference,
  type PlaygroundConfig,
  type UsageGuidelineData,
  type CodeExampleData,
  type TokenGroupData,
} from './showcase-blocks'
import { extractHeader } from './spec-utils'
import stepperSpec from '../../specs/stepper.json'

/* ─── Spec data ───────────────────────────────────────────────────────────── */

const header = extractHeader(stepperSpec)

/* ─── Playground config ───────────────────────────────────────────────────── */

const playgroundConfig: PlaygroundConfig = {
  controls: {
    size:        { kind: 'select', options: STEPPER_SIZES },
    orientation: { kind: 'select', options: STEPPER_ORIENTATIONS },
    variant:     { kind: 'select', options: STEPPER_VARIANTS },
    currentStep: { kind: 'select', options: ['0', '1', '2', '3'] as const },
    navigable:   { kind: 'select', options: ['false', 'true'] as const },
  },
  defaults: {
    size: 'medium',
    orientation: 'horizontal',
    variant: 'numbered',
    currentStep: '1',
    navigable: 'false',
  },
  render: (props) => (
    <Stepper
      currentStep={Number(props.currentStep as string)}
      size={props.size as StepperSize}
      orientation={props.orientation as StepperOrientation}
      variant={props.variant as StepperVariant}
      navigable={props.navigable === 'true'}
    >
      <StepItem label="Account" description="Create your account" />
      <StepItem label="Profile" description="Set up your profile" />
      <StepItem label="Review" description="Review your info" />
      <StepItem label="Complete" description="All done" />
    </Stepper>
  ),
}

/* ─── Usage guidelines ────────────────────────────────────────────────────── */

const usageData: UsageGuidelineData = {
  doUse: [
    'Multi-step forms (checkout, onboarding, registration)',
    'Showing progress through a linear workflow',
    'Enabling navigation back to completed steps with navigable prop',
  ],
  dontUse: [
    { text: 'Continuous progress — use ProgressBar', alternative: 'progress', alternativeLabel: 'Progress' },
    { text: 'Tab-like navigation between equal sections', alternative: 'tab', alternativeLabel: 'Tab' },
    { text: 'Non-linear workflows where steps can be skipped freely' },
  ],
  related: [
    { id: 'progress', label: 'Progress' },
    { id: 'tab', label: 'Tab' },
  ],
}

/* ─── Code examples ───────────────────────────────────────────────────────── */

const codeExamples: CodeExampleData[] = [
  {
    title: 'Basic',
    code: `<Stepper currentStep={1}>
  <StepItem label="Step 1" />
  <StepItem label="Step 2" />
  <StepItem label="Step 3" />
</Stepper>`,
  },
  {
    title: 'With descriptions',
    code: `<Stepper currentStep={2} size="large">
  <StepItem label="Account" description="Create account" />
  <StepItem label="Profile" description="Set up profile" />
  <StepItem label="Done" description="All set!" />
</Stepper>`,
  },
  {
    title: 'Navigable',
    code: `const [step, setStep] = useState(2)

<Stepper currentStep={step} navigable onStepClick={setStep}>
  <StepItem label="Step 1" />
  <StepItem label="Step 2" />
  <StepItem label="Step 3" />
  <StepItem label="Step 4" />
</Stepper>`,
  },
  {
    title: 'Error state',
    code: `<Stepper currentStep={1}>
  <StepItem label="Upload" />
  <StepItem label="Validate" status="error" />
  <StepItem label="Complete" />
</Stepper>`,
  },
]

/* ─── Token data ──────────────────────────────────────────────────────────── */

const tokenGroups: TokenGroupData[] = [
  {
    title: 'Size & Spacing',
    scope: ':root',
    tokens: [
      { name: '--comp-stepper-indicator-sm', value: '24px' },
      { name: '--comp-stepper-indicator-md', value: '32px' },
      { name: '--comp-stepper-indicator-lg', value: '40px' },
      { name: '--comp-stepper-connector-width', value: '2px' },
      { name: '--comp-stepper-gap-sm', value: '8px' },
      { name: '--comp-stepper-gap-md', value: '12px' },
      { name: '--comp-stepper-gap-lg', value: '16px' },
    ],
  },
  {
    title: 'Color',
    scope: '[data-theme]',
    tokens: [
      { name: '--comp-stepper-completed-bg', value: 'semantic-primary-500' },
      { name: '--comp-stepper-current-border', value: 'semantic-primary-500' },
      { name: '--comp-stepper-upcoming-bg', value: 'semantic-neutral-solid-100' },
      { name: '--comp-stepper-connector-active', value: 'semantic-primary-500' },
      { name: '--comp-stepper-connector-inactive', value: 'semantic-neutral-solid-200' },
      { name: '--comp-stepper-error-bg', value: 'semantic-error-500' },
    ],
  },
]

/* ─── ToC ─────────────────────────────────────────────────────────────────── */

export const STEPPER_TOC: TocEntry[] = [
  { id: 'component-stepper',         label: 'Stepper',            level: 1 },
  { id: 'stepper-playground',        label: 'Playground'                   },
  { id: 'stepper-sizes',             label: 'Sizes'                        },
  { id: 'stepper-variants',          label: 'Variants'                     },
  { id: 'stepper-orientations',      label: 'Orientations'                 },
  { id: 'stepper-navigable',         label: 'Navigable'                    },
  { id: 'stepper-error',             label: 'Error State'                  },
  { id: 'stepper-usage',             label: 'Usage Guidelines'             },
  { id: 'stepper-code',              label: 'Code Examples'                },
  { id: 'stepper-tokens',            label: 'Design Tokens'                },
]

/* ─── Showcase ────────────────────────────────────────────────────────────── */

export function StepperShowcase() {
  const navigate = useContext(NavigateContext)
  const [navStep, setNavStep] = useState(2)

  return (
    <>
      {/* 1. Header */}
      <ShowcaseHeader
        id="component-stepper"
        name={header.name}
        description={header.description}
        classification={header.classification}
      />

      {/* 2. Playground */}
      <ShowcaseSection id="stepper-playground" title="Playground">
        <Playground config={playgroundConfig} />
      </ShowcaseSection>

      {/* 3. Sizes */}
      <section id="stepper-sizes" className="mb-10 scroll-mt-6">
        <SectionTitle>Sizes</SectionTitle>
        <div className="flex flex-col gap-8">
          {STEPPER_SIZES.map(s => (
            <div key={s}>
              <span className="typography-13-semibold text-semantic-text-on-bright-500 mb-3 block">{s}</span>
              <Stepper currentStep={1} size={s}>
                <StepItem label="Step 1" description="First step" />
                <StepItem label="Step 2" description="Second step" />
                <StepItem label="Step 3" description="Third step" />
              </Stepper>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Variants */}
      <section id="stepper-variants" className="mb-10 scroll-mt-6">
        <SectionTitle>Variants</SectionTitle>
        <div className="flex flex-col gap-8">
          {STEPPER_VARIANTS.map(v => (
            <div key={v}>
              <span className="typography-13-semibold text-semantic-text-on-bright-500 mb-3 block">{v}</span>
              <Stepper currentStep={2} variant={v}>
                <StepItem label="Account" />
                <StepItem label="Profile" />
                <StepItem label="Review" />
                <StepItem label="Done" />
              </Stepper>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Orientations */}
      <section id="stepper-orientations" className="mb-10 scroll-mt-6">
        <SectionTitle>Orientations</SectionTitle>
        <div className="flex flex-col gap-8">
          <div>
            <span className="typography-13-semibold text-semantic-text-on-bright-500 mb-3 block">horizontal</span>
            <Stepper currentStep={1} orientation="horizontal">
              <StepItem label="Step 1" description="First" />
              <StepItem label="Step 2" description="Second" />
              <StepItem label="Step 3" description="Third" />
            </Stepper>
          </div>
          <div>
            <span className="typography-13-semibold text-semantic-text-on-bright-500 mb-3 block">vertical</span>
            <Stepper currentStep={1} orientation="vertical">
              <StepItem label="Step 1" description="Create your account with email and password" />
              <StepItem label="Step 2" description="Fill in your profile information" />
              <StepItem label="Step 3" description="Review and submit" />
            </Stepper>
          </div>
        </div>
      </section>

      {/* 6. Navigable */}
      <section id="stepper-navigable" className="mb-10 scroll-mt-6">
        <SectionTitle>Navigable</SectionTitle>
        <div className="p-4 rounded-2 border border-semantic-divider-solid-50">
          <Stepper currentStep={navStep} navigable onStepClick={setNavStep}>
            <StepItem label="Account" description="Create account" />
            <StepItem label="Profile" description="Set up profile" />
            <StepItem label="Payment" description="Add payment" />
            <StepItem label="Confirm" description="Review & confirm" />
          </Stepper>
          <div className="mt-4 pt-4 border-t border-semantic-divider-solid-50">
            <span className="typography-13-regular text-semantic-text-on-bright-500">
              Current step: <strong>{navStep}</strong> — click a completed step to go back
            </span>
          </div>
        </div>
      </section>

      {/* 7. Error State */}
      <section id="stepper-error" className="mb-10 scroll-mt-6">
        <SectionTitle>Error State</SectionTitle>
        <Stepper currentStep={1}>
          <StepItem label="Upload" />
          <StepItem label="Validate" status="error" />
          <StepItem label="Complete" />
        </Stepper>
      </section>

      {/* 8. Usage Guidelines */}
      <ShowcaseSection id="stepper-usage" title="Usage Guidelines">
        <UsageGuidelines data={usageData} onNavigate={navigate} />
      </ShowcaseSection>

      {/* 9. Code Examples */}
      <ShowcaseSection id="stepper-code" title="Code Examples">
        {codeExamples.map(ex => (
          <CodeBlock key={ex.title} code={ex.code} title={ex.title} description={ex.description} />
        ))}
      </ShowcaseSection>

      {/* 10. Design Tokens */}
      <ShowcaseSection
        id="stepper-tokens"
        title="Design Tokens"
        description="Size tokens in :root. Color tokens switch per theme."
      >
        <TokensReference groups={tokenGroups} />
      </ShowcaseSection>
    </>
  )
}
