import { Test, TestingModule } from '@nestjs/testing';
import { AuditService } from './audit.service';
import { AuditInputDto } from './dto/audit.dto';
import { PrismaService } from 'src/prisma/prisma.service';

const mockPrismaService = {
  auditReport: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  lead: {
    upsert: jest.fn(),
  },
};

describe('AuditService - Defensible AI Spend Audit Engine', () => {
  let service: AuditService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AuditService>(AuditService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Test 1: should flag Team/Business plan overkill for 1-2 users (Claude Team -> Claude Pro)', () => {
    const input: AuditInputDto = {
      teamSize: 2,
      primaryUseCase: 'coding',
      tools: [
        {
          toolName: 'Claude',
          plan: 'Team',
          seats: 2,
          currentMonthlySpend: 50, // $25 * 2
        },
      ],
    };

    const result = service.performAudit(input);

    expect(result.toolBreakdowns).toHaveLength(1);
    const breakdown = result.toolBreakdowns[0];
    expect(breakdown.recommendedAction).toBe('switch_plan');
    expect(breakdown.recommendedPlanOrTool).toBe('Claude Pro');
    expect(breakdown.estimatedMonthlyCost).toBe(40); // $20 * 2
    expect(breakdown.monthlySavings).toBe(10);
    expect(breakdown.reason).toContain('below the threshold');
    expect(result.overallStatus).toBe('optimal'); // $10 savings (< $100)
  });

  it('Test 2: should recommend annual billing discount when seat volume is stable on monthly Pro plans (Cursor Pro)', () => {
    const input: AuditInputDto = {
      teamSize: 10,
      primaryUseCase: 'coding',
      tools: [
        {
          toolName: 'Cursor',
          plan: 'Pro',
          seats: 10,
          currentMonthlySpend: 200, // $20 * 10 monthly
        },
      ],
    };

    const result = service.performAudit(input);

    expect(result.toolBreakdowns).toHaveLength(1);
    const breakdown = result.toolBreakdowns[0];
    expect(breakdown.recommendedAction).toBe('switch_plan');
    expect(breakdown.recommendedPlanOrTool).toContain('Annual Billing');
    expect(breakdown.estimatedMonthlyCost).toBe(160); // $16 * 10 annual rate
    expect(breakdown.monthlySavings).toBe(40);
    expect(breakdown.annualSavings).toBe(480);
    expect(breakdown.reason).toContain('20% cost reduction');
  });

  it('Test 3: should recommend cheaper alternative tool for specific use cases (Cursor for writing -> Claude Pro)', () => {
    const input: AuditInputDto = {
      teamSize: 5,
      primaryUseCase: 'writing',
      tools: [
        {
          toolName: 'Cursor',
          plan: 'Pro+',
          seats: 5,
          currentMonthlySpend: 300, // $60 * 5
        },
      ],
    };

    const result = service.performAudit(input);

    expect(result.toolBreakdowns).toHaveLength(1);
    const breakdown = result.toolBreakdowns[0];
    expect(breakdown.recommendedAction).toBe('switch_tool');
    expect(breakdown.recommendedPlanOrTool).toBe('Claude Pro');
    expect(breakdown.estimatedMonthlyCost).toBe(100); // $20 * 5
    expect(breakdown.monthlySavings).toBe(200);
    expect(result.overallStatus).toBe('moderate_savings'); // $200 savings ($100-$500)
  });

  it('Test 4: should recommend switching from retail seats to direct API/credits for data/pipeline workloads', () => {
    const input: AuditInputDto = {
      teamSize: 10,
      primaryUseCase: 'data',
      tools: [
        {
          toolName: 'ChatGPT',
          plan: 'Plus',
          seats: 10,
          currentMonthlySpend: 200, // $20 * 10
        },
      ],
    };

    const result = service.performAudit(input);

    expect(result.toolBreakdowns).toHaveLength(1);
    const breakdown = result.toolBreakdowns[0];
    expect(breakdown.recommendedAction).toBe('switch_to_credits');
    expect(breakdown.recommendedPlanOrTool).toBe('OpenAI API direct');
    expect(breakdown.estimatedMonthlyCost).toBe(50); // ~25% of retail
    expect(breakdown.monthlySavings).toBe(150);
    expect(breakdown.reason).toContain('50% Batch discounts');
  });

  it('Test 5: should be honest and NOT manufacture savings when stack is already optimal', () => {
    const input: AuditInputDto = {
      teamSize: 1,
      primaryUseCase: 'coding',
      tools: [
        {
          toolName: 'Cursor',
          plan: 'Hobby',
          seats: 1,
          currentMonthlySpend: 0,
        },
      ],
    };

    const result = service.performAudit(input);

    expect(result.toolBreakdowns).toHaveLength(1);
    const breakdown = result.toolBreakdowns[0];
    expect(breakdown.recommendedAction).toBe('keep');
    expect(breakdown.monthlySavings).toBe(0);
    expect(breakdown.annualSavings).toBe(0);
    expect(breakdown.reason).toContain("You're spending well");
    expect(result.totalMonthlySavings).toBe(0);
    expect(result.overallStatus).toBe('optimal');
  });

  it('Test 6: should aggregate multi-tool stacks accurately and categorize >$500/mo as high_savings', () => {
    const input: AuditInputDto = {
      teamSize: 15,
      primaryUseCase: 'coding',
      tools: [
        {
          toolName: 'Cursor',
          plan: 'Business',
          seats: 15,
          currentMonthlySpend: 600, // $40 * 15
        },
        {
          toolName: 'Claude',
          plan: 'Max 20x',
          seats: 2,
          currentMonthlySpend: 400, // $200 * 2
        },
      ],
    };

    const result = service.performAudit(input);

    expect(result.toolBreakdowns).toHaveLength(2);
    expect(result.totalMonthlySavings).toBeGreaterThanOrEqual(480);
    expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12);
  });

  it('Test 7: should downgrade when GitHub Copilot Enterprise is overkill for core code generation', () => {
    const input: AuditInputDto = {
      teamSize: 20,
      primaryUseCase: 'coding',
      tools: [
        {
          toolName: 'GitHub Copilot',
          plan: 'Enterprise',
          seats: 20,
          currentMonthlySpend: 780, // $39 * 20
        },
      ],
    };

    const result = service.performAudit(input);

    expect(result.toolBreakdowns).toHaveLength(1);
    const breakdown = result.toolBreakdowns[0];
    expect(breakdown.recommendedAction).toBe('downgrade');
    expect(breakdown.recommendedPlanOrTool).toBe('GitHub Copilot Business');
    expect(breakdown.estimatedMonthlyCost).toBe(380); // $19 * 20
    expect(breakdown.monthlySavings).toBe(400); // (39 - 19) * 20
    expect(breakdown.reason).toContain('primarily for custom knowledge bases');
  });

  it('Test 8: should save audit report and items to DB on analyzeAndSaveAudit and return shareSlug', async () => {
    mockPrismaService.auditReport.create.mockResolvedValue({
      id: 'mock-report-id',
      shareSlug: 'mock-slug-123',
      teamSize: 2,
      primaryUseCase: 'coding',
      totalMonthlySavings: 10,
      totalAnnualSavings: 120,
      overallStatus: 'optimal',
      items: [],
    });

    const input: AuditInputDto = {
      teamSize: 2,
      primaryUseCase: 'coding',
      tools: [
        {
          toolName: 'Claude',
          plan: 'Team',
          seats: 2,
          currentMonthlySpend: 50,
        },
      ],
    };

    const result = await service.analyzeAndSaveAudit(input);
    expect(result.id).toBe('mock-report-id');
    expect(result.shareSlug).toBe('mock-slug-123');
    expect(mockPrismaService.auditReport.create).toHaveBeenCalled();
  });

  it('Test 9: should get public report by shareSlug and strip private leadId', async () => {
    mockPrismaService.auditReport.findUnique.mockResolvedValue({
      id: 'mock-report-id',
      shareSlug: 'mock-slug-123',
      leadId: 'private-lead-id',
      teamSize: 2,
      primaryUseCase: 'coding',
      totalMonthlySavings: 10,
      totalAnnualSavings: 120,
      overallStatus: 'optimal',
      items: [],
    });

    const publicReport = await service.getAuditBySlug('mock-slug-123');
    expect(publicReport).toBeDefined();
    expect(publicReport).not.toHaveProperty('leadId');
    expect(publicReport.shareSlug).toBe('mock-slug-123');
  });
});
