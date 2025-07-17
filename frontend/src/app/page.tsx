"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black dark:bg-black dark:text-white pt-24">

      <main className="flex-grow flex flex-col items-center justify-start px-6 text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <img
            src="/images/pclublogo.png"
            alt="Programming Club IITK Logo"
            width={80}
            height={80}
            className="object-contain"
          />
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-pink-500 via-blue-500 to-cyan-400 bg-clip-text text-transparent animate-gradient">
          Welcome Freshers!
        </h1>

        <p className="mt-4 text-gray-700 dark:text-gray-300 text-lg max-w-xl">
          This is your platform to introduce yourself to your batch, explore others’ profiles, and make your mark ✨
        </p>
        <div className="flex flex-wrap gap-4 mt-8">
  <Link
    href="/signup"
    className="px-6 py-3 font-semibold rounded-lg bg-gradient-to-r from-pink-500 via-blue-500 to-cyan-400 hover:brightness-110 transition text-white no-underline"
  >
    Get Started
  </Link>
  <Link
    href="/profiles"
    className="px-6 py-3 font-semibold rounded-lg bg-black/10 dark:bg-white/10 border border-black/10 dark:border-white/10 hover:bg-black/20 dark:hover:bg-white/20 transition no-underline"
  >
    View Profiles
  </Link>
</div>
      </main>

      
      <footer className="text-center text-sm text-gray-600 dark:text-gray-500 py-6">
        Made by{' '}
        <a
          href="https://pclub.in"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-black dark:hover:text-white"
        >
          Programming Club IITK
        </a>
      </footer>
    </div>
  );
}
