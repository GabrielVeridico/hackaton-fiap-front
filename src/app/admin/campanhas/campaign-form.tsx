'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { isEndAfterStart, isEndNotInPast, isGoalValid } from '@/domain/campaigns/campaign';
import type { CampaignInput } from '@/application/campaigns/campaign-types';

const schema = z
  .object({
    title: z.string().min(3, 'Informe o título'),
    description: z.string().min(1, 'Informe a descrição'),
    startDate: z.string().min(1, 'Informe a data de início'),
    endDate: z.string().min(1, 'Informe a data de término'),
    goal: z.coerce.number(),
  })
  .superRefine((v, ctx) => {
    if (!isGoalValid(v.goal)) {
      ctx.addIssue({ path: ['goal'], code: 'custom', message: 'A meta deve ser maior que zero.' });
    }
    if (v.startDate && v.endDate && !isEndAfterStart(v.startDate, v.endDate)) {
      ctx.addIssue({
        path: ['endDate'],
        code: 'custom',
        message: 'O término deve ser igual ou após o início.',
      });
    }
    if (v.endDate && !isEndNotInPast(v.endDate, new Date().toISOString().slice(0, 10))) {
      ctx.addIssue({
        path: ['endDate'],
        code: 'custom',
        message: 'O término não pode estar no passado.',
      });
    }
  });

type FormValues = z.input<typeof schema>;

export function CampaignForm({
  defaultValues,
  onSubmit,
  isPending,
  submitLabel,
  error,
}: {
  defaultValues?: Partial<CampaignInput>;
  onSubmit: (input: CampaignInput) => void;
  isPending: boolean;
  submitLabel: string;
  error?: string | null;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: defaultValues?.title ?? '',
      description: defaultValues?.description ?? '',
      startDate: defaultValues?.startDate?.slice(0, 10) ?? '',
      endDate: defaultValues?.endDate?.slice(0, 10) ?? '',
      goal: defaultValues?.goal ?? 0,
    },
  });

  const submit = handleSubmit((values) => {
    onSubmit({
      title: values.title,
      description: values.description,
      startDate: values.startDate,
      endDate: values.endDate,
      goal: Number(values.goal),
    });
  });

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="title">Título</Label>
        <Input id="title" {...register('title')} />
        {errors.title ? (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        ) : null}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="description">Descrição</Label>
        <Input id="description" {...register('description')} />
        {errors.description ? (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        ) : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="startDate">Início</Label>
          <Input id="startDate" type="date" {...register('startDate')} />
          {errors.startDate ? (
            <p className="text-sm text-destructive">{errors.startDate.message}</p>
          ) : null}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="endDate">Fim</Label>
          <Input id="endDate" type="date" {...register('endDate')} />
          {errors.endDate ? (
            <p className="text-sm text-destructive">{errors.endDate.message}</p>
          ) : null}
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="goal">Meta (R$)</Label>
        <Input id="goal" type="number" step="0.01" {...register('goal')} />
        {errors.goal ? (
          <p className="text-sm text-destructive">{errors.goal.message}</p>
        ) : null}
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Salvando…' : submitLabel}
      </Button>
    </form>
  );
}
