---
name: commit
description: "변경 사항 분석 → 빌드 검증 → 작업 단위 분리 → Conventional Commit 메시지 생성 → 커밋/푸시/PR"
argument-hint: "[push?]"
---

# Commit — 커밋 자동화

변경 사항을 분석하여 커밋 메시지를 자동 생성하고, git add → commit → push → PR까지 안내한다.

**입력**: `$ARGUMENTS` — `push`를 포함하면 커밋 후 push까지 진행

---

## Step 0 — 사전 검사

커밋 전 반드시 확인해야 할 항목을 검사한다.

### 빌드 검증
```bash
npm run build
```
- 실패 시 **중단** — 에러 내용을 사용자에게 리포트
- 성공해야만 다음 단계로 진행

### 보안 파일 스캔

staged/unstaged 파일 목록에서 다음을 검사:
- `.env*`, `credentials.*`, `*secret*` 패턴 파일
- API 키, 토큰 등 시크릿이 포함된 코드
- 대용량 바이너리 파일 (이미지, 폰트, 영상 등)

발견 시:
- 사용자에게 **경고** 표시
- 해당 파일을 staging에서 제외할 것을 권고
- 사용자가 명시적으로 포함을 원하지 않는 한 커밋하지 않음

---

## Step 1 — 브랜치 안전 확인

```bash
git branch --show-current
```

- **`main` 또는 `master` 브랜치인 경우**:
  - 경고: "현재 main 브랜치입니다. 새 브랜치를 만들까요?"
  - 브랜치명 자동 제안 (변경 내용 기반, 예: `feat/add-tooltip-component`)
  - 사용자가 원하면 main에서 직접 진행 가능하지만 권장하지 않음
- **그 외 브랜치**: 그대로 진행

---

## Step 2 — Diff 분석 및 작업 단위 분리

```bash
git status --short
git diff --cached
git diff
```

변경 사항 전체를 분석하여 **논리적 작업 단위**로 분리한다.

### 분리 기준
- **다른 컴포넌트** = 다른 커밋
- **토큰 변경 + 해당 토큰을 사용하는 컴포넌트** = 하나의 커밋
- **스펙 파일 + 구현** = 규모에 따라 하나 또는 분리
- **문서 업데이트** = 별도 커밋
- **빌드 설정/도구 변경** = 별도 커밋

### 금지 사항
- 무의미한 기계적 분리 금지 (예: 파일 단위로 1커밋씩)
- 논리적으로 연관된 변경을 분리하면 안 됨

### 사용자 확인

분리 결과를 다음 형식으로 제시하고 사용자 확인을 받는다:

```markdown
## 커밋 1: feat: add Tooltip component with 3 size variants

### 포함 파일
- src/components/Tooltip/Tooltip.tsx
- src/components/Tooltip/index.ts
- src/tokens/tokens.css (Tooltip 토큰 추가 부분)

### 변경 내용 요약
Tooltip 컴포넌트를 3가지 사이즈(sm, md, lg)로 구현. 컴포넌트 토큰을 tokens.css에 추가.

---

## 커밋 2: docs: update CLAUDE.md with Tooltip status

### 포함 파일
- CLAUDE.md

### 변경 내용 요약
프로젝트 현황에 Tooltip 완료 상태를 반영.
```

---

## Step 3 — 커밋 메시지 생성

### 형식: Conventional Commits

```
type: description

body (선택)

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

### Type

| Type | 설명 |
|------|------|
| `feat` | 새로운 기능 추가 |
| `fix` | 버그 수정 |
| `refactor` | 리팩토링 |
| `docs` | 문서 변경 |
| `chore` | 기타 변경 (설정, 의존성 등) |

### 규칙
- **description**: 영어, 명령형 현재형 ("add" not "added"), 소문자 시작, 마침표 없음, 50자 이내
- **scope**: 사용하지 않음 (단일 패키지)
- **body**: 한국어, 변경의 동기/이유 설명 (선택, "why" not "what")
- **footer**: 항상 `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>` 포함

---

## Step 4 — 커밋 실행

작업 단위별로 순차 실행한다:

### 각 작업 단위마다:

1. **명시적 파일 staging**
   ```bash
   git add src/components/Tooltip/Tooltip.tsx
   git add src/components/Tooltip/index.ts
   ```
   - `git add -A` 또는 `git add .` 절대 금지
   - 해당 작업 단위에 포함된 파일만 개별 지정

2. **최종 확인**
   ```bash
   git diff --cached
   ```
   - staged 내용에 시크릿/의도하지 않은 파일이 없는지 확인

3. **커밋**
   ```bash
   git commit -m "$(cat <<'EOF'
   feat: add Tooltip component with 3 size variants

   Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
   EOF
   )"
   ```
   - HEREDOC 형식으로 메시지 전달 (포맷 보존)

4. **결과 리포트**
   ```
   ✓ 커밋 1 완료: feat: add Tooltip component with 3 size variants
   ```

5. 다음 작업 단위로 반복 (add → commit → add → commit → ...)

---

## Step 5 — Push 및 PR

### 커밋 완료 후

```bash
git status
```

모든 변경이 커밋되었는지 확인.

### Push

- `$ARGUMENTS`에 `push`가 포함된 경우 → 자동으로 push 진행
- 그렇지 않으면 사용자에게 push 여부를 질문

```bash
git push -u origin <현재 브랜치>
```

### PR 생성

push 완료 후 PR 생성 여부를 사용자에게 질문.

사용자가 원하면:
```bash
gh pr create --title "feat: add Tooltip component" --body "$(cat <<'EOF'
## Summary
- Tooltip 컴포넌트 3가지 사이즈로 구현
- 컴포넌트 토큰 추가

## Test plan
- [ ] 브라우저에서 모든 variant/size 시각 확인
- [ ] 테마 전환 확인 (해당 시)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

## 참조

- **CLAUDE.md**: Git Safety Rules, 커밋 메시지 컨벤션
- **빌드 명령**: `npm run build` = `tsc -b && vite build`
- **금지 사항**: `--force` push, `--no-verify`, `.env*` 커밋, `node_modules/`/`dist/` 커밋
