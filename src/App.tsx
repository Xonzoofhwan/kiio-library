import { useState, useRef } from 'react'
import { Sidebar, TableOfContents } from '@/components/showcase-layout'
import type { TocEntry } from '@/components/showcase-layout'
import { useHashRoute } from '@/hooks/useHashRoute'
import { NavigateContext } from '@/showcase/NavigateContext'
import { HomeShowcase, HOME_TOC } from '@/showcase/HomeShowcase'
import { ButtonShowcase, BUTTON_TOC } from '@/showcase/ButtonShowcase'
import { IconButtonShowcase, ICON_BUTTON_TOC } from '@/showcase/IconButtonShowcase'
import { ChipShowcase, CHIP_TOC } from '@/showcase/ChipShowcase'
import { TextFieldShowcase, TEXTFIELD_TOC } from '@/showcase/TextFieldShowcase'
import { TagInputShowcase, TAGINPUT_TOC } from '@/showcase/TagInputShowcase'
import { TabShowcase, TAB_TOC } from '@/showcase/TabShowcase'
import { DropdownMenuShowcase, DROPDOWN_MENU_TOC } from '@/showcase/DropdownMenuShowcase'
import { TextareaShowcase, TEXTAREA_TOC } from '@/showcase/TextareaShowcase'
import { SearchFieldShowcase, SEARCHFIELD_TOC } from '@/showcase/SearchFieldShowcase'
import { SelectShowcase, SELECT_TOC } from '@/showcase/SelectShowcase'
import { BadgeShowcase, BADGE_TOC } from '@/showcase/BadgeShowcase'
import { SegmentBarShowcase, SEGMENTBAR_TOC } from '@/showcase/SegmentBarShowcase'
import { SideNavShowcase, SIDENAV_TOC } from '@/showcase/SideNavShowcase'
import { FormFieldShowcase, FORMFIELD_TOC } from '@/showcase/FormFieldShowcase'
import { TooltipShowcase, TOOLTIP_TOC } from '@/showcase/TooltipShowcase'
import { CalloutShowcase, CALLOUT_TOC } from '@/showcase/CalloutShowcase'
import { SwitchShowcase, SWITCH_TOC } from '@/showcase/SwitchShowcase'
import { TextButtonShowcase, TEXTBUTTON_TOC } from '@/showcase/TextButtonShowcase'
import { ToastShowcase, TOAST_TOC } from '@/showcase/ToastShowcase'
import { DialogShowcase, DIALOG_TOC } from '@/showcase/DialogShowcase'
import { DrawerShowcase, DRAWER_TOC } from '@/showcase/DrawerShowcase'
import { TableShowcase, TABLE_TOC } from '@/showcase/TableShowcase'
import { DataTableShowcase, DATA_TABLE_TOC } from '@/showcase/DataTableShowcase'
import { PaginationShowcase, PAGINATION_TOC } from '@/showcase/PaginationShowcase'
import { DividerShowcase, DIVIDER_TOC } from '@/showcase/DividerShowcase'
import { SkeletonShowcase, SKELETON_TOC } from '@/showcase/SkeletonShowcase'
import { BreadcrumbShowcase, BREADCRUMB_TOC } from '@/showcase/BreadcrumbShowcase'
import { ProgressShowcase, PROGRESS_TOC } from '@/showcase/ProgressShowcase'
import { RadioGroupShowcase, RADIOGROUP_TOC } from '@/showcase/RadioGroupShowcase'
import { AccordionShowcase, ACCORDION_TOC } from '@/showcase/AccordionShowcase'
import { SliderShowcase, SLIDER_TOC } from '@/showcase/SliderShowcase'
import { StepperShowcase, STEPPER_TOC } from '@/showcase/StepperShowcase'
import { PopoverShowcase, POPOVER_TOC } from '@/showcase/PopoverShowcase'
import { Toaster } from '@/components/Toast'

/* ─── Showcase map ────────────────────────────────────────────────────────── */

const SHOWCASE_MAP: Record<string, { component: React.ComponentType; toc: TocEntry[] }> = {
  'home':        { component: HomeShowcase,        toc: HOME_TOC        },
  'button':      { component: ButtonShowcase,      toc: BUTTON_TOC      },
  'icon-button': { component: IconButtonShowcase,  toc: ICON_BUTTON_TOC },
  'chip':        { component: ChipShowcase,        toc: CHIP_TOC        },
  'textfield':   { component: TextFieldShowcase,   toc: TEXTFIELD_TOC   },
  'textarea':    { component: TextareaShowcase,    toc: TEXTAREA_TOC    },
  'taginput':    { component: TagInputShowcase,    toc: TAGINPUT_TOC    },
  'searchfield': { component: SearchFieldShowcase, toc: SEARCHFIELD_TOC },
  'tab':         { component: TabShowcase,         toc: TAB_TOC         },
  'dropdown-menu': { component: DropdownMenuShowcase, toc: DROPDOWN_MENU_TOC },
  'select':      { component: SelectShowcase,      toc: SELECT_TOC      },
  'badge':       { component: BadgeShowcase,       toc: BADGE_TOC       },
  'segment-bar': { component: SegmentBarShowcase, toc: SEGMENTBAR_TOC  },
  'sidenav':     { component: SideNavShowcase,   toc: SIDENAV_TOC     },
  'formfield':   { component: FormFieldShowcase, toc: FORMFIELD_TOC   },
  'tooltip':     { component: TooltipShowcase,   toc: TOOLTIP_TOC     },
  'callout':     { component: CalloutShowcase,   toc: CALLOUT_TOC     },
  'switch':      { component: SwitchShowcase,   toc: SWITCH_TOC      },
  'text-button': { component: TextButtonShowcase, toc: TEXTBUTTON_TOC },
  'toast':       { component: ToastShowcase,      toc: TOAST_TOC       },
  'dialog':      { component: DialogShowcase,     toc: DIALOG_TOC      },
  'drawer':      { component: DrawerShowcase,     toc: DRAWER_TOC      },
  'table':       { component: TableShowcase,      toc: TABLE_TOC       },
  'data-table':  { component: DataTableShowcase,  toc: DATA_TABLE_TOC  },
  'pagination':  { component: PaginationShowcase, toc: PAGINATION_TOC  },
  'divider':     { component: DividerShowcase,   toc: DIVIDER_TOC     },
  'skeleton':    { component: SkeletonShowcase,  toc: SKELETON_TOC    },
  'breadcrumb':  { component: BreadcrumbShowcase, toc: BREADCRUMB_TOC },
  'progress':    { component: ProgressShowcase,  toc: PROGRESS_TOC   },
  'radio-group': { component: RadioGroupShowcase, toc: RADIOGROUP_TOC },
  'accordion':   { component: AccordionShowcase,  toc: ACCORDION_TOC  },
  'slider':      { component: SliderShowcase,     toc: SLIDER_TOC     },
  'stepper':     { component: StepperShowcase,    toc: STEPPER_TOC    },
  'popover':     { component: PopoverShowcase,    toc: POPOVER_TOC    },
}

/* ─── App ─────────────────────────────────────────────────────────────────── */

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const mainRef = useRef<HTMLDivElement>(null)
  const { activeId, navigate } = useHashRoute(mainRef)

  const entry = SHOWCASE_MAP[activeId] ?? SHOWCASE_MAP['home']
  const { component: ActiveShowcase, toc } = entry

  return (
    <div
      data-theme={theme}
      className="flex h-screen overflow-hidden bg-semantic-background-0 font-pretendard"
    >
      <Sidebar
        active={activeId}
        onSelect={navigate}
        theme={theme}
        onThemeChange={setTheme}
      />

      <main
        ref={mainRef}
        className="flex-1 overflow-y-auto ml-[240px]"
      >
        <div className="max-w-[1120px] mx-auto px-10 py-10 flex gap-10">
          <div className="flex-1 min-w-0">
            <NavigateContext.Provider value={navigate}>
              <ActiveShowcase />
            </NavigateContext.Provider>
          </div>
          {toc.length > 0 && (
            <div className="w-[180px] shrink-0 hidden lg:block">
              <div className="sticky top-10">
                <TableOfContents key={activeId} entries={toc} />
              </div>
            </div>
          )}
        </div>
      </main>

      <Toaster position="bottom-center" />
    </div>
  )
}
