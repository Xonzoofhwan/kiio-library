# 안정화 계획 — 외부에서 조합해 쓸 때의 동작 보강

> 작성일 2026-09-13 · 갱신 2026-09-15 · 기준 커밋 `24de33d` · 상태: **Phase A · B · C 전부 완료**(전부 미커밋, §3 실행 기록) · D1–D6 확정 · Q1–Q3 닫힘 · 사용자 판단 대기 6건은 §4.4 · Figma 파일은 **Kiio-Library**(`3ZDIV…`)이고 `z6xEk…` 는 옛 파일이다(§1.3 N6·N9)
>
> 입력은 astra 의 검토(2026-09-13)다. 검토가 든 주장을 **전부 재현 테스트로 실측**했고(§1), 검토가 놓친 것도 같이 적었다.
> 같은 날 사용자가 결정 6건(§4)을 내렸고, 그 결정을 반영하는 과정에서 **Figma 게시 라이브러리의 변수 컬렉션을 MCP 로 직접 읽어** 코드와 대조했다(§1.3). 그 결과가 Phase B 의 방향을 바꿨다 — 원본은 CSS 가 아니라 **Figma** 다. 그리고 그 Figma 는 저장소 문서가 가리키는 v3 파일이 아니라 **v4 파일**이다.
> 코드는 아직 한 줄도 바꾸지 않았다. 재현에 쓴 임시 테스트는 지웠고 작업 트리는 이 문서만 추가된 상태다.

---

## 0. 요약

검토의 결론 — "설계·검증 기반은 탄탄하고, **기존 API 의 동작 보강 → 토큰 정합 → 실제 사용 화면 검증** 순서가 맞다" — 에 동의한다. 실측 결과 P1·P2 6건은 **전부 사실**이었고, 그중 4건은 검토가 적은 범위보다 넓었다(§1.1). 검토에 없던 결함도 10건 찾았다(§1.2·§1.3).

기준 게이트(2026-09-13, 이 문서 작성 직전): `eslint 0 problems` · `✓ built in 1.36s` · `299 passed (7 files)` · `docs:check D1–D6 위반 0`. 빌드 경고 1건 — 단일 JS 청크 609.77 kB / gzip 165.90 kB.

| Phase | 내용 | 등급 | 선행 |
|:-:|---|:-:|:-:|
| **A** | 버튼 계열 7종의 이벤트 가드 순서 · 로딩 시 접근 가능한 이름 · `tabIndex` 보존 · Tooltip/Callout ref 합성 · `ref` prop 타입 | L0 (+`ref` 타입은 L1) | D4 ✅ |
| **B** | **Figma 를 원본으로** 색 4자 정합(T8) · **타이포 4자 정합(T9)** · `cn()` 충돌 그룹 · tailwind-merge 정렬 · 스펙 재지정 — **B1–B6 전부 완료** | L1 | 전부 확정 |
| **C** | Wanted Sans 도입 · 쇼케이스 등록 단일화 + 코드 분할 · 작은 화면 · 문서 정확성 — **전부 완료**(`docs:check` D7 포함). 남은 것: 브라우저 육안 확인 | L0 | D1 ✅ · D6 ✅ |
| **D** | 첫 소비 화면 — ROADMAP Phase 6 의 착수 조건 유지. **브라우저 검사는 이 시점에 도입한다**(D5) | — | D5 ✅ |

**Phase A · B · C 가 전부 끝났다**(2026-09-13~15, §3 실행 기록). 게이트: `eslint 0 problems` · `✓ built` · **544 passed (11 files)** · `docs:check` 7종 위반 0.

육안 확인도 닫혔다 — `npm run capture` 가 Chromium 으로 17페이지 × 3폭 × 2테마 **68장**을 찍고 폰트 로드·가로넘침·콘솔을 함께 잰다. 현재 **세 항목 모두 0건**이다.

남은 것은 **결정 6건뿐이고 §4.4 에 있다.** J1·J2·J3 는 답이 "의도다"면 작업이 생기지 않고, J4·J5·J6 는 각각 설계 변경·API 확장·추가 실측이 필요하다.

---

## 1. 실측

### 1.1 검토 주장

방법: `src/testing/` 에 임시 vitest 파일을 두고 실제 컴포넌트를 렌더해 관찰했다. jsdom 은 Tailwind 를 로드하지 않으므로, 시각 클래스의 효력이 필요한 항목(접근 가능한 이름)은 Tailwind 가 내는 것과 같은 규칙(`.invisible{visibility:hidden}`)을 `<style>` 로 주입해 쟀다. 임시 파일은 실측 후 삭제했다.

| # | 주장 | 실측 | 판정 |
|:-:|---|---|:-:|
| P1-1 | `asChild` + `loading` 에서 자식 `onClick` 이 실행된다 | 마우스 클릭 · Enter · `asChild disabled` 세 경우 모두 자식 핸들러 **1회 호출**. 원인은 Radix Slot `mergeProps` 가 핸들러를 `child(...args); slot(...args)` 순서로 합성하는 것 — 우리 가드(`onClick`)는 자식 뒤에 돈다 | **확인** |
| P1-2 | `loading` 이면 버튼의 접근 가능한 이름이 사라진다 | `visibility:hidden` 적용 후 `computeAccessibleName`: `Button`·`ButtonEmphasized`·`ButtonError`·`TextButton` 전부 `""`. `IconButton` 3종은 `aria-label` 이라 유지 | **확인 — 4종** |
| P2-3 | 소비자 `tabIndex` 를 덮어쓴다 | `<Button tabIndex={-1}>` → 속성 없음, 프로퍼티 0. `asChild`·`TextButton`·`IconButton` 도 같다. 같은 줄 `tabIndex={asChild && disabled ? -1 : undefined}` 이 **8개 파일**(Button 6 + TextButton + ChipUniversal)에 있다 | **확인 — 8곳** |
| P2-4 | Tooltip 에 callback ref 를 주면 테마가 끊긴다 | 객체 ref → 포털 `data-theme="dark"`. callback ref → `undefined`. Callout 도 `undefined` | **확인 — 2곳** |
| P2-5 | TS 와 CSS 의 semantic 토큰이 다르다 | 테마당 CSS 에만 6(`neutral-solid-500/700/900`, `text-on-bright-300/500`, `text-on-dim-300`) · TS 에만 2(`neutral-black-alpha-1000`, `neutral-white-alpha-1000`) · dark `Divider.Alpha` 5개 값 상이(TS 검정, CSS 흰색). **추가**: `tailwind.config.js` 에 `text-on-bright-300/500`·`text-on-dim-300` 이 없다. **어느 쪽이 맞는지는 §1.3 의 Figma 대조가 판정한다** | **확인 + 확대** |
| P2-6 | `cn()` 이 `typography-*` 충돌을 못 푼다 | `cn('typography-14-semibold','typography-16-regular')` 둘 다 남는다. **추가**: `rounded-2 rounded-4`, `rounded-none rounded-2`, `duration-fast duration-normal`, `ease-enter ease-exit` 도 못 푼다 — 프로젝트 커스텀 스케일 전부다. `tailwind-merge@3.5.0` README 는 "Tailwind v3 는 v2.6.0 을 쓰라"고 명시한다 | **확인 + 확대** |
| — | 번들 609.77 kB 경고 | 동일 수치 재현. `agentation` 은 프로덕션 번들에 **없다**(0건) — DEV 분기가 tree-shake 된다 | 확인 |
| — | README 컴포넌트 2개 · 폰트 Pretendard vs Geist | README 표는 Tooltip·Callout 2행. `index.css` 는 Geist Sans 를 로드하고 CLAUDE.md·README·tailwind 플러그인 주석·`typography.ts` 머리말은 Pretendard 다. Geist 전환은 커밋 `f9076d2` 의 **의도된 결정**이며 문서가 따라오지 않은 것이다. v4 Figma 의 텍스트 스타일도 Geist 다(N7). **추가**: 타이포 사이즈 수가 CLAUDE.md 13 · README 15 · `typography.ts` 17 로 세 문서가 다르다 — v4 는 17 로 보인다(N7) | 확인 + 확대 |

### 1.2 검토에 없던 발견 — 코드

| # | 발견 | 위치 |
|:-:|---|---|
| N1 | **버튼 계열 7종이 `ref` 를 타입에 선언하지 않는다.** React 19 라 런타임은 `...rest` 로 통과하지만(Tooltip 트리거가 그래서 동작한다) `<Button ref={r}>` 는 `tsc` 에서 거부된다 — 실측 3/3 에러 | [Button.tsx:87](../src/components/Button/Button.tsx#L87) 외 6 |
| N2 | `ChipUniversal` 은 `asChild` + `disabled` 에 **클릭 가드가 아예 없다.** 비-asChild 는 네이티브 `disabled` 가 막지만 asChild 는 `tabIndex=-1` 과 CSS `pointer-events-none` 뿐이다 | [ChipUniversal.tsx:163](../src/components/Chip/ChipUniversal.tsx#L163) |
| N3 | ANATOMY §2.3 의 `loading` 행이 **stale** 하다 — "native `disabled` 를 켠다"고 적혀 있으나 E2(2026-09-05) 이후 켜지 않는다 | [ANATOMY.md](./ANATOMY.md) 상태 prop 표 |
| N4 | COMPONENT_PATTERNS Pattern 3 의 예시가 `disabled={loading}` 을 쓴다 — 저장소가 폐기한 방식이다. CLAUDE.md 의 Loading 행·FIGMA_TO_CODE·스킬 02/03·스펙 4종의 `loadingStrategy` 도 전부 `invisible` 을 전제한다 | [COMPONENT_PATTERNS.md](./COMPONENT_PATTERNS.md) Pattern 3 |

### 1.3 검토에 없던 발견 — Figma 대조 (2026-09-13, MCP)

**Figma 파일이 둘이다.** 정확히 무엇을 읽었는지 먼저 적는다. 이 문서의 **v4** 는 파일 이름 **Kiio-Library**(`3ZDIV…`, 표지 문구 "Design System v4")의 약칭이고, **v3** 는 그 원본으로 보이는 파일(`z6xEk…`, 표지 "Design System v3")의 약칭이다. 사용자가 현재 파일로 인식하는 것은 Kiio-Library 하나다.

| | **v3** `z6xEkVn88mi5Ai3IHgMrBZ` | **v4** `3ZDIVn83opF9OYSzWYE1iF` |
|---|---|---|
| 표지 | "Design System v3" · Last Updated **2026/02/26** | "Kiio-library · Design System v4" · Last Updated **2026/03/27** · 이 저장소 GitHub 링크 |
| 컴포넌트가 바인딩한 변수 | `Sys/Neutral/Solid/0` · `Sys/Primary/500` · `Ref/Gray/500` · `Text/Hierarchical/On-bright/Level N` (레거시 이름) | `Se/Neutral/Solid/950` · `Se/Neutral/BlackAlpha/800` · `Se/Text/OnBright/400` · `Pr/Rose/500` (현재 이름) |
| 텍스트 스타일 | `Text{size}/{weight}` · **Pretendard** · 13 사이즈 | `{size}-{weight}` · **Geist** · `10-Regular`·`64-Regular` 등 코드와 같은 17 사이즈로 보인다 |
| 게시 라이브러리 | — | **Kiio-Library** = 이 파일. `button.Universal/Emphasized/Error` · `iconButton.*` · `textButton.*` · `SegmentBar.*` · `icon.*` 등이 게시돼 있다 |
| 저장소가 가리키는 곳 | [FIGMA_TO_CODE.md](./FIGMA_TO_CODE.md) 의 "Figma 파일 키" · `specs/_TEMPLATE.json` · 스펙 6개의 `figmaNode`(button · badge · chip-badgelike ×3 · nav-vertical · segment-bar · text-button 은 파일 키 없이 v3 노드 ID) | 스펙 3개(`checkbox`·`radio`·`switch`)만 `figmaFileKey` 로 명시 |

**v4 가 현재다.** 게시 라이브러리·`Se/` 컬렉션·Geist 텍스트 스타일·저장소 링크가 전부 v4 에 있다. 앞선 절의 "노드 ID invalid" 는 v4 노드를 v3 키로 조회한 탓이었다.

#### N5. Semantic 컬렉션의 shade 집합은 패밀리마다 다르다 — 코드 세 곳이 각각 다른 방향으로 어긋났다

게시 `Semantic`(`Se/`) 컬렉션을 패밀리별로 라이브러리 키 한정 검색해 전수를 받았다.

| 패밀리 | **Figma `Se/`** | `semantic.ts` | `tokens.css` | `tailwind.config.js` |
|---|---|:-:|:-:|:-:|
| Neutral.Solid | 0 · 50 · 70 · 100 · 200 · 300 · 400 · 600 · 800 · 950 · **1000** (11) | ✅ 11 | ❌ 14 (+500 · 700 · 900) | ❌ 14 (+500 · 700 · 900) |
| Neutral.BlackAlpha | 0 · 50 · 70 · 100 · 200 · 300 · 400 · 600 · 800 · 950 (10) | ❌ 11 (+1000) | ✅ 10 | ✅ 10 |
| Neutral.WhiteAlpha | 위와 같은 10 | ❌ 11 (+1000) | ✅ 10 | ✅ 10 |
| Text.OnBright | 400 · 600 · 800 · 900 · 950 (5) | ✅ 5 | ❌ 7 (+300 · 500) | ✅ 5 |
| Text.OnDim | 400 · 600 · 800 · 900 · 950 (5) | ✅ 5 | ❌ 6 (+300) | ✅ 5 |
| Divider.Solid · Divider.Alpha | 50 · 70 · 100 · 200 · 300 | ✅ | ✅ | ✅ |
| Background · State.OnBright · State.OnDim · Error | 0/50/70 · 50/70/100 · 50/70/100 · 50–900 | ✅ | ✅ | ✅ |

읽는 법: **Solid = Alpha ∪ {1000}** 이 Figma 의 규칙이다. `semantic.ts` 는 한 인터페이스를 세 스케일이 공유해 alpha 에 없는 1000 을 만들었고, `tokens.css` 는 Figma 에 없는 6개를 만들었다(`4c59a31`·`057430b` 에서 컴포넌트 필요로 추가). 어느 한 곳도 전부 맞지 않는다.

CSS 에만 있는 6개의 사용처와 처리(Q3 = (b), §4):

| 토큰 | 사용 | 처리 |
|---|---|---|
| `neutral-solid-500` · `neutral-solid-700` · `text-on-bright-300` · `text-on-dim-300` | **0** | 삭제 |
| `neutral-solid-900` | `--comp-checkbox-fg-checked-hover` 1곳 + `specs/checkbox.json` | Checkbox 토큰을 **v4 변형 값으로 전부 리매핑**(N10) → 이 토큰 사용 0 → 삭제 |
| `text-on-bright-500` | 쇼케이스 12파일(54곳) · 컴포넌트 **0** | 쇼케이스를 **600** 으로 리매핑(쇼케이스도 디자인 시스템을 따른다 — 사용자 확정) → 삭제 |

dark 값: **다크 모드는 코드가 설계했고 코드가 소유한다**(사용자 확인 2026-09-13). `tokens.css` 의 `[data-theme="dark"]` 블록이 원본이고 Figma 는 light 값과 키 집합만 준다. 따라서 `Divider.Alpha` 의 다크 값은 CSS(흰색 알파)가 맞고, `semantic.ts` 의 검정 알파가 틀렸다 — TS 주석("white-alpha handled via CSS")이 이미 그 사실을 인정한다. Q2 닫힘.

#### N6. 코드의 치환 규칙은 그대로다 — `Sys/`·`Ref/` 는 v3 파일의 이름이다

치환 규칙(확정, 사용자 2026-09-13): Figma **`Sys/` → 코드 `semantic`**, **`Ref/` → 코드 `primitive`**. 접두어 뒤의 구조는 그대로 kebab 으로 옮긴다 — `…/Neutral/Solid/0` → `--semantic-neutral-solid-0`, `…/Text/OnBright/400` → `--semantic-text-on-bright-400`, `…/Gray/500` → `--primitive-gray-500`.

v4 의 게시 컬렉션 접두어는 `Se/`·`Pr/` 이고 `Sys/`·`Ref/` 로 검색하면 `Se/`·`Pr/` 만 나온다. `Se/Emphasized/Purple/50–900` 이 있으므로 `Se/` 는 코드의 2026-03-24 `primary → emphasized` 재편(`b843d30`)을 반영한 현재 컬렉션이다. **규칙은 `Se/`(구 `Sys/`) → semantic, `Pr/`(구 `Ref/`) → primitive 로 읽는다.** v3 컴포넌트가 `Sys/Primary/500` 을 쓰는 것은 v3 가 옛 파일이기 때문이며, v4 컴포넌트(Checkbox·Radio·Switch)는 `Se/` 를 쓴다. `Pr/Gray` 는 0–1000 의 14단으로 코드 primitive 와 같다.

코드 쪽 결론(Q1 닫힘): **스냅샷은 v4 게시 `Se/`·`Pr/` 컬렉션에서 뽑는다**(라이브러리 키 한정 검색). v3 파일은 원본으로 쓰지 않는다.

#### N7. 타이포그래피 — Kiio-Library 전수 대조: 자간은 전부 일치, 행간 5개 불일치

처음에 옛 파일의 `Text{size}/{weight}`(Pretendard, 13 사이즈)와 대조해 차이를 적었으나 그 대조는 무효다. 사용자가 준 **00 Foundation** 페이지(`6089:457`)의 **Typography 섹션(`6089:461`)** 에서 Kiio-Library 의 텍스트 스타일 `{size}-{weight}`(Geist) **15 사이즈 × 4 굵기를 값까지** 읽었다. 사이즈 집합 17 = 코드 17. letterSpacing 은 % 단위다(`-0.9` → `-0.009em`).

**2026-09-14 갱신 — 전수로 다시 읽었다.** `getLocalTextStylesAsync()` 로 **68개 스타일 전부**의 family·size·lineHeight·letterSpacing 을 직접 받았다(견본 노드를 거치지 않으므로 미확인이 남지 않는다). `10-*`·`11-*` 도 이때 확인됐고 **코드와 같다**. 결과는 아래 표와 정확히 일치했다 — **자간 17개 전부 일치, 행간 5개 불일치.**

| size | Figma lineHeight → 코드 | Figma letterSpacing → 코드 | |
|:-:|:-:|:-:|:-:|
| 64 · 48 · 40 | 72 · 56 · 48 → 같음 | −1.2% → −0.012em | ✅ |
| **32** | **36 → 38** | −1.2% → −0.012em | ❌ 행간 |
| **28** | **32 → 34** | −1.0% → −0.010em | ❌ 행간 |
| **24** | **28 → 30** | −0.8% → −0.008em | ❌ 행간 |
| **22** | **24 → 28** | −1.6% → −0.016em | ❌ 행간 |
| **20** | **24 → 28** | −2.4% → −0.024em | ❌ 행간 |
| 18 | 28 → 28 | −1.2% → −0.012em | ✅ |
| 17 · 16 · 15 | 24 → 24 | −1.0 · −0.9 · −0.4% → 같음 | ✅ |
| 14 · 13 · 12 | 20 · 16 · 16 → 같음 | 0 → 0 | ✅ |
| 11 · 10 | 12 · 12 → 같음 | 0 → 0 | ✅ (2026-09-14 확인) |

**자간은 코드와 전부 같다.** 행간은 제목 크기 5개(20 · 22 · 24 · 28 · 32)에서 Figma 가 코드보다 2~4px 좁다. 코드 값은 옛 파일의 값과 같으므로 Kiio-Library 쪽이 추출 뒤에 조여진 것이다. T9 의 첫 red 는 이 5건이다. **D1(Wanted Sans) 로 텍스트 스타일이 바뀌는 시점에 다시 뽑아 그때 확정한다**(C0·B4) — 폰트가 바뀌면 행간도 다시 정해질 수 있다.

**해소됐다(2026-09-15).** 사용자가 Wanted Sans 를 **Figma 조직 공유 폰트로 업로드**하자 패밀리 수가 1941 → **1942** 가 되고 7종이 전부 나타났다. 곧바로 **68개 텍스트 스타일을 Geist → Wanted Sans 로 교체**했다(굵기별 4회, 17개씩). 스타일 이름이 Regular·Medium·SemiBold·Bold 로 Geist 와 같아 매핑이 1:1 이었고, **크기·행간·자간은 건드리지 않았다** — 교체 전후를 비교해 68개 전부 보존을 확인했다. 재확인 결과 `familyTally: {"Wanted Sans": 68}`, Geist 0.

**가는 길에 틀렸던 것**: 처음엔 기기에 폰트가 없어서라고 보고 `~/Library/Fonts` 에 설치했다. macOS 도 Figma 의 `font_cache.json` 도 정확히 색인했지만 목록은 1 도 움직이지 않았다. macOS 전용 폰트(`Helvetica Neue`·`Menlo`·`Hiragino Sans` 등 9개)가 **하나도 없다**는 것으로 이 목록이 로컬이 아니라 **Google Fonts 카탈로그 + 조직 공유 폰트**임이 드러났다. `~/Library/Fonts` 에 Pretendard 가 있고 목록에도 있길래 "로컬을 읽는다"로 단정한 것이 오독이었다 — Pretendard 가 양쪽에 다 있었을 뿐이다. **겹치는 원소로 집합을 판정하지 않는다. 한쪽에만 있는 표본으로 가른다.** §1.3 N9 과 같은 형태이고, 이번에는 사용자의 Figma 를 두 번 재시작시킨 뒤에 드러났다.

#### N12. 원티드의 권장 수치 조사 — 공식 스케일은 없고, 폰트와 자사 서비스가 대신 말한다 (2026-09-15)

"행간·자간은 원티드가 가장 적절한 값을 쓰고 있을 것"이라는 물음을 네 갈래로 확인했다.

**1. 공식 타이포 스케일은 없다.** 배포 zip 에는 `OFL.txt` 와 webfont CSS 뿐이고 CSS 에 `line-height` 선언이 없다. 저장소의 `documentation/concept`·`documentation/features`·`webfonts` 어디에도 사이즈별 표가 없다. 브랜드센터도 다운로드와 굵기 조절만 제공한다.

**2. 자간은 "건드리지 말라"가 공식 입장이다.** concept 문서: *"Wanted Sans가 가지는 글자 여백은 일반적인 본문 환경에서 자연스럽게 읽을 수 있도록 맞춰져 있습니다."* 제작기(brunch)에 따르면 San Francisco 를 기준으로 맞추다가, **지오메트릭이라 원형 문자 폭이 넓어 같은 자간에서 오히려 촘촘해 보이는** 문제를 발견해 **출시 2주 전에 자간을 +0.2% 넓혔다.** 즉 **보정은 이미 폰트 안에 들어 있다.**

**3. 세로 메트릭이 Pretendard·San Francisco 와 같다 — 실측으로 확인했다.** 문서의 주장을 `fontTools` 로 검증했다.

| | natural(normal) | hheaAsc | hheaDesc | winAsc | winDesc | capHeight |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| Wanted Sans | **1.1934** | 0.9521 | −0.2412 | 0.9521 | 0.2412 | 0.7070 |
| Pretendard | **1.1934** | 0.9521 | −0.2412 | 0.9521 | 0.2412 | 0.7070 |

소수 넷째 자리까지 같다(x-height 만 0.5039 vs 0.5303). `USE_TYPO_METRICS` 가 꺼져 있어 브라우저는 hhea 를 쓰므로 **`line-height: normal` 은 1.1934 em** 이다. typo 메트릭의 합은 정확히 **1.000 em** 으로 맞춰져 있다(의도된 설계).

**따라서 Pretendard 용으로 검증된 행간은 Wanted Sans 에 그대로 옮겨진다.** 이것이 이 조사에서 가장 쓸모 있는 사실이다.

**4. 원티드 자사 서비스의 실제 수치(Playwright 로 계산된 스타일 수집).** 단 **원티드 서비스는 Wanted Sans 가 아니라 Pretendard Variable 을 쓴다** — 위 3 때문에 행간은 비교 가치가 있지만 "Wanted Sans 로 이렇게 쓴다"는 뜻은 아니다.

| size | 우리 행간 | 원티드 행간 | 우리 자간 | 원티드 자간 |
|:-:|:-:|:-:|:-:|:-:|
| 32 | 36 (1.125) | **56 (1.750)** | −1.2% | −2.4% |
| 24 | 28 (1.167) | **36 (1.500)** | −0.8% | −2.4% |
| 22 | 24 (**1.091**) | **30 (1.364)** | −1.6% | −1.94% |
| 20 | 24 (1.200) | **32 (1.600)** | −2.4% | −2.4% · 0 |
| 17 | 24 (1.412) | 24 (1.412) ✅ | −1.0% | **0** |
| 16 | 24 (1.500) | 24 (1.500) ✅ | −0.9% | **+0.57%** |
| 15 | 24 (1.600) | 22 (1.467) | −0.4% | **+0.96%** |
| 14 | 20 (1.429) | 20 (1.429) ✅ | 0 | 0 · +1.45% |
| 13 | 16 (1.231) | **18 (1.385)** | 0 | **+1.94%** |
| 11 | 12 (**1.091**) | **14 (1.273)** | 0 | **+3.11%** |

**읽는 법 세 가지.**

- **본문 크기는 이미 일치한다.** 17·16·14 의 행간이 원티드와 **정확히 같다**(1.412 · 1.500 · 1.429). 우연이 아니라 둘 다 4px 그리드 위의 24·24·20 이다.
- **큰 글자에서 크게 갈린다.** 우리 32 는 1.125, 원티드는 1.750 이다. 그리고 **7개 사이즈(64·48·32·28·24·22·11)가 폰트의 자연 행간 1.1934 보다 좁다** — 그 아래에서는 글자 상자가 겹치기 시작한다.
- **자간의 방향이 반대다.** 원티드는 **작은 글자에 양수**(13에 +1.94%, 11에 +3.11%), 큰 글자에 음수(−2.4%)를 쓴다. 광학 보정의 교과서적 형태다. 우리는 작은 글자에 0, 큰 글자에 음수이고, 게다가 **폰트가 이미 +0.2% 를 품고 있다**(위 2).

**추가로 드러난 결함 하나**: 18 → 20 구간에서 **크기는 커지는데 행간이 줄어든다**(28px → 24px). 17 사이즈 중 유일한 역전이고 의도로 보기 어렵다.

**5. 왜 갈리는가 — 라틴 기준과 한글 기준의 차이다(2026-09-15 사용자 지적 → 실측).** "영문은 커질수록, 특히 히어로일수록 행간·자간을 좁혀야 타이트해 보인다"는 지적을 폰트에서 직접 쟀다.

먼저 **단순한 설명은 틀렸다.** 잉크가 닿는 세로 범위만 보면 한글이 라틴보다 **오히려 6.3% 좁다**(한글 0.8857 em, 라틴 0.9453 em). 한글은 위로 올라앉아 있고(−0.082 ~ +0.804) 라틴은 아래로 내려앉는다(−0.225 ~ +0.721).

**진짜 차이는 분포다.** 본문 문장에서 글자 하나가 차지하는 세로 높이를 재면:

| | 평균 | 중앙값 | 표준편차 |
|---|:-:|:-:|:-:|
| 라틴 | 0.5849 em | 0.5312 | 0.0970 |
| 한글 | **0.8295 em** | 0.8555 | **0.0618** |
| 차이 | **+41.8%** | | **−36%** |

라틴은 대부분의 글자가 x-height 띠(0.53 em)에만 있고 어센더·디센더는 가끔 나온다 — **줄 안에 저절로 흰 공간이 생긴다.** 한글은 모든 음절이 0.83 em 짜리 꽉 찬 사각형이고 편차도 작다. **같은 행간에서 한글의 줄 사이 여백이 라틴의 절반이 된다.**

| line-height | 라틴 여백 | 한글 여백 |
|:-:|:-:|:-:|
| 1.091 (우리 22) | 0.506 em | **0.262 em** |
| 1.125 (우리 32) | 0.540 em | **0.296 em** |
| 1.364 (원티드 22) | 0.779 em | 0.535 em |
| 1.500 (우리·원티드 16) | 0.915 em | 0.671 em |

**렌더로도 확인했다**(`scripts/typography-script-compare.html`, Playwright 캡처). 32/36 과 22/24 에서 한글은 줄 상자가 서로 닿고 받침이 윗줄에 바짝 붙는다. 같은 설정에서 라틴은 헤드라인으로 오히려 적절해 보인다. 22/30 · 32/42 로 풀면 한글이 숨을 쉰다.

**결론**: 지금 값은 **라틴 기준으로 조율된 스케일**이고, 그 판단 자체는 라틴에 대해 옳다. 문제는 Wanted Sans 가 **한 패밀리로 두 문자를 담는다**는 것이다. 행간 토큰은 렌더될 문자가 무엇인지 모른다.

**충돌 구간은 좁다.** 16 이하 본문에서는 같은 값이 두 문자 모두에 통한다(우리 16·17·14 가 원티드와 정확히 일치하는 이유다). **갈리는 것은 20 이상의 디스플레이 구간뿐이다.**

선택지는 넷이고 §4.4 성격의 판단이다.

| | 내용 | 대가 |
|:-:|---|---|
| A | 디스플레이 구간을 한글 기준으로 푼다 | 라틴 헤드라인이 다소 헐거워 보인다 |
| B | 지금의 라틴 기준을 유지한다 | 한글 헤드라인이 답답하다. **제품이 한국어면 이쪽이 더 자주 보인다** |
| C | 디스플레이 구간만 토큰을 둘로 나눈다 | 공개 API 가 늘고 소비자가 매번 고른다 |
| D | `:lang(ko)` 로 디스플레이 구간 행간만 바꾼다 | API 는 그대로. 다만 `lang` 이 정확해야 하고 혼용 줄은 한쪽을 따른다 |

**자간은 별개로 이미 답이 있다.** 위 2 에서 폰트가 +0.2% 를 품고 있고 제작사가 "본문에서 추가 보정 불필요"라고 명시했다. 원티드 서비스도 **작은 글자에 양수**(13에 +1.94%)를 쓴다. 우리는 작은 글자에 0, 큰 글자에 음수다 — 큰 글자의 음수는 라틴 관례로 정당하지만, **작은 글자의 0 은 어느 쪽 근거도 아니다.**

**결정 — 영문 기준으로 간다(2026-09-15 사용자).** 선택지 B 다. 지금의 값이 곧 그 기준이므로 **행간·자간 수치는 바꾸지 않는다.** 라틴에서 큰 글자일수록 행간·자간을 좁혀 타이트하게 보이는 것이 이 스케일이 노리는 바이고, 그 판단은 라틴에 대해 옳다.

**다만 국문은 디스플레이 구간에서 조정이 필요할 수 있다.** 위 5 의 실측이 그 근거다 — 20 이상에서 한글은 같은 행간으로 라틴의 **절반**밖에 여백을 못 받는다(1.091 에서 라틴 0.506 em · 한글 0.262 em). 16 이하 본문은 두 문자가 같은 값을 공유하므로 손댈 곳이 없다. **조정한다면 20 이상만이다.** 참고값은 원티드 서비스의 22→30(1.364) · 32→56(1.750) 이고, 최소선은 폰트의 자연 행간 **1.1934** 다. 재현은 `scripts/typography-script-compare.html` 로 한다.

**이 절은 수치를 바꾸지 않았다.** 근거만 모았다.

#### N8. FIGMA_TO_CODE 문서가 폐기된 이름과 빈 절을 갖고 있다

[FIGMA_TO_CODE.md](./FIGMA_TO_CODE.md) §D-1 의 역추적 예시가 `--ref-purple-500` · `--sys-primary-500` · `bg-sys-primary-500` 을 쓴다 — 현재 이름은 `--primitive-*` · `--semantic-*` · `emphasized` 다. `docs:check` D3 은 `semantic-{family}` 언급만 보므로 `sys-primary` 는 잡히지 않는다. §C "Figma Mode 매핑"은 한 문장짜리 stub 이다 — 다크는 코드 소유(Q2)라는 사실이 이 절의 내용이 된다.

#### N9. 문서 둘이 옛 파일을 가리킨다 — 스펙은 아니었다 (2026-09-14 정정)

**처음 적었던 "스펙 6개가 v3 노드 ID"는 틀렸다.** 스펙 3개만 확인하고 단정한 것이다. 전수를 다시 읽으니 **8개가 이미 Kiio-Library 키를 명시**하고 있었고, 두 파일이 복제 관계라 노드 ID 도 그대로 유효했다. 옛 파일을 가리킨 것은 [FIGMA_TO_CODE.md](./FIGMA_TO_CODE.md) 의 파일 키와 `specs/_TEMPLATE.json` 의 안내 **둘뿐**이다.

빠져 있던 것은 파일 키 6개(callout · chip-universal · skeleton · tab · text-button · tooltip)와 노드 4개(callout · chip-universal · tab · tooltip)였다. → B6-1 에서 전부 채웠다. Skeleton 은 **Figma 에 대응물이 없어** `figmaNode: null` 이 정상이며 그 사실을 스펙과 DEVIATIONS 에 적었다(2026-09-14 사용자 확인).

**교훈**: "일부를 보고 전체를 단정하지 않는다." 이 문서의 실측 표는 전수를 읽은 것과 표본을 읽은 것을 구분해 적어야 한다.

#### N10. Checkbox 의 컴포넌트 토큰이 v4 와 8상태 중 6개 다르다 — 컴포넌트 수준 드리프트의 첫 실측

v4 `Checkbox.universal` 컴포넌트 세트(섹션 `12943:10459`)의 Box · Medium 변형 8개를 노드별로 읽었다. 변형마다 변수가 정확히 하나씩 나왔다(채움색).

| 상태 | **Figma v4** | 코드 `--comp-checkbox-fg*` | |
|---|---|---|:-:|
| 미체크 · Default | `Se/Neutral/BlackAlpha/200` | `black-alpha-400` | ❌ |
| 미체크 · Hovered | `Se/Neutral/BlackAlpha/400` | `black-alpha-600` | ❌ |
| 미체크 · Pressed | `Se/Neutral/BlackAlpha/400` | `black-alpha-800` | ❌ |
| 미체크 · Disabled | `Se/Neutral/BlackAlpha/200` | `black-alpha-200` | ✅ |
| 체크 · Default | `Se/Neutral/Solid/950` | `solid-950` | ✅ |
| 체크 · Hovered | `Se/Neutral/BlackAlpha/800` | `solid-900` | ❌ |
| 체크 · Pressed | `Se/Neutral/BlackAlpha/600` | `solid-800` | ❌ |
| 체크 · Disabled | `Se/Neutral/BlackAlpha/300` | `solid-300` | ❌ |

**2026-09-14 재확인**: Line 스타일과 Small 사이즈를 더 읽었고 **6개 변형 전부 같은 값**이었다 — 한 변형의 실수가 아니다. 미체크 Disabled 가 Default 와 같은 변수(`BlackAlpha/200`)를 쓰는 것도 일관된다(비활성을 레이어 opacity 로 표현했을 가능성 — 여전히 미확인).

**그리고 이것은 디자이너 판단이 아니라 구현 드리프트였다.** 같은 계열인 **Radio 의 코드가 이미 Figma 값을 쓰고 있었다** — `--comp-radio-fg-hover` 와 `-pressed` 가 둘 다 `black-alpha-400` 이다. 즉 "hover 와 pressed 가 같다"는 이 저장소가 이미 받아들인 설계이고, Checkbox 만 다른 값으로 갈려 있었다. 막혀 있던 판단이 이 사실로 풀렸다.

`specs/checkbox.json` 의 색 절도 코드와 같은(틀린) 값을 적고 있다 — 스펙이 Figma 를 옮긴 것이 아니라 코드를 옮겼다는 뜻이다. **Radio · Switch · Button 계열 · TextButton · SegmentBar · Badge · Chip · Tab · NavVertical 도 같은 방식으로 대조해야 한다**(B6). `docs:check` D5 가 "spec 내용 ↔ 구현 값은 보지 않는다"고 미검증으로 남긴 자리가 바로 여기다.

#### N11. Foundation 페이지 실측 — 숫자·primitive 는 맞고, 문서의 radius 단 수가 틀렸다

| 축 | Figma (Kiio-Library, Foundation 페이지) | 코드 | |
|---|---|---|:-:|
| Spacing | `Spacing/S-px … S-96` 36단 (1·2·4·6·8·10·12·14·16·20·24·28·32·36·40·44·48·56·64·72·80·96·112·128·144·160·176·192·208·224·240·256·288·320·384 + 0) | `numbers.ts` spacing 36 키 | ✅ |
| Radius | `Radius-px · 0 · 0.5 · 1 · 1.5 · 2 · 2.5 · 3 · 4 · 5 · 6 · 7 · 8 · 10 · 12 · 16 · 20 · 24` (18단) + `rounded-full` 9999 | `numbers.ts` radius 18 키 (full 은 Tailwind) | ✅ 값 · ❌ **문서** — CLAUDE.md "24 steps", README "23 steps" 둘 다 틀렸다 (C3) |
| Primitive 색 | Colors 섹션 `8182:10291` 이 `Pr/` 23 패밀리 × 최대 14단의 hex 를 전부 노출 | spot-check gray-500 `#7d8284` · gray-900 `#2a2b31` · black-alpha-950 `#111111f0` · black-alpha-1000 `#101013fc` 일치 | ✅ (전수 대조는 T8 확장으로) |
| Primitive 이상치 | `Pr/Emerald/1000 = #101013` — Gray/1000 과 같은 값. `Pr/Forest/1000` 은 견본에 없다 | 코드도 emerald-1000 · forest-1000 = `#101013` | Figma 쪽 입력 실수로 보인다 — **사용자 확인**(B6-3 과 함께) |
| Motion | 변수 없음(섹션은 설명만) | `motion.ts` 가 소유 | — |

---

## 2. 원칙

[QUALITY_GATES_PLAN.md §2](./QUALITY_GATES_PLAN.md#2-원칙--왜-이렇게-하는가) 의 게이트 운영 4원칙을 그대로 쓴다. 이 계획에서 특히 중요한 것:

1. **red 먼저.** §1 의 실측 하나하나가 회귀 테스트가 된다. 수정 전에 그 테스트가 실패하는 것을 보고 건수를 적는다.
2. **등급 판정.** 각 항목을 `/new-component` 의 L0–L3 로 판정해 적었다. L1 은 계약 요약 한 단락을 구현 전에 제시한다.
3. **예외 목록은 줄이기만 한다.** 이 계획은 새 예외를 만들지 않는다.
4. **미검증과 통과를 구분한다.** jsdom 이 못 보는 것은 `UNMEASURED_*` 에 남긴다.
5. **토큰의 원본은 v4 Figma 다** (D3, 원칙 1 고정점 우선). 코드 세 곳은 Figma 를 따라가는 사본이며, 사본끼리 맞추는 것은 정합이 아니다. 코드가 먼저 필요해서 만든 토큰은 Figma 에 먼저 넣거나 쓰지 않는다. **쇼케이스도 디자인 시스템을 따른다**(사용자 확정) — 쇼케이스 편의로 토큰을 만들지 않는다. 예외 하나: **다크 모드 값은 코드가 소유한다**(Q2).

---

## 3. 단계별 계획

### Phase A — 버튼 계열 동작 보강

**목적**: P1-1 · P1-2 · P2-3 · P2-4 · N1 · N2 해소. 소비 프로젝트가 가장 자주 밟는 경로(로딩·링크 조합·포커스 제어)를 실제 동작으로 잠근다.

**등급**: L0 — 공개 표면(export·prop 이름·타입·토큰 이름·`data-theme`) 불변. 단 A5 의 `ref` 타입 추가는 **L1**(additive prop) 이라 계약 요약을 먼저 낸다.

#### A1. 가드 순서 — `onClickCapture`

Radix Slot 은 같은 이름의 핸들러를 **자식 → Slot** 순서로 부른다. 그래서 `onClick` 가드는 원리적으로 자식보다 먼저 돌 수 없다. 캡처 단계로 옮긴다.

```
inert 일 때
  onClickCapture: preventDefault + stopPropagation   ← 자식 onClick·조상 onClick·기본 동작(이동/제출) 전부 차단
  onClick:        (호출되지 않는다)
inert 가 아닐 때
  onClickCapture: 아무것도 하지 않는다
  onClick:        소비자 onClick 호출
```

React 는 같은 요소에서도 capture 리스너를 bubble 리스너보다 먼저 돌리고, capture 에서 `stopPropagation` 하면 bubble 단계 자체가 열리지 않는다. Enter/Space 는 브라우저가 `click` 으로 바꿔 주므로 키보드도 같은 가드가 덮는다. **한계**: 자식이 자기 `onClickCapture` 를 갖고 있으면 그것이 먼저 돈다 — 이 조합은 사용처가 없고, JSDoc 에 적는다.

같은 로직이 7개 파일에 복제돼 있으므로(2026-09-05 기준, `Button.test.tsx` 머리말) **내부 공통 모듈로 뽑는다**: `src/components/Button/inert.ts` — `index.ts` 에서 export 하지 않는다. 훅이 아니라 순수 함수 하나면 된다:

```ts
inertRootProps({ disabled, loading, asChild, type, onClick, tabIndex })
  → { isInert, onClickCapture, onClick, type, disabled, tabIndex, 'aria-disabled', 'aria-busy' }
```

Button 6종 + TextButton 이 이것을 쓴다. ChipUniversal(N2)은 `forwardRef` 구조가 달라 같은 함수를 쓰되 `aria-pressed` 계열은 자기 것을 유지한다.

#### A2. 로딩 시 접근 가능한 이름 보존 — D4 확정

**D4 의 해석**: Button 의 `loading` 은 "불러오는 중"이 아니라 **"처리 중"** 이다. 사용자 결정대로 버튼 자체(형태·크기·자리)는 처리가 끝날 때까지 그대로 보이고 스피너가 돈다 — 현재 구현과 Figma 스펙(콘텐츠 숨김 + 스피너 중앙, `specs/button.json`)이 이미 그 형태다. 라벨을 스피너 옆에 남길지는 Figma 의 loading variant 가 정하는 디자인 문제이므로 이 계획은 건드리지 않는다. 여기서 바꾸는 것은 **숨김 수단** 하나다.

`invisible`(`visibility:hidden`)은 accname 계산에서 콘텐츠를 제외한다. **`opacity-0` 으로 바꾼다** — 시각적으로 같고 접근성 트리에는 남는다. 스피너 래퍼에 `aria-hidden` 을 건다(장식). `asChild` 경로의 아이콘 슬롯도 같이 바꾼다.

| 선택지 | 비용 | 판단 |
|---|---|---|
| **A. `opacity-0`** (확정) | 텍스트가 드래그 선택·페이지 내 검색에 잡힌다. `pointer-events-none` 이 루트에 있어 클릭은 안 된다 | 한 클래스 교체. 레이아웃·폭 보존 그대로. 포커스 링 등에서 이미 쓰는 관용구 |
| B. `sr-only` 사본 | DOM 에 라벨이 두 번 들어간다. `describeElement` 가 이미 그 형태를 오독으로 다룬다 | 기각 |
| C. `aria-label` 자동 부여 | children 이 ReactNode 라 문자열로 못 만든다 | 기각 |

#### A3. `tabIndex` 보존

`tabIndex={asChild && disabled ? -1 : tabIndex}` — 소비자 값을 기본으로 통과시키고, 컴포넌트가 반드시 제어해야 하는 `asChild && disabled` 만 덮는다. A1 의 공통 함수에 포함된다. 8곳 전부.

#### A4. Tooltip / Callout ref 합성

`ref ?? internalRef` 는 둘 중 하나만 채운다. **callback ref 하나로 셋을 동시에 갱신**한다 — 외부 ref(객체든 함수든) · 내부 ref · 컨텍스트의 `triggerRef`/`anchorRef`. 의존성 없는 `useEffect` 는 제거된다(현재 effect 는 매 렌더 돈다). 합성 유틸은 `src/lib/composeRefs.ts` 에 둔다(Radix 의 `@radix-ui/react-compose-refs` 는 transitive 라 직접 의존하지 않는다).

검증에 "포털이 열린 상태에서 테마 전환"을 넣는다 — `useAncestorTheme` 의 `MutationObserver` 경로가 callback ref 에서도 도는지 본다.

#### A5. `ref` prop 타입 (L1)

```
추가: ButtonProps.ref?: Ref<HTMLButtonElement>  (7종 동일)
기존 동작: 변하지 않는다 — 런타임은 이미 ...rest 로 통과하고 있고, 타입만 그 사실을 인정한다.
토큰: 없음
```

`extends Omit<ButtonHTMLAttributes<…>, 'disabled'>` 를 `ComponentPropsWithRef<'button'>` 계열로 바꾸는 것이 가장 짧다. **`asChild` 일 때 ref 가 `<a>` 를 가리키는데 타입은 `HTMLButtonElement` 인 불일치**는 남는다 — Radix 와 같은 타협이며 JSDoc 에 적는다.

#### A6. 테스트

| 파일 | 내용 | 예상 red (수정 전) |
|---|---|:-:|
| `src/testing/buttonFamilyContract.test.tsx` (신규) | 7종을 배열로 돌린다. 케이스: ① inert 표면(aria·native disabled 유무) ② 가드 순서 — 마우스·Enter·`asChild` 자식 핸들러·조상 전파·`defaultPrevented` ③ `tabIndex` 통과 ④ **CSS 주입 후** 접근 가능한 이름 ⑤ `ref` 가 요소를 받는다. 판정기 자기 검사 포함 | ② 7×2 = 14 · ③ 7 · ④ 4 |
| `Button.test.tsx` 갱신 | `readInertness.contentHidden` 이 `invisible` → `opacity-0` 을 본다. `asChild loading` 케이스의 `aria-hidden` span 수가 1 → 2(스피너 래퍼) | 2 |
| Tooltip · Callout 케이스 (`a11ySmoke` 또는 신규) | 객체 ref · callback ref 각각 포털 `data-theme` 이 조상과 같다. 열린 채 조상 테마 토글 → 포털 갱신 | 2 |
| `keyboardContract.test.tsx` | `Button — 활성화 키` 절에 `asChild <a>` + `loading` 의 Enter 케이스 추가 | 1 |

CSS 주입은 "Tailwind 가 이런 규칙을 낸다"는 가정을 품는다. `cssContract` 처럼 **빌드된 CSS 에서 해당 규칙(`.opacity-0`·`.invisible`)을 뽑아 주입**하면 그 가정이 사라진다 — A6 은 그 형태로 만든다. "**미검증**"으로 남는 것: `opacity-0` 의 실제 렌더(브라우저 몫 — `UNMEASURED_ASPECTS` 갱신), `pointer-events-none` 효력(기존 항목 유지).

#### A7. 문서·스펙 정합

수정 대상(전부 `invisible` 또는 stale 한 loading 서술): CLAUDE.md "Common Component Patterns" Loading 행 · [COMPONENT_PATTERNS.md](./COMPONENT_PATTERNS.md) Pattern 3 (예시를 실제 구현 형태로) · [FIGMA_TO_CODE.md](./FIGMA_TO_CODE.md) 로딩 스니펫 · [ANATOMY.md](./ANATOMY.md) §2.3 `loading` 행(N3) · `specs/_TEMPLATE.json`·`button.json`·`text-button.json` 의 `loadingStrategy` · 스킬 `02-behavior-spec`·`03-implement` 의 loading 표. `docs:check` D6 이 스킬의 경로만 보므로 이 서술들은 사람이 고친다 — 그 목록이 이 절이다.

#### 완료 기준 — 실행 기록 (2026-09-13, **미커밋**)

- [x] **red 49건**을 실측했다 — HEAD 의 컴포넌트 10개만 stash 로 되돌리고 새 테스트를 돌린 값이다. `buttonFamilyContract` 117 중 **43**(가드 순서 7×2 · tabIndex 7×2 · 스피너 aria-hidden 7 · 이름 4×2 — IconButton 3종은 aria-label 이라 이름은 살아 있었다) · `Button.test` **3** · `portalTheme` **2**(Tooltip·Callout callback ref) · `keyboardContract` **1**. 예상(~30)보다 많은 이유는 스피너 aria-hidden(7)과 asChild tabIndex(7)를 예상에 넣지 않았기 때문이다. 복원 뒤 같은 4파일 317 전부 통과
- [x] `npm run check` green — eslint **0 problems** · `✓ built in 1.31s` · **427 passed (9 files)**(이전 299 + 신규 128) · docs:check D1–D6 위반 0(링크 199)
- [x] 쇼케이스 Button `asChild` 절에 **처리 중 링크** 추가. **브라우저 확인은 미수행** — 이 세션에 브라우저가 없다. jsdom 에서는 7종 전부 클릭·Enter·`defaultPrevented` 가 통과했고, 실브라우저에서 이동이 막히는지는 사용자가 `npm run dev` 로 한 번 눌러 본다(C4 의 "주입으로 재현 불가능한 결함" 후보이기도 하다)
- [x] `Button.test.tsx` 머리말 갱신 · `UNMEASURED_ASPECTS` 에 "로딩 콘텐츠 숨김의 실제 렌더" 추가

**실제 규모**: 신규 4 (`inert.ts` · `composeRefs.ts` · `buttonFamilyContract.test.tsx` · `portalTheme.test.tsx`) · 수정 21 (컴포넌트 10 · 테스트 2 · CLAUDE.md · COMPONENT_PATTERNS · FIGMA_TO_CODE · ANATOMY · 스펙 3 · 스킬 2 · 쇼케이스 2). 컴포넌트 10개는 +146/−246 줄 — 복제된 가드 7벌이 한 모듈로 줄었다.

**A2 결정의 부수 효과**: ChipUniversal 에 `aria-disabled` 가 추가됐다(disabled 일 때). 이전에는 네이티브 `disabled` 만 있었다 — 버튼 계열과 같은 표면이 됐고 `asChild` + `disabled` 에서도 상태가 읽힌다.

---

### Phase B — 토큰 정합 (v4 Figma 원본) 과 `cn()`

**목적**: P2-5 · P2-6 · N5 · N6 · N7 · N9 · N10 해소. "TS·CSS·Tailwind 중 어느 것이 진실인가"라는 질문 자체를 없앤다 — **진실은 v4 Figma 에 있고, 세 곳은 그것을 따라가는지 검사가 판정한다.**

**등급**: L1 — `semantic.ts` 의 exported 타입이 바뀌고(스케일 분리·alpha 1000 삭제), CSS 에서 semantic 토큰 6개가 사라지고, Checkbox 컴포넌트 토큰 **값** 6개가 바뀐다(토큰 이름은 그대로). 외부 소비자 0, 저장소 안 사용처는 §1.3 표대로다. 계약 요약을 구현 전에 낸다.

#### B1. Figma 스냅샷 + T8 (4자 정합)

- `specs/tokens/semantic.figma.json` — v4 게시 `Semantic`(`Se/`) 컬렉션의 **패밀리별 키와 light 값**을 MCP 로 뽑아 커밋한다. 출처는 라이브러리 키로 한정한 `search_design_system` 이지 컴포넌트 노드가 아니다. 이름 치환은 `Se/`·`Sys/` → `semantic`, `Pr/`·`Ref/` → `primitive`, 나머지 경로는 kebab. 뽑는 절차(파일 키 v4, 검색 쿼리, 라이브러리 키)를 [FIGMA_TO_CODE.md](./FIGMA_TO_CODE.md) §C 에 적고 "다크는 코드 소유"를 명시한다(N8). 스냅샷은 사람이 갱신하는 파일이며 갱신 날짜를 머리에 적는다.
- **T8** (`tokenContract.test.ts` 확장): 네 집합을 만든다 — Figma 스냅샷(light) · `semantic.ts` 평탄화 · `tokens.css` `[data-theme]` 블록 · `tailwind.config.js` 의 `var(--semantic-*)` 참조. 단언: 패밀리별 **키 집합 4자 일치** · **light 값** TS = CSS 해석 값 = Figma 값 · **dark 값** TS = CSS 해석 값(다크는 코드 소유라 Figma 는 비교 대상이 아니다).
- **값의 출처와 한계**: `Se/` 의 **키**는 라이브러리 검색으로 전수를 얻지만 **값**은 검색이 주지 않는다. Foundation 페이지의 "Semantic Colors" 프레임은 변수 바인딩이 없어 값을 주지 않으므로(N11), 값은 컴포넌트 섹션 노드들의 `get_variable_defs` 합집합으로 모은다 — 어떤 컴포넌트도 쓰지 않는 semantic 토큰의 값은 **미검증**으로 스냅샷에 표시한다. Primitive 값은 Colors 섹션 `8182:10291` 이 전부 준다 — T8 에 `Pr/` ↔ `--primitive-*` 전수 대조를 함께 넣는다(N11 의 Emerald/1000 이상치가 첫 확인 대상).
- **예상 red**(수정 전): CSS 6 키 + TS 2 키 + Tailwind 3 키(solid 500·700·900) + Divider.Alpha dark 값 5(TS) = **16**.

#### B2. 코드를 v4 에 맞춘다 (L1) — Q3 = (b) 확정

```
semantic.ts
  변경: SemanticNeutralScale 을 Solid(11단, 1000 포함) / Alpha(10단) 로 분리. alpha 의 1000 제거.
        Text 스케일은 Figma 와 이미 일치(400·600·800·900·950) — 손대지 않는다.
        dark.Divider.Alpha → WhiteAlpha (CSS 와 같게 — 다크는 코드 소유).
tokens.css — Checkbox 컴포넌트 토큰을 v4 변형 값으로 (N10 표 그대로)
  --comp-checkbox-fg:                  black-alpha-400 → black-alpha-200
  --comp-checkbox-fg-hover:            black-alpha-600 → black-alpha-400
  --comp-checkbox-fg-pressed:          black-alpha-800 → black-alpha-400
  --comp-checkbox-fg-disabled:         black-alpha-200 (그대로 — opacity 여부는 B6 스크린샷으로 확인)
  --comp-checkbox-fg-checked:          solid-950 (그대로)
  --comp-checkbox-fg-checked-hover:    solid-900 → black-alpha-800
  --comp-checkbox-fg-checked-pressed:  solid-800 → black-alpha-600
  --comp-checkbox-fg-checked-disabled: solid-300 → black-alpha-300
  specs/checkbox.json 의 color 절을 같은 값으로.
tokens.css — semantic 삭제 (Figma 에 없는 6개, 위 리매핑 뒤 전부 사용 0)
  --semantic-neutral-solid-500/700/900 · --semantic-text-on-bright-300/500 · --semantic-text-on-dim-300 (light·dark 블록 모두)
쇼케이스
  text-semantic-text-on-bright-500 (12파일 54곳) → text-semantic-text-on-bright-600
tailwind.config.js
  삭제: semantic.neutral.solid 500/700/900 매핑 (CSS 삭제와 같은 커밋)
CLAUDE.md semantic 표
  neutral.solid → "0, 50, 70, 100, 200, 300, 400, 600, 800, 950, 1000" · neutral.*-alpha → "…950" · text.* → "400, 600, 800, 900, 950"
쇼케이스 SemanticColorSection
  PRIMITIVE_MAP 의 'Divider.Alpha' dark 표기 'BlackAlpha' → 'WhiteAlpha (swapped)'
기존 동작
  Checkbox 의 미체크 테두리가 두 단 연해지고(400 → 200), 체크 상태의 hover/pressed 가 알파 계열로 바뀐다 — 쇼케이스 Checkbox 페이지 light/dark 육안 확인.
  쇼케이스 설명 문구가 한 단 진해진다(500 → 600). 그 외 컴포넌트 렌더 결과는 바뀌지 않는다.
```

#### B3. `cn()` 충돌 그룹 + tailwind-merge 정렬 — D2 확정

`extendTailwindMerge` 로 프로젝트 스케일을 등록한다:

| 그룹 | 값 | 충돌 |
|---|---|---|
| `typography` (신규) | `typography-{size}-{weight}` | `font-size` · `leading` · `tracking` · `font-weight` 를 **뒤에서 덮는다**. 반대 방향(`typography` 뒤의 `font-bold`)은 둘 다 남긴다 — 부분 덮어쓰기라 맞다 |
| `rounded` (확장) | 숫자 스케일 0–24 | 기존 그룹에 합류 |
| `duration` (확장) | `instant·fast·medium·normal·slow·slower` | 기존 그룹에 합류 |
| `ease` (확장) | `enter·exit·move·linear` | 기존 그룹에 합류 |

`tailwind-merge` 는 **3.5.0 → 2.6.0** 으로 내린다(D2). 3.x 는 Tailwind v4 의 클래스 사전을 쓰므로 v3 클래스가 어디서 오분류되는지 열거하기보다 공식 호환 버전을 쓰는 편이 싸다. 내린 뒤 `npm run check` 전체와 `utils.test` 로 회귀를 본다. **예상 red**(수정 전 `utils.test` 추가분): 4 — typography · rounded 숫자 · duration · ease.

#### B4. 타이포그래피 ↔ v4 — T9

`specs/tokens/typography.figma.json` 스냅샷(사이즈 · lineHeight · letterSpacing % · weight)과 `tokens.css` 의 `--text-size/lh/ls-*` · `typography.ts` 를 대조한다. v4 의 Typography 섹션 노드가 필요하다(§4.3). **순서가 중요하다**: C0 에서 v4 텍스트 스타일이 Wanted Sans 로 바뀐 **뒤** 스냅샷을 뽑는다 — 먼저 뽑으면 Geist 값에 맞춘 다음 다시 맞춰야 한다. 표본에서 이미 드러난 `24` 의 행간(28 vs 30)도 그때 확정한다.

#### B5. 생성 파이프라인은 이번 범위 밖 — RFC 초안만

원본이 넷(Figma · TS · CSS · Tailwind)이 되면서 "하나에서 생성"의 가치는 커졌다. 그러나 토큰 파이프라인 자체를 바꾸는 **L3** 다. T8·T9 가 먼저 서면 이관은 그 검사를 green 으로 유지하며 할 수 있다. 착수 신호는 "T8 또는 T9 가 두 번째로 red 를 낼 때" — 손으로 네 곳을 맞추는 비용이 실측되는 시점이다. `docs/rfcs/` 에 초안(상태: 초안, 트리거 명시)을 남긴다.

#### B6. v4 재지정 + 컴포넌트 토큰 대조 (N9 · N10)

1. **파일 키·노드 재지정**: [FIGMA_TO_CODE.md](./FIGMA_TO_CODE.md) 의 파일 키와 `specs/_TEMPLATE.json` 의 안내를 v4 로. 스펙 6개(button · badge · chip-badgelike ×3 · nav-vertical · segment-bar · text-button)에 `figmaFileKey` 를 넣고 `figmaNode` 를 v4 의 컴포넌트 세트 루트 ID 로 바꾼다 — v4 노드 URL 이 필요하다(§4.3). `docs:check` 에 **D7**: 모든 스펙의 `figmaFileKey` 가 Kiio-Library 키와 같다(제안 당시 D8 로 적었으나 실제로 비어 있던 번호는 D7 이었다 — `docs/ANATOMY.md` 가 제안하던 해부 검사를 D8 로 미뤘다).
2. **컴포넌트 토큰 대조** — **17개 전수 완료(2026-09-14).**

| 컴포넌트 | 대조한 항목 | 불일치 | 처리 |
|---|:-:|:-:|---|
| **Button**(Universal, 4 hierarchy × 6 속성) | 24 | **0** | — |
| **Switch**(Medium, on/off × 4 상태) | 9 | 1 | `overlay-off-pressed` `on-bright-100` → `70` |
| **Radio**(Medium, 미체크·체크 × 4 상태) | 8 | 2 | `fg` `300` → `200` · `fg-checked-disabled` `200` → `300` |
| **Checkbox**(Box·Line × Medium·Small) | 8 | **6** | 8상태를 Figma 값으로 전부 리매핑 |
| **ButtonEmphasized**(3색 × 3계층) | 39 | **0** | — |
| **ButtonError**(3계층 × 4상태) | 16 | **0** | — |
| **TextButton**(onBright·onDim × 2색 × 4상태) | 16 | **0** | — |
| **IconButton**(Universal — `--comp-button-*` 공유가 Figma 에서도 사실인지 확인) | 10 | **0** | — |
| **IconButtonEmphasized**(3색 secondary) | 6 | **6** | secondary 배경 `{색}-100` → **`{색}-50`** |
| **IconButtonError** | 7 | 1 | secondary 아이콘색 `error-600` → **`error-500`** |
| **Chip** 4세트(Universal · badgeLike ×3) | 111 | **21** | 9건 수정 · **12건은 설계 결정**(§4.4 J4·J5·J6) |
| **Tab**(Circular 2사이즈 · Underlined) | 38 | **0** | — |
| **SegmentBar**(4사이즈 × 4상태 × 3 shape) | 64 | 5 | 구분선 높이 3건 + 아이콘↔텍스트 간격 |
| **NavVertical**(항목 2사이즈 · 그룹 2사이즈) | 50 | 2 | 셰브런 색을 라벨에서 분리 |
| **Badge**(17색 × 2 weight × 5사이즈 + Dot) | 121 | 1 | 원형 medium 좌우 패딩 `8` → `10` |
| **Tooltip**(2 variant × 2 textSize × 2 shape) | 32 | **0** | — |
| **Callout** | 48 | 4 | 닫기 아이콘 크기·색 · 액션 타이포 · 텍스트 우측 여백 |
| 계 | **607** | **49** | **37건 수정 완료 · 12건은 사용자 결정 대기** |

**읽는 법 — 드리프트는 균일하지 않다.** 17개 중 **7개가 완전 일치**했고(Button · ButtonEmphasized · ButtonError · TextButton · IconButton Universal · Tab · Tooltip), 나머지에서도 대부분의 항목은 맞았다. 607항목 중 어긋난 것은 49건, 즉 **8%** 다. "전부 어긋나 있을 것"이라는 처음 예상도, "한 컴포넌트가 맞았으니 이웃도 맞다"는 추론도 둘 다 틀렸다 — **컴포넌트마다 재야 한다.**

**어긋남에는 형태가 있었다.** 49건을 원인별로 나누면:

| 형태 | 건수 | 예 |
|---|:-:|---|
| **이웃 컴포넌트의 값을 복사** | 7 | `IconButtonEmphasized` 가 텍스트 버튼의 `/100` 배경을 씀(Figma 는 `/50`) · `IconButtonError` 의 `error-600`(Figma 는 `500`) |
| **한 토큰을 여러 사이즈가 공유** | 3 | `--comp-chip-badgelike-gap` 하나가 4사이즈를 덮었다. Figma 는 **8·6·4·4** 다 |
| **추측이 주석으로 굳음** | 3 | SegmentBar 구분선 높이 주석 "proportional for others" → 실제는 **20·20·24·24** 로 비례하지 않는다 |
| **상속이 분리를 덮음** | 2 | NavVertical 셰브런이 라벨 색을 상속. Figma 는 셰브런에 한 단 옅은 변수를 따로 건다 |
| **한 사이즈만 규칙에서 벗어남** | 1 | 원형 Badge 는 기본형+2px/측면 인데 medium 만 같았다 |
| 나머지(개별 값) | 33 | Checkbox 리매핑 6 · Chip Inactive 8 등 |

**표본이 아니라 전수로 판정했다.** "아이콘 버튼 배경이 `/50`" 은 3색 전부에서, "Error 콘텐츠가 `/600`·`/50`" 은 4사이즈 × 2 weight 전부에서, "간격이 8·6·4·4" 는 **세 가지 독립 신호**(바인딩된 spacing 변수 집합 · 자식 좌표 · 컨테이너 폭)가 일치해서 확정했다. 한 곳만 보고 "체계적"이라고 적지 않았다.

**Figma 의 주석 텍스트는 믿지 않는다.** Tab·SegmentBar·NavVertical 의 설명 레이어가 바인딩된 변수와 **어긋나 있다** — 예: Tab Circular 40 의 주석은 `17 Medium` 인데 실제 바인딩은 `16-Semibold`, SegmentBar 의 "Large" 해부 행은 **Medium 컴포넌트 인스턴스로 만들어져 있다.** 코드는 전부 바인딩된 변수를 따르고 있었고 그것이 옳다. **대조의 기준은 변수이지 주석이 아니다.**
3. **Disabled 의 opacity 여부 — 닫혔다(2026-09-14, 렌더 실측).** Figma 의 Checkbox(`12943:9466`)·Radio(`12943:9491`) 컴포넌트 세트를 PNG 로 받아 셀마다 가장 어두운 픽셀을 쟀다. **미체크 Default 와 Inactive 가 `#d2d3d3` 로 픽셀까지 같다** — 레이어 opacity 는 걸려 있지 않고, 같은 변수를 쓴다는 읽기가 그대로 맞다. 코드(`--comp-checkbox-fg` = `--comp-checkbox-fg-disabled` = `black-alpha-200`)는 이미 충실하며 고칠 것이 없다.

   같은 실측이 **미체크의 Hovered 와 Pressed 도 `#9a9b9a` 로 같다**는 것을 확인했다(두 컴포넌트 × 3사이즈 전수). 변수를 잘못 읽은 것이 아니라 Figma 가 실제로 그렇게 렌더된다 — 즉 **미체크 상태에는 누름 피드백이 없다.** 체크 상태는 `#1d1e22 → #3b3e3e → #656867 → #b7b8b7` 로 4단이 전부 구분된다. 구현 드리프트가 아니므로 코드는 그대로 두고, 의도인지 여부만 사용자 판단으로 남긴다(§4.4).

#### 완료 기준 — 실행 기록 (2026-09-14, **미커밋**)

- [x] **B1** `specs/tokens/semantic.figma.json` 작성 + **T8 신설**(`src/testing/figmaContract.test.ts`, 25 케이스). red **5 케이스**(키 4 + dark 값 1)를 실측했고 그 안에 불일치 **24건**이 들어 있었다 — CSS 키 6×2(light·dark) · TS 키 2 · Tailwind 키 3 · TS dark 값 5. **검사가 원본을 따로 두지 않으면 이 24건은 어느 사본을 봐도 "정상"이다**
- [x] **B2** 코드를 Figma 에 맞췄다 — CSS 에서 5개 키 삭제(light·dark 10줄) · 쇼케이스 12파일 54곳 `text-on-bright-500` → `600` · `semantic.ts` 스케일 분리(Solid 11단 / Alpha 10단) + alpha `1000` 제거 + dark `Divider.Alpha` → WhiteAlpha · Tailwind 에 `neutral-solid-1000` 추가. **1건은 부채로 등록**(아래)
- [x] **B3** `tailwind-merge` **3.5.0 → 2.6.0**(Tailwind v3 공식 호환) + `extendTailwindMerge` 로 4축 등록(typography · rounded 숫자 · duration · ease). `utils.test` red **4** → green **11**. 스케일 목록은 `numbers.ts`·`motion.ts` 에서 가져와 단일 소스를 유지한다
- [x] **B6-1** 스펙 **13개 전부** Kiio-Library 파일 키와 노드를 갖췄다(빠진 키 6 · 노드 4 보완). Skeleton 은 Figma 에 없어 `null` 이 정상 — DEVIATIONS 에 기록. `_TEMPLATE.json`·FIGMA_TO_CODE 의 옛 파일 키도 교체
- [x] **문서** FIGMA_TO_CODE §C 에 **스냅샷 갱신 절차**와 "다크는 코드 소유" 추가 · §D-1 의 폐기 이름(`ref`/`sys`) 8곳 교체 · CLAUDE.md semantic 표를 실제 단 수로(neutral.solid 11 · alpha 10 · text 5) · radius 단 수 정정(CLAUDE.md 24 → 18, README 23 → 18) · 쇼케이스 `PRIMITIVE_MAP` 의 dark Divider.Alpha 표기
- [x] `npm run check` green — eslint **0 problems** · `✓ built in 1.18s` · **458 passed (10 files)** · docs:check D1–D6 위반 0
- [x] **B4 (T9 타이포)** 스냅샷 `specs/tokens/typography.figma.json`(17 사이즈 × 4 굵기 전수) + **T9 신설**(`src/testing/typographyContract.test.ts`, 86 케이스). 첫 실행 red **13** 중 3건은 **판정기 오탐**이었다 — `-0.010em` 과 `-0.01em` 을 문자열로 비교했다. 수치 비교로 고치니 red **10**, 즉 §1.3 N7 이 예고한 **행간 5개 × 2단언** 정확히 그만큼이었다. 코드를 Figma 에 맞춰(32·28·24·22·20 을 36·32·28·24·24 로) green
- [x] **B5 (RFC 초안)** [2026-09 토큰 파이프라인](./rfcs/2026-09-token-pipeline.md) — 상태 **초안**, 착수 조건 3개를 명시했다(T8 의 두 번째 red · semantic 패밀리 추가 · 다크의 원본이 Figma 로 이동). **지금 착수하자는 제안이 아니다**
- [x] **B6-2 완료** 17개 컴포넌트 전수 대조 — **607항목 중 49건**이 어긋났고 **37건을 수정**했다(위 표). 남은 12건은 값이 아니라 설계 판단이라 §4.4 로 올렸다. Skeleton 은 Figma 에 대응물이 없어 대상이 아니다
- [x] **부채 0** `PENDING_FIGMA_SYNC` 가 비었다 — `neutral-solid-900` 이 Checkbox 리매핑으로 사용 0 이 되어 CSS·Tailwind 에서 삭제했다. Figma 에 없는 토큰이 코드에 하나도 없다
- [ ] **육안** Checkbox·쇼케이스 문구 색 변화는 브라우저에서 보지 못했다 — 이 세션에 브라우저가 없다

**남은 부채 1건** — `figmaContract.test.ts` 의 `PENDING_FIGMA_SYNC`:
`--semantic-neutral-solid-900` 은 Figma 에 없지만 Checkbox 의 `--comp-checkbox-fg-checked-hover` 가 쓴다. Figma 는 그 자리에 `Se/Neutral/BlackAlpha/800` 을 쓰므로 옮기면 사용 0 이 되는데, **같은 실측에서 Figma 의 hover 와 pressed 가 같은 변수(BlackAlpha/400)를 쓰는 것**이 드러나 그대로 옮기면 두 상태가 구분되지 않는다. 디자이너 판단이 필요해 부채로 등록하고 B6-2 에서 해소한다.

**예상과 달랐던 것** — 계획은 "값도 어긋나 있을 것"을 전제했으나 **light 값은 처음부터 전부 일치**했다(unverified 제외). 네 곳이 갈린 축은 **키 집합 하나**였고, 값이 갈린 것은 Figma 가 원본이 아닌 **dark** 뿐이었다. 즉 그동안의 드리프트는 "값을 잘못 옮긴 것"이 아니라 **"코드가 Figma 에 없는 토큰을 만든 것"** 이다 — 원칙 5 가 막으려는 바로 그 형태다.

**검사가 즉시 값을 했다**: B2 중 Tailwind 편집에서 `neutral-solid-800` 을 실수로 지웠는데 T8 이 같은 실행에서 `tailwind.config.js 에 없다` 로 잡았다. 손으로 네 곳을 맞추는 작업에서 이런 실수는 조용히 통과하는 것이 보통이다.

**실제 규모**: 신규 2 (`semantic.figma.json` · `figmaContract.test.ts`) · 수정 ~25 (`semantic.ts` · `tokens.css` · `tailwind.config.js` · `utils.ts` · `utils.test.ts` · `package.json` · 스펙 7 · 쇼케이스 13 · CLAUDE.md · README · FIGMA_TO_CODE · DEVIATIONS)

---

### Phase C — Wanted Sans · 쇼케이스 · 문서

**등급**: 전부 L0 (폰트는 토큰 **값**의 변경이고, 쇼케이스와 문서는 라이브러리 표면이 아니다).

#### C0. Wanted Sans 도입 — D1 확정

**결정**: Wanted Sans(원티드랩, SIL OFL). 기하학적 라틴과 본고딕 기반 한글을 한 패밀리에서 얻는다. 게시판 [wanteddev/wanted-sans](https://github.com/wanteddev/wanted-sans) 기준 최신 v1.0.3, 7 굵기 정적 + 가변 제공, npm `wanted-sans@1.0.3` 도 있다. 우리가 쓰는 400 · 500 · 600 · 700 은 범위 안이다.

| 단계 | 내용 | 누가 |
|:-:|---|---|
| 1 | **v4 파일의 텍스트 스타일 `{size}-{weight}`(현재 Geist) 를 Wanted Sans 로 교체**하고 사이즈별 lineHeight·letterSpacing 을 확정한다 | 사용자 |
| 2 | 스냅샷 추출(B4 T9) — Typography 섹션 노드 URL 필요(§4.3) | 코드 |
| 3 | 로딩: `index.html` 에 jsDelivr **가변 · 동적 서브셋** CSS 를 `preconnect` + `preload` + `stylesheet` 로 건다(`…/wanted-sans@v1.0.3/packages/wanted-sans/fonts/webfonts/variable/split/WantedSansVariable.min.css`). 한글 폰트는 커서 서브셋 분할이 필수다. `index.css` 의 Geist `@font-face` 는 삭제 | 코드 |
| 4 | 스택: `:root { font-family: 'Wanted Sans Variable', 'Wanted Sans', system-ui, 'Apple SD Gothic Neo', sans-serif }`. Tailwind `fontFamily.sans` 를 같은 스택으로 덮고 `font-geist` 3곳(App · Tooltip/Callout 포털 래퍼)을 `font-sans` 로 | 코드 |
| 5 | `typography.ts` `FONT_FAMILY` · 플러그인 주석 · CLAUDE.md 2곳 · README · `typography.ts` 머리말 → Wanted Sans. 사이즈 수 표기 통일(T9 결과) | 코드 |
| 6 | 육안: 17 사이즈 × light/dark 스크린샷. ~~Button 계열의 `semibold` 를 medium 으로 되돌릴지 판단~~ → **전제가 틀렸다(2026-09-14 실측). 되돌릴 것이 없다** — 아래 참고 | 사용자 |

**라이브러리 소비 시점의 원칙**(Phase D 로 넘김): 배포 CSS 는 폰트를 import 하지 않는다. 폰트 로딩은 소비자 문서의 책임이고, 라이브러리는 스택 이름만 선언한다.

#### C1. lazy loading + 등록 단일화 — D6 확정

- 페이지별 `React.lazy` + `Suspense`. 목차(`*_TOC`)는 페이지 모듈과 함께 온다 — 로드 전에는 TOC 열을 비운다.
- `SHOWCASE_MAP`(App.tsx) 과 `NAV_GROUPS`(Sidebar.tsx) 를 **`src/showcase/registry.ts` 하나**로 합친다: `{ id, label, group, load: () => import(...) }`.
- **동반 변경**: `scripts/docs-check.mjs` D5 가 두 파일의 리터럴 블록을 파싱한다 — 파서를 registry 로 옮기고 자기검사를 갱신한다. 스킬 `03-implement`(등록 절차 2단계 + 검증 표)와 `04-showcase`(전제 조건), 이 저장소의 메모리 노트(등록 2곳)도 갱신한다.
- 먼저 잰다: `npx vite-bundle-visualizer` 로 609 kB 의 구성을 보고, 페이지 분할만으로 부족하면 `manualChunks` 로 vendor(react·radix)를 나눈다. 목표는 **경고 해소(초기 청크 < 500 kB)** 이지 특정 수치가 아니다.

#### C2. 작은 화면

`Sidebar` 의 `fixed w-[240px]` 와 `main` 의 `ml-[240px]` 를 `lg:` 이상에서만 적용하고, 그 미만에서는 접이식(Radix Collapsible 은 이미 의존성에 있다). 360 · 768 · 1280 에서 본문·컨트롤·테마 토글이 닿는지 확인한다. TOC 열은 이미 `hidden lg:block` 이다.

#### C3. 문서 정확성

| 문서 | 고칠 것 |
|---|---|
| README | 컴포넌트 표 2 → 13행 (ROADMAP 의 목록에서 뽑는다) · 폰트 Wanted Sans · 사이즈 수(T9 결과) |
| CLAUDE.md | 사이즈 수 · radius "24 steps" → 18단 + full(N11) · Project Status "In Progress: Button" 제거 · 트리의 `specs/input.json` 제거(존재하지 않는다) · 폰트 · semantic 표(B2) |
| README | radius "23 steps" → 18단 + full(N11) |
| FIGMA_TO_CODE | 파일 키 v4(B6) · §C 스냅샷 절차 + "다크는 코드 소유"(B1) · §D-1 폐기 이름 교체(N8) |
| specs | `figmaFileKey`·`figmaNode` v4 재지정(B6) |
| ANATOMY · COMPONENT_PATTERNS 등 | Phase A7 에서 처리 |

재발 방지 `docs:check` **D7**(선택): 문서의 "N sizes" 언급 ↔ `typography.ts` 사이즈 수. D4(모션 표)와 같은 형태.

#### C4. 브라우저 검사 — D5 확정: 도입 시점 (미착수, 조건 대기)

**보류하되 시점을 못 박는다.** 도입 시점은 다음 중 **먼저 오는 것**이다.

1. **Phase D 착수 PR.** 첫 소비 화면이 저장소에 들어오는 PR 과 같은 PR 에서 도입한다 — 그 화면이 첫 브라우저 검사 대상이 된다. 그 전에는 검사 대상이 쇼케이스뿐이라 비용 대비 얻는 것이 작다.
2. **jsdom + 빌드 CSS 주입으로 재현할 수 없는 결함이 실제로 1건 나오는 순간.** 이번 로딩 이름 건은 CSS 주입으로 재현됐다(첫 번째 시험). 주입으로 안 되는 것(레이아웃 · 포인터 히트테스트 · 실제 포커스 탐색 · 색 대비)이 결함으로 드러나면 그 PR 에서 도입한다.

도입 내용(그때의 체크리스트): `@vitest/browser` + Playwright(Chromium 만) · 글롭 `src/**/*.browser.test.tsx` · `npm run check` 에 편입(게이트) · CI 에 `playwright install chromium --with-deps`(+1~2분). 첫 케이스는 현재 `UNMEASURED_*` 에서 사유가 "브라우저 몫"인 항목들이다 — `Button.test` 5 · `keyboardContract` 3 · `a11ySmoke` 색 대비 1 · `tokenContract` 미측정 컨트롤 3 = **12건**. 도입 시 이 12건이 "측정됨"으로 옮겨가는 수를 완료 기준으로 적는다.

#### 완료 기준 — 실행 기록 (2026-09-14, **미커밋**)

- [x] **C0 폰트** Wanted Sans 로 교체했다 — `index.html` 이 jsDelivr 가변·동적 서브셋 CSS 를 로드(`preconnect`+`preload`+`stylesheet`), `index.css` 의 Geist `@font-face` 삭제, `:root` 와 Tailwind `font-sans` 를 같은 스택으로, `font-geist` 3곳 → `font-sans`, `typography.ts` 의 `FONT_FAMILY` 와 문서 5곳. **`Pretendard` 잔여 0**
- [x] **C1 등록 단일화 + 코드 분할** `src/showcase/registry.ts` 하나가 라우팅·사이드바·목차·분할을 소유한다. `SHOWCASE_MAP`(App)과 `NAV_GROUPS`(Sidebar)는 사라졌다. **초기 JS 청크 604.46 kB → 260.88 kB(−57%), 청크 29개, 빌드 경고 0**
- [x] **C1 동반** `docs:check` D5 파서를 registry 하나로 줄였다(자기검사 28건 유지) · 스킬 `03-implement`·`04-showcase`·`05-verify` · `docs/TROUBLESHOOTING.md` · `docs/SHOWCASE_TEMPLATE.md` · 메모리 노트 갱신. `TooltipShowcase` 가 쓰던 `NAV_GROUPS` 는 `showcaseGroupOf(id)` 로 대체
- [x] **C2 작은 화면** `lg` 미만에서 사이드바가 서랍이 된다 — 오버레이·Escape·항목 선택 시 닫힘, 상단 바에 여는 손잡이와 현재 페이지 이름. 본문 여백 `px-4 sm:px-8 lg:px-12`
- [x] **C3 문서** README 컴포넌트 표 2행 → 13개 전수(그룹별) · radius 단 수 정정(CLAUDE.md 24 → 18, README 23 → 18) · 타이포 사이즈 수(CLAUDE.md 13 → 17, README 15 → 17)
- [x] **B5 RFC 초안** [토큰 생성 파이프라인](./rfcs/2026-09-token-pipeline.md) — 착수 조건 3가지를 명시하고 지금은 기록으로만 둔다
- [x] `npm run check` green — `0 problems` · `✓ built` · **458 passed (10 files)** · docs:check 위반 0
- [ ] **육안** 브라우저가 없어 확인하지 못했다 — Wanted Sans 렌더, 쇼케이스 문구·Checkbox 색 변화, 360/768/1280 반응형, Medium 보정 유지 여부
- [ ] **D7**(문서의 사이즈 수 ↔ typography.ts) 미착수 — 이번에 손으로 고친 3곳이 다시 어긋나는 것을 막으려면 필요하다

**lint 가 두 번 막았고 두 번 다 옳았다**: ① effect 안의 동기 `setState` → 목차를 `{ownerId, entries}` 로 저장해 렌더 중 파생(`dynamicToc` 과 같은 패턴). ② 렌더 중 컴포넌트 생성 → `lazy` 를 registry 의 모듈 레벨로 올리고, 조회를 생성으로 오인하는 정적 분석을 피해 `createElement` 로 렌더.

---


**"Medium → semibold 보정"은 Button 계열에 걸려 있지 않았다 (2026-09-14 실측).** 메모리 노트는 "Figma 가 Medium 이라 해도 브라우저에서 얇아 보이니 semibold 로 올린다"는 규칙이었고, C0-6 은 폰트가 바뀌었으니 그 보정을 되돌릴지 묻는 항목이었다. 그런데 Figma 의 버튼 텍스트 스타일을 **네 사이즈 전수로 다시 읽으니 원래부터 Semibold(600)** 다 — `18-Semibold` · `16-Semibold` · `14-Semibold` · `12-Semibold`. TextButton 은 Figma 가 `14-Medium` 이고 코드도 `typography-14-medium` 이다.

즉 **코드는 Figma 의 굵기를 그대로 쓰고 있고 보정은 적용돼 있지 않다.** 되돌릴 대상이 없으므로 이 판단 항목은 사라진다. 같은 읽기에서 행간·자간도 §1.3 N7 의 표와 전부 일치했다(18→28/−1.2% · 16→24/−0.9% · 14→20/0 · 12→16/0) — **다른 페이지에서 뽑은 값이 N7 과 맞으므로 그 표는 한 번 더 검증된 셈이다.**

### Phase D — 실제 소비 화면

[ROADMAP Phase 6](./ROADMAP.md) 의 결정("첫 소비자가 생기는 시점이 착수 신호")을 바꾸지 않는다. 검토가 든 완료 조건 — 라이브러리 빌드 · 타입 선언 · CSS 진입점(폰트 미포함, C0) · React peer dependency · 설치 검증 — 은 그때의 체크리스트로 ROADMAP 에 옮겨 적는다. **브라우저 검사(C4)는 이 Phase 의 첫 PR 에 들어간다.** 여기서 정하는 것은 Phase A–C 가 그 착수의 전제라는 순서다.

---

## 4. 결정

### 4.1 확정 (2026-09-13, 사용자)

| ID | 결정 | 계획에 미친 영향 |
|:-:|---|---|
| **D1** | **Wanted Sans** — Geist 의 기하학적 라틴과 Pretendard 의 한글 장점을 한 패밀리로 | C0 신설. v4 텍스트 스타일 교체가 선행 → T9 스냅샷은 그 뒤(B4). Geist 전제의 Medium→semibold 보정 재검토 |
| **D2** | tailwind-merge **2.6.0 으로 내린다** | B3 |
| **D3** | 세 스케일이 한 인터페이스를 공유한 것은 Figma 규칙을 잘못 읽은 결과다. 색을 더하는 것은 문제가 아니고 **Figma 와의 싱크가 문제**다 | Phase B 의 원본을 CSS 에서 **Figma** 로 바꿈. §1.3 실측으로 Figma 규칙(Solid = Alpha ∪ {1000}) 확인. 4자 정합 T8 · 스냅샷 |
| **D4** | 불러오는 로딩은 스켈레톤, **처리 중 로딩은 스피너가 돌고 버튼은 끝까지 보인다**. 둘에 해당하지 않으면 기술적으로 가장 범용적인 것 | Button 은 처리 중 로딩 — 현재 형태 유지, 숨김 수단만 `opacity-0`(A2) |
| **D5** | 브라우저 검사 도입 시점을 명시 | C4 — Phase D 첫 PR, 또는 주입으로 재현 불가능한 결함 1건 발생 시. 도입 내용과 완료 기준(12건) 명시 |
| **D6** | 쇼케이스 등록을 registry 하나로 | C1 — D5 파서·스킬 2개·메모리 노트 동반 갱신 |

### 4.2 닫힌 질문

| ID | 결론 |
|:-:|---|
| **Q1** | 치환 규칙은 `Sys/` → semantic, `Ref/` → primitive 그대로. v4 게시 컬렉션의 현재 접두어가 `Se/`·`Pr/` 라 그 둘을 각각 같은 층으로 읽는다(N6). 스냅샷 출처는 v4 게시 컬렉션 하나 |
| **Q2** | 다크 모드는 코드(`tokens.css` `[data-theme="dark"]`)가 설계·소유한다. Figma 는 light 값과 키 집합의 원본이고 dark 는 비교 대상이 아니다. `Divider.Alpha` 다크 = CSS(흰색 알파) |
| **Q3** | **(b) 코드에서 지우고 Figma 에 있는 색으로 바꾼다.** Checkbox 는 v4 변형을 직접 읽어 8상태 전부 v4 값으로(N10 · B2). 쇼케이스 문구는 500 → 600 — **쇼케이스도 디자인 시스템을 따른다**(사용자 확정) |

### 4.3 필요한 입력 — Kiio-Library 노드 URL (결정이 아니라 자료)

MCP 는 노드 단위로만 읽고, 파일의 페이지 목록은 일부만 돌려준다. **페이지 URL 하나면** 그 안의 섹션·컴포넌트 세트·변형은 메타데이터로 내려가며 읽을 수 있다.

| 상태 | 무엇 | 얻은 것 / 남은 것 |
|:-:|---|---|
| ✅ 받음 | **00 Foundation** 페이지 `6089:457` (2026-09-13) | Typography 섹션 `6089:461` 전수(N7) · Spacing 36단 · Radius 18단 + full · Primitive 23 패밀리 전 값(Colors 섹션 `8182:10291`)(N11). "Semantic Colors" 프레임 `12446:2` 는 변수 바인딩이 없어 `Se/` **값**은 컴포넌트 노드에서 모은다(B1) |
| ✅ 이미 있음 | ❖ Navigations `6442:3144` 페이지 | 섹션 **Tab** `6726:21891` · **Segment button & bar** `6791:21089`(스펙의 `6502:1640` 포함) · **Navigation** `12534:22113`(= nav-vertical 스펙 노드) |
| ✅ 이미 있음 | ❖ Badge `6688:12589` 페이지 | 섹션 **Badge** `6693:9544` = badge.json 의 노드 |
| ✅ 유효 확인 | 스펙 노드 9개 전부 Kiio-Library 에서 읽힌다 — 두 파일이 복제 관계라 옛 파일 기준으로 적힌 ID 가 그대로 살아 있다 | button `6648:14947`(= **`button.Universal` 세트만**, 384 변형) · text-button `6657:27930` · segment-bar `6502:1640` · nav-vertical `12534:22113` · chip-badgelike `6973:27733`(Universal 세트)·`12585:59313`·`12585:58770` · badge `6693:9544` · checkbox·radio·switch. B6-1 은 노드 ID 를 바꾸는 일이 아니라 **`figmaFileKey` 를 적는 일**이 됐다 |
| ✅ 받음 | **❖ Buttons** `3:1871` (2026-09-14) | 섹션 Button `6657:5354` · Text Button `12488:40669` · Switch·Checkbox·Radio. 세트: `button.Universal` `6648:14947` · `Emphasized` `12488:41996` · `Error` `12514:93259` · `iconButton.Universal` `6657:33442` · `Emphasized` `6664:7365` · `Error` `6664:8760` · `textButton.hasDimBackground=false` `6657:27930` · `=true` `8186:213381` |
| ✅ 받음 | **❖ Chips** `2802:6335` (2026-09-14) | 섹션 Chip `7058:26200`. 세트: `Chip.Universal` `6928:26289` · `badgeLike.Universal` `6973:27733` · `Emphasized` `12585:59313` · `Error` `12585:58770` |
| ✅ 받음 | **❖ Tooltip** `8033:42206` (2026-09-14) | 섹션 Tooltip `10044:5667`. 세트: `Tooltip/tooltip` `10044:6107` · `Tooltip/callOut` `10054:6881` |
| — | ~~Shimmer 페이지~~ | **Figma 에 없다** (2026-09-14 사용자 확인). Skeleton 은 코드가 먼저 만든 컴포넌트다 — DEVIATIONS 에 기록 |

얻는 법: 페이지를 열고 아무것도 선택하지 않은 채 주소창 URL 을 복사한다(`node-id=` 에 페이지 ID 가 들어간다). 형식은 `이름: URL` 한 줄씩. 페이지 이름이 위 표와 다르면 실제 이름으로 주면 된다. Typography 는 Wanted Sans 교체 뒤 **같은 URL**(Foundation 페이지)을 다시 읽으면 된다.


### 4.4 사용자 판단이 남은 것 — 실측은 끝났고 결정만 남았다

**J1·J2·J3 은 코드가 Figma 를 충실히 따르고 있어 고칠 것이 없는** 상태다. 남은 것은 "Figma 가 그렇게 돼 있는 것이 의도인가"뿐이므로, 답이 "의도다"면 아무 작업도 생기지 않는다.

**J4·J5·J6 은 다르다.** 답이 무엇이든 작업이 생긴다 — 각각 설계 변경 · 공개 API 확장 · 추가 실측이다. 지시 없이 하면 범위를 넘으므로 멈춰 뒀다.

| # | 내용 | 실측 근거 | 답이 "아니다"일 때 생기는 일 |
|:-:|---|---|---|
| J1 | **미체크 Checkbox·Radio 에 누름 피드백이 없다.** Hovered 와 Pressed 가 같은 변수(`Se/Neutral/BlackAlpha/400`)이고 렌더도 `#9a9b9a` 로 같다 | 변수 전수 + PNG 픽셀(2컴포넌트 × 3사이즈) | Figma 에서 Pressed 를 한 단 더 어둡게 정하고, `--comp-{checkbox,radio}-fg-pressed` 를 그 값으로 |
| J2 | **`Ghost` 와 `Tertiary` 가 Figma 안에서 갈려 있다.** `button.*` 는 `Ghost`, `iconButton.*` 는 `Tertiary` 로 같은 역할을 부른다 | 6개 컴포넌트 세트 변형 이름 전수 | 한쪽으로 통일. 코드의 `BUTTON_ERR_HIERARCHIES` 등 **공개 API 이름이 바뀌는 파괴적 변경**이다 |
| J3 | **아이콘 전용 변형이 텍스트 변형과 다른 색을 쓴다.** `iconButton.Emphasized` Secondary 배경은 `/50`(텍스트판은 `/100`), `iconButton.Error` Secondary 아이콘색은 `Se/Error/500`(텍스트판은 `/600`) | 3색 전수 | Figma 쪽을 텍스트판과 같게 맞추고 코드를 되돌린다. **코드는 이미 Figma 를 따라 고쳐 뒀다**(B6-2) |
| J4 | **Chip.Universal 의 Inactive 를 코드는 흐리게(`opacity-50`), Figma 는 다시 칠한다.** Figma: 미선택 bg `BlackAlpha/70`(기본과 같음)·콘텐츠 `BlackAlpha/200`, 선택 bg `BlackAlpha/300`·콘텐츠 `WhiteAlpha/400` | 2사이즈 × 선택 2상태 전수 | 전용 토큰 4개를 만들고 `opacity-50` 을 걷는다. **지금 코드는 `specs/chip-universal.json` 에 "Button 과 달리 다시 칠하지 않고 흐리게 한다"고 명시된 의도적 선택**이라 기계적 교체 대상이 아니다. 덤으로 `opacity-50` 은 모서리 배지까지 흐리게 하는데 Figma 의 Inactive 는 배지를 아예 감춘다 |
| J5 | **Chip.Universal 의 `Shape` 축이 코드에 없다.** Figma 는 `Circular(Basic)`·`Square` 2값이고 코드는 `rounded-full` 로 고정, `shape` prop 자체가 없다 | 변형 이름 전수 | 공개 API 추가다(`CHIP_UNIVERSAL_SHAPES` + radius 토큰 + 링·오버레이 3곳). **불일치 수정이 아니라 기능 확장**이라 지시 없이 하지 않았다 |
| J6 | **ChipBadgeLike 의 `circular` 좌우 여백.** Figma 는 원형에서 6+4 로 나뉘는데 코드는 shape 와 무관하게 `px-md`(8)를 쓴다 | **Medium 한 사이즈만** 실측 | 먼저 나머지 3사이즈를 재야 한다. 한 사이즈만 보고 고치면 §1.3 N9 의 실수를 반복한다 |

**다크 모드에 손댄 곳 하나** — Callout 의 검정 변형 닫기 아이콘. Figma(light)가 `Se/Neutral/Solid/0`(불투명)이라 light 를 그 값으로 고쳤고, **다크는 Figma 에 원본이 없으므로**(Q2) 같은 의도를 옮겨 `--semantic-neutral-solid-950`(다크에서 gray-0 으로 뒤집힌다)로 맞췄다. 이 한 줄은 **실측이 아니라 판단**이다 — light 만 고치면 두 테마에서 아이콘 농도가 달라지고, 그 차이를 설명할 근거가 없다.

**J1 이 Checkbox 부채와 다른 점**: 2026-09-13 의 `PENDING_FIGMA_SYNC` 는 Radio 가 같은 값을 이미 쓰고 있다는 사실이 드러나 **스스로 풀렸다**(Figma 가 내적으로 일관됐다). J1·J2 는 반대다 — 증거가 "Figma 가 실제로 그렇다"를 가리키므로 코드로는 풀 수 없다.

---

## 5. 순서·의존성·규모

| Phase | 선행 | 신규 / 수정 | 예상 red (수정 전) | 해소 |
|:-:|:-:|:-:|:-:|---|
| A | — | 3 / ~20 | ~30 | P1-1 · P1-2 · P2-3 · P2-4 · N1 · N2 · N3 · N4 |
| B | §4.3 URL (B4·B6 만) | 4 / ~35 | T8 16 · `utils` 4 · T9 (C0 뒤) · B6 컴포넌트별 N/M | P2-5 · P2-6 · N5 · N6 · N7 · N8 · N9 · N10 |
| C | A(문서) · C0-1 은 사용자 | 2–3 / ~15 | (D7) 1 | 폰트 · 번들 경고 · 작은 화면 · 문서 |
| D | A · B · C | — | — | 브라우저 검사 도입(C4) |

A 는 즉시. B 는 검사(T8)·스냅샷·B2·B3 을 먼저 만들고, §4.3 의 URL 이 오면 B4·B6 을 넣는다. C0-1(v4 텍스트 스타일 교체)은 사용자 작업이라 병렬로 진행하고, 그 뒤 T9 → C0-2~6. **각 Phase 는 커밋 단위 하나**를 목표로 하고, 커밋 메시지에 red 건수와 게이트 수치를 적는다.

---

## 6. 이 계획이 다루지 않는 것

- 신규 컴포넌트 (ROADMAP 의 미구현 항목)
- npm 배포·버전·CHANGELOG (Phase D 이후)
- 픽셀 단위 시각 회귀 — 폰트 교체·`opacity-0`·사이드바 반응형은 육안과 스크린샷으로 본다
- 토큰 생성 파이프라인 (B5 의 RFC 로 넘긴다)
- Figma 쪽의 정리 — v3 파일의 보관·폐기, v3 컴포넌트의 레거시 바인딩(`Sys/…` · `Level N` · `Sys/Primary`). 코드는 v4 게시 컬렉션만 원본으로 삼는다
