export interface PricingTier {
  planName: string;
  monthlyPricePerSeat: number;
  annualPricePerSeatMonthly: number;
  billingType: "per_seat" | "usage_based";
}

export interface ToolPricingConfig {
  toolName: string;
  category: "coding" | "general" | "design" | "data";
  tiers: Record<string, PricingTier>;
}

export const SUPPORTED_TOOLS: ToolPricingConfig[] = [
  {
    toolName: "Cursor",
    category: "coding",
    tiers: {
      Free: {
        planName: "Free",
        monthlyPricePerSeat: 0,
        annualPricePerSeatMonthly: 0,
        billingType: "per_seat",
      },
      Pro: {
        planName: "Pro",
        monthlyPricePerSeat: 20,
        annualPricePerSeatMonthly: 16,
        billingType: "per_seat",
      },
      Business: {
        planName: "Business",
        monthlyPricePerSeat: 40,
        annualPricePerSeatMonthly: 32,
        billingType: "per_seat",
      },
    },
  },
  {
    toolName: "Claude",
    category: "general",
    tiers: {
      Free: {
        planName: "Free",
        monthlyPricePerSeat: 0,
        annualPricePerSeatMonthly: 0,
        billingType: "per_seat",
      },
      Pro: {
        planName: "Pro",
        monthlyPricePerSeat: 20,
        annualPricePerSeatMonthly: 18,
        billingType: "per_seat",
      },
      Team: {
        planName: "Team",
        monthlyPricePerSeat: 30,
        annualPricePerSeatMonthly: 25,
        billingType: "per_seat",
      },
      Enterprise: {
        planName: "Enterprise",
        monthlyPricePerSeat: 60,
        annualPricePerSeatMonthly: 50,
        billingType: "per_seat",
      },
    },
  },
  {
    toolName: "ChatGPT",
    category: "general",
    tiers: {
      Free: {
        planName: "Free",
        monthlyPricePerSeat: 0,
        annualPricePerSeatMonthly: 0,
        billingType: "per_seat",
      },
      Plus: {
        planName: "Plus",
        monthlyPricePerSeat: 20,
        annualPricePerSeatMonthly: 20,
        billingType: "per_seat",
      },
      Team: {
        planName: "Team",
        monthlyPricePerSeat: 30,
        annualPricePerSeatMonthly: 25,
        billingType: "per_seat",
      },
      Enterprise: {
        planName: "Enterprise",
        monthlyPricePerSeat: 60,
        annualPricePerSeatMonthly: 60,
        billingType: "per_seat",
      },
    },
  },
  {
    toolName: "GitHub Copilot",
    category: "coding",
    tiers: {
      Individual: {
        planName: "Individual",
        monthlyPricePerSeat: 10,
        annualPricePerSeatMonthly: 8.33,
        billingType: "per_seat",
      },
      Business: {
        planName: "Business",
        monthlyPricePerSeat: 19,
        annualPricePerSeatMonthly: 19,
        billingType: "per_seat",
      },
      Enterprise: {
        planName: "Enterprise",
        monthlyPricePerSeat: 39,
        annualPricePerSeatMonthly: 39,
        billingType: "per_seat",
      },
    },
  },
  {
    toolName: "OpenAI API",
    category: "data",
    tiers: {
      "Pay-as-you-go": {
        planName: "Pay-as-you-go",
        monthlyPricePerSeat: 50,
        annualPricePerSeatMonthly: 50,
        billingType: "usage_based",
      },
    },
  },
  {
    toolName: "Anthropic API",
    category: "data",
    tiers: {
      "Pay-as-you-go": {
        planName: "Pay-as-you-go",
        monthlyPricePerSeat: 50,
        annualPricePerSeatMonthly: 50,
        billingType: "usage_based",
      },
    },
  },
  {
    toolName: "Gemini",
    category: "general",
    tiers: {
      Advanced: {
        planName: "Advanced",
        monthlyPricePerSeat: 20,
        annualPricePerSeatMonthly: 20,
        billingType: "per_seat",
      },
      Business: {
        planName: "Business",
        monthlyPricePerSeat: 30,
        annualPricePerSeatMonthly: 24,
        billingType: "per_seat",
      },
    },
  },
  {
    toolName: "Windsurf",
    category: "coding",
    tiers: {
      Pro: {
        planName: "Pro",
        monthlyPricePerSeat: 15,
        annualPricePerSeatMonthly: 12.5,
        billingType: "per_seat",
      },
      Team: {
        planName: "Team",
        monthlyPricePerSeat: 30,
        annualPricePerSeatMonthly: 25,
        billingType: "per_seat",
      },
    },
  },
  {
    toolName: "v0",
    category: "coding",
    tiers: {
      Premium: {
        planName: "Premium",
        monthlyPricePerSeat: 20,
        annualPricePerSeatMonthly: 20,
        billingType: "per_seat",
      },
      Team: {
        planName: "Team",
        monthlyPricePerSeat: 40,
        annualPricePerSeatMonthly: 30,
        billingType: "per_seat",
      },
    },
  },
];

export const USE_CASES = [
  { id: "coding", label: "Software Engineering & Code Generation" },
  { id: "writing", label: "Content Writing & Copywriting" },
  { id: "design", label: "UI/UX & Product Design" },
  { id: "data", label: "Data Analysis & Pipelines" },
  { id: "research", label: "Research & Deep Tech Analysis" },
  { id: "customer_support", label: "Customer Support Automation" },
  { id: "mixed", label: "Mixed / Full-Stack AI Workflows" },
];
