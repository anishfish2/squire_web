'use client'
import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useInView } from 'framer-motion'

export default function FloatingWaitlistButton({ heroRef }: { heroRef: React.RefObject<HTMLDivElement> }) {
  const heroInView = useInView(heroRef, { amount: 0.3 })

  // your Typeform link here
  const TYPEFORM_URL = 'https://dhjy1p2t1rr.typeform.com/to/ZU9Y2zJX'

  return (
    <>
      {/* floating join button */}
      <motion.button
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: heroInView ? 0 : 1, y: heroInView ? -20 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className="
          fixed top-6 right-8 z-[9999]
          px-5 py-2 text-sm font-medium rounded-full
          bg-black text-white hover:bg-gray-900
          shadow-lg backdrop-blur-sm
          transition-all duration-300
        "
        onClick={() => window.open(TYPEFORM_URL, '_blank')}
      >
        Join Waitlist
      </motion.button>

      {/* export the ref so parent can attach it to HeroSection */}
      <div ref={heroRef} id="hero-detector" className="hidden" />
    </>
  )
}
