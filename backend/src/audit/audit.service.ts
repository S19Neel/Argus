import { Injectable } from '@nestjs/common';
import {
  AuditInputDto,
  AuditResultDto,
  OverallAuditStatus,
  ToolAuditBreakdownDto,
} from './dto/audit.dto';
import { evaluateToolAuditBreakdown } from './rules/audit-rules';

@Injectable()
export class AuditService {
  performAudit(input: AuditInputDto): AuditResultDto {
    const toolBreakdowns: ToolAuditBreakdownDto[] = input.tools.map((tool) =>
      evaluateToolAuditBreakdown(tool, input.teamSize, input.primaryUseCase),
    );

    const totalMonthlySavings =
      Math.round(
        toolBreakdowns.reduce((sum, item) => sum + item.monthlySavings, 0) *
          100,
      ) / 100;

    const totalAnnualSavings =
      Math.round(
        toolBreakdowns.reduce((sum, item) => sum + item.annualSavings, 0) * 100,
      ) / 100;

    let overallStatus: OverallAuditStatus = 'optimal';
    if (totalMonthlySavings >= 500) {
      overallStatus = 'high_savings';
    } else if (totalMonthlySavings >= 100) {
      overallStatus = 'moderate_savings';
    }

    return {
      toolBreakdowns,
      totalMonthlySavings,
      totalAnnualSavings,
      overallStatus,
    };
  }
}
