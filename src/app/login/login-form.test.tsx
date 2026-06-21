import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './login-form';

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));
const mutate = vi.fn();
vi.mock('@/hooks/use-auth', () => ({
  useLogin: () => ({ mutate, isPending: false, error: null }),
}));

describe('LoginForm', () => {
  it('valida e-mail obrigatório antes de enviar', async () => {
    render(<LoginForm />);
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText(/informe um e-mail/i)).toBeInTheDocument();
    expect(mutate).not.toHaveBeenCalled();
  });

  it('envia credenciais válidas', async () => {
    render(<LoginForm />);
    await userEvent.type(screen.getByLabelText(/e-mail/i), 'ana@x.com');
    await userEvent.type(screen.getByLabelText(/senha/i), 'Senha@123');
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(mutate).toHaveBeenCalledWith(
      { email: 'ana@x.com', password: 'Senha@123' },
      expect.anything(),
    );
  });
});
