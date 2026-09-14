import { describe, expect, it } from 'vitest'
import { cn } from './utils'

/**
 * `cn()` 은 이 라이브러리의 모든 컴포넌트가 className 을 합성하는 통로다.
 * 충돌 해결이 깨지면 소비자가 넘긴 className 이 조용히 무시되거나 반대로
 * variant 스타일을 덮어써서, 어느 쪽이든 시각 결함이 원인 없이 나타난다.
 */
describe('cn', () => {
  describe('Tailwind 충돌 해결', () => {
    it('같은 그룹의 클래스는 뒤에 온 것이 이긴다', () => {
      expect(cn('p-4', 'p-2')).toBe('p-2')
    })

    it('소비자 className 이 variant 스타일을 덮어쓴다', () => {
      // 컴포넌트는 항상 cn(variants(...), className) 순서로 부른다.
      expect(cn('bg-semantic-background-0', 'bg-semantic-background-50')).toBe(
        'bg-semantic-background-50',
      )
    })

    it('다른 그룹의 클래스는 함께 남는다', () => {
      expect(cn('p-4', 'text-center')).toBe('p-4 text-center')
    })
  })

  describe('프로젝트 커스텀 스케일의 충돌 해결', () => {
    // tailwind-merge 는 **Tailwind 기본 스케일만** 안다. 이 저장소는 typography 를 플러그인으로
    // 만들고 radius·duration·easing 을 커스텀 이름으로 바꿨는데, 등록하지 않으면 그 클래스들이
    // 같은 속성을 다투면서도 "다른 그룹"으로 취급돼 둘 다 남는다. 소비자가 뒤에 넘긴 스타일이
    // 이기지 않으므로 className override 계약이 깨진다(2026-09-13 실측).
    it('typography 토큰은 뒤에 온 것만 남는다', () => {
      expect(cn('typography-14-semibold', 'typography-16-regular')).toBe('typography-16-regular')
    })

    it('typography 토큰이 앞선 font-size·leading·tracking·font-weight 를 덮는다', () => {
      // typography-* 한 클래스가 네 속성을 한꺼번에 설정하므로, 앞의 개별 지정은 남을 이유가 없다.
      expect(cn('text-lg leading-8 tracking-wide font-bold', 'typography-14-medium')).toBe(
        'typography-14-medium',
      )
    })

    it('반대 방향은 둘 다 남는다 — 개별 속성은 typography 를 부분적으로만 덮는다', () => {
      // `typography-14-medium font-bold` 는 "14 크기·행간·자간에 굵기만 bold" 라는 뜻이다.
      // 여기서 typography 를 지우면 크기까지 사라져 의도와 달라진다.
      expect(cn('typography-14-medium', 'font-bold')).toBe('typography-14-medium font-bold')
    })

    it('숫자 radius 스케일에서 뒤에 온 것만 남는다', () => {
      expect(cn('rounded-2', 'rounded-4')).toBe('rounded-4')
      expect(cn('rounded-none', 'rounded-2')).toBe('rounded-2')
      // 토큰 arbitrary 값과 기본 키워드가 섞여도 마찬가지다.
      expect(cn('rounded-[var(--comp-button-radius-md)]', 'rounded-full')).toBe('rounded-full')
    })

    it('semantic duration·easing 이름에서 뒤에 온 것만 남는다', () => {
      expect(cn('duration-fast', 'duration-normal')).toBe('duration-normal')
      expect(cn('ease-enter', 'ease-exit')).toBe('ease-exit')
    })

    it('서로 다른 속성끼리는 함께 남는다 — 과하게 지우지 않는다', () => {
      expect(cn('duration-fast', 'ease-enter')).toBe('duration-fast ease-enter')
      expect(cn('rounded-2', 'typography-14-medium')).toBe('rounded-2 typography-14-medium')
    })
  })

  describe('조건부 클래스', () => {
    it('false·null·undefined 는 제거된다', () => {
      // 리터럴 false 를 직접 쓰면 상수식으로 잡히므로 변수를 거친다.
      const off = false
      expect(cn('base', off && 'x', null, undefined)).toBe('base')
    })

    it('객체 문법에서 true 인 키만 남는다', () => {
      expect(cn('base', { on: true, off: false })).toBe('base on')
    })
  })
})
