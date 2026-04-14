'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface CV3DProps {
  isDark: boolean
}

export default function CV3DVisualization({ isDark }: CV3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const particlesRef = useRef<THREE.Points | null>(null)
  const animationIdRef = useRef<number | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    try {
      // Scene setup
      const scene = new THREE.Scene()
    sceneRef.current = scene
    scene.background = new THREE.Color(isDark ? 0x0f172a : 0xffffff)
    scene.fog = new THREE.Fog(isDark ? 0x0f172a : 0xffffff, 50, 200)

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 30
    cameraRef.current = camera

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Create particle system for CV data
    const particlesGeometry = new THREE.BufferGeometry()
    const particleCount = 1000
    const positionArray = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount * 3; i += 3) {
      positionArray[i] = (Math.random() - 0.5) * 100
      positionArray[i + 1] = (Math.random() - 0.5) * 100
      positionArray[i + 2] = (Math.random() - 0.5) * 100
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.7,
      color: isDark ? 0xa855f7 : 0x06b6d4,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    })

    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particles)
    particlesRef.current = particles

    // Create text-like floating objects for skills
    const skills = ['Python', 'ML', 'AI', 'Data', 'JS', 'React', 'SQL', 'Julia']
    const skillObjects: THREE.Group[] = []

    skills.forEach((skill, index) => {
      const group = new THREE.Group()
      const angle = (index / skills.length) * Math.PI * 2
      const radius = 20
      
      group.position.x = Math.cos(angle) * radius
      group.position.y = Math.sin(angle) * radius
      group.position.z = Math.random() * 10 - 5

      // Create a simple cube for each skill
      const geometry = new THREE.BoxGeometry(2, 2, 2)
      const material = new THREE.MeshPhongMaterial({
        color: isDark ? 0x06b6d4 + (index * 0x111111) : 0xa855f7 + (index * 0x111111),
        emissive: isDark ? 0xa855f7 : 0x06b6d4,
        emissiveIntensity: 0.3,
      })
      const cube = new THREE.Mesh(geometry, material)
      group.add(cube)

      scene.add(group)
      skillObjects.push(group)
    })

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(isDark ? 0xa855f7 : 0x06b6d4, 1, 100)
    pointLight.position.set(20, 20, 20)
    scene.add(pointLight)

    // Mouse tracking
    let mouseX = 0
    let mouseY = 0

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1
    }

    window.addEventListener('mousemove', onMouseMove)

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate)

      // Rotate particles
      if (particles) {
        particles.rotation.x += 0.0001
        particles.rotation.y += 0.0003
      }

      // Animate skill objects
      skillObjects.forEach((obj, index) => {
        obj.rotation.x += 0.005
        obj.rotation.y += 0.008
        obj.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01
      })

      // Camera follows mouse
      camera.position.x = mouseX * 5
      camera.position.y = mouseY * 5
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
    }

    animate()

    // Handle window resize
    const onWindowResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight

      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener('resize', onWindowResize)

      // Cleanup
      return () => {
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('resize', onWindowResize)
        if (animationIdRef.current) {
          cancelAnimationFrame(animationIdRef.current)
        }
        if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
          containerRef.current.removeChild(renderer.domElement)
        }
        renderer.dispose()
      }
    } catch (error) {
      console.error('Failed to initialize 3D visualization:', error)
      return () => {}
    }
  }, [isDark])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: isDark ? '#0f172a' : '#ffffff' }}
    />
  )
}
