import {
  IsArray,
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export type ToolName =
  | 'Cursor'
  | 'GitHub Copilot'
  | 'Claude'
  | 'ChatGPT'
  | 'Anthropic API'
  | 'OpenAI API'
  | 'Gemini'
  | 'Gemini API'
  | 'Windsurf'
  | 'v0';

export type PrimaryUseCase =
  'coding' | 'writing' | 'data' | 'research' | 'mixed';

export type RecommendedAction =
  'keep' | 'switch_plan' | 'switch_tool' | 'switch_to_credits' | 'downgrade';

export type OverallAuditStatus =
  'optimal' | 'moderate_savings' | 'high_savings';

export class ToolItemInputDto {
  @IsString()
  @IsNotEmpty()
  toolName: string;

  @IsString()
  @IsNotEmpty()
  plan: string;

  @IsInt()
  @Min(1)
  seats: number;

  @IsNumber()
  @Min(0)
  currentMonthlySpend: number;
}

export class AuditInputDto {
  @IsInt()
  @Min(1)
  teamSize: number;

  @IsString()
  @IsIn(['coding', 'writing', 'data', 'research', 'mixed'])
  primaryUseCase: PrimaryUseCase;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ToolItemInputDto)
  @ArrayMinSize(1)
  tools: ToolItemInputDto[];
}

export class ToolAuditBreakdownDto {
  toolName: string;
  currentPlan: string;
  currentSpend: number;
  recommendedAction: RecommendedAction;
  recommendedPlanOrTool: string;
  estimatedMonthlyCost: number;
  monthlySavings: number;
  annualSavings: number;
  reason: string;
}

export class AuditResultDto {
  toolBreakdowns: ToolAuditBreakdownDto[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  overallStatus: OverallAuditStatus;
}

export class PersistedAuditResultDto extends AuditResultDto {
  id: string;
  shareSlug: string;
}

export class CaptureLeadDto {
  @IsString()
  @IsNotEmpty()
  shareSlug: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  companyName?: string;

  @IsString()
  @IsOptional()
  role?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  teamSize?: number;
}
