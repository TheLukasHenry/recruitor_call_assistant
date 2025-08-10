import { openai } from '@ai-sdk/openai'
import { gateway } from '@ai-sdk/gateway'
import { streamText, convertToModelMessages, tool, NoSuchToolError } from 'ai'
import { z } from 'zod'
import { NextRequest } from 'next/server'

// Define recruitment-specific tools
const recruitmentTools = {
  searchCandidates: tool({
    description: 'Search for candidates in the database with specific criteria',
    inputSchema: z.object({
      skills: z.array(z.string()).describe('Required skills'),
      experience: z.number().min(0).describe('Minimum years of experience'),
      location: z.string().optional().describe('Preferred location'),
      role: z.string().optional().describe('Job role or title'),
    }),
    execute: async ({ skills, experience, location, role }) => {
      // TODO: Implement actual candidate search via MCP server
      console.log('Searching candidates:', { skills, experience, location, role })
      
      // Mock response for now
      const mockCandidates = [
        {
          id: '1',
          name: 'John Doe',
          skills: skills,
          experience: experience + 1,
          location: location || 'San Francisco',
          email: 'john@example.com',
          matchScore: 95
        },
        {
          id: '2',
          name: 'Jane Smith',
          skills: [...skills, 'Leadership'],
          experience: experience + 2,
          location: location || 'New York',
          email: 'jane@example.com',
          matchScore: 88
        }
      ]

      return {
        candidates: mockCandidates,
        totalFound: mockCandidates.length,
        searchCriteria: { skills, experience, location, role }
      }
    },
  }),

  scheduleInterview: tool({
    description: 'Schedule an interview with a candidate',
    inputSchema: z.object({
      candidateId: z.string().describe('Candidate ID'),
      candidateName: z.string().describe('Candidate name'),
      datetime: z.string().describe('Interview date and time'),
      type: z.enum(['phone', 'video', 'in-person', 'technical']).describe('Interview type'),
      duration: z.number().default(60).describe('Duration in minutes'),
      interviewers: z.array(z.string()).optional().describe('List of interviewer names'),
    }),
    execute: async ({ candidateId, candidateName, datetime, type, duration, interviewers }) => {
      // TODO: Implement actual interview scheduling via MCP server
      console.log('Scheduling interview:', { candidateId, candidateName, datetime, type, duration, interviewers })
      
      const interviewId = `int_${Date.now()}`
      
      return {
        success: true,
        interviewId,
        scheduledFor: datetime,
        type,
        duration,
        candidateName,
        interviewers: interviewers || ['Hiring Manager'],
        message: `Interview scheduled successfully with ${candidateName} for ${datetime}`
      }
    },
  }),

  parseResume: tool({
    description: 'Parse and extract information from a resume',
    inputSchema: z.object({
      fileUrl: z.string().describe('URL or path to the resume file'),
      candidateName: z.string().optional().describe('Candidate name if known'),
    }),
    execute: async ({ fileUrl, candidateName }) => {
      // TODO: Implement actual resume parsing via MCP server
      console.log('Parsing resume:', { fileUrl, candidateName })
      
      // Mock parsed resume data
      const parsedData = {
        personalInfo: {
          name: candidateName || 'John Doe',
          email: 'john.doe@email.com',
          phone: '+1-555-123-4567',
          location: 'San Francisco, CA',
          linkedIn: 'linkedin.com/in/johndoe',
        },
        summary: 'Experienced software engineer with 5+ years in full-stack development',
        skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Python', 'AWS'],
        experience: [
          {
            company: 'Tech Corp',
            position: 'Senior Software Engineer',
            duration: '2020-2024',
            description: 'Led development of microservices architecture'
          }
        ],
        education: [
          {
            institution: 'University of California',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            year: '2018'
          }
        ]
      }

      return {
        success: true,
        resumeData: parsedData,
        extractedSkills: parsedData.skills.length,
        experienceYears: 5,
        message: `Successfully parsed resume for ${parsedData.personalInfo.name}`
      }
    },
  }),

  getInterviewPipeline: tool({
    description: 'Get current interview pipeline and scheduled interviews',
    inputSchema: z.object({
      timeframe: z.enum(['today', 'this-week', 'this-month']).default('this-week'),
      status: z.enum(['all', 'scheduled', 'completed', 'cancelled']).default('all'),
    }),
    execute: async ({ timeframe, status }) => {
      // TODO: Implement actual pipeline fetching via MCP server
      console.log('Getting interview pipeline:', { timeframe, status })
      
      const mockPipeline = [
        {
          id: 'int_1',
          candidateName: 'Alice Johnson',
          position: 'Frontend Developer',
          scheduledAt: '2024-01-15T14:00:00Z',
          type: 'video',
          status: 'scheduled',
          interviewers: ['John Manager', 'Jane Tech Lead']
        },
        {
          id: 'int_2',
          candidateName: 'Bob Wilson',
          position: 'Backend Engineer',
          scheduledAt: '2024-01-16T10:00:00Z',
          type: 'technical',
          status: 'scheduled',
          interviewers: ['Mike Senior Dev']
        }
      ]

      return {
        pipeline: mockPipeline,
        timeframe,
        totalInterviews: mockPipeline.length,
        byStatus: {
          scheduled: mockPipeline.filter(i => i.status === 'scheduled').length,
          completed: 0,
          cancelled: 0
        }
      }
    },
  }),
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()
    
    // Validate messages array
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Use AI Gateway only if both URL and API key are available, otherwise use direct OpenAI
    const hasGatewayCredentials = process.env.VERCEL_AI_GATEWAY_URL && 
      (process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN)
    
    const model = hasGatewayCredentials
      ? gateway('openai/gpt-4.1') 
      : openai('gpt-4-turbo') // Fallback to direct OpenAI model

    const result = streamText({
      model,
      system: `You are an AI recruitment assistant. You help recruiters with:
- Searching and filtering candidates
- Scheduling interviews
- Parsing resumes and extracting key information  
- Managing recruitment pipelines
- Providing insights on candidate matches

Be conversational, helpful, and professional. When using tools, explain what you're doing and provide clear summaries of results.

Always confirm important actions before executing them (like scheduling interviews).`,
      messages: messages, // Use messages directly without conversion for now
      tools: recruitmentTools,
      temperature: 0.7,
    })

    return result.toUIMessageStreamResponse({
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      onError: (error) => {
        if (NoSuchToolError.isInstance(error)) {
          return 'The model tried to call an unknown tool.'
        } else {
          return 'An error occurred while processing your request.'
        }
      },
    })
  } catch (error) {
    console.error('Error in chat API:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'An error occurred while processing your request.',
        details: process.env.NODE_ENV === 'development' ? (error as Error)?.message : undefined
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}