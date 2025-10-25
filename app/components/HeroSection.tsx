'use client'
import { motion, useAnimation, useInView } from 'framer-motion'
import { useEffect, useRef } from 'react'

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.4 })
  const controls = useAnimation()

  useEffect(() => {
    if (inView) controls.start('visible')
    else controls.start('hidden')
  }, [inView, controls])

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-white via-gray-50 to-gray-100"
    >
      {/* Floating gradient blobs */}
      <motion.div
        className="absolute top-1/3 left-1/4 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"
        animate={{ y: [0, -40, 0], x: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"
        animate={{ y: [0, 40, 0], x: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(0,0,0,0.04),transparent_70%)]"
        animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      />

      {/* Content container */}
      <motion.div
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.15, delayChildren: 0.2 },
          },
        }}
        initial="hidden"
        animate={controls}
        className="relative z-10 max-w-3xl text-center px-6"
      >
        {/* Title */}
        <motion.h1
          variants={{
            hidden: { opacity: 0, y: 40, scale: 0.98 },
            visible: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { type: 'spring', stiffness: 70, damping: 14 },
            },
          }}
          className="text-5xl md:text-6xl font-semibold tracking-tight leading-tight text-gray-900"
        >
          <motion.span
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { delay: 0.2, duration: 0.6 },
              },
            }}
            className="block"
          >
            Turn your screen actions
          </motion.span>
          <motion.span
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { delay: 0.35, duration: 0.6 },
              },
            }}
            className="block text-gray-500"
          >
            into automated workflows
          </motion.span>
          <motion.span
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { delay: 0.5, duration: 0.6 },
              },
            }}
            className="block text-black"
          >
            in minutes.
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { delay: 0.7, duration: 0.7 },
            },
          }}
          className="mt-6 text-lg text-gray-600 leading-relaxed"
        >
          Upload a video of you doing a task — we watch, build the workflow, and let you run or
          schedule it. Automate your repetitive work with one click.
        </motion.p>

        {/* Secondary line */}
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 15 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { delay: 1, duration: 0.6 },
            },
          }}
          className="mt-3 text-gray-500"
        >
          Join early and help shape what’s next.
        </motion.p>

        {/* Button */}
        <motion.div
          variants={{
            hidden: { opacity: 0, scale: 0.8 },
            visible: {
              opacity: 1,
              scale: 1,
              transition: { delay: 1.3, type: 'spring', stiffness: 100, damping: 10 },
            },
          }}
          className="mt-10"
        >
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: '0 0 24px rgba(0,0,0,0.15)',
            }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: [
                '0 0 0px rgba(0,0,0,0)',
                '0 0 24px rgba(0,0,0,0.15)',
                '0 0 0px rgba(0,0,0,0)',
              ],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: 'easeInOut',
            }}
            className="px-8 py-4 text-lg font-medium text-white bg-black rounded-full transition-all duration-300"
            onClick={() =>
              window.open('https://dhjy1p2t1rr.typeform.com/to/ZU9Y2zJX', '_blank', 'noopener,noreferrer')
            }
          >
            Join the Waitlist
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  )
}
