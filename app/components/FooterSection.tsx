'use client'
import { motion } from 'framer-motion'
import { FaXTwitter, FaLinkedin, FaEnvelope } from 'react-icons/fa6'

export default function FooterSection() {
  return (
    <footer className="relative bg-gradient-to-b from-black via-neutral-900 to-black text-gray-400 py-20 px-8 overflow-hidden">
      {/* Moving radial glow */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08),transparent_70%)]"
        animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        viewport={{ once: true }}
        className="relative z-10 max-w-5xl mx-auto text-center space-y-10"
      >
        {/* Socials */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex justify-center gap-8 text-2xl"
        >
          <motion.a
            href="https://x.com/Anishfishhh"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.2, color: '#ffffff' }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          >
            <FaXTwitter />
          </motion.a>
          <motion.a
            href="https://www.linkedin.com/in/anishkarthik/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.2, color: '#0077b5' }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          >
            <FaLinkedin />
          </motion.a>
          <motion.a
            href="mailto:squireatbm@gmail.com"
            whileHover={{ scale: 1.2, color: '#ffffff' }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          >
            <FaEnvelope />
          </motion.a>
        </motion.div>

        {/* Privacy Policy */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="pt-8 max-w-3xl mx-auto text-sm text-gray-500 leading-relaxed"
        >
          <p className="mb-2">
            Squire uses Google OAuth to access your Gmail and Google Sheets only with your explicit permission.
            We also integrate with GitHub, Slack, and other tools that you choose to connect.
            We do not share your data with third parties.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="pt-8 text-xs text-gray-600"
        >
          © {new Date().getFullYear()} <span className="text-gray-400">Squire</span>. Built by{' '}
          <span className="text-gray-300 font-medium">Anish Karthik</span>.
        </motion.div>
      </motion.div>
    </footer>
  )
}
