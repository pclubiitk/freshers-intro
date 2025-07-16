'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase-client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { FiHome, FiUser, FiLogIn, FiLogOut, FiSettings } from 'react-icons/fi';
import { User } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';

export default function NavBar() {
const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    redirect ('/login')
  };

  return (
    <nav className="hidden sm:block fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-pink-500 via-blue-500 to-cyan-400 animate-gradient bg-[length:400%_400%] shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto px-4 py-2">
        <Link href="https://pclub.in/" className="flex items-center gap-3 text-white font-semibold text-lg">
          <img src="/images/pclublogo.png" alt="Programming Club IITK Logo" className="h-8 w-auto object-contain" />
          <span className="whitespace-nowrap">Programming Club IITK</span>
        </Link>

        <div className="flex gap-4 text-white">
          <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/10 transition">
            <FiHome />
            <span>Home</span>
          </Link>

          <Link href="/profiles" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/10 transition">
            <FiUser />
            <span>Profiles</span>
          </Link>

          {user ? (
            <>
              <Link
                href="/my-profile"
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/10 transition"
              >
                <FiSettings />
                <span>My Profile</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/10 transition"
              >
                <FiLogOut />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/10 transition"
            >
              <FiLogIn />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
