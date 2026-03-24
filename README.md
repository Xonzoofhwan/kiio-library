# kiio-library

React 19 + TypeScript 디자인 시스템 라이브러리.
Figma 디자인을 구조화된 JSON 스펙으로 변환하고, 일관된 토큰 아키텍처 위에 컴포넌트를 구축합니다.

## Tech Stack

| 영역 | 기술 |
|------|------|
| Framework | React 19, TypeScript |
| Styling | Tailwind CSS 3, CVA (class-variance-authority), cn (clsx + tailwind-merge) |
| Build | Vite |
| Font | Pretendard Variable |
| Polymorphic | @radix-ui/react-slot (asChild 패턴) |

## Quick Start

```bash
npm install        # 의존성 설치
npm run dev        # 개발 서버 (http://localhost:5173)
npm run build      # 프로덕션 빌드
npm run lint       # ESLint 실행
```

## Token Architecture

3-layer 토큰 시스템: **Primitive → Semantic → Component**

모든 토큰은 TypeScript 객체, CSS custom property, Tailwind utility로 존재합니다.

```
Primitive (raw values)
├── Color       23 families × 14 shades = 322 tokens
├── Spacing     36 steps (px, 0–96)
├── Radius      23 steps (px, 0–24)
├── Duration    5 values (0–500ms)
└── Easing      4 curves

Semantic (theme-aware mappings)
├── Color       Primary, Success, Warning, Error, Neutral, Background, Divider, Text, State
├── Duration    instant, fast, normal, slow, slower
└── Easing      enter, exit, move, linear

Component (role-specific)
└── --comp-{name}-{property}-{variant}[-{state}]
```

| Layer | CSS Prefix | Scope | 테마 전환 |
|-------|-----------|-------|----------|
| Primitive | `--primitive-*` | `:root` | 불변 |
| Semantic | `--semantic-*` | `[data-theme]` | Light/Dark |
| Component | `--comp-*` | 색상: `[data-theme]`, 크기: `:root` | 혼합 |

테마 전환은 `data-theme="light"` / `data-theme="dark"` 속성으로 제어됩니다.

## Components

| 컴포넌트 | 상태 | 설명 |
|---------|------|------|
| Tooltip | 완료 | 4 variants, 4 sides, 3 sizes, arrow, shadow |
| Callout | 완료 | 4 variants, 4 sides, 3 sizes, arrow, close, action |

## Project Structure

```
kiio-library/
├── src/
│   ├── components/          # React 컴포넌트
│   │   ├── Tooltip/
│   │   ├── Callout/
│   │   └── showcase-layout/ # 쇼케이스 레이아웃 (Sidebar, TOC)
│   ├── showcase/            # 쇼케이스 페이지
│   │   ├── TokenShowcase.tsx
│   │   └── token-sections/  # 토큰 시각화 섹션 6개
│   ├── tokens/              # 디자인 토큰
│   │   ├── primitive.ts     # Primitive 색상
│   │   ├── semantic.ts      # Semantic 색상 (light/dark)
│   │   ├── numbers.ts       # Spacing & Radius
│   │   ├── typography.ts    # 15 sizes × 4 weights
│   │   ├── motion.ts        # Duration & Easing
│   │   └── tokens.css       # CSS custom properties
│   └── lib/utils.ts         # cn() utility
├── specs/                   # 컴포넌트 JSON 스펙
├── docs/                    # 설계 문서
└── tailwind.config.js
```

## Documentation

| 문서 | 설명 |
|------|------|
| [CLAUDE.md](./CLAUDE.md) | 핵심 규칙, 토큰 참조, 컴포넌트 컨벤션 |
| [DESIGN_PRINCIPLES.md](./docs/DESIGN_PRINCIPLES.md) | 디자인 판단 원칙, API 설계 |
| [COMPONENT_PATTERNS.md](./docs/COMPONENT_PATTERNS.md) | CVA+cn, Icon, Loading, asChild 패턴 |
| [INTERACTION_DESIGN.md](./docs/INTERACTION_DESIGN.md) | 모션 원칙, 상태 전이, 피드백 패턴 |
| [TOKEN_LAYER_RULES.md](./docs/TOKEN_LAYER_RULES.md) | 토큰 레이어 배치 판단 규칙 |
| [FIGMA_TO_CODE.md](./docs/FIGMA_TO_CODE.md) | Figma→Code 워크플로 |
| [token-reference.md](./docs/token-reference.md) | 토큰 전체 값, CSS 변수, Tailwind 매핑 |
| [COMPONENT_CHECKLIST.md](./docs/COMPONENT_CHECKLIST.md) | 컴포넌트 개발 체크리스트 |
| [ROADMAP.md](./docs/ROADMAP.md) | 컴포넌트 개발 로드맵 |

## Workflow

컴포넌트 개발은 4-phase 스킬 시스템으로 진행됩니다:

1. **Visual Spec** — Figma 기반 시각 스펙 JSON 작성
2. **Behavior Spec** — Props, States, 구현 계획 정의
3. **Implement** — 토큰 + 컴포넌트 구현 + 빌드 검증
4. **Showcase** — 쇼케이스 페이지 생성 + 전체 검증
