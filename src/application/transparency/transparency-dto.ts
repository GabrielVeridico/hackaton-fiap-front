// Contrato do GET /api/transparency/campaigns da DonationAPI.
// ATENÇÃO: a DonationAPI usa o casing padrão do ASP.NET Core (camelCase),
// diferente da UserAPI (que fixa PropertyNamingPolicy=null → PascalCase).
// `id`/`description` dependem do ajuste de backend da Lacuna 1 (podem faltar).
export interface TransparencyCampaignDto {
  id?: string;
  title: string;
  description?: string;
  goal: number;
  amountRaised: number;
  percentual: number;
}
