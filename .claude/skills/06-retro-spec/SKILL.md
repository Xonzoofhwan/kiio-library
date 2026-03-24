---
name: retro-spec
description: "기존 구현 코드에서 JSON 스펙 역추출 (대화 없이 기계적 추출)"
argument-hint: "[ComponentName]"
---

# Retro Spec — 기존 코드에서 JSON 스펙 역추출

이미 구현된 컴포넌트의 코드를 읽고 `specs/{component}.json`을 생성한다.
일반적인 `/visual-spec` + `/behavior-spec` 흐름과 달리, **대화 없이 기계적으로 추출**한다.

**입력**: `$ARGUMENTS` = 컴포넌트명

---

## 전제조건

1. `src/components/{Name}/{Name}.tsx` (또는 해당 폴더의 .tsx 파일들)가 존재해야 한다.
2. `src/tokens/tokens.css`에 `--comp-{name}-` 토큰이 정의되어 있어야 한다.
3. `specs/_TEMPLATE.json`을 참조하여 출력 형식을 따른다.

---

## Step 1 — 소스 파일 수집

다음 파일을 읽는다:
- `src/components/{Name}/*.tsx` (모든 .tsx 파일)
- `src/components/{Name}/index.ts`
- `src/tokens/tokens.css` — `--comp-{name}-` 패턴 grep

---

## Step 2 — 컴포넌트 분류

코드 구조에서 분류를 판단한다:

| 분류 | 판별 기준 |
|------|----------|
| **Primitive** | 단일 파일, CVA 사용, HTML 요소 직접 렌더링 |
| **Composite** | Props 전달로 다른 컴포넌트를 조합 |
| **Wrapper** | 기존 컴포넌트를 감싸고 일부 props를 오버라이드 |
| **Compound** | Object.assign으로 서브컴포넌트 결합, Context 사용 |

---

## Step 3 — Variant 구조 추출

`as const` 배열에서 variant 축과 값을 추출한다:
```
{COMPONENT}_{PROP}S = [...] as const  →  축 이름 + 값 목록
```

CVA variants 블록에서 각 variant 값에 매핑된 토큰을 추출한다.

---

## Step 4 — 토큰 추출

### 크기/간격 토큰 (`:root` 스코프)
```
--comp-{name}-height-{size}: var(--primitive-spacing-*)
--comp-{name}-px-{size}: var(--primitive-spacing-*)
--comp-{name}-gap-{size}: var(--primitive-spacing-*)
--comp-{name}-radius-{size}: var(--primitive-radius-*)
--comp-{name}-icon-{size}: var(--primitive-spacing-*)
```

### 색상 토큰 (`[data-theme]` 스코프)
```
--comp-{name}-bg-{variant}: var(--semantic-*)
--comp-{name}-content-{variant}: var(--semantic-*)
--comp-{name}-border-{variant}: var(--semantic-*)
--comp-{name}-*-disabled: var(--semantic-*)
--comp-{name}-hover-*: var(--semantic-*)
--comp-{name}-active-*: var(--semantic-*)
--comp-{name}-focus-*: var(--semantic-*)
```

---

## Step 5 — Props 추출

interface에서 모든 props를 추출한다:
- 이름, 타입, 기본값 (`@default`에서), 설명 (JSDoc에서)
- variant props vs state props vs content props 분류

---

## Step 6 — States 추출

코드 패턴에서 상태 처리 방식을 추출한다:
- disabled: `disabledClasses` 맵 또는 조건부 스타일
- hover/pressed: overlay 맵 (Record<VariantType, string>)
- focus: `focus-visible` 또는 JS `pointerRef` 패턴
- loading: Spinner 교체 + `pointer-events-none` + `aria-disabled`/`aria-busy`

---

## Step 7 — JSON 조립 및 기록

### Primitive/Composite 컴포넌트
`specs/_TEMPLATE.json` 구조를 따른다:
```json
{
  "component": "Name",
  "description": "...",
  "classification": "Primitive | Composite | Compound",
  "props": { ... },
  "variants": { "size": { ... }, "{visualAxis}": { ... } },
  "states": { ... },
  "implementation": { ... }
}
```

### Wrapper 컴포넌트
SearchField 패턴을 따른다:
```json
{
  "component": "Name",
  "description": "...",
  "pattern": "Composition wrapper over {Base}",
  "base": "{Base}",
  "props": { ... },
  "omittedFromBase": { ... },
  "inheritedFromBase": [ ... ],
  "tokens": "없음 — --comp-{base}-* 토큰 재사용",
  "implementation": { ... }
}
```

### Compound 컴포넌트
추가 필드:
```json
{
  "subComponents": [
    { "name": "SubName", "role": "...", "props": { ... } }
  ],
  "context": {
    "name": "{Name}Context",
    "fields": { ... }
  }
}
```

→ `specs/{name}.json`에 기록한다.
→ "스펙이 `specs/{name}.json`에 추출되었습니다. `/verify {name}`으로 검증할 수 있습니다."

---

## 참조 파일

| 목적 | 경로 |
|------|------|
| JSON spec 템플릿 | `specs/_TEMPLATE.json` |
| Wrapper 예시 | `specs/searchfield.json` |
| 컴포넌트 소스 | `src/components/{Name}/` |
| 토큰 정의 | `src/tokens/tokens.css` |
| Barrel export | `src/components/{Name}/index.ts` |
