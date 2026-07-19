import { Test, TestingModule } from '@nestjs/testing';
import { AiService } from './ai.service';
import { AuditInputDto, AuditResultDto } from 'src/audit/dto/audit.dto';

describe('AiService', () => {
  let service: AiService;

  const mockInput: AuditInputDto = {
    teamSize: 10,
    primaryUseCase: 'coding',
    tools: [
      {
        toolName: 'Cursor',
        plan: 'Business',
        seats: 10,
        currentMonthlySpend: 400,
      },
    ],
  };

  const mockResult: AuditResultDto = {
    toolBreakdowns: [
      {
        toolName: 'Cursor',
        currentPlan: 'Business',
        currentSpend: 400,
        recommendedAction: 'switch_plan',
        recommendedPlanOrTool: 'Cursor Pro (Annual Billing)',
        estimatedMonthlyCost: 160,
        monthlySavings: 240,
        annualSavings: 2880,
        reason: 'Switching to annual billing saves 20%',
      },
    ],
    totalMonthlySavings: 240,
    totalAnnualSavings: 2880,
    overallStatus: 'moderate_savings',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiService],
    }).compile();

    service = module.get<AiService>(AiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return deterministic fallback summary when OPENAI_API_KEY is not set or openai instance is null', async () => {
    // Force openai to null for test
    (service as any).openai = null;
    const summary = await service.generateSummary(mockResult, mockInput);

    expect(summary).toContain('For your 10-person team focused on coding');
    expect(summary).toContain('$240/mo ($2880/yr) in structural optimization');
    expect(summary).toContain(
      'optimizing seat volume and billing plans across Cursor',
    );
  });

  it('should return API generated summary when OpenAI call succeeds within timeout', async () => {
    const mockContent =
      'Executive summary: By switching your 10 Cursor Business seats to Pro annual billing, your organization saves $2,880/yr immediately.';
    (service as any).openai = {
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [{ message: { content: mockContent } }],
          }),
        },
      },
    };

    const summary = await service.generateSummary(mockResult, mockInput);
    expect(summary).toBe(mockContent);
  });

  it('should return fallback summary when OpenAI call throws network error', async () => {
    (service as any).openai = {
      chat: {
        completions: {
          create: jest
            .fn()
            .mockRejectedValue(new Error('API rate limit exceeded')),
        },
      },
    };

    const summary = await service.generateSummary(mockResult, mockInput);
    expect(summary).toContain('For your 10-person team focused on coding');
  });

  it('should return fallback summary when OpenAI call exceeds 3.5s timeout', async () => {
    jest.useFakeTimers();
    (service as any).openai = {
      chat: {
        completions: {
          create: jest.fn().mockImplementation(
            () =>
              new Promise((resolve) => {
                setTimeout(
                  () =>
                    resolve({
                      choices: [{ message: { content: 'Late response' } }],
                    }),
                  5000,
                );
              }),
          ),
        },
      },
    };

    const promise = service.generateSummary(mockResult, mockInput);
    jest.advanceTimersByTime(3600);
    const summary = await promise;

    expect(summary).toContain('For your 10-person team focused on coding');
    jest.useRealTimers();
  });
});
