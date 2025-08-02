'use client'

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const ORIGIN = process.env.NEXT_PUBLIC_BACKEND_ORIGIN;

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const router = useRouter();

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    if (!token) {
    return (
        <div className="min-h-screen flex items-center justify-center text-red-600 dark:text-red-400">
            Invalid or missing reset token.
        </div>
    );
}

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            toast.error("Missing reset token.");
            return;
        }

        if (password !== confirm) {
            toast.error("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            toast.error("Please use a longer password");
            return
        }

        try {
            setLoading(true);
            const res = await fetch(`${ORIGIN}/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, new_password: password }),
        });

            const data = await res.json();
            if (!res.ok) {
                toast.error(data.detail || "Reset failed.");
                return;
            }

            toast.success("Password reset successful.");
            router.push("/login");
        } catch (err) {
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex inset-0 fixed items-center justify-center min-h-screen bg-white dark:bg-black">
            <form onSubmit={handleReset} className="w-[80%] md:w-full max-w-md p-5 md:p-8 rounded-xl shadow-md bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-center mb-8 md:mb-4 text-gray-900 dark:text-white">Reset Password</h2>
                <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mb-4 dark:text-white w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none"
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    className="mb-4 dark:text-white w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mt-4 mb:mt-0 disabled:opacity-50"
                >
                    {loading ? "Resetting..." : "Reset Password"}
                </button>
            </form>
        </div>
    );
}