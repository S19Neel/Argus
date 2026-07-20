import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';

describe('MailService - Resend Transactional Email Engine', () => {
  let service: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailService],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fallback to logging and return false when RESEND_API_KEY is not set', async () => {
    delete process.env.RESEND_API_KEY;
    const testModule: TestingModule = await Test.createTestingModule({
      providers: [MailService],
    }).compile();
    const noKeyService = testModule.get<MailService>(MailService);

    const result = await noKeyService.sendAuditConfirmationEmail(
      'test@example.com',
      'slug-123',
      600,
      7200,
      10,
      'AI Summary',
    );
    expect(result).toBe(false);
  });
});
