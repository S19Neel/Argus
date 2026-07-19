import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuditService } from './audit.service';
import {
  AuditInputDto,
  CaptureLeadDto,
  PersistedAuditResultDto,
} from './dto/audit.dto';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Post()
  async analyze(
    @Body() input: AuditInputDto,
  ): Promise<PersistedAuditResultDto> {
    return this.auditService.analyzeAndSaveAudit(input);
  }

  @Post('analyze')
  async analyzeEndpoint(
    @Body() input: AuditInputDto,
  ): Promise<PersistedAuditResultDto> {
    return this.auditService.analyzeAndSaveAudit(input);
  }

  @Get('share/:slug')
  async getShareableReport(@Param('slug') slug: string) {
    return this.auditService.getAuditBySlug(slug);
  }

  @Post('lead')
  async captureLead(@Body() dto: CaptureLeadDto) {
    return this.auditService.captureLeadForAudit(dto);
  }
}
