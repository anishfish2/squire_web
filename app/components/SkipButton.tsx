'use client'
import { motion, useAnimationControls} from 'framer-motion'
import { useEffect, useState } from 'react'

export default function SkipButton({ heroRef }: { heroRef: React.RefObject<HTMLDivElement> }) {
  const [visible, setVisible] = useState(false)
  const [heroVisible, setHeroVisible] = useState(false)
  const controls = useAnimationControls()

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 2500)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (!heroRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        setHeroVisible(entry.isIntersecting)
      },
      {
        root: null,
        threshold: 0.25,
      }
    )

    observer.observe(heroRef.current)

    return () => observer.disconnect()
  }, [heroRef])


const handleClick = () => {
  if (!heroRef.current) return

  if (heroVisible) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    const top = heroRef.current.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top, behavior: 'smooth' })
  }
}


  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={
        visible
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: 30, pointerEvents: 'none' }
      }
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="fixed bottom-8 right-10 z-[9998] flex flex-col items-center gap-1"
    >
      <motion.button
        onClick={handleClick}
        animate={controls}
        onMouseEnter={() =>
          controls.start({
            y: [0, -3, 0],
            transition: { repeat: Infinity, duration: 1.2 },
          })
        }
        onMouseLeave={() => controls.stop()}
        whileTap={{ scale: 0.95 }}
        className="
          border border-gray-400 rounded-full px-4 py-2
          text-sm font-medium backdrop-blur-md bg-white/80 text-gray-800
          hover:bg-black hover:text-white hover:border-black
          transition-all duration-300 shadow-sm
        "
      >
        <motion.span
          key={heroVisible ? 'back' : 'skip'}
          initial={{ opacity: 0, y: heroVisible ? 6 : -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {heroVisible ? 'Back to Top ↑' : 'Skip to Info ↓'}
        </motion.span>
      </motion.button>
    </motion.div>
  )
}
