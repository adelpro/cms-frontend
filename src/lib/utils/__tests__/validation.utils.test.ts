import { describe, it, expect } from 'vitest';

import {
  validators,
  validateLoginForm,
  validateSignupForm,
  validateProfileCompletionForm,
  validateSocialProfileForm,
} from '../validation.utils';

describe('Email Validator', () => {
  const t = (key: string) => key;

  it('should validate correct email', () => {
    expect(validators.email('test@example.com', t)).toBeNull();
  });

  it('should validate email with subdomain', () => {
    expect(validators.email('user@mail.example.com', t)).toBeNull();
  });

  it('should reject invalid email format', () => {
    expect(validators.email('invalid-email', t)).toBeTruthy();
  });

  it('should reject email without domain', () => {
    expect(validators.email('test@', t)).toBeTruthy();
  });

  it('should reject email without @ symbol', () => {
    expect(validators.email('testexample.com', t)).toBeTruthy();
  });

  it('should reject empty email', () => {
    expect(validators.email('', t)).toBeTruthy();
  });

  it('should reject undefined email', () => {
    expect(validators.email(undefined, t)).toBeTruthy();
  });
});

describe('Password Validator', () => {
  const t = (key: string) => key;

  it('should validate strong password', () => {
    expect(validators.password('password123', t)).toBeNull();
  });

  it('should validate password with special characters', () => {
    expect(validators.password('pass@word123', t)).toBeNull();
  });

  it('should reject short password', () => {
    expect(validators.password('123', t)).toBeTruthy();
  });

  it('should reject empty password', () => {
    expect(validators.password('', t)).toBeTruthy();
  });

  it('should reject undefined password', () => {
    expect(validators.password(undefined, t)).toBeTruthy();
  });
});

describe('Required Field Validator', () => {
  const t = (key: string) => key;

  it('should validate non-empty string', () => {
    expect(validators.required('test', 'fieldRequired', t)).toBeNull();
  });

  it('should reject empty string', () => {
    expect(validators.required('', 'fieldRequired', t)).toBeTruthy();
  });

  it('should reject whitespace-only string', () => {
    expect(validators.required('   ', 'fieldRequired', t)).toBeTruthy();
  });

  it('should reject undefined value', () => {
    expect(validators.required(undefined, 'fieldRequired', t)).toBeTruthy();
  });
});

describe('Phone Validator', () => {
  const t = (key: string) => key;

  it('should validate international phone number', () => {
    expect(validators.phone('+1234567890', t)).toBeNull();
  });

  it('should validate phone number without +', () => {
    expect(validators.phone('1234567890', t)).toBeNull();
  });

  it('should reject invalid phone format', () => {
    expect(validators.phone('abc123', t)).toBeTruthy();
  });

  it('should reject empty phone', () => {
    expect(validators.phone('', t)).toBeTruthy();
  });

  it('should handle phone with spaces', () => {
    expect(validators.phone('+1 234 567 890', t)).toBeNull();
  });
});

describe('URL Validator', () => {
  const t = (key: string) => key;

  it('should validate HTTP URL', () => {
    expect(validators.url('http://example.com', t)).toBeNull();
  });

  it('should validate HTTPS URL', () => {
    expect(validators.url('https://example.com', t)).toBeNull();
  });

  it('should validate URL with path', () => {
    expect(validators.url('https://example.com/path', t)).toBeNull();
  });

  it('should reject invalid URL', () => {
    expect(validators.url('not-a-url', t)).toBeTruthy();
  });

  it('should allow empty URL (optional)', () => {
    expect(validators.url('', t)).toBeNull();
  });

  it('should allow undefined URL (optional)', () => {
    expect(validators.url(undefined, t)).toBeNull();
  });
});

describe('Max Length Validator', () => {
  const t = (key: string) => key;

  it('should validate string within limit', () => {
    expect(validators.maxLength('test', 10, t)).toBeNull();
  });

  it('should reject string exceeding limit', () => {
    expect(validators.maxLength('this is a very long string', 10, t)).toBeTruthy();
  });

  it('should allow empty string', () => {
    expect(validators.maxLength('', 10, t)).toBeNull();
  });

  it('should allow undefined value', () => {
    expect(validators.maxLength(undefined, 10, t)).toBeNull();
  });
});

describe('Min Length Validator', () => {
  const t = (key: string) => key;

  it('should validate string meeting minimum', () => {
    expect(validators.minLength('test', 3, t)).toBeNull();
  });

  it('should reject string below minimum', () => {
    expect(validators.minLength('ab', 3, t)).toBeTruthy();
  });

  it('should allow empty string', () => {
    expect(validators.minLength('', 3, t)).toBeNull();
  });

  it('should allow undefined value', () => {
    expect(validators.minLength(undefined, 3, t)).toBeNull();
  });
});

describe('Login Form Validation', () => {
  const t = (key: string) => key;

  it('should validate correct login data', () => {
    const formData = {
      email: 'test@example.com',
      password: 'password123',
    };

    const result = validateLoginForm(formData, t);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject invalid email', () => {
    const formData = {
      email: 'invalid-email',
      password: 'password123',
    };

    const result = validateLoginForm(formData, t);
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].field).toBe('email');
  });

  it('should reject short password', () => {
    const formData = {
      email: 'test@example.com',
      password: '123',
    };

    const result = validateLoginForm(formData, t);
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].field).toBe('password');
  });

  it('should reject multiple invalid fields', () => {
    const formData = {
      email: 'invalid-email',
      password: '123',
    };

    const result = validateLoginForm(formData, t);
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(2);
  });
});

describe('Signup Form Validation', () => {
  const t = (key: string) => key;

  it('should validate correct signup data', () => {
    const formData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      title: 'Developer',
      phoneNumber: '+1234567890',
    };

    const result = validateSignupForm(formData, t);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject missing required fields', () => {
    const formData = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      title: '',
      phoneNumber: '',
    };

    const result = validateSignupForm(formData, t);
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(6);
  });

  it('should reject invalid email and phone', () => {
    const formData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'invalid-email',
      password: 'password123',
      title: 'Developer',
      phoneNumber: 'invalid-phone',
    };

    const result = validateSignupForm(formData, t);
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(2);
  });
});

describe('Profile Completion Form Validation', () => {
  const t = (key: string) => key;

  it('should validate correct profile data', () => {
    const formData = {
      project_summary: 'Test project summary',
      project_url: 'https://example.com',
      bio: 'Test bio',
    };

    const result = validateProfileCompletionForm(formData, t);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should validate profile data without URL', () => {
    const formData = {
      project_summary: 'Test project summary',
      bio: 'Test bio',
    };

    const result = validateProfileCompletionForm(formData, t);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject missing required fields', () => {
    const formData = {
      project_summary: '',
      bio: '',
    };

    const result = validateProfileCompletionForm(formData, t);
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(2);
  });

  it('should reject invalid URL', () => {
    const formData = {
      project_summary: 'Test project summary',
      project_url: 'not-a-url',
      bio: 'Test bio',
    };

    const result = validateProfileCompletionForm(formData, t);
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].field).toBe('project_url');
  });
});

describe('Social Profile Form Validation', () => {
  const t = (key: string) => key;

  it('should validate correct social profile data', () => {
    const formData = {
      projectDescription: 'Test project description',
      personalInfo: 'Test personal info',
    };

    const result = validateSocialProfileForm(formData, t);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject missing required fields', () => {
    const formData = {
      projectDescription: '',
      personalInfo: '',
    };

    const result = validateSocialProfileForm(formData, t);
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(2);
  });

  it('should reject undefined fields', () => {
    const formData = {
      projectDescription: undefined,
      personalInfo: undefined,
    };

    const result = validateSocialProfileForm(formData, t);
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(2);
  });
});
