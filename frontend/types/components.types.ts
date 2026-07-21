import { ToolAuditBreakdownDto, ToolInputDto } from "./audit.types";

export interface ArgusLogoProps {
  className?: string;
  id?: string;
}

export interface ExecutiveSummaryCardProps {
  summaryParagraph?: string | null;
}

export interface LeadCaptureModalProps {
  shareSlug: string;
  teamSize: number;
}

export interface SavingsKpiCardsProps {
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  overallStatus: string;
  totalCurrentMonthlySpend: number;
}

export interface SpendComparisonChartsProps {
  toolBreakdowns: ToolAuditBreakdownDto[];
}

export interface ToolRecommendationsTableProps {
  toolBreakdowns: ToolAuditBreakdownDto[];
}

export interface ToolRowProps {
  tool: ToolInputDto;
  index: number;
  onToolChange: <K extends keyof ToolInputDto>(
    index: number,
    field: K,
    value: ToolInputDto[K],
  ) => void;
  onRemove: (index: number) => void;
}
