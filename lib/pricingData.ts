export type ToolName =
  | 'cursor'
  | 'copilot'
  | 'claude'
  | 'chatgpt'
  | 'anthropic_api'
  | 'openai_api'
  | 'gemini'
  | 'windsurf';

export type PrimaryUseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed';

export interface PlanDetails {
  name: string;
  pricePerSeat: number; // monthly cost per seat in USD
  minSeats?: number;     // minimum seats required for this plan
  maxSeats?: number;     // maximum seats allowed on this plan
  isCustom?: boolean;    // true if custom enterprise pricing
  customEstimatedPrice?: number; // fallback estimate for enterprise math
}

export interface ToolPricing {
  displayName: string;
  plans: Record<string, PlanDetails>;
}

export const PRICING_DATABASE: Record<ToolName, ToolPricing> = {
  cursor: {
    displayName: 'Cursor',
    plans: {
      hobby: { name: 'Hobby', pricePerSeat: 0, maxSeats: 1 },
      pro: { name: 'Pro', pricePerSeat: 20 },
      business: { name: 'Business', pricePerSeat: 40 },
      enterprise: { name: 'Enterprise', pricePerSeat: 100, isCustom: true, customEstimatedPrice: 100 },
    },
  },
  copilot: {
    displayName: 'GitHub Copilot',
    plans: {
      free: { name: 'Free', pricePerSeat: 0 },
      individual: { name: 'Individual', pricePerSeat: 10 },
      business: { name: 'Business', pricePerSeat: 19 },
      enterprise: { name: 'Enterprise', pricePerSeat: 39 },
    },
  },
  claude: {
    displayName: 'Claude.ai',
    plans: {
      free: { name: 'Free', pricePerSeat: 0 },
      pro: { name: 'Pro', pricePerSeat: 20 },
      max: { name: 'Max', pricePerSeat: 100 },
      team: { name: 'Team', pricePerSeat: 25, minSeats: 5 }, // 5-seat minimum!
      enterprise: { name: 'Enterprise', pricePerSeat: 75, isCustom: true, customEstimatedPrice: 75 },
      api: { name: 'API Direct', pricePerSeat: 0, isCustom: false }, // usage-based
    },
  },
  chatgpt: {
    displayName: 'ChatGPT',
    plans: {
      free: { name: 'Free', pricePerSeat: 0 },
      plus: { name: 'Plus', pricePerSeat: 20 },
      team: { name: 'Team', pricePerSeat: 25, minSeats: 2 }, // 2-seat minimum!
      enterprise: { name: 'Enterprise', pricePerSeat: 60, isCustom: true, customEstimatedPrice: 60 },
      api: { name: 'API Direct', pricePerSeat: 0 }, // usage-based
    },
  },
  anthropic_api: {
    displayName: 'Anthropic API',
    plans: {
      pay_as_you_go: { name: 'Pay As You Go', pricePerSeat: 0 },
    },
  },
  openai_api: {
    displayName: 'OpenAI API',
    plans: {
      pay_as_you_go: { name: 'Pay As You Go', pricePerSeat: 0 },
    },
  },
  gemini: {
    displayName: 'Gemini (Google AI)',
    plans: {
      free: { name: 'Free', pricePerSeat: 0 },
      advanced: { name: 'Advanced', pricePerSeat: 20, maxSeats: 1 },
      business: { name: 'Business', pricePerSeat: 20, minSeats: 1 },
      enterprise: { name: 'Enterprise', pricePerSeat: 30, minSeats: 1 },
      api: { name: 'API Direct', pricePerSeat: 0 },
    },
  },
  windsurf: {
    displayName: 'Windsurf',
    plans: {
      free: { name: 'Free', pricePerSeat: 0 },
      pro: { name: 'Pro', pricePerSeat: 20 },
      max: { name: 'Max', pricePerSeat: 200 },
      teams: { name: 'Teams', pricePerSeat: 40 },
      enterprise: { name: 'Enterprise', pricePerSeat: 80, isCustom: true, customEstimatedPrice: 80 },
    },
  },
};
