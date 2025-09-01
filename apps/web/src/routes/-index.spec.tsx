import { render } from '@testing-library/react';
import { NxWelcome } from './index';

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NxWelcome />);
    expect(baseElement).toBeTruthy();
  });

  it('should have a greeting as the title', () => {
    const { getAllByText } = render(<NxWelcome />);
    expect(getAllByText(new RegExp('Welcome to Nx ', 'gi')).length > 0).toBeTruthy();
  });
});
