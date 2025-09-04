export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Type for the translations function from next-intl
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

  minLength: (value: string | undefined, minLength: number, t: TranslationFunction): string | null => {
    if (!value || value.trim().length < minLength) {
      return t('forms.validation.fieldTooShort');
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
  } else if (formData.projectDescription.trim().length < 10) {
    errors.push({ field: 'projectDescription', message: t('forms.validation.fieldTooShort') });
  }

  // Personal info validation
  if (!formData.personalInfo || !formData.personalInfo.trim()) {
    errors.push({ field: 'personalInfo', message: t('forms.validation.fieldRequired') });
  } else if (formData.personalInfo.trim().length < 20) {
    errors.push({ field: 'personalInfo', message: t('forms.validation.fieldTooShort') });
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
    businessModel: string;
    projectLink?: string;
    teamSize: string;
    aboutYourself: string;
  },
  t: TranslationFunction
): ValidationResult => {
  const errors: ValidationError[] = [];

  // Business model validation
  const businessModelError = validators.required(formData.businessModel, 'forms.validation.fieldRequired', t);
  if (businessModelError) {
    errors.push({ field: 'businessModel', message: businessModelError });
  } else if (formData.businessModel.trim().length < 10) {
    errors.push({ field: 'businessModel', message: t('forms.validation.fieldTooShort') });
  }

  // Project link validation (optional)
  if (formData.projectLink && formData.projectLink.trim()) {
    try {
      new URL(formData.projectLink);
    } catch {
      errors.push({ field: 'projectLink', message: t('forms.validation.invalidUrl') });
    }
  }

  // Team size validation
  const teamSizeError = validators.required(formData.teamSize, 'forms.validation.fieldRequired', t);
  if (teamSizeError) {
    errors.push({ field: 'teamSize', message: teamSizeError });
  }

  // About yourself validation
  const aboutYourselfError = validators.required(formData.aboutYourself, 'forms.validation.fieldRequired', t);
  if (aboutYourselfError) {
    errors.push({ field: 'aboutYourself', message: aboutYourselfError });
  } else if (formData.aboutYourself.trim().length < 20) {
    errors.push({ field: 'aboutYourself', message: t('forms.validation.fieldTooShort') });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};