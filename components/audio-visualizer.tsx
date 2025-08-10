'use client'

import { useEffect, useState } from 'react'

interface AudioVisualizerProps {
  isActive: boolean
  audioLevel?: number
}

export default function AudioVisualizer({ isActive, audioLevel = 0 }: AudioVisualizerProps) {
  const [bars, setBars] = useState(Array(8).fill(0))

  useEffect(() => {
    let animationFrame: number

    const animateBars = () => {
      if (isActive) {
        setBars(prev => prev.map(() => Math.random() * 20 + 4))
        animationFrame = requestAnimationFrame(animateBars)
      } else {
        setBars(Array(8).fill(4))
      }
    }

    animateBars()

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [isActive])

  return (
    <div className="flex items-center justify-center h-8 space-x-1">
      {bars.map((height, index) => (
        <div
          key={index}
          className={`w-1 bg-current rounded-full transition-all duration-100 ${
            isActive ? 'text-primary-600' : 'text-gray-300'
          }`}
          style={{
            height: `${height}px`,
            transform: isActive ? `scaleY(${1 + audioLevel * 0.5})` : 'scaleY(1)',
          }}
        />
      ))}
    </div>
  )
}