import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../card';

describe('Card Component', () => {
  it('should render card with content', () => {
    render(
      <Card>
        <CardContent>Card content</CardContent>
      </Card>
    );

    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('should render card with header', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>Card content</CardContent>
      </Card>
    );

    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card Description')).toBeInTheDocument();
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('should render card with footer', () => {
    render(
      <Card>
        <CardContent>Card content</CardContent>
        <CardFooter>Card footer</CardFooter>
      </Card>
    );

    expect(screen.getByText('Card content')).toBeInTheDocument();
    expect(screen.getByText('Card footer')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(
      <Card className='custom-card'>
        <CardContent>Content</CardContent>
      </Card>
    );

    expect(screen.getByText('Content').closest('div')).toHaveClass('custom-card');
  });

  it('should handle click events', async () => {
    const handleClick = vi.fn();

    render(
      <Card onClick={handleClick}>
        <CardContent>Clickable card</CardContent>
      </Card>
    );

    await userEvent.click(screen.getByText('Clickable card'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('should be accessible', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Accessible Card</CardTitle>
        </CardHeader>
        <CardContent>Card content</CardContent>
      </Card>
    );

    // Check that the card has proper structure
    const card = screen.getByText('Accessible Card').closest('div');
    expect(card).toBeInTheDocument();
  });

  it('should render multiple cards', () => {
    render(
      <div>
        <Card>
          <CardContent>Card 1</CardContent>
        </Card>
        <Card>
          <CardContent>Card 2</CardContent>
        </Card>
      </div>
    );

    expect(screen.getByText('Card 1')).toBeInTheDocument();
    expect(screen.getByText('Card 2')).toBeInTheDocument();
  });

  it('should handle complex card structure', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Complex Card</CardTitle>
          <CardDescription>This is a complex card with multiple sections</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Main content goes here</p>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </CardContent>
        <CardFooter>
          <button>Action Button</button>
        </CardFooter>
      </Card>
    );

    expect(screen.getByText('Complex Card')).toBeInTheDocument();
    expect(screen.getByText('This is a complex card with multiple sections')).toBeInTheDocument();
    expect(screen.getByText('Main content goes here')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action Button' })).toBeInTheDocument();
  });
});
