# Component Development Checklist

> 모든 컴포넌트 구현 시 일관성과 품질을 보장하기 위한 체크리스트.
> 코드 패턴은 [COMPONENT_PATTERNS.md](./COMPONENT_PATTERNS.md),
> 토큰 규칙은 [CLAUDE.md](../CLAUDE.md) §Token Architecture,
> 접근성 심화는 [DESIGN_PRINCIPLES.md](./DESIGN_PRINCIPLES.md) 참고.

---

## Design Fidelity
- [ ] JSON spec created in `specs/` folder
- [ ] All Figma variants documented in spec
- [ ] All sizes match exact Figma padding/typography
- [ ] Token mapping complete (colors, spacing, typography)
- [ ] Border radius and shadows documented

## Implementation
- [ ] Component created in `src/components/{Name}/`
- [ ] CVA used for variant management
- [ ] cn (from @/lib/utils) used for class merging
- [ ] Extends appropriate React HTML element props
- [ ] All variants from JSON spec implemented
- [ ] All states implemented (hover, focus, active, disabled)
- [ ] Icon handling (if applicable) follows patterns
- [ ] Loading state (if applicable) implemented correctly

## Theme Support
- [ ] Uses only semantic tokens for colors (no primitive tokens)
- [ ] Uses only semantic tokens for motion (`duration-fast`, `ease-enter` — no `duration-100`, `ease-out`)
- [ ] Tested with `data-theme="brand1"`
- [ ] Tested with `data-theme="brand2"`
- [ ] No theme-specific logic in component code

## Accessibility
- [ ] **시맨틱 HTML**: 올바른 요소 사용 (`<button>`, `<input>`, `<dialog>` — `<div>` 아님)
- [ ] **Role 부여 판단**: 네이티브 HTML 요소로 해결 가능하면 `role` 추가 금지
- [ ] **Focus 관리**:
  - `focus-visible` 사용 (`focus` 아님) — 키보드 전용 포커스 링
  - 포커스 링 스타일 통일 (전 컴포넌트 동일)
  - 탭 순서 논리적
- [ ] **키보드 내비게이션**:
  - Enter/Space: 버튼·링크 활성화
  - Arrow keys: 그룹 내 이동 (탭, 라디오, 메뉴)
  - Escape: 오버레이 닫기
- [ ] **ARIA 속성**:
  - `aria-disabled`: 로딩 상태 (`disabled` attribute는 탭 순서에서 제거하므로 주의)
  - `aria-busy`: 로딩 상태
  - `aria-invalid` + `aria-describedby`: 폼 에러
  - `aria-expanded`: 펼침/접힘 패턴
  - `aria-label` / `aria-labelledby`: 시각적 레이블 없을 때
- [ ] **색상 대비**: WCAG AA 충족 (일반 텍스트 4.5:1, 큰 텍스트 3:1)
- [ ] **모션**: `prefers-reduced-motion` 대응 (필수 애니메이션은 `.motion-essential` 클래스 사용)

## TypeScript
- [ ] Props interface defined and exported
- [ ] JSDoc comments on all props
- [ ] Proper types (no `any`)
- [ ] Component function exported

## File Organization
- [ ] Component file: `{Name}.tsx`
- [ ] Barrel export: `index.ts`
- [ ] Both interface and component exported from index

## Testing
- [ ] All size combinations tested
- [ ] All variant combinations tested
- [ ] All states tested (hover, focus, disabled, etc.)
- [ ] Icons scale correctly with size (if applicable)
- [ ] Loading state works (if applicable)
- [ ] Works with and without optional props
- [ ] No console errors or warnings

## Code Quality
- [ ] No hardcoded values (colors, spacing, fonts, duration, easing)
- [ ] No inline styles
- [ ] No magic numbers
- [ ] No `transition-all` (use specific transition properties)
- [ ] Follows patterns from CLAUDE.md
- [ ] Consistent with existing components
