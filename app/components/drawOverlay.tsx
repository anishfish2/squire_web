'use client'
import { motion } from 'framer-motion'
import { useScrollPhase } from '../hooks/useScrollPhase'
import { useState, useEffect } from 'react'

export default function DrawBoxOverlay() {
  const { phase } = useScrollPhase()
  const [seconds, setSeconds] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (phase === 'click') {
      setVisible(true)
      const interval = setInterval(() => setSeconds((s) => s + 1), 1000)
      return () => clearInterval(interval)
    } else if (phase === 'draw') {
      setVisible(true)
      setSeconds(0)
    } else {
      setSeconds(0)
      // fade out after recording ends
      const timeout = setTimeout(() => setVisible(false), 1000)
      return () => clearTimeout(timeout)
    }
  }, [phase])

  const isDrawing = phase === 'draw'
  const isRecording = phase === 'click'

  if (!visible) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[999]">
      <motion.div
        initial={{
          width: 0,
          height: 0,
          bottom: '10%',
          left: '10%',
          opacity: 0,
        }}
        animate={{
          width: isDrawing || isRecording ? '80vw' : '80vw',
          height: isDrawing || isRecording ? '80vh' : '80vh',
          bottom: '50%',
          left: '50%',
          opacity: isRecording ? 1 : 0, // fade out after recording
          borderColor: isRecording ? '#ff0000' : 'rgba(0,0,0,0.4)',
          borderStyle: isRecording ? 'solid' : 'dotted',
          boxShadow: isRecording
            ? '0 0 12px rgba(255, 0, 0, 0.5)'
            : '0 0 6px rgba(0, 0, 0, 0.1)',
          x: '-50%',
          y: '50%',
        }}
        transition={{
          duration: 1.2,
          ease: 'easeInOut',
        }}
        className="absolute rounded-xl border-[4px] overflow-hidden"
        style={{
          transform: 'translate(-50%, 50%)',
          transformOrigin: 'bottom left',
        }}
      >
        {/* Recording indicator */}
        {isDrawing || isRecording ? (
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute top-3 left-4 flex items-center gap-2 font-mono text-sm text-black select-none"
          >
            {isRecording && (
              <motion.div
                className="w-3 h-3 rounded-full"
                animate={{
                  backgroundColor: '#ff0000',
                  opacity: [1, 0.4, 1],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            )}
            {!isRecording ? (
              <span className="font-semibold">Preparing Recording...</span>
            ) : (
              <>
                <span className="font-semibold">Recording</span>
                <span className="ml-2 text-black/70">
                  {String(Math.floor(seconds / 60)).padStart(2, '0')}:
                  {String(seconds % 60).padStart(2, '0')}
                </span>
              </>
            )}
          </motion.div>
        ) : null}

        {/* Center label */}
        <motion.div
          animate={{ opacity: isRecording ? 1 : 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 flex items-center justify-center text-black/25 font-semibold tracking-wide select-none"
        >
          {isDrawing && 'Recording Region'}
          {isRecording && 'Recording in Progress'}
        </motion.div>
      </motion.div>
    </div>
  )
}
