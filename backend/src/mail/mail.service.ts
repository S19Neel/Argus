import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private resend: Resend | null = null;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey && apiKey.trim() !== '') {
      this.resend = new Resend(apiKey);
      this.logger.log('Resend client initialized successfully.');
    } else {
      this.logger.warn(
        'RESEND_API_KEY is not set in environment variables. Mail sending will fallback to logging only.',
      );
    }
  }

  async sendAuditConfirmationEmail(
    leadEmail: string,
    shareSlug: string,
    totalMonthlySavings: number,
    totalAnnualSavings: number,
    teamSize: number,
    summaryParagraph?: string,
  ): Promise<boolean> {
    const shareUrl = process.env.FRONTEND_URL + `/share/${shareSlug}`;
    const isHighSavings = totalMonthlySavings > 500;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #090d16; color: #e4e4e7; margin: 0; padding: 40px 20px; }
          .container { max-w: 600px; margin: 0 auto; background: #18181b; border: 1px solid #27272a; border-radius: 16px; padding: 32px; }
          .header { border-bottom: 1px solid #27272a; padding-bottom: 20px; margin-bottom: 24px; }
          .title { font-size: 22px; font-weight: 800; color: #ffffff; margin: 0; }
          .badge { display: inline-block; background: rgba(16, 185, 129, 0.15); color: #34d399; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 9999px; border: 1px solid rgba(16, 185, 129, 0.3); margin-top: 8px; }
          .summary-box { background: rgba(9, 13, 22, 0.8); border: 1px solid #27272a; border-radius: 12px; padding: 18px; font-size: 14px; line-height: 1.6; color: #d4d4d8; margin-bottom: 24px; }
          .savings-banner { background: ${isHighSavings ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(20, 184, 166, 0.2))' : 'rgba(39, 39, 42, 0.6)'}; border: 1px solid ${isHighSavings ? 'rgba(16, 185, 129, 0.4)' : '#3f3f46'}; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 28px; }
          .savings-number { font-size: 32px; font-weight: 900; color: #34d399; margin: 8px 0; }
          .savings-label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #a1a1aa; font-weight: 600; }
          .btn { display: inline-block; background-color: #10b981; color: #ffffff !important; font-weight: 700; font-size: 14px; padding: 12px 24px; border-radius: 10px; text-decoration: none; margin-bottom: 24px; }
          .note { font-size: 13px; color: #a1a1aa; border-top: 1px solid #27272a; padding-top: 20px; line-height: 1.5; }
          .footer { text-align: center; font-size: 11px; color: #71717a; margin-top: 24px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="title">Argus AI Architecture & Spend Audit</h1>
            <span class="badge">Verified Defensible Analysis</span>
          </div>

          <div class="savings-banner">
            <div class="savings-label">Identified Monthly Run-Rate Variance</div>
            <div class="savings-number">$${totalMonthlySavings.toLocaleString()}/mo</div>
            <div style="font-size: 13px; color: #d4d4d8;">Annualized Impact: <strong>$${totalAnnualSavings.toLocaleString()}/yr</strong> for ${teamSize} seats</div>
          </div>

          ${summaryParagraph ? `<div class="summary-box"><strong>Executive Synthesis:</strong><br/>${summaryParagraph}</div>` : ''}

          <div style="text-align: center;">
            <a href="${shareUrl}" class="btn">View & Share Full Interactive Report &rarr;</a>
          </div>

          <div class="note">
            ${
              isHighSavings
                ? `🚀 <strong>High-Savings Architectural Intervention Required:</strong> Because your audit identified over $500/mo in structural tier overkill or retail API leakage ($${totalMonthlySavings}/mo total), a senior solutions architect from <strong>TechVruk Engineering</strong> has been flagged to reach out with direct implementation guidance and custom enterprise credit pipelines.`
                : `✅ <strong>Optimal Spend Verification:</strong> Your organization is maintaining an efficient AI stack (` +
                  (totalMonthlySavings > 0
                    ? `$${totalMonthlySavings}/mo variance`
                    : `fully optimal`) +
                  `). We have recorded your stack configuration and will notify you immediately when new pricing reductions or tier optimizations apply.`
            }
          </div>

          <div class="footer">
            Prepared by Argus AI Architecture Auditor &bull; TechVruk Evaluation
          </div>
        </div>
      </body>
      </html>
    `;

    if (!this.resend) {
      this.logger.log(
        `[Mail Fallback] Confirmation email to ${leadEmail} (Slug: ${shareSlug}, Savings: $${totalMonthlySavings}/mo) NOT sent via Resend (no key). HTML rendered successfully.`,
      );
      return false;
    }

    try {
      const response = await this.resend.emails.send({
        from: 'Argus Auditor <onboarding@resend.dev>',
        to: [leadEmail],
        subject: `Argus Executive Audit Report — $${totalMonthlySavings}/mo Identified Savings (#${shareSlug})`,
        html: htmlContent,
      });

      if (response.error) {
        this.logger.error(
          `Resend failed to deliver email to ${leadEmail}: ${JSON.stringify(response.error)}`,
        );
        return false;
      }

      this.logger.log(
        `Confirmation email sent via Resend to ${leadEmail} (ID: ${response.data?.id})`,
      );
      return true;
    } catch (err: any) {
      this.logger.error(
        `Exception sending email to ${leadEmail}: ${err.message}`,
        err.stack,
      );
      return false;
    }
  }
}
