import { TOOL_PRICING_REGISTRY } from '../constants/pricing.constants';
import {
  ToolItemInputDto,
  PrimaryUseCase,
  ToolAuditBreakdownDto,
} from '../dto/audit.dto';

export function formatUseCaseLabel(useCase: string): string {
  switch (useCase) {
    case 'coding':
      return 'Software Engineering & Code Generation';
    case 'writing':
      return 'Content Writing & Copywriting';
    case 'design':
      return 'UI/UX & Product Design';
    case 'data':
    case 'data_analysis':
      return 'Data Analysis & Pipelines';
    case 'research':
      return 'Research & Deep Tech Analysis';
    case 'customer_support':
      return 'Customer Support Automation';
    case 'mixed':
      return 'Mixed / Full-Stack AI Workflows';
    default:
      return useCase;
  }
}

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

  const formattedUseCase = formatUseCaseLabel(primaryUseCase);

  // Pillar 4: Retail vs Credits / API Direct for Data/Pipeline Workloads
  if (
    (primaryUseCase === 'data' || primaryUseCase === 'data_analysis') &&
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
      reason: `For automated data extraction and pipeline workloads across ${seats} seat(s) (${formattedUseCase}), paying flat retail subscriptions ($${currentSpend}/mo) wastes idle seat capacity; switching to direct API billing with 50% Batch discounts drops estimated monthly consumption to ~$${estimatedCost}/mo.`,
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
      reason: `Centralized dashboard and SOC-2 enforcement on Cursor Business ($${Math.round(currentSpend / seats)}/seat/mo) are typically redundant for teams under 4 seats; downgrading ${seats} seat(s) to Cursor Pro ($${proRate}/seat/mo) reduces per-developer spend by $${monthlySavings}/mo with zero coding capability loss.`,
    };
  }

  // Pillar 3: Cheaper alternative tool with similar capability for their use case?
  if (
    (primaryUseCase === 'writing' ||
      primaryUseCase === 'research' ||
      primaryUseCase === 'customer_support') &&
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
        reason: `Developer-first IDE tools like ${toolName} ($${Math.round(currentSpend / seats)}/mo) are structurally unsuited and overpriced for ${formattedUseCase}; migrating to Claude Pro ($${claudeRate}/mo) provides superior long-context document synthesis and general task ergonomics while lowering spend.`,
      };
    }
  }

  if (
    primaryUseCase === 'design' &&
    ['Cursor', 'Windsurf'].includes(toolName) &&
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
        reason: `Code-only IDE tools like ${toolName} ($${Math.round(currentSpend / seats)}/mo) are structurally unsuited for ${formattedUseCase}; migrating to Claude Pro ($${claudeRate}/mo) or specialized design tools provides superior multimodal feedback and visual workflows while optimizing spend.`,
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
      reason: `At ${seats} seats for ${formattedUseCase}, Copilot Enterprise ($${Math.round(currentSpend / seats)}/seat/mo) carries a massive premium primarily for custom knowledge bases; shifting to Copilot Business ($${businessRate}/seat/mo) delivers core IDE auto-completion and chat while cutting monthly spend by $${monthlySavings}.`,
    };
  }

  // Pillar 2: Cheaper plan from the same vendor? (Downgrades / Tier overkill)
  if (
    toolName === 'Claude' &&
    (plan.includes('Max 20x') || plan.includes('Max 5x')) &&
    primaryUseCase !== 'research' &&
    primaryUseCase !== 'data' &&
    primaryUseCase !== 'data_analysis'
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
      reason: `A $${Math.round(currentSpend / seats)}/mo Claude ${plan} allocation is over-provisioned for standard ${formattedUseCase} workflows; downgrading to Claude Pro ($${proRate}/mo) saves $${monthlySavings}/mo while preserving full Sonnet and Opus access.`,
    };
  }

  if (
    toolName === 'ChatGPT' &&
    plan.includes('Pro') &&
    primaryUseCase !== 'research' &&
    primaryUseCase !== 'data' &&
    primaryUseCase !== 'data_analysis'
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
      reason: `The $${Math.round(currentSpend / seats)}/mo ChatGPT ${plan} tier vastly exceeds standard rate limits required for ${formattedUseCase}; shifting to ChatGPT Plus ($${plusRate}/mo) reduces spend by $${monthlySavings}/mo without throttling daily productivity.`,
    };
  }

  // Pillar 2: Annual billing optimization for stable seat allocations
  if (
    toolName === 'Cursor' &&
    (plan === 'Pro' || plan === 'Teams Standard' || plan === 'Business') &&
    seats >= 3
  ) {
    const monthlyRate =
      TOOL_PRICING_REGISTRY.Cursor[plan]?.monthlyRatePerSeat ??
      (plan === 'Pro' ? 20 : 40);
    const annualRate =
      TOOL_PRICING_REGISTRY.Cursor[plan]?.annualRatePerSeat ??
      (plan === 'Pro' ? 16 : 32);
    const estimatedCost = seats * annualRate;
    const monthlySavings = Math.max(0, currentSpend - estimatedCost);
    if (monthlySavings > 0) {
      const discountPct = Math.round((1 - annualRate / monthlyRate) * 100);
      return {
        toolName,
        currentPlan: plan,
        currentSpend,
        recommendedAction: 'switch_plan',
        recommendedPlanOrTool: `${plan} (Annual Billing)`,
        estimatedMonthlyCost: estimatedCost,
        monthlySavings,
        annualSavings: monthlySavings * 12,
        reason: `Converting your ${seats} Cursor ${plan} seat(s) across ${formattedUseCase} from monthly ($${monthlyRate}/mo) to annual billing ($${annualRate}/mo) unlocks an immediate ${discountPct}% cost reduction ($${monthlySavings * 12}/yr) with zero workflow changes.`,
      };
    }
  }

  if (
    toolName === 'GitHub Copilot' &&
    (plan === 'Pro' || plan === 'Individual') &&
    seats >= 3
  ) {
    const monthlyRate =
      TOOL_PRICING_REGISTRY['GitHub Copilot'][plan]?.monthlyRatePerSeat ?? 10;
    const annualRate =
      TOOL_PRICING_REGISTRY['GitHub Copilot'][plan]?.annualRatePerSeat ?? 8.33;
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
        reason: `Locking in annual billing for ${seats} GitHub Copilot ${plan} seat(s) drops effective seat cost from $${monthlyRate}/mo to $${annualRate}/mo ($${Math.round(annualRate * 12)}/yr), yielding guaranteed $${Math.round(monthlySavings * 12)} annual efficiency gains across ${formattedUseCase}.`,
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
    reason: `Your current ${plan} plan ($${currentSpend}/mo) is well-optimized for ${seats} seat(s) in ${formattedUseCase} — no structural waste detected. You're spending well.`,
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
