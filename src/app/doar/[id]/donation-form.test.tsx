import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DonationForm } from './donation-form';

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));
const mutate = vi.fn();
vi.mock('@/hooks/use-donations', () => ({
  useCreateDonation: () => ({ mutate, isPending: false, error: null }),
}));

describe('DonationForm', () => {
  it('avisa quando o valor termina em ,99', async () => {
    render(<DonationForm campaignId="c1" campaignTitle="Cestas" />);
    await userEvent.type(screen.getByLabelText(/valor/i), '10,99');
    expect(await screen.findByText(/,99/)).toBeInTheDocument();
  });

  it('rejeita valor zero/!>0 e não envia', async () => {
    render(<DonationForm campaignId="c1" campaignTitle="Cestas" />);
    await userEvent.type(screen.getByLabelText(/valor/i), '0');
    await userEvent.click(screen.getByRole('button', { name: /doar/i }));
    expect(await screen.findByText(/maior que zero/i)).toBeInTheDocument();
    expect(mutate).not.toHaveBeenCalled();
  });

  it('envia doação válida com campaignId e método', async () => {
    render(<DonationForm campaignId="c1" campaignTitle="Cestas" />);
    await userEvent.type(screen.getByLabelText(/valor/i), '50');
    await userEvent.click(screen.getByRole('button', { name: /doar/i }));
    expect(mutate).toHaveBeenCalled();
    const arg = mutate.mock.calls[0]![0];
    expect(arg.campaignId).toBe('c1');
    expect(arg.amount).toBe(50);
    expect(arg.method).toBe('Pix');
  });
});
