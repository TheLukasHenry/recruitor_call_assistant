export interface Candidate {
  id: string
  name: string
  email: string
  phone?: string
  skills: string[]
  experience: number
  location: string
  resumeUrl?: string
  status: CandidateStatus
  notes: string
  tenantId: string
  createdAt: Date
  updatedAt: Date
}

export type CandidateStatus = 
  | 'new'
  | 'screening'
  | 'interviewed'
  | 'offer_extended'
  | 'hired'
  | 'rejected'
  | 'withdrawn'

export interface Interview {
  id: string
  candidateId: string
  scheduledAt: Date
  duration: number
  type: InterviewType
  status: InterviewStatus
  interviewers: string[]
  notes: string
  score?: number
  feedback: string
  tenantId: string
  createdAt: Date
  updatedAt: Date
}

export type InterviewType = 'phone' | 'video' | 'in-person' | 'technical'
export type InterviewStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'rescheduled'

export interface JobPosition {
  id: string
  title: string
  description: string
  requirements: string[]
  location: string
  salaryRange: {
    min: number
    max: number
    currency: string
  }
  status: 'active' | 'paused' | 'closed'
  tenantId: string
  createdAt: Date
  updatedAt: Date
}

export interface ResumeData {
  personalInfo: {
    name: string
    email: string
    phone?: string
    location?: string
    linkedIn?: string
    github?: string
  }
  summary: string
  experience: WorkExperience[]
  education: Education[]
  skills: string[]
  certifications: string[]
  languages: string[]
}

export interface WorkExperience {
  company: string
  position: string
  startDate: Date
  endDate?: Date
  description: string
  technologies: string[]
}

export interface Education {
  institution: string
  degree: string
  field: string
  graduationDate: Date
  gpa?: number
}

export interface Tenant {
  id: string
  name: string
  subdomain: string
  settings: TenantSettings
  createdAt: Date
  updatedAt: Date
}

export interface TenantSettings {
  aiPersonality: string
  preferredVoice: string
  autoScheduling: boolean
  integrations: {
    calendly?: string
    greenhouse?: string
    workday?: string
    lever?: string
  }
  customPrompts: {
    system: string
    candidateSearch: string
    interviewScheduling: string
    resumeAnalysis: string
  }
}