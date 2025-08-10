'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Mic, MicOff, Volume2, VolumeX, Settings } from 'lucide-react'
import { RecordingState, SpeechRecognitionResult } from '@/types/chat'
import AudioVisualizer from './audio-visualizer'
import { useSpeechRecognition } from '@/hooks/use-speech-recognition'

interface VoiceInterfaceProps {
  onMessage: (message: string) => void
  isLoading: boolean
}

export default function VoiceInterface({ onMessage, isLoading }: VoiceInterfaceProps) {
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    isProcessing: false,
    audioLevel: 0,
    duration: 0,
  })
  
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [currentTranscript, setCurrentTranscript] = useState('')
  const durationRef = useRef<NodeJS.Timeout>()

  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition()

  // Handle transcript changes
  useEffect(() => {
    if (transcript) {
      setCurrentTranscript(transcript)
    }
  }, [transcript])

  // Handle recording duration
  useEffect(() => {
    if (recordingState.isRecording) {
      durationRef.current = setInterval(() => {
        setRecordingState(prev => ({
          ...prev,
          duration: prev.duration + 1
        }))
      }, 1000)
    } else {
      if (durationRef.current) {
        clearInterval(durationRef.current)
      }
    }

    return () => {
      if (durationRef.current) {
        clearInterval(durationRef.current)
      }
    }
  }, [recordingState.isRecording])

  const handleStartRecording = useCallback(async () => {
    if (!browserSupportsSpeechRecognition) {
      alert('Your browser does not support speech recognition. Please use Chrome, Safari, or Edge.')
      return
    }

    try {
      await startListening()
      setRecordingState(prev => ({
        ...prev,
        isRecording: true,
        duration: 0
      }))
      resetTranscript()
      setCurrentTranscript('')
    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Could not start recording. Please check your microphone permissions.')
    }
  }, [browserSupportsSpeechRecognition, startListening, resetTranscript])

  const handleStopRecording = useCallback(() => {
    stopListening()
    setRecordingState(prev => ({
      ...prev,
      isRecording: false,
      isProcessing: true
    }))

    // Process the transcript
    setTimeout(() => {
      if (currentTranscript.trim()) {
        onMessage(currentTranscript)
        setCurrentTranscript('')
        resetTranscript()
      }
      
      setRecordingState(prev => ({
        ...prev,
        isProcessing: false,
        duration: 0
      }))
    }, 500)
  }, [stopListening, currentTranscript, onMessage, resetTranscript])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getRecordingButtonClass = () => {
    let baseClass = 'w-20 h-20 rounded-full flex items-center justify-center text-white font-semibold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2'
    
    if (recordingState.isRecording) {
      return `${baseClass} bg-red-500 hover:bg-red-600 focus:ring-red-300 recording-pulse`
    } else if (recordingState.isProcessing || isLoading) {
      return `${baseClass} bg-yellow-500 animate-pulse cursor-not-allowed`
    } else {
      return `${baseClass} bg-primary-600 hover:bg-primary-700 focus:ring-primary-300`
    }
  }

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="card text-center">
        <h3 className="font-semibold text-gray-900 mb-2">Voice Not Available</h3>
        <p className="text-sm text-gray-600 mb-4">
          Your browser doesn't support speech recognition. Please use Chrome, Safari, or Edge for voice features.
        </p>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="text-center">
        <h3 className="font-semibold text-gray-900 mb-4">Voice Assistant</h3>
        
        {/* Recording Button */}
        <div className="relative mb-6">
          <button
            onClick={recordingState.isRecording ? handleStopRecording : handleStartRecording}
            disabled={recordingState.isProcessing || isLoading}
            className={getRecordingButtonClass()}
          >
            {recordingState.isRecording ? (
              <MicOff size={32} />
            ) : recordingState.isProcessing || isLoading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            ) : (
              <Mic size={32} />
            )}
          </button>
          
          {/* Recording Duration */}
          {recordingState.isRecording && (
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
              <span className="text-sm font-mono text-red-600">
                {formatDuration(recordingState.duration)}
              </span>
            </div>
          )}
        </div>

        {/* Audio Visualizer */}
        <div className="mb-6">
          <AudioVisualizer 
            isActive={recordingState.isRecording} 
            audioLevel={recordingState.audioLevel}
          />
        </div>

        {/* Current Transcript */}
        {currentTranscript && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
            <p className="text-sm text-gray-700">{currentTranscript}</p>
          </div>
        )}

        {/* Status */}
        <div className="mb-4">
          {recordingState.isRecording ? (
            <p className="text-sm text-red-600 font-medium">Recording... Click to stop</p>
          ) : recordingState.isProcessing ? (
            <p className="text-sm text-yellow-600 font-medium">Processing...</p>
          ) : isLoading ? (
            <p className="text-sm text-blue-600 font-medium">AI is thinking...</p>
          ) : (
            <p className="text-sm text-gray-600">Click to start recording</p>
          )}
        </div>

        {/* Voice Settings */}
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            title={voiceEnabled ? 'Disable voice output' : 'Enable voice output'}
          >
            {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          
          <button
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            title="Voice settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}