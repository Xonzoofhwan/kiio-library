---
name: verify
description: "컴포넌트 전체 검증 — 빌드, 토큰 무결성, 패턴 준수 12항목, 쇼케이스 등록"
argument-hint: "[ComponentName]"
---

# Verify — 컴포넌트 검증

컴포넌트의 토큰 무결성, 패턴 준수, 빌드 상태, 쇼케이스 등록을 검사한다.
어느 단계에서든 실행 가능한 유틸리티 스킬.

**입력**: `$ARGUMENTS` = 컴포넌트명

---

## 원칙 — 두 축을 분리한다

**등급은 합의 절차를 정하고, 바꾼 경로는 검증 범위를 정한다.** 이 스킬은 후자만 다룬다.

**읽고 판단하지 말고 실행한다.** 아래 표의 검사는 전부 실행 가능한 명령이다. 에이전트의 판단은 스크립트가 판정할 수 **없는** 것에만 쓴다 (JSDoc 설명의 품질, 설계 적합성, 시각 회귀).

### 바꾼 경로 → 돌릴 검사

| 바꾼 경로 | `lint` | `build` | `test:run` | 비고 |
|---|:-:|:-:|:-:|---|
| `src/components/**` | ✅ | ✅ | ✅ | tokenContract 가 이 경로를 스캔한다 |
| `src/tokens/**` | | ✅ | ✅ | tokenContract + cssContract |
| `tailwind.config.js`, `src/index.css` | | ✅ | ✅ | cssContract 가 빌드 CSS 를 읽는다 |
| `src/showcase/**`, `src/App.tsx` | ✅ | ✅ | | |
| `docs/**`, `CLAUDE.md`, `.claude/skills/**` | | | | 문서 링크는 수동 확인 |

**둘 이상을 바꿨으면 `npm run check` 하나로 전부 돈다.** 실무에서는 대부분 그렇다.

```bash
npm run check          # lint → build → test:run
```

### green 의 기준

명령이 끝난 것이 아니라 **출력을 읽고 실패·경고·skip 이 없음을 확인한 것**이다.
보고는 **수치로** 한다: `eslint 0 problems`, `vitest 42 passed`, `✓ built in 1.3s`. "통과했다"라는 문장만 적지 않는다.

**검사를 새로 쓴 경우에는 수치만으로 부족하다.** 결함을 주입해 그 검사가 **실제로 실패하는 것을 확인**하고, 실패한 케이스 수를 함께 적는다. 통과만 보고된 검사는 아무것도 검사하지 않아도 통과한다.

> ⚠️ 하이픈 있는 JSX 속성은 타입 검사를 우회한다. `<Select aria-label="x">` 는 `SelectProps` 에 `aria-label` 이 없어도 컴파일된다. "타입이 통과했으니 prop 이 적용됐다"고 추론하지 말고 렌더 결과를 확인한다.

---

## 실행

컴포넌트명을 읽고, 존재하는 파일 범위에 따라 해당하는 검사만 수행한다.

---

## 검사 1 — 게이트

```bash
npm run check
```

lint · build · 계약 테스트를 한 번에 돈다. 실패하면 **출력 그대로** 보고하고 중단한다.

---

## 검사 2 — 토큰 무결성 (스크립트가 판정한다)

```bash
npm run test:run -- tokenContract
```

`src/testing/tokenContract.test.ts` 가 T1~T7 을 판정한다:

| ID | 검사 |
|---|---|
| T1 | `var()` 무결성 — 모든 참조가 `tokens.css` 에 정의돼 있는가 |
| T2 | `:root` 에서 `var(--semantic-*)` 참조 금지 (var 체인이 끊어진다) |
| T3 | 색상 컴포넌트 토큰은 `[data-theme]` 스코프에만 |
| T4 | 컨트롤 높이 허용 집합 — **레일 기준** |
| T5 | 높이 토큰 리터럴 금지 (같은 값의 spacing 토큰이 있으면) |
| T6 | 타이포그래피 arbitrary 금지 (`text-[Npx]`) |
| T7 | primitive 직접 사용 · hex · `transition-all` · 기본 duration/easing/타이포 |

**이 스킬이 손으로 다시 판정하지 않는다.** 결과를 읽고 실패 항목만 보고한다.

### 새 인터랙티브 컴포넌트를 만들었다면

`tokenContract.test.ts` 의 `CONTROLS` 에 **등록한다.** 등록하지 않으면 T4 가 그 컴포넌트를 **보지 않는다** — 자동 판별이 불가능하기 때문이다(`height: 36px` 이 버튼인지 썸네일인지 코드는 말해주지 않는다).

- 허용 높이는 `20 · 24 · 28 · 32 · 36 · 40 · 48 · 56` (2026-09-05 실측 동결). **목록은 줄이기만 한다.**
- 집합 밖 값이 필요하면 `PENDING_DECISION` 에 넣기 전에 **디자이너 확인을 받는다.** 그 목록은 "승인된 예외"가 아니라 "아직 정리 안 된 부채"다.
- 컨트롤의 높이는 **사용자가 누르는 표면** 기준이다. SegmentBar 처럼 레일이 컨트롤이면 `아이템 + 패딩×2` 로 잰다.

---

## 검사 3 — 패턴 준수

**스크립트가 판정하는 것과 사람이 판정하는 것을 나눈다.** 아래 표의 "판정자"가 스크립트면 결과를 읽고 인용할 뿐 손으로 다시 세지 않는다.

| # | 항목 | 판정자 |
|---|------|--------|
| 1 | CVA arbitrary values only — hex·primitive·`text-[Npx]` 부재 | `tokenContract` T6·T7 |
| 2 | `transition-all` 부재 | `tokenContract` T7 |
| 3 | 기본 duration/easing(`duration-100`·`ease-out`) 부재 | `tokenContract` T7 |
| 4 | 색상 토큰이 `[data-theme]` 스코프에 선언 | `tokenContract` T2·T3 |
| 5 | 참조한 `var(--comp-*)`가 실재 | `tokenContract` T1 |
| 6 | 컨트롤 높이가 허용 집합 안 | `tokenContract` T4 |
| 7 | hover가 포인터 가드 안, active는 밖 | `cssContract` |
| 8 | 접근성 위반 0 (axe) | `a11ySmoke` |
| 9 | 키보드 경로·roving tabindex | `keyboardContract` |
| 10 | as const 배열 export + 타입 파생 | **사람** — `{COMPONENT}_{PROP}S` 와 `(typeof …)[number]` 확인 |
| 11 | Base에 `group relative`, state overlay 구조 | **사람** — `aria-hidden` + `pointer-events-none` + `absolute inset-0` + `rounded-[inherit]` |
| 12 | `focus-visible` 사용 (`group-focus` 단독 아님) | **사람** |
| 13 | disabled 시 `cursor-not-allowed` | **사람** (해당하는 경우) |
| 14 | JSDoc — 각 prop에 설명 + `@default` + `@see {AS_CONST}` | **사람** — 존재 여부가 아니라 **설명의 품질**을 본다 |

10~14는 스크립트가 판정할 수 없어서 남은 것이지, 덜 중요해서 남은 것이 아니다.

---

## 검사 4 — 등록 정합

```bash
npm run docs:check
```

`scripts/docs-check.mjs` D5가 **specs ↔ components ↔ showcase 3자 정합**을 판정한다 —
`specs/*.json` · `SHOWCASE_MAP` · `NAV_GROUPS` 가 서로 빠짐없이 대응하는가.

`VALID_SHOWCASE_IDS`는 `SHOWCASE_MAP`에서 파생되므로 별도 등록이 필요 없다.
같은 스크립트가 문서 링크(D1)·스킬 frontmatter(D2)·토큰 언급(D3)·모션 표(D4)·스킬 경로(D6)도 본다.

---

## 검사 5 — 새 인터랙티브 컴포넌트라면

**`tokenContract.test.ts`의 `CONTROLS`에 등록했는가.** 등록하지 않으면 T4가 그 컴포넌트를 **보지 않는다.**
스펙의 `a11y` 블록이 채워졌는가 — `role`·`keyboard`·`aria`·`focus`. **"해당 없음"도 답이지만 빈칸은 답이 아니다.**
`a11ySmoke`·`keyboardContract`에 케이스를 **추가했는가.** 열리는 컴포넌트라면 **연 상태에서도** 스캔해야 한다 — 닫힌 상태를 스캔하고 통과했다고 적는 것이 이 검사가 이미 겪은 실패다.

---

## 보고 형식

```
## Verification: {Name}

### Build
- PASS / FAIL (에러 시 메시지 첨부)

### 게이트
- `eslint N problems` · `✓ built` · `vitest N passed (M files)` · `docs:check` 결과
- 실패가 있으면 **출력 그대로** 첨부

### Pattern Compliance
- 스크립트: (위 수치 인용)
- 사람 판정 (10~14): ✓ as const + 타입 파생 · ✓ state overlay 구조 · ✗ JSDoc `@default` 누락 (line XX)

### 미검증
- (검사가 보지 못한 항목. 없으면 "없음". **비어 있지 않으면 "전부 통과"라고 쓰지 않는다**)

### Overall: PASS / {N} issues found
```

---

## 참조 파일

| 목적 | 경로 |
|------|------|
| 컴포넌트 소스 | `src/components/{Name}/{Name}.tsx` |
| Barrel export | `src/components/{Name}/index.ts` |
| 토큰 정의 | `src/tokens/tokens.css` |
| 쇼케이스 등록 | `src/App.tsx` |
| 사이드바 등록 | `src/components/showcase-layout/Sidebar.tsx` |
| 쇼케이스 파일 | `src/showcase/{Name}Showcase.tsx` |
| 체크리스트 원본 | `docs/COMPONENT_CHECKLIST.md` |
| 토큰 계약 검사 | `src/testing/tokenContract.test.ts` |
| CSS 계약 검사 | `src/testing/cssContract.test.ts` |
| 접근성 스모크 | `src/testing/a11ySmoke.test.tsx` |
| 키보드 계약 | `src/testing/keyboardContract.test.tsx` |
| 문서·정합 검사 | `scripts/docs-check.mjs` |
| 높이 결정 근거 | `docs/rfcs/2026-09-control-height.md` |
