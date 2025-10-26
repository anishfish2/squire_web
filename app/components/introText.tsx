import { useTransform, motion } from "framer-motion"
import { useGlobalScroll } from "../hooks/useGlobalScroll"
import { Paytone_One } from "next/font/google"

const font = Paytone_One({
  weight: "400",
  subsets: ["latin"],
})

export default function IntroText() {
  const scrollYProgress = useGlobalScroll()
  const x = useTransform(scrollYProgress, [0.1, 1], ["0vw", "-400vw"])
  const opacity = useTransform(scrollYProgress, [0.9, 1], [1, 0])

  return (
    <motion.div
      style={{
        x,
        opacity,
        position: "fixed",
        top: "10%",
        left: "10%",
      }}
      className="flex flex-col text-left relative"
    >
      <div
        className={`text-black font-extrabold text-[8rem] flex flex-col`}
      >
        <div className={`${font.className}`}>squire</div>
        <div
          className="text-black text-xl font-semibold leading-none"
        >
          Record it once. Automate it always.
        </div>
      </div>
    </motion.div>
  )
}
