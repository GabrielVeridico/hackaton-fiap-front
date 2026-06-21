import type { CampaignStatus, CompletionReason } from '@/domain/campaigns/campaign';

export function campaignStatusLabel(status: CampaignStatus): string {
  const map: Record<CampaignStatus, string> = {
    Active: 'Ativa',
    Completed: 'Concluída',
    Cancelled: 'Cancelada',
  };
  return map[status];
}

export function completionReasonLabel(reason: CompletionReason): string {
  const map: Record<CompletionReason, string> = {
    GoalReached: 'Meta atingida',
    ManuallyClosed: 'Encerrada manualmente',
    Expired: 'Expirada',
  };
  return map[reason];
}
