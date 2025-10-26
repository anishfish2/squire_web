'use client'
import { useState } from 'react'
import { motion, useTransform } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useToolStore } from '../stores/toolStore'
import { useGlobalScroll } from '../hooks/useGlobalScroll'

export default function ToolDescription() {
  const centeredTool = useToolStore((s) => s.centeredTool)
  const handleClick = useToolStore((s) => s.handleClick)
  const [index, setIndex] = useState(0)
  const [hasAdded, setHasAdded] = useState(false)

  const scrollYProgress = useGlobalScroll()
  const y = useTransform(scrollYProgress, [0.1, 1], ['0vh', '240vh'])
  const opacity = useTransform(scrollYProgress, [0.9, 1], [1, 0])

  if (!centeredTool) return null
  const currentFunc = centeredTool.functions?.[index]

  const handleAdd = (id: string) => {
    handleClick?.(id)
    setHasAdded(true)
  }

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
      className="select-none transition-all duration-500 ease-out flex items-center justify-center gap-10"
    >
      {/* 👈 Left Button (fixed position) */}
      <div className="flex-shrink-0">
        <button
          onClick={() =>
            setIndex((i) =>
              i === 0 ? centeredTool.functions.length - 1 : i - 1
            )
          }
          className="p-2 rounded-full border border-transparent hover:border-black/20 hover:bg-black/5 transition-all duration-200 flex items-center justify-center"
        >
          <ChevronLeft size={26} strokeWidth={1.5} className="text-black" />
        </button>
      </div>

      {/* 🧠 Center content */}
      <div className="flex flex-col items-center justify-center w-[280px] text-center">
        <div className="text-2xl font-semibold tracking-wide text-black whitespace-nowrap">
          {centeredTool.tool}
        </div>

        {currentFunc && (
          <div className="relative mt-2 flex items-center justify-center">
            {!hasAdded && (
              <motion.div
                initial={{ rotate: 45 }}
                animate={{
                  rotate: [40, 50, 40, 50, 45],
                  x: [-4, 4, -4, 4, 0],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute -top-36 -left-40 pointer-events-none"
              >
                <Image
                  src="/textures/arrow.png"
                  alt="Arrow pointing to add button"
                  width={180}
                  height={180}
                  className="opacity-90 rotate-[-45deg]"
                />
              </motion.div>
            )}

            <motion.button
              onClick={() => handleAdd(centeredTool.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="
                px-5 py-2 rounded-full 
                bg-black text-white font-medium text-base
                transition-all duration-300 hover:bg-gray-900
                flex items-center justify-center whitespace-nowrap
              "
            >
              {currentFunc.name}
              <span className="ml-2 text-sm text-white/80">
                {currentFunc.time}
              </span>
            </motion.button>
          </div>
        )}
      </div>

      {/* 👉 Right Button (fixed position) */}
      <div className="flex-shrink-0">
        <button
          onClick={() =>
            setIndex((i) =>
              centeredTool.functions && centeredTool.functions.length > 0
                ? (i + 1) % centeredTool.functions.length
                : 0
            )
          }
          className="p-2 rounded-full border border-transparent hover:border-black/20 hover:bg-black/5 transition-all duration-200 flex items-center justify-center"
        >
          <ChevronRight size={26} strokeWidth={1.5} className="text-black" />
        </button>
      </div>
    </motion.div>
  )
}
