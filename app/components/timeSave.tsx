'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import useTimeStore from '../stores/timeStore'
import { useScrollPhase } from '../hooks/useScrollPhase'

export default function TimeSave() {
  const { time } = useTimeStore()
  const { phase } = useScrollPhase()
  const [displayText, setDisplayText] = useState('')
  const [isGlitching, setIsGlitching] = useState(false)
  const [showSaved, setShowSaved] = useState(false)

  const formatTime = (t: number) => {
    if (t < 1) {
      const secs = Math.round(t * 60)
      return `${secs} sec`
    } else if (t < 60) {
      const mins = Math.floor(t)
      return `${mins} min`
    } else {
      const hrs = Math.floor(t / 60)
      return `${hrs} hr${hrs > 1 ? 's' : ''}`
    }
  }

  useEffect(() => {
    if (phase === 'merge') {
      setIsGlitching(true)
      setShowSaved(true)

      const glitchInterval = setInterval(() => {
        const randomDigits = Array.from(
          { length: 2 + Math.floor(Math.random() * 2) },
          () => Math.floor(Math.random() * 10)
        ).join('')
        setDisplayText(`${randomDigits}${Math.random() > 0.6 ? 's' : ''}`)
      }, 100)

      const stop = setTimeout(() => {
        clearInterval(glitchInterval)
        setIsGlitching(false)
        setDisplayText(formatTime(time))
      }, 1500)

      return () => {
        clearInterval(glitchInterval)
        clearTimeout(stop)
      }
    } else if (phase === 'done') {
      setIsGlitching(false)
      setShowSaved(true)
      setDisplayText(formatTime(time))
    } else {
      setShowSaved(false)
      setIsGlitching(false)
      setDisplayText(formatTime(time))
    }
  }, [phase, time])

  const fontScale = Math.max(32 - displayText.length * 0.8, 14)

  return (
    <div className="w-full flex justify-center items-end pointer-events-none select-none text-center leading-none tracking-tighter">
      {/* Big time text */}
      <motion.span
        className={`font-extrabold ${
          isGlitching ? 'text-black/50' : 'text-black/5'
        } transition-all duration-300`}
        style={{
          fontSize: `${fontScale}vw`,
          lineHeight: 1,
          letterSpacing: '-0.04em',
          userSelect: 'none',
          opacity: isGlitching ? 0.85 : 1,
          animation: isGlitching ? 'softGlitch 0.6s ease-in-out infinite' : 'none',
        }}
      >
        {displayText}
      </motion.span>

      {/* “wasted” → “saved” transition */}
      <span
        className="relative ml-3 font-extrabold"
        style={{
          fontSize: '1.8vw',
          lineHeight: 1,
          alignSelf: 'flex-end',
          transition: 'all 0.5s ease-in-out',
        }}
      >
        {!showSaved ? (
          <span className="text-black/90 relative inline-block">
            wasted.
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: showSaved ? 1 : 0 }}
              transition={{ duration: 0.4 }}
              className="absolute left-0 top-1/2 w-full h-[2px] bg-black origin-left"
            />
          </span>
        ) : (
          <span className="text-green-600 subtle-glitch">saved.</span>
        )}
      </span>

      <style jsx>{`
        @keyframes softGlitch {
          0% {
            transform: translate(0);
          }
          25% {
            transform: translate(0.5px, 0);
          }
          50% {
            transform: translate(-0.5px, 0);
          }
          75% {
            transform: translate(0.3px, 0);
          }
          100% {
            transform: translate(0);
          }
        }

        .subtle-glitch {
          animation: textGlitch 1.2s ease-in-out infinite alternate;
          position: relative;
        }

        @keyframes textGlitch {
          0% {
            opacity: 1;
            transform: translate(0);
          }
          30% {
            opacity: 0.95;
            transform: translate(0.3px, 0);
          }
          60% {
            opacity: 0.9;
            transform: translate(-0.3px, 0);
          }
          100% {
            opacity: 1;
            transform: translate(0);
          }
        }
      `}</style>
    </div>
  )
}
