export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  toolCalls?: ToolCall[]
  audioUrl?: string
}

export interface ToolCall {
  id: string
  name: string
  arguments: Record<string, any>
  result?: any
}

export interface VoiceSettings {
  enabled: boolean
  autoPlay: boolean
  voice: string
  speed: number
  pitch: number
}

export interface RecordingState {
  isRecording: boolean
  isProcessing: boolean
  audioLevel: number
  duration: number
}

export interface SpeechRecognitionResult {
  transcript: string
  confidence: number
  isFinal: boolean
}