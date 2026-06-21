'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bffGet, bffPost, bffPut, bffPatch } from '@/lib/bff-client';
import type { Campaign, CampaignStatusAction } from '@/domain/campaigns/campaign';
import type { CampaignInput } from '@/application/campaigns/campaign-types';

const LIST_KEY = ['campaigns', 'admin'] as const;

export function useAdminCampaigns() {
  return useQuery({ queryKey: LIST_KEY, queryFn: () => bffGet<Campaign[]>('/campaigns') });
}

export function useAdminCampaign(id: string | undefined) {
  return useQuery({
    queryKey: ['campaigns', 'admin', id],
    queryFn: () => bffGet<Campaign>(`/campaigns/${id}`),
    enabled: Boolean(id),
  });
}

export function useCreateCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CampaignInput) => bffPost<{ id: string }>('/campaigns', input),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: LIST_KEY }); },
  });
}

export function useUpdateCampaign(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CampaignInput) => bffPut<void>(`/campaigns/${id}`, input),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['campaigns', 'admin'] }); },
  });
}

export function useChangeCampaignStatus(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (action: CampaignStatusAction) => bffPatch<void>(`/campaigns/${id}/status`, { action }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['campaigns', 'admin'] }); },
  });
}
