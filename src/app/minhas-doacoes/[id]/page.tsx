import { DonationStatus } from './donation-status';

export const metadata = { title: 'Status da doação — Conexão Solidária' };

export default async function DonationStatusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DonationStatus id={id} />;
}
