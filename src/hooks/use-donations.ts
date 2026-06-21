'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bffGet, bffPost } from '@/lib/bff-client';
import type { Donation, PaymentMethod } from '@/domain/donations/donation';
import type { CreateDonationResult } from '@/application/donations/donation-types';

export interface CreateDonationBody {
  campaignId: string;
  amount: number;
  method: PaymentMethod;
}

export function useCreateDonation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateDonationBody) => bffPost<CreateDonationResult>('/donations', input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['donations', 'mine'] });
    },
  });
}

export function useDonation(id: string | undefined) {
  return useQuery({
    queryKey: ['donations', 'detail', id],
    queryFn: () => bffGet<Donation>(`/donations/${id}`),
    enabled: Boolean(id),
    refetchInterval: (query) => (query.state.data?.status === 'Pending' ? 3000 : false),
  });
}

export function useMyDonations() {
  return useQuery({ queryKey: ['donations', 'mine'], queryFn: () => bffGet<Donation[]>('/donations') });
}
