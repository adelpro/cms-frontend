import type { Dictionary } from '@/lib/i18n/types';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Email validation regex
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Phone validation regex (international format)
 */
const PHONE_REGEX = /^[\+]?[1-9][\d]{0,15}$/;

/**
 * Validation utilities
 */
export const validators = {
  email: (value: string | undefined, dict: Dictionary): string | null => {
    if (!value || !value.trim()) {
      return dict.auth.validation.emailRequired;
    }
    if (!EMAIL_REGEX.test(value)) {
      return dict.auth.validation.emailInvalid;
    }
    return null;
  },

  password: (value: string | undefined, dict: Dictionary): string | null => {
    if (!value || !value.trim()) {
      return dict.auth.validation.passwordRequired;
    }
    if (value.length < 8) {
      return dict.auth.validation.passwordMinLength;
    }
    return null;
  },

  required: (value: string | undefined, fieldName: keyof Dictionary['auth']['validation'], dict: Dictionary): string | null => {
    if (!value || !value.trim()) {
      return dict.auth.validation[fieldName];
    }
    return null;
  },

  phone: (value: string | undefined, dict: Dictionary): string | null => {
    if (!value || !value.trim()) {
      return dict.auth.validation.phoneRequired;
    }
    if (!PHONE_REGEX.test(value.replace(/\s/g, ''))) {
      return dict.auth.validation.phoneInvalid;
    }
    return null;
  },

  minLength: (value: string | undefined, minLength: number, dict: Dictionary): string | null => {
    if (!value || value.trim().length < minLength) {
      return dict.auth.validation.fieldTooShort;
    }
    return null;
  },

  maxLength: (value: string | undefined, maxLength: number, dict: Dictionary): string | null => {
    if (!value || value.trim().length > maxLength) {
      return dict.auth.validation.fieldTooLong;
    }
    return null;
  }
};

/**
 * Login form validation
 */
export const validateLoginForm = (
  formData: { email: string; password: string },
  dict: Dictionary
): ValidationResult => {
  const errors: ValidationError[] = [];

  const emailError = validators.email(formData.email, dict);
  if (emailError) {
    errors.push({ field: 'email', message: emailError });
  }

  const passwordError = validators.password(formData.password, dict);
  if (passwordError) {
    errors.push({ field: 'password', message: passwordError });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Signup form validation
 */
export const validateSignupForm = (
  formData: {
    firstName: string;
    lastName: string;
    jobTitle: string;
    phoneNumber: string;
    email: string;
    password: string;
  },
  dict: Dictionary
): ValidationResult => {
  const errors: ValidationError[] = [];

  // First name validation
  const firstNameError = validators.required(formData.firstName, 'firstNameRequired', dict);
  if (firstNameError) {
    errors.push({ field: 'firstName', message: firstNameError });
  }

  // Last name validation
  const lastNameError = validators.required(formData.lastName, 'lastNameRequired', dict);
  if (lastNameError) {
    errors.push({ field: 'lastName', message: lastNameError });
  }

  // Job title validation
  const jobTitleError = validators.required(formData.jobTitle, 'jobTitleRequired', dict);
  if (jobTitleError) {
    errors.push({ field: 'jobTitle', message: jobTitleError });
  }

  // Phone validation
  const phoneError = validators.phone(formData.phoneNumber, dict);
  if (phoneError) {
    errors.push({ field: 'phoneNumber', message: phoneError });
  }

  // Email validation
  const emailError = validators.email(formData.email, dict);
  if (emailError) {
    errors.push({ field: 'email', message: emailError });
  }

  // Password validation
  const passwordError = validators.password(formData.password, dict);
  if (passwordError) {
    errors.push({ field: 'password', message: passwordError });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Social profile form validation
 */
export const validateSocialProfileForm = (
  formData: {
    projectDescription?: string;
    personalInfo?: string;
  },
  dict: Dictionary
): ValidationResult => {
  const errors: ValidationError[] = [];

  // Project description validation
  if (!formData.projectDescription || !formData.projectDescription.trim()) {
    errors.push({ field: 'projectDescription', message: 'يرجى ملء هذا الحقل' });
  } else if (formData.projectDescription.trim().length < 10) {
    errors.push({ field: 'projectDescription', message: 'يجب أن يكون الوصف أطول من 10 أحرف' });
  }

  // Personal info validation
  if (!formData.personalInfo || !formData.personalInfo.trim()) {
    errors.push({ field: 'personalInfo', message: 'يرجى ملء هذا الحقل' });
  } else if (formData.personalInfo.trim().length < 20) {
    errors.push({ field: 'personalInfo', message: 'يجب أن يكون الوصف أطول من 20 حرف' });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
