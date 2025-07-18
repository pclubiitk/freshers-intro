'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading_or_not, isAuthenticated, refreshUser } = useAuth(); 
  const ORIGIN = process.env.NEXT_PUBLIC_BACKEND_ORIGIN;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

    useEffect(() => {
      if (!loading_or_not && isAuthenticated) {
        router.replace('/my-profile');
      }
    }, [loading_or_not, isAuthenticated]);
  
    if (loading_or_not) return <div>loading...</div>;
  
  


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.endsWith('@iitk.ac.in')) {
      toast.error('Only IITK email address is allowed.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${ORIGIN}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (res.status === 422) {
        toast.error('Please recheck your login details.');
        return;
      }

      if (res.status === 401) {
        toast.error('Invalid login credentials.');
        return;
      }

      if (res.status === 403) {
        toast.error('Email not verified.', {
          action: (
            <div className="w-full flex justify-end">
              <Button
                variant="outline"
                onClick={async () => {
                  toast.promise(
                    fetch(`${ORIGIN}/auth/resend-verification`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email, password }),
                    }).then(async (res) => {
                      const data = await res.json();
                      if (res.status === 429) {
                        throw new Error(data.detail || 'Please wait before trying again.');
                      }
                      if (!res.ok) {
                        throw new Error(data.detail || 'Failed to resend verification email.');
                      }
                      return data;
                    }),
                    {
                      loading: 'Sending verification email...',
                      success: 'Verification email resent!',
                      error: (err) => err.message || 'Failed to resend email',
                    }
                  );
                }}
              >
                Resend Mail
              </Button>
            </div>
          ),
        });
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.detail || 'Login failed.');
        return;
      }
      else {toast.info(data.message)};
      await refreshUser();
      router.replace("/my-profile");
    } catch (err) {
      console.error(err);
      toast.error('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white dark:bg-black transition-colors">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 rounded-2xl shadow-xl backdrop-blur-lg border border-gray-300 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 space-y-6 animate-in fade-in duration-700 transition-colors"
      >
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
          Welcome Back
        </h2>

        {error && (
          <div className="bg-red-200 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-800 dark:text-red-300 px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}

       
        <div>
          <label className="text-sm font-medium block mb-1 text-gray-800 dark:text-gray-300">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="cc_username@iitk.ac.in"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="text-sm font-medium block mb-1 text-gray-800 dark:text-gray-300">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="••••••••"
            />
          </div>
        </div>

       
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </form>
    </main>
  );
}
