'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRegister } from '@/hooks/use-auth';
import { isValidDocument } from '@/domain/users/document';

const schema = z
  .object({
    personType: z.enum(['Individual', 'Company']),
    name: z.string().min(3, 'Informe o nome completo'),
    document: z.string().min(1, 'Informe o documento'),
    email: z.string().min(1, 'Informe um e-mail').email('E-mail inválido'),
    password: z.string().min(8, 'A senha deve ter ao menos 8 caracteres'),
  })
  .refine((v) => isValidDocument(v.document, v.personType), {
    path: ['document'],
    message: 'Documento inválido',
  });
type CadastroValues = z.infer<typeof schema>;

export function CadastroForm() {
  const router = useRouter();
  const { mutate, isPending, error } = useRegister();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CadastroValues>({
    resolver: zodResolver(schema),
    defaultValues: { personType: 'Individual', name: '', document: '', email: '', password: '' },
  });
  const personType = watch('personType');

  const onSubmit = (values: CadastroValues) => {
    mutate(values, { onSuccess: () => router.push('/login?cadastro=ok') });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <fieldset className="flex gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="radio" value="Individual" {...register('personType')} /> Pessoa Física
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="radio" value="Company" {...register('personType')} /> Pessoa Jurídica
        </label>
      </fieldset>
      <div className="space-y-1.5">
        <Label htmlFor="name">Nome completo</Label>
        <Input id="name" {...register('name')} />
        {errors.name ? <p className="text-sm text-destructive">{errors.name.message}</p> : null}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="document">{personType === 'Company' ? 'CNPJ' : 'CPF'}</Label>
        <Input id="document" inputMode="numeric" {...register('document')} />
        {errors.document ? (
          <p className="text-sm text-destructive">{errors.document.message}</p>
        ) : null}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" type="email" autoComplete="email" {...register('email')} />
        {errors.email ? <p className="text-sm text-destructive">{errors.email.message}</p> : null}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Senha</Label>
        <Input id="password" type="password" autoComplete="new-password" {...register('password')} />
        {errors.password ? (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        ) : null}
      </div>
      {error ? <p className="text-sm text-destructive">{(error as Error).message}</p> : null}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Criando…' : 'Criar conta'}
      </Button>
    </form>
  );
}
