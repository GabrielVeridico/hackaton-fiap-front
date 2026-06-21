import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CadastroForm } from './cadastro-form';

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));
const mutate = vi.fn();
vi.mock('@/hooks/use-auth', () => ({
  useRegister: () => ({ mutate, isPending: false, error: null }),
}));

describe('CadastroForm', () => {
  it('rejeita CPF inválido', async () => {
    render(<CadastroForm />);
    await userEvent.type(screen.getByLabelText(/nome/i), 'Ana Maria');
    await userEvent.type(screen.getByLabelText(/documento|cpf/i), '111.111.111-11');
    await userEvent.type(screen.getByLabelText(/e-mail/i), 'ana@x.com');
    await userEvent.type(screen.getByLabelText(/senha/i), 'Senha@123');
    await userEvent.click(screen.getByRole('button', { name: /criar conta/i }));
    expect(await screen.findByText(/documento inválido/i)).toBeInTheDocument();
    expect(mutate).not.toHaveBeenCalled();
  });

  it('envia cadastro válido (PF)', async () => {
    render(<CadastroForm />);
    await userEvent.type(screen.getByLabelText(/nome/i), 'Ana Maria');
    await userEvent.type(screen.getByLabelText(/documento|cpf/i), '529.982.247-25');
    await userEvent.type(screen.getByLabelText(/e-mail/i), 'ana@x.com');
    await userEvent.type(screen.getByLabelText(/senha/i), 'Senha@123');
    await userEvent.click(screen.getByRole('button', { name: /criar conta/i }));
    expect(mutate).toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const arg = mutate.mock.calls[0]![0];
    expect(arg.personType).toBe('Individual');
    expect(arg.email).toBe('ana@x.com');
  });
});
