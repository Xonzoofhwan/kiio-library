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

## 실행

컴포넌트명을 읽고, 존재하는 파일 범위에 따라 해당하는 검사만 수행한다.

서브에이전트를 활용하여 다음 3가지 검사를 **병렬로** 실행할 수 있다:
1. 빌드 검사
2. 토큰 무결성 + 패턴 준수 검사
3. 쇼케이스 등록 검사

---

## 검사 1 — 빌드

`npm run build` 실행.

- PASS: 빌드 성공 (exit code 0)
- FAIL: 에러 메시지 포함하여 보고

---

## 검사 2 — 토큰 무결성

`src/components/{Name}/{Name}.tsx`에서 `var(--comp-{name}-` 패턴으로 모든 CSS 변수 참조를 추출한다.
`src/tokens/tokens.css`에서 `--comp-{name}-` 패턴으로 모든 CSS 변수 정의를 추출한다.

비교하여:
- 참조는 있는데 정의가 없는 변수 → **에러** (런타임에 빈 값)
- 정의는 있는데 참조가 없는 변수 → **경고** (사용되지 않는 토큰)

보고: "토큰 무결성: X/Y 참조 매칭 (N개 미정의, M개 미사용)"

---

## 검사 3 — 패턴 준수

`src/components/{Name}/{Name}.tsx`를 읽고 다음 12항목을 검사한다:

| # | 항목 | 검사 방법 |
|---|------|-----------|
| 1 | as const 배열 export | `{COMPONENT}_{PROP}S` 패턴의 `as const` 존재 |
| 2 | 타입이 배열에서 파생 | `(typeof` 패턴 존재 |
| 3 | CVA arbitrary values only | `var(--comp-` 사용, 하드코딩 색상 (`#`, `bg-primitive-`, `text-[16px]`) 부재 |
| 4 | Base에 group relative | CVA base 문자열에 `group` + `relative` 포함 |
| 5 | transition-colors | `transition-colors` 포함, `transition-all` 부재 |
| 6 | duration-fast ease-enter | `duration-fast` + `ease-enter` 포함, 직접 duration (`duration-100` 등) 부재 |
| 7 | State overlay | `aria-hidden` + `pointer-events-none` + `absolute` + `inset-0` + `rounded-[inherit]` |
| 8 | Focus | `focus-visible` 포함, `group-focus` 단독 사용 (`group-focus-visible` 아닌) 부재 |
| 9 | Disabled | `cursor-not-allowed` 포함 (disabled 지원 시) |
| 10 | JSDoc | exported props interface의 각 필드에 `@default` 포함 |
| 11 | 색상 토큰 스코프 | `--comp-{name}-bg-`, `--comp-{name}-content-` 등이 `[data-theme]` 스코프 안에 선언 |

---

## 검사 4 — 쇼케이스 등록

| # | 항목 | 검사 파일 |
|---|------|-----------|
| 1 | App.tsx에 SHOWCASE_MAP entry | `src/App.tsx` |
| 2 | Sidebar NAV_GROUPS에 항목 | `src/components/showcase-layout/Sidebar.tsx` |
| 3 | TOC export | `src/showcase/{Name}Showcase.tsx`에 `{COMPONENT}_TOC` |
| 4 | 쇼케이스 파일 존재 | `src/showcase/{Name}Showcase.tsx` |

---

## 보고 형식

```
## Verification: {Name}

### Build
- PASS / FAIL (에러 시 메시지 첨부)

### Token Integrity
- X/Y 참조 매칭
- 미정의: (목록 또는 "없음")
- 미사용: (목록 또는 "없음")

### Pattern Compliance (X/12)
- ✓ as const 배열
- ✓ 타입 파생
- ✗ transition-all 사용됨 (line XX)
- ...

### Showcase Registration (X/4)
- ✓ App.tsx SHOWCASE_MAP
- ✓ Sidebar NAV_GROUPS
- ...

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
