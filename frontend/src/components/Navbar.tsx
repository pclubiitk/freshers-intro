'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from './ThemeToggle';
import { useRouter, usePathname } from 'next/navigation';

const Navbar = () => {
  const { theme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { user, isAuthenticated, refreshUser, loading_or_not } = useAuth();

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      await refreshUser();
      router.replace('/login');
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Browse Profiles', href: '/profiles' },
    ...(isAuthenticated
      ? [
          { label: `My Profile`, href: '/my-profile' },
          { label: 'Logout', action: handleLogout },
        ]
      : [
          { label: 'Login', href: '/login' },
          { label: 'Sign Up', href: '/signup' }
        ]
      ),
  ];

  if (loading_or_not) {
    return (
      <nav className="sticky top-0 z-50 w-full px-6 py-4 flex items-center justify-between border-b border-border bg-background text-foreground">
        <div className="flex items-center gap-3 text-2xl font-bold">
          <span>Loading...</span>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className="sticky top-0 z-50 w-full px-6 py-4 flex items-center justify-between border-b border-border bg-background text-foreground transition-colors duration-300"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 text-xl font-bold">
        <Link href="https://pclub.in/">
          <img
            src="/images/pclublogo.png"
            alt="PClub Logo"
            className="w-8 h-8 object-contain"
          />
        </Link>
        <span className="text-sm md:text-xl">Programming Club IIT Kanpur</span>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-6">
        <ul className="flex gap-6 text-lg font-medium">
          {navItems.map((item) => {
            const isActive = item.href && pathname === item.href;

            return (
              <li key={item.label}>
                {item.href ? (
                  <Link
                    href={item.href}
                    className={`transition-colors duration-200 no-underline ${
                      isActive
                        ? 'text-indigo-500'
                        : 'hover:text-indigo-700 dark:hover:text-indigo-400'
                    }`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    onClick={item.action}
                    className="transition-colors duration-200 hover:text-red-600 bg-transparent border-none cursor-pointer text-lg font-medium"
                  >
                    {item.label}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
        <ThemeToggle />
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle Menu"
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <ul className="absolute top-16 left-0 w-full bg-background text-foreground flex flex-col items-center gap-4 py-4 border-t border-border md:hidden z-50 transition-colors">
          {navItems.map((item) => {
            const isActive = item.href && pathname === item.href;

            return (
              <li key={item.label}>
                {item.href ? (
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`text-lg font-medium transition-colors no-underline ${
                      isActive
                        ? 'text-indigo-500'
                        : 'hover:text-indigo-700 dark:hover:text-indigo-400'
                    }`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      item.action?.();
                    }}
                    className="text-lg font-medium hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer"
                  >
                    {item.label}
                  </button>
                )}
              </li>
            );
          })}
          <li>
            <ThemeToggle />
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
