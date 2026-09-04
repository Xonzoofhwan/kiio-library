# kiio-library Token Reference

> 3-Layer Token Architecture: **Primitive** → **Semantic** → **Component**
>
> Generated: 2026-03-08 · 소스 대조 2026-09-05 (`src/tokens/tokens.css`, `tailwind.config.js`)

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Layer 1: Primitive Tokens](#layer-1-primitive-tokens)
  - [Color](#primitive-color)
  - [Spacing](#primitive-spacing)
  - [Radius](#primitive-radius)
  - [Typography](#primitive-typography)
  - [Motion](#primitive-motion)
- [Layer 2: Semantic Tokens](#layer-2-semantic-tokens)
  - [Accent Colors](#accent-colors-lightdark-공통)
  - [Surface Categories](#surface-categories-lightdark-차이)
  - [Motion](#semantic-motion)
- [Layer 3: Component Tokens](#layer-3-component-tokens)
  - [Button](#button-component-tokens)
- [Token Flow Diagrams](#token-flow-diagrams)
- [Tailwind Integration](#tailwind-integration)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│ Primitive (raw values, :root)                                   │
│   CSS: --primitive-{color}-{shade}                              │
│   컴포넌트에서 직접 사용 금지                                         │
├─────────────────────────────────────────────────────────────────┤
│ Semantic (의미 부여, [data-theme] 스코프)                         │
│   CSS: --semantic-{category}-{shade}                            │
│   테마별 전환: data-theme 스코프                                   │
├─────────────────────────────────────────────────────────────────┤
│ Component (역할 바인딩)                                          │
│   CSS: --comp-{component}-{property}-{variant}[-{state}]        │
│   색상 = [data-theme] 스코프 / 크기·모션 = :root 스코프            │
│   CVA에서 arbitrary value로 소비                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Source Files

| File | Layer | Purpose |
|------|-------|---------|
| `src/tokens/primitive.ts` | Primitive | Color 값 (TS) |
| `src/tokens/numbers.ts` | Primitive | Spacing + Radius 값 (TS) |
| `src/tokens/typography.ts` | Primitive | Typography 복합 토큰 (TS) |
| `src/tokens/motion.ts` | Primitive | Motion/Animation 토큰 (TS) |
| `src/tokens/semantic.ts` | Semantic | 색상 매핑 (TS) |
| `src/tokens/tokens.css` | All | CSS Custom Properties (runtime) |
| `tailwind.config.js` | Integration | Tailwind 연결 |

---

## Layer 1: Primitive Tokens

### Primitive Color

23개 색상 패밀리(gray·black-alpha·white-alpha 포함), 각 14단계 shade: `0, 50, 70, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 1000`

CSS: `--primitive-{family}-{shade}` / Tailwind: `bg-primitive-{family}-{shade}` (컴포넌트 사용 금지)

#### Gray (Solid Neutral)

| Shade | Value |
|-------|-------|
| 0 | `#fdfefe` |
| 50 | `#f5f6f6` |
| 70 | `#eceded` |
| 100 | `#e4e4e5` |
| 200 | `#d4d4d5` |
| 300 | `#b8b9b9` |
| 400 | `#9b9e9e` |
| 500 | `#7d8284` |
| 600 | `#616569` |
| 700 | `#53565c` |
| 800 | `#383a3f` |
| 900 | `#2a2b31` |
| 950 | `#1d1e22` |
| 1000 | `#101013` |

#### BlackAlpha (Transparent Black)

| Shade | Value |
|-------|-------|
| 0 | `rgba(16, 16, 19, 0)` |
| 50 | `rgba(16, 16, 19, 0.04)` |
| 70 | `rgba(16, 16, 19, 0.08)` |
| 100 | `rgba(16, 16, 19, 0.12)` |
| 200 | `rgba(16, 16, 19, 0.18)` |
| 300 | `rgba(16, 19, 16, 0.3)` |
| 400 | `rgba(16, 19, 16, 0.42)` |
| 500 | `rgba(16, 19, 16, 0.54)` |
| 600 | `rgba(16, 19, 17, 0.64)` |
| 700 | `rgba(16, 19, 18, 0.72)` |
| 800 | `rgba(16, 19, 19, 0.82)` |
| 900 | `rgba(16, 18, 19, 0.88)` |
| 950 | `rgba(17, 17, 17, 0.94)` |
| 1000 | `rgba(16, 16, 19, 0.99)` |

#### WhiteAlpha (Transparent White)

| Shade | Value |
|-------|-------|
| 0 | `rgba(253, 254, 254, 0)` |
| 50 | `rgba(253, 254, 254, 0.04)` |
| 70 | `rgba(253, 254, 254, 0.08)` |
| 100 | `rgba(253, 254, 254, 0.14)` |
| 200 | `rgba(253, 254, 254, 0.2)` |
| 300 | `rgba(253, 254, 254, 0.28)` |
| 400 | `rgba(253, 254, 254, 0.38)` |
| 500 | `rgba(253, 254, 254, 0.46)` |
| 600 | `rgba(253, 254, 254, 0.58)` |
| 700 | `rgba(253, 254, 254, 0.68)` |
| 800 | `rgba(253, 254, 254, 0.78)` |
| 900 | `rgba(253, 254, 254, 0.86)` |
| 950 | `rgba(253, 254, 254, 0.94)` |
| 1000 | `rgba(253, 254, 254, 0.99)` |

#### Indigo

| Shade | Value |
|-------|-------|
| 0 | `#f7f8ff` |
| 50 | `#f2f3ff` |
| 70 | `#e8e9ff` |
| 100 | `#d7d8fd` |
| 200 | `#c0c2fb` |
| 300 | `#a8abf8` |
| 400 | `#9195f6` |
| 500 | `#7277f3` |
| 600 | `#5153e0` |
| 700 | `#2c2ccb` |
| 800 | `#0906b7` |
| 900 | `#060283` |
| 950 | `#04004d` |
| 1000 | `#0a0a29` |

#### Purple

| Shade | Value |
|-------|-------|
| 0 | `#faf7ff` |
| 50 | `#f5efff` |
| 70 | `#ede4fe` |
| 100 | `#e5d8fc` |
| 200 | `#d8c6fb` |
| 300 | `#c9b1f8` |
| 400 | `#b898f6` |
| 500 | `#a37af3` |
| 600 | `#8657dc` |
| 700 | `#6933c5` |
| 800 | `#4c11af` |
| 900 | `#370c7b` |
| 950 | `#200746` |
| 1000 | `#160b27` |

#### Violet

| Shade | Value |
|-------|-------|
| 0 | `#fff8fd` |
| 50 | `#fff1fa` |
| 70 | `#ffe7f6` |
| 100 | `#fadef8` |
| 200 | `#f3c7f6` |
| 300 | `#ecb3f4` |
| 400 | `#e599f3` |
| 500 | `#dd7ff0` |
| 600 | `#c25ed8` |
| 700 | `#a53bbd` |
| 800 | `#8a1aa5` |
| 900 | `#5e1472` |
| 950 | `#340c3f` |
| 1000 | `#21052a` |

#### Pink

| Shade | Value |
|-------|-------|
| 0 | `#fff7f9` |
| 50 | `#fff3f5` |
| 70 | `#ffebee` |
| 100 | `#ffe0e2` |
| 200 | `#ffc9d0` |
| 300 | `#ffb1c1` |
| 400 | `#ff9ab5` |
| 500 | `#ff82ac` |
| 600 | `#ea6393` |
| 700 | `#cf3d74` |
| 800 | `#b31452` |
| 900 | `#77133b` |
| 950 | `#4c0a26` |
| 1000 | `#230410` |

#### Rose

| Shade | Value |
|-------|-------|
| 0 | `#fff6f6` |
| 50 | `#fff1f1` |
| 70 | `#ffebe9` |
| 100 | `#ffddda` |
| 200 | `#ffc0be` |
| 300 | `#ffa1a3` |
| 400 | `#ff858d` |
| 500 | `#ff6879` |
| 600 | `#e94f61` |
| 700 | `#c8283c` |
| 800 | `#a80218` |
| 900 | `#6a0210` |
| 950 | `#3d030b` |
| 1000 | `#1f0407` |

#### RedBright

| Shade | Value |
|-------|-------|
| 0 | `#fffaf9` |
| 50 | `#ffefed` |
| 70 | `#ffe7e3` |
| 100 | `#fed3cf` |
| 200 | `#fdb9b4` |
| 300 | `#fa958d` |
| 400 | `#f9756c` |
| 500 | `#f6493e` |
| 600 | `#df3b31` |
| 700 | `#bd261e` |
| 800 | `#960f08` |
| 900 | `#5d0905` |
| 950 | `#360503` |
| 1000 | `#1e0602` |

#### RedDark

| Shade | Value |
|-------|-------|
| 0 | `#fff8f7` |
| 50 | `#fff1ef` |
| 70 | `#ffe6e4` |
| 100 | `#fececb` |
| 200 | `#f7aeab` |
| 300 | `#f48684` |
| 400 | `#ed605e` |
| 500 | `#de2d2c` |
| 600 | `#b72321` |
| 700 | `#921817` |
| 800 | `#6e1615` |
| 900 | `#4b1010` |
| 950 | `#2a0505` |
| 1000 | `#1b0303` |

#### RedOrange

| Shade | Value |
|-------|-------|
| 0 | `#fffaf8` |
| 50 | `#ffefea` |
| 70 | `#ffe4da` |
| 100 | `#ffd0c2` |
| 200 | `#ffb7a4` |
| 300 | `#ff9d85` |
| 400 | `#ff8467` |
| 500 | `#fe542e` |
| 600 | `#d23c19` |
| 700 | `#ad3014` |
| 800 | `#872710` |
| 900 | `#581d0f` |
| 950 | `#330d05` |
| 1000 | `#260a04` |

#### Orange

| Shade | Value |
|-------|-------|
| 0 | `#fff9f7` |
| 50 | `#fff5f1` |
| 70 | `#ffeae2` |
| 100 | `#ffded4` |
| 200 | `#ffc4b3` |
| 300 | `#ffab91` |
| 400 | `#ff9170` |
| 500 | `#ff784e` |
| 600 | `#d75b39` |
| 700 | `#b24125` |
| 800 | `#932e19` |
| 900 | `#631e11` |
| 950 | `#3c0e08` |
| 1000 | `#260f04` |

#### Amber

| Shade | Value |
|-------|-------|
| 0 | `#fffbf8` |
| 50 | `#fff5f0` |
| 70 | `#ffebe1` |
| 100 | `#ffe4ce` |
| 200 | `#ffd2a6` |
| 300 | `#ffc07f` |
| 400 | `#ffb05a` |
| 500 | `#ff9f33` |
| 600 | `#e0831f` |
| 700 | `#b86916` |
| 800 | `#934d08` |
| 900 | `#623308` |
| 950 | `#3a1d04` |
| 1000 | `#201302` |

#### Yellow

| Shade | Value |
|-------|-------|
| 0 | `#fffcf8` |
| 50 | `#fff6e9` |
| 70 | `#fff1de` |
| 100 | `#fdebc0` |
| 200 | `#fae29a` |
| 300 | `#f7d86b` |
| 400 | `#f3cd37` |
| 500 | `#f0c100` |
| 600 | `#cfa500` |
| 700 | `#a48001` |
| 800 | `#7a5c00` |
| 900 | `#523d00` |
| 950 | `#322502` |
| 1000 | `#1b1403` |

#### Lime

| Shade | Value |
|-------|-------|
| 0 | `#fefff5` |
| 50 | `#feffee` |
| 70 | `#f9fbd9` |
| 100 | `#f8fcc0` |
| 200 | `#eef59a` |
| 300 | `#e0e978` |
| 400 | `#ceda5a` |
| 500 | `#b8c640` |
| 600 | `#a0ad31` |
| 700 | `#849026` |
| 800 | `#68721c` |
| 900 | `#4b5313` |
| 950 | `#2e330b` |
| 1000 | `#181c02` |

#### Edamame

| Shade | Value |
|-------|-------|
| 0 | `#fbfff6` |
| 50 | `#f5ffe8` |
| 70 | `#e9ffca` |
| 100 | `#e1f8c1` |
| 200 | `#c7ed94` |
| 300 | `#b0e26c` |
| 400 | `#99d943` |
| 500 | `#7ecd13` |
| 600 | `#66ad0f` |
| 700 | `#4f8c0b` |
| 800 | `#3a6b07` |
| 900 | `#264904` |
| 950 | `#193403` |
| 1000 | `#0f1b02` |

#### Green

| Shade | Value |
|-------|-------|
| 0 | `#fafff8` |
| 50 | `#f1ffea` |
| 70 | `#e1ffd1` |
| 100 | `#c8f5bd` |
| 200 | `#a8ed9e` |
| 300 | `#85e57e` |
| 400 | `#66dd60` |
| 500 | `#2cd028` |
| 600 | `#22a21e` |
| 700 | `#1b8117` |
| 800 | `#156611` |
| 900 | `#0d4309` |
| 950 | `#093005` |
| 1000 | `#052102` |

#### Forest

| Shade | Value |
|-------|-------|
| 0 | `#f7fff7` |
| 50 | `#ecffec` |
| 70 | `#dcffdc` |
| 100 | `#c7f6d4` |
| 200 | `#9de9bf` |
| 300 | `#67d7a4` |
| 400 | `#37c88c` |
| 500 | `#01b671` |
| 600 | `#069253` |
| 700 | `#08703b` |
| 800 | `#095027` |
| 900 | `#073116` |
| 950 | `#041509` |
| 1000 | `#101013` |

#### Emerald

| Shade | Value |
|-------|-------|
| 0 | `#f7fffa` |
| 50 | `#edfff4` |
| 70 | `#dcffe9` |
| 100 | `#cefbe7` |
| 200 | `#aaf3d9` |
| 300 | `#77e8c7` |
| 400 | `#3edcb3` |
| 500 | `#08d1a0` |
| 600 | `#06b082` |
| 700 | `#058e66` |
| 800 | `#036c4b` |
| 900 | `#024a32` |
| 950 | `#01281a` |
| 1000 | `#101013` |

#### Teal

| Shade | Value |
|-------|-------|
| 0 | `#f3fffb` |
| 50 | `#eafff8` |
| 70 | `#dafff3` |
| 100 | `#cbfdec` |
| 200 | `#a8fae5` |
| 300 | `#88f9df` |
| 400 | `#63f6d6` |
| 500 | `#1ef1c7` |
| 600 | `#0fd2ac` |
| 700 | `#0aad8f` |
| 800 | `#09836f` |
| 900 | `#065e51` |
| 950 | `#064440` |
| 1000 | `#032927` |

#### Cyan

| Shade | Value |
|-------|-------|
| 0 | `#f6fdff` |
| 50 | `#edfbff` |
| 70 | `#ddf7ff` |
| 100 | `#d4f4fc` |
| 200 | `#bceef8` |
| 300 | `#97e4f3` |
| 400 | `#75daee` |
| 500 | `#4fd0e9` |
| 600 | `#29c4e0` |
| 700 | `#1fa5bb` |
| 800 | `#1b808f` |
| 900 | `#155c65` |
| 950 | `#0e383d` |
| 1000 | `#031a25` |

#### Sky

| Shade | Value |
|-------|-------|
| 0 | `#f7faff` |
| 50 | `#f1f6ff` |
| 70 | `#e2eeff` |
| 100 | `#d8ebfe` |
| 200 | `#badffc` |
| 300 | `#94d0f9` |
| 400 | `#6bbef6` |
| 500 | `#4ab1f4` |
| 600 | `#1d9ced` |
| 700 | `#137fc3` |
| 800 | `#116192` |
| 900 | `#0d4262` |
| 950 | `#082333` |
| 1000 | `#020f22` |

#### Blue

| Shade | Value |
|-------|-------|
| 0 | `#f8fbff` |
| 50 | `#eff6ff` |
| 70 | `#deedff` |
| 100 | `#cde4ff` |
| 200 | `#a4ceff` |
| 300 | `#73b2fe` |
| 400 | `#4096fd` |
| 500 | `#1880fc` |
| 600 | `#0265e3` |
| 700 | `#014db5` |
| 800 | `#013788` |
| 900 | `#002359` |
| 950 | `#00102b` |
| 1000 | `#010119` |

---

### Primitive Spacing

CSS: `--primitive-spacing-{key}` / Tailwind: `p-4`, `gap-6`, `m-0.5` 등

| Key | Value | Key | Value | Key | Value |
|-----|-------|-----|-------|-----|-------|
| px | 1px | 0 | 0px | 0.5 | 2px |
| 1 | 4px | 1.5 | 6px | 2 | 8px |
| 2.5 | 10px | 3 | 12px | 3.5 | 14px |
| 4 | 16px | 5 | 20px | 6 | 24px |
| 7 | 28px | 8 | 32px | 9 | 36px |
| 10 | 40px | 11 | 44px | 12 | 48px |
| 14 | 56px | 16 | 64px | 18 | 72px |
| 20 | 80px | 24 | 96px | 28 | 112px |
| 32 | 128px | 36 | 144px | 40 | 160px |
| 44 | 176px | 48 | 192px | 52 | 208px |
| 56 | 224px | 60 | 240px | 64 | 256px |
| 72 | 288px | 80 | 320px | 96 | 384px |

---

### Primitive Radius

CSS: `--primitive-radius-{key}` / Tailwind: `rounded-2` (8px), `rounded-3` (12px) 등

| Key | Value | Key | Value | Key | Value |
|-----|-------|-----|-------|-----|-------|
| px | 1px | 0 | 0px | 0.5 | 2px |
| 1 | 4px | 1.5 | 6px | 2 | 8px |
| 2.5 | 10px | 3 | 12px | 4 | 16px |
| 5 | 20px | 6 | 24px | 7 | 28px |
| 8 | 32px | 10 | 40px | 12 | 48px |
| 16 | 64px | 20 | 80px | 24 | 96px |

> Spacing 과 달리 radius 는 **18단계**뿐이다. `3.5`·`9`·`11`·`14`·`18` 은 spacing 에만 있고
> radius 에는 없으므로 `rounded-3.5` 같은 클래스는 만들어지지 않는다.

---

### Primitive Typography

Font: **Pretendard Variable**

CSS: `--text-size-{n}`, `--text-lh-{n}`, `--text-ls-{n}`

| Size | fontSize | lineHeight | letterSpacing |
|------|----------|------------|---------------|
| 64 | 4rem | 72px | -0.012em |
| 48 | 3rem | 56px | -0.012em |
| 40 | 2.5rem | 48px | -0.012em |
| 32 | 2rem | 38px | -0.012em |
| 28 | 1.75rem | 34px | -0.010em |
| 24 | 1.5rem | 30px | -0.008em |
| 22 | 1.375rem | 28px | -0.016em |
| 20 | 1.25rem | 28px | -0.024em |
| 18 | 1.125rem | 28px | -0.012em |
| 17 | 1.0625rem | 24px | -0.010em |
| 16 | 1rem | 24px | -0.009em |
| 15 | 0.9375rem | 24px | -0.004em |
| 14 | 0.875rem | 20px | 0em |
| 13 | 0.8125rem | 16px | 0em |
| 12 | 0.75rem | 16px | 0em |
| 11 | 0.6875rem | 12px | 0em |
| 10 | 0.625rem | 12px | 0em |

**Weights**: regular (400), medium (500), semibold (600), bold (700)

**Tailwind**: `typography-{size}-{weight}` (예: `typography-20-semibold`) → 17 sizes x 4 weights = **68 유틸리티**

> `text-` 접두사는 color 전용. Typography composite는 반드시 `typography-` 접두사 사용.

---

### Primitive Motion

CSS: `--primitive-duration-{n}`, `--primitive-easing-{name}`

| Duration Key | Value |
|-------------|-------|
| 0 | 0ms |
| 100 | 100ms |
| 150 | 150ms |
| 200 | 200ms |
| 300 | 300ms |
| 500 | 500ms |

CSS: `--primitive-scale-{n}`

| Scale Key | Value |
|-----------|-------|
| 96 | 0.96 |
| 98 | 0.98 |
| 99 | 0.99 |

| Easing Key | Value |
|-----------|-------|
| ease-out | `cubic-bezier(0.0, 0.0, 0.2, 1)` |
| ease-in | `cubic-bezier(0.4, 0.0, 1, 1)` |
| ease-in-out | `cubic-bezier(0.4, 0.0, 0.2, 1)` |
| linear | `linear` |

---

## Layer 2: Semantic Tokens

CSS: `--semantic-{category}-{shade}` / Tailwind: `bg-semantic-emphasized-purple-500`

테마 스코프: 색상은 `[data-theme]` selector, 모션·scale은 `:root` (테마 불변)

### Accent Colors (light/dark 공통)

> Emphasized(Purple·Blue·Orange), Success, Warning, Error는 light와 dark 모드에서 동일한 primitive를 참조합니다.
> 즉 테마를 바꿔도 이 계열의 색은 변하지 않습니다.

> ⚠️ **브랜드/강조 색의 semantic 이름은 `emphasized-{purple|blue|orange}` 하나뿐입니다.**
> `b843d30`(2026-03-24)에서 이 이름으로 재편됐고, 재편 이전의 계열 이름은 `tokens.css`에 더 이상
> 정의돼 있지 않습니다. 정의되지 않은 이름을 `var()`로 참조하면 체인이 끊어져 값이 비고,
> 색 속성은 `currentColor` 등으로 폴백합니다.

#### Emphasized.Purple → Purple

| Semantic | Primitive Source | Value |
|----------|-----------------|-------|
| `emphasized-purple-50` | purple-50 | `#f5efff` |
| `emphasized-purple-100` | purple-100 | `#e5d8fc` |
| `emphasized-purple-200` | purple-200 | `#d8c6fb` |
| `emphasized-purple-300` | purple-300 | `#c9b1f8` |
| `emphasized-purple-400` | purple-400 | `#b898f6` |
| `emphasized-purple-500` | purple-500 | `#a37af3` |
| `emphasized-purple-600` | purple-600 | `#8657dc` |
| `emphasized-purple-700` | purple-700 | `#6933c5` |
| `emphasized-purple-800` | purple-800 | `#4c11af` |
| `emphasized-purple-900` | purple-**950** | `#200746` ⚠️ |

> ⚠️ 900에서 shade offset: semantic 900 → primitive 950 (Blue·Orange도 동일)

#### Emphasized.Blue → Blue

| Semantic | Primitive Source | Value |
|----------|-----------------|-------|
| `emphasized-blue-50` | blue-50 | `#eff6ff` |
| `emphasized-blue-100` | blue-100 | `#cde4ff` |
| `emphasized-blue-200` | blue-200 | `#a4ceff` |
| `emphasized-blue-300` | blue-300 | `#73b2fe` |
| `emphasized-blue-400` | blue-400 | `#4096fd` |
| `emphasized-blue-500` | blue-500 | `#1880fc` |
| `emphasized-blue-600` | blue-600 | `#0265e3` |
| `emphasized-blue-700` | blue-700 | `#014db5` |
| `emphasized-blue-800` | blue-800 | `#013788` |
| `emphasized-blue-900` | blue-**950** | `#00102b` ⚠️ |

#### Emphasized.Orange → RedOrange

| Semantic | Primitive Source | Value |
|----------|-----------------|-------|
| `emphasized-orange-50` | red-orange-50 | `#ffefea` |
| `emphasized-orange-100` | red-orange-100 | `#ffd0c2` |
| `emphasized-orange-200` | red-orange-200 | `#ffb7a4` |
| `emphasized-orange-300` | red-orange-300 | `#ff9d85` |
| `emphasized-orange-400` | red-orange-400 | `#ff8467` |
| `emphasized-orange-500` | red-orange-500 | `#fe542e` |
| `emphasized-orange-600` | red-orange-600 | `#d23c19` |
| `emphasized-orange-700` | red-orange-700 | `#ad3014` |
| `emphasized-orange-800` | red-orange-800 | `#872710` |
| `emphasized-orange-900` | red-orange-**950** | `#330d05` ⚠️ |

#### Success → Forest

| Semantic | Primitive Source | Value |
|----------|-----------------|-------|
| `success-50` | forest-50 | `#ecffec` |
| `success-100` | forest-100 | `#c7f6d4` |
| `success-200` | forest-200 | `#9de9bf` |
| `success-300` | forest-300 | `#67d7a4` |
| `success-400` | forest-400 | `#37c88c` |
| `success-500` | forest-500 | `#01b671` |
| `success-600` | forest-600 | `#069253` |
| `success-700` | forest-700 | `#08703b` |
| `success-800` | forest-800 | `#095027` |
| `success-900` | forest-900 | `#073116` |

#### Warning → Amber

| Semantic | Primitive Source | Value |
|----------|-----------------|-------|
| `warning-50` | amber-50 | `#fff5f0` |
| `warning-100` | amber-100 | `#ffe4ce` |
| `warning-200` | amber-200 | `#ffd2a6` |
| `warning-300` | amber-300 | `#ffc07f` |
| `warning-400` | amber-400 | `#ffb05a` |
| `warning-500` | amber-500 | `#ff9f33` |
| `warning-600` | amber-**700** | `#b86916` ⚠️ |
| `warning-700` | amber-**800** | `#934d08` ⚠️ |
| `warning-800` | amber-**900** | `#623308` ⚠️ |
| `warning-900` | amber-**950** | `#3a1d04` ⚠️ |

> ⚠️ 600 이상에서 shade offset: semantic 600 → primitive 700, 700→800, 800→900, 900→950

#### Error → RedDark

| Semantic | Primitive Source | Value |
|----------|-----------------|-------|
| `error-50` | red-dark-50 | `#fff1ef` |
| `error-100` | red-dark-100 | `#fececb` |
| `error-200` | red-dark-200 | `#f7aeab` |
| `error-300` | red-dark-300 | `#f48684` |
| `error-400` | red-dark-400 | `#ed605e` |
| `error-500` | red-dark-500 | `#de2d2c` |
| `error-600` | red-dark-600 | `#b72321` |
| `error-700` | red-dark-700 | `#921817` |
| `error-800` | red-dark-800 | `#6e1615` |
| `error-900` | red-dark-**950** | `#2a0505` ⚠️ |

> ⚠️ 900에서 shade offset: semantic 900 → primitive 950

---

### Surface Categories (light/dark 차이)

> 아래 카테고리는 light에서는 밝은 표면, dark에서는 어두운 표면으로 반전됩니다.
> 테이블은 light 모드 값을 표시합니다. dark 모드의 반전 매핑은 하단 참고.

#### Neutral.Solid → Gray

| Semantic Token | Primitive Source | Value |
|---------------|-----------------|-------|
| `neutral-solid-0` | gray-0 | `#fdfefe` |
| `neutral-solid-50` | gray-50 | `#f5f6f6` |
| `neutral-solid-70` | gray-70 | `#eceded` |
| `neutral-solid-100` | gray-100 | `#e4e4e5` |
| `neutral-solid-200` | gray-200 | `#d4d4d5` |
| `neutral-solid-300` | gray-300 | `#b8b9b9` |
| `neutral-solid-400` | gray-400 | `#9b9e9e` |
| `neutral-solid-500` | gray-500 | `#7d8284` |
| `neutral-solid-600` | gray-600 | `#616569` |
| `neutral-solid-700` | gray-700 | `#53565c` |
| `neutral-solid-800` | gray-800 | `#383a3f` |
| `neutral-solid-900` | gray-900 | `#2a2b31` |
| `neutral-solid-950` | gray-950 | `#1d1e22` |
| `neutral-solid-1000` | gray-1000 | `#101013` |

> 14단계 전부 존재한다. `1000`은 focus ring 전용으로 쓰인다 (`--comp-*-focus-border`).

#### Neutral.BlackAlpha → BlackAlpha

| Semantic Token | Primitive Source | Opacity |
|---------------|-----------------|---------|
| `neutral-black-alpha-0` | black-alpha-0 | 0 |
| `neutral-black-alpha-50` | black-alpha-50 | 0.04 |
| `neutral-black-alpha-70` | black-alpha-70 | 0.08 |
| `neutral-black-alpha-100` | black-alpha-100 | 0.12 |
| `neutral-black-alpha-200` | black-alpha-200 | 0.18 |
| `neutral-black-alpha-300` | black-alpha-300 | 0.3 |
| `neutral-black-alpha-400` | black-alpha-400 | 0.42 |
| `neutral-black-alpha-600` | black-alpha-600 | 0.64 |
| `neutral-black-alpha-800` | black-alpha-800 | 0.82 |
| `neutral-black-alpha-950` | black-alpha-950 | 0.94 |

#### Neutral.WhiteAlpha → WhiteAlpha

| Semantic Token | Primitive Source | Opacity |
|---------------|-----------------|---------|
| `neutral-white-alpha-0` | white-alpha-0 | 0 |
| `neutral-white-alpha-50` | white-alpha-50 | 0.04 |
| `neutral-white-alpha-70` | white-alpha-70 | 0.08 |
| `neutral-white-alpha-100` | white-alpha-100 | 0.14 |
| `neutral-white-alpha-200` | white-alpha-200 | 0.2 |
| `neutral-white-alpha-300` | white-alpha-300 | 0.28 |
| `neutral-white-alpha-400` | white-alpha-400 | 0.38 |
| `neutral-white-alpha-600` | white-alpha-600 | 0.58 |
| `neutral-white-alpha-800` | white-alpha-800 | 0.78 |
| `neutral-white-alpha-950` | white-alpha-950 | 0.94 |

#### Background → Gray

| Semantic Token | Primitive Source | Value |
|---------------|-----------------|-------|
| `background-0` | gray-0 | `#fdfefe` |
| `background-50` | gray-50 | `#f5f6f6` |
| `background-70` | gray-70 | `#eceded` |

#### Divider.Solid → Gray

| Semantic Token | Primitive Source | Value |
|---------------|-----------------|-------|
| `divider-solid-50` | gray-50 | `#f5f6f6` |
| `divider-solid-70` | gray-70 | `#eceded` |
| `divider-solid-100` | gray-100 | `#e4e4e5` |
| `divider-solid-200` | gray-200 | `#d4d4d5` |
| `divider-solid-300` | gray-300 | `#b8b9b9` |

#### Divider.Alpha → BlackAlpha

| Semantic Token | Primitive Source | Opacity |
|---------------|-----------------|---------|
| `divider-alpha-50` | black-alpha-50 | 0.04 |
| `divider-alpha-70` | black-alpha-70 | 0.08 |
| `divider-alpha-100` | black-alpha-100 | 0.12 |
| `divider-alpha-200` | black-alpha-200 | 0.18 |
| `divider-alpha-300` | black-alpha-300 | 0.3 |

#### Text.OnBright → BlackAlpha (밝은 배경 위 텍스트)

| Semantic Token | Primitive Source | Opacity |
|---------------|-----------------|---------|
| `text-on-bright-300` | black-alpha-300 | 0.3 |
| `text-on-bright-400` | black-alpha-400 | 0.42 |
| `text-on-bright-500` | black-alpha-500 | 0.54 |
| `text-on-bright-600` | black-alpha-600 | 0.64 |
| `text-on-bright-800` | black-alpha-800 | 0.82 |
| `text-on-bright-900` | black-alpha-900 | 0.88 |
| `text-on-bright-950` | black-alpha-950 | 0.94 |

> `700` shade 는 정의돼 있지 않다 — 이 계열에서 `700`을 쓰면 var() 체인이 끊어져 값이 빈다.

#### Text.OnDim → WhiteAlpha (어두운 배경 위 텍스트)

| Semantic Token | Primitive Source | Opacity | Offset |
|---------------|-----------------|---------|--------|
| `text-on-dim-300` | white-alpha-**400** | 0.38 | +100 |
| `text-on-dim-400` | white-alpha-**500** | 0.46 | +100 |
| `text-on-dim-600` | white-alpha-**700** | 0.68 | +100 |
| `text-on-dim-800` | white-alpha-**900** | 0.86 | +100 |
| `text-on-dim-900` | white-alpha-**950** | 0.94 | +50 |
| `text-on-dim-950` | white-alpha-**1000** | 0.99 | +50 |

> `500`·`700`은 정의돼 있지 않다.

#### State.OnBright → BlackAlpha (밝은 표면 hover/active 오버레이)

| Semantic Token | Primitive Source | Opacity |
|---------------|-----------------|---------|
| `state-on-bright-50` | black-alpha-50 | 0.04 |
| `state-on-bright-70` | black-alpha-70 | 0.08 |
| `state-on-bright-100` | black-alpha-100 | 0.12 |

#### State.OnDim → WhiteAlpha (어두운 표면 hover/active 오버레이)

| Semantic Token | Primitive Source | Opacity | Offset |
|---------------|-----------------|---------|--------|
| `state-on-dim-50` | white-alpha-**70** | 0.08 | +20 |
| `state-on-dim-70` | white-alpha-**100** | 0.14 | +30 |
| `state-on-dim-100` | white-alpha-**200** | 0.2 | +100 |

#### Dark Mode Surface Mapping

Dark 모드에서는 표면 토큰이 반전됩니다:

| Category | Light → Primitive | Dark → Primitive |
|----------|-------------------|------------------|
| Background | gray-0/50/70 | gray-950/900/800 |
| Neutral.Solid | gray 순방향 (0→950) | gray 역방향 (950→0) |
| Neutral.BlackAlpha | black-alpha | **white-alpha** |
| Neutral.WhiteAlpha | white-alpha | **black-alpha** |
| Divider.Solid | gray-50~300 | gray-800~400 |
| Divider.Alpha | black-alpha | **white-alpha** |
| Text.OnBright | black-alpha (어두운 글자) | **white-alpha** (밝은 글자) |
| Text.OnDim | white-alpha (밝은 글자) | **black-alpha** (어두운 글자) |
| State.OnBright | black-alpha | **white-alpha** |
| State.OnDim | white-alpha | **black-alpha** |

---

### Semantic Motion

| Semantic Duration | Primitive Source | Value | Tailwind |
|------------------|-----------------|-------|----------|
| `duration-instant` | duration-0 | 0ms | `duration-instant` |
| `duration-fast` | duration-100 | 100ms | `duration-fast` |
| `duration-medium` | duration-150 | 150ms | `duration-medium` |
| `duration-normal` | duration-200 | 200ms | `duration-normal` |
| `duration-slow` | duration-300 | 300ms | `duration-slow` |
| `duration-slower` | duration-500 | 500ms | `duration-slower` |

> `duration-medium`(150ms)은 press scale의 **복귀(out)** 전용이다 — 눌림은 빠르게(fast) 들어가고
> 조금 느리게 풀린다. 그래서 CLAUDE.md의 모션 표(5단계)에는 나오지 않는다.

| Semantic Easing | Primitive Source | Value | Tailwind |
|----------------|-----------------|-------|----------|
| `easing-enter` | easing-ease-out | `cubic-bezier(0.0, 0.0, 0.2, 1)` | `ease-enter` |
| `easing-exit` | easing-ease-in | `cubic-bezier(0.4, 0.0, 1, 1)` | `ease-exit` |
| `easing-move` | easing-ease-in-out | `cubic-bezier(0.4, 0.0, 0.2, 1)` | `ease-move` |
| `easing-linear` | easing-linear | `linear` | `ease-linear` |

| Semantic Scale | Primitive Source | Value | 용도 |
|---------------|-----------------|-------|------|
| `scale-press-sm` | scale-98 | 0.98 | 작은/hug 요소 |
| `scale-press-lg` | scale-99 | 0.99 | 넓은/fill 요소 |

> Motion·Scale semantic 은 테마에 따라 변하지 않으므로 **`:root`에 정의**된다. 색상 semantic 만 `[data-theme]`에 있다.
> `prefers-reduced-motion`에서는 `--semantic-scale-press-*`를 `1`로 덮는 것만으로 이를 참조하는
> `--comp-*-scale-pressed` 9개가 전부 따라온다 (Button 2 · TextButton · Chip.Universal · Chip.BadgeLike · SegmentBar 2 · Tab · NavVertical).

---

## Layer 3: Component Tokens

CSS: `--comp-{component}-{property}-{variant}[-{state}]`

`tokens.css`에 **386개**의 component token이 정의돼 있습니다 (2026-09-05 실측).

| 그룹 | 개수 | 그룹 | 개수 |
|------|:----:|------|:----:|
| Switch | 71 | Callout | 24 |
| Button (IconButton 공유) | 53 | Badge (Label 23 + Dot 2) | 25 |
| Chip.BadgeLike | 41 | Chip.Universal | 20 |
| Tab | 32 | Tooltip | 15 |
| NavVertical | 28 | Radio / Checkbox | 13 / 13 |
| SegmentBar (item + bar) | 27 + 10 | TextButton | 7 |
| Skeleton | 5 | 공유 press scale | 2 |

아래 표는 그중 **Button**을 대표 사례로 전개한 것입니다. 나머지 그룹은 `src/tokens/tokens.css`가 원본입니다.

### Button Component Tokens

CVA에서 `bg-[var(--comp-button-bg-primary)]` 형태로 소비됩니다.

#### Background

| Token | Semantic Reference | Light | Dark |
|-------|-------------------|-------|------|
| `--comp-button-bg-primary` | `neutral-solid-950` | `#1d1e22` | `#fdfefe` |
| `--comp-button-bg-secondary` | `neutral-black-alpha-70` | `rgba(16, 16, 19, 0.08)` | `rgba(253, 254, 254, 0.08)` |
| `--comp-button-bg-outlined` | — | `transparent` | `transparent` |
| `--comp-button-bg-ghost` | — | `transparent` | `transparent` |

#### Content (text + icon)

| Token | Semantic Reference | Light | Dark |
|-------|-------------------|-------|------|
| `--comp-button-content-primary` | `neutral-solid-0` | `#fdfefe` | `#1d1e22` |
| `--comp-button-content-secondary` | `neutral-solid-800` | `#383a3f` | `#eceded` |
| `--comp-button-content-outlined` | `neutral-black-alpha-600` | `rgba(16, 19, 17, 0.64)` | `rgba(253, 254, 254, 0.58)` |
| `--comp-button-content-ghost` | `neutral-black-alpha-600` | `rgba(16, 19, 17, 0.64)` | `rgba(253, 254, 254, 0.58)` |

#### Border

outlined 계층만 실제 border 를 그린다. 나머지 3계층에는 border 토큰이 **없다** — `transparent` 토큰조차 정의하지 않는다.

| Token | Semantic Reference | Light | Dark |
|-------|-------------------|-------|------|
| `--comp-button-border-outlined` | `neutral-black-alpha-200` | `rgba(16, 16, 19, 0.18)` | `rgba(253, 254, 254, 0.2)` |

#### Disabled: Background

| Token | Semantic Reference | Light | Dark |
|-------|-------------------|-------|------|
| `--comp-button-bg-primary-disabled` | `neutral-solid-300` | `#b8b9b9` | `#7d8284` |
| `--comp-button-bg-secondary-disabled` | `neutral-black-alpha-70` | `rgba(16, 16, 19, 0.08)` | `rgba(253, 254, 254, 0.08)` |
| `--comp-button-bg-outlined-disabled` | `neutral-black-alpha-50` | `rgba(16, 16, 19, 0.04)` | `rgba(253, 254, 254, 0.04)` |
| `--comp-button-bg-ghost-disabled` | — | `transparent` | `transparent` |

#### Disabled: Content

| Token | Semantic Reference | Light | Dark |
|-------|-------------------|-------|------|
| `--comp-button-content-primary-disabled` | `neutral-white-alpha-400` | `rgba(253, 254, 254, 0.38)` | `rgba(16, 19, 16, 0.42)` |
| `--comp-button-content-secondary-disabled` | `neutral-black-alpha-200` | `rgba(16, 16, 19, 0.18)` | `rgba(253, 254, 254, 0.2)` |
| `--comp-button-content-outlined-disabled` | `neutral-black-alpha-200` | `rgba(16, 16, 19, 0.18)` | `rgba(253, 254, 254, 0.2)` |
| `--comp-button-content-ghost-disabled` | `neutral-black-alpha-200` | `rgba(16, 16, 19, 0.18)` | `rgba(253, 254, 254, 0.2)` |

#### Disabled: Border

| Token | Semantic Reference | Light | Dark |
|-------|-------------------|-------|------|
| `--comp-button-border-outlined-disabled` | `neutral-black-alpha-100` | `rgba(16, 16, 19, 0.12)` | `rgba(253, 254, 254, 0.14)` |

#### State Overlay (hover/active)

토큰 이름은 `on-dim`/`on-bright`가 아니라 **계층 이름**으로 끝난다. 어떤 상태 팔레트를 쓰는지는 값이 말해 준다.

| Token | Semantic Reference | Light | Dark |
|-------|-------------------|-------|------|
| `--comp-button-hover-primary` | `state-on-dim-50` | `rgba(253, 254, 254, 0.08)` | `rgba(16, 16, 19, 0.04)` |
| `--comp-button-hover-secondary` | `state-on-bright-50` | `rgba(16, 16, 19, 0.04)` | `rgba(253, 254, 254, 0.08)` |
| `--comp-button-hover-outlined` | `state-on-bright-50` | `rgba(16, 16, 19, 0.04)` | `rgba(253, 254, 254, 0.08)` |
| `--comp-button-hover-ghost` | `state-on-bright-50` | `rgba(16, 16, 19, 0.04)` | `rgba(253, 254, 254, 0.08)` |

| Token | Semantic Reference | Light | Dark |
|-------|-------------------|-------|------|
| `--comp-button-active-primary` | `state-on-dim-100` | `rgba(253, 254, 254, 0.2)` | `rgba(16, 16, 19, 0.12)` |
| `--comp-button-active-secondary` | `state-on-bright-70` | `rgba(16, 16, 19, 0.08)` | `rgba(253, 254, 254, 0.14)` |
| `--comp-button-active-outlined` | `state-on-bright-70` | `rgba(16, 16, 19, 0.08)` | `rgba(253, 254, 254, 0.14)` |
| `--comp-button-active-ghost` | `state-on-bright-70` | `rgba(16, 16, 19, 0.08)` | `rgba(253, 254, 254, 0.14)` |

> State는 `group relative` + absolute `<span>` 오버레이 패턴으로 구현됩니다.

#### Focus

| Token | Semantic Reference | Light | Dark |
|-------|-------------------|-------|------|
| `--comp-button-focus-border` | `neutral-solid-1000` | `#101013` | `#fdfefe` |

> Button·Tab·Chip.Universal·Chip.BadgeLike·NavVertical·Switch·Checkbox·Radio 8개의 `focus-border`가
> 전부 이 한 토큰을 가리킨다. 예외는 SegmentBar 하나로, `--comp-segment-item-focus-border`만
> accent(`emphasized-purple-300`)를 쓴다 — [DEVIATIONS.md](./DEVIATIONS.md)에 2026-09-05자로 기록돼 있고
> 디자이너 확인이 남아 있다.

#### Height (size)

| Token | Reference | Resolved |
|-------|-----------|----------|
| `--comp-button-height-xl` | `--primitive-spacing-14` | 56px |
| `--comp-button-height-lg` | `--primitive-spacing-12` | 48px |
| `--comp-button-height-md` | `--primitive-spacing-10` | 40px |
| `--comp-button-height-sm` | `--primitive-spacing-8` | 32px |

#### Padding-X (size)

| Token | Reference | Resolved |
|-------|-----------|----------|
| `--comp-button-px-xl` | `--primitive-spacing-5` | 20px |
| `--comp-button-px-lg` | `--primitive-spacing-4` | 16px |
| `--comp-button-px-md` | `--primitive-spacing-3` | 12px |
| `--comp-button-px-sm` | `--primitive-spacing-2.5` | 10px |

#### Gap (size)

| Token | Reference | Resolved |
|-------|-----------|----------|
| `--comp-button-gap-xl` | `--primitive-spacing-2` | 8px |
| `--comp-button-gap-lg` | `--primitive-spacing-1.5` | 6px |
| `--comp-button-gap-md` | `--primitive-spacing-0.5` | 2px |
| `--comp-button-gap-sm` | `--primitive-spacing-0.5` | 2px |

#### Text Margin-X (size)

| Token | Reference | Resolved |
|-------|-----------|----------|
| `--comp-button-text-mx-xl` | `--primitive-spacing-1` | 4px |
| `--comp-button-text-mx-lg` | `--primitive-spacing-1` | 4px |
| `--comp-button-text-mx-md` | `--primitive-spacing-1` | 4px |
| `--comp-button-text-mx-sm` | `--primitive-spacing-0.5` | 2px |

#### Radius (size)

| Token | Reference | Resolved |
|-------|-----------|----------|
| `--comp-button-radius-xl` | `--primitive-radius-3` | 12px |
| `--comp-button-radius-lg` | `--primitive-radius-3` | 12px |
| `--comp-button-radius-md` | `--primitive-radius-3` | 12px |
| `--comp-button-radius-sm` | `--primitive-radius-2` | 8px |

#### Icon Size (size)

| Token | Reference | Resolved |
|-------|-----------|----------|
| `--comp-button-icon-xl` | **리터럴** | 24px |
| `--comp-button-icon-lg` | **리터럴** | 20px |
| `--comp-button-icon-md` | **리터럴** | 18px |
| `--comp-button-icon-sm` | **리터럴** | 16px |

> ⚠️ `--comp-button-icon-*` 4개는 primitive 참조가 아니라 **px 리터럴**이다. 24·20·16은
> `--primitive-spacing-6`·`-5`·`-4`와 값이 같아 참조로 바꿀 수 있지만, 18px에 대응하는 spacing 토큰은 없다.

#### Press Scale

| Token | Semantic Reference | Resolved |
|-------|-------------------|----------|
| `--comp-button-scale-pressed` | `scale-press-sm` | 0.98 |
| `--comp-button-scale-pressed-fill` | `scale-press-lg` | 0.99 |

---

## Token Flow Diagrams

### Accent Color (light/dark 공통)

accent 계열은 두 테마가 **같은 primitive** 를 가리킨다. 테마를 바꿔도 색이 유지된다.

```
Primitive (:root)              Semantic ([data-theme])              Component ([data-theme])
─────────────────              ───────────────────────              ────────────────────────
--primitive-purple-300         --semantic-emphasized-purple-300     --comp-segment-item-focus-border
  #c9b1f8          ─light─►      var(--primitive-purple-300)   ───►   var(--semantic-emphasized-purple-300)
                   ─dark──►      var(--primitive-purple-300)
```

### Neutral Color (light/dark 반전)

```
Primitive (:root)                Semantic ([data-theme])           Component ([data-theme])
─────────────────                ─────────────────────             ──────────────────
--primitive-gray-950             --semantic-neutral-solid-950      --comp-button-bg-primary
  #1d1e22              ──light──►  var(--primitive-gray-950)  ───►   var(--semantic-neutral-solid-950)
--primitive-gray-0
  #fdfefe              ──dark───►  var(--primitive-gray-0)
```

### Spacing (semantic layer 없음)

```
Primitive (:root)                Component (:root)                 Tailwind (CVA)
─────────────────                ──────────────────                ──────────────
--primitive-spacing-10                     --comp-button-height-md           h-[var(--comp-button-height-md)]
  40px                ──────────►  var(--primitive-spacing-10)
```

### Typography (component layer 없음)

```
Primitive (:root)                Tailwind Plugin
─────────────────                ───────────────
--text-size-16: 1rem    ──────►  .typography-16-semibold {
--text-lh-16: 24px                 font-size: var(--text-size-16);
--text-ls-16: -0.009em             line-height: var(--text-lh-16);
                                   letter-spacing: var(--text-ls-16);
                                   font-weight: 600;
                                 }
```

---

## Tailwind Integration

`tailwind.config.js`에서의 연결 방식:

| Config Path | Token Layer | 예시 |
|-------------|-------------|------|
| `theme.extend.colors.primitive.*` | Primitive | `bg-primitive-gray-500` (컴포넌트 금지) |
| `theme.extend.colors.semantic.*` | Semantic | `bg-semantic-emphasized-purple-500` |
| `theme.extend.spacing` | Primitive | `p-4`, `gap-6` |
| `theme.extend.borderRadius` | Primitive | `rounded-3` |
| `theme.extend.transitionDuration` | Semantic | `duration-fast` |
| `theme.extend.transitionTimingFunction` | Semantic | `ease-enter` |
| `plugins[]` (addUtilities) | Primitive | `typography-20-semibold` |
| Arbitrary values `var()` | Component | `bg-[var(--comp-button-bg-primary)]` |

> Component token은 tailwind.config.js에 등록하지 않고, arbitrary value syntax로 직접 소비합니다.

---

## Token Statistics

> 2026-09-05 `src/tokens/tokens.css` 실측. 값이 바뀌면 이 표부터 다시 센다.

| Layer | Category | Count |
|-------|----------|-------|
| **Primitive** | Color families | 23 families x 14 shades = **322** |
| | Spacing | **36** (`px`, `0`~`96`) |
| | Radius | **18** (`px`, `0`~`24`) |
| | Typography sizes | **17** (x4 weights = **68** utilities) |
| | Motion duration | **6** (0·100·150·200·300·500ms) |
| | Motion easing | **4** |
| | Press scale | **3** (0.96·0.98·0.99) |
| **Semantic** | Emphasized.Purple / Blue / Orange | 10 shades씩 (light/dark 공통) |
| | Success | 10 shades (light/dark 공통) |
| | Warning | 10 shades (light/dark 공통) |
| | Error | 10 shades (light/dark 공통) |
| | Neutral.Solid | **14** shades (light/dark 반전) |
| | Neutral.BlackAlpha | 10 shades (light/dark 반전) |
| | Neutral.WhiteAlpha | 10 shades (light/dark 반전) |
| | Background | 3 shades (light/dark 반전) |
| | Divider.Solid | 5 shades (light/dark 반전) |
| | Divider.Alpha | 5 shades (light/dark 반전) |
| | Text.OnBright | **7** shades (light/dark 반전) |
| | Text.OnDim | **6** shades (light/dark 반전) |
| | State.OnBright | 3 shades (light/dark 반전) |
| | State.OnDim | 3 shades (light/dark 반전) |
| | Motion duration | 6 (`:root`, 테마 불변) |
| | Motion easing | 4 (`:root`, 테마 불변) |
| | Press scale | 2 (`:root`, 테마 불변) |
| **Component** | 전체 | **386 tokens** / 15개 그룹 — 그룹별 개수는 [Layer 3](#layer-3-component-tokens) 참고 |
