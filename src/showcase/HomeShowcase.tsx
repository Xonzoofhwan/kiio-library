import { createContext, useContext, useState } from 'react'
import { Button } from '@/components/Button'
import { IconButton } from '@/components/IconButton'
import { FormField } from '@/components/FormField'
import { TextField } from '@/components/TextField'
import { Textarea } from '@/components/Textarea'
import { SearchField } from '@/components/SearchField'
import { Select } from '@/components/Select'
import { TagInput } from '@/components/TagInput'
import { ChipTag, ChipFilter, ChipDropdown } from '@/components/Chip'
import { TabGroup, TabList, TabItem, TabPanel } from '@/components/Tab'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/DropdownMenu'
import { BadgeLabel, BadgeCounter, BadgeDot } from '@/components/Badge'
import type { TocEntry } from '@/components/showcase-layout'
import {
  TrashIcon,
  HeartIcon,
  SearchIcon,
  MailIcon,
  BookIcon,
  StarIcon,
  GridIcon,
} from './shared'

/* ─── Navigate context ─────────────────────────────────────────────────────── */

export const NavigateContext = createContext<(id: string) => void>(() => {})

/* ─── Icons not in shared.tsx ──────────────────────────────────────────────── */

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12l5 5L20 7" />
  </svg>
)

const ChevronDownIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 7.5L10 12.5L15 7.5" />
  </svg>
)

const EditIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 3.5l2 2L7 15H5v-2L14.5 3.5z" />
  </svg>
)

const CopyIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="6" width="10" height="10" rx="1.5" />
    <path d="M4 14V5a1 1 0 011-1h9" />
  </svg>
)

/* ─── TOC ───────────────────────────────────────────────────────────────────── */

export const HOME_TOC: TocEntry[] = [
  { id: 'home-hero', label: 'Overview', level: 1 },
  { id: 'home-actions', label: 'Actions' },
  { id: 'home-forms', label: 'Form Inputs' },
  { id: 'home-selection', label: 'Selection' },
  { id: 'home-navigation', label: 'Navigation' },
  { id: 'home-overlay', label: 'Overlay' },
  { id: 'home-display', label: 'Display' },
]

/* ─── Section card wrapper ─────────────────────────────────────────────────── */

function SectionCard({
  id,
  title,
  description,
  navigateIds,
  children,
}: {
  id: string
  title: string
  description: string
  navigateIds?: { id: string; label: string }[]
  children: React.ReactNode
}) {
  const navigate = useContext(NavigateContext)

  return (
    <section id={id} className="scroll-mt-6">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <h2 className="typography-20-bold text-semantic-text-on-bright-900">{title}</h2>
          <p className="typography-14-regular text-semantic-text-on-bright-500 mt-1">{description}</p>
        </div>
        {navigateIds && (
          <div className="flex gap-3">
            {navigateIds.map(({ id: navId, label }) => (
              <button
                key={navId}
                onClick={() => navigate(navId)}
                className="typography-13-medium text-semantic-primary-500 hover:text-semantic-primary-600 transition-colors duration-fast ease-enter whitespace-nowrap"
              >
                {label} →
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="rounded-4 border border-semantic-divider-solid-100 bg-semantic-background-0 p-6">
        {children}
      </div>
    </section>
  )
}

/* ─── Select options (static) ──────────────────────────────────────────────── */

const ROLE_OPTIONS = [
  { value: 'designer', label: 'Designer' },
  { value: 'engineer', label: 'Engineer' },
  { value: 'pm', label: 'Product Manager' },
]

/* ─── HomeShowcase ─────────────────────────────────────────────────────────── */

export function HomeShowcase() {
  /* Form state */
  const [name, setName] = useState('Kim Minjun')
  const [email, setEmail] = useState('minjun@kiio.design')
  const [bio, setBio] = useState('Design systems engineer passionate about bridging design and code.')
  const [role, setRole] = useState('designer')
  const [skills, setSkills] = useState(['React', 'TypeScript', 'Figma'])
  const [searchValue, setSearchValue] = useState('')

  /* Chip state */
  const [filters, setFilters] = useState({ featured: true, recent: false, popular: false })
  const [chipTags, setChipTags] = useState(['React', 'TypeScript', 'Open Source'])
  const [catOpen, setCatOpen] = useState(false)

  /* Dropdown state */
  const [showPreview, setShowPreview] = useState(true)

  return (
    <div className="flex flex-col gap-12">
      {/* ── A. Hero ─────────────────────────────────────────────────────────── */}
      <section id="home-hero" className="scroll-mt-6 pt-6 pb-8 border-b border-semantic-divider-solid-50">
        <h1 className="flex items-baseline gap-2">
          <span className="typography-40-bold text-semantic-text-on-bright-900">kiio</span>
          <span className="typography-40-regular text-semantic-text-on-bright-400">components</span>
        </h1>
        <p className="typography-17-regular text-semantic-text-on-bright-500 mt-3">
          A design system built from structured JSON specifications. React 19, TypeScript, Tailwind CSS.
        </p>

        {/* Stats */}
        <div className="flex gap-2 mt-5">
          <BadgeLabel size="small" shape="pill" weight="light" color="indigo">12 Components</BadgeLabel>
          <BadgeLabel size="small" shape="pill" weight="light" color="purple">2 Themes</BadgeLabel>
          <BadgeLabel size="small" shape="pill" weight="light" color="emerald">52 Typography</BadgeLabel>
          <BadgeLabel size="small" shape="pill" weight="light" color="sky">23 Color Families</BadgeLabel>
        </div>

        {/* Button preview */}
        <div className="flex items-center gap-3 mt-8">
          <Button variant="primary" intent="brand">Primary</Button>
          <Button variant="secondary" intent="brand">Secondary</Button>
          <Button variant="outlined" intent="brand">Outlined</Button>
          <Button variant="ghost" intent="brand">Ghost</Button>
        </div>
      </section>

      {/* ── B. Actions ──────────────────────────────────────────────────────── */}
      <SectionCard
        id="home-actions"
        title="Actions"
        description="Buttons for primary actions, confirmations, and destructive operations."
        navigateIds={[
          { id: 'button', label: 'Button' },
          { id: 'icon-button', label: 'IconButton' },
        ]}
      >
        {/* Toolbar scene */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="primary" intent="systemic" iconLeading={<CheckIcon />}>Save Changes</Button>
            <Button variant="secondary" intent="systemic">Discard</Button>
            <Button variant="ghost" intent="destructive" iconLeading={<TrashIcon />}>Delete</Button>
          </div>
          <div className="flex items-center gap-1">
            <IconButton variant="ghost" intent="systemic" icon={<GridIcon />} aria-label="Grid view" />
            <IconButton variant="ghost" intent="systemic" icon={<HeartIcon />} aria-label="Favorites" />
            <IconButton variant="ghost" intent="systemic" icon={<SearchIcon />} aria-label="Search" />
          </div>
        </div>

        {/* Size scale */}
        <div className="flex items-end gap-3 mt-6 pt-6 border-t border-semantic-divider-solid-50">
          <Button variant="primary" intent="brand" size="xSmall">xSmall</Button>
          <Button variant="primary" intent="brand" size="small">Small</Button>
          <Button variant="primary" intent="brand" size="medium">Medium</Button>
          <Button variant="primary" intent="brand" size="large">Large</Button>
          <Button variant="primary" intent="brand" size="xLarge">xLarge</Button>
        </div>
      </SectionCard>

      {/* ── C. Form Inputs ──────────────────────────────────────────────────── */}
      <SectionCard
        id="home-forms"
        title="Form Inputs"
        description="Text fields, search, selects, and tag inputs with validation and accessibility built in."
        navigateIds={[
          { id: 'textfield', label: 'TextField' },
          { id: 'textarea', label: 'Textarea' },
          { id: 'select', label: 'Select' },
          { id: 'taginput', label: 'TagInput' },
          { id: 'searchfield', label: 'SearchField' },
        ]}
      >
        <div className="flex flex-col gap-5 max-w-lg">
          <FormField id="home-name" label="Full Name" required>
            <TextField
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormField>

          <FormField id="home-email" label="Email Address">
            <TextField
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              startEnhancer={<MailIcon />}
              type="email"
            />
          </FormField>

          <FormField
            id="home-bio"
            label="Bio"
            description="Tell us about yourself"
            count={bio.length}
            maxCount={200}
          >
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              autoResize
              size="large"
            />
          </FormField>

          <FormField id="home-role" label="Role">
            <Select
              value={role}
              onValueChange={setRole}
              options={ROLE_OPTIONS}
              placeholder="Select your role"
            />
          </FormField>

          <FormField id="home-skills" label="Skills">
            <TagInput
              value={skills}
              onChange={setSkills}
              placeholder="Add a skill..."
            />
          </FormField>

          <div className="flex gap-2 pt-2">
            <Button variant="secondary" intent="systemic">Cancel</Button>
            <Button variant="primary" intent="brand">Save Profile</Button>
          </div>
        </div>

        {/* Standalone search */}
        <div className="mt-6 pt-6 border-t border-semantic-divider-solid-50 max-w-sm">
          <p className="typography-13-semibold text-semantic-text-on-bright-400 mb-2">Standalone Search</p>
          <SearchField
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onSearch={() => {}}
            placeholder="Search components..."
            shape="pill"
          />
        </div>
      </SectionCard>

      {/* ── D. Selection ────────────────────────────────────────────────────── */}
      <SectionCard
        id="home-selection"
        title="Selection"
        description="Chips for filtering, tagging, and user selections."
        navigateIds={[{ id: 'chip', label: 'Chip' }]}
      >
        {/* Filter row */}
        <div className="flex flex-wrap items-center gap-2">
          <ChipFilter
            label="Featured"
            selected={filters.featured}
            onToggle={() => setFilters((f) => ({ ...f, featured: !f.featured }))}
            intent="brand"
          />
          <ChipFilter
            label="Recent"
            selected={filters.recent}
            onToggle={() => setFilters((f) => ({ ...f, recent: !f.recent }))}
          />
          <ChipFilter
            label="Popular"
            selected={filters.popular}
            onToggle={() => setFilters((f) => ({ ...f, popular: !f.popular }))}
          />
          <ChipDropdown
            label="Category"
            open={catOpen}
            onOpenChange={setCatOpen}
            badgeCount={3}
            intent="brand"
          />
        </div>

        {/* Tag row */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-semantic-divider-solid-50">
          <span className="typography-13-medium text-semantic-text-on-bright-500 mr-1">Applied:</span>
          {chipTags.map((tag) => (
            <ChipTag
              key={tag}
              label={tag}
              onRemove={() => setChipTags((t) => t.filter((v) => v !== tag))}
            />
          ))}
        </div>
      </SectionCard>

      {/* ── E. Navigation ───────────────────────────────────────────────────── */}
      <SectionCard
        id="home-navigation"
        title="Navigation"
        description="Tabs for switching between views and content panels."
        navigateIds={[{ id: 'tab', label: 'Tab' }]}
      >
        <div className="flex flex-col gap-8">
          {/* Underline variant */}
          <div>
            <p className="typography-13-semibold text-semantic-text-on-bright-400 mb-3">Underline</p>
            <TabGroup variant="underline" size="large" defaultValue="overview">
              <TabList aria-label="Documentation">
                <TabItem value="overview" icon={<BookIcon />}>Overview</TabItem>
                <TabItem value="components" icon={<GridIcon />}>Components</TabItem>
                <TabItem value="tokens" icon={<StarIcon />}>Tokens</TabItem>
              </TabList>
              <TabPanel value="overview">
                <p className="typography-14-regular text-semantic-text-on-bright-600 py-4">
                  A comprehensive design system with structured token architecture supporting multiple themes.
                </p>
              </TabPanel>
              <TabPanel value="components">
                <p className="typography-14-regular text-semantic-text-on-bright-600 py-4">
                  12 components built with CVA, Radix UI, and systematic design specifications.
                </p>
              </TabPanel>
              <TabPanel value="tokens">
                <p className="typography-14-regular text-semantic-text-on-bright-600 py-4">
                  Three-layer token system: Primitive → Semantic → Component.
                </p>
              </TabPanel>
            </TabGroup>
          </div>

          {/* Pill variant */}
          <div>
            <p className="typography-13-semibold text-semantic-text-on-bright-400 mb-3">Pill</p>
            <TabGroup variant="pill" size="medium" defaultValue="all">
              <TabList aria-label="Filter">
                <TabItem value="all">All</TabItem>
                <TabItem value="active">Active</TabItem>
                <TabItem value="archived">Archived</TabItem>
              </TabList>
            </TabGroup>
          </div>
        </div>
      </SectionCard>

      {/* ── F. Overlay ──────────────────────────────────────────────────────── */}
      <SectionCard
        id="home-overlay"
        title="Overlay"
        description="Contextual menus with checkbox, radio, and nested sub-menus."
        navigateIds={[{ id: 'dropdown-menu', label: 'DropdownMenu' }]}
      >
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" intent="systemic" iconTrailing={<ChevronDownIcon />}>
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="start">
              <DropdownMenuLabel>Edit</DropdownMenuLabel>
              <DropdownMenuItem>
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 flex-shrink-0"><EditIcon /></span>
                  Rename
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 flex-shrink-0"><CopyIcon /></span>
                  Duplicate
                </span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={showPreview}
                onCheckedChange={setShowPreview}
              >
                Show Preview
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-semantic-error-500">
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 flex-shrink-0"><TrashIcon /></span>
                  Delete
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <span className="typography-13-regular text-semantic-text-on-bright-400">
            Click to open the menu
          </span>
        </div>
      </SectionCard>

      {/* ── G. Display ──────────────────────────────────────────────────────── */}
      <SectionCard
        id="home-display"
        title="Display"
        description="Badges, counters, and status indicators for labeling and annotation."
        navigateIds={[{ id: 'badge', label: 'Badge' }]}
      >
        {/* Light badges */}
        <div className="flex flex-col gap-4">
          <div>
            <p className="typography-13-semibold text-semantic-text-on-bright-400 mb-2">Label — Light</p>
            <div className="flex flex-wrap gap-2">
              <BadgeLabel size="small" shape="pill" weight="light" color="indigo">Design</BadgeLabel>
              <BadgeLabel size="small" shape="pill" weight="light" color="purple">Engineering</BadgeLabel>
              <BadgeLabel size="small" shape="pill" weight="light" color="emerald">Marketing</BadgeLabel>
              <BadgeLabel size="small" shape="pill" weight="light" color="orange">Research</BadgeLabel>
              <BadgeLabel size="small" shape="pill" weight="light" color="pink">QA</BadgeLabel>
              <BadgeLabel size="small" shape="pill" weight="light" color="sky">Ops</BadgeLabel>
              <BadgeLabel size="small" shape="pill" weight="light" color="amber">Analytics</BadgeLabel>
            </div>
          </div>

          {/* Heavy badges */}
          <div>
            <p className="typography-13-semibold text-semantic-text-on-bright-400 mb-2">Label — Heavy</p>
            <div className="flex flex-wrap gap-2">
              <BadgeLabel size="small" shape="pill" weight="heavy" color="indigo">Design</BadgeLabel>
              <BadgeLabel size="small" shape="pill" weight="heavy" color="purple">Engineering</BadgeLabel>
              <BadgeLabel size="small" shape="pill" weight="heavy" color="emerald">Marketing</BadgeLabel>
              <BadgeLabel size="small" shape="pill" weight="heavy" color="orange">Research</BadgeLabel>
              <BadgeLabel size="small" shape="pill" weight="heavy" color="pink">QA</BadgeLabel>
              <BadgeLabel size="small" shape="pill" weight="heavy" color="sky">Ops</BadgeLabel>
              <BadgeLabel size="small" shape="pill" weight="heavy" color="amber">Analytics</BadgeLabel>
            </div>
          </div>

          {/* Counters */}
          <div>
            <p className="typography-13-semibold text-semantic-text-on-bright-400 mb-2">Counter</p>
            <div className="flex flex-wrap items-center gap-2">
              <BadgeCounter color="red-bright">3</BadgeCounter>
              <BadgeCounter color="indigo">12</BadgeCounter>
              <BadgeCounter color="emerald">99+</BadgeCounter>
              <BadgeCounter color="orange" weight="light">New</BadgeCounter>
              <BadgeCounter color="purple" weight="light">Beta</BadgeCounter>
            </div>
          </div>

          {/* Dots */}
          <div>
            <p className="typography-13-semibold text-semantic-text-on-bright-400 mb-2">Status Dot</p>
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5">
                <BadgeDot color="emerald" />
                <span className="typography-13-regular text-semantic-text-on-bright-700">Online</span>
              </span>
              <span className="flex items-center gap-1.5">
                <BadgeDot color="amber" />
                <span className="typography-13-regular text-semantic-text-on-bright-700">Away</span>
              </span>
              <span className="flex items-center gap-1.5">
                <BadgeDot color="gray" />
                <span className="typography-13-regular text-semantic-text-on-bright-700">Offline</span>
              </span>
              <span className="flex items-center gap-1.5">
                <BadgeDot color="red-bright" />
                <span className="typography-13-regular text-semantic-text-on-bright-700">Busy</span>
              </span>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ── H. Footer ───────────────────────────────────────────────────────── */}
      <footer className="pb-8 pt-4 border-t border-semantic-divider-solid-50">
        <p className="typography-14-regular text-semantic-text-on-bright-400">
          13 components · Built with React, TypeScript, and Tailwind CSS.
        </p>
      </footer>
    </div>
  )
}
