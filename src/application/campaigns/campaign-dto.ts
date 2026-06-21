// DonationAPI = camelCase. Enums (status/completionReason) em response são strings.
export interface CampaignResponseDto {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  goal: number;
  amountRaised: number;
  status: string;
  completionReason: string | null;
  createdAt: string;
  updatedAt: string;
}
