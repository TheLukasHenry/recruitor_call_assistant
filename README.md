# Recruitor Call Assistant

A multi-tenant AI-powered voice assistant for recruitment professionals, built with Next.js 15, Vercel AI SDK 5.0, and Model Context Protocol (MCP).

## 🎯 Features

- **Voice-First Interface**: ChatGPT-style microphone with real-time speech recognition
- **AI-Powered Conversations**: Stream responses from GPT-4.1 with intelligent tool calling
- **Text-to-Speech**: High-quality voice synthesis using OpenAI TTS-1
- **Recruitment Tools**: Search candidates, schedule interviews, parse resumes, manage pipelines
- **Multi-Tenant Architecture**: Support multiple companies with isolated data
- **Real-time Audio Visualization**: Visual feedback during recording and playback

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **AI**: Vercel AI SDK 5.0 with streaming responses and tool calling
- **Models**: GPT-4.1 (primary) with Claude Sonnet 4 fallback via AI Gateway
- **Voice**: Web Speech API + OpenAI TTS-1 for speech synthesis
- **Context**: Model Context Protocol (MCP) for recruitment workflow integration
- **Database**: PostgreSQL with Prisma ORM (planned)
- **Deployment**: Vercel with AI Gateway

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- OpenAI API key
- Modern browser with speech recognition support (Chrome, Safari, Edge)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd recruitor_call_assistant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your API keys:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Browser Compatibility

- **Chrome**: Full support (recommended)
- **Safari**: Full support 
- **Edge**: Full support
- **Firefox**: Limited support (no speech recognition)

## 🎤 How to Use

1. **Voice Interaction**:
   - Click the microphone button to start recording
   - Speak your request clearly
   - Click again to stop and send to AI

2. **Quick Actions**:
   - Use predefined buttons for common tasks
   - Search candidates, schedule interviews, parse resumes

3. **Text-to-Speech**:
   - Click the speaker icon on AI responses to hear them
   - Adjustable voice speed and selection

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

### Project Structure

```
├── app/                    # Next.js 15 app directory
│   ├── api/               # API routes
│   │   ├── chat/          # AI chat endpoint
│   │   └── speech/        # Text-to-speech endpoint
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── voice-interface.tsx
│   ├── chat-history.tsx
│   └── audio-visualizer.tsx
├── hooks/                 # Custom React hooks
│   ├── use-chat.ts
│   ├── use-speech-recognition.ts
│   └── use-text-to-speech.ts
├── types/                 # TypeScript type definitions
│   ├── chat.ts
│   └── recruitment.ts
└── lib/                   # Utility functions
```

## 🤖 AI Features

### Available Tools

The AI assistant has access to these recruitment-specific tools:

- **searchCandidates**: Find candidates by skills, experience, location
- **scheduleInterview**: Book interviews with calendar integration
- **parseResume**: Extract structured data from resumes
- **getInterviewPipeline**: View scheduled and completed interviews

### Voice Recognition

- Continuous speech recognition with interim results
- Automatic silence detection
- Error handling for microphone permissions
- Real-time audio level visualization

### Text-to-Speech

- Multiple voice options (alloy, echo, fable, onyx, nova, shimmer)
- Adjustable speech speed (0.25x - 4.0x)
- High-quality MP3 audio format
- Audio caching for performance

## 🔮 Upcoming Features

- [ ] Multi-tenant authentication with NextAuth.js
- [ ] MCP servers for real recruitment system integration
- [ ] PostgreSQL database with Prisma ORM
- [ ] File upload for resume parsing
- [ ] Calendar integrations (Calendly, Google Calendar)
- [ ] ATS system connections (Greenhouse, Workday, Lever)
- [ ] Advanced analytics and reporting dashboard

## 🔒 Security Considerations

- API keys stored in environment variables only
- No client-side storage of sensitive data
- CORS protection on API endpoints
- Input validation and sanitization
- Rate limiting planned for production

## 📝 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | ✅ | OpenAI API key for GPT-4.1 and TTS |
| `ANTHROPIC_API_KEY` | ⚠️ | Claude API key for fallback model |
| `VERCEL_AI_GATEWAY_URL` | ❌ | AI Gateway URL for model routing |
| `DATABASE_URL` | ❌ | PostgreSQL connection string (future) |
| `NEXTAUTH_SECRET` | ❌ | Auth secret (future) |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Vercel AI SDK](https://sdk.vercel.ai/) for the excellent AI development tools
- [OpenAI](https://openai.com/) for GPT-4.1 and TTS capabilities
- [Anthropic](https://anthropic.com/) for Claude models
- [Model Context Protocol](https://modelcontextprotocol.io/) for standardized AI-tool integration