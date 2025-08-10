'use client'

import { useEffect, useRef } from 'react'
import { Message } from '@/types/chat'
import { User, Bot, Volume2, Clock, VolumeX, Loader } from 'lucide-react'
import { useTextToSpeech } from '@/hooks/use-text-to-speech'

interface ChatHistoryProps {
  messages: Message[]
  isLoading: boolean
}

export default function ChatHistory({ messages, isLoading }: ChatHistoryProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { speak, stop, isPlaying, isLoading: isTTSLoading } = useTextToSpeech()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const playMessageAudio = async (message: Message) => {
    if (isPlaying) {
      stop()
    } else {
      await speak(message.content, { voice: 'alloy', speed: 1.1 })
    }
  }

  return (
    <div className="card h-[600px] flex flex-col">
      <div className="border-b border-gray-200 pb-4 mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Conversation</h2>
        <p className="text-sm text-gray-600">
          {messages.length > 1 ? `${messages.length - 1} messages` : 'Start a conversation'}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex max-w-[80%] ${
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === 'user'
                    ? 'bg-primary-600 text-white ml-3'
                    : 'bg-gray-200 text-gray-600 mr-3'
                }`}
              >
                {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>

              {/* Message Content */}
              <div
                className={`px-4 py-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                
                {/* Message Actions */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-opacity-20 border-gray-300">
                  <div className="flex items-center text-xs opacity-75">
                    <Clock size={12} className="mr-1" />
                    {formatTime(message.timestamp)}
                  </div>
                  
                  {message.role === 'assistant' && (
                    <button
                      onClick={() => playMessageAudio(message)}
                      className="text-xs hover:bg-white hover:bg-opacity-20 p-1 rounded transition-colors flex items-center"
                      title={isPlaying ? "Stop audio" : "Play audio"}
                      disabled={isTTSLoading}
                    >
                      {isTTSLoading ? (
                        <Loader size={12} className="animate-spin" />
                      ) : isPlaying ? (
                        <VolumeX size={12} />
                      ) : (
                        <Volume2 size={12} />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 text-gray-600 mr-3 flex items-center justify-center">
                <Bot size={16} />
              </div>
              <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-lg">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}