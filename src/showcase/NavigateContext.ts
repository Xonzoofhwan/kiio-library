import { createContext } from 'react'

export const NavigateContext = createContext<(id: string) => void>(() => {})
