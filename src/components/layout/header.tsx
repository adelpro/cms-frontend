'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, Menu, X } from 'lucide-react';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeToggle } from '@/components/theme-toggle';
import type { Locale } from '@/i18n';
import { cn } from '@/lib/utils';

interface HeaderProps {
  locale: Locale;
}

interface NavigationItem {
  name: string;
  href: string;
  disabled?: boolean;
}

export function Header({ locale }: HeaderProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = useTranslations();

  const navigation: NavigationItem[] = [
    // { name: t('navigation.home'), href: `/${locale}` },
    { name: t('navigation.store'), href: `/${locale}/store` },
    {
      name: t('navigation.contentStandards'),
      href: `/${locale}/documentation/standards`,
    },
    { name: t('navigation.publishers'), href: '#', disabled: true },
    { name: t('navigation.aboutProject'), href: '#', disabled: true },
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
      <header className="sticky top-0 z-50 h-16 w-full border-b border-neutral-100 bg-white">
        <div className="max-width-container h-full px-4">
          <div className="flex h-full items-center justify-between">
            {/* Start Side - Logo and Navigation */}
            <div className="flex items-center gap-14">
              {/* Logo */}
              <Link href={`/${locale}`} className="flex-shrink-0">
                <Image src="/logo.svg" alt="Itqan CMS" width={120} height={40} className="w-auto" />
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden items-center gap-8 lg:flex">
                {navigation.map((item) => {
                  if (item.disabled) {
                    return (
                      <span
                        key={item.name}
                        className="text-muted-foreground/50 cursor-not-allowed rounded-md px-4 py-2 text-sm font-semibold"
                      >
                        {item.name}
                      </span>
                    );
                  }

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'rounded-md px-4 py-2 text-sm font-semibold transition-colors',
                        isActive(item.href)
                          ? 'text-primary bg-primary/10'
                          : 'text-muted-foreground hover:text-primary hover:bg-primary/5',
                      )}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* End Side - Controls */}
            <div className="flex items-center gap-4">
              {/* Desktop Controls - Hidden on mobile */}
              <div className="hidden items-center gap-4 lg:flex">
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
                      className="relative !p-0 text-red-600 hover:text-red-600"
                      title={t('auth.logout')}
                      aria-label={t('auth.logout')}
                    >
                      <LogOut size={16} />
                      <span className="sr-only">{t('auth.logout')}</span>
                    </Button>
                  </>
                ) : (
                  /* Login Button for non-authenticated users */
                  <Link href={`/${locale}/auth/login`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-4 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.06)]"
                    >
                      {t('auth.login')}
                    </Button>
                  </Link>
                )}
              </div>

              {/* Mobile Controls - Show avatar and menu only */}
              <div className="flex items-center gap-3 lg:hidden">
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
                  className="h-8 w-8 p-2"
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
            className="bg-background/80 absolute inset-0 backdrop-blur-sm"
            onClick={closeMobileMenu}
          />

          {/* Menu Content */}
          <div className="bg-background absolute inset-0">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 p-4">
              <Link href={`/${locale}`} onClick={closeMobileMenu}>
                <Image
                  src="/logo.svg"
                  alt="Itqan CMS"
                  width={120}
                  height={32}
                  className="h-8 w-auto"
                />
              </Link>
              <Button variant="ghost" size="sm" onClick={closeMobileMenu} className="h-8 w-8 p-2">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-2 p-4">
              {navigation.map((item) => {
                if (item.disabled) {
                  return (
                    <span
                      key={item.name}
                      className="text-muted-foreground/50 block cursor-not-allowed rounded-md px-4 py-2 text-sm font-semibold"
                    >
                      {item.name}
                    </span>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'block rounded-md px-4 py-2 text-sm font-semibold transition-colors',
                      isActive(item.href)
                        ? 'text-primary bg-primary/10'
                        : 'text-muted-foreground hover:text-primary hover:bg-primary/5',
                    )}
                    onClick={closeMobileMenu}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* User Section or Auth Actions */}
            {user ? (
              <div className="space-y-4 border-t p-4">
                {/* User Info */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg font-medium">
                      {user.firstName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-muted-foreground text-sm">{user.email}</p>
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
                  <LogOut className="me-2 h-4 w-4" />
                  {t('auth.logout')}
                </Button>
              </div>
            ) : (
              <div className="space-y-4 border-t p-4">
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
                      {t('auth.login')}
                    </Button>
                  </Link>
                  <Link href={`/${locale}/auth/signup`} onClick={closeMobileMenu}>
                    <Button className="w-full">{t('auth.signup')}</Button>
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
