import * as THREE from 'three'
import React, { useRef, useEffect, useMemo, useState } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { TextureLoader, CanvasTexture } from 'three'
import { motion, useTransform } from 'framer-motion'
import { useScrollPhase } from '../hooks/useScrollPhase'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js' // important import
import { useGlobalScroll } from '../hooks/useGlobalScroll'

function usePreloadTextures() {
  useEffect(() => {
    const loader = new TextureLoader()
    loader.load('/textures/Squire.png', () => { })
  }, [])
}
function TexturePreloader() {
  usePreloadTextures()
  return null
}
function AnimatedBox({
  index,
  total,
  id,
  isMerging,
  isDone,
  onClick,
  tool,
}: {
  index: number
  total: number
  id: string
  isMerging: boolean
  isDone: boolean
  onClick: (id: string) => void
  tool: string
}) {
  const ref = useRef<THREE.Mesh>(null!)
  const angle = (index / total) * Math.PI * 2
  const baseTexture = useLoader(THREE.TextureLoader, `/textures/${tool}.png`)
  baseTexture.colorSpace = THREE.SRGBColorSpace

  const radius = 3

  const texture = useMemo(() => {
    const size = 512
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!

    const radius = 0
    ctx.fillStyle = '#000000'

    // ctx.clearRect(0, 0, size, size)
    ctx.beginPath()
    ctx.moveTo(radius, 0)
    ctx.lineTo(size - radius, 0)
    ctx.quadraticCurveTo(size, 0, size, radius)
    ctx.lineTo(size, size - radius)
    ctx.quadraticCurveTo(size, size, size - radius, size)
    ctx.lineTo(radius, size)
    ctx.quadraticCurveTo(0, size, 0, size - radius)
    ctx.lineTo(0, radius)
    ctx.quadraticCurveTo(0, 0, radius, 0)
    ctx.closePath()

    ctx.fillStyle = '#000000'
    ctx.fill()

    ctx.lineWidth = 12
    ctx.strokeStyle = '#000000'
    ctx.stroke()

    if (baseTexture.image) {
      const iconSize = size * 0.45
      ctx.drawImage(
        baseTexture.image,
        size / 2 - iconSize / 2,
        size / 2 - iconSize / 2,
        iconSize,
        iconSize
      )
    }

    const t = new CanvasTexture(canvas)
    t.colorSpace = THREE.SRGBColorSpace
    t.needsUpdate = true
    return t
  }, [baseTexture])

  const geometry = useMemo(() => {
    return new RoundedBoxGeometry(1, 1, 1, 4, 0)
  }, [])

  const materials = useMemo(() => {

    const mat = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.4,
      metalness: 0.1,
      transparent: false,
      opacity: 1,
      alphaTest: 1,
      side: THREE.DoubleSide,
    })

    return [mat, mat, mat, mat, mat, mat]
  }, [texture])

  const radiusVec = useMemo(
    () => new THREE.Vector3(radius * Math.cos(angle), 0, radius * Math.sin(angle)),
    [radius, angle]
  )

  const [spawnProgress, setSpawnProgress] = useState(0)

  useFrame((state, delta) => {
    if (!ref.current) return
    if (!isMerging && !isDone) {
      setSpawnProgress((p) => Math.min(p + delta * 1.5, 1))
      const eased = 1 - Math.pow(1 - spawnProgress, 3)
      const pos = radiusVec.clone().multiplyScalar(eased)
      ref.current.position.lerp(pos, 0.2)
      const targetScale = new THREE.Vector3(eased, eased, eased)
      ref.current.scale.lerp(targetScale, 0.15)
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 2 + index) * 0.2
    }
  })

  return (
    <mesh
      ref={ref}
      onClick={(e) => {
        e.stopPropagation()
        onClick(id)
      }}
      scale={[0.001, 0.001, 0.001]}
      geometry={geometry}
      material={materials}
    />
  )
}

function OrbitingBoxes({
  collected,
  onCollapseDone,
}: {
  collected: { id: string; color: string; tool: string }[]
  onCollapseDone: () => void
}) {
  const groupRef = useRef<THREE.Group>(null!)
  const { phase } = useScrollPhase()
  const isMerging = phase === 'merge'
  const isDone = phase === 'done'
  const collapseStart = useRef<number | null>(null)
  const collapseDurationPerBox = 0.25
  const [collapseComplete, setCollapseComplete] = useState(false)

  useFrame((state, delta) => {
    const group = groupRef.current
    if (!group) return
    const total = group.children.length
    if (total === 0) return

    if (!isMerging && !isDone) {
      group.rotation.y += delta * 0.4
      group.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05
      setCollapseComplete(false)
      collapseStart.current = null
      return
    }

    if (isMerging) {
      if (collapseStart.current === null)
        collapseStart.current = state.clock.elapsedTime
      const elapsed = state.clock.elapsedTime - collapseStart.current
      const allCollapsedTime = total * collapseDurationPerBox + 0.6

      group.children.forEach((child, i) => {
        const boxDelay = i * collapseDurationPerBox
        const t = Math.min(Math.max(elapsed - boxDelay, 0) / 0.5, 1)
        if (t > 0) {
          const lerpFactor = 1 - Math.pow(1 - t, 3)
          child.position.lerp(new THREE.Vector3(0, 0, 0), lerpFactor * delta * 8)
          child.scale.lerp(new THREE.Vector3(0, 0, 0), lerpFactor * delta * 10)
        }
      })

      if (elapsed > allCollapsedTime && !collapseComplete) {
        setCollapseComplete(true)
        onCollapseDone()
      }
    }
  })

  return (
    <group ref={groupRef} visible={!isDone}>
      {collected.map((box, i) => (
        <AnimatedBox
          key={box.id}
          id={box.id}
          index={i}
          total={collected.length}
          isMerging={isMerging}
          isDone={isDone}
          onClick={() => { }}
          tool={box.tool}
        />
      ))}
    </group>
  )
}

function CenterCube({
  cubeVisible,
  showTexture,
}: {
  cubeVisible: boolean
  showTexture: boolean
}) {
  const ref = useRef<THREE.Mesh>(null!)
  const baseTexture = useLoader(TextureLoader, '/textures/Squire.png')
  baseTexture.colorSpace = THREE.SRGBColorSpace

  const cardTexture = useMemo(() => {
    const size = 512
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!

    const radius = 0
    ctx.clearRect(0, 0, size, size)

    // Rounded rect path
    ctx.beginPath()
    ctx.moveTo(radius, 0)
    ctx.lineTo(size - radius, 0)
    ctx.quadraticCurveTo(size, 0, size, radius)
    ctx.lineTo(size, size - radius)
    ctx.quadraticCurveTo(size, size, size - radius, size)
    ctx.lineTo(radius, size)
    ctx.quadraticCurveTo(0, size, 0, size - radius)
    ctx.lineTo(0, radius)
    ctx.quadraticCurveTo(0, 0, radius, 0)
    ctx.closePath()

    ctx.fillStyle = '#000000'
    ctx.fill()
    ctx.lineWidth = 12
    ctx.strokeStyle = '#000000'
    ctx.stroke()

    if (showTexture && baseTexture.image) {
      const iconSize = size * 0.45
      ctx.drawImage(
        baseTexture.image,
        size / 2 - iconSize / 2,
        size / 2 - iconSize / 2,
        iconSize,
        iconSize
      )
    }

    const t = new CanvasTexture(canvas)
    t.needsUpdate = true
    return t
  }, [showTexture, baseTexture])

  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.x += delta * 0.4
    ref.current.rotation.y += delta * 0.25
  })

  const materials = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      map: cardTexture,
      roughness: 0.4,
      metalness: 0.1,
      transparent: true,
      opacity: cubeVisible ? 1 : 0,
    })
    return [mat, mat, mat, mat, mat, mat]
  }, [cardTexture, cubeVisible])

  return (
    <mesh ref={ref} material={materials}>
      <boxGeometry args={[1, 1, 1]} />
    </mesh>
  )
}

export default function ThreePane({
  collected = [],
  onCubeVisibleChange,
}: {
  collected: { id: string; color: string; tool: string }[]
  onCubeVisibleChange?: (visible: boolean) => void
}) {
  const { phase } = useScrollPhase()
  const scrollYProgress = useGlobalScroll()
  const [showLogo, setShowLogo] = useState(false)
  const [cubeVisible, setCubeVisible] = useState(true)
  const [showTexture, setShowTexture] = useState(false)

  const handleCollapseDone = () => setShowTexture(true)

  useEffect(() => {
    if (phase === 'done') {
      setCubeVisible(false)
      onCubeVisibleChange?.(false)
      const timeout = setTimeout(() => setShowLogo(true), 800)
      return () => clearTimeout(timeout)
    } else {
      setShowLogo(false)
      const timeout = setTimeout(() => {
        setCubeVisible(true)
        setShowTexture(false)
        onCubeVisibleChange?.(true)
      }, 600)
      return () => clearTimeout(timeout)
    }
  }, [phase])

  const textColor = useTransform(scrollYProgress, [0.9, 1], ['#000000', '#ffffff'])

  return (
    <div className="w-screen h-screen pointer-events-none relative">
      <Canvas
        style={{ pointerEvents: 'none', zIndex: 10 }}
        camera={{ position: [0, 5, 10], fov: 50 }}
      >
        <TexturePreloader />
        <ambientLight intensity={Math.PI / 2} />
        <spotLight position={[10, 10, 10]} angle={0.2} intensity={Math.PI} />
        <pointLight position={[-10, -10, -10]} intensity={Math.PI} />

        <CenterCube
          cubeVisible={cubeVisible}
          showTexture={showTexture}
        />
        {phase !== 'done' && (
          <OrbitingBoxes
            collected={collected}
            onCollapseDone={handleCollapseDone}
          />
        )}
        <OrbitControls enableZoom={false} enablePan enableRotate />
      </Canvas>


      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showLogo ? 1 : 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        className="absolute top-8 left-10 flex items-center gap-3 pointer-events-auto"
      >
        <motion.img
          src="/textures/Squire.png"
          alt="Squire logo"
          className="w-10 h-10 z-100 object-contain"
          style={{
            filter: useTransform(scrollYProgress, [0.9, 1], [
              'invert(0) brightness(1)',
              'invert(1) brightness(2)',
            ]),
          }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />

        <motion.span
          className="text-4xl font-bold tracking-tight select-none"
          style={{ color: textColor }}
        >
          Squire
        </motion.span>
      </motion.div>


      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: [0, 1, 1, 0], y: [0, -5, 0, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 text-gray-400 text-sm tracking-wide z-[60] pointer-events-none"
      >
        <div className="flex flex-col items-center space-y-2">
          <span>Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-[2px] h-5 bg-white/50 rounded-full"
          />
        </div>
      </motion.div>


    </div>
  )
}

