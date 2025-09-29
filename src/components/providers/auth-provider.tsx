"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { User } from '@/lib/auth';
import { checkAuthStatus, logoutUser, tokenStorage, userStorage } from '@/lib/auth';
import { httpInterceptor } from '@/lib/http-interceptor';
import type { Locale } from '@/i18n';
import { AuthLoading } from '@/components/auth/auth-loading';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  requiresProfileCompletion: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  locale: Locale;
}

export function AuthProvider({ children, locale }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [requiresProfileCompletion, setRequiresProfileCompletion] = useState(false);
  
  const router = useRouter();
  const pathname = usePathname();

  const logout = useCallback(() => {
    logoutUser();
    setUser(null);
    setIsAuthenticated(false);
    setRequiresProfileCompletion(false);
    router.replace(`/${locale}/store`);
  }, [locale, router]);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const authStatus = checkAuthStatus();
        setIsAuthenticated(authStatus.isAuthenticated);
        setUser(authStatus.user);
        setRequiresProfileCompletion(authStatus.requiresProfileCompletion);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        setUser(null);
        setRequiresProfileCompletion(false);
      } finally {
        setIsLoading(false);
      }
    };

    // Set up the logout callback for the HTTP interceptor
    httpInterceptor.setLogoutCallback(logout);

    checkAuth();
  }, [locale, router, logout]);

  // Handle route protection (very permissive - only handle auth pages and profile completion)
  useEffect(() => {
    if (isLoading) return;

    const isAuthRoute = pathname.includes('/auth/');
    
    // If user is authenticated
    if (isAuthenticated && user) {
      // If user needs to complete profile and is trying to access dashboard specifically
      if (requiresProfileCompletion && pathname.includes('/dashboard')) {
        router.replace(`/${locale}/auth/complete-profile?provider=${user.provider}&firstName=${user.firstName}&lastName=${user.lastName}&email=${user.email}`);
        return;
      }
      
      // If profile is completed and user is on auth pages (except complete-profile), redirect to store
      if (!requiresProfileCompletion && isAuthRoute && !pathname.includes('/complete-profile')) {
        router.replace(`/${locale}/store`);
        return;
      }
    }
    
    // Don't block any routes - let users navigate freely
    // Authentication will be handled at the action level (download, etc.)
  }, [isAuthenticated, user, requiresProfileCompletion, pathname, locale, router, isLoading]);

  const login = (userData: User, token: string) => {
    tokenStorage.setToken(token);
    userStorage.setUser(userData);
    setUser(userData);
    setIsAuthenticated(true);
    setRequiresProfileCompletion(!userData.profileCompleted);
    
    // Redirect based on profile completion status
    if (!userData.profileCompleted) {
      router.replace(`/${locale}/auth/complete-profile?provider=${userData.provider}&firstName=${userData.firstName}&lastName=${userData.lastName}&email=${userData.email}`);
    } else {
      router.replace(`/${locale}/store`);
    }
  };

  const updateUser = (userData: User) => {
    userStorage.setUser(userData);
    setUser(userData);
    setRequiresProfileCompletion(!userData.profileCompleted);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    requiresProfileCompletion,
    login,
    logout,
    updateUser
  };

  // Show loading screen while checking authentication
  if (isLoading) {
    const loadingMessage = locale === 'ar' ? 'جاري التحميل...' : 'Loading...';
    return <AuthLoading message={loadingMessage} />;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
