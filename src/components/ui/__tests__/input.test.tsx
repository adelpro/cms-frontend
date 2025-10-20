import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { Input } from '../input';

describe('Input Component', () => {
  it('should render input with placeholder', () => {
    render(<Input placeholder='Enter text' />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('should handle value changes', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<Input onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'test');

    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveValue('test');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('should show error state', () => {
    render(<Input className='border-destructive' />);
    expect(screen.getByRole('textbox')).toHaveClass('border-destructive');
  });

  it('should apply custom className', () => {
    render(<Input className='custom-class' />);
    expect(screen.getByRole('textbox')).toHaveClass('custom-class');
  });

  it('should handle different input types', () => {
    const { rerender } = render(<Input type='email' />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');

    rerender(<Input type='password' />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'password');

    rerender(<Input type='text' />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
  });

  it('should handle focus and blur events', async () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();
    const user = userEvent.setup();

    render(<Input onFocus={handleFocus} onBlur={handleBlur} />);

    const input = screen.getByRole('textbox');

    await user.click(input);
    expect(handleFocus).toHaveBeenCalled();

    await user.tab();
    expect(handleBlur).toHaveBeenCalled();
  });

  it('should handle keyboard events', async () => {
    const handleKeyDown = vi.fn();
    const user = userEvent.setup();

    render(<Input onKeyDown={handleKeyDown} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'a');

    expect(handleKeyDown).toHaveBeenCalled();
  });

  it('should be required when required prop is true', () => {
    render(<Input required />);
    expect(screen.getByRole('textbox')).toBeRequired();
  });

  it('should have correct aria attributes', () => {
    render(<Input aria-label='Test input' aria-describedby='help-text' />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-label', 'Test input');
    expect(input).toHaveAttribute('aria-describedby', 'help-text');
  });

  it('should handle controlled input', () => {
    const { rerender } = render(<Input value='initial' />);
    expect(screen.getByRole('textbox')).toHaveValue('initial');

    rerender(<Input value='updated' />);
    expect(screen.getByRole('textbox')).toHaveValue('updated');
  });

  it('should handle uncontrolled input with defaultValue', () => {
    render(<Input defaultValue='default' />);
    expect(screen.getByRole('textbox')).toHaveValue('default');
  });

  it('should forward ref correctly', () => {
    const ref = vi.fn();
    render(<Input ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});
