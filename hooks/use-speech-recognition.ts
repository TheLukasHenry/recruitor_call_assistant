'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
/// <reference path="../types/speech-recognition.d.ts" />

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  // Check if speech recognition is supported
  const browserSupportsSpeechRecognition = typeof window !== 'undefined' && 
    (('SpeechRecognition' in window) || ('webkitSpeechRecognition' in window))

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) return

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognitionRef.current = new SpeechRecognition()

    const recognition = recognitionRef.current

    // Configure recognition
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = ''
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        const transcript = result[0].transcript

        if (result.isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }

      setTranscript(prev => prev + finalTranscript)
      setInterimTranscript(interimTranscript)
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error, event.message)
      setIsListening(false)
      
      if (event.error === 'not-allowed') {
        console.log('Microphone access was denied. Please allow microphone access and try again.')
      } else if (event.error === 'no-speech') {
        console.log('No speech detected - this is normal, continuing...')
      } else if (event.error === 'audio-capture') {
        console.log('No microphone was found. Please ensure you have a microphone connected.')
      } else if (event.error === 'network') {
        console.log('Network error occurred during speech recognition. This is often temporary.')
      } else {
        console.log('Speech recognition error:', event.error)
      }
    }

    recognition.onend = () => {
      setIsListening(false)
      setInterimTranscript('')
    }

    return () => {
      if (recognition) {
        recognition.abort()
      }
    }
  }, [browserSupportsSpeechRecognition])

  const startListening = useCallback(async () => {
    if (!recognitionRef.current || isListening) return

    try {
      // Request microphone permission first
      await navigator.mediaDevices.getUserMedia({ audio: true })
      recognitionRef.current.start()
    } catch (error) {
      console.error('Error starting speech recognition:', error)
      throw error
    }
  }, [isListening])

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }, [isListening])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    setInterimTranscript('')
  }, [])

  // Get the complete transcript including interim results
  const fullTranscript = transcript + interimTranscript

  return {
    isListening,
    transcript: fullTranscript,
    finalTranscript: transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  }
}