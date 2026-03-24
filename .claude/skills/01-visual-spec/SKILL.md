---
name: visual-spec
description: "Figma 기반 시각 스펙 JSON 작성 (variant 구조, 사이즈, 색상 토큰 매핑)"
argument-hint: "[ComponentName] [FigmaURL?]"
---

# Visual Spec — 시각 스펙 정의

컴포넌트의 시각적 사양을 정의하여 `specs/{component}.json`의 시각 섹션을 작성한다.

**입력**: `$ARGUMENTS` = 컴포넌트명 (선택: Figma URL)

---

## 전제조건

1. `specs/_TEMPLATE.json`이 존재하는지 확인한다.
2. `specs/{component}.json`이 이미 있으면 읽어서 기존 내용을 확인한다.

---

## Step 0 — 디자인 씽킹

코드를 생각하기 전에, 이 컴포넌트의 맥락을 사용자와 대화하여 파악한다.

사용자에게 다음을 질문한다:

1. **역할**: "이 컴포넌트의 핵심 역할은 무엇인가요?" (정보 표시 / 사용자 입력 / 네비게이션 / 피드백 / 액션)
2. **사용 맥락**: "어떤 맥락에서 사용되나요?" (폼 안 / 카드 안 / 페이지 단위 / 오버레이 / 리스트 항목)
3. **차별화**: "시각적으로 가장 중요한 차별화 포인트는?" (색상 계층 / 사이즈 스케일 / 모양 변형 / 콘텐츠 구조)
4. **기존 관계**: "기존 컴포넌트와 사이즈나 토큰을 공유해야 하나요?" (예: TextField와 동일 높이, Button과 아이콘 크기 공유)

Figma URL이 제공되었다면 `mcp__figma__get_screenshot`으로 스크린샷을 가져와 참고 자료로 사용한다.
Figma가 없더라도 진행 가능 — 대화형으로 값을 수집한다.

→ **사용자 확인을 받은 후** 다음 Step으로 진행한다.

---

## Step 1 — Variant 구조 정의

사용자와 대화하며 variant 축과 값을 결정한다.

### 결정 항목

| 항목 | 예시 | 설명 |
|------|------|------|
| 시각적 variant 축 | hierarchy, variant, type | 색상/스타일이 달라지는 축 |
| 각 축의 값 | primary, secondary, outlined, ghost | intent 기반 이름 사용 (visual 이름 금지) |
| 사이즈 축 | xLarge, large, medium, small | 프로젝트 표준: xSmall~xLarge |
| Shape 지원 여부 | basic/geo | geo에서 radius가 0px 또는 9999px로 바뀌는지 |
| 아이콘 지원 여부 | iconLeading, iconTrailing, icon-only | 아이콘 슬롯 구조 |
| 기존 토큰 공유 | Button height, TextField height | 재사용 가능한 토큰 식별 |

### 기존 컴포넌트 사이즈 참조

```
Button:  xSmall(28) small(32) medium(40) large(48) xLarge(56)
TextField: xSmall(28) small(32) medium(40) large(48) xLarge(56)
```

→ 사용자가 variant 구조를 확인하면 다음으로 진행.

---

## Step 2 — 시각 값 수집

각 variant 축별로 구체적 값을 수집한다. 모든 값은 **시맨틱 토큰**으로 매핑한다.

### 사이즈 값 수집

각 사이즈별로 다음을 질문한다:

| 속성 | 토큰 참조 | 설명 |
|------|-----------|------|
| height | `var(--primitive-spacing-*)` | 컴포넌트 높이 (4px 단위) |
| paddingX | `var(--primitive-spacing-*)` | 좌우 패딩 |
| gap | `var(--primitive-spacing-*)` | 내부 요소 간격 |
| typography | `typography-{size}-{weight}` | 복합 타이포 토큰 |
| radius | `var(--primitive-radius-*)` | 테두리 둥글기 |
| iconSize | `var(--primitive-spacing-*)` | 아이콘 크기 (있을 때) |

**Tailwind spacing scale**: 1=4px, 1.5=6px, 2=8px, 2.5=10px, 3=12px, 4=16px, 5=20px, 6=24px, 7=28px, 8=32px, 10=40px, 12=48px, 14=56px
**Typography**: `typography-{12|13|14|15|16|17|18|20|22|24|28|32|40}-{regular|medium|semibold|bold}`
**Radius**: rounded-0(0) rounded-1(4) rounded-2(8) rounded-3(12) rounded-4(16) rounded-5(20) rounded-6(24)

### 색상 값 수집

각 시각적 variant별로 다음을 수집한다:

| 속성 | 토큰 참조 | 설명 |
|------|-----------|------|
| background | `var(--semantic-*)` | 배경색 |
| text/content | `var(--semantic-*)` | 텍스트 + 아이콘 색 |
| border | `var(--semantic-*)` | 테두리 (없으면 none) |

Figma URL이 있으면 `mcp__figma__get_design_context`로 추출한 hex를 역추적:
- hex → `docs/token-reference.md`에서 매칭되는 primitive 토큰 찾기
- primitive → semantic 토큰으로 매핑
- 매칭 안 되면 가장 가까운 토큰을 제시하고 사용자에게 확인

**절대 금지**: hex 직접 사용, primitive 토큰 직접 사용

→ 사용자가 값을 확인하면 다음으로 진행.

---

## Step 3 — 요약 및 기록

수집한 값을 테이블로 요약하여 사용자에게 제시한다.

### 사이즈 스펙 테이블

```
| Size    | Height | Padding-X | Gap | Typography            | Radius    | Icon |
|---------|--------|-----------|-----|-----------------------|-----------|------|
| xLarge  | 56px   | 16px      | 8px | typography-20-semibold | rounded-3 | 24px |
| ...     | ...    | ...       | ... | ...                   | ...       | ...  |
```

### 색상 스펙 테이블

```
| Variant   | Background                   | Text                        | Border                  |
|-----------|------------------------------|-----------------------------|-------------------------|
| primary   | semantic-neutral-solid-950   | semantic-neutral-solid-0    | none                    |
| ...       | ...                          | ...                         | ...                     |
```

→ 사용자 확인 후 `specs/{component}.json`에 기록한다.

### JSON 작성 규칙

- `specs/_TEMPLATE.json`을 복사하여 시작한다.
- `component`, `description`, `figmaNode` 필드를 채운다.
- `variants.size.*`와 `variants.{visualAxis}.*` 섹션을 채운다.
- `props`, `states`, `implementation` 섹션은 비워두거나 최소한으로 — Phase 2 `/behavior-spec`에서 완성한다.
- `_comment` 필드는 유지하거나 제거, 사용자 재량.

→ "시각 스펙이 `specs/{component}.json`에 기록되었습니다. 다음 단계는 `/behavior-spec {component}`로 동작 스펙을 정의합니다."

---

## 참조 파일

| 목적 | 경로 |
|------|------|
| JSON spec 템플릿 | `specs/_TEMPLATE.json` |
| 토큰 역추적 | `docs/FIGMA_TO_CODE.md` §D, `docs/token-reference.md` |
| 시맨틱 토큰 정의 | `src/tokens/semantic.ts` |
| CSS 변수 정의 | `src/tokens/tokens.css` |
| 스페이싱/라디우스 | `src/tokens/numbers.ts` |
| 타이포그래피 | `src/tokens/typography.ts` |
| 기존 컴포넌트 참조 | `src/components/Button/Button.tsx` (gold standard) |
