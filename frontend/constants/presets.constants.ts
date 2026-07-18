import { AuditInputDto } from '@/types/audit.types';

export interface InstantPreset {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  data: AuditInputDto;
}

export const INSTANT_PRESETS: InstantPreset[] = [
  {
    id: 'startup-coding',
    title: 'Startup Coding Team Overkill',
    subtitle: '10 seats on Cursor Business ($40/seat) with monthly billing',
    badge: 'High Waste ($2,880/yr)',
    data: {
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
    },
  },
  {
    id: 'design-writing',
    title: 'Mid-Size Creative Agency Stack',
    subtitle: '25 seats on Claude Team + 10 seats on ChatGPT Team monthly',
    badge: 'Moderate Waste ($1,500/yr)',
    data: {
      teamSize: 25,
      primaryUseCase: 'writing',
      tools: [
        {
          toolName: 'Claude',
          plan: 'Team',
          seats: 25,
          currentMonthlySpend: 750,
        },
        {
          toolName: 'ChatGPT',
          plan: 'Team',
          seats: 10,
          currentMonthlySpend: 300,
        },
      ],
    },
  },
  {
    id: 'enterprise-copilot',
    title: 'Enterprise Copilot & Retail Seat Overload',
    subtitle: '50 seats on GitHub Copilot Enterprise + high retail seats',
    badge: 'Critical Waste ($12,000/yr)',
    data: {
      teamSize: 50,
      primaryUseCase: 'coding',
      tools: [
        {
          toolName: 'GitHub Copilot',
          plan: 'Enterprise',
          seats: 50,
          currentMonthlySpend: 1950,
        },
        {
          toolName: 'Claude',
          plan: 'Enterprise',
          seats: 20,
          currentMonthlySpend: 1200,
        },
      ],
    },
  },
];
