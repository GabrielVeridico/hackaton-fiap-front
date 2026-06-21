export interface TransparencyCampaign {
  id: string;
  title: string;
  description?: string;
  goal: number;
  amountRaised: number;
  percentage: number;
}

export function computePercentage(goal: number, amountRaised: number): number {
  if (goal <= 0) {
    return 0;
  }
  return Math.min(100, Math.round((amountRaised / goal) * 100));
}
