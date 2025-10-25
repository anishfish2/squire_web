'use client'
import { useRef, useState, useEffect } from 'react'
import { motion, useTransform } from 'framer-motion'
import { useToolStore } from '../stores/toolStore'
import { useGlobalScroll } from '../hooks/useGlobalScroll'

export default function ToolCarousel({ toolActions }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const setCenteredTool = useToolStore((s) => s.setCenteredTool)
  const centeredTool = useToolStore((s) => s.centeredTool)

  // global scroll-based animation
  const scrollYProgress = useGlobalScroll()
  const x = useTransform(scrollYProgress, [0.1, 1], ['0vw', '200vw'])
  const opacity = useTransform(scrollYProgress, [0.9, 1], [1, 0])

  // layout constants
  const VISIBLE_COUNT = 5
  const ICON_SIZE = 56
  const GAP = 32
  const ITEM_TOTAL = ICON_SIZE + GAP
  const CONTAINER_HEIGHT = VISIBLE_COUNT * ITEM_TOTAL - GAP

  // 🧭 initialize scroll position to the middle copy
  useEffect(() => {
    const el = containerRef.current
    if (el) {
      const totalHeight = toolActions.length * ITEM_TOTAL
      el.scrollTop = totalHeight // start in middle block
    }
  }, [toolActions])

  // 🔁 infinite scroll logic
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const totalHeight = toolActions.length * ITEM_TOTAL

    const handleScroll = () => {
      const pos = el.scrollTop
      // wrap-around illusion
      if (pos >= totalHeight * 2) el.scrollTop = pos - totalHeight
      else if (pos <= 0) el.scrollTop = pos + totalHeight
      setScrollTop(el.scrollTop)
    }

    el.addEventListener('scroll', handleScroll)
    return () => el.removeEventListener('scroll', handleScroll)
  }, [toolActions])

  // 🎯 detect which tool is centered
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const containerCenter = rect.top + rect.height / 2
    const baseLength = toolActions.length

    let closestTool = null
    let closestDistance = Infinity

    Array.from(el.children).forEach((child, i) => {
      const itemRect = (child as HTMLElement).getBoundingClientRect()
      const itemCenter = itemRect.top + itemRect.height / 2
      const distance = Math.abs(containerCenter - itemCenter)
      if (distance < closestDistance) {
        closestDistance = distance
        closestTool = toolActions[i % baseLength]
      }
    })

    setCenteredTool(closestTool)
  }, [scrollTop, toolActions, setCenteredTool])

  // 🧩 smooth scroll to clicked item (anchored to middle copy)
  const scrollToItem = (clickedIndex: number) => {
    const el = containerRef.current
    if (!el) return

    const totalHeight = toolActions.length * ITEM_TOTAL
    const currentTop = el.scrollTop

    // figure out which "copy" we're currently in (0, 1, or 2)
    const currentCopy = Math.floor(currentTop / totalHeight)
    const targetCopy = 1 // always scroll within middle copy

    const targetIndex = clickedIndex + targetCopy * toolActions.length
    const targetScroll =
      targetIndex * ITEM_TOTAL - CONTAINER_HEIGHT / 2 + ICON_SIZE / 2

    // avoid micro scroll flicker
    if (Math.abs(el.scrollTop - targetScroll) < 10) return

    el.scrollTo({
      top: targetScroll,
      behavior: 'smooth',
    })
  }

  // 🎠 render carousel
  return (
    <motion.div
      style={{
        x,
        opacity,
        position: 'fixed',
        right: '2rem',
        top: '60%',
        translateY: '-50%',
        zIndex: 60,
        pointerEvents: 'auto',
      }}
    >
      <div
        ref={containerRef}
        className="flex flex-col items-center gap-8 overflow-y-scroll scrollbar-hide pt-6 pb-6 relative"
        style={{
          height: `${CONTAINER_HEIGHT}px`,
          width: '110px',
          paddingRight: '4px',
        }}
        onWheel={(e) => e.stopPropagation()}
        onMouseEnter={() => (document.body.style.overflow = 'hidden')}
        onMouseLeave={() => (document.body.style.overflow = 'auto')}
      >
        {[...toolActions, ...toolActions, ...toolActions].map((tool, i) => {
          const actualTool = toolActions[i % toolActions.length]
          const el = containerRef.current
          let opacity = 1

          if (el) {
            const rect = el.getBoundingClientRect()
            const containerCenter = rect.top + rect.height / 2
            const item = el.children[i] as HTMLElement
            if (item) {
              const itemRect = item.getBoundingClientRect()
              const itemCenter = itemRect.top + itemRect.height / 2
              const distance = Math.abs(containerCenter - itemCenter)
              const fadeStart = rect.height / 4
              const fadeEnd = rect.height / 1.6
              if (distance > fadeStart) {
                const fadeRange = fadeEnd - fadeStart
                const fadeFactor = Math.min(
                  (distance - fadeStart) / fadeRange,
                  1
                )
                const eased = 1 - Math.pow(1 - fadeFactor, 1.2)
                opacity = 1 - eased * 0.95
              }
            }
          }

          return (
            <div
              key={`${actualTool.id}-${i}`}
              id={actualTool.id}
              onClick={() => scrollToItem(i % toolActions.length)} // ✅ scroll instead of add box
              className="flex items-center justify-center cursor-pointer w-14 h-14 transition-opacity duration-300"
              style={{
                opacity,
                transition: 'opacity 0.3s ease-out',
              }}
            >
              <img
                src={actualTool.iconPath}
                alt={actualTool.tool}
                className={`object-contain transition-transform duration-300 ${
                  centeredTool?.id === actualTool.id
                    ? 'scale-[1.6] drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]'
                    : 'scale-100'
                }`}
                style={{
                  width: '3rem',
                  height: '3rem',
                  transformOrigin: 'center',
                }}
              />
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
