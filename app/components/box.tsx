import * as THREE from 'three'
import React, { useRef, useEffect, useMemo, useState } from 'react'
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { TextureLoader, CanvasTexture } from 'three'
import { motion } from 'framer-motion'
import { useScrollPhase } from '../hooks/useScrollPhase'

// ---------- Texture Preloader ----------
function usePreloadTextures() {
  const gl = useThree((state) => state.gl)
  useEffect(() => {
    const loader = new TextureLoader(gl.manager)
    loader.load('/textures/squire.png', () => {})
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

  useFrame((state) => {
    if (!ref.current) return
    if (!isMerging && !isDone) {
      ref.current.position.lerp(radiusVec, 0.1)
      ref.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 2 + index) * 0.2
    }
  })

  return (
    <mesh
      ref={ref}
      position={radiusVec}
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

function OrbitingBoxes({
  collected,
  setCollected,
  onCollapseDone,
}: {
  collected: { id: string; color: string; tool: string }[]
  setCollected: React.Dispatch<
    React.SetStateAction<{ id: string; color: string; tool: string }[]>
  >
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
      const allCollapsedTime =
        total * collapseDurationPerBox + 0.6 // rough timing

      group.children.forEach((child, i) => {
        const boxDelay = i * collapseDurationPerBox
        const t = Math.min(Math.max(elapsed - boxDelay, 0) / 0.5, 1)
        if (t > 0) {
          const lerpFactor = 1 - Math.pow(1 - t, 3)
          // move *into* the center cube
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
  phase,
  cubeVisible,
  showTexture,
}: {
  phase: string
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

    // Fade cube visibility
    const targetOpacity = cubeVisible ? 1 : 0
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, delta * 3)

    // Switch texture only after merge done
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

// ---------- ThreePane ----------
export default function ThreePane({
  collected = [],
  onCubeVisibleChange,
}: {
  collected: { id: string; color: string; tool: string }[]
      onCubeVisibleChange?: (visible: boolean) => void

}) {
  const { phase } = useScrollPhase()
  const [showLogo, setShowLogo] = useState(false)
  const [cubeVisible, setCubeVisible] = useState(true)
  const [showTexture, setShowTexture] = useState(false)

  // Called when orbit collapse finishes
  const handleCollapseDone = () => {
    setShowTexture(true)
  }

  useEffect(() => {
    if (phase === 'done') {
      setCubeVisible(false)
      onCubeVisibleChange?.(false)   // 🔔 Notify parent: cube is gone
      const timeout = setTimeout(() => setShowLogo(true), 800)
      return () => clearTimeout(timeout)
    } else {
      setShowLogo(false)
      const timeout = setTimeout(() => {
        setCubeVisible(true)
        setShowTexture(false)
        onCubeVisibleChange?.(true)  // 🔔 Notify parent: cube is back
      }, 600)
      return () => clearTimeout(timeout)
    }
  }, [phase])

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
          phase={phase}
          cubeVisible={cubeVisible}
          showTexture={showTexture}
        />
        {phase !== 'done' && (
          <OrbitingBoxes
            collected={collected}
            setCollected={() => {}}
            onCollapseDone={handleCollapseDone}
          />
        )}
        <OrbitControls enableZoom={false} enablePan enableRotate />
      </Canvas>

      {/* Squire logo + wordmark */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showLogo ? 1 : 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        className="absolute top-8 left-10 flex items-center gap-3 pointer-events-auto"
      >
        <img
          src="/textures/Squire.png"
          alt="Squire logo"
          className="w-10 h-10 object-contain"
        />
        <span className="text-4xl font-bold text-black tracking-tight">
          Squire
        </span>
      </motion.div>
    </div>
  )
}
