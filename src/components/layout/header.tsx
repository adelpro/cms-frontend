"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bell, LogOut, Menu, X } from 'lucide-react';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeToggle } from '@/components/theme-toggle';
import type { Dictionary, Locale } from '@/lib/i18n/types';
import { logical } from '@/lib/styles/logical';
import { cn } from '@/lib/utils';

interface HeaderProps {
  dict: Dictionary;
  locale: Locale;
}

export function Header({ dict, locale }: HeaderProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: dict.header.home, href: `/${locale}/store`, icon: null },
    { name: dict.header.academy, href: `/${locale}/academy`, icon: null },
    { name: dict.header.projects, href: `/${locale}/projects`, icon: null },
    { name: dict.header.reports, href: `/${locale}/reports`, icon: null },
    { name: dict.header.store, href: `/${locale}/store`, icon: null },
  ];

  const isActive = (href: string) => {
    if (href === `/${locale}`) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  // Always show header, but show different content based on auth status

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href={`/${locale}/store`} className="text-xl font-bold text-primary">
              {dict.header.brand}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-reverse space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-reverse space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Language Switcher */}
            <LanguageSwitcher currentLocale={locale} />

            {user ? (
              <>
                {/* Notifications - Desktop */}
                <Button variant="ghost" size="sm" className="hidden md:flex p-2">
                  <Bell className="h-5 w-5" />
                </Button>

                {/* User Info - Desktop */}
                <div className="hidden md:flex items-center space-x-reverse space-x-3">
                  <span className="text-sm text-muted-foreground">
                    {dict.header.welcome} {user.firstName}
                  </span>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {user.firstName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Logout - Desktop */}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={logout}
                  className="hidden md:flex items-center space-x-reverse space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{dict.header.logout}</span>
                </Button>
              </>
            ) : (
              <>
                {/* Login/Signup for non-authenticated users */}
                <Link href={`/${locale}/auth/login`}>
                  <Button variant="outline" size="sm">
                    {dict.auth.login}
                  </Button>
                </Link>
                <Link href={`/${locale}/auth/signup`}>
                  <Button variant="default" size="sm">
                    {dict.auth.signup}
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Navigation */}
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile User Section */}
              {user ? (
                <div className="border-t pt-4">
                  <div className="flex items-center px-3 py-2">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.firstName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="mr-3">
                      <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="px-3 space-y-2">
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <Bell className="h-4 w-4 mr-2" />
                      {dict.header.notifications}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full justify-start"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      {dict.header.logout}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border-t pt-4 px-3 space-y-2">
                  <Link href={`/${locale}/auth/login`}>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {dict.auth.login}
                    </Button>
                  </Link>
                  <Link href={`/${locale}/auth/signup`}>
                    <Button 
                      variant="default" 
                      size="sm"
                      className="w-full"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {dict.auth.signup}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
