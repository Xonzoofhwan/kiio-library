# Quality Gates 도입 계획 — 산문 규칙을 실행 검사로

> 작성일 2026-09-05 · 기준 커밋 `d0f3f0d` · 상태: **Phase 0–6 구현 완료** (Phase 6은 조건부였으나 함께 수행)
>
> 이 문서는 "규칙이 문서에만 존재하는 상태"를 "규칙이 명령 하나로 판정되는 상태"로 옮기는 계획이다.
> 각 Phase는 산출물·완료 기준·즉시 해소되는 실측 결함을 명시한다. 존재하지 않는 검사를 "통과했다"고 적는 것이 이 계획이 막으려는 첫 번째 실패 유형이므로, **오늘 존재하는 명령만** 적는다.

---

## 구현 상태 (2026-09-05)

**Phase 0–6 전부 완료.** `npm run check` → `eslint 0 problems` · `✓ built` · `283 passed (7 files)` · `docs:check 6종 전부 통과`.

| Phase | 상태 | 산출물 |
|:-:|:-:|---|
| 0 | ✅ | lint 36 → 0 · `npm run check` · vitest + jsdom · `tsconfig.test.json` · `.github/workflows/quality.yml` |
| 1 | ✅ | `future.hoverOnlyWhenSupported` · `cssContract.test.ts` (17) · INTERACTION_DESIGN §B 입력 장치 규칙 · reduced-motion 정렬 |
| 2 | ✅ | `tokenContract.test.ts` T1–T7 (36) · F1·F4·F5·F6 해소 |
| 3 | ✅ | `a11y.ts`+`a11ySmoke.test.tsx` (axe, 19 컴포넌트) · `keyboard.ts`+`keyboardContract.test.tsx` (APG roving) · `Button.test.tsx` · `useSkeletonPhase.test.ts` · `specs/_TEMPLATE.json` a11y 블록 · 누락 스펙 3종 역추출 |
| 4 | ✅ | `/new-component` L0–L3 라우터 · `/verify` 검증 표 · `docs/rfcs/TEMPLATE.md` + [RFC 컨트롤 높이](./rfcs/2026-09-control-height.md) · DEVIATIONS 절차 이탈 절 |
| 5 | ✅ | `scripts/docs-check.mjs` D1–D6 (자기검사 28건) · 문서 정합 10건 해소 · ROADMAP 현행화 |
| 6 | ✅ | [ANATOMY.md](./ANATOMY.md) — 파트 어휘 · prop 문법 · 13개 전수 해체표 · 불일치 판정 · 강제 수단 |

### 검사 구성 (283 tests)

| 검사 | 수 | 무엇을 잠그는가 |
|---|:-:|---|
| `cssContract` | 17 | 빌드 CSS의 입력 장치 규칙 · reduced-motion |
| `tokenContract` | 36 | T1 var 무결성 · T2 `:root` 스코프 · T3 테마 완전성 · T4 컨트롤 높이 · T5 리터럴 · T6 타이포 · T7 하드코딩 |
| `a11ySmoke` | axe 19 케이스 | 열린 상태 포함 · incomplete도 위반으로 · 스캐너 자기검사 |
| `keyboardContract` | roving·활성화 키 | APG composite widget · 부채 목록 타입 강제 |
| `Button.test` | loading/disabled 대조 · asChild 특성화 · 전 조합 radius | |
| `useSkeletonPhase.test` | Defer + Minimum Hold 6계약 | 대조 훅으로 red 상시 시연 |
| `utils.test` | 5 | `cn()` 충돌 해결 |

### 이번 구현에서 **새로 드러난** 것

| # | 발견 | 처리 |
|---|---|---|
| N1 | Switch의 **arbitrary group variant 8곳**이 hover 가드를 빠져나갔다. Tailwind는 대괄호 안에 직접 쓴 `:hover`를 감싸주지 않는다. 그중 `:not(:hover)` 4건은 별개 버그 — 터치에서 hover가 들러붙어 checked knob이 expanded로 가지 못한다 | fine/coarse 분리로 수정. `cssContract`가 재발을 막는다 |
| N2 | `Badge/shared.ts`가 primitive 팔레트를 직접 쓴다 (85곳). `.ts` 파일이라 기존 `.tsx` grep에 안 잡혔다 | T7 파일 스코프 예외 + DEVIATIONS 기록. **디자이너 판단 대기** |
| N3 | CLAUDE.md의 "`:root`에서 semantic 참조 금지"가 **과도했다.** duration·easing·scale은 `:root`에 정의된 테마 불변 토큰이라 참조해도 체인이 멀쩡하다 | 규칙을 "정의 위치 기준"으로 정밀화. T2가 그 형태로 판정 |
| N4 | `[data-theme="dark"]`의 Tooltip·Callout 오버라이드 18개는 기본 `[data-theme]`과 **특이성이 같아 순서로만** 이긴다 | T3가 순서 역전을 잡는다 |
| N5 | `App.tsx`의 TOC 초기화 effect가 **자식 effect보다 늦게 실행**돼, 탭 쇼케이스가 방금 올린 목차를 덮어썼다 | 소유 페이지 id를 함께 저장해 렌더 중 파생 |
| N6 | 계약 2(`:active`는 가드 밖)가 `:not(:active)`를 눌림 스타일로 **오인**했다 | `:not()`을 걷어내고 양성 사용만 본다. 계약 1은 반대로 `:not(:hover)`도 잡아야 한다 — 비대칭의 근거를 주석에 남김 |

### Phase 3–6에서 **새로 드러난** 것

계약 테스트가 실제로 한 일이다. 전부 소스·렌더 결과에서 직접 확인했다.

| # | 발견 | 처리 |
|---|---|---|
| N7 | **`asChild`가 항상 던진다.** Button 계열은 포커스 링·오버레이 span을 항상 함께 렌더하는데 Radix `Slot`은 자식이 2개 이상이면 `React.Children.only(null)`로 던진다. 공개 prop이고 JSDoc까지 달려 있는데 **켜는 즉시 렌더가 실패한다.** 쇼케이스 사용처가 0건이라 드러나지 않았다 | 특성화 테스트로 현재 동작 고정 + `KNOWN_DEFECTS` 등록. **결정 필요** (아래) |
| N8 | **`loading`이 native `disabled`를 켠다** (`disabled={disabled \|\| loading}`). `aria-disabled`·`aria-busy`를 달아 놓고도 요소가 탭 순서에서 사라진다 — 눌러 놓은 버튼이 로딩에 들어가면 포커스가 body로 떨어지고 `aria-busy`를 읽을 대상이 사라진다 | `KNOWN_KEYBOARD_DEBT` 등록. **결정 필요** |
| N9 | **NavVertical `role="menuitem"`이 menu 부모 없이 쓰였다** (axe `aria-required-parent[critical]`). ARIA에서 menuitem은 애플리케이션 메뉴 항목이지 사이트 내비게이션이 아니다 — 스크린리더가 "메뉴, 항목 1/2"로 읽어 페이지 이동 목록임을 감춘다 | **해소** — role 제거, 네이티브 button + `aria-current="page"` |
| N10 | **NavVertical: 활성 값이 없으면 위젯 전체가 키보드로 도달 불가.** 모든 항목이 `tabIndex=-1`이라 Tab이 통째로 건너뛴다 | **해소** — APG 보완 규칙(선택 없으면 첫 항목이 탭 스톱) |
| N11 | **Callout dialog에 이름이 없다** (axe `aria-dialog-name[serious]`). Radix Popover.Content가 `role="dialog"`인데 스크린리더가 "대화 상자"라고만 읽는다 | **해소** — 본문에 id를 붙이고 `aria-labelledby` 자동 연결. 소비자의 `aria-label`이 이기는 탈출구도 함께 |
| N12 | **Tab.Panel이 포커스 스톱인데 표시가 없다.** Radix가 `tabIndex=0`을 주는데 `outline-none`만 걸고 대체 링이 없다 (WCAG 2.4.7) | **해소** — `focus-visible` 아웃라인 추가 |
| N13 | **`--semantic-secondary-*`는 존재한 적이 없다.** CLAUDE.md의 CVA 대표 예시가 그것을 쓴다 | **해소** — `--comp-button-*` 토큰 예시로 교체. `docs:check` D3이 재발을 막는다 |
| N14 | ChipUniversal이 `aria-pressed`를 무조건 내보내는데 JSDoc은 용도로 "드롭다운 트리거"를 명시한다 — 드롭다운은 `aria-expanded`/`aria-haspopup`이 맞다 | 스펙 `a11y.gaps`에 기록. **결정 필요** |
| N15 | SegmentBar `role="radio"`의 부모가 `role="group"` (Radix ToggleGroup이 만든다) — 보조기술이 "3개 중 1번째"를 읽지 못한다 | `KNOWN_KEYBOARD_DEBT` 등록. Radix 동작이라 우회가 필요 |
| N16 | 스펙에 `accessibility`(자유 형식)와 `a11y`(스키마 고정) 두 키가 공존한다 | tooltip·callout의 기존 키를 `a11y`로 통합해야 한다 |

### 결정 완료 — E1–E4 전부 적용 (2026-09-05)

| ID | 확정 | 결과 |
|:-:|---|---|
| **E1** | `Slottable`로 정상화 | 8개 컴포넌트(Button 계열 6 + TextButton + ChipUniversal). `Slottable`은 `Slot`의 **최상위 자식**이어야 해서(Radix가 한 겹만 훑는다) asChild 경로에서는 콘텐츠 래퍼를 쓸 수 없다 — 아이콘 gap을 루트로 올려 해결. 실측: 8종 전부 `<a href>`로 렌더되고 클래스가 병합된다 |
| **E2** | 포커스 유지로 전환 | `disabled={disabled}` + `aria-disabled` + onClick 가드. `aria-disabled`는 시맨틱일 뿐이고 `pointer-events-none`은 키보드에 무력하므로 가드가 필요하다 — Enter/Space는 브라우저가 click으로 바꿔 주므로 onClick 하나로 덮인다. `keyboardContract`가 loading/disabled 대조로 잠근다 |
| **E3** | 용도 prop으로 분기 | 토글이면 `aria-pressed`, 드롭다운이면 `aria-expanded`. additive라 기존 사용처는 기본값으로 그대로 동작한다 |
| **E4** | 개명 8건 적용 | `icon → iconLeading`(2) · `badge → badgeDot`(2) · `badge → badgeLabel`(1) · 타입명(2) · Chip 닫기 `aria-label` 개방(1). deprecated alias 없이 옛 이름 완전 삭제. 상세는 [ANATOMY §5](./ANATOMY.md) |

**적용 후 게이트**: lint 0 problems · ✓ built · **293 passed (7 files)** · docs:check 6종 통과.

부수 해소: `specs/callout.json`·`tooltip.json`의 자유 형식 `accessibility` 키를 템플릿의
`a11y` 스키마로 옮겼다(N16). 스키마가 고정돼야 `keyboardContract` 케이스를 스펙에서 파생할 수 있다.

**해소된 부채** — 목록이 줄어든 것을 각 목록의 키 대조 단언이 확인한다:
`KNOWN_DEFECTS['asChild가 항상 던진다']` · `KNOWN_KEYBOARD_DEBT['Button.loading이_탭_순서에서_빠짐']`
· `KNOWN_A11Y_DEBT` 3건(앞서 해소). 남은 부채는 `KNOWN_DEFECTS['type을 지정하지 않는다']` ·
`KNOWN_KEYBOARD_DEBT` 2건(NavVertical 탭스톱·SegmentBar radiogroup)이다.

### 육안 확인 — 실행 결과 (2026-09-05)

계획서가 요구한 육안 확인 3건을 계산값·픽셀 대조로 마쳤다. "눈으로 봤다"보다 강한 증거를 남긴다.

| 항목 | 방법 | 결과 |
|---|---|---|
| **[347]** 터치에서 hover 잔상 | 터치 에뮬레이션으로 **실제 탭**한 뒤 상태 오버레이의 `background-color` 측정 | 탭 전·직후·다른 곳 탭 후 전부 `rgba(0,0,0,0)` — **잔상 0**. 대조군(데스크톱 hover)은 `rgba(253,254,254,0.08)` 로 정상 적용 |
| **[425]** 타이포 교체 픽셀 차이 | 교체 **전 커밋(be26890)을 worktree 로 빌드**해 같은 화면을 찍고 SHA-256 대조 | Badge·NavVertical·Chip.BadgeLike 세 영역 모두 **해시 완전 일치** — 바이트 단위로 동일 |
| **[286]** 포털 테마 상속 (`useAncestorTheme` 리팩터링) | 테마 토글을 클릭하고 포털 콘텐츠의 `data-theme` 추적 | Tooltip 포털 6개·Callout 포털 1개가 light↔dark **양방향으로 즉시 따라옴**. 이전 구현은 렌더가 일어나야만 갱신됐다 |

> **A/B 주입은 유효하지 않다.** 처음에 교체 전 클래스를 런타임에 주입해 비교하려 했으나,
> Tailwind JIT 이 소스에서 사라진 클래스를 CSS 에서 지우므로 주입해도 적용되지 않는다
> (`text-[13px]` 이 16px 로 계산됐다). **삭제된 클래스는 그 시점의 빌드로만 재현된다.**

### 미검증으로 **남겨둔** 것

- **T4 미측정 컨트롤 3종** — Checkbox·Radio(visual + inset 구조라 소스만으로 높이 확정 불가), NavVertical(높이를 선언하지 않음). `UNMEASURED_CONTROLS`에 사유와 함께 등록돼 있고, 목록이 비어 있지 않은 한 "전부 통과"라고 쓰지 않는다.
- **시각 회귀** — 타이포 토큰 교체(5곳)와 reduced-motion 변경은 값 등가를 소스로 확인했을 뿐 픽셀 대조는 하지 않았다. 육안 확인이 남아 있다.
- **`specs/segment-bar.json:125` 패딩 4px vs 토큰 2px** — Figma 대조 필요 (§2.3 D1).
- **`KNOWN_KEYBOARD_DEBT` 1건 (`NavVertical.탭스톱이_포커스를_따라가지_않음`) · `KNOWN_DEFECTS` 0건** — 현재 동작을 고정해 회귀는 막지만 **통과가 아니다.** 각 목록은 인용되지 않은 항목(죽은 부채)을 잡는 단언과 키 목록 대조를 함께 갖는다 — 승인 없이 늘면 그 단언이 먼저 깨진다.
- **`UNMEASURED_*` 4개 목록** — `tokenContract`(컨트롤 3종) · `a11ySmoke`(색 대비 등 5) · `keyboardContract`(3) · `docs-check`(5). 비어 있지 않은 한 "전부 통과"라고 쓰지 않는다.
- **시각 회귀 전반** — 계약 검사는 선언의 **위치**와 **값**만 본다.

---

## 0. 왜 지금인가 — 2026-09-05 실측

CLAUDE.md와 `docs/` 13종은 규칙을 충분히 갖고 있다. 문제는 그 규칙을 판정하는 수단이 **사람이(또는 에이전트가) 파일을 읽고 판단하는 것** 하나뿐이라는 점이다. `/verify` 스킬의 12항목 패턴 검사도 실행 코드가 아니라 "읽고 판단하라"는 지시문이다. 아래는 그 방식이 놓친 것들이다. 전부 오늘 저장소에서 직접 확인했다.

### 0.1 규칙은 있었지만 검사가 없어서 새어나간 것

| # | 실측 | 위치 | 산문으로만 존재하던 규칙 |
|---|------|------|------------------------|
| F1 | `var(--semantic-primary-300)` 참조가 있으나 **`--semantic-primary-*` 패밀리는 존재하지 않는다.** ChipUniversal 포커스 링이 색을 잃는다(미정의 var → `border-color` 무효 → `currentColor`로 폴백). primary 패밀리는 `b843d30`(2026-03-24)에서 `emphasized-*`로 재편됐는데, 이 토큰은 그 **일주일 뒤** `6234c1d`(03-31)에 이미 없는 이름을 참조하며 추가됐다 — 즉 처음부터 빈 값이었고 이 링은 줄곧 텍스트색으로 그려졌다 | [tokens.css:1480](../src/tokens/tokens.css#L1480), [ChipUniversal.tsx:95](../src/components/Chip/ChipUniversal.tsx#L95) | CLAUDE.md "⚠️ var() 체인이 끊어져 값이 비어짐" |
| F2 | 같은 `semantic-primary`가 **문서 6곳 16회**에 살아 있다 (CLAUDE.md 4 · token-reference.md 5 · TOKEN_LAYER_RULES.md 4 · DESIGN_PRINCIPLES.md 1 · COMPONENT_PATTERNS.md 1 · SHOWCASE_TEMPLATE.md 1). 문서를 따라 쓰면 존재하지 않는 클래스가 나온다 | 각 문서 | CLAUDE.md "문서 관리 원칙" |
| F3 | `hover:`/`group-hover:` **48곳 / 18파일**에 입력 장치 가드가 없다. 터치 기기에서 탭 이후 hover 배경이 남는다 | `src/components/**` | INTERACTION_DESIGN §G "모바일: hover 없음" |
| F4 | `--comp-segment-item-height-lg: 44px` 리터럴 — `--primitive-spacing-11`(44px)이 있는데 참조하지 않는다. spec에도 이 항목만 primitive 주석이 빠져 있다. **44 자체는 정상이다** — SegmentBar의 컨트롤은 아이템이 아니라 레일이고, 레일 = 아이템 + 패딩×2 = 44+4 = 48로 그리드 위에 있다 | [tokens.css:813](../src/tokens/tokens.css#L813), [segment-bar.json:129](../specs/segment-bar.json#L129) | CLAUDE.md "크기 토큰은 spacing 토큰 참조" |
| F5 | `--comp-badge-height-nano: 16px` 리터럴 — `--primitive-spacing-4`(16px) 존재 | [tokens.css:715](../src/tokens/tokens.css#L715) | 위와 동일 |
| F6 | 타이포그래피 arbitrary **5곳 / 3파일** — `text-[10px] leading-[12px] font-medium`은 `typography-10-medium`과 값이 정확히 같다(10px/12px/0em/500). `typography-13-medium`, `typography-11-medium`도 존재 | [chip-badgelike-shared.tsx:22](../src/components/Chip/chip-badgelike-shared.tsx#L22), [NavVertical.tsx:108-109](../src/components/NavVertical/NavVertical.tsx#L108-L109), [BadgeLabel.tsx:24-25](../src/components/Badge/BadgeLabel.tsx#L24-L25) | CLAUDE.md "DON'T: 하드코딩 값 `text-[16px]`" |
| F7 | `--semantic-duration-medium`(150ms)이 tokens.css·motion.ts·tailwind config에 존재하지만 **CLAUDE.md 모션 표와 token-reference.md에 없다** | [tokens.css:535](../src/tokens/tokens.css#L535) | 문서 동기화 |
| F8 | reduced-motion: 문서는 "opacity 전이는 유지, transform만 제거"인데 CSS는 **모든 transition을 0.01ms로** 죽인다 | [index.css:37](../src/index.css#L37) vs INTERACTION_DESIGN §A | 문서 ↔ 구현 |
| F9 | `npm run lint` **36건 red** (34 error / 2 warning). 그중 `react-refresh/only-export-components` 19건(쇼케이스 16·`chip-badgelike-shared` 2·`Sidebar` 1)은 `*_TOC`·`NAV_GROUPS`·공유 상수 export 패턴과 규칙의 충돌이고, 컴포넌트 영역 12건 중 `set-state-in-effect` 3건·`refs` 1건·`exhaustive-deps` 2건은 실제 검토 대상이다 | Callout.tsx:85-91, Tooltip.tsx:54-60, TextReservation.tsx:124, usePretext.ts:75 | 게이트가 처음부터 red면 아무도 보지 않는다 |
| F10 | 테스트 파일 **0건**, CI **0건** | — | COMPONENT_CHECKLIST "Testing (Phase 5 설정 후 적용)" |
| F11 | specs 11개 vs 컴포넌트 13개 — **Tab · Skeleton · Chip.Universal**에 spec이 없다 (IconButton은 button.json에 포함) | `specs/` | CLAUDE.md "1. Create JSON spec first" |
| F12 | ROADMAP.md에 이미 구현된 7개(Checkbox·Radio·Switch·Badge·Skeleton·Tooltip·Tabs)가 미체크. DEVIATIONS.md는 0건 — 이탈이 없었던 게 아니라 기록 경로가 작동하지 않은 것(F4·F5·F6이 전부 이탈이다) | `docs/ROADMAP.md`, `docs/DEVIATIONS.md` | 원칙 8 |
| F14 | Switch의 **arbitrary group variant** 8곳이 hover 가드를 빠져나간다. Tailwind는 대괄호 안에 직접 쓴 `:hover`를 감싸주지 않는다. 그중 4건(`:not(:hover)`)은 별개 버그 — 터치에서 hover가 들러붙어 checked knob이 expanded로 가지 못한다 (빌드 CSS 실측: 가드 안 39 / 밖 8) | `src/components/Switch/Switch.tsx` | INTERACTION_DESIGN §B 입력 장치 규칙 |
| F13 | `skill-metabolism/SKILL.md` frontmatter에 `name`이 없다 | `.claude/skills/skill-metabolism/SKILL.md` | 스킬 frontmatter 규약 |

### 0.2 오늘 이미 지켜지고 있는 것 (검사는 이것을 **잠그는** 용도)

- `npm run build` green (tsc + vite, 1.3s)
- 마크다운 상대 링크 82건 / 28파일, 깨진 것 **0**
- 쇼케이스 등록 `SHOWCASE_MAP` 17 ↔ `NAV_GROUPS` 17 정합 (`VALID_SHOWCASE_IDS`는 `SHOWCASE_MAP`에서 파생 — 등록 누락이 구조적으로 불가능)
- 컴포넌트 안에서 primitive 토큰 직접 사용 **0**, `transition-all` **0**, 기본 `duration-N` **0**, hex 색상 **0**
- `:root`에서 `var(--semantic-*)` 참조 **0**, 색상 comp 토큰의 `:root` 선언 **0**
- 커스텀 프로퍼티 정의 958개 · 참조 562개 중 미정의 **1** (F1)

이 목록이 중요한 이유: 검사를 도입하면 **첫날부터 green인 항목**이 대부분이다. 검사의 역할은 지금 상태를 잠그고, 새어나가는 순간 red를 내는 것이다.

---

## 1. 목표와 비목표

**목표**

1. CLAUDE.md·docs에 있는 규칙 중 **기계 판정이 가능한 것은 전부** `npm run check` 한 명령으로 판정된다.
2. `/verify` 스킬은 검사를 **읽고 흉내 내는 대신 실행**한다. 에이전트의 판단은 스크립트가 판정할 수 없는 것(JSDoc 설명 품질, 설계 적합성)에만 쓴다.
3. 새 검사는 도입 시점에 **red를 실제로 보여준다**. 통과만 보고된 검사는 아무것도 검사하지 않아도 통과한다.
4. 작업의 위험도에 따라 절차의 무게가 달라진다. 오타 수정과 신규 컴포넌트가 같은 4-phase를 밟지 않는다.

**비목표** (이 계획이 건드리지 않는 것)

- Storybook — 자체 쇼케이스가 그 역할을 이미 한다
- npm 배포·버전·CHANGELOG — `private: true`, 소비자 0
- 픽셀 단위 시각 회귀 — computed style·DOM 계약까지만
- E2E·실브라우저 테스트 — jsdom 계약이 먼저다

---

## 2. 원칙 — 왜 이렇게 하는가

[DESIGN_PRINCIPLES.md §F](./DESIGN_PRINCIPLES.md#f-디자인-판단의-기초-원칙-meta)의 원칙이 그대로 근거다.

| 원칙 | 이 계획에서의 적용 |
|---|---|
| **2. 시스템으로 판단 대체** | "읽고 판단"을 "실행하고 판정"으로 바꾼다. 검사가 존재하는 규칙은 사람이 기억할 필요가 없다 |
| **3. 실증 지향** | §0의 실측이 착수 근거다. "있을 것 같은" 문제가 아니라 오늘 있는 문제를 푼다 |
| **4. 시각 디테일은 시스템 통제** | 높이 허용 집합, 타이포 토큰 강제, hover 입력 장치 가드 — 개별 픽셀 판단을 검사가 대신한다 |
| **8. 시스템 이탈 = 수정 신호** | 예외 목록은 **줄이기만 한다**. 예외를 추가하는 순간이 곧 승인을 받아야 하는 시점이다 |

**게이트 운영 4원칙** (모든 Phase 공통)

1. **오늘 존재하는 명령만 문서에 적는다.** 만들 예정인 검사를 "통과 조건"으로 쓰지 않는다.
2. **green의 기준은 "실행이 끝났다"가 아니라 "출력을 읽고 실패·경고·skip이 없음을 확인했다"이다.** 보고는 수치로 한다 (`36 passed`, `0 problems`).
3. **새 검사는 red를 먼저 보여준다.** 결함을 주입해 실패하는 것을 확인하고, 그 실패 건수를 PR 본문에 적는다.
4. **"미검증"과 "통과"를 구분한다.** 검사가 보지 못하는 항목은 별도 목록(`UNMEASURED_*`)에 두고, 그 목록이 비어 있지 않은 한 "전부 통과"라고 쓰지 않는다.

---

## 3. 단계별 계획

순서는 의존성과 즉시 효과로 정했다. Phase 0 → 1 → 2 → 3 → 4 → 5 → (6). 각 Phase는 **하나의 PR**을 목표로 한다.

```
Phase 0  베이스라인 정리 + 검사 러너 + CI     ← 게이트가 green에서 출발
Phase 1  입력 장치 규칙 (hover 가드)          ← config 1줄, F3 해소
Phase 2  토큰 계약 검사                       ← F1·F4·F5·F6 해소
Phase 3  컴포넌트 계약 테스트 (a11y·키보드)   ← F10 해소
Phase 4  워크플로 재편 (위험도 등급·검증 표)   ← 절차의 무게 분리
Phase 5  문서·스킬·스펙 정합 검사              ← F2·F7·F11·F13 해소
Phase 6  파트 명명 표준 (조건부)
```

---

### Phase 0 — 베이스라인 정리 + 검사 러너 + CI

**목적**: 이후 모든 Phase가 올라탈 `npm run check`의 형태를 확정하고, 그것이 **첫날부터 green**이게 한다. lint가 36건 red인 상태에서 게이트를 추가하면 red가 배경 소음이 되어 새 red가 묻힌다.

#### 0.1 lint 36건 → 0

| 분류 | 건수 | 처리 |
|---|:-:|---|
| `react-refresh/only-export-components` (쇼케이스 `*_TOC`, `NAV_GROUPS`, `chip-badgelike-shared`) | 19 | **확정 (D4):** `src/showcase/**`·`Sidebar.tsx`는 `eslint.config.js`에서 이 규칙 제외 — 라이브러리 표면이 아니고, HMR 경고는 DX 알림이지 결함이 아니다. `src/components/**`에서는 규칙을 유지하고 `chip-badgelike-shared.tsx`의 공유 상수만 컴포넌트 없는 `.ts` 모듈로 분리 |
| `react-hooks/set-state-in-effect` | 6 (컴포넌트 3) | Callout·Tooltip: 의존성 배열 없는 effect에서 `data-theme` 조상을 읽어 setState — 포털 콘텐츠의 테마 상속 문제라 목적은 정당하다. `MutationObserver` 구독 또는 `useSyncExternalStore`로 바꾼다. TextReservation: 파생 상태를 렌더 중 계산으로 옮긴다 |
| `react-hooks/refs` | 3 (컴포넌트 1) | `usePretext.ts:75` 렌더 중 ref 읽기 — 측정값을 state로 승격하거나 layout effect로 옮긴다 |
| `react-hooks/exhaustive-deps` | 2 | 위 Callout·Tooltip 수정에 흡수 |
| `@typescript-eslint/no-unused-vars` | 5 (컴포넌트 3) | 삭제 |
| `react-hooks/rules-of-hooks` | 1 | `showcase-blocks.tsx:357` 조건부 `useMemo` — 훅을 early return 위로 올린다 |

#### 0.2 스크립트 확정

```jsonc
// package.json
"scripts": {
  "dev":        "vite",
  "build":      "tsc -b && vite build",
  "preview":    "vite preview",
  "lint":       "eslint .",
  "lint:fix":   "eslint . --fix",
  "typecheck":  "tsc -b",
  "test":       "vitest",
  "test:run":   "vitest run",
  "docs:check": "node scripts/docs-check.mjs",          // Phase 5에서 추가
  "check":      "npm run lint && npm run build && npm run test:run"
}
```

- `check`에 `typecheck`를 따로 넣지 않는다 — `build`의 `tsc -b`가 같은 일을 한다. `typecheck`는 편의용이다.
- **순서가 계약이다.** `test:run`은 `build` 뒤에 온다. Phase 1의 CSS 계약 테스트가 `dist/assets/*.css`를 읽기 때문이다. 단독으로 `npm run test:run`을 돌릴 때는 먼저 `build`가 필요하고, 그 테스트는 dist가 없으면 "dist 없음 — `npm run build` 먼저"라는 메시지로 실패한다(조용히 skip하지 않는다).
- CLAUDE.md "Development Commands"의 `(if configured)` 표기를 지우고 실제 명령으로 바꾼다. README Quick Start도 같이.

#### 0.3 Vitest 도입 (러너만)

```
devDependencies 추가
  vitest                      ^5.0     (vite ^7 peer 지원 확인)
  @testing-library/react      ^16.3    (react ^19 peer 지원 확인)
  @testing-library/user-event ^14.6
  jsdom                       ^30
```

```ts
// vite.config.ts
/// <reference types="vitest/config" />
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['src/testing/setup.ts'],
  },
})
```

- 테스트 헬퍼는 `src/testing/`에 둔다. **어떤 컴포넌트 `index.ts`에서도 export하지 않는다** — 라이브러리 표면이 아니다.
- Phase 0에서는 러너가 도는 것만 확인한다: `src/lib/utils.test.ts` (`cn()` 충돌 해결 3케이스). 이것이 "테스트 0건"을 깨는 첫 파일이다.
- **확정 (D5):** `describe`/`it` 한글, DOM API 직접 사용(`getAttribute`), jest-dom matcher 미도입 — 의존성이 하나 줄고 단언이 무엇을 보는지 명시적이다. CLAUDE.md "Testing Conventions" 절이 이 컨벤션의 canonical 이다.

#### 0.4 CI

```yaml
# .github/workflows/quality.yml
name: quality
on:
  pull_request: { branches: [main] }
  push: { branches: [main] }
permissions: { contents: read }
concurrency:
  group: quality-${{ github.head_ref || github.ref }}
  cancel-in-progress: true
jobs:
  check:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 24, cache: npm }
      - run: npm ci
      - run: npm run check
```

- **경로 필터를 두지 않는다.** 필터를 두면 스킬·워크플로·문서 변경이 검사를 빠져나가고, 그 누락은 조용해서 발견이 늦다. 이 저장소 규모에서 전체 실행(현재 build 1.3s)이 그 위험보다 싸다.
- `push: main` 트리거는 로컬에서 훅 없이 푸시한 경우를 잡는 안전망이다.
- **확정 (D6):** 워크플로만 둔다. **required status check(branch protection)는 지정하지 않는다** — 소비 레포가 없어 지금은 막을 대상이 없다. 워크플로는 로컬에서 `check` 없이 푸시한 경우를 잡고 public 레포에 검사 결과를 남긴다. 소비자가 생기면 그때 required로 올린다.

#### 0.5 `/commit` 스킬 Step 0 갱신

`npm run build` → `npm run check`. 실패 시 중단·리포트는 그대로.

#### 완료 기준

- [ ] `npm run check` exit 0, 출력에 `0 problems`·`N passed`·`✓ built`가 모두 있다
- [ ] PR에서 `quality` 워크플로 green
- [ ] CLAUDE.md·README의 명령 표가 실제 스크립트와 일치한다
- [ ] 컴포넌트 영역 lint 수정 4건(Callout·Tooltip·TextReservation·usePretext)은 **동작 변화 없음**을 쇼케이스에서 육안 확인하고 PR 본문에 적는다

**예상 규모**: 수정 파일 ~12, 신규 4 (`vite.config.ts` 수정, `src/testing/setup.ts`, `src/lib/utils.test.ts`, `.github/workflows/quality.yml`)

---

### Phase 1 — 입력 장치 규칙 (hover 가드)

**목적**: F3 해소. "터치에는 hover가 없다"는 INTERACTION_DESIGN §G의 사실을 **빌드가 강제**하게 한다.

#### 1.1 구현 — config 1줄

```js
// tailwind.config.js
export default {
  future: { hoverOnlyWhenSupported: true },
  // ...
}
```

Tailwind 3.4의 이 플래그는 `hover:`·`group-hover:`·`peer-hover:` 변형을 전부 `@media (hover: hover) and (pointer: fine) { &:hover }`로 감싼다. **48곳의 클래스를 한 글자도 바꾸지 않는다.** 마우스·트랙패드에서만 hover가 적용되고 터치·스타일러스 hover 잔상이 사라진다.

`active:`는 손대지 않는다 — 눌림 피드백은 입력 장치를 가리지 않아야 한다. 터치에서 즉각적인 반응이 없으면 사용자는 탭이 먹지 않았다고 판단한다. `focus-visible:`도 장치와 무관하게 유지한다.

#### 1.2 검사 — 빌드된 CSS 계약

```ts
// src/testing/cssContract.test.ts  (dist/assets/*.css 기반)
```

- 빌드 CSS를 postcss로 파싱해 `:hover`를 포함한 **모든** 규칙이 `@media (hover: hover)` 안에 있음을 단언한다. 밖에 하나라도 있으면 그 selector를 출력하며 실패.
- 두 번째 단언: `:active`를 포함한 규칙은 **media query 밖**에 있다(위 플래그가 active까지 감싸는 회귀를 막는다).
- dist가 없으면 skip이 아니라 **실패**한다.
- **red 시연**: 플래그를 `false`로 두고 돌리면 48곳이 전부 잡혀야 한다. 그 건수를 PR에 적는다.

#### 1.3 문서 — INTERACTION_DESIGN §B에 "입력 장치 규칙" 소절 추가

| 상태 | 적용 장치 | 근거 |
|---|---|---|
| hover | fine pointer만 (`hover: hover` + `pointer: fine`) | 터치는 탭 후 hover가 남아 눌린 것처럼 보인다 |
| pressed (`active:`) | 전 장치 | 즉각 피드백이 없으면 탭이 안 먹은 줄 안다 |
| focus-visible | 전 장치, 입력 방식 무관 | 키보드 사용자의 현재 위치 |
| disabled | hover·pressed 모두 없음 (우선순위 최상위) | 상호작용 불가를 시각적으로도 일관되게 |

- **hover와 pressed의 순서**: 같은 요소에 둘 다 있으면 pressed가 hover를 덮는다. CVA 문자열에서 `active:`를 `hover:` 뒤에 둔다 — 지금 `stateOverlayMap`이 이미 그 순서다. 이것도 소절에 규칙으로 적는다.

#### 1.4 확정 (D3) — reduced-motion 정렬

문서(§A 판단 트리)와 CSS(`index.css:37`)가 어긋났다. **문서 쪽이 맞다** — `prefers-reduced-motion`이 다루는 것은 전정기관을 자극하는 *움직임*이고, 색·투명도 전환까지 끄면 상태 변화가 오히려 덜 보인다.

**구현 (완료):**

1. 전역 `*` 규칙에서 `transition-duration: 0.01ms`를 뺀다. `animation-duration`·`animation-iteration-count`·`scroll-behavior`는 유지.
2. **press scale은 토큰으로 끈다.** `--semantic-scale-press-sm`·`-lg`를 `1`로 덮으면 이 둘을 참조하는 `--comp-*-scale-pressed` 8개가 전부 따라온다 — 컴포넌트를 하나도 건드리지 않는다. 토큰 계층이 이미 고정점을 만들어 둔 덕이다(원칙 1).
3. `--comp-scale-press-transition-in/out`은 `transform 0s`로 둔다. **`none`을 쓰면 안 된다** — Tab이 `[transition:color …, var(--comp-scale-press-transition-out)]`처럼 합성 목록에 넣으므로 `none`이 들어가면 목록 전체가 무효가 되어 색 전환까지 죽는다.
4. 위치·크기가 바뀌는 전환 2곳에만 개별 가드: Switch placer slide(`motion-reduce:transition-none`), Switch knob size morph(`motion-reduce:transition-[background-color,box-shadow]` — 색은 남긴다).
5. `.motion-essential` 탈출구 유지. **현재 사용처 0건** — 스피너류가 아직 없다.

#### 완료 기준

- [ ] `cssContract` green + red 시연 건수 기록
- [ ] 쇼케이스를 터치 에뮬레이션(DevTools)으로 열어 Button·Chip·Tab에서 탭 후 hover 잔상이 없음을 확인
- [ ] INTERACTION_DESIGN §B 소절 추가, D3 결정 기록

**예상 규모**: 수정 2 (`tailwind.config.js`, `INTERACTION_DESIGN.md`), 신규 1 (`cssContract.test.ts`), postcss는 이미 devDependency

---

### Phase 2 — 토큰 계약 검사

**목적**: `tokens.css`와 컴포넌트 소스를 정적으로 읽어 CLAUDE.md의 토큰 규칙을 판정한다. F1·F4·F5·F6 해소. `/verify` "검사 2 토큰 무결성"과 "검사 3" 중 grep 가능한 항목이 여기로 온다.

#### 2.1 `src/testing/tokenContract.test.ts`

| ID | 검사 | 판정 대상 | 오늘 red |
|---|---|---|:-:|
| T1 | **var() 무결성** — `tokens.css`·`src/components/**`·`index.css`의 모든 `var(--x)` 참조가 정의돼 있다. TS 템플릿(`var(--primitive-${…})`)은 동적 목록으로 제외하되 그 목록을 테스트 파일에 명시 | 전역 | **1** (`--semantic-primary-300`) |
| T2 | `:root` 스코프에서 `var(--semantic-*)` 참조 금지 | tokens.css | 0 |
| T3 | 색상 comp 토큰(`bg`·`content`·`border`·`hover`·`active`·`focus`)은 `[data-theme]` 스코프에만 | tokens.css | 0 |
| T4 | **컨트롤 높이 허용 집합** — 등록된 컨트롤의 `--comp-*-height-*`를 var 체인까지 해석한 뒤 집합과 대조 | tokens.css | D1에 따라 0 또는 1 |
| T5 | **높이 토큰 리터럴 금지** — `--comp-*-height-*` 값이 `Npx` 리터럴이고 같은 값의 `--primitive-spacing-*`가 존재하면 실패 | tokens.css | **2** (44px, 16px) |
| T6 | **타이포그래피 arbitrary 금지** — 컴포넌트 클래스 문자열의 `text-[Npx]`·`leading-[Npx]` | components | **5** |
| T7 | 컴포넌트 안 `-primitive-` 직접 사용 · hex 색상 · `transition-all` · `duration-N` · `ease-(in\|out\|in-out)` · 기본 `text-(xs\|sm\|base\|lg)` | components | 0 |

T7은 `/verify` 검사 3의 #3·#5·#6을 그대로 옮긴 것이다. `style={{ fontSize }}`는 CLAUDE.md가 아이콘 컨테이너에 **요구**하는 패턴이므로(현재 15곳) 검사 대상이 아니다 — 이 예외를 테스트 파일 주석에 적는다.

#### 2.2 T4의 세 목록 — 손으로 유지하고, 줄이기만 한다

```ts
/**
 * 컨트롤 심볼. **손으로 유지한다** — 자동 판별이 불가능하다.
 * height 36px이 버튼인지 썸네일인지 코드는 말해주지 않는다.
 * 새 인터랙티브 컴포넌트를 만들면 여기 등록한다. 등록하지 않으면 검사가 보지 않는다.
 */
const CONTROLS = {
  Button:        { height: '--comp-button-height-' },
  TextButton:    { height: '--comp-text-button-height-' },
  Tab:           { height: '--comp-tab-height-' },
  ChipUniversal: { height: '--comp-chip-universal-height-' },
  ChipBadgeLike: { height: '--comp-chip-badgelike-height-' },
  // SegmentBar의 컨트롤은 아이템이 아니라 **레일**이다. 레일은 높이를 선언하지
  // 않고 아이템 + 컨테이너 패딩×2 로 결정되므로 계산해서 잰다.
  SegmentBar:    { height: '--comp-segment-item-height-', padding: '--comp-segment-bar-padding-' },
  // Badge는 비인터랙티브 — T4 대상 아님 (T5는 적용)
}

/** 허용 높이. 2026-09-05 실측 동결. **목록은 줄이기만 한다.** */
const ALLOWED_HEIGHTS = [20, 24, 28, 32, 36, 40, 48, 56]

/**
 * 하한 미만·집합 밖인데 아직 결정을 기다리는 항목. **승인된 예외가 아니다.**
 * 검사를 통과시키려고 등록해 둔 부채 목록이며, 승인이 나면 사유와 함께 정식 예외로 옮기고 해소되면 뺀다.
 */
const PENDING_DECISION: Record<string, number> = {}

/** height를 선언하지 않아 소스 스캔으로 잴 수 없는 컨트롤. 검증되지 않은 것이지 통과한 것이 아니다. */
const UNMEASURED_CONTROLS: string[] = []
```

새 인터랙티브 컴포넌트를 만들면 **여기 등록한다.** 등록하지 않으면 검사가 그 컴포넌트를 보지 않는다. 이 사실을 `/implement` 스킬 Step에 한 줄로 넣는다.

#### 2.3 결정 D1 — 높이 허용 집합과 44px

현재 실측 컨트롤 높이: `20 · 24 · 28 · 32 · 36 · 40 · 44 · 48 · 56` (Badge nano 16은 비인터랙티브). 40까지 4px 그리드, 그 뒤 8px, 그리고 44가 혼자 그리드 밖이다.

| 선택지 | 내용 | 비고 |
|---|---|---|
| **A (권장)** | 실측 9개 값을 그대로 동결하고 **줄이기만** 한다 | 원칙 1(고정점) — 현재 Figma 값이 고정점. 44는 `--primitive-spacing-11` 참조로 고치되 값은 보존 |
| B | `24·28·32·36·40·48·56`으로 좁히고 20·44는 `PENDING_DECISION` | 20은 Chip.BadgeLike xs·Badge xs, 44는 SegmentBar lg. 디자이너 확인 전까지 부채로 표기 |

어느 쪽이든 **44px는 SegmentBar spec(Figma)에서 재확인**한다. spec 파일에 이 항목만 primitive 주석이 빠진 것이 "값을 의심하라"는 신호다. 결정은 `docs/rfcs/`(Phase 4)의 첫 RFC로 기록한다 — "치수 토큰을 만들지 않고 규칙+검사로 강제한다"는 결정 자체가 기록 대상이다.

#### 2.4 결정 D2 — ChipUniversal 포커스 색

`--semantic-primary-300`은 primary → emphasized 재편에서 누락된 한 줄이다. SegmentBar 포커스가 `--semantic-emphasized-purple-300`을 쓰므로 같은 계열(`emphasized-purple-300`)이 재편 의도에 가깝다. 다만 Chip.BadgeLike·Button·Tab 등 나머지 전부는 `neutral-solid-1000`이다. **Figma에서 확인하고 고른다.** 확인 전까지는 `emphasized-purple-300`으로 두고(현재 `currentColor` 폴백보다 낫다) T1을 green으로 만든다.

#### 완료 기준

- [ ] T1~T7 전부 green. red 시연: T1 `--semantic-x-999` 주입 1건, T5 리터럴 주입 1건, T6 `text-[9px]` 주입 1건 — 각각 실패 확인
- [ ] F1: tokens.css:1480 수정 (D2). F4·F5: `var(--primitive-spacing-11)`·`var(--primitive-spacing-4)` 참조. F6: 5곳을 `typography-10-medium`·`typography-13-medium`·`typography-11-medium`으로 교체 후 쇼케이스 육안 비교(값이 같으므로 픽셀 차이 0이어야 한다)
- [ ] `specs/segment-bar.json:129`에 primitive 주석 보완
- [ ] `/verify` 검사 2·3에서 스크립트화된 항목을 "`npm run test:run -- tokenContract` 실행"으로 교체

**예상 규모**: 신규 1 (`tokenContract.test.ts` ~250줄), 수정 6 (tokens.css, 3개 컴포넌트, segment-bar.json, 05-verify)

---

### Phase 3 — 컴포넌트 계약 테스트 (a11y · 키보드)

**목적**: COMPONENT_CHECKLIST "Accessibility" 절의 항목 중 기계 판정 가능한 것을 테스트로 옮긴다. F10 해소.

#### 3.1 의존성

```
axe-core               ^4.13
dom-accessibility-api  ^0.7
```

#### 3.2 헬퍼 — `src/testing/a11y.ts`

```ts
export const scanA11y = async (container: HTMLElement, opts?: { disableRules?: string[] }): Promise<string[]>
```

- 컴포넌트 단위 스캔이므로 **페이지 규칙은 끈다**: `region`, `page-has-heading-one`, `bypass`, `landmark-one-main`. 이건 컴포넌트 결함이 아니라 스캔 범위의 산물이다. 끄는 이유를 헬퍼 주석에 적는다.
- **`incomplete`도 위반으로 취급한다.** axe는 판정에 확신이 없으면 violation이 아니라 incomplete로 분류하는데, 존재하지 않는 id를 가리키는 `aria-describedby` 같은 실제 결함이 여기로 빠진다. violation만 보면 아무 일도 없는 것처럼 통과한다. jsdom에서 판정 자체가 불가능한 규칙(`color-contrast` — 레이아웃과 실제 색 계산 필요)만 `UNDECIDABLE_INCOMPLETE`로 제외한다.
- 반환은 `id[impact]` 문자열 배열로 정규화한다 — 실패 메시지가 사람이 읽을 수 있고, 부채 목록과 대조하기 쉽다.

#### 3.3 헬퍼 — `src/testing/keyboard.ts`

```ts
export const focusOrder = async (user: UserEvent, keys: string[]): Promise<string[]>
export const inspectRovingTabIndex = (items: HTMLElement[]): { ok: boolean; focusable: string[]; tabIndexes: number[]; attributes: (string | null)[] }
```

- `focusOrder`는 키를 순서대로 누르고 각 단계의 `document.activeElement`를 **접근 가능한 이름**으로 기록한다. `textContent`를 쓰지 않는다 — `aria-hidden` 사본까지 세기 때문이다.
- `inspectRovingTabIndex`는 **단언하지 않고 보고만** 한다. `tabIndex` 프로퍼티와 `tabindex` 속성을 따로 돌려주는 이유: "속성을 안 달았다"와 "tab 순서에서 뺐다"는 고치는 방법이 다르다.
- 근거는 APG composite widget 규칙: Tab 한 번으로 위젯에 진입하고 방향키로 내부를 이동하려면 항목 중 **정확히 하나만** tab 순서에 있어야 한다.

#### 3.4 테스트

| 파일 | 내용 | 대상 |
|---|---|---|
| `src/testing/a11ySmoke.test.tsx` | 13개 컴포넌트를 대표 props로 렌더 → `scanA11y` 결과 `[]`. **열리는 컴포넌트는 연 상태에서도 스캔** (Tooltip·Callout 열림, NavVertical 그룹 펼침) — 닫힌 상태만 스캔하고 통과했다고 적는 것을 막는다 | 전체 |
| `src/testing/keyboardContract.test.tsx` | **NavVertical**: 수동 roving (`ArrowDown/Up/Home/End`, 활성 항목만 `tabIndex=0`) — 유일하게 직접 구현한 키보드 로직이라 1순위. **Tab**: `activationMode` automatic/manual 차이(방향키 이동 시 패널 전환 여부). **SegmentBar·Radio**: roving 1개 규칙. **Switch·Checkbox**: Space 토글, Enter 무반응. **Tooltip**: focus로 열림·Escape 닫힘. **Callout**: Escape | 인터랙티브 8개 |
| `src/components/Skeleton/useSkeletonPhase.test.ts` | Defer + Minimum Hold 타이머 정책 — 로직이 있는 훅은 단위 테스트가 정직하다 | Skeleton |
| `src/components/Button/Button.test.tsx` | loading: `aria-busy`·`aria-disabled`·콘텐츠 `invisible`·클릭 무시. disabled와 loading의 탭 순서 차이 | Button |

**렌더 계약만 검사한다** — hover 배경색, 인디케이터 위치 같은 시각 축은 이 테스트의 범위 밖이다(Phase 1 CSS 계약과 쇼케이스 육안이 담당).

#### 3.5 스펙 템플릿 — `a11y` 블록 추가

`specs/_TEMPLATE.json`의 `states`에는 hover·pressed·focused·disabled·loading만 있고 키보드·ARIA 계약이 없다. 추가한다:

```jsonc
"a11y": {
  "role": "tablist | radiogroup | button | …",
  "keyboard": { "Tab": "…", "Enter": "…", "Space": "…", "Arrow": "…", "Escape": "…" },
  "aria": ["aria-selected", "aria-controls", "…"],
  "focus": "roving | sequential"
}
```

`/behavior-spec`이 이 블록을 채우고, `keyboardContract`의 케이스는 이 블록에서 파생한다. 스펙이 없는 Tab·Skeleton·Chip.Universal(F11)은 `/retro-spec`으로 먼저 역추출한다.

#### 완료 기준

- [ ] `a11ySmoke` 13+ 케이스 green. red 시연: `aria-describedby="없는-id"` 주입 → `aria-valid-attr-value[incomplete]`로 잡힘
- [ ] `keyboardContract` green. red 시연: NavVertical 전 항목 `tabIndex=0`으로 바꾸면 `inspectRovingTabIndex.ok === false`
- [ ] 스펙 3개 역추출 완료, `_TEMPLATE.json` a11y 블록 추가
- [ ] COMPONENT_CHECKLIST "Testing (Phase 5 설정 후 적용)" 문구를 실제 명령으로 교체

**예상 규모**: 신규 6 (헬퍼 2, 테스트 4), 수정 5 (템플릿, 스펙 3, 체크리스트)

---

### Phase 4 — 워크플로 재편: 위험도 등급 · 검증 표 · 이탈 정책

**목적**: 지금 `/new-component`는 단일 경로다 — 오타 수정과 신규 컴포넌트가 같은 무게다. 작업의 **위험도**가 절차의 무게를 정하고, **바꾼 경로**가 검사 범위를 정하도록 두 축을 분리한다.

#### 4.1 공개 표면의 정의 (먼저 못 박는다)

이 저장소에는 루트 배럴이 없다. 공개 표면은 다음 다섯 가지다:

1. 각 `src/components/{Name}/index.ts`의 export 이름
2. exported props interface의 prop 이름·타입
3. `{COMPONENT}_{PROP}S` as const 배열의 값
4. `--comp-*` 토큰 이름 (값이 아니라 이름)
5. `data-theme` 속성 계약

#### 4.2 등급표 — `/new-component`를 라우터로

| 등급 | 작업 예 | 절차 |
|---|---|---|
| **L0** | 문서 수정, 내부 스타일(공개 표면 불변), 명백한 버그 수정 | 바로 구현 → `npm run check` |
| **L1** | optional prop 추가, additive variant 값, 아이콘 추가 | **계약 요약 한 단락**(무엇이 추가되고 기존 동작이 왜 안 변하는지) → 구현 → check |
| **L2** | **신규 컴포넌트**(simple·compound 불문), 기존 구조 변경 | 현재 4-phase 전체 (`/visual-spec` → `/behavior-spec` → `/implement` → `/showcase` → `/verify`) |
| **L3** | `--comp-*`·semantic 토큰 이름 변경/삭제, `data-theme` 계약 변경, export·prop 삭제/개명 | `docs/rfcs/TEMPLATE.md` 기반 RFC → **명시적 승인** → 구현. 승인 전에 코드를 만들지 않는다 |

판정 규칙:

1. 공개 표면(§4.1)을 건드리면 최소 L1. 삭제·개명이면 L3.
2. **새 export 추가는 simple이어도 L2.** prop 하나를 더하는 것과 `index.ts`에 이름을 하나 더 박는 것은 되돌리는 비용이 다르다.
3. 둘 이상 등급에 걸치면 높은 쪽. "버그 수정인데 prop 시그니처가 바뀐다"는 L0이 아니라 그 시그니처 변경의 등급이다.
4. 판정이 애매하면 등급을 **올려서** 묻지 않는다. **어느 축이 애매한지 한 문장으로** 묻는다. 등급 인플레이션은 L0/L1의 속도를 죽인다.
5. 시작 시 한 줄로 선언한다: `등급: L1 — optional prop 추가, 공개 표면 additive`.
6. 작업 중 등급이 올라가는 사실을 발견하면(L1인 줄 알았는데 prop 개명이 필요) **멈추고 재판정을 선언**한다. 조용히 판정을 바꾸지 않는다.

#### 4.3 검증 표 — 경로가 검사 집합을 정한다

등급은 *합의 절차*를 정하고, 경로는 *검증 범위*를 정한다. `/verify`에 이 표를 넣는다.

| 바꾼 경로 | `lint` | `build` | `test:run` | `docs:check` |
|---|:-:|:-:|:-:|:-:|
| `src/components/**` | ✅ | ✅ | ✅ | |
| `src/tokens/**` | ✅ | ✅ | ✅ (tokenContract·cssContract) | ✅ (문서 토큰 언급) |
| `docs/**`, `CLAUDE.md`, `.claude/skills/**` | | | | ✅ |
| `specs/**` | | | | ✅ (3자 정합) |
| `tailwind.config.js`, `index.css` | | ✅ | ✅ (cssContract) | |

실무에서는 대부분 둘 이상을 바꾼다 — 그때는 `npm run check` 전부다.

#### 4.4 `/verify` 재작성

- 검사 1(빌드)·2(토큰 무결성)·3(패턴 12항목)·4(쇼케이스 등록) 중 **스크립트가 있는 항목은 실행 결과를 인용**한다. "읽고 판단"은 스크립트가 판정할 수 없는 항목에만 남긴다: JSDoc 설명의 품질(#10), 설계 적합성.
- 보고 형식에 **수치**를 강제한다: `tokenContract 7 passed`, `eslint 0 problems`. "통과했다"라는 문장만으로는 부족하다.
- 검사를 새로 **쓴** PR은 red 시연 건수를 함께 적는다.

#### 4.5 DEVIATIONS.md에 "절차 이탈" 절 추가

지금 DEVIATIONS.md는 *시스템* 이탈(토큰·규칙·구조)만 다룬다. *절차* 이탈도 같은 파일에서 다룬다:

- **무단 우회 금지.** 등급 판정 생략, L2 합의 없는 구현, L3 승인 전 코드는 금지. "빨리 하려고"는 사유가 아니다 — 빠른 경로가 필요하면 L0/L1로 정당하게 판정되면 된다.
- **명시적 waiver는 허용.** 사용자가 절차 생략을 지시하면 따르되 한 줄로 기록한다: `waiver: 사용자 지시로 L2 합의 생략 (2026-09-05)`. waiver는 그 작업 1회에만 유효하다.
- **Pain note.** 절차를 지켰는데 비용이 작업 가치보다 커 보였다면 우회하는 대신 기록한다: `pain: L1 계약 요약이 optional prop 하나에 과했다. 요약 5분 > 구현 3분.` pain note는 **절차 개정의 입력**이다 — 같은 pain이 3회 반복되면 등급표를 고친다(원칙 8의 트리거와 동일).

#### 4.6 `docs/rfcs/TEMPLATE.md` 신설

L3용. 목차: 문제 → 선택지(각각의 비용) → 확정 방향 → 설계 → 영향 범위(공개 표면 diff) → 검증 방법 → 롤백. 첫 RFC 두 건은 이 계획의 D1(높이 집합)과 D3(reduced-motion)이다. DEVIATIONS가 *이탈*의 기록이라면 RFC는 *결정*의 기록이다 — 겹치지 않는다.

#### 완료 기준

- [ ] `00-new-component`가 등급 판정으로 시작한다. L0/L1 경로가 4-phase를 건너뛴다
- [ ] `05-verify`에 검증 표·수치 보고·red 시연 규칙이 있다
- [ ] DEVIATIONS.md 절차 이탈 절, `docs/rfcs/TEMPLATE.md` + RFC 2건
- [ ] 새 절차로 **L1 작업 한 건을 실제로 수행**하고 pain note 유무를 기록한다 — 절차는 써보기 전에는 검증되지 않은 것이다

**예상 규모**: 수정 4 (스킬 3, DEVIATIONS), 신규 3 (TEMPLATE, RFC 2)

---

### Phase 5 — 문서·스킬·스펙 정합 검사 (`docs:check`)

**목적**: F2·F7·F11·F13 해소. 문서가 코드를 따라오지 못한 채 릴리스되는(이 저장소에서는 "커밋되는") 일을 막는다. 스크립트는 `scripts/docs-check.mjs` — 의존성 없는 Node 스크립트로 두어 `docs/`만 바꾼 L0 작업이 build 없이 돌릴 수 있게 한다.

| ID | 검사 | 오늘 red |
|---|---|:-:|
| D1 | 마크다운 상대 링크 무결성 (CLAUDE.md, README, `docs/**`, `.claude/skills/**`, `specs/**`) | 0 / 82 — **가드** |
| D2 | 스킬 `SKILL.md` frontmatter에 `name`·`description` 필수 | **1** (skill-metabolism) |
| D3 | 문서에 등장하는 `semantic-{family}` 패밀리가 `tokens.css`에 실제로 존재 | **16** (`semantic-primary`, 6파일) |
| D4 | CLAUDE.md 모션 표 ↔ `tailwind.config.js` `transitionDuration`·`transitionTimingFunction` 키 양방향 일치 | **1** (`medium`) |
| D5 | **specs ↔ components ↔ showcase 3자 정합** — `src/components/{Name}`(icons·showcase-layout 제외)마다 `specs/*.json`의 `component` 필드 · `SHOWCASE_MAP` 항목 · `NAV_GROUPS` 항목이 존재 | **3** (Tab·Skeleton·Chip.Universal 스펙 없음) |
| D6 | 스킬 문서가 참조하는 파일 경로(`specs/…`, `src/…`)가 존재 | 확인 필요 |

`docs:check`는 `check`에 편입한다(§0.2). 스크립트가 커지면 vitest로 옮길 수 있지만, 시작은 의존성 0으로.

**일회성 수정** (검사 대상이 아니라 그냥 고칠 것): ROADMAP.md의 구현 완료 7개 체크, CLAUDE.md "Project Status › In Progress: Button" 갱신, CLAUDE.md 프로젝트 트리의 `specs/input.json` 삭제.

#### 완료 기준

- [ ] D2·D3·D4·D5 red 총 21건 → 수정 → green
- [ ] D3 수정 시 문서의 `semantic-primary` 예시를 어느 패밀리로 바꿀지는 D2(§2.4)와 같이 결정한다 (권장 `emphasized-purple`)
- [ ] CLAUDE.md "문서 관리 원칙"에 "`npm run docs:check`가 링크·frontmatter·토큰 언급·3자 정합을 잡는다" 한 줄 추가

**예상 규모**: 신규 1 (`docs-check.mjs` ~200줄), 수정 ~10 (문서 6 + 스펙 3 + 스킬 1)

---

### Phase 6 — 파트 명명 표준 (조건부)

**트리거**: 컴포넌트 20개 도달 전, 또는 첫 compound 오버레이(Dialog·Dropdown·Table) 착수 전. **지금 13개일 때 만드는 것이 40개일 때보다 훨씬 싸다.**

**내용** (`docs/ANATOMY.md`):

1. **파트 어휘** — 구조(Root·Content·Group), 텍스트(Label·Description·Counter), 인터랙션(Trigger·Close·Item), 장식·시그널(Indicator·Badge·Dot·Overlay·Ring), 위치 수식어(Leading·Trailing — 이미 `iconLeading`/`iconTrailing`으로 채택된 어휘를 전체로 확장)
2. **prop 문법** — 파트를 prop으로 노출하는 두 형태(값 prop vs slot prop), 아이콘 3형(`icon` 단독 / `iconLeading`·`iconTrailing` / `FC` vs `ReactNode`), 상태 prop 어휘(`disabled`·`loading`·`readOnly`·`selected`·`checked`·`active`의 의미 구분)
3. **해체 절차** — 새 컴포넌트를 받았을 때 파트를 어떻게 나누고 이름 붙이는가. 워크드 예제 1건
4. **13개 컴포넌트 해체표** — 현재 어휘 불일치를 여기서 수집한다(예: Chip의 닫기 파트 이름, NavVertical의 그룹/아이템 어휘)
5. **강제 수단** — `specs/*.json`에 `anatomy` 섹션 필수 + `docs:check` D7이 파트 이름을 어휘표와 대조

이 Phase는 §3 나머지가 끝난 뒤 별도로 계획한다. 여기서는 트리거와 목차만 확정한다.

---

## 4. 결정 필요 항목

**2026-09-05 기준 미결 없음.** D1–D6 전부 확정돼 각 Phase 본문에 "확정:"으로 옮겼다.

| ID | 확정 | 본문 |
|---|---|---|
| D1 | 컨트롤 높이는 **레일 기준**. 허용 집합 `20·24·28·32·36·40·48·56` 실측 동결 | §2.3 |
| D2 | ChipUniversal 포커스 = `neutral-solid-1000` (7개 컴포넌트와 통일). SegmentBar의 purple은 DEVIATIONS 기록 | §2.4 |
| D3 | reduced-motion은 **문서대로** — 색·투명도 유지, 움직임만 제거 | §1.4 |
| D4 | 쇼케이스는 `react-refresh` 규칙 제외, components 공유 상수는 `.ts` 분리 | §0.1 |
| D5 | 한글 describe · DOM API 직접 · jest-dom 미도입 | §0.3 |
| D6 | 워크플로만. required check(branch protection) 미지정 | §0.4 |

> 새 결정이 필요해지면 이 자리에 미결 표를 다시 만들고, 확정되면 같은 방식으로 본문에 옮긴 뒤 비운다.

---

## 5. 순서·의존성·규모

| Phase | 선행 | 신규 / 수정 파일 | 해소되는 실측 | 핵심 산출물 |
|:-:|:-:|:-:|---|---|
| 0 | — | 4 / ~12 | F9, F10(러너) | `npm run check`, CI, lint 0 |
| 1 | 0 | 1 / 2 | F3 | `hoverOnlyWhenSupported`, `cssContract` |
| 2 | 0 | 1 / 6 | F1, F4, F5, F6 | `tokenContract` T1–T7 |
| 3 | 0, 2 | 6 / 5 | F10, F11(스펙 3) | `a11ySmoke`, `keyboardContract`, 스펙 a11y 블록 |
| 4 | 2, 3 | 3 / 4 | — | 등급 라우터, 검증 표, 이탈 정책, RFC |
| 5 | 4 | 1 / ~10 | F2, F7, F11, F12, F13 | `docs:check` D1–D6 |
| 6 | 5 + 트리거 | 1 / 13 | — | `ANATOMY.md` |

Phase 1과 2는 서로 독립이라 병렬 가능하다. Phase 4는 2·3의 검사가 존재해야 검증 표에 "오늘 존재하는 명령만" 적을 수 있으므로 그 뒤에 온다.

---

## 6. 최종 상태 — `npm run check`가 판정하는 것

| 명령 | 검사 | 근거 문서 |
|---|---|---|
| `lint` | ESLint (react-hooks·ts) | — |
| `build` | tsc + vite | — |
| `test:run` › `cssContract` | `:hover`는 media query 안, `:active`는 밖 | INTERACTION_DESIGN §B 입력 장치 규칙 |
| `test:run` › `tokenContract` | T1 var 무결성 · T2 `:root`↛semantic · T3 색상 스코프 · T4 높이 집합 · T5 높이 리터럴 · T6 타이포 arbitrary · T7 하드코딩 | CLAUDE.md Token Architecture, Styling Rules |
| `test:run` › `a11ySmoke` | axe violations + incomplete = 0 | COMPONENT_CHECKLIST Accessibility |
| `test:run` › `keyboardContract` | roving 1개, 방향키·Escape·Space 경로 | COMPONENT_CHECKLIST 키보드 내비게이션 |
| `test:run` › 컴포넌트 단위 | loading·타이머 정책 등 로직 | 각 spec |
| `docs:check` | D1 링크 · D2 frontmatter · D3 토큰 언급 · D4 모션 표 · D5 3자 정합 · D6 스킬 경로 | CLAUDE.md 문서 관리 원칙 |

이 표에 없는 규칙은 여전히 산문이다. 그 목록을 유지하는 것도 이 문서의 역할이다:

**여전히 사람/에이전트가 판단하는 것**: JSDoc 설명 품질, variant 이름이 용도를 설명하는가, children vs 구조화 props 선택, Radix 채택 여부, 색상 대비(WCAG AA — jsdom에서 판정 불가), 시각 회귀 전반.

---

## 7. 첫 PR — Phase 0 착수 체크리스트

1. [x] D4·D5·D6 결정 — 확정 (§4)
2. [x] lint 36건 → 0 (컴포넌트 4건은 동작 변화 없음 육안 확인)
3. [ ] `package.json` 스크립트 확정 (§0.2)
4. [ ] vitest + RTL + user-event + jsdom 설치, `vite.config.ts` `test` 블록, `src/testing/setup.ts`
5. [ ] `src/lib/utils.test.ts` 3케이스
6. [ ] `.github/workflows/quality.yml`
7. [ ] `/commit` Step 0 → `npm run check`
8. [ ] CLAUDE.md Development Commands, README Quick Start 갱신
9. [ ] PR 본문: `eslint 0 problems` · `vitest N passed` · `✓ built` 수치 + 이 문서 링크
