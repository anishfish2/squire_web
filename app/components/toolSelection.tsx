'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useTransform } from 'framer-motion'
import { useGlobalScroll } from '../hooks/useGlobalScroll'
import { useToolStore } from '../stores/toolStore'

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
      className="
        text-center select-none
        transition-all duration-500 ease-out
        flex items-center justify-center gap-6
      "
    >
      {/* ◀️ Previous */}
      <button
        onClick={() =>
          setIndex((i) =>
            i === 0 ? centeredTool.functions.length - 1 : i - 1
          )
        }
        className="text-3xl text-black hover:text-gray-500 transition-colors duration-200"
      >
        &lt;
      </button>

      {/* 🧠 Centered Tool Info */}
      <div className="w-[280px] flex flex-col items-center">
        <div className="text-2xl font-semibold tracking-wide text-black">
          {centeredTool.tool}
        </div>

        {currentFunc && (
          <div className="text-lg text-black mt-1">
            {currentFunc.name}
            <span className="ml-3 text-sm text-black">{currentFunc.time}</span>
          </div>
        )}

        {/* ⚡ Sleek Ripple Button */}
        <div className="relative mt-3">
          {/* Ripple effect around border */}
          {!clicked && (
            <motion.span
              className="absolute inset-0 rounded-full border border-black/40"
              style={{
                scale: 1,
                opacity: 0.8,
              }}
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

          <motion.button
            onClick={() => {
              setClicked(true)
              handleClick && handleClick(centeredTool.id)
            }}
            whileHover={{
              scale: 1.05,
              backgroundColor: '#000',
              color: '#fff',
            }}
            whileTap={{ scale: 0.95 }}
            className="
              relative z-10 px-5 py-2 text-sm font-medium border border-black
              rounded-full text-black bg-white/90 backdrop-blur-sm
              hover:bg-black hover:text-white transition-all duration-300
            "
          >
            Add to workflow
          </motion.button>
        </div>
      </div>

      {/* ▶️ Next */}
      <button
        onClick={() =>
          setIndex((i) =>
            centeredTool.functions && centeredTool.functions.length > 0
              ? (i + 1) % centeredTool.functions.length
              : 0
          )
        }
        className="text-3xl text-black hover:text-gray-500 transition-colors duration-200"
      >
        &gt;
      </button>
    </motion.div>
  )
}
