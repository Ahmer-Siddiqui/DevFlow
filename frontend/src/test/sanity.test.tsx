import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('DevFlow Frontend Sanity Check', () => {
  it('should render a sample element and assert text', () => {
    render(<div data-testid="app-ready">DevFlow Client Ready</div>);
    expect(screen.getByTestId('app-ready')).toHaveTextContent('DevFlow Client Ready');
  });
});
