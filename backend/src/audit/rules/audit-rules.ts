import { TOOL_PRICING_REGISTRY } from '../constants/pricing.constants';
import {
  ToolItemInputDto,
  PrimaryUseCase,
  ToolAuditBreakdownDto,
} from '../dto/audit.dto';

export function evaluateToolAuditBreakdown(
  tool: ToolItemInputDto,
  teamSize: number,
  primaryUseCase: PrimaryUseCase,
): ToolAuditBreakdownDto {
  const { toolName, plan, seats } = tool;
  const currentSpend =
    tool.currentMonthlySpend >= 0
      ? tool.currentMonthlySpend
      : computeDefaultSpend(toolName, plan, seats);

  // Pillar 4: Retail vs Credits / API Direct for Data/Pipeline Workloads
  if (
    primaryUseCase === 'data' &&
    ['ChatGPT', 'Claude', 'Gemini'].includes(toolName) &&
    !plan.toLowerCase().includes('free') &&
    (seats >= 4 || currentSpend >= 80)
  ) {
    const estimatedCost = Math.round(currentSpend * 0.25);
    const monthlySavings = currentSpend - estimatedCost;
    return {
      toolName,
      currentPlan: plan,
      currentSpend,
      recommendedAction: 'switch_to_credits',
      recommendedPlanOrTool:
        toolName === 'Claude' ? 'Anthropic API direct' : 'OpenAI API direct',
      estimatedMonthlyCost: estimatedCost,
      monthlySavings,
      annualSavings: monthlySavings * 12,
      reason: `For automated data extraction and pipeline workloads across ${seats} seat(s), paying flat retail subscriptions ($${currentSpend}/mo) wastes idle seat capacity; switching to direct API billing with 50% Batch discounts drops estimated monthly consumption to ~$${estimatedCost}/mo.`,
    };
  }

  // Pillar 1: Right plan for usage? (Seat / Tier Overkill)
  if (
    toolName === 'Claude' &&
    (plan.includes('Team') || plan === 'Team') &&
    (seats <= 2 || teamSize <= 2)
  ) {
    const proRate = TOOL_PRICING_REGISTRY.Claude.Pro?.monthlyRatePerSeat ?? 20;
    const estimatedCost = seats * proRate;
    const monthlySavings = Math.max(0, currentSpend - estimatedCost);
    return {
      toolName,
      currentPlan: plan,
      currentSpend,
      recommendedAction: 'switch_plan',
      recommendedPlanOrTool: 'Claude Pro',
      estimatedMonthlyCost: estimatedCost,
      monthlySavings,
      annualSavings: monthlySavings * 12,
      reason: `Your team size (${seats}) is below the threshold where Claude Team ($25/seat/mo + 5-seat minimum) provides positive ROI; switching to individual Pro seats ($${proRate}/seat/mo) maintains identical Sonnet/Opus model access while eliminating seat overhead.`,
    };
  }

  if (
    toolName === 'ChatGPT' &&
    (plan.includes('Business') || plan.includes('Team')) &&
    (seats <= 2 || teamSize <= 2)
  ) {
    const plusRate =
      TOOL_PRICING_REGISTRY.ChatGPT.Plus?.monthlyRatePerSeat ?? 20;
    const estimatedCost = seats * plusRate;
    const monthlySavings = Math.max(0, currentSpend - estimatedCost);
    return {
      toolName,
      currentPlan: plan,
      currentSpend,
      recommendedAction: 'switch_plan',
      recommendedPlanOrTool: 'ChatGPT Plus',
      estimatedMonthlyCost: estimatedCost,
      monthlySavings,
      annualSavings: monthlySavings * 12,
      reason: `For ${seats} seat(s), centralized workspace features in ChatGPT Business ($25/user/mo) add unnecessary administrative premium over individual Plus subscriptions ($${plusRate}/user/mo) for identical model limits.`,
    };
  }

  if (
    toolName === 'Cursor' &&
    plan === 'Business' &&
    seats <= 3 &&
    teamSize <= 3
  ) {
    const proRate = TOOL_PRICING_REGISTRY.Cursor.Pro?.monthlyRatePerSeat ?? 20;
    const estimatedCost = seats * proRate;
    const monthlySavings = Math.max(0, currentSpend - estimatedCost);
    return {
      toolName,
      currentPlan: plan,
      currentSpend,
      recommendedAction: 'switch_plan',
      recommendedPlanOrTool: 'Cursor Pro',
      estimatedMonthlyCost: estimatedCost,
      monthlySavings,
      annualSavings: monthlySavings * 12,
      reason: `Centralized dashboard and SOC-2 enforcement on Cursor Business ($40/seat/mo) are typically redundant for teams under 4 seats; downgrading ${seats} seat(s) to Cursor Pro ($${proRate}/seat/mo) halves per-developer spend with zero coding capability loss.`,
    };
  }

  // Pillar 3: Cheaper alternative tool with similar capability for their use case?
  if (
    (primaryUseCase === 'writing' || primaryUseCase === 'research') &&
    ['Cursor', 'Windsurf', 'v0'].includes(toolName) &&
    !plan.toLowerCase().includes('free')
  ) {
    const claudeRate =
      TOOL_PRICING_REGISTRY.Claude.Pro?.monthlyRatePerSeat ?? 20;
    const estimatedCost = seats * claudeRate;
    const monthlySavings = Math.max(0, currentSpend - estimatedCost);
    if (monthlySavings > 0 || currentSpend > estimatedCost) {
      return {
        toolName,
        currentPlan: plan,
        currentSpend,
        recommendedAction: 'switch_tool',
        recommendedPlanOrTool: 'Claude Pro',
        estimatedMonthlyCost: estimatedCost,
        monthlySavings,
        annualSavings: monthlySavings * 12,
        reason: `Developer-first IDE tools like ${toolName} ($${Math.round(currentSpend / seats)}/mo) are structurally unsuited and overpriced for ${primaryUseCase}; migrating to Claude Pro ($${claudeRate}/mo) provides superior long-context document synthesis and writing ergonomics while lowering spend.`,
      };
    }
  }

  if (
    primaryUseCase === 'coding' &&
    toolName === 'GitHub Copilot' &&
    plan === 'Enterprise'
  ) {
    const businessRate =
      TOOL_PRICING_REGISTRY['GitHub Copilot'].Business?.monthlyRatePerSeat ??
      19;
    const estimatedCost = seats * businessRate;
    const monthlySavings = Math.max(0, currentSpend - estimatedCost);
    return {
      toolName,
      currentPlan: plan,
      currentSpend,
      recommendedAction: 'downgrade',
      recommendedPlanOrTool: 'GitHub Copilot Business',
      estimatedMonthlyCost: estimatedCost,
      monthlySavings,
      annualSavings: monthlySavings * 12,
      reason: `At ${seats} seats for code generation, Copilot Enterprise ($39/seat/mo) carries a 105% premium primarily for custom knowledge bases; shifting to Copilot Business ($${businessRate}/seat/mo) delivers core IDE auto-completion and chat while cutting monthly spend by $${monthlySavings}.`,
    };
  }

  // Pillar 2: Cheaper plan from the same vendor? (Downgrades / Tier overkill)
  if (
    toolName === 'Claude' &&
    (plan.includes('Max 20x') || plan.includes('Max 5x')) &&
    (primaryUseCase === 'writing' || primaryUseCase === 'coding')
  ) {
    const proRate = TOOL_PRICING_REGISTRY.Claude.Pro?.monthlyRatePerSeat ?? 20;
    const estimatedCost = seats * proRate;
    const monthlySavings = Math.max(0, currentSpend - estimatedCost);
    return {
      toolName,
      currentPlan: plan,
      currentSpend,
      recommendedAction: 'downgrade',
      recommendedPlanOrTool: 'Claude Pro',
      estimatedMonthlyCost: estimatedCost,
      monthlySavings,
      annualSavings: monthlySavings * 12,
      reason: `A $${Math.round(currentSpend / seats)}/mo Claude ${plan} allocation is over-provisioned for standard ${primaryUseCase} workflows; downgrading to Claude Pro ($${proRate}/mo) saves $${monthlySavings}/mo while preserving full Sonnet and Opus access.`,
    };
  }

  if (
    toolName === 'ChatGPT' &&
    plan.includes('Pro') &&
    primaryUseCase !== 'research'
  ) {
    const plusRate =
      TOOL_PRICING_REGISTRY.ChatGPT.Plus?.monthlyRatePerSeat ?? 20;
    const estimatedCost = seats * plusRate;
    const monthlySavings = Math.max(0, currentSpend - estimatedCost);
    return {
      toolName,
      currentPlan: plan,
      currentSpend,
      recommendedAction: 'downgrade',
      recommendedPlanOrTool: 'ChatGPT Plus',
      estimatedMonthlyCost: estimatedCost,
      monthlySavings,
      annualSavings: monthlySavings * 12,
      reason: `The $${Math.round(currentSpend / seats)}/mo ChatGPT ${plan} tier vastly exceeds standard rate limits required for ${primaryUseCase}; shifting to ChatGPT Plus ($${plusRate}/mo) reduces spend by $${monthlySavings}/mo without throttling daily productivity.`,
    };
  }

  // Pillar 2: Annual billing optimization for stable seat allocations
  if (
    toolName === 'Cursor' &&
    (plan === 'Pro' || plan === 'Teams Standard' || plan === 'Business') &&
    seats >= 3
  ) {
    const annualRate =
      TOOL_PRICING_REGISTRY.Cursor[plan]?.annualRatePerSeat ??
      (plan === 'Pro' ? 16 : 32);
    const estimatedCost = seats * annualRate;
    const monthlySavings = Math.max(0, currentSpend - estimatedCost);
    if (monthlySavings > 0) {
      return {
        toolName,
        currentPlan: plan,
        currentSpend,
        recommendedAction: 'switch_plan',
        recommendedPlanOrTool: `${plan} (Annual Billing)`,
        estimatedMonthlyCost: estimatedCost,
        monthlySavings,
        annualSavings: monthlySavings * 12,
        reason: `Converting your ${seats} Cursor ${plan} seat(s) from monthly to annual billing ($${annualRate}/mo) unlocks an immediate 20% cost reduction ($${monthlySavings * 12}/yr) with zero workflow changes.`,
      };
    }
  }

  if (
    toolName === 'GitHub Copilot' &&
    (plan === 'Pro' || plan === 'Individual') &&
    seats >= 3
  ) {
    const annualRate = 8.33;
    const estimatedCost = Math.round(seats * annualRate * 100) / 100;
    const monthlySavings =
      Math.round((currentSpend - estimatedCost) * 100) / 100;
    if (monthlySavings > 0) {
      return {
        toolName,
        currentPlan: plan,
        currentSpend,
        recommendedAction: 'switch_plan',
        recommendedPlanOrTool: `${plan} (Annual Billing)`,
        estimatedMonthlyCost: estimatedCost,
        monthlySavings,
        annualSavings: Math.round(monthlySavings * 12),
        reason: `Locking in annual billing for ${seats} GitHub Copilot ${plan} seat(s) drops effective seat cost from $10/mo to $8.33/mo ($100/yr), yielding guaranteed $${Math.round(monthlySavings * 12)} annual efficiency gains.`,
      };
    }
  }

  // Default: Optimal / Well-spent budget
  return {
    toolName,
    currentPlan: plan,
    currentSpend,
    recommendedAction: 'keep',
    recommendedPlanOrTool: plan,
    estimatedMonthlyCost: currentSpend,
    monthlySavings: 0,
    annualSavings: 0,
    reason: `Your current ${plan} plan ($${currentSpend}/mo) is well-optimized for ${seats} seat(s) in ${primaryUseCase} — no structural waste detected. You're spending well.`,
  };
}

function computeDefaultSpend(
  toolName: string,
  plan: string,
  seats: number,
): number {
  const toolRegistry = TOOL_PRICING_REGISTRY[toolName];
  if (toolRegistry && toolRegistry[plan]) {
    return (toolRegistry[plan].monthlyRatePerSeat ?? 0) * seats;
  }
  return 0;
}
