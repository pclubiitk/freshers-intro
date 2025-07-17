'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, User } from "lucide-react"; // optional icons
import { toast } from "sonner";
import Link from "next/link";


export default function SignupPage() {
  const { loading_or_not, isAuthenticated } = useAuth();
  const router = useRouter();
  const ORIGIN = process.env.NEXT_PUBLIC_BACKEND_ORIGIN;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
    useEffect(() => {
      if (!loading_or_not && isAuthenticated) {
        router.replace('/my-profile');
      }
    }, [loading_or_not, isAuthenticated]);
  
    if (loading_or_not) return <div>loading...</div>;
  
  

  const isIITKEmail = (email: string) => email.endsWith("@iitk.ac.in");

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  if (!isIITKEmail(email)) {
    // setError("Only IITK emails are allowed.");
    toast.error("Only IITK emails are allowed.")
    return;
  }

  const signupPromise = new Promise<void>(async (resolve, reject) => {
    try {
      setLoading(true);
      const res = await fetch(ORIGIN + "/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        reject(new Error(data.detail || "Signup failed."));
        return;
      }

      resolve();
      router.push(`/login`);
    } catch (err) {
      setError("Server error. Please try again later");
      reject(new Error("Server error. Please try again later."));
    } finally {
      setLoading(false);
    }
  });

  toast.promise(signupPromise, {
    loading: "Creating account...",
    success: "Verification email sent!",
    error: (err: Error) => err.message || "Signup failed.",
  });
};



  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white dark:from-[#0f172a] dark:to-[#1e293b] transition">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 bg-white/60 dark:bg-black/40 rounded-2xl shadow-xl backdrop-blur-lg border border-gray-200 dark:border-white/10 space-y-5 animate-in fade-in duration-700"
      >
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
          Create Your IITK Account
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}

        <div className="relative">
          <label className="text-sm font-medium block mb-1 text-gray-700 dark:text-gray-300">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/80 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 dark:text-white"
              placeholder="John Doe"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1 text-gray-700 dark:text-gray-300">IITK Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/80 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 dark:text-white"
              placeholder="cc_username@iitk.ac.in"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1 text-gray-700 dark:text-gray-300">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/80 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800 dark:text-white"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline font-medium">
            Log in
          </Link>
        </p>
      </form>
    </main>
  );
}
