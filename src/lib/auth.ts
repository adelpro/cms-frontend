"use client";

import { 
  loginUser as apiLoginUser, 
  registerUser as apiRegisterUser,
  convertApiUserToUser,
  getUserProfile,
  updateUserProfile,
  type ApiAuthResponse 
} from '@/lib/api/auth';

/**
 * User interface for authenticated users
 */
export interface User {
  /** Unique user identifier */
  id: string;
  /** User's email address */
  email: string;
  /** User's first name */
  firstName: string;
  /** User's last name */
  lastName: string;
  /** User's job title or role */
  jobTitle?: string;
  /** User's phone number */
  phoneNumber?: string;
  /** Authentication provider used */
  provider?: 'email' | 'google' | 'github';
  /** Whether the user has completed their profile */
  profileCompleted: boolean;
}

/**
 * Authentication response interface for login/signup operations
 */
export interface AuthResponse {
  /** Whether the operation was successful */
  success: boolean;
  /** Authentication token if successful */
  token?: string;
  /** User data if successful */
  user?: User;
  /** Error message if unsuccessful */
  error?: string;
  /** Whether user needs to complete profile setup */
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
  title: string;
  phoneNumber: string;
}): Promise<AuthResponse> => {
  try {
    const apiResponse: ApiAuthResponse = await apiRegisterUser({
      email: formData.email,
      password: formData.password,
      first_name: formData.firstName,
      last_name: formData.lastName,
      title: formData.title,
      phone_number: formData.phoneNumber
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
  projectDescription: string;
  projectLink?: string;
  teamSize: string;
  aboutYourself: string;
}): Promise<AuthResponse> => {
  try {
    // Get current user and token
    const currentUser = userStorage.getUser();
    const currentToken = tokenStorage.getToken();
    
    if (!currentUser || !currentToken) {
      return {
        success: false,
        error: 'No authenticated user found'
      };
    }

    // Update user profile via API
    const updateData = {
      name: `${currentUser.firstName} ${currentUser.lastName}`,
      bio: profileData.aboutYourself,
      organization: profileData.teamSize,
      website: profileData.projectLink || undefined,
    };

    await updateUserProfile(currentToken, updateData);
    
    // Get updated user profile from API
    const updatedApiUser = await getUserProfile(currentToken);
    const updatedUser = convertApiUserToUser(updatedApiUser);
    
    // Store updated user data
    userStorage.setUser(updatedUser);
    
    return {
      success: true,
      token: currentToken,
      user: updatedUser
    };
  } catch (error) {
    console.error('Profile completion error:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Profile completion failed'
    };
  }
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
