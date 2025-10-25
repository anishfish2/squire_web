'use client'
import { motion, useTransform } from 'framer-motion'
import { useToolStore } from '../stores/toolStore'
import { useState } from 'react'
import { useGlobalScroll } from '../hooks/useGlobalScroll'

export default function ToolDescription() {
  const centeredTool = useToolStore((s) => s.centeredTool)
  const handleClick = useToolStore((s) => s.handleClick)
  const [index, setIndex] = useState(0)

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

        <button
          onClick={() => handleClick && handleClick(centeredTool.id)}
          className="
            mt-3 px-4 py-1 text-sm font-medium text-black border border-black 
            rounded-full hover:bg-black hover:text-white 
            transition-colors duration-200
          "
        >
          Add to workflow
        </button>
      </div>

      {/* ▶️ Next function */}
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
