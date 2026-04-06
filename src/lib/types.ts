import { BrandIdentityGenerationOutput } from "@/ai/flows/brand-identity-generation-flow";

export interface BusinessInfo {
  companyName: string;
  industry: string;
  targetAudience: string;
  uniqueSellingProposition: string;
  businessGoals: string;
  currentChallenges: string;
  competitors: string;
  companyVision: string;
  companyMission: string;
  productServiceDescription: string;
}

export type Step = 'onboarding' | 'reality-check' | 'brand-selection' | 'document-generation' | 'agents-planning' | 'finished';

export interface AgentPlan {
  agentName: string;
  agentRole: string;
  quarterlyGoals: string[];
  contentPillars?: string[];
  weeklyTasks: {
    week: number;
    tasks: string[];
  }[];
  strategicAdvice: string;
}

export interface WritingResult {
  agentName: string;
  type: 'post' | 'script' | 'article';
  content: any;
}

export interface AppState {
  currentStep: Step;
  businessInfo: BusinessInfo;
  brandIdentities: BrandIdentityGenerationOutput | null;
  selectedBrandIndex: number | null;
  documents: {
    brandIdentity: string;
    gtmStrategy: string;
    marketingCharter: string;
  } | null;
  agentPlans: {
    contentManager?: AgentPlan;
  } | null;
  writingResults: Record<string, WritingResult>; // key is taskId (e.g., "task-0-1")
}
