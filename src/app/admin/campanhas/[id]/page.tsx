import { EditCampaign } from './edit-campaign';

export const metadata = { title: 'Editar campanha — Conexão Solidária' };

export default async function EditCampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditCampaign id={id} />;
}
