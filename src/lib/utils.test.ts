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
