import { Body, Controller, Post } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditInputDto, AuditResultDto } from './dto/audit.dto';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Post()
  analyze(@Body() input: AuditInputDto): AuditResultDto {
    return this.auditService.performAudit(input);
  }

  @Post('analyze')
  analyzeEndpoint(@Body() input: AuditInputDto): AuditResultDto {
    return this.auditService.performAudit(input);
  }
}
