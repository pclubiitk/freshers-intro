'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FiHome, FiUser, FiLogIn, FiLogOut, FiSettings } from 'react-icons/fi';

interface BottomNavBarProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ isLoggedIn, onLogout }) => {
  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-pink-500 via-blue-500 to-cyan-400 animate-gradient bg-[length:400%_400%] text-white shadow-t-md flex justify-around items-center py-2 px-1">
      {/* Logo */}
      <Link href="https://pclub.in/" className="flex flex-col items-center text-sm">
        <img
          src="./images/pclublogo.png"
          alt="Programming Club IITK Logo"
          className="h-6 w-auto object-contain"
        />
       
      </Link>;

      {/* Navigation Links */}
      <Link href="/" className="flex flex-col items-center text-sm hover:text-white/80 transition">
        <FiHome className="text-lg" />
        <span>Home</span>
      </Link>

      <Link href="/profiles" className="flex flex-col items-center text-sm hover:text-white/80 transition">
        <FiUser className="text-lg" />
        <span>Profiles</span>
      </Link>

      {isLoggedIn ? (
        <>
          <Link href="/profile" className="flex flex-col items-center text-sm hover:text-white/80 transition">
            <FiSettings className="text-lg" />
            <span>My</span>
          </Link>
          <button
            onClick={onLogout}
            className="flex flex-col items-center text-sm hover:text-white/80 transition"
          >
            <FiLogOut className="text-lg" />
            <span>Logout</span>
          </button>
        </>
      ) : (
        <Link href="/login" className="flex flex-col items-center text-sm hover:text-white/80 transition">
          <FiLogIn className="text-lg" />
          <span>Login</span>
        </Link>
      )}
    </nav>
  );
};

export default BottomNavBar;

