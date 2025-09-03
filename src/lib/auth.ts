"use client";

import { 
  loginUser as apiLoginUser, 
  registerUser as apiRegisterUser,
  convertApiUserToUser,
  type ApiAuthResponse 
} from '@/lib/api/auth';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  jobTitle?: string;
  phoneNumber?: string;
  provider?: 'email' | 'google' | 'github';
  profileCompleted: boolean;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
  requiresProfileCompletion?: boolean;
}

/**
 * Token storage utilities
 */
export const tokenStorage = {
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  },

  setToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('auth_token', token);
  },

  removeToken: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  },

  isAuthenticated: (): boolean => {
    return !!tokenStorage.getToken();
  }
};

/**
 * User data storage utilities
 */
export const userStorage = {
  getUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  },

  setUser: (user: User): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('user_data', JSON.stringify(user));
  },

  removeUser: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('user_data');
  }
};

/**
 * Generate fake token for demo purposes
 */
const generateFakeToken = (): string => {
  return 'fake_jwt_token_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

/**
 * Generate fake user for demo purposes
 */
const generateFakeUser = (
  email: string, 
  firstName: string, 
  lastName: string, 
  provider: 'email' | 'google' | 'github' = 'email',
  additionalData?: Partial<User>
): User => {
  return {
    id: 'user_' + Math.random().toString(36).substring(2, 15),
    email,
    firstName,
    lastName,
    provider,
    profileCompleted: provider === 'email' ? true : false,
    ...additionalData
  };
};

/**
 * Login user with email/password using real API
 */
export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const apiResponse: ApiAuthResponse = await apiLoginUser({ email, password });
    
    // Convert API user to internal user format
    const user = convertApiUserToUser(apiResponse.user);
    
    // Store tokens and user data
    tokenStorage.setToken(apiResponse.access_token);
    userStorage.setUser(user);
    
    return {
      success: true,
      token: apiResponse.access_token,
      user
    };
  } catch (error) {
    console.error('Login API error:', error);
    
    // Handle specific API errors
    if (error instanceof Error) {
      if (error.message.includes('Invalid email or password')) {
        return {
          success: false,
          error: 'Invalid credentials'
        };
      }
      if (error.message.includes('Email already exists')) {
        return {
          success: false,
          error: 'Email already exists'
        };
      }
    }
    
    return {
      success: false,
      error: 'Network error. Please check your connection'
    };
  }
};

/**
 * Signup user with email/password using real API
 */
export const signupUser = async (formData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  try {
    // Combine first and last name for API
    const name = `${formData.firstName} ${formData.lastName}`.trim();
    
    const apiResponse: ApiAuthResponse = await apiRegisterUser({
      email: formData.email,
      password: formData.password,
      name
    });
    
    // Convert API user to internal user format
    const user = convertApiUserToUser(apiResponse.user);
    
    // Store tokens and user data
    tokenStorage.setToken(apiResponse.access_token);
    userStorage.setUser(user);
    
    return {
      success: true,
      token: apiResponse.access_token,
      user,
      requiresProfileCompletion: !apiResponse.user.profile_completed
    };
  } catch (error) {
    console.error('Signup API error:', error);
    
    // Handle specific API errors
    if (error instanceof Error) {
      if (error.message.includes('Email already exists')) {
        return {
          success: false,
          error: 'Email already exists'
        };
      }
      if (error.message.includes('Invalid input')) {
        return {
          success: false,
          error: 'Please check your input and try again'
        };
      }
    }
    
    return {
      success: false,
      error: 'Network error. Please check your connection'
    };
  }
};

/**
 * Simulate social login API call
 */
export const socialLogin = async (
  provider: 'google' | 'github',
  socialData?: { firstName?: string; lastName?: string; email?: string }
): Promise<AuthResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const email = socialData?.email || `user@${provider}.com`;
  const firstName = socialData?.firstName || 'Social';
  const lastName = socialData?.lastName || 'User';
  
  // Check if user exists and has completed profile (simulate database check)
  const existingUser = userStorage.getUser();
  if (existingUser && existingUser.email === email && existingUser.profileCompleted) {
    const token = generateFakeToken();
    tokenStorage.setToken(token);
    
    return {
      success: true,
      token,
      user: existingUser
    };
  }
  
  // New social user - requires profile completion
  const partialUser = generateFakeUser(email, firstName, lastName, provider, {
    profileCompleted: false
  });
  
  return {
    success: true,
    user: partialUser,
    requiresProfileCompletion: true
  };
};

/**
 * Complete social user profile
 */
export const completeProfile = async (
  socialUserData: {
    email: string;
    firstName: string;
    lastName: string;
    provider: 'google' | 'github';
  },
  profileData: {
    jobTitle: string;
    phoneNumber: string;
    businessModel: string;
    teamSize: string;
    aboutYourself: string;
  }
): Promise<AuthResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const token = generateFakeToken();
  const user = generateFakeUser(
    socialUserData.email,
    socialUserData.firstName,
    socialUserData.lastName,
    socialUserData.provider,
    {
      jobTitle: profileData.jobTitle,
      phoneNumber: profileData.phoneNumber,
      profileCompleted: true
    }
  );
  
  tokenStorage.setToken(token);
  userStorage.setUser(user);
  
  return {
    success: true,
    token,
    user
  };
};

/**
 * Logout user
 */
export const logoutUser = (): void => {
  tokenStorage.removeToken();
  userStorage.removeUser();
};

/**
 * Complete user profile (for email signups)
 */
export const completeUserProfile = async (profileData: {
  businessModel: string;
  projectLink?: string;
  teamSize: string;
  aboutYourself: string;
}): Promise<AuthResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const currentUser = userStorage.getUser();
  if (!currentUser) {
    return {
      success: false,
      error: 'No user found'
    };
  }
  
  const token = generateFakeToken();
  const updatedUser: User = {
    ...currentUser,
    profileCompleted: true
  };
  
  tokenStorage.setToken(token);
  userStorage.setUser(updatedUser);
  
  return {
    success: true,
    token,
    user: updatedUser
  };
};

/**
 * Check if user is authenticated and profile is completed
 */
export const checkAuthStatus = (): {
  isAuthenticated: boolean;
  user: User | null;
  requiresProfileCompletion: boolean;
} => {
  const isAuthenticated = tokenStorage.isAuthenticated();
  const user = userStorage.getUser();
  
  return {
    isAuthenticated,
    user,
    requiresProfileCompletion: isAuthenticated && user ? !user.profileCompleted : false
  };
};
