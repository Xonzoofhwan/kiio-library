import { useEffect, useMemo } from 'react'
import { NavVertical } from '@/components/NavVertical'
import { IconButton } from '@/components/Button'
import { Icon } from '@/components/icons'
import { cn } from '@/lib/utils'
import { groupedShowcases } from '@/showcase/registry'
import logoLight from '@/assets/logo_24_withLettermark_light.svg'
import logoDark from '@/assets/logo_24_withLettermark_dark.svg'

/* ─── Component ───────────────────────────────────────────────────────────── */

interface SidebarProps {
  active: string
  onSelect: (id: string) => void
  theme: 'light' | 'dark'
  onThemeChange: (theme: 'light' | 'dark') => void
  /** 좁은 화면에서 열려 있는가. `lg` 이상에서는 무시된다 — 거기서는 항상 보인다. */
  open: boolean
  /** 좁은 화면에서 닫기. 항목 선택·오버레이 클릭·Escape 가 부른다. */
  onClose: () => void
}

export function Sidebar({ active, onSelect, theme, onThemeChange, open, onClose }: SidebarProps) {
  // 메뉴는 registry 에서 파생한다 — 2026-09-14 전에는 이 파일이 `NAV_GROUPS` 로 목록을 따로
  // 갖고 있어, 페이지를 추가할 때 두 곳을 고쳐야 했고 한쪽을 빠뜨리면 조용히 어긋났다.
  const groups = useMemo(() => groupedShowcases(), [])

  // 열린 서랍은 Escape 로 닫힌다. 좁은 화면에서 내비게이션이 화면을 덮으므로
  // 되돌아갈 길이 보이지 않으면 갇힌 느낌이 든다.
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  return (
    <>
      {/* 좁은 화면의 배경 오버레이. lg 이상에서는 서랍이 아니므로 아예 렌더하지 않는다. */}
      {open && (
        <div
          aria-hidden
          onClick={onClose}
          className="fixed inset-0 z-20 bg-semantic-neutral-black-alpha-400 lg:hidden"
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 h-screen w-[240px] flex flex-col z-30',
          'bg-semantic-background-50 border-r border-semantic-divider-solid-200',
          // 좁은 화면에서는 화면 밖에 있다가 열릴 때 들어온다. lg 이상에서는 늘 제자리다.
          'transition-transform duration-normal ease-move lg:transition-none',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        {/* Logo */}
        <div className="flex-shrink-0 h-14 px-4 flex items-center justify-between border-b border-semantic-divider-solid-100">
          <img
            src={theme === 'dark' ? logoDark : logoLight}
            alt="kiio Library"
            className="h-6"
          />
          <div className="flex items-center gap-1">
            <IconButton
              hierarchy="ghost"
              size="small"
              shape="circular"
              icon={<Icon name={theme === 'dark' ? 'light_mode' : 'dark_mode'} />}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
            />
            {/* 닫기는 좁은 화면에만 있다 — lg 이상에서 서랍은 닫히지 않는다. */}
            <IconButton
              hierarchy="ghost"
              size="small"
              shape="circular"
              icon={<Icon name="close" />}
              aria-label="내비게이션 닫기"
              onClick={onClose}
              className="lg:hidden"
            />
          </div>
        </div>

        {/* Nav groups */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <NavVertical
            value={active}
            onValueChange={(id) => {
              onSelect(id)
              onClose() // 좁은 화면에서 고른 뒤 서랍이 남아 있으면 결과를 볼 수 없다
            }}
            size="large"
            shape="basic"
          >
            {groups.map((group, i) => (
              <div key={group.label}>
                {i > 0 && (
                  <hr className="border-t border-semantic-divider-solid-100 my-2" />
                )}
                <NavVertical.Group label={group.label}>
                  {group.items.map((item) => (
                    <NavVertical.Item key={item.id} value={item.id}>
                      {item.label}
                    </NavVertical.Item>
                  ))}
                </NavVertical.Group>
              </div>
            ))}
          </NavVertical>
        </div>
      </aside>
    </>
  )
}
