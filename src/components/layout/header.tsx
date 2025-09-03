"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, Menu, X } from 'lucide-react';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeToggle } from '@/components/theme-toggle';
import type { Dictionary, Locale } from '@/lib/i18n/types';
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
    // { name: dict.header.home, href: `/${locale}` },
    { name: dict.header.store, href: `/${locale}/store` },
    { name: dict.header.academy, href: `/${locale}/academy` },
    { name: dict.header.projects, href: `/${locale}/projects` },
    { name: dict.header.reports, href: `/${locale}/reports` },
  ];

  const isActive = (href: string) => {
    if (href === `/${locale}`) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full h-16 border-b border-neutral-100 bg-white">
        <div className="max-width-container h-full px-4">
          <div className="flex h-full items-center justify-between">
            {/* Start Side - Logo and Navigation */}
            <div className="flex items-center gap-14">
              {/* Logo */}
              <Link href={`/${locale}`} className="flex-shrink-0">
                <Image
                  src="/logo.svg"
                  alt={dict.header.brand}
                  width={120}
                  height={40}
                  className="w-auto"
                />
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "text-sm font-semibold px-4 py-2 rounded-md transition-colors",
                      isActive(item.href)
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

                         {/* End Side - Controls */}
             <div className="flex items-center gap-4">
               {/* Desktop Controls - Hidden on mobile */}
               <div className="hidden lg:flex items-center gap-4">
                 {/* Language Switcher */}
                 <LanguageSwitcher currentLocale={locale} />

                 {/* Theme Toggle */}
                 {/* <ThemeToggle /> */}

                 {user ? (
                   <>
                     {/* User Avatar */}
                     <Avatar className="h-8 w-8">
                       <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                         {user.firstName.charAt(0)}
                       </AvatarFallback>
                     </Avatar>

                                           {/* Logout Button - Icon Only */}
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={logout}
                        className="relative text-red-600 hover:text-red-600 !p-0"
                        title={dict.header.logout}
                        aria-label={dict.header.logout}
                      >
                        <LogOut size={16} />
                        <span className="sr-only">{dict.header.logout}</span>
                      </Button>
                   </>
                 ) : (
                   /* Login Button for non-authenticated users */
                   <Link href={`/${locale}/auth/login`}>
                     <Button variant="outline" size="sm" className="h-8 px-4">
                       {dict.auth.login}
                     </Button>
                   </Link>
                 )}
               </div>

               {/* Mobile Controls - Show avatar and menu only */}
               <div className="flex lg:hidden items-center gap-3">
                 {user && (
                   /* User Avatar - Mobile */
                   <Avatar className="h-8 w-8">
                     <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                       {user.firstName.charAt(0)}
                     </AvatarFallback>
                   </Avatar>
                 )}

                 {/* Mobile Menu Button */}
                 <Button
                   variant="ghost"
                   size="sm"
                   className="p-2 h-8 w-8"
                   onClick={() => setIsMobileMenuOpen(true)}
                 >
                   <Menu className="h-5 w-5" />
                 </Button>
               </div>
             </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={closeMobileMenu}
          />
          
          {/* Menu Content */}
          <div className="absolute inset-0 bg-background">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-100">
              <Link href={`/${locale}`} onClick={closeMobileMenu}>
                <Image
                  src="/logo.svg"
                  alt={dict.header.brand}
                  width={120}
                  height={32}
                  className="h-8 w-auto"
                />
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeMobileMenu}
                className="p-2 h-8 w-8"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Navigation Links */}
            <nav className="p-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "block text-sm font-semibold px-4 py-2 rounded-md transition-colors",
                    isActive(item.href)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                  )}
                  onClick={closeMobileMenu}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

                         {/* User Section or Auth Actions */}
             {user ? (
               <div className="border-t p-4 space-y-4">
                 {/* User Info */}
                 <div className="flex items-center gap-3">
                   <Avatar className="h-12 w-12">
                     <AvatarFallback className="bg-primary text-primary-foreground text-lg font-medium">
                       {user.firstName.charAt(0)}
                     </AvatarFallback>
                   </Avatar>
                   <div>
                     <p className="font-medium">{user.firstName} {user.lastName}</p>
                     <p className="text-sm text-muted-foreground">{user.email}</p>
                   </div>
                 </div>

                 {/* Mobile Controls */}
                 <div className="flex items-center justify-between">
                   {/* Language Switcher */}
                   <LanguageSwitcher currentLocale={locale} />
                   
                   {/* Theme Toggle */}
                   <ThemeToggle />
                 </div>

                                   {/* Logout Button */}
                  <Button
                    variant="outline"
                    onClick={() => {
                      logout();
                      closeMobileMenu();
                    }}
                    className="w-full justify-start border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {dict.header.logout}
                  </Button>
               </div>
             ) : (
               <div className="border-t p-4 space-y-4">
                 {/* Mobile Controls for non-authenticated users */}
                 <div className="flex items-center justify-between">
                   {/* Language Switcher */}
                   <LanguageSwitcher currentLocale={locale} />
                   
                   {/* Theme Toggle */}
                   <ThemeToggle />
                 </div>

                 {/* Auth Buttons */}
                 <div className="space-y-3">
                   <Link href={`/${locale}/auth/login`} onClick={closeMobileMenu}>
                     <Button variant="outline" className="w-full">
                       {dict.auth.login}
                     </Button>
                   </Link>
                   <Link href={`/${locale}/auth/signup`} onClick={closeMobileMenu}>
                     <Button className="w-full">
                       {dict.auth.signup}
                     </Button>
                   </Link>
                 </div>
               </div>
             )}
          </div>
        </div>
      )}
    </>
  );
}
