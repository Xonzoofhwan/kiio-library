import { useState } from 'react'
import { NavVertical, NAV_VERTICAL_SIZES, NAV_VERTICAL_SHAPES } from '@/components/NavVertical'
import { Icon } from '@/components/icons'
import type { TocEntry } from '@/components/showcase-layout'
import { SectionTitle, RowHeader } from '@/showcase/shared'

/* ─── TOC ──────────────────────────────────────────────────────────────────── */

export const NAV_VERTICAL_TOC: TocEntry[] = [
  { id: 'nav-vertical-basic', label: 'Basic' },
  { id: 'nav-vertical-sizes', label: 'Sizes' },
  { id: 'nav-vertical-shapes', label: 'Shapes' },
  { id: 'nav-vertical-groups', label: 'Groups' },
  { id: 'nav-vertical-collapsible', label: 'Collapsible' },
  { id: 'nav-vertical-badges', label: 'Badges' },
  { id: 'nav-vertical-controlled', label: 'Controlled' },
]

/* ─── Showcase ─────────────────────────────────────────────────────────────── */

export function NavVerticalShowcase() {
  const [controlledValue, setControlledValue] = useState('dashboard')

  return (
    <div className="flex flex-col gap-16">
      {/* Header */}
      <div>
        <h1 className="typography-28-bold text-semantic-text-on-bright-950 mb-2">NavVertical</h1>
        <p className="typography-16-regular text-semantic-text-on-bright-600">
          Vertical navigation for deep information hierarchies. Supports collapsible groups, icons, and badges.
        </p>
      </div>

      {/* ─── Basic ──────────────────────────────────────────────── */}
      <section id="nav-vertical-basic" className="mb-12">
        <SectionTitle>Basic</SectionTitle>
        <div className="w-[220px]">
          <NavVertical defaultValue="valuation">
            <NavVertical.Item value="valuation" icon={<Icon name="analytics" />}>Valuation</NavVertical.Item>
            <NavVertical.Item value="dividends" icon={<Icon name="payments" />}>Dividends</NavVertical.Item>
            <NavVertical.Item value="earnings" icon={<Icon name="star" />}>Earnings</NavVertical.Item>
            <NavVertical.Item value="balance" icon={<Icon name="folder" />}>Balance Sheet</NavVertical.Item>
          </NavVertical>
        </div>
      </section>

      {/* ─── Sizes ──────────────────────────────────────────────── */}
      <section id="nav-vertical-sizes" className="mb-12">
        <SectionTitle>Sizes</SectionTitle>
        <div className="grid grid-cols-[auto_1fr] gap-y-8 gap-x-6 items-start">
          {NAV_VERTICAL_SIZES.map((size) => (
            <div key={size} className="contents">
              <RowHeader>{size}</RowHeader>
              <div className="w-[220px]">
                <NavVertical defaultValue="dashboard" size={size}>
                  <NavVertical.Item value="dashboard" icon={<Icon name="dashboard" />}>Dashboard</NavVertical.Item>
                  <NavVertical.Item value="analytics" icon={<Icon name="analytics" />}>Analytics</NavVertical.Item>
                  <NavVertical.Item value="settings" icon={<Icon name="settings" />}>Settings</NavVertical.Item>
                </NavVertical>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Shapes ─────────────────────────────────────────────── */}
      <section id="nav-vertical-shapes" className="mb-12">
        <SectionTitle>Shapes</SectionTitle>
        <div className="grid grid-cols-[auto_1fr] gap-y-8 gap-x-6 items-start">
          {NAV_VERTICAL_SHAPES.map((shape) => (
            <div key={shape} className="contents">
              <RowHeader>{shape}</RowHeader>
              <div className="w-[220px]">
                <NavVertical defaultValue="overview" shape={shape}>
                  <NavVertical.Item value="overview" icon={<Icon name="dashboard" />}>Overview</NavVertical.Item>
                  <NavVertical.Item value="reports" icon={<Icon name="analytics" />}>Reports</NavVertical.Item>
                  <NavVertical.Item value="settings" icon={<Icon name="settings" />}>Settings</NavVertical.Item>
                </NavVertical>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Groups ─────────────────────────────────────────────── */}
      <section id="nav-vertical-groups" className="mb-12">
        <SectionTitle>Groups</SectionTitle>
        <div className="w-[220px]">
          <NavVertical defaultValue="dashboard">
            <NavVertical.Group label="Overview">
              <NavVertical.Item value="dashboard" icon={<Icon name="dashboard" />}>Dashboard</NavVertical.Item>
              <NavVertical.Item value="analytics" icon={<Icon name="analytics" />}>Analytics</NavVertical.Item>
            </NavVertical.Group>
            <NavVertical.Group label="Account">
              <NavVertical.Item value="profile" icon={<Icon name="person" />}>Profile</NavVertical.Item>
              <NavVertical.Item value="notifications" icon={<Icon name="notifications" />}>Notifications</NavVertical.Item>
              <NavVertical.Item value="settings" icon={<Icon name="settings" />}>Settings</NavVertical.Item>
            </NavVertical.Group>
          </NavVertical>
        </div>
      </section>

      {/* ─── Collapsible ────────────────────────────────────────── */}
      <section id="nav-vertical-collapsible" className="mb-12">
        <SectionTitle>Collapsible</SectionTitle>
        <div className="w-[220px]">
          <NavVertical defaultValue="dashboard">
            <NavVertical.Group label="Overview" collapsible>
              <NavVertical.Item value="dashboard" icon={<Icon name="dashboard" />}>Dashboard</NavVertical.Item>
              <NavVertical.Item value="analytics" icon={<Icon name="analytics" />}>Analytics</NavVertical.Item>
            </NavVertical.Group>
            <NavVertical.Group label="Account" collapsible>
              <NavVertical.Item value="profile" icon={<Icon name="person" />}>Profile</NavVertical.Item>
              <NavVertical.Item value="notifications" icon={<Icon name="notifications" />}>Notifications</NavVertical.Item>
              <NavVertical.Item value="settings" icon={<Icon name="settings" />}>Settings</NavVertical.Item>
            </NavVertical.Group>
            <NavVertical.Group label="Favorites" collapsible defaultOpen={false}>
              <NavVertical.Item value="starred" icon={<Icon name="star" />}>Starred</NavVertical.Item>
              <NavVertical.Item value="archived" icon={<Icon name="folder" />}>Archived</NavVertical.Item>
            </NavVertical.Group>
          </NavVertical>
        </div>
      </section>

      {/* ─── Badges ─────────────────────────────────────────────── */}
      <section id="nav-vertical-badges" className="mb-12">
        <SectionTitle>Badges</SectionTitle>
        <div className="grid grid-cols-[auto_1fr] gap-y-8 gap-x-6 items-start">
          {/* Label (default) */}
          <RowHeader>Label (default)</RowHeader>
          <div className="w-[220px]">
            <NavVertical defaultValue="valuation">
              <NavVertical.Item value="valuation" icon={<Icon name="analytics" />} badgeLabel="12">
                Valuation
              </NavVertical.Item>
              <NavVertical.Item value="dividends" icon={<Icon name="payments" />} badgeLabel="3">
                Dividends
              </NavVertical.Item>
              <NavVertical.Item value="balance" icon={<Icon name="folder" />}>
                Balance Sheet
              </NavVertical.Item>
            </NavVertical>
          </div>

          {/* Label (custom color) */}
          <RowHeader>Label (custom)</RowHeader>
          <div className="w-[220px]">
            <NavVertical defaultValue="features">
              <NavVertical.Item
                value="features"
                icon={<Icon name="star" />}
                badgeLabel={{ children: 'New', color: 'blue', weight: 'light' }}
              >
                Features
              </NavVertical.Item>
              <NavVertical.Item
                value="admin"
                icon={<Icon name="settings" />}
                badgeLabel={{ children: 'Admin', color: 'purple', weight: 'heavy' }}
              >
                Admin Panel
              </NavVertical.Item>
              <NavVertical.Item
                value="alerts"
                icon={<Icon name="notifications" />}
                badgeLabel={{ children: '5', color: 'red', weight: 'light' }}
              >
                Alerts
              </NavVertical.Item>
            </NavVertical>
          </div>

          {/* Dot (default) */}
          <RowHeader>Dot (default)</RowHeader>
          <div className="w-[220px]">
            <NavVertical defaultValue="dashboard">
              <NavVertical.Item value="dashboard" icon={<Icon name="dashboard" />} badgeDot>
                Dashboard
              </NavVertical.Item>
              <NavVertical.Item value="earnings" icon={<Icon name="star" />} badgeDot>
                Earnings
              </NavVertical.Item>
              <NavVertical.Item value="balance" icon={<Icon name="folder" />}>
                Balance Sheet
              </NavVertical.Item>
            </NavVertical>
          </div>

          {/* Dot (custom) */}
          <RowHeader>Dot (custom)</RowHeader>
          <div className="w-[220px]">
            <NavVertical defaultValue="messages">
              <NavVertical.Item
                value="messages"
                icon={<Icon name="chat" />}
                badgeDot={{ color: 'green', size: 8 }}
              >
                Messages
              </NavVertical.Item>
              <NavVertical.Item
                value="updates"
                icon={<Icon name="notifications" />}
                badgeDot={{ color: 'blue', size: 4 }}
              >
                Updates
              </NavVertical.Item>
              <NavVertical.Item
                value="warnings"
                icon={<Icon name="analytics" />}
                badgeDot={{ color: 'orange', size: 8, outlined: true }}
              >
                Warnings
              </NavVertical.Item>
            </NavVertical>
          </div>

          {/* Combined */}
          <RowHeader>Combined</RowHeader>
          <div className="w-[220px]">
            <NavVertical defaultValue="valuation">
              <NavVertical.Item value="valuation" icon={<Icon name="analytics" />} badgeLabel="12" badgeDot>
                Valuation
              </NavVertical.Item>
              <NavVertical.Item value="earnings" icon={<Icon name="star" />} badgeDot>
                Earnings
              </NavVertical.Item>
              <NavVertical.Item
                value="admin"
                icon={<Icon name="settings" />}
                badgeLabel={{ children: 'Admin', color: 'purple' }}
              >
                Admin
              </NavVertical.Item>
            </NavVertical>
          </div>
        </div>
      </section>

      {/* ─── Controlled ─────────────────────────────────────────── */}
      <section id="nav-vertical-controlled" className="mb-12">
        <SectionTitle>Controlled</SectionTitle>
        <div className="flex gap-8 items-start">
          <div className="w-[220px]">
            <NavVertical value={controlledValue} onValueChange={setControlledValue}>
              <NavVertical.Item value="dashboard" icon={<Icon name="dashboard" />}>Dashboard</NavVertical.Item>
              <NavVertical.Item value="analytics" icon={<Icon name="analytics" />}>Analytics</NavVertical.Item>
              <NavVertical.Item value="settings" icon={<Icon name="settings" />}>Settings</NavVertical.Item>
            </NavVertical>
          </div>
          <div className="flex flex-col gap-2">
            <p className="typography-14-medium text-semantic-text-on-bright-600">
              Active: <span className="typography-14-semibold text-semantic-text-on-bright-900">{controlledValue}</span>
            </p>
            <div className="flex gap-2">
              {['dashboard', 'analytics', 'settings'].map((v) => (
                <button
                  key={v}
                  onClick={() => setControlledValue(v)}
                  className="px-3 py-1.5 rounded-2 typography-13-medium bg-semantic-neutral-black-alpha-70 text-semantic-text-on-bright-800 hover:bg-semantic-neutral-black-alpha-100 transition-colors duration-fast ease-enter"
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
