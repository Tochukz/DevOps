import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Environment', () => {
  render(<App />);
  const linkElement = screen.getByText(/Environment/i);
  expect(linkElement).toBeInTheDocument();
});
