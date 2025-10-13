/**
 * Validation Utilities
 * 
 * This file contains utility functions for validating user input,
 * particularly for forms and data submission.
 */

/**
 * Validation error interface for form validation
 */
export interface ValidationError {
  /** The field name that has the error */
  field: string;
  
  /** The error message to display */
  message: string;
}

/**
 * Validation result interface for form validation
 */
export interface ValidationResult {
  /** Whether the validation passed */
  isValid: boolean;
  
  /** Array of validation errors if any */
  errors: ValidationError[];
}

/**
 * Type for the translations function
 * 
 * @param key - The translation key to retrieve
 * @returns The translated string
 */
type TranslationFunction = (key: string) => string;

// ============================================================================
// Regular Expressions
// ============================================================================

/**
 * Email validation regex
 * Matches standard email formats
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Phone validation regex (international format)
 * Supports international phone numbers with optional + prefix
 */
const PHONE_REGEX = /^[\+]?[1-9][\d]{0,15}$/;

/**
 * URL validation regex
 * Matches http and https URLs
 */
const URL_REGEX = /^https?:\/\/.+\..+/;

// ============================================================================
// Individual Validators
// ============================================================================

/**
 * Validates an email address
 * 
 * @param value - Email address to validate
 * @param t - Translation function
 * @returns Error message if invalid, null if valid
 * 
 * @example
 * const error = validators.email('test@example.com', t);
 */
export const validators = {
  /**
   * Validates email format
   */
  email: (value: string | undefined, t: TranslationFunction): string | null => {
    if (!value || !value.trim()) {
      return t('forms.validation.emailRequired');
    }
    if (!EMAIL_REGEX.test(value)) {
      return t('forms.validation.emailInvalid');
    }
    return null;
  },

  /**
   * Validates password strength
   */
  password: (value: string | undefined, t: TranslationFunction): string | null => {
    if (!value || !value.trim()) {
      return t('forms.validation.passwordRequired');
    }
    if (value.length < 8) {
      return t('forms.validation.passwordMinLength');
    }
    return null;
  },

  /**
   * Validates required fields
   */
  required: (value: string | undefined, key: string, t: TranslationFunction): string | null => {
    if (!value || !value.trim()) {
      return t(key);
    }
    return null;
  },

  /**
   * Validates phone number format
   */
  phone: (value: string | undefined, t: TranslationFunction): string | null => {
    if (!value || !value.trim()) {
      return t('forms.validation.phoneRequired');
    }
    if (!PHONE_REGEX.test(value.replace(/\s/g, ''))) {
      return t('forms.validation.phoneInvalid');
    }
    return null;
  },

  /**
   * Validates URL format
   */
  url: (value: string | undefined, t: TranslationFunction): string | null => {
    if (!value || !value.trim()) {
      return null; // URL is optional
    }
    if (!URL_REGEX.test(value)) {
      return t('forms.validation.invalidUrl');
    }
    return null;
  },

  /**
   * Validates maximum length
   */
  maxLength: (value: string | undefined, maxLength: number, t: TranslationFunction): string | null => {
    if (value && value.trim().length > maxLength) {
      return t('forms.validation.fieldTooLong');
    }
    return null;
  },

  /**
   * Validates minimum length
   */
  minLength: (value: string | undefined, minLength: number, t: TranslationFunction): string | null => {
    if (value && value.trim().length < minLength) {
      return t('forms.validation.fieldTooShort');
    }
    return null;
  },
};

// ============================================================================
// Form Validators
// ============================================================================

/**
 * Validates login form data
 * 
 * @param formData - Form data to validate
 * @param t - Translation function
 * @returns Validation result with errors if any
 * 
 * @example
 * const result = validateLoginForm({ email, password }, t);
 * if (!result.isValid) {
 *   // Handle errors
 * }
 */
export function validateLoginForm(
  formData: { email: string; password: string },
  t: TranslationFunction
): ValidationResult {
  const errors: ValidationError[] = [];

  const emailError = validators.email(formData.email, t);
  if (emailError) {
    errors.push({ field: 'email', message: emailError });
  }

  const passwordError = validators.password(formData.password, t);
  if (passwordError) {
    errors.push({ field: 'password', message: passwordError });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates signup form data
 * 
 * @param formData - Form data to validate
 * @param t - Translation function
 * @returns Validation result with errors if any
 */
export function validateSignupForm(
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    title: string;
    phoneNumber: string;
  },
  t: TranslationFunction
): ValidationResult {
  const errors: ValidationError[] = [];

  // First name validation
  const firstNameError = validators.required(formData.firstName, 'forms.validation.firstNameRequired', t);
  if (firstNameError) {
    errors.push({ field: 'firstName', message: firstNameError });
  }

  // Last name validation
  const lastNameError = validators.required(formData.lastName, 'forms.validation.lastNameRequired', t);
  if (lastNameError) {
    errors.push({ field: 'lastName', message: lastNameError });
  }

  // Email validation
  const emailError = validators.email(formData.email, t);
  if (emailError) {
    errors.push({ field: 'email', message: emailError });
  }

  // Password validation
  const passwordError = validators.password(formData.password, t);
  if (passwordError) {
    errors.push({ field: 'password', message: passwordError });
  }

  // Title validation
  const titleError = validators.required(formData.title, 'forms.validation.titleRequired', t);
  if (titleError) {
    errors.push({ field: 'title', message: titleError });
  }

  // Phone number validation
  const phoneError = validators.phone(formData.phoneNumber, t);
  if (phoneError) {
    errors.push({ field: 'phoneNumber', message: phoneError });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates profile completion form data
 * 
 * @param formData - Form data to validate
 * @param t - Translation function
 * @returns Validation result with errors if any
 */
export function validateProfileCompletionForm(
  formData: {
    project_summary: string;
    project_url?: string;
    bio: string;
  },
  t: TranslationFunction
): ValidationResult {
  const errors: ValidationError[] = [];

  // Project summary validation
  const projectSummaryError = validators.required(
    formData.project_summary,
    'forms.validation.fieldRequired',
    t
  );
  if (projectSummaryError) {
    errors.push({ field: 'project_summary', message: projectSummaryError });
  }

  // Project URL validation (optional but must be valid if provided)
  if (formData.project_url) {
    const urlError = validators.url(formData.project_url, t);
    if (urlError) {
      errors.push({ field: 'project_url', message: urlError });
    }
  }

  // Bio validation
  const bioError = validators.required(formData.bio, 'forms.validation.fieldRequired', t);
  if (bioError) {
    errors.push({ field: 'bio', message: bioError });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates social profile form data
 * 
 * @param formData - Form data to validate
 * @param t - Translation function
 * @returns Validation result with errors if any
 */
export function validateSocialProfileForm(
  formData: {
    projectDescription?: string;
    personalInfo?: string;
  },
  t: TranslationFunction
): ValidationResult {
  const errors: ValidationError[] = [];

  // Project description validation
  if (!formData.projectDescription || !formData.projectDescription.trim()) {
    errors.push({ field: 'projectDescription', message: t('forms.validation.fieldRequired') });
  }

  // Personal info validation
  if (!formData.personalInfo || !formData.personalInfo.trim()) {
    errors.push({ field: 'personalInfo', message: t('forms.validation.fieldRequired') });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

