import { motion, useInView } from 'framer-motion'
import { RefObject } from 'react'

export default function ScrollIndicator({ heroRef }: { heroRef: RefObject<HTMLElement> }) {
  const heroInView = useInView(heroRef, { amount: 0.2 })

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: heroInView ? 0 : 1, y: heroInView ? 10 : 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="fixed bottom-6 inset-x-0 flex justify-center z-[999] pointer-events-none"
    >
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        className="flex flex-col items-center space-y-2 text-gray-400 text-sm tracking-wide"
      >
        <span>Scroll to explore</span>
        <div className="w-[2px] h-6 bg-white/50 rounded-full" />
      </motion.div>
    </motion.div>
  )
}
