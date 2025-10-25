// hooks/useGlobalScroll.ts
import { useScroll } from "framer-motion"
import { createContext, useContext } from "react"

export const ScrollContext = createContext<{ scrollYProgress: any } | null>(null)

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const scroll = useScroll() // global scroll of window
  return <ScrollContext.Provider value={scroll}>{children}</ScrollContext.Provider>
}

export function useGlobalScroll() {
  const ctx = useContext(ScrollContext)
  if (!ctx) throw new Error("useGlobalScroll must be used within ScrollProvider")
  return ctx.scrollYProgress
}
