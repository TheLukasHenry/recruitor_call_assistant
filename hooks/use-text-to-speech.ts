'use client'

import { useState, useCallback, useRef } from 'react'

interface TTSOptions {
  voice?: string
  speed?: number
  format?: string
}

export function useTextToSpeech() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const speak = useCallback(async (text: string, options: TTSOptions = {}) => {
    try {
      setIsLoading(true)
      setError(null)

      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }

      // Abort any ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      abortControllerRef.current = new AbortController()

      const response = await fetch('/api/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voice: options.voice || 'alloy',
          speed: options.speed || 1.0,
          format: options.format || 'mp3',
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      
      const audio = new Audio(audioUrl)
      audioRef.current = audio

      // Set up audio event listeners
      audio.addEventListener('loadstart', () => {
        setIsLoading(false)
        setIsPlaying(true)
      })

      audio.addEventListener('ended', () => {
        setIsPlaying(false)
        URL.revokeObjectURL(audioUrl)
        audioRef.current = null
      })

      audio.addEventListener('error', (e) => {
        console.error('Audio playback error:', e)
        setError('Failed to play audio')
        setIsPlaying(false)
        setIsLoading(false)
        URL.revokeObjectURL(audioUrl)
        audioRef.current = null
      })

      // Play the audio
      await audio.play()

    } catch (error) {
      console.error('Text-to-speech error:', error)
      
      if ((error as Error)?.name === 'AbortError') {
        console.log('Speech generation was aborted')
        return
      }
      
      setError((error as Error)?.message || 'Failed to generate speech')
      setIsPlaying(false)
      setIsLoading(false)
    }
  }, [])

  const stop = useCallback(() => {
    // Abort ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Stop audio playback
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }

    setIsPlaying(false)
    setIsLoading(false)
  }, [])

  const pause = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }, [])

  const resume = useCallback(() => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }, [])

  return {
    speak,
    stop,
    pause,
    resume,
    isPlaying,
    isLoading,
    error,
  }
}