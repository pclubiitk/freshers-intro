'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/auth/check`, {
          credentials: 'include'
        });
        
        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsLoggedIn(false);
      } finally {
        setLoadingAuth(false);
      }
    };

    checkAuth();
  }, []);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Profiles', href: '/profiles' },
    { label: 'My Profile', href: '/profile' },
    ...(isLoggedIn ? [{ label: 'Logout', href: '/logout' }] : [])
  ];

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      setIsLoggedIn(false);
      // we will redirect to home page
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loadingAuth) {
    return (
      <nav className="sticky top-0 z-50 w-full px-6 py-4 flex items-center justify-between border-b border-gray-800 bg-zinc-950 text-white">
        <div className="flex items-center gap-3 text-2xl font-bold">
          <span>Loading...</span>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 w-full px-6 py-4 flex items-center justify-between border-b border-gray-800 bg-zinc-950 text-white transition-colors duration-300">
      {/* ... rest of your navbar code ... */}
       <div className="flex items-center gap-3 text-2xl font-bold">
        <Link href="https://pclub.in/">
          <img
            src="/images/pclublogo.png"
            alt="PClub Logo"
            className="w-8 h-8 object-contain"
          />
        </Link>
        <span className="hidden md:inline">Programming Club IIT Kanpur</span>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-6">
        <ul className="flex gap-6 text-lg font-medium">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="hover:text-indigo-500 transition-colors duration-200 no-underline text-white"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="ml-4 p-2 rounded-full hover:bg-gray-700 transition-colors text-white"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden text-white"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle Menu"
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <ul className="absolute top-16 left-0 w-full bg-zinc-950 text-white flex flex-col items-center gap-4 py-4 border-t border-gray-700 md:hidden z-50 transition-colors">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="text-lg font-medium hover:text-indigo-500 transition-colors no-underline text-white"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors text-white"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;