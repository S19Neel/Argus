import { Injectable, NotFoundException } from '@nestjs/common';
import {
  AuditInputDto,
  AuditResultDto,
  CaptureLeadDto,
  OverallAuditStatus,
  PersistedAuditResultDto,
  ToolAuditBreakdownDto,
} from './dto/audit.dto';
import { evaluateToolAuditBreakdown } from './rules/audit-rules';
import { PrismaService } from 'src/prisma/prisma.service';
import { AiService } from 'src/ai/ai.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuditService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,
    private readonly mailService: MailService,
  ) {}

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

  async analyzeAndSaveAudit(
    input: AuditInputDto,
  ): Promise<PersistedAuditResultDto> {
    const result = this.performAudit(input);
    const summaryParagraph = await this.aiService.generateSummary(
      result,
      input,
    );

    const report = await this.prisma.auditReport.create({
      data: {
        teamSize: input.teamSize,
        primaryUseCase: input.primaryUseCase,
        totalMonthlySavings: result.totalMonthlySavings,
        totalAnnualSavings: result.totalAnnualSavings,
        overallStatus: result.overallStatus,
        summaryParagraph,
        items: {
          create: result.toolBreakdowns.map((item) => {
            const inputTool =
              input.tools.find(
                (t) =>
                  t.toolName === item.toolName && t.plan === item.currentPlan,
              ) || input.tools.find((t) => t.toolName === item.toolName);
            return {
              toolName: item.toolName,
              currentPlan: item.currentPlan,
              seats: inputTool?.seats ?? input.teamSize,
              currentSpend: item.currentSpend,
              recommendedAction: item.recommendedAction,
              recommendedPlanOrTool: item.recommendedPlanOrTool,
              estimatedMonthlyCost: item.estimatedMonthlyCost,
              monthlySavings: item.monthlySavings,
              annualSavings: item.annualSavings,
              reason: item.reason,
            };
          }),
        },
      },
      include: { items: true },
    });

    return {
      ...result,
      id: report.id,
      shareSlug: report.shareSlug,
      summaryParagraph: report.summaryParagraph,
    };
  }

  async getAuditBySlug(slug: string) {
    const report = await this.prisma.auditReport.findUnique({
      where: { shareSlug: slug },
      include: { items: true },
    });

    if (!report) {
      throw new NotFoundException(
        'Audit report not found for this share link.',
      );
    }

    const { leadId, ...publicReport } = report;
    return publicReport;
  }

  async captureLeadForAudit(dto: CaptureLeadDto) {
    const report = await this.prisma.auditReport.findUnique({
      where: { shareSlug: dto.shareSlug },
    });

    if (!report) {
      throw new NotFoundException(
        'Audit report not found for this share link.',
      );
    }

    const lead = await this.prisma.lead.upsert({
      where: { email: dto.email },
      update: {
        companyName: dto.companyName ?? undefined,
        role: dto.role ?? undefined,
        teamSize: dto.teamSize ?? undefined,
      },
      create: {
        email: dto.email,
        companyName: dto.companyName,
        role: dto.role,
        teamSize: dto.teamSize ?? report.teamSize,
      },
    });

    await this.prisma.auditReport.update({
      where: { id: report.id },
      data: { leadId: lead.id },
    });

    this.mailService
      .sendAuditConfirmationEmail(
        dto.email,
        report.shareSlug,
        report.totalMonthlySavings,
        report.totalAnnualSavings,
        dto.teamSize ?? report.teamSize,
        report.summaryParagraph ?? undefined,
      )
      .catch(() => {
        // Logged internally by MailService
      });

    return {
      success: true,
      leadId: lead.id,
      shareSlug: report.shareSlug,
    };
  }
}
