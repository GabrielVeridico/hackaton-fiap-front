export type CampaignStatus = 'Active' | 'Completed' | 'Cancelled';
export type CompletionReason = 'GoalReached' | 'ManuallyClosed' | 'Expired';
export type CampaignStatusAction = 'Close' | 'Cancel';

export interface Campaign {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  goal: number;
  amountRaised: number;
  status: CampaignStatus;
  completionReason?: CompletionReason;
  createdAt: string;
  updatedAt: string;
}

export function campaignStatusActionToCode(action: CampaignStatusAction): 0 | 1 {
  return action === 'Cancel' ? 1 : 0;
}

export function isGoalValid(goal: number): boolean {
  return goal > 0;
}

export function isEndAfterStart(startIso: string, endIso: string): boolean {
  return new Date(endIso).getTime() >= new Date(startIso).getTime();
}

export function isEndNotInPast(endIso: string, nowIso: string): boolean {
  return new Date(endIso).getTime() >= new Date(nowIso).getTime();
}
