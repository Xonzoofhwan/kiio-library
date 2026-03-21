---
description: "스킬 구조 건강성 점검 및 리구조화 (Skill Metabolism). 다음 상황에서 활성화: (1) lesson-learnings Active 항목 10개 이상 축적, (2) SKILL.md 또는 참조 파일이 비대화, (3) 분기별 정기 점검, (4) 사용자가 /skill-metabolism 호출"
---

# Skill Metabolism — 스킬 자가 발전 프로세스

> **Version:** 1.0.0 | **Last Updated:** 2026-03-12

스킬의 지식 신진대사를 관리한다. Active 레슨(섭취) → Embedded(흡수) → Enforced(체화) 라이프사이클과 스킬 구조의 건강성을 점검·재구조화한다.

## 파이프라인 위치

```
Session work → /session-retrospective → lesson-learnings.md (Active 축적)
                                              ↓ (트리거 조건 충족 시)
                                        /skill-metabolism
                                              ├── 건강성 점검 (Health Audit)
                                              ├── 레슨 졸업 배치 (Graduation Batch)
                                              ├── 파일 재구조화 (Restructuring)
                                              └── 전후 지표 비교 (Metrics)
```

---

## 리구조화 트리거

| # | 트리거 | 임계값 | 점검 시점 |
|---|--------|--------|-----------|
| 1 | SKILL.md 비대화 | body 500줄 초과 | 매 수정 시 |
| 2 | 참조 파일 비대화 | 300줄 초과+TOC 없음, 또는 500줄 초과 | 매 수정 시 |
| 3 | Active 레슨 축적 | 10개 이상 | push 전 회고 시 |
| 4 | 신규 지식 범주 | 기존 폴더 분류에 안 맞는 항목 3개 이상 | 회고 시 |
| 5 | 분기별 정기 점검 | 3개월마다 | 캘린더 |
| 6 | 참조 깊이 초과 | nested reference 2단계 이상 | 매 수정 시 |
| 7 | 폴더 간 내용 중복 | 동일 주제가 2개 이상 파일에 분산 | 리뷰 시 |

---

## 실행 프로세스

### Phase 1: 감지 — 트리거 확인

대상 스킬 디렉토리에서 `wc -l`로 파일별 줄 수를 수집하고, 트리거 조건 충족 여부를 판단한다.

### Phase 2: 진단 — Health Audit

[health-audit-checklist.md](references/health-audit-checklist.md)의 4영역 체크리스트를 실행한다.

### Phase 3: 계획 — 리구조화 패턴 선택

진단 결과에 따라 [restructuring-playbook.md](references/restructuring-playbook.md)에서 해당 패턴을 선택하고 Plan을 작성한다. MUST Plan 승인 후 실행.

### Phase 4: 실행 — 리구조화 수행

Plan 승인 후 파일 분할, 레슨 졸업, 가이드 병합 등을 수행한다.

### Phase 5: 검증 — 전후 지표 비교

리구조화 전후의 건강성 지표를 비교하여 개선을 확인한다.

---

## 건강성 지표

| 지표 | 측정 방법 | 목표 |
|------|-----------|------|
| SKILL.md 줄 수 | `wc -l SKILL.md` | ≤ 500줄 (이상: ≤ 200줄) |
| 300줄 초과 파일 수 | `wc -l` + TOC 유무 | 모두 TOC 보유 |
| 500줄 초과 파일 수 | `wc -l` | 0개 (분할 대상) |
| Active 레슨 비율 | Active / 전체 레슨 | ≤ 40% |
| nested reference 깊이 | 참조 파일 내 참조 추적 | ≤ 1단계 |
| 중복 주제 수 | 수동 점검 | 0건 |

---

## 레슨 졸업 배치 프로세스

> Active 레슨 10개 이상이면 이 프로세스를 실행한다.

### 절차

1. Active 항목 전체 스캔
2. 각 항목에 대해 졸업 판단:

| 조건 | 결정 |
|------|------|
| 3회 이상 정상 적용 + 관련 가이드 존재 | → 가이드에 통합, **Embedded** 졸업 |
| 3회 이상 정상 적용 + 단독 패턴 | → anti-pattern-checklist에 추가, **Embedded** |
| 텍스트 규칙으로 3회 이상 실패 (방지 실패) | → **Enforced** 승격 검토 |
| 1~2회만 적용 or 특수 상황 | → **Active 유지** (과잉 일반화 방지) |

3. 졸업 아카이브 표에 1줄 요약 추가
4. Active 항목 수가 8개 이하가 될 때까지 반복

---

## 스킬 성숙도 모델

| 단계 | 특징 | 전환 신호 |
|------|------|-----------|
| **Bootstrap** | 단일 SKILL.md, 50줄 이하 | 200줄 초과 또는 카테고리 3개+ 출현 |
| **Growth** | 하위 폴더 분리, 레슨 축적 중 | Active 10개+ 또는 총 3000줄 초과 |
| **Restructure** | 임계값 돌파 → 재구조화 필요 | 리구조화 완료 후 |
| **Optimization** | progressive disclosure 튜닝, 토큰 효율 최적화 | 3개월간 구조 변경 없음 |
| **Maintenance** | 정기 건강 점검만 수행 | 안정 상태 |

---

## 컨텍스트 엔지니어링 원칙 Quick Reference

> 상세: [anthropic-skill-principles.md](references/anthropic-skill-principles.md)

| # | 원칙 | 체크 |
|---|------|------|
| 1 | description이 유일한 트리거 (body에 "when to use" 금지) | □ |
| 2 | SKILL.md body ≤ 500줄 | □ |
| 3 | SKILL.md = TOC 역할, 상세는 참조 파일에 | □ |
| 4 | 300줄+ 참조 파일은 상단에 Index/TOC | □ |
| 5 | nested reference 1단계 이하 | □ |
| 6 | "MUST" > "always" (준수율 향상) | □ |
| 7 | body에 검증 루프 포함 | □ |
| 8 | Claude가 이미 아는 것은 설명 안 함 — 코드 예시 + expected output | □ |
| 9 | 동적 컨텍스트 로딩 (Index 먼저 읽고 drill down) | □ |
