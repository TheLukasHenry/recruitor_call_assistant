import { openai } from '@ai-sdk/openai'
import { experimental_generateSpeech as generateSpeech } from 'ai'
import { NextRequest } from 'next/server'

// Define valid voice options for type safety
type VoiceOption = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'
type FormatOption = 'mp3' | 'opus' | 'aac' | 'flac'

export async function POST(request: NextRequest) {
  try {
    const { text, voice = 'alloy', format = 'mp3', speed = 1.0 } = await request.json()

    if (!text || text.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Text is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Validate voice and format options
    const validVoices: VoiceOption[] = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']
    const validFormats: FormatOption[] = ['mp3', 'opus', 'aac', 'flac']
    
    if (!validVoices.includes(voice)) {
      return new Response(
        JSON.stringify({ error: `Invalid voice. Must be one of: ${validVoices.join(', ')}` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (!validFormats.includes(format)) {
      return new Response(
        JSON.stringify({ error: `Invalid format. Must be one of: ${validFormats.join(', ')}` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Generate speech using OpenAI TTS-1 with provider options
    const result = await generateSpeech({
      model: openai.speech('tts-1'),
      text: text.trim(),
      voice: voice as VoiceOption,
      outputFormat: format,
      speed: Math.max(0.25, Math.min(4.0, speed)), // Clamp speed between 0.25 and 4.0
      providerOptions: {
        openai: {
          response_format: format as 'mp3' | 'opus' | 'aac' | 'flac' | 'wav' | 'pcm',
          speed: Math.max(0.25, Math.min(4.0, speed))
        }
      }
    })

    // Return the audio data as a blob response
    const audioData = result.audio.uint8Array
    
    return new Response(audioData as unknown as ArrayBuffer, {
      headers: {
        'Content-Type': `audio/${format}`,
        'Content-Disposition': 'inline; filename="speech.mp3"',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      }
    })
  } catch (error) {
    console.error('Error generating speech:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate speech',
        details: process.env.NODE_ENV === 'development' ? (error as Error)?.message : undefined
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      }
    )
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  })
}