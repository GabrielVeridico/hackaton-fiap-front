import { EditUser } from './edit-user';

export const metadata = { title: 'Editar usuário — Conexão Solidária' };

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditUser id={id} />;
}
