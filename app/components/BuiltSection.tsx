'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Instrument_Sans } from "next/font/google"

const mainFont = Instrument_Sans({
  subsets: ["latin"],
})

const implementedTools = [
  { id: 'slack', name: 'Slack', icon: '/textures/Slack.png' },
  { id: 'gmail', name: 'Gmail', icon: '/textures/Gmail.png' },
  { id: 'gdrive', name: 'Drive', icon: '/textures/Google Drive.png' },
  { id: 'notion', name: 'Notion', icon: '/textures/Notion.png' },
  { id: 'linear', name: 'Linear', icon: '/textures/Linear_white.png' },
  { id: 'gsheets', name: 'Sheets', icon: '/textures/Google Sheets.png' },
  { id: 'github', name: 'GitHub', icon: '/textures/Github_white.png' },
  { id: 'figma', name: 'Figma', icon: '/textures/Figma.png' },
]

export default function BuiltSection() {
  return (
    <section className={`relative bg-black text-white py-28 overflow-hidden ${mainFont.className}`}>
      {/* Subtle animated gradient background */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.05),transparent_60%)]"
        animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      />

      {/* Faint top glow */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        viewport={{ once: true }}
        className="relative z-10 max-w-6xl mx-auto text-center px-8 space-y-12"
      >
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-4xl md:text-5xl font-semibold tracking-tight"
        >
          Already Working — <span className="text-gray-400">and Getting Smarter</span>
        </motion.h2>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed"
        >
          From AI-powered video analysis to seamless Slack and GitHub integrations —
          it’s already automating real tasks across your workspace.
        </motion.p>

        {/* Integration icons grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-items-center mt-16">
          {implementedTools.map((tool, i) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 40, rotateX: 10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                delay: i * 0.08,
                duration: 0.6,
                type: 'spring',
                stiffness: 80,
              }}
              whileHover={{
                scale: 1.08,
                rotateY: 4,
                boxShadow: '0 0 20px rgba(255,255,255,0.25)',
              }}
              className="relative flex flex-col items-center justify-center 
                 aspect-square w-8 sm:w-16 md:w-24
                 rounded-xl bg-white/10 hover:bg-white/20 
                 transition duration-300"
            >
              <motion.div
                style={{ willChange: 'transform' }}
                animate={{ y: [0, -5 - i * 0.4, 0] }}
                transition={{
                  duration: 3.5 + i * 0.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Image
                  src={tool.icon}
                  alt={tool.name}
                  width={30}
                  height={30}
                  className="object-contain opacity-90"
                />
              </motion.div>
              <p className="text-xs text-gray-300 mt-2">{tool.name}</p>
            </motion.div>
          ))}
        </div>

        {/* Feature tags */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="flex flex-wrap justify-center gap-3 mt-12"
        >
          {[
            'Video → Workflow Extraction',
            'Visual Workflow Editor',
            'One-click Execution',
            'Scheduling Engine',
            'Ever growing set of integrations',
          ].map((feature, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white/10 px-4 py-2 rounded-full text-sm text-gray-200 hover:bg-white/20 transition"
            >
              {feature}
            </motion.span>
          ))}
        </motion.div>

        {/* Footer text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="pt-8 text-gray-400"
        >
          <motion.span
            animate={{
              backgroundPosition: ['0% 50%', '200% 50%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="bg-gradient-to-r from-gray-500 via-white to-gray-500 bg-[length:200%_auto] bg-clip-text text-transparent text-base font-medium"
          >
            More coming soon — raw agent browser use, AI action correction, and team workflows.
          </motion.span>
        </motion.div>
      </motion.div>
    </section>
  )
}
