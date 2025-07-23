'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, User } from "lucide-react"; // optional icons
import { toast } from "sonner";
import Link from "next/link";
import Loading from "@/components/Loading";


export default function SignupPage() {
  const { loading_or_not, isAuthenticated } = useAuth();
  const router = useRouter();
  const ORIGIN = process.env.NEXT_PUBLIC_BACKEND_ORIGIN;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreedToTnC, setAgreedToTnC] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
    useEffect(() => {
      if (!loading_or_not && isAuthenticated) {
        router.replace('/my-profile');
      }
    }, [loading_or_not, isAuthenticated, router]);
  
    if (loading_or_not) return <Loading />;
  
  
  const isValidY25Email = (email: string) => {
  return /^[0-9]{5}@iitk\.ac\.in$/.test(email);
};
const isIITKEmail = (email: string) => email.endsWith("@iitk.ac.in");

const getEmailPrefix = (email: string) => email.split("@")[0];


  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
if (!agreedToTnC) {
      toast.error("You must agree to the Privacy Policy to register.");
      return;
    }


    if (!isIITKEmail(email)) {
      toast.error("Only IITK emails are allowed.");
      return;
    }
    // const prefix = getEmailPrefix(email);
    
    // if (!prefix.endsWith('25')) {
    //   toast.error("Only Y25s allowed to register");
    //   return
    // }

    const signupPromise = new Promise<void>(async (resolve, reject) => {
      try {
        setLoading(true);
        const res = await fetch(`${ORIGIN}/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: name, email, password }),
        });

        const data = await res.json();

        if (res.status == 422){
          reject(new Error(data.detail[0].ctx.reason || "Invalid fields."))
          return
        }

        if (!res.ok) {
          reject(new Error(data.detail || "Signup failed."));
          return;
        }

        resolve();
        router.push("/login");
      } catch (err) {
        setError("Server error. Please try again later.");
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
    <main className="min-h-screen flex items-center justify-center bg-white dark:bg-black transition-colors duration-300">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 bg-gray-100 dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-300 dark:border-gray-800 space-y-6 animate-in fade-in duration-700 transition-colors"
      >
        <h2 className="text-3xl font-bold text-center text-black dark:text-white">
          Create Your Account
        </h2>

        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-600 dark:text-red-300 px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}

        
        <div>
          <label className="text-sm font-medium block mb-1 text-gray-700 dark:text-gray-300">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="John Doe"
            />
          </div>
        </div>

        
        <div>
          <label className="text-sm font-medium block mb-1 text-gray-700 dark:text-gray-300">
            IITK Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="<cc_username>@iitk.ac.in"
            />
          </div>
        </div>

    
        <div>
          <label className="text-sm font-medium block mb-1 text-gray-700 dark:text-gray-300">
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="••••••••"
            />
          </div>
        </div>
<div className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
  <input
    id="privacy"
    type="checkbox"
    checked={agreedToTnC}
    onChange={(e) => setAgreedToTnC(e.target.checked)}
    className="mt-1"
  />
  <label htmlFor="privacy">
    I agree to the{" "}
    <Link href="/privacy" className="text-blue-600 hover:underline" target="_blank">
      Privacy Policy
    </Link>
  </label>
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
