'use client'

import VoiceInterface from '@/components/voice-interface'
import ChatHistory from '@/components/chat-history'
import { useChat } from '@/hooks/use-chat'

export default function HomePage() {
  const { messages, isLoading, sendMessage, clearMessages } = useChat()

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Recruitor Call Assistant
        </h1>
        <p className="text-lg text-gray-600">
          Your AI-powered recruitment companion
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chat History */}
        <div className="lg:col-span-2">
          <ChatHistory 
            messages={messages} 
            isLoading={isLoading}
          />
        </div>

        {/* Voice Interface */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <VoiceInterface 
              onMessage={sendMessage}
              isLoading={isLoading}
            />
            
            {/* Quick Actions */}
            <div className="mt-6 card">
              <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button 
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => sendMessage('Search for React developers in San Francisco')}
                >
                  🔍 Search candidates
                </button>
                <button 
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => sendMessage('Schedule an interview for tomorrow at 2 PM')}
                >
                  📅 Schedule interview
                </button>
                <button 
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => sendMessage('Parse the latest resume I uploaded')}
                >
                  📄 Parse resume
                </button>
                <button 
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => sendMessage('Show me my interview pipeline for this week')}
                >
                  📊 View pipeline
                </button>
              </div>
              
              {/* Clear Chat */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button 
                  className="w-full text-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  onClick={clearMessages}
                >
                  🗑️ Clear conversation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}