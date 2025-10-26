// hooks/useScrollPhase.ts
'use client'
import { useState, useEffect } from 'react'
import { useGlobalScroll } from './useGlobalScroll'

export type Phase = 'intro' | 'draw' | 'click' | 'merge' | 'done'

export function useScrollPhase(): { phase: Phase; progress: number } {
  const scrollYProgress = useGlobalScroll()
  const [phase, setPhase] = useState<Phase>('intro')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    return scrollYProgress.onChange((v) => {
      setProgress(v)
      if (v < 0.05) setPhase('intro')
      else if (v < 0.1) setPhase('draw')
      else if (v < 0.3) setPhase('click')
      else if (v < 0.4) setPhase('merge')  
      else setPhase('done')
    })
  }, [scrollYProgress])

  return { phase, progress }
}
