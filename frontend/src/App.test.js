import { render, screen } from '@testing-library/react';
import App from './App';

test('renders reservia brand', () => {
  render(<App />);
  const brandElement = screen.getByText(/reservia/i);
  expect(brandElement).toBeInTheDocument();
});
