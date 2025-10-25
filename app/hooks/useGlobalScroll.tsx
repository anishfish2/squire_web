// hooks/useGlobalScroll.ts
import { useScroll, MotionValue } from 'framer-motion'
import { createContext, useContext, ReactNode } from 'react'

interface ScrollContextType {
  scrollYProgress: MotionValue<number>
}

export const ScrollContext = createContext<ScrollContextType | null>(null)

export function ScrollProvider({ children }: { children: ReactNode }) {
  const scroll = useScroll()
  return <ScrollContext.Provider value={scroll}>{children}</ScrollContext.Provider>
}

export function useGlobalScroll() {
  const ctx = useContext(ScrollContext)
  if (!ctx) throw new Error('useGlobalScroll must be used within ScrollProvider')
  return ctx.scrollYProgress
}
