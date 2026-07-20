export type PrimaryUseCase =
  | "coding"
  | "writing"
  | "design"
  | "data"
  | "data_analysis"
  | "research"
  | "customer_support"
  | "mixed";

export type RecommendedAction =
  | "switch_plan"
  | "switch_tool"
  | "switch_to_credits"
  | "downgrade"
  | "keep";

export type OverallAuditStatus =
  | "optimal"
  | "moderate_savings"
  | "high_savings";

export interface ToolInputDto {
  toolName: string;
  plan: string;
  seats: number;
  currentMonthlySpend: number;
}

export interface AuditInputDto {
  teamSize: number;
  primaryUseCase: PrimaryUseCase | string;
  tools: ToolInputDto[];
  _honeypot?: string;
}

export interface ToolAuditBreakdownDto {
  toolName: string;
  currentPlan: string;
  currentSpend: number;
  recommendedAction: RecommendedAction | string;
  recommendedPlanOrTool: string;
  estimatedMonthlyCost: number;
  monthlySavings: number;
  annualSavings: number;
  reason: string;
}

export interface PersistedAuditResultDto {
  id: string;
  shareSlug: string;
  toolBreakdowns: ToolAuditBreakdownDto[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  overallStatus: OverallAuditStatus | string;
  summaryParagraph?: string | null;
}

export interface AuditItemResponse {
  id: string;
  auditReportId: string;
  toolName: string;
  currentPlan: string;
  seats: number;
  currentSpend: number;
  recommendedAction: string;
  recommendedPlanOrTool: string;
  estimatedMonthlyCost: number;
  monthlySavings: number;
  annualSavings: number;
  reason: string;
}

export interface AuditReportDto {
  id: string;
  shareSlug: string;
  teamSize: number;
  primaryUseCase: string;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  overallStatus: string;
  summaryParagraph?: string | null;
  items: AuditItemResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface CaptureLeadDto {
  shareSlug: string;
  email: string;
  companyName?: string;
  role?: string;
  teamSize?: number;
  _honeypot?: string;
}
