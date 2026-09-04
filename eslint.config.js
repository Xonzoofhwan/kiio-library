import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  {
    // 쇼케이스는 라이브러리 표면이 아니다. 페이지 컴포넌트와 목차 상수(`*_TOC`)·
    // 내비 정의(`NAV_GROUPS`)를 한 파일에서 내보내는 것이 이 앱의 등록 방식이며,
    // react-refresh 경고는 그 패턴에 대한 HMR 알림이지 결함이 아니다.
    // src/components/** 에서는 규칙을 그대로 유지한다.
    files: ['src/showcase/**/*.tsx', 'src/components/showcase-layout/Sidebar.tsx'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
])
