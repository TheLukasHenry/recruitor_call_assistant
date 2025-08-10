#!/usr/bin/env node

/**
 * Test Script for Recruiter Call Assistant
 * 
 * This script demonstrates how to test the voice-enabled recruitment system
 * including chat API and speech generation endpoints.
 */

const BASE_URL = 'http://localhost:3002';

// Test the chat API with a recruitment query
async function testChatAPI() {
  console.log('\n🤖 Testing Chat API...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: 'I need to find React developers with at least 3 years of experience in San Francisco'
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    console.log('✅ Chat API Response received');
    console.log('📡 Streaming response (first few chunks):');
    
    const reader = response.body?.getReader();
    if (reader) {
      for (let i = 0; i < 3; i++) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = new TextDecoder().decode(value);
        console.log(`   Chunk ${i + 1}: ${chunk.substring(0, 100)}...`);
      }
      reader.releaseLock();
    }
    
  } catch (error) {
    console.error('❌ Chat API Error:', error.message);
    if (error.message.includes('ECONNREFUSED')) {
      console.log('💡 Make sure the server is running on http://localhost:3001');
    }
  }
}

// Test the speech API
async function testSpeechAPI() {
  console.log('\n🔊 Testing Speech API...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/speech`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: 'Hello! I am your AI recruitment assistant. How can I help you today?',
        voice: 'alloy',
        speed: 1.1
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const audioBuffer = await response.arrayBuffer();
    console.log('✅ Speech API Response received');
    console.log(`🎵 Generated audio: ${audioBuffer.byteLength} bytes`);
    console.log('📂 Audio format: MP3');
    console.log('🎤 Voice: alloy');
    
  } catch (error) {
    console.error('❌ Speech API Error:', error.message);
    if (error.message.includes('API key')) {
      console.log('💡 Add your OpenAI API key to .env.local to test speech generation');
    }
  }
}

// Test system health
async function testSystemHealth() {
  console.log('\n🏥 Testing System Health...');
  
  try {
    const response = await fetch(`${BASE_URL}/`);
    
    if (response.ok) {
      console.log('✅ Main application is running');
      console.log(`🌐 Access the app at: ${BASE_URL}`);
    } else {
      console.log(`⚠️ Main app returned status: ${response.status}`);
    }
  } catch (error) {
    console.error('❌ System Health Error:', error.message);
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting Recruiter Call Assistant System Tests');
  console.log('================================================');
  
  await testSystemHealth();
  await testChatAPI();
  await testSpeechAPI();
  
  console.log('\n✅ Test suite completed!');
  console.log('\n📋 Next Steps:');
  console.log('1. Open http://localhost:3002 in a modern browser (Chrome/Safari/Edge)');
  console.log('2. Allow microphone access when prompted');
  console.log('3. Click the microphone button and speak your recruitment query');
  console.log('4. Try the quick action buttons for common tasks');
  console.log('5. Click the speaker icon on AI responses to hear them');
}

// Run the tests
runTests().catch(console.error);