/**
 * Vitest 전역 셋업.
 *
 * **이 디렉터리는 라이브러리 표면이 아니다.** `src/testing/**` 은 어떤 컴포넌트
 * `index.ts` 에서도 export 하지 않으며 테스트에서만 쓴다.
 */
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
})

/**
 * jsdom 에 없는 브라우저 API 를 채운다.
 *
 * 폴리필이 없으면 컴포넌트가 렌더 중에 던져서, **접근성·키보드 계약 대신
 * 폴리필 부재를 검사하는 테스트**가 된다. 무엇을 채웠는지 여기 모아 둔다.
 */

// matchMedia — reduced-motion / pointer 질의. 기본값은 "일치하지 않음"이다.
if (!window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia
}

// ResizeObserver — Tab 의 스크롤 페이드, Radix 오버레이 위치 계산에 쓰인다.
if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver
}

// Radix 오버레이가 요구하는 포인터 캡처 API. jsdom 에 없다.
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false
  Element.prototype.setPointerCapture = () => {}
  Element.prototype.releasePointerCapture = () => {}
}

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {}
}
