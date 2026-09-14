import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'
import { numbers } from '@/tokens/numbers'
import { motion } from '@/tokens/motion'

/**
 * tailwind-merge 는 **Tailwind 기본 스케일만** 안다.
 *
 * 이 저장소는 그 위에 자체 스케일을 얹었다 — `typography-{size}-{weight}` 플러그인, 숫자
 * radius(`rounded-2`), 이름 붙인 duration·easing(`duration-fast`·`ease-enter`). 등록하지 않으면
 * tailwind-merge 가 이들을 서로 **다른 그룹**으로 보고 둘 다 남긴다. 그러면 마지막에 온 클래스가
 * 이긴다는 `cn()` 의 계약이 깨진다 — 컴포넌트는 전부 `cn(variants(...), className)` 순서로
 * 부르므로, 소비자가 넘긴 className 이 조용히 무시된다(2026-09-13 실측).
 *
 * 스케일 목록을 여기 리터럴로 적지 않고 토큰 모듈에서 가져오는 이유: 값이 두 곳에 있으면
 * 토큰이 바뀔 때 한쪽만 갱신되고, 그 어긋남은 아무 검사도 잡지 못한다.
 * `src/lib/utils.test.ts` 가 각 축의 충돌 해결을 잠근다.
 *
 * **버전 주의**: `tailwind-merge` 는 v3 부터 Tailwind v4 의 클래스 사전을 쓴다. 이 저장소는
 * Tailwind 3.4 이므로 공식 호환 버전인 **2.6.0** 에 고정한다(라이브러리 README 의 안내).
 */
// 제네릭 인자가 **새로 만드는 클래스 그룹 id** 다. 선언하지 않으면 `extend` 가 기본 그룹만
// 받으므로 `typography` 가 타입에서 거부된다(런타임은 동작해 빌드에서만 드러난다).
const twMerge = extendTailwindMerge<'typography'>({
  extend: {
    theme: {
      // `rounded-px` · `rounded-0.5` · `rounded-24` … numbers.ts 가 단일 소스다.
      borderRadius: Object.keys(numbers.radius),
    },
    classGroups: {
      /**
       * `typography-{size}-{weight}` — 한 클래스가 font-size · line-height · letter-spacing ·
       * font-weight 넷을 한꺼번에 설정한다.
       *
       * 사이즈 목록을 열거하지 않고 형태로 판정하는 이유: 타이포 스케일이 늘어도 이 파일을
       * 고칠 필요가 없다. 존재하지 않는 사이즈(`typography-99-bold`)까지 매칭되지만 Tailwind 가
       * 그 클래스를 생성하지 않으므로 무해하고, 그런 오타는 `tokenContract` 의 몫이다.
       */
      typography: [
        { typography: [(value: string) => /^\d{1,2}-(regular|medium|semibold|bold)$/.test(value)] },
      ],
      // 기본 그룹에 우리 이름을 **더한다**. 숫자 duration(`duration-150`)과 arbitrary 는 그대로 산다.
      duration: [{ duration: Object.keys(motion.semantic.duration) }],
      ease: [{ ease: Object.keys(motion.semantic.easing) }],
    },
    conflictingClassGroups: {
      /**
       * 방향이 하나인 것이 핵심이다.
       *
       * `typography-*` 가 **뒤에** 오면 앞의 개별 지정을 지운다 — 넷을 한꺼번에 덮기 때문이다.
       * 반대로 `font-bold` 가 뒤에 오면 둘 다 남는다. 그것은 "이 타이포에 굵기만 bold" 라는
       * 부분 덮어쓰기이고, 여기서 typography 를 지우면 크기·행간까지 함께 사라진다.
       */
      typography: ['font-size', 'leading', 'tracking', 'font-weight'],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
