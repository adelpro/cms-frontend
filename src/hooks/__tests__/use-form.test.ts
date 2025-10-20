import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { useForm } from '../use-form';

describe('useForm Hook', () => {
  const mockTranslations = (key: string) => key;

  // Mock next-intl
  vi.mock('next-intl', () => ({
    useTranslations: () => mockTranslations,
  }));

  it('should initialize with initial data', () => {
    const { result } = renderHook(() =>
      useForm({
        initialData: { email: '', password: '' },
        validate: () => ({ isValid: true, errors: [] }),
        onSubmit: async () => ({ success: true }),
      })
    );

    expect(result.current.formData).toEqual({ email: '', password: '' });
    expect(result.current.errors).toEqual({});
    expect(result.current.isLoading).toBe(false);
    expect(result.current.submitError).toBe('');
  });

  it('should update form data on input change', () => {
    const { result } = renderHook(() =>
      useForm({
        initialData: { email: '', password: '' },
        validate: () => ({ isValid: true, errors: [] }),
        onSubmit: async () => ({ success: true }),
      })
    );

    act(() => {
      const event = {
        target: { value: 'test@example.com' },
      } as React.ChangeEvent<HTMLInputElement>;
      result.current.handleInputChange('email')(event);
    });

    expect(result.current.formData.email).toBe('test@example.com');
  });

  it('should clear field error when user starts typing', () => {
    const { result } = renderHook(() =>
      useForm({
        initialData: { email: '', password: '' },
        validate: () => ({
          isValid: false,
          errors: [{ field: 'email', message: 'Email is required' }],
        }),
        onSubmit: async () => ({ success: true }),
      })
    );

    // First submit to trigger validation error
    act(() => {
      result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as React.FormEvent<HTMLFormElement>);
    });

    expect(result.current.errors.email).toBe('Email is required');

    // Then type in the field
    act(() => {
      const event = {
        target: { value: 'test@example.com' },
      } as React.ChangeEvent<HTMLInputElement>;
      result.current.handleInputChange('email')(event);
    });

    expect(result.current.errors.email).toBe('');
  });

  it('should validate form on submit', async () => {
    const mockValidate = vi.fn().mockReturnValue({
      isValid: false,
      errors: [{ field: 'email', message: 'Email is required' }],
    });

    const { result } = renderHook(() =>
      useForm({
        initialData: { email: '', password: '' },
        validate: mockValidate,
        onSubmit: async () => ({ success: true }),
      })
    );

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as React.FormEvent<HTMLFormElement>);
    });

    expect(mockValidate).toHaveBeenCalledWith({ email: '', password: '' }, mockTranslations);
    expect(result.current.errors.email).toBe('Email is required');
  });

  it('should handle successful submission', async () => {
    const mockOnSuccess = vi.fn();
    const mockOnSubmit = vi.fn().mockResolvedValue({ success: true });

    const { result } = renderHook(() =>
      useForm({
        initialData: { email: 'test@example.com', password: 'password123' },
        validate: () => ({ isValid: true, errors: [] }),
        onSubmit: mockOnSubmit,
        onSuccess: mockOnSuccess,
      })
    );

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as React.FormEvent<HTMLFormElement>);
    });

    expect(mockOnSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(mockOnSuccess).toHaveBeenCalledWith({ success: true });
  });

  it('should handle submission error', async () => {
    const mockOnSubmit = vi.fn().mockResolvedValue({
      success: false,
      error: 'Network error',
    });

    const { result } = renderHook(() =>
      useForm({
        initialData: { email: 'test@example.com', password: 'password123' },
        validate: () => ({ isValid: true, errors: [] }),
        onSubmit: mockOnSubmit,
      })
    );

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as React.FormEvent<HTMLFormElement>);
    });

    expect(result.current.submitError).toBe('Network error');
  });

  it('should handle submission exception', async () => {
    const mockOnSubmit = vi.fn().mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() =>
      useForm({
        initialData: { email: 'test@example.com', password: 'password123' },
        validate: () => ({ isValid: true, errors: [] }),
        onSubmit: mockOnSubmit,
      })
    );

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as React.FormEvent<HTMLFormElement>);
    });

    expect(result.current.submitError).toBe('errors.networkError');
  });

  it('should reset form to initial state', () => {
    const { result } = renderHook(() =>
      useForm({
        initialData: { email: '', password: '' },
        validate: () => ({ isValid: true, errors: [] }),
        onSubmit: async () => ({ success: true }),
      })
    );

    // Change form data
    act(() => {
      const event = {
        target: { value: 'test@example.com' },
      } as React.ChangeEvent<HTMLInputElement>;
      result.current.handleInputChange('email')(event);
    });

    expect(result.current.formData.email).toBe('test@example.com');

    // Reset form
    act(() => {
      result.current.resetForm();
    });

    expect(result.current.formData).toEqual({ email: '', password: '' });
    expect(result.current.errors).toEqual({});
    expect(result.current.submitError).toBe('');
    expect(result.current.isLoading).toBe(false);
  });

  it('should set specific field value', () => {
    const { result } = renderHook(() =>
      useForm({
        initialData: { email: '', password: '' },
        validate: () => ({ isValid: true, errors: [] }),
        onSubmit: async () => ({ success: true }),
      })
    );

    act(() => {
      result.current.setFieldValue('email', 'test@example.com');
    });

    expect(result.current.formData.email).toBe('test@example.com');
  });

  it('should set specific field error', () => {
    const { result } = renderHook(() =>
      useForm({
        initialData: { email: '', password: '' },
        validate: () => ({ isValid: true, errors: [] }),
        onSubmit: async () => ({ success: true }),
      })
    );

    act(() => {
      result.current.setFieldError('email', 'Email is required');
    });

    expect(result.current.errors.email).toBe('Email is required');
  });

  it('should clear all errors', () => {
    const { result } = renderHook(() =>
      useForm({
        initialData: { email: '', password: '' },
        validate: () => ({ isValid: true, errors: [] }),
        onSubmit: async () => ({ success: true }),
      })
    );

    // Set some errors
    act(() => {
      result.current.setFieldError('email', 'Email is required');
      result.current.setFieldError('password', 'Password is required');
    });

    expect(result.current.errors.email).toBe('Email is required');
    expect(result.current.errors.password).toBe('Password is required');

    // Clear errors
    act(() => {
      result.current.clearErrors();
    });

    expect(result.current.errors).toEqual({});
    expect(result.current.submitError).toBe('');
  });

  it('should show loading state during submission', async () => {
    const mockOnSubmit = vi
      .fn()
      .mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ success: true }), 100))
      );

    const { result } = renderHook(() =>
      useForm({
        initialData: { email: 'test@example.com', password: 'password123' },
        validate: () => ({ isValid: true, errors: [] }),
        onSubmit: mockOnSubmit,
      })
    );

    expect(result.current.isLoading).toBe(false);

    // Start submission
    act(() => {
      result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as React.FormEvent<HTMLFormElement>);
    });

    expect(result.current.isLoading).toBe(true);

    // Wait for completion
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should not submit if validation fails', async () => {
    const mockOnSubmit = vi.fn();

    const { result } = renderHook(() =>
      useForm({
        initialData: { email: '', password: '' },
        validate: () => ({
          isValid: false,
          errors: [{ field: 'email', message: 'Email is required' }],
        }),
        onSubmit: mockOnSubmit,
      })
    );

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as React.FormEvent<HTMLFormElement>);
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
    expect(result.current.errors.email).toBe('Email is required');
  });
});
