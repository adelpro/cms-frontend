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
 * Type for the translations function from next-intl
 * @param key - The translation key to retrieve
 * @returns The translated string
 */
type TranslationFunction = (key: string) => string;

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
  email: (value: string | undefined, t: TranslationFunction): string | null => {
    if (!value || !value.trim()) {
      return t('forms.validation.emailRequired');
    }
    if (!EMAIL_REGEX.test(value)) {
      return t('forms.validation.emailInvalid');
    }
    return null;
  },

  password: (value: string | undefined, t: TranslationFunction): string | null => {
    if (!value || !value.trim()) {
      return t('forms.validation.passwordRequired');
    }
    if (value.length < 8) {
      return t('forms.validation.passwordMinLength');
    }
    return null;
  },

  required: (value: string | undefined, key: string, t: TranslationFunction): string | null => {
    if (!value || !value.trim()) {
      return t(key);
    }
    return null;
  },

  phone: (value: string | undefined, t: TranslationFunction): string | null => {
    if (!value || !value.trim()) {
      return t('forms.validation.phoneRequired');
    }
    if (!PHONE_REGEX.test(value.replace(/\s/g, ''))) {
      return t('forms.validation.phoneInvalid');
    }
    return null;
  },


  maxLength: (value: string | undefined, maxLength: number, t: TranslationFunction): string | null => {
    if (!value || value.trim().length > maxLength) {
      return t('forms.validation.fieldTooLong');
    }
    return null;
  }
};

/**
 * Login form validation
 */
export const validateLoginForm = (
  formData: { email: string; password: string },
  t: TranslationFunction
): ValidationResult => {
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
    email: string;
    password: string;
    title: string;
    phoneNumber: string;
  },
  t: TranslationFunction
): ValidationResult => {
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
  t: TranslationFunction
): ValidationResult => {
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
    errors
  };
};

/**
 * Profile completion form validation
 */
export const validateProfileCompletionForm = (
  formData: {
    project_summary: string;
    project_url?: string;
    bio: string;
  },
  t: TranslationFunction
): ValidationResult => {
  const errors: ValidationError[] = [];

  // Project summary validation
  const projectSummaryError = validators.required(formData.project_summary, 'forms.validation.fieldRequired', t);
  if (projectSummaryError) {
    errors.push({ field: 'project_summary', message: projectSummaryError });
  }

  // Project URL validation (optional)
  if (formData.project_url && formData.project_url.trim()) {
    try {
      new URL(formData.project_url);
    } catch {
      errors.push({ field: 'project_url', message: t('forms.validation.invalidUrl') });
    }
  }

  // Bio validation
  const bioError = validators.required(formData.bio, 'forms.validation.fieldRequired', t);
  if (bioError) {
    errors.push({ field: 'bio', message: bioError });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};