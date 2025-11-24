import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import { DetailsPanel } from '../DetailsPanel';

const baseItem = {
  id: 'action-1',
  category: 'food' as const,
  recommendation: {
    title: 'Carry a tote & bottle',
    metadata: null,
  },
};

describe('DetailsPanel', () => {
  it('renders all metric cells when data available', () => {
    const item = {
      ...baseItem,
      recommendation: {
        ...baseItem.recommendation,
        metrics: {
          pkrMonth: 36,
          minutes: 10,
          kgco2eMonth: 2.08,
        },
      },
    };

    render(<DetailsPanel item={item} />);

    expect(screen.getByText('36')).toBeInTheDocument();
    expect(screen.getByText('10 min/mo')).toBeInTheDocument();
    expect(screen.getByText('2.08 kg')).toBeInTheDocument();
  });

  it('renders partial metrics when only minutes available', () => {
    const item = {
      ...baseItem,
      recommendation: {
        ...baseItem.recommendation,
        metrics: {
          minutes: 10,
        },
      },
    };

    render(<DetailsPanel item={item} />);

    expect(screen.getByText('10 min/mo')).toBeInTheDocument();
    expect(screen.queryByText('Rs/mo')).not.toBeInTheDocument();
  });

  it('shows effort breakdown', () => {
    const item = {
      ...baseItem,
      recommendation: {
        ...baseItem.recommendation,
        effort: {
          avgMinutesToDo: 3,
          steps: 2,
          requiresPurchase: true,
        },
      },
    };

    render(<DetailsPanel item={item} />);

    expect(screen.getByText('Effort: 3 min • 2 steps • may need purchase')).toBeInTheDocument();
  });

  it('shows partial effort breakdown', () => {
    const item = {
      ...baseItem,
      recommendation: {
        ...baseItem.recommendation,
        effort: {
          steps: 4,
        },
      },
    };

    render(<DetailsPanel item={item} />);

    expect(screen.getByText('Effort: 4 steps')).toBeInTheDocument();
  });

  it('renders fallback steps when how is empty', () => {
    render(<DetailsPanel item={{ ...baseItem, recommendation: { ...baseItem.recommendation, how: [] } }} />);

    fireEvent.click(screen.getByRole('button', { name: /How to do it/i }));

    expect(screen.getByText(/Pick one item to start with/)).toBeInTheDocument();
  });

  it('renders why shown when provided', () => {
    render(<DetailsPanel item={{ ...baseItem, whyShown: 'Persona match' }} />);

    expect(screen.getByText(/Why shown:/i)).toBeInTheDocument();
    expect(screen.getByText('Persona match')).toBeInTheDocument();
  });

  it('calls onLearnMore when learn more button clicked', () => {
    const onLearnMore = vi.fn();
    render(<DetailsPanel item={baseItem} onLearnMore={onLearnMore} />);

    fireEvent.click(screen.getByRole('button', { name: /Learn more/i }));
    expect(onLearnMore).toHaveBeenCalled();
  });

  it('complies with A11y for accordion', () => {
    render(<DetailsPanel item={baseItem} />);

    const toggle = screen.getByRole('button', { name: /How to do it/i });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });
});


