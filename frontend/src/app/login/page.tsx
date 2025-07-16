'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading_or_not, isAuthenticated, refreshUser } = useAuth(); 
  const ORIGIN = process.env.NEXT_PUBLIC_BACKEND_ORIGIN;

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
  
  


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.endsWith("@iitk.ac.in")){
      toast.error("Only IITK email address is allowed.", {
        id: 422
      })
      return
    }

    try {
      setLoading(true);
      const res = await fetch(ORIGIN + "/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });
      if (res.status === 422) {
        toast.error("Please recheck your login details.", {
          id: 422
        })
        return
      }

      if (res.status === 401) {
        toast.error("Invalid login credentials.", {
          id: 401
        })
        return
      }
if (res.status === 403) {
  toast.error("Email not verified", {
    action: (
      <div className="w-full flex justify-end">
        <Button
          variant="outline"
          className="dark:hover:text-black"
          onClick={async () => {
            toast.promise(
              fetch(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}/auth/resend-verification`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),

              }).then(async(res) => {
                const data = await res.json()

                if (res.status === 429) {
                  throw new Error(data.detail || "Wait before requesting another mail.");
                }
                if (!res.ok) {
                  throw new Error(data.detail || "Failed to resend verification remail.");
                }

                return data;

              }),
              {
                loading: "Sending verification email...",
                success: "Verification email resent!",
                error: (err) => err.message || "Failed to resend email",
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
        // setError(data.detail || "Login failed.");
        toast.error(data.detail || "Login failed.");
        return;
      }
      else {toast.info(data.message)};
      await refreshUser();
      router.replace("/my-profile");
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again later.");
      toast.error("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white dark:from-[#0f172a] dark:to-[#1e293b] transition">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 bg-white/60 dark:bg-black/40 rounded-2xl shadow-xl backdrop-blur-lg border border-gray-200 dark:border-white/10 space-y-5 animate-in fade-in duration-700"
      >
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
          Welcome Back
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="text-sm font-medium block mb-1 text-gray-700 dark:text-gray-300">
            Email
          </label>
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
          <label className="text-sm font-medium block mb-1 text-gray-700 dark:text-gray-300">
            Password
          </label>
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
          {loading ? "Logging in..." : "Login"}
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
