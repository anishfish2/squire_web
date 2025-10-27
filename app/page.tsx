'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import ThreePane from './components/box'
import IntroText from './components/introText'
import useTimeStore from './stores/timeStore'
import TimeSave from './components/timeSave'
import ToolCarousel from './components/toolCarousel'
import ToolDescription from './components/toolSelection'
import { useToolStore } from './stores/toolStore'
import { ScrollProvider } from './hooks/useGlobalScroll'
import DrawBoxOverlay from './components/drawOverlay'
import { motion } from 'framer-motion'
import HeroSection from './components/HeroSection'
import BuiltSection from './components/BuiltSection'
import FooterSection from './components/FooterSection'
import FloatingWaitlistButton from './components/FloatingWaitlistButton'
import SkipButton from './components/SkipButton'
import { toolActions } from './uitls/tools_list'
import ScrollIndicator from './components/scrollIndicator'
import MobileHeader from './components/MobileHeader'

function parseTimeString(timeStr: string): number {
  if (!timeStr) return 0

  const str = timeStr.trim().toLowerCase()
  const match = str.match(/([\d.]+)\s*(sec|second|seconds|min|minute|minutes|hr|hrs|hour|hours)?/)
  if (!match) return 0

  const value = parseFloat(match[1])
  const unit = match[2] || 'min'

  switch (unit) {
    case 'sec':
    case 'second':
    case 'seconds':
      return value / 60
    case 'hr':
    case 'hrs':
    case 'hour':
    case 'hours':
      return value * 60
    case 'min':
    case 'minute':
    case 'minutes':
    default:
      return value
  }
}

export default function Home() {
  const [hoverId, setHoverId] = useState<string | null>(null)
  const [collected, setCollected] = useState<{ id: string; color: string; tool: string }[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const { time, setTime } = useTimeStore()
  const [showTime, setShowTime] = useState(true)
  const heroRef = useRef<HTMLDivElement | null>(null)

  const handleClick = useCallback((id: string) => {
    const clicked = toolActions.find((t) => t.id === id)
    if (!clicked) return

    const el = document.getElementById(id)
    if (!el) return

    el.animate(
      [
        { opacity: 1, transform: 'scale(1)' },
        { opacity: 0.3, transform: 'scale(0.8)' },
        { opacity: 1, transform: 'scale(1)' },
      ],
      { duration: 1200, easing: 'ease-in-out', fill: 'forwards' }
    )

    const addedTime = parseTimeString(clicked.time)

    setTime(time + addedTime)
    setCollected((prev) => [
      ...prev,
      { id: `${id}-${Math.random().toString(36).substring(2, 9)}`, color: clicked.color, tool: clicked.tool },
    ])
  }, [setTime, setCollected])

  const setHandleClick = useToolStore((s) => s.setHandleClick)

  useEffect(() => {
    setHandleClick(handleClick)
  }, [handleClick])

  const handleCubeVisibleChange = (visible: boolean) => {
    if (!visible) {
      setTimeout(() => setShowTime(false), 800) // matches cube fade
    } else {
      setTimeout(() => setShowTime(true), 600)
    }
  }

  return (
    <div className="relative scrollbar-hide">
      <ScrollProvider>
        <main className="hidden lg:block relative min-h-[900vh] scrollbar-hide">
          <FloatingWaitlistButton heroRef={heroRef} />
          <SkipButton heroRef={heroRef} />

          <div className="fixed right-6 translate-y-1/4 flex flex-col items-center gap-8 h-[60vh] overflow-visible z-[600] pt-6 pr-6 pl-6 pb-6">
            <ToolCarousel
              toolActions={toolActions}
              handleClick={handleClick}
              hoverId={hoverId}
              setHoverId={setHoverId}
            />
          </div>

          <div ref={containerRef} className="fixed inset-0 z-50 pointer-events-none">
            <ThreePane collected={collected} onCubeVisibleChange={handleCubeVisibleChange} />
            <DrawBoxOverlay />
          </div>

          <ToolDescription />

          <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-[55]">
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: showTime ? 1 : 0 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            >
              <TimeSave />
            </motion.div>
          </div>

          <section className="bg-white z-[20] relative">
            <IntroText />
          </section>

          
          <ScrollIndicator heroRef={heroRef} hasCollected={!!collected.length} />

        </main>

        <div className="block lg:hidden relative z-[40] pointer-events-auto">


          <MobileHeader />

        </div>
        <div ref={heroRef} className="pt-16">
          <HeroSection />
          <BuiltSection />
          <FooterSection />
        </div>
      </ScrollProvider>
    </div>
  )

}

