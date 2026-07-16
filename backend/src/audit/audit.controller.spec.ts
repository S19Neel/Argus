import { Test, TestingModule } from '@nestjs/testing';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';
import { AuditInputDto } from './dto/audit.dto';

describe('AuditController', () => {
  let controller: AuditController;
  let service: AuditService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuditController],
      providers: [AuditService],
    }).compile();

    controller = module.get<AuditController>(AuditController);
    service = module.get<AuditService>(AuditService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should delegate audit analysis to AuditService and return results', () => {
    const sampleInput: AuditInputDto = {
      teamSize: 2,
      primaryUseCase: 'coding',
      tools: [
        {
          toolName: 'Cursor',
          plan: 'Business',
          seats: 2,
          currentMonthlySpend: 80,
        },
      ],
    };

    const spy = jest.spyOn(service, 'performAudit');
    const result = controller.analyze(sampleInput);

    expect(spy).toHaveBeenCalledWith(sampleInput);
    expect(result.toolBreakdowns).toHaveLength(1);
    expect(result.totalMonthlySavings).toBeGreaterThan(0);
  });
});
