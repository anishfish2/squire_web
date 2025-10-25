import * as THREE from 'three'
import React, { useRef, useEffect, useMemo, useState } from 'react'
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { TextureLoader, CanvasTexture } from 'three'
import { motion, useTransform } from 'framer-motion'
import { useScrollPhase } from '../hooks/useScrollPhase'

import { useGlobalScroll } from '../hooks/useGlobalScroll'

// ---------- Texture Preloader ----------
function usePreloadTextures() {
  const gl = useThree((state) => state.gl)
  useEffect(() => {
    const loader = new TextureLoader(gl.manager)
    loader.load('/textures/Squire.png', () => {})
  }, [gl])
}
function TexturePreloader() {
  usePreloadTextures()
  return null
}

// ---------- Animated Orbiting Boxes ----------
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
  const radius = 3
  const angle = (index / total) * Math.PI * 2
  const baseTexture = useLoader(TextureLoader, `/textures/${tool}.png`)
  baseTexture.colorSpace = THREE.SRGBColorSpace

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')!
    const size = 512 * 0.4
    ctx.drawImage(baseTexture.image, 256 - size / 2, 256 - size / 2, size, size)
    const t = new CanvasTexture(canvas)
    t.needsUpdate = true
    return t
  }, [baseTexture])

  const radiusVec = useMemo(
    () => new THREE.Vector3(radius * Math.cos(angle), 0, radius * Math.sin(angle)),
    [radius, angle]
  )

  const [spawnProgress, setSpawnProgress] = useState(0)

  useFrame((state, delta) => {
    if (!ref.current) return

    if (!isMerging && !isDone) {
      // Ease outward + scale up from small
      setSpawnProgress((p) => Math.min(p + delta * 1.5, 1))
      const eased = 1 - Math.pow(1 - spawnProgress, 3) // easeOutCubic

      // Position grows outward
      const pos = radiusVec.clone().multiplyScalar(eased)
      ref.current.position.lerp(pos, 0.2)

      // Scale grows from tiny to full size
      const targetScale = new THREE.Vector3(eased, eased, eased)
      ref.current.scale.lerp(targetScale, 0.15)

      // Subtle float motion
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 2 + index) * 0.2
    }
  })

  return (
    <mesh
      ref={ref}
      position={[0, 0, 0]} // start at center
      scale={[0.001, 0.001, 0.001]} // start small
      onClick={(e) => {
        e.stopPropagation()
        onClick(id)
      }}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
}

// ---------- Orbiting Boxes Group ----------
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
          onClick={() => {}}
          tool={box.tool}
        />
      ))}
    </group>
  )
}

// ---------- CenterCube ----------
function CenterCube({
  cubeVisible,
  showTexture,
}: {
  cubeVisible: boolean
  showTexture: boolean
}) {
  const ref = useRef<THREE.Mesh>(null!)
  const matRef = useRef<THREE.MeshStandardMaterial>(null!)
  const texture = useLoader(TextureLoader, '/textures/Squire.png')
  texture.colorSpace = THREE.SRGBColorSpace
  texture.needsUpdate = true

  useFrame((_, delta) => {
    if (!ref.current || !matRef.current) return
    const mat = matRef.current
    ref.current.rotation.x += delta * 0.4
    ref.current.rotation.y += delta * 0.25

    const targetOpacity = cubeVisible ? 1 : 0
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, delta * 3)

    mat.map = showTexture ? texture : null
    mat.color.set(showTexture ? '#ffffff' : '#000000')
    mat.needsUpdate = true
  })

  return (
    <mesh ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        ref={matRef}
        transparent
        opacity={1}
        color={'#000000'}
        roughness={1}
      />
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
    className="w-10 h-10 object-contain"
    style={{
      // Fade to white as scroll approaches hero section (same range as text)
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
    </div>
  )
}

