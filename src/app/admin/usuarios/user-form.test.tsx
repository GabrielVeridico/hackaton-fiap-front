import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserForm } from './user-form';

describe('UserForm', () => {
  it('gestor não-owner não vê a opção GestorONG e rejeita CPF inválido', async () => {
    const onSubmit = vi.fn();
    render(<UserForm actorIsOwner={false} onSubmit={onSubmit} isPending={false} />);
    expect(screen.queryByRole('option', { name: /gestor/i })).not.toBeInTheDocument();
    await userEvent.type(screen.getByLabelText(/nome/i), 'Maria Silva');
    await userEvent.type(screen.getByLabelText(/documento|cpf/i), '111.111.111-11');
    await userEvent.type(screen.getByLabelText(/e-mail/i), 'm@x.com');
    await userEvent.type(screen.getByLabelText(/senha/i), 'Senha@123');
    await userEvent.click(screen.getByRole('button', { name: /criar/i }));
    expect(await screen.findByText(/documento inválido/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('envia doador válido com role Doador', async () => {
    const onSubmit = vi.fn();
    render(<UserForm actorIsOwner={false} onSubmit={onSubmit} isPending={false} />);
    await userEvent.type(screen.getByLabelText(/nome/i), 'Maria Silva');
    await userEvent.type(screen.getByLabelText(/documento|cpf/i), '529.982.247-25');
    await userEvent.type(screen.getByLabelText(/e-mail/i), 'm@x.com');
    await userEvent.type(screen.getByLabelText(/senha/i), 'Senha@123');
    await userEvent.click(screen.getByRole('button', { name: /criar/i }));
    expect(onSubmit).toHaveBeenCalled();
    const arg = onSubmit.mock.calls[0]![0];
    expect(arg.role).toBe('Doador');
    expect(arg.personType).toBe('Individual');
  });
});
