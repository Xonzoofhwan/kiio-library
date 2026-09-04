---
name: new-component
description: "컴포넌트 작업의 위험도 판정과 절차 라우터 — 신규 제작, 기존 확장·수정, 토큰·테마 변경을 L0~L3 등급으로 판정하고 등급별 절차만 밟는다"
argument-hint: "[ComponentName] [FigmaURL?]"
---

# 컴포넌트 작업 — 위험도 기반 라우터

디자인 시스템을 바꾸는 모든 작업은 **먼저 위험도 등급을 판정**하고, 그 등급이 요구하는 절차만 밟는다. 낮은 등급에 무거운 절차를 강제하지 않고, 높은 등급을 절차 없이 통과시키지 않는다.

**입력**: `$ARGUMENTS` = 컴포넌트명 (선택: Figma URL)

---

## 왜 등급인가

이전에는 오타 수정과 신규 컴포넌트가 **같은 4-Phase**를 밟았다. 그 결과 두 방향으로 새어나갔다 — 작은 작업은 절차를 통째로 건너뛰었고, 큰 작업은 "일단 만들고 나중에 스펙을 맞추는" 형태가 됐다.

등급 판정은 그 둘을 분리한다. **등급은 합의 절차를 정하고, 바꾼 경로는 검증 범위를 정한다.** 후자는 [`/verify`](../05-verify/SKILL.md)가 소유한다.

---

## 공개 표면의 정의 — 등급 판정의 기준

이 저장소에는 루트 배럴이 없다. 공개 표면은 다음 다섯이다.

1. 각 `src/components/{Name}/index.ts`의 **export 이름**
2. exported props interface의 **prop 이름·타입**
3. `{COMPONENT}_{PROP}S` as const 배열의 **값**
4. `--comp-*` 토큰의 **이름** (값이 아니라 이름)
5. `data-theme` 속성 계약

---

## 등급 판정 — 첫 응답 전에 한다

| 등급 | 작업 예 | 절차 |
|:-:|---|---|
| **L0** | 문서 수정, 내부 스타일(공개 표면 불변), 명백한 버그 수정 | **바로 구현** → `/verify` |
| **L1** | optional prop 추가, additive variant 값, 아이콘 추가 | **계약 요약 한 단락** → 구현 → `/verify` |
| **L2** | **신규 컴포넌트**(simple·compound 불문), 기존 구조 변경 | 4-Phase 전체 (아래) |
| **L3** | `--comp-*`·semantic 토큰 **이름** 변경·삭제, `data-theme` 계약 변경, export·prop 삭제·개명, **새 공개 토큰 신설** | RFC → **명시적 승인** → 구현 → `/verify` |

### 판정 규칙

1. **공개 표면을 건드리면 최소 L1.** 삭제·개명이면 L3.
2. **새 export 추가는 simple이어도 L2.** prop 하나를 더하는 것과 `index.ts`에 이름을 하나 더 박는 것은 **되돌리는 비용이 다르다.** 이름·문서·스펙·쇼케이스 등록이 한꺼번에 확정되므로 API 표면 합의를 건너뛸 수 없다.
3. **둘 이상 등급에 걸치면 높은 쪽.** "버그 수정인데 prop 시그니처가 바뀐다"는 L0이 아니라 그 시그니처 변경의 등급이다.
4. **애매하면 등급을 올려서 묻지 않는다.** 어느 축이 애매한지 **한 문장으로** 사용자에게 묻는다. 등급 인플레이션은 L0/L1의 속도를 죽인다.
5. **판정 결과를 한 줄로 선언한다**: `등급: L1 — optional prop 추가, 공개 표면 additive`
6. **작업 중 등급이 올라가면 멈추고 재판정을 선언한다.** L1인 줄 알았는데 prop 개명이 필요해진 것을 발견하면, 조용히 계속하지 않는다.

### 판정 예시

| 요청 | 등급 | 왜 |
|---|:-:|---|
| "Button hover 색이 좀 진해요" | L0 | `--comp-button-hover-*` **값**만 바뀐다. 이름은 그대로 |
| "Button에 `fullWidth` 추가해줘" | L1 | optional prop, additive |
| "Badge에 `teal` 색 추가" | L1 | as const 배열에 값 추가 — additive |
| "Dialog 만들어줘" | L2 | 새 export |
| "Kbd 같은 작은 거 하나만" | **L2** | 작아도 새 export다 (규칙 2) |
| "`iconLeading`을 `startIcon`으로 바꾸자" | L3 | prop 개명 |
| "밀도 토큰 만들자" | L3 | 새 공개 토큰 신설 |
| "Tab 인디케이터 애니메이션이 끊겨요" | L0 | 내부 구현. 단, 고치다 prop이 필요해지면 재판정 |

---

## L0 — 바로 구현

구현 → [`/verify`](../05-verify/SKILL.md).

합의 단계가 없다. 그것이 L0의 존재 이유다.

## L1 — 계약 요약 한 단락

구현 **전에** 한 단락으로 제시하고 확인을 받는다. 축마다 따로 묻지 않는다.

```
추가: Button.fullWidth?: boolean (기본 false)
기존 동작 불변: false일 때 현재와 동일한 클래스가 나온다. 기존 소비자는 이 prop을 모른다.
토큰: 새 토큰 불필요 — w-full로 충분
```

그 다음 [`/implement`](../03-implement/SKILL.md)의 규칙을 따라 구현하고 `/verify`.

## L2 — 4-Phase 전체

신규 컴포넌트와 구조 변경. 각 Phase 완료 후 확인을 받고 다음으로 간다.

### 시작 — 상태 확인

1. `specs/{name}.json` 존재 여부
2. `src/components/{Name}/{Name}.tsx` 존재 여부
3. `src/showcase/{Name}Showcase.tsx` 존재 여부

| specs | 소스 | 쇼케이스 | → 시작 Phase |
|:-:|:-:|:-:|:-:|
| ✗ | ✗ | ✗ | **Phase 1** |
| 시각만 | ✗ | ✗ | **Phase 2** |
| 완성 | ✗ | ✗ | **Phase 3** |
| 완성 | ✓ | ✗ | **Phase 4** |
| 완성 | ✓ | ✓ | **Verify** |

### 합의 축 — Phase 1 전에 **짧게** 확인받는다

문서를 쓰는 게 목적이 아니라 **어긋난 전제를 구현 전에 드러내는 것**이 목적이다. 각 축 한 단락이면 충분하고, 확인은 **한 번**만 받는다.

1. **Purpose** — 이 컴포넌트가 푸는 문제 한 문장. 기존 컴포넌트로 안 되는 이유 한 문장. *(기존 확장으로 충분하면 여기서 멈추고 L1로 내린다)*
2. **API 표면** — export 이름, props(이름·타입·기본값), variant 축. **이름은 [ANATOMY.md](../../../docs/ANATOMY.md)의 표준 어휘를 쓴다** — 표에 없는 파트 이름을 새로 만들면 그 이름부터 합의한다.
3. **Edge** — 빈 값·overflow·loading·error·disabled에서 각각 무엇이 보이는가. **"해당 없음"도 답이다 — 빈칸으로 두지 않는다.**
4. **A11y** — role, 키보드 경로, 포커스 이동, aria 계약. interactive면 이 축을 건너뛸 수 없다.
5. **Token** — 기존 semantic/`--comp-*`로 충분한가. **새 공개 토큰이 필요하면 그 순간 L3다.**
6. **높이** (interactive에 한함) — 허용 집합 `20·24·28·32·36·40·48·56` 안인가. **레일이 컨트롤이면 아이템 + 패딩×2로 잰다.** 근거는 [RFC 컨트롤 높이](../../../docs/rfcs/2026-09-control-height.md). 확정한 높이는 `src/testing/tokenContract.test.ts`의 `CONTROLS`에 등록한다 — **등록하지 않으면 검사가 이 컴포넌트를 보지 않는다.**

### 구조 판정 — 근거를 한 단락 남긴다

**0. 기존 확장이 먼저다.** 시각·행동이 기존과 **같은 축 위의 변형**이면 확장, **다른 계약**이면 신규.

**1. Simple vs Compound** — sub-component 2개 이상 **그리고** 다음 중 하나면 compound:
- Root–Sub 간 상태/설정 공유 → **stateful** (Context)
- 묶인 호출 표면이 DX를 분명히 개선 → **stateless** (`Object.assign`만)

**2. Radix vs 자체 구현** — 포커스 트랩·키보드 내비게이션·layering이 복잡하면 Radix, 시각적 변형만이면 자체 구현.

| 갈래 | 이 저장소의 레퍼런스 |
|---|---|
| Simple | `BadgeLabel` |
| Interactive simple | `SegmentBar` |
| Stateful compound | `Tab` |
| Radix 완전 래핑 | `Tooltip` · `Callout` |
| Radix 부분 활용 | `Button` (Slot만) |
| 직접 키보드 구현 | `NavVertical` |

> 상세 판단 기준은 [ADVANCED_PATTERNS.md](../../../docs/ADVANCED_PATTERNS.md)와 [DESIGN_PRINCIPLES.md §A](../../../docs/DESIGN_PRINCIPLES.md)가 소유한다.

### Phase 1~4

| Phase | 스킬 | 완료 기준 |
|:-:|---|---|
| 1. Visual Spec | [`/visual-spec`](../01-visual-spec/SKILL.md) | `specs/{name}.json`에 시각 섹션 |
| 2. Behavior Spec | [`/behavior-spec`](../02-behavior-spec/SKILL.md) | props·states·**a11y**·implementation 완성 |
| 3. Implement | [`/implement`](../03-implement/SKILL.md) | 토큰 + 컴포넌트 + 등록 + `npm run check` |
| 4. Showcase | [`/showcase`](../04-showcase/SKILL.md) | `{Name}Showcase.tsx` + `{COMPONENT}_TOC` |
| Verify | [`/verify`](../05-verify/SKILL.md) | 검증 리포트 |

각 Phase 완료 후 체크포인트: "…가 완료되었습니다. 다음으로 진행할까요?"

## L3 — RFC → 승인 → 구현

**승인 전에 코드를 만들지 않는다.** 만들어놓고 사후 승인을 받는 것이 L3가 막으려는 실패다.

1. [`docs/rfcs/TEMPLATE.md`](../../../docs/rfcs/TEMPLATE.md)를 복사해 `docs/rfcs/{YYYY-MM}-{주제}.md` 작성
2. 목차를 그대로 따른다 — 특히 **§2 선택지**에 "아무것도 하지 않음"을 넣고, **§5 영향 범위**에 공개 표면 diff를 수치로 집계한다
3. 사용자의 **명시적 승인**을 받는다
4. 구현 → `/verify`
5. RFC의 상태를 **확정**으로 바꾸고 §6 검증 결과를 채운다

선례: [RFC 컨트롤 높이](../../../docs/rfcs/2026-09-control-height.md) — "토큰을 만들지 **않기로** 한 결정"도 기록 대상이다. 기록이 없으면 다음 사람이 같은 논의를 다시 한다.

---

## 절차를 우회하고 싶을 때

1. **무단 우회 금지.** "빨리 하려고"는 사유가 아니다 — 빠른 경로가 필요하면 L0/L1로 **정당하게 판정되면** 된다.
2. **명시적 waiver는 허용.** 사용자가 생략을 지시하면 따르되 [DEVIATIONS.md](../../../docs/DEVIATIONS.md)에 한 줄로 기록한다. waiver는 그 작업 **1회에만** 유효하다.
3. **Pain note.** 절차를 지켰는데 비용이 작업 가치보다 커 보였다면 우회하는 대신 기록한다. pain note는 **이 등급표를 고치는 입력**이다 — 같은 pain이 3회 쌓이면 표를 고친다.

형식과 기록 위치는 [DEVIATIONS.md](../../../docs/DEVIATIONS.md)의 "절차 이탈" 절이 소유한다.

> 이 스킬 자체를 고치는 작업도 같은 규칙을 따른다 — 등급표 변경은 L1(additive)/L2(구조 변경)로 판정하고, pain note가 근거로 쌓였는지 본다.

---

## 이 스킬이 전제하는 것

| 필요한 것 | 문서 |
|---|---|
| 코딩 컨벤션, 토큰 규칙, 테스트 컨벤션 | [CLAUDE.md](../../../CLAUDE.md) |
| 파트 이름 표준 | [ANATOMY.md](../../../docs/ANATOMY.md) |
| 검증 범위와 명령 | [`/verify`](../05-verify/SKILL.md) |
| 설계 판단 기준 | [DESIGN_PRINCIPLES.md](../../../docs/DESIGN_PRINCIPLES.md) |
| 이탈·waiver·pain note | [DEVIATIONS.md](../../../docs/DEVIATIONS.md) |
| 결정의 기록 | [docs/rfcs/](../../../docs/rfcs/) |

---

## 아직 없는 것 — 해소되면 이 절을 지운다

- **시각 회귀 검사가 없다.** `cssContract`는 빌드 CSS에서 선언의 **위치**를 보고, `tokenContract`는 소스에서 **값**을 본다. *의도치 않은 시각 변화 전반*은 잡지 못한다. 이 축은 여전히 육안이며, PR 본문에 확인한 테마를 명시한다.
- **Figma 대조가 자동화돼 있지 않다.** 스펙의 값이 Figma와 맞는지는 사람이 본다. 실제로 `specs/segment-bar.json:125`의 패딩(4px)과 `tokens.css`(2px)가 어긋난 채 남아 있다.
