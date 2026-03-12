import { useState } from 'react'
import {
  SideNav,
  SideNavGroup,
  SideNavItem,
  SideNavDivider,
  SideNavPanel,
  SIDENAV_SIZES,
} from '@/components/SideNav'
import type { SideNavSize } from '@/components/SideNav'
import { BadgeLabel } from '@/components/Badge'
import type { TocEntry } from '@/components/showcase-layout/TableOfContents'
import { SectionTitle, SpecLabel } from './shared'

/* ─── ToC ─────────────────────────────────────────────────────────────────── */

export const SIDENAV_TOC: TocEntry[] = [
  { id: 'component-sidenav', label: 'SideNav',        level: 1 },
  { id: 'sidenav-sizes',     label: 'Sizes'                    },
  { id: 'sidenav-groups',    label: 'Groups'                   },
  { id: 'sidenav-icons',     label: 'With Icons'               },
  { id: 'sidenav-badges',    label: 'With Badges'              },
  { id: 'sidenav-divider',   label: 'Divider'                  },
  { id: 'sidenav-flat',      label: 'Flat (No Groups)'         },
  { id: 'sidenav-panel',     label: 'Panel (Tab Mode)'         },
  { id: 'sidenav-states',    label: 'States'                   },
]

/* ─── Size spec ───────────────────────────────────────────────────────────── */

const SIZE_SPECS: Record<SideNavSize, { height: string; font: string }> = {
  large:  { height: '44px', font: '15' },
  medium: { height: '36px', font: '14' },
  small:  { height: '32px', font: '13' },
}

/* ─── Demo icons ──────────────────────────────────────────────────────────── */

function HomeIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M3 10l7-7 7 7" />
      <path d="M5 8.5V16a1 1 0 001 1h3v-4h2v4h3a1 1 0 001-1V8.5" />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <circle cx="7" cy="7" r="3" />
      <path d="M2 17a5 5 0 0110 0" />
      <circle cx="14" cy="8" r="2.5" />
      <path d="M14.5 13a4 4 0 014 4" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <circle cx="10" cy="10" r="3" />
      <path d="M10 2v2M10 16v2M3.5 5.5l1.4 1.4M15.1 15.1l1.4 1.4M2 10h2M16 10h2M3.5 14.5l1.4-1.4M15.1 4.9l1.4-1.4" />
    </svg>
  )
}

function FileIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M5 2h7l4 4v11a1 1 0 01-1 1H5a1 1 0 01-1-1V3a1 1 0 011-1z" />
      <path d="M12 2v4h4" />
    </svg>
  )
}

function ChartIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <rect x="3" y="10" width="3" height="7" rx="0.5" />
      <rect x="8.5" y="6" width="3" height="11" rx="0.5" />
      <rect x="14" y="3" width="3" height="14" rx="0.5" />
    </svg>
  )
}

/* ─── Showcase ────────────────────────────────────────────────────────────── */

export function SideNavShowcase() {
  /* Size demos */
  const [sizeValues, setSizeValues] = useState<Record<SideNavSize, string>>({
    large: 'overview', medium: 'overview', small: 'overview',
  })

  /* Group demo */
  const [groupVal, setGroupVal] = useState('button')

  /* Icon demo */
  const [iconVal, setIconVal] = useState('dashboard')

  /* Badge demo */
  const [badgeVal, setBadgeVal] = useState('inbox')

  /* Divider demo */
  const [dividerVal, setDividerVal] = useState('projects')

  /* Flat demo */
  const [flatVal, setFlatVal] = useState('overview')

  /* Panel demo */
  const [panelVal, setPanelVal] = useState('general')

  /* States demo */
  const [stateVal, setStateVal] = useState('active')

  return (
    <>
      <h1
        id="component-sidenav"
        className="typography-24-bold text-semantic-text-on-bright-900 mb-6 scroll-mt-6"
      >
        SideNav
      </h1>

      {/* ── Sizes ── */}
      <section id="sidenav-sizes" className="mb-12 scroll-mt-6">
        <SectionTitle>Sizes</SectionTitle>
        <div className="flex gap-8">
          {SIDENAV_SIZES.map(s => (
            <div key={s} className="flex-1 min-w-0">
              <div className="mb-3 flex items-baseline gap-2">
                <SpecLabel>{s}</SpecLabel>
                <span className="typography-12-regular text-semantic-text-on-bright-400">
                  {SIZE_SPECS[s].height} / {SIZE_SPECS[s].font}
                </span>
              </div>
              <div className="border border-semantic-divider-solid-100 rounded-2 p-3">
                <SideNav
                  size={s}
                  value={sizeValues[s]}
                  onValueChange={v => setSizeValues(prev => ({ ...prev, [s]: v }))}
                >
                  <SideNavItem value="overview">Overview</SideNavItem>
                  <SideNavItem value="analytics">Analytics</SideNavItem>
                  <SideNavItem value="reports">Reports</SideNavItem>
                  <SideNavItem value="settings">Settings</SideNavItem>
                </SideNav>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Groups ── */}
      <section id="sidenav-groups" className="mb-12 scroll-mt-6">
        <SectionTitle>Groups</SectionTitle>
        <div className="border border-semantic-divider-solid-100 rounded-2 p-3 max-w-[240px]">
          <SideNav value={groupVal} onValueChange={setGroupVal}>
            <SideNavGroup label="Actions">
              <SideNavItem value="button">Button</SideNavItem>
              <SideNavItem value="icon-button">IconButton</SideNavItem>
            </SideNavGroup>
            <SideNavGroup label="Inputs">
              <SideNavItem value="textfield">TextField</SideNavItem>
              <SideNavItem value="textarea">Textarea</SideNavItem>
              <SideNavItem value="select">Select</SideNavItem>
            </SideNavGroup>
            <SideNavGroup label="Display">
              <SideNavItem value="badge">Badge</SideNavItem>
              <SideNavItem value="chip">Chip</SideNavItem>
            </SideNavGroup>
          </SideNav>
        </div>
      </section>

      {/* ── With Icons ── */}
      <section id="sidenav-icons" className="mb-12 scroll-mt-6">
        <SectionTitle>With Icons</SectionTitle>
        <div className="border border-semantic-divider-solid-100 rounded-2 p-3 max-w-[240px]">
          <SideNav value={iconVal} onValueChange={setIconVal} size="large">
            <SideNavItem value="dashboard" icon={<HomeIcon />}>Dashboard</SideNavItem>
            <SideNavItem value="team" icon={<UsersIcon />}>Team</SideNavItem>
            <SideNavItem value="documents" icon={<FileIcon />}>Documents</SideNavItem>
            <SideNavItem value="analytics" icon={<ChartIcon />}>Analytics</SideNavItem>
            <SideNavItem value="settings" icon={<SettingsIcon />}>Settings</SideNavItem>
          </SideNav>
        </div>
      </section>

      {/* ── With Badges ── */}
      <section id="sidenav-badges" className="mb-12 scroll-mt-6">
        <SectionTitle>With Badges</SectionTitle>
        <div className="border border-semantic-divider-solid-100 rounded-2 p-3 max-w-[240px]">
          <SideNav value={badgeVal} onValueChange={setBadgeVal}>
            <SideNavItem value="inbox" icon={<HomeIcon />} badge={<BadgeLabel color="indigo" size="small">3</BadgeLabel>}>
              Inbox
            </SideNavItem>
            <SideNavItem value="sent" icon={<FileIcon />}>Sent</SideNavItem>
            <SideNavItem value="drafts" icon={<FileIcon />} badge={<BadgeLabel color="gray" size="small">12</BadgeLabel>}>
              Drafts
            </SideNavItem>
            <SideNavItem value="archive" icon={<FileIcon />}>Archive</SideNavItem>
          </SideNav>
        </div>
      </section>

      {/* ── Divider ── */}
      <section id="sidenav-divider" className="mb-12 scroll-mt-6">
        <SectionTitle>Divider</SectionTitle>
        <div className="border border-semantic-divider-solid-100 rounded-2 p-3 max-w-[240px]">
          <SideNav value={dividerVal} onValueChange={setDividerVal}>
            <SideNavGroup label="Workspace">
              <SideNavItem value="projects">Projects</SideNavItem>
              <SideNavItem value="tasks">Tasks</SideNavItem>
            </SideNavGroup>
            <SideNavDivider />
            <SideNavItem value="settings" icon={<SettingsIcon />}>Settings</SideNavItem>
            <SideNavItem value="help">Help & Support</SideNavItem>
          </SideNav>
        </div>
      </section>

      {/* ── Flat (No Groups) ── */}
      <section id="sidenav-flat" className="mb-12 scroll-mt-6">
        <SectionTitle>Flat (No Groups)</SectionTitle>
        <div className="border border-semantic-divider-solid-100 rounded-2 p-3 max-w-[240px]">
          <SideNav value={flatVal} onValueChange={setFlatVal} size="small">
            <SideNavItem value="overview">Overview</SideNavItem>
            <SideNavItem value="analytics">Analytics</SideNavItem>
            <SideNavItem value="reports">Reports</SideNavItem>
            <SideNavItem value="exports">Exports</SideNavItem>
          </SideNav>
        </div>
      </section>

      {/* ── Panel (Tab Mode) ── */}
      <section id="sidenav-panel" className="mb-12 scroll-mt-6">
        <SectionTitle>Panel (Tab Mode)</SectionTitle>
        <SideNav value={panelVal} onValueChange={setPanelVal} size="small" className="border border-semantic-divider-solid-100 rounded-2 overflow-hidden">
          <div className="flex">
            <div className="w-[200px] shrink-0 p-3 border-r border-semantic-divider-solid-100">
              <SideNavItem value="general">General</SideNavItem>
              <SideNavItem value="appearance">Appearance</SideNavItem>
              <SideNavItem value="notifications">Notifications</SideNavItem>
              <SideNavItem value="security">Security</SideNavItem>
            </div>
            <div className="flex-1 p-6">
              <SideNavPanel value="general">
                <h3 className="typography-16-semibold text-semantic-text-on-bright-900 mb-2">General</h3>
                <p className="typography-14-regular text-semantic-text-on-bright-600">
                  General settings panel content.
                </p>
              </SideNavPanel>
              <SideNavPanel value="appearance">
                <h3 className="typography-16-semibold text-semantic-text-on-bright-900 mb-2">Appearance</h3>
                <p className="typography-14-regular text-semantic-text-on-bright-600">
                  Theme, color, and display settings.
                </p>
              </SideNavPanel>
              <SideNavPanel value="notifications">
                <h3 className="typography-16-semibold text-semantic-text-on-bright-900 mb-2">Notifications</h3>
                <p className="typography-14-regular text-semantic-text-on-bright-600">
                  Manage notification preferences.
                </p>
              </SideNavPanel>
              <SideNavPanel value="security">
                <h3 className="typography-16-semibold text-semantic-text-on-bright-900 mb-2">Security</h3>
                <p className="typography-14-regular text-semantic-text-on-bright-600">
                  Password, 2FA, and security options.
                </p>
              </SideNavPanel>
            </div>
          </div>
        </SideNav>
      </section>

      {/* ── States ── */}
      <section id="sidenav-states" className="mb-12 scroll-mt-6">
        <SectionTitle>States</SectionTitle>
        <div className="flex gap-8">
          <div className="flex-1 min-w-0">
            <SpecLabel>Individual disabled</SpecLabel>
            <div className="border border-semantic-divider-solid-100 rounded-2 p-3 mt-2">
              <SideNav value={stateVal} onValueChange={setStateVal}>
                <SideNavItem value="active">Active</SideNavItem>
                <SideNavItem value="disabled-item" disabled>Disabled Item</SideNavItem>
                <SideNavItem value="another">Another</SideNavItem>
              </SideNav>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <SpecLabel>Global disabled</SpecLabel>
            <div className="border border-semantic-divider-solid-100 rounded-2 p-3 mt-2">
              <SideNav defaultValue="first" disabled>
                <SideNavItem value="first">First</SideNavItem>
                <SideNavItem value="second">Second</SideNavItem>
                <SideNavItem value="third">Third</SideNavItem>
              </SideNav>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
