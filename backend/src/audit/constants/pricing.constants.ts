export interface PlanPricing {
  monthlyRatePerSeat: number;
  annualRatePerSeat?: number;
  minSeats?: number;
  description?: string;
  sourceUrl: string;
  verifiedDate: string;
}

export interface ApiTokenPricing {
  inputPerMillion: number;
  outputPerMillion: number;
  batchDiscountPercentage: number;
  sourceUrl: string;
  verifiedDate: string;
}

export const VERIFIED_DATE = '2026-07-15';

export const TOOL_PRICING_REGISTRY: Record<
  string,
  Record<string, PlanPricing>
> = {
  Cursor: {
    Hobby: {
      monthlyRatePerSeat: 0,
      annualRatePerSeat: 0,
      sourceUrl: 'https://cursor.com/pricing',
      verifiedDate: VERIFIED_DATE,
    },
    Pro: {
      monthlyRatePerSeat: 20,
      annualRatePerSeat: 16,
      sourceUrl: 'https://cursor.com/pricing',
      verifiedDate: VERIFIED_DATE,
    },
    'Pro+': {
      monthlyRatePerSeat: 60,
      annualRatePerSeat: 48,
      sourceUrl: 'https://cursor.com/pricing',
      verifiedDate: VERIFIED_DATE,
    },
    Ultra: {
      monthlyRatePerSeat: 200,
      annualRatePerSeat: 160,
      sourceUrl: 'https://cursor.com/pricing',
      verifiedDate: VERIFIED_DATE,
    },
    Business: {
      monthlyRatePerSeat: 40,
      annualRatePerSeat: 32,
      sourceUrl: 'https://cursor.com/pricing',
      verifiedDate: VERIFIED_DATE,
    },
    'Teams Standard': {
      monthlyRatePerSeat: 40,
      annualRatePerSeat: 32,
      sourceUrl: 'https://cursor.com/pricing',
      verifiedDate: VERIFIED_DATE,
    },
    'Teams Premium': {
      monthlyRatePerSeat: 120,
      annualRatePerSeat: 96,
      sourceUrl: 'https://cursor.com/pricing',
      verifiedDate: VERIFIED_DATE,
    },
  },
  Claude: {
    Free: {
      monthlyRatePerSeat: 0,
      annualRatePerSeat: 0,
      sourceUrl: 'https://claude.com/pricing',
      verifiedDate: VERIFIED_DATE,
    },
    Pro: {
      monthlyRatePerSeat: 20,
      annualRatePerSeat: 17,
      sourceUrl: 'https://claude.com/pricing',
      verifiedDate: VERIFIED_DATE,
    },
    'Max 5x': {
      monthlyRatePerSeat: 100,
      sourceUrl: 'https://claude.com/pricing',
      verifiedDate: VERIFIED_DATE,
    },
    'Max 20x': {
      monthlyRatePerSeat: 200,
      sourceUrl: 'https://claude.com/pricing',
      verifiedDate: VERIFIED_DATE,
    },
    Team: {
      monthlyRatePerSeat: 25,
      annualRatePerSeat: 20,
      minSeats: 5,
      sourceUrl: 'https://claude.com/pricing',
      verifiedDate: VERIFIED_DATE,
    },
    'Team Standard': {
      monthlyRatePerSeat: 25,
      annualRatePerSeat: 20,
      minSeats: 5,
      sourceUrl: 'https://claude.com/pricing',
      verifiedDate: VERIFIED_DATE,
    },
    'Team Premium': {
      monthlyRatePerSeat: 125,
      annualRatePerSeat: 100,
      minSeats: 5,
      sourceUrl: 'https://claude.com/pricing',
      verifiedDate: VERIFIED_DATE,
    },
  },
  Windsurf: {
    Free: {
      monthlyRatePerSeat: 0,
      annualRatePerSeat: 0,
      sourceUrl: 'https://windsurf.com/pricing',
      verifiedDate: VERIFIED_DATE,
    },
    Pro: {
      monthlyRatePerSeat: 20,
      annualRatePerSeat: 16.5,
      sourceUrl: 'https://windsurf.com/pricing',
      verifiedDate: VERIFIED_DATE,
    },
    Max: {
      monthlyRatePerSeat: 200,
      annualRatePerSeat: 168,
      sourceUrl: 'https://windsurf.com/pricing',
      verifiedDate: VERIFIED_DATE,
    },
    Teams: {
      monthlyRatePerSeat: 40,
      annualRatePerSeat: 32.5,
      sourceUrl: 'https://windsurf.com/pricing',
      verifiedDate: VERIFIED_DATE,
    },
  },
  'GitHub Copilot': {
    Free: {
      monthlyRatePerSeat: 0,
      annualRatePerSeat: 0,
      sourceUrl: 'https://github.com/features/copilot/plans',
      verifiedDate: VERIFIED_DATE,
    },
    Individual: {
      monthlyRatePerSeat: 10,
      annualRatePerSeat: 8.33,
      sourceUrl: 'https://github.com/features/copilot/plans',
      verifiedDate: VERIFIED_DATE,
    },
    Pro: {
      monthlyRatePerSeat: 10,
      annualRatePerSeat: 8.33,
      sourceUrl: 'https://github.com/features/copilot/plans',
      verifiedDate: VERIFIED_DATE,
    },
    'Pro+': {
      monthlyRatePerSeat: 39,
      annualRatePerSeat: 32.5,
      sourceUrl: 'https://github.com/features/copilot/plans',
      verifiedDate: VERIFIED_DATE,
    },
    Max: {
      monthlyRatePerSeat: 100,
      sourceUrl: 'https://github.com/features/copilot/plans',
      verifiedDate: VERIFIED_DATE,
    },
    Business: {
      monthlyRatePerSeat: 19,
      sourceUrl: 'https://github.com/features/copilot/plans',
      verifiedDate: VERIFIED_DATE,
    },
    Enterprise: {
      monthlyRatePerSeat: 39,
      sourceUrl: 'https://github.com/features/copilot/plans',
      verifiedDate: VERIFIED_DATE,
    },
  },
  ChatGPT: {
    Free: {
      monthlyRatePerSeat: 0,
      annualRatePerSeat: 0,
      sourceUrl: 'https://chatgpt.com/pricing',
      verifiedDate: VERIFIED_DATE,
    },
    Go: {
      monthlyRatePerSeat: 8,
      sourceUrl: 'https://chatgpt.com/pricing',
      verifiedDate: VERIFIED_DATE,
    },
    Plus: {
      monthlyRatePerSeat: 20,
      sourceUrl: 'https://chatgpt.com/pricing',
      verifiedDate: VERIFIED_DATE,
    },
    'Pro (lower tier)': {
      monthlyRatePerSeat: 100,
      sourceUrl: 'https://chatgpt.com/pricing',
      verifiedDate: VERIFIED_DATE,
    },
    Pro: {
      monthlyRatePerSeat: 200,
      sourceUrl: 'https://chatgpt.com/pricing',
      verifiedDate: VERIFIED_DATE,
    },
    'Pro (higher tier)': {
      monthlyRatePerSeat: 200,
      sourceUrl: 'https://chatgpt.com/pricing',
      verifiedDate: VERIFIED_DATE,
    },
    Team: {
      monthlyRatePerSeat: 30,
      annualRatePerSeat: 25,
      minSeats: 2,
      sourceUrl: 'https://openai.com/business/chatgpt-pricing/',
      verifiedDate: VERIFIED_DATE,
    },
    Business: {
      monthlyRatePerSeat: 25,
      annualRatePerSeat: 20,
      minSeats: 2,
      sourceUrl: 'https://openai.com/business/chatgpt-pricing/',
      verifiedDate: VERIFIED_DATE,
    },
  },
  Gemini: {
    Free: {
      monthlyRatePerSeat: 0,
      sourceUrl: 'https://gemini.google/subscriptions',
      verifiedDate: VERIFIED_DATE,
    },
    Pro: {
      monthlyRatePerSeat: 19.99,
      sourceUrl: 'https://gemini.google/subscriptions',
      verifiedDate: VERIFIED_DATE,
    },
    'Google AI Pro': {
      monthlyRatePerSeat: 19.99,
      sourceUrl: 'https://gemini.google/subscriptions',
      verifiedDate: VERIFIED_DATE,
    },
    Ultra: {
      monthlyRatePerSeat: 199.99,
      sourceUrl: 'https://gemini.google/subscriptions',
      verifiedDate: VERIFIED_DATE,
    },
    'Google AI Ultra (entry tier)': {
      monthlyRatePerSeat: 99.99,
      sourceUrl: 'https://gemini.google/subscriptions',
      verifiedDate: VERIFIED_DATE,
    },
  },
  v0: {
    Free: {
      monthlyRatePerSeat: 0,
      sourceUrl: 'https://v0.app/pricing',
      verifiedDate: VERIFIED_DATE,
    },
    Premium: {
      monthlyRatePerSeat: 20,
      sourceUrl: 'https://v0.app/pricing',
      verifiedDate: VERIFIED_DATE,
    },
    Team: {
      monthlyRatePerSeat: 30,
      sourceUrl: 'https://v0.app/pricing',
      verifiedDate: VERIFIED_DATE,
    },
    Business: {
      monthlyRatePerSeat: 100,
      sourceUrl: 'https://v0.app/pricing',
      verifiedDate: VERIFIED_DATE,
    },
  },
};

export const API_PRICING_REGISTRY: Record<
  string,
  Record<string, ApiTokenPricing>
> = {
  'OpenAI API': {
    'GPT-4.1 mini': {
      inputPerMillion: 0.4,
      outputPerMillion: 1.6,
      batchDiscountPercentage: 50,
      sourceUrl: 'https://developers.openai.com/api/docs/pricing',
      verifiedDate: VERIFIED_DATE,
    },
    'GPT-4.1': {
      inputPerMillion: 2.0,
      outputPerMillion: 8.0,
      batchDiscountPercentage: 50,
      sourceUrl: 'https://developers.openai.com/api/docs/pricing',
      verifiedDate: VERIFIED_DATE,
    },
    'GPT-5.4 mini': {
      inputPerMillion: 0.75,
      outputPerMillion: 4.0,
      batchDiscountPercentage: 50,
      sourceUrl: 'https://developers.openai.com/api/docs/pricing',
      verifiedDate: VERIFIED_DATE,
    },
  },
  'Anthropic API': {
    'Claude Haiku 4.5': {
      inputPerMillion: 0.8,
      outputPerMillion: 4.0,
      batchDiscountPercentage: 50,
      sourceUrl: 'https://claude.com/pricing',
      verifiedDate: VERIFIED_DATE,
    },
    'Claude Sonnet 5': {
      inputPerMillion: 2.0,
      outputPerMillion: 10.0,
      batchDiscountPercentage: 50,
      sourceUrl: 'https://claude.com/pricing',
      verifiedDate: VERIFIED_DATE,
    },
  },
  'Gemini API': {
    'Gemini 3 Flash': {
      inputPerMillion: 0.5,
      outputPerMillion: 3.0,
      batchDiscountPercentage: 50,
      sourceUrl: 'https://ai.google.dev/gemini-api/docs/pricing',
      verifiedDate: VERIFIED_DATE,
    },
    'Gemini 3.1 Pro': {
      inputPerMillion: 2.0,
      outputPerMillion: 12.0,
      batchDiscountPercentage: 50,
      sourceUrl: 'https://ai.google.dev/gemini-api/docs/pricing',
      verifiedDate: VERIFIED_DATE,
    },
  },
};
