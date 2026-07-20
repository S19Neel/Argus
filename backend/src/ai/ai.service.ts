import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { AuditResultDto, AuditInputDto } from 'src/audit/dto/audit.dto';

@Injectable()
export class AiService {
  private openai: OpenAI | null = null;

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
  }

  getFallbackSummary(result: AuditResultDto, input: AuditInputDto): string {
    const keyActions = Array.from(
      new Set(
        result.toolBreakdowns
          .filter((item) => item.recommendedAction !== 'keep')
          .map((item) => {
            if (item.recommendedAction === 'switch_plan') {
              return `optimizing seat volume and billing plans across ${item.toolName}`;
            } else if (item.recommendedAction === 'switch_tool') {
              return `replacing high-cost retail seats on ${item.toolName} with ${item.recommendedPlanOrTool}`;
            } else if (item.recommendedAction === 'switch_to_credits') {
              return `transitioning ${item.toolName} retail licenses to direct API credit billing`;
            } else if (item.recommendedAction === 'downgrade') {
              return `downgrading over-provisioned enterprise tiers on ${item.toolName}`;
            }
            return item.reason;
          }),
      ),
    );

    const actionsText =
      keyActions.length > 0
        ? keyActions.join(', ')
        : 'maintaining your current optimal tier allocations';

    const currentSpend = result.toolBreakdowns.reduce(
      (sum, item) => sum + item.currentSpend,
      0,
    );
    const optimizedSpend =
      Math.round((currentSpend - result.totalMonthlySavings) * 100) / 100;

    return `For your ${input.teamSize}-person team focused on ${input.primaryUseCase} workflows, Argus analyzed your current AI spend and identified $${result.totalMonthlySavings}/mo ($${result.totalAnnualSavings}/yr) in structural optimization opportunities. By addressing ${actionsText}, your organization can transition from your current $${currentSpend}/mo spend down to an optimized $${optimizedSpend}/mo stack while maintaining 100% model capability and developer output.`;
  }

  async generateSummary(
    result: AuditResultDto,
    input: AuditInputDto,
  ): Promise<string> {
    if (!this.openai) {
      return this.getFallbackSummary(result, input);
    }

    const systemPrompt = `You are Argus, a senior AI spend and cloud architecture auditor.
Your goal is to write exactly ONE cohesive, executive-ready paragraph (3 to 4 sentences maximum) tailored for a VP of Engineering or CFO.
Summarize why the user's AI stack has structural waste (e.g., seat overkill, retail seat vs API token costs, missing annual billing discounts) and explain how the proposed savings maintain 100% of the team's engineering/writing capabilities.
Do NOT use generic fluff, marketing jargon, or bullet points. Reference exact tool names and verified dollar amounts provided in the user data. Always maintain a professional, defensible, and objective tone.`;

    const currentSpend = result.toolBreakdowns.reduce(
      (sum, item) => sum + item.currentSpend,
      0,
    );

    const userPromptPayload = `
Audit Context:
- Team Size: ${input.teamSize} seats
- Primary Use Case: ${input.primaryUseCase}
- Total Current Spend: $${currentSpend}/mo ($${currentSpend * 12}/yr)
- Identified Monthly Savings: $${result.totalMonthlySavings}/mo
- Identified Annual Savings: $${result.totalAnnualSavings}/yr
- Overall Stack Efficiency Status: ${result.overallStatus}

Tool-by-Tool Findings & Recommended Actions:
${result.toolBreakdowns
  .map(
    (item) =>
      `- Tool: ${item.toolName} (${item.currentPlan}, $${item.currentSpend}/mo) -> Action: ${item.recommendedAction.toUpperCase()} to ${item.recommendedPlanOrTool} ($${item.estimatedMonthlyCost}/mo). Reason: ${item.reason}`,
  )
  .join('\n')}

Synthesize these exact findings into your single executive paragraph now.`;

    try {
      const apiCall = this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.2,
        max_tokens: 250,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPromptPayload },
        ],
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error('OpenAI timeout after 2800ms')),
          2800,
        ),
      );

      const response = await Promise.race([apiCall, timeoutPromise]);
      const content = response.choices?.[0]?.message?.content?.trim();
      if (!content) {
        return this.getFallbackSummary(result, input);
      }
      return content;
    } catch (error) {
      return this.getFallbackSummary(result, input);
    }
  }
}
