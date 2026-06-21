import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CampaignCard } from './campaign-card';

describe('CampaignCard', () => {
  it('mostra título, valor arrecadado e percentual', () => {
    render(
      <CampaignCard
        campaign={{ id: '1', title: 'Cestas', goal: 1000, amountRaised: 250, percentage: 25 }}
      />,
    );
    expect(screen.getByText('Cestas')).toBeInTheDocument();
    expect(screen.getByText(/25%/)).toBeInTheDocument();
  });

  it('exibe descrição quando presente', () => {
    render(
      <CampaignCard
        campaign={{
          id: '2',
          title: 'Roupas',
          description: 'Doação de agasalhos',
          goal: 500,
          amountRaised: 100,
          percentage: 20,
        }}
      />,
    );
    expect(screen.getByText('Doação de agasalhos')).toBeInTheDocument();
  });

  it('não exibe descrição quando ausente', () => {
    const { container } = render(
      <CampaignCard
        campaign={{ id: '3', title: 'Alimentos', goal: 2000, amountRaised: 400, percentage: 20 }}
      />,
    );
    // The description paragraph appears only inside CardHeader; the Meta p is always present.
    // When no description, the CardHeader should have no <p> child with muted-foreground text-sm.
    const descriptionParagraph = container.querySelector(
      '[data-slot="card-header"] p.text-muted-foreground',
    );
    expect(descriptionParagraph).not.toBeInTheDocument();
  });

  it('formata valor arrecadado e meta em BRL', () => {
    render(
      <CampaignCard
        campaign={{ id: '4', title: 'Teste', goal: 1000, amountRaised: 250, percentage: 25 }}
      />,
    );
    expect(screen.getByText(/R\$\s*250/)).toBeInTheDocument();
    expect(screen.getByText(/Meta:.*R\$\s*1\.000/)).toBeInTheDocument();
  });
});
