'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, refreshUser } = useAuth();
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(false);

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


  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleTheme = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      document.documentElement.classList.toggle('dark', newMode);
      return newMode;
    });
  };

  return (
    <nav className="w-full px-6 py-3 flex justify-between items-center border-b border-gray-200 dark:border-white/10 bg-white/60 dark:bg-black/40 backdrop-blur-md shadow-sm fixed top-0 z-50">
      <Link href="/" className="text-xl font-semibold text-gray-800 dark:text-white">
        Freshers Intro
      </Link>

      <div className="flex items-center gap-4">
        <Link
          href="/profiles"
          className={`text-sm font-medium ${
            pathname === '/profiles' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
          } hover:underline`}
        >
          Profiles
        </Link>
        <Link
          href="/my-profile"
          className={`text-sm font-medium ${
            pathname === '/my-profile' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
          } hover:underline`}
        >
          My Profile
        </Link>
        { isAuthenticated ? (<Button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-1 rounded-lg"
          >
            Logout
          </Button>
        ): <Link
          href="/login"
          className={`text-sm font-medium ${
            pathname === '/login' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
          } hover:underline`}
        >
          Login
        </Link>
        }
        <button
          onClick={toggleTheme}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-white/10 transition"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </nav>
  );
}
