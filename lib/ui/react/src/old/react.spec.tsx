import { render } from '@testing-library/react';

import NrwlzReactUi from './react';

describe('NrwlzReactUi', () => {
  
  it('should render successfully', () => {
    const { baseElement } = render(<NrwlzReactUi />);
    expect(baseElement).toBeTruthy();
  });
  
});
