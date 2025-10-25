import { useTransform, motion } from "framer-motion"
import { useGlobalScroll } from '../hooks/useGlobalScroll'

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
        top: "20%",
        left: "20%",
        translateX: "-50%",
        translateY: "-50%",
      }}
      className="flex flex-col text-left"
    >
      <div className="text-black text-8xl font-bold">Squire</div>
      <div className="text-black text-2xl font-bold">
        Record it once. Automate it always.
      </div>
    </motion.div>
  )
}
