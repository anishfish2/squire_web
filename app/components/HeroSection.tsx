'use client'
import { Instrument_Sans } from "next/font/google"

const mainFont = Instrument_Sans({
  subsets: ["latin"],
})

export default function HeroSection() {
  return (
    <section
      className={`relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-white via-gray-50 to-gray-100 ${mainFont.className}`}
    >
      {/* Background gradients */}
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(0,0,0,0.04),transparent_70%)]" />

      {/* Content */}
      <div className="relative z-10 max-w-3xl text-center px-6">
        <h1 className="text-5xl md:text-6xl font-semibold tracking-tight leading-tight text-gray-900">
          <span className="block">Turn your screen actions</span>
          <span className="block text-gray-500">into automated workflows</span>
          <span className="block text-black">in minutes.</span>
        </h1>

        <p className="mt-6 text-lg text-gray-600 leading-relaxed">
          Upload a video of you doing a task — we watch, build the workflow, and let you run or
          schedule it. Automate your repetitive work with one click.
        </p>

        <p className="mt-3 text-gray-500">
          Join early and help shape what’s next.
        </p>

        <div className="mt-10">
          <button
            className="px-8 py-4 text-lg font-medium text-white bg-black rounded-full transition-all duration-300 hover:bg-gray-900"
            onClick={() =>
              window.open('https://dhjy1p2t1rr.typeform.com/to/ZU9Y2zJX', '_blank', 'noopener,noreferrer')
            }
          >
            Join the Waitlist
          </button>
        </div>
      </div>
    </section>
  )
}
