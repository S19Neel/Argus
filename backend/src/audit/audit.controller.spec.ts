import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';
import { AuditInputDto } from './dto/audit.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AiService } from 'src/ai/ai.service';
import { MailService } from 'src/mail/mail.service';

describe('AuditController', () => {
  let controller: AuditController;
  let service: AuditService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuditController],
      providers: [
        AuditService,
        {
          provide: PrismaService,
          useValue: {
            auditReport: {
              create: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
            },
            lead: {
              upsert: jest.fn(),
            },
          },
        },
        {
          provide: AiService,
          useValue: {
            generateSummary: jest.fn().mockResolvedValue('Mock AI Summary'),
          },
        },
        {
          provide: MailService,
          useValue: {
            sendAuditConfirmationEmail: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    controller = module.get<AuditController>(AuditController);
    service = module.get<AuditService>(AuditService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should delegate audit analysis to AuditService.analyzeAndSaveAudit and return results with shareSlug', async () => {
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

    const expectedResult = {
      id: 'report-id',
      shareSlug: 'slug-abc',
      toolBreakdowns: [],
      totalMonthlySavings: 40,
      totalAnnualSavings: 480,
      overallStatus: 'optimal' as const,
    };

    const spy = jest
      .spyOn(service, 'analyzeAndSaveAudit')
      .mockResolvedValue(expectedResult);
    const result = await controller.analyze(sampleInput);

    expect(spy).toHaveBeenCalledWith(sampleInput);
    expect(result.shareSlug).toBe('slug-abc');
    expect(result.totalMonthlySavings).toBe(40);
  });

  it('should throw BadRequestException immediately when _honeypot field is populated (Spam check)', async () => {
    const spamInput: AuditInputDto = {
      teamSize: 5,
      primaryUseCase: 'coding',
      tools: [
        {
          toolName: 'Cursor',
          plan: 'Business',
          seats: 5,
          currentMonthlySpend: 200,
        },
      ],
      _honeypot: 'http://spam-bot.example.com',
    };

    await expect(controller.analyze(spamInput)).rejects.toThrow(
      BadRequestException,
    );
  });
});
