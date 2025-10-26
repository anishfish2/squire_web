'use client'
import { useState } from 'react'
import { motion, useTransform } from 'framer-motion'
import { useGlobalScroll } from '../hooks/useGlobalScroll'
import { useToolStore } from '../stores/toolStore'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function ToolDescription() {
  const centeredTool = useToolStore((s) => s.centeredTool)
  const handleClick = useToolStore((s) => s.handleClick)
  const [index, setIndex] = useState(0)
  const [clicked, setClicked] = useState(false)

  const scrollYProgress = useGlobalScroll()
  const y = useTransform(scrollYProgress, [0.1, 1], ['0vh', '240vh'])
  const opacity = useTransform(scrollYProgress, [0.9, 1], [1, 0])

  if (!centeredTool) return null
  const currentFunc = centeredTool.functions?.[index]

  return (
    <motion.div
      style={{
        y,
        opacity,
        position: 'fixed',
        left: '50%',
        top: '80vh',
        translateX: '-50%',
        zIndex: 9999,
      }}
      className="text-center select-none transition-all duration-500 ease-out flex items-center justify-center gap-6"
    >
      {/* Left Button */}
      <button
        onClick={() =>
          setIndex((i) =>
            i === 0 ? centeredTool.functions.length - 1 : i - 1
          )
        }
        className="p-2 rounded-full border border-transparent hover:border-black/20 hover:bg-black/5 transition-all duration-200"
      >
        <ChevronLeft size={28} strokeWidth={1.5} className="text-black" />
      </button>

      {/* Tool Info */}
      <div className="w-[280px] flex flex-col items-center">
        <div className="text-2xl font-semibold tracking-wide text-black">
          {centeredTool.tool}
        </div>

        {currentFunc && (
          <motion.div
            onClick={() => {
              setClicked(true)
              handleClick?.(centeredTool.id)
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="
              mt-2 cursor-pointer relative text-lg text-black font-medium
              transition-all duration-200 hover:text-gray-700 select-none
            "
          >
            {/* Ripple pulse effect around task when not clicked */}
            {!clicked && (
              <motion.span
                className="absolute -inset-2 rounded-full border border-black/30 pointer-events-none"
                animate={{
                  scale: [1, 1.4],
                  opacity: [0.8, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              />
            )}
            {currentFunc.name}
            <span className="ml-3 text-sm text-black/70">
              {currentFunc.time}
            </span>
          </motion.div>
        )}
      </div>

      {/* Right Button */}
      <button
        onClick={() =>
          setIndex((i) =>
            centeredTool.functions && centeredTool.functions.length > 0
              ? (i + 1) % centeredTool.functions.length
              : 0
          )
        }
        className="p-2 rounded-full border border-transparent hover:border-black/20 hover:bg-black/5 transition-all duration-200"
      >
        <ChevronRight size={28} strokeWidth={1.5} className="text-black" />
      </button>
    </motion.div>
  )
}
