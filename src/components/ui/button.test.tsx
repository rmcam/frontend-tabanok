import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from './button'; // Assuming button.tsx is in the same directory

describe('Button', () => {
  test('renders the button with default variant and size', () => {
    render(<Button>Click Me</Button>);
    const buttonElement = screen.getByRole('button', { name: /click me/i });
    expect(buttonElement).toBeInTheDocument();
    // You might want to add checks for default classes here if needed
  });

  test('renders the button with a different variant', () => {
    render(<Button variant="destructive">Delete</Button>);
    const buttonElement = screen.getByRole('button', { name: /delete/i });
    expect(buttonElement).toBeInTheDocument();
    // Add checks for destructive variant classes
  });

  test('renders the button with a different size', () => {
    render(<Button size="lg">Large Button</Button>);
    const buttonElement = screen.getByRole('button', { name: /large button/i });
    expect(buttonElement).toBeInTheDocument();
    // Add checks for large size classes
  });

  test('renders the button as a child element when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/link">Link Button</a>
      </Button>
    );
    const linkElement = screen.getByRole('link', { name: /link button/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement.tagName).toBe('A');
  });

  test('applies custom className', () => {
    render(<Button className="custom-class">Styled Button</Button>);
    const buttonElement = screen.getByRole('button', { name: /styled button/i });
    expect(buttonElement).toHaveClass('custom-class');
  });

  test('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Clickable</Button>);
    const buttonElement = screen.getByRole('button', { name: /clickable/i });
    buttonElement.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    const buttonElement = screen.getByRole('button', { name: /disabled button/i });
    expect(buttonElement).toBeDisabled();
  });
});
