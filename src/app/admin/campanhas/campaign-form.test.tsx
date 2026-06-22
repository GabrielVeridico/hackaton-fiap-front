import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CampaignForm } from './campaign-form';

describe('CampaignForm', () => {
  it('rejeita meta zero e data fim no passado', async () => {
    const onSubmit = vi.fn();
    render(<CampaignForm onSubmit={onSubmit} isPending={false} submitLabel="Criar" />);
    await userEvent.type(screen.getByLabelText(/título/i), 'Campanha X');
    await userEvent.type(screen.getByLabelText(/descrição/i), 'desc');
    await userEvent.type(screen.getByLabelText(/início/i), '2020-01-01');
    await userEvent.type(screen.getByLabelText(/^Meta/i), '0');
    await userEvent.type(screen.getByLabelText(/fim/i), '2020-02-01');
    await userEvent.click(screen.getByRole('button', { name: /criar/i }));
    expect(await screen.findByText(/maior que zero/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('envia dados válidos', async () => {
    const onSubmit = vi.fn();
    render(<CampaignForm onSubmit={onSubmit} isPending={false} submitLabel="Criar" />);
    await userEvent.type(screen.getByLabelText(/título/i), 'Campanha X');
    await userEvent.type(screen.getByLabelText(/descrição/i), 'desc');
    await userEvent.type(screen.getByLabelText(/início/i), '2026-01-01');
    await userEvent.type(screen.getByLabelText(/fim/i), '2090-02-01');
    await userEvent.type(screen.getByLabelText(/^Meta/i), '1000');
    await userEvent.click(screen.getByRole('button', { name: /criar/i }));
    expect(onSubmit).toHaveBeenCalled();
    const arg = onSubmit.mock.calls[0]![0];
    expect(arg.title).toBe('Campanha X');
    expect(arg.goal).toBe(1000);
  });
});
