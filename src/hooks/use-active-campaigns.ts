'use client';

import { useQuery } from '@tanstack/react-query';
import { bffGet } from '@/lib/bff-client';
import type { TransparencyCampaign } from '@/domain/transparency/transparency-campaign';

export function useActiveCampaigns() {
  return useQuery({
    queryKey: ['transparency', 'campaigns'],
    queryFn: () => bffGet<TransparencyCampaign[]>('/transparency/campaigns'),
  });
}
