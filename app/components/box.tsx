import * as THREE from 'three'
import React, { useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import { useSpring, animated } from '@react-spring/three'
import { TextureLoader, CanvasTexture } from 'three'
import { useScrollPhase } from '../hooks/useScrollPhase'

function usePreloadTextures() {
  const gl = useThree((state) => state.gl)
  useEffect(() => {
    const loader = new TextureLoader(gl.manager)
    loader.load('/textures/squire.png', () => {
    })
  }, [gl])
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
  const radius = 3
  const angle = (index / total) * Math.PI * 2


  const baseTexture = useLoader(TextureLoader, `/textures/${tool}.png`)
  baseTexture.colorSpace = THREE.SRGBColorSpace

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, 512, 512)
    const size = 512 * 0.4
    ctx.drawImage(baseTexture.image, 256 - size / 2, 256 - size / 2, size, size)
    const t = new CanvasTexture(canvas)
    t.needsUpdate = true
    return t
  }, [baseTexture])

  const { position, scale } = useSpring({
    from: { position: [0, 0, 0], scale: 0 },
    to: {
      position:
        isMerging || isDone
          ? [0, 0, 0]
          : [radius * Math.cos(angle), 0, radius * Math.sin(angle)],
      scale: isMerging || isDone ? 0 : 1,
    },
    config: { mass: 1, tension: 100, friction: 18 },
  })

  useFrame((state) => {
    if (ref.current && !isMerging && !isDone) {
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 2 + index) * 0.2
    }
  })

  return (
    <animated.mesh
      ref={ref}
      position={position as any}
      scale={scale as any}
      onClick={(e) => {
        e.stopPropagation()
        onClick(id)
      }}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial map={texture} />
    </animated.mesh>
  )
}


function OrbitingBoxes({
  collected,
  setCollected,
}: {
  collected: { id: string; color: string; tool: string }[]
  setCollected: React.Dispatch<
    React.SetStateAction<{ id: string; color: string; tool: string }[]>
  >
}) {
  const groupRef = useRef<THREE.Group>(null!)
  const { phase } = useScrollPhase()
  const isMerging = phase === 'merge'
  const isDone = phase === 'done'

  // Collapse animation tracking
  const collapseStart = useRef<number | null>(null)
  const collapseDurationPerBox = 0.25 // seconds per box delay


useFrame((state, delta) => {
  const group = groupRef.current
  if (!group) return

  const total = group.children.length
  if (total === 0) return

  if (!isMerging && !isDone) {
    // ✅ When not merging, restore normal rotation + layout
    group.rotation.y += delta * 0.4
    group.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05

    // Smoothly return boxes to orbit
    group.children.forEach((child, i) => {
      const radius = 3
      const angle = (i / total) * Math.PI * 2
      const target = new THREE.Vector3(
        radius * Math.cos(angle),
        Math.sin(state.clock.elapsedTime * 2 + i) * 0.2,
        radius * Math.sin(angle)
      )
      child.position.lerp(target, 0.1)
      child.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
    })

    collapseStart.current = null // reset merge timer
  }

  if (isMerging) {
    if (collapseStart.current === null)
      collapseStart.current = state.clock.elapsedTime
    const elapsed = state.clock.elapsedTime - collapseStart.current
    const collapseDurationPerBox = 0.25

    group.children.forEach((child, i) => {
      const boxDelay = i * collapseDurationPerBox
      const t = Math.min(Math.max(elapsed - boxDelay, 0) / 0.5, 1)
      if (t > 0) {
        const lerpFactor = 1 - Math.pow(1 - t, 3)
        child.position.lerp(new THREE.Vector3(0, 0, 0), lerpFactor * delta * 6)
        child.scale.lerp(new THREE.Vector3(0, 0, 0), lerpFactor * delta * 8)
      }
    })
  }
})


  const handleClick = (id: string) => {
    if (isMerging || isDone) return
    setCollected((prev) => prev.filter((b) => b.id !== id))
    setTimeout(() => {
      setCollected((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 9),
          color: 'black',
          tool: 'gmail',
        },
      ])
    }, 500)
  }

  return (
    <group ref={groupRef} visible={!isDone}>
      {collected.map((box, i) => (
        <AnimatedBox
          key={box.id}
          id={box.id}
          index={i}
          total={collected.length}
          isMerging={false} // let OrbitingBoxes handle collapse instead
          isDone={isDone}
          onClick={handleClick}
          tool={box.tool}
        />
      ))}
    </group>
  )
}



function CenterCube({ phase }: { phase: string }) {
  const ref = useRef<THREE.Mesh>(null!)
  const materialRef = useRef<THREE.MeshStandardMaterial>(null!)

  // Load texture for Squire logo
  const texture = useLoader(TextureLoader, '/textures/Squire.png')
  texture.colorSpace = THREE.SRGBColorSpace
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.needsUpdate = true

  useFrame((_, delta) => {
    if (!ref.current || !materialRef.current) return

    // rotation (constant)
    ref.current.rotation.x += delta * 0.4
    ref.current.rotation.y += delta * 0.25

    const mat = materialRef.current

    if (phase === 'merge') {
      mat.opacity = Math.min(mat.opacity + delta * 2, 1)
      mat.map = null
      mat.color.set('#000000')
    } 
    else if (phase === 'done') {
        if (!mat.map) {
          mat.map = texture
          mat.needsUpdate = true
        }

      mat.color.lerp(new THREE.Color('white'), delta * 5)

      if (mat.color.equals(new THREE.Color('white'))) {
        mat.opacity = Math.max(0, mat.opacity - delta * 0.8)
      }
    } 
    else {
      mat.map = null
      mat.color.set('#000000')
      mat.opacity = Math.min(mat.opacity + delta * 2, 1)
    }
  })

  return (
    <mesh ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        ref={materialRef}
        color={'#000000'}
        emissive={'#000000'}
        emissiveIntensity={0.2}
        transparent
        opacity={1}
        metalness={0}
        roughness={1}
      />
    </mesh>
  )
}

export default function ThreePane({
  collected = [],
}: {
  collected: { id: string; color: string; tool: string }[]
}) {
  const { phase } = useScrollPhase()

  return (
    <div className="w-screen h-screen pointer-events-none">
      <Canvas
        style={{ pointerEvents: 'none', zIndex: 10 }}
        camera={{ position: [0, 5, 10], fov: 50 }}
      >
        <TexturePreloader />

        <ambientLight intensity={Math.PI / 2} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.2}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
        />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        
        <CenterCube phase={phase} />
        {phase !== 'done' && (
          <OrbitingBoxes collected={collected} setCollected={() => {}} />
        )}

        <OrbitControls enableZoom={false} enablePan enableRotate />
      </Canvas>
    </div>
  )
}
