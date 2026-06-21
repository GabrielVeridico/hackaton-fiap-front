// DonationAPI = camelCase (default ASP.NET). Enums em response são strings.
export interface DonationResponseDto {
  id: string;
  campaignId: string;
  amount: number;
  method: string;
  status: string;
  declineReason: string | null;
  createdAt: string;
  processedAt: string | null;
}

export interface CreateDonationResultDto {
  donationId: string;
  status: string;
}
