'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

export default function VerifyEmailPage() {
  const ORIGIN = process.env.NEXT_PUBLIC_BACKEND_ORIGIN;
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'already'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage("No token provided.");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`${ORIGIN}/auth/verify-email?token=${token}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.detail || 'Verification failed.');

        if (data.message.toLowerCase().includes("already")) {
          setStatus('already');
        } else {
          setStatus('success');
        }

        setMessage(data.message);
      } catch (err: any) {
        setStatus('error');
        setMessage(err.message || "Something went wrong.");
      }
    };

    verify();
  }, [token]);

  useEffect(() => {
    if (status === 'success' || status === 'already') {
      const timeout = setTimeout(() => {
        router.push('/login');
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [status, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50 dark:bg-gray-900 transition">

      {status === 'loading' && (
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-lg">
          <Loader2 className="animate-spin" />
          Verifying your email...
        </div>
      )}


      {status === 'success' && (
        <div className="flex flex-col items-center gap-2 text-green-700 dark:text-green-400">
          <CheckCircle2 size={32} />
          <p className="text-center">{message}</p>
        </div>
      )}


      {status === 'already' && (
        <div className="flex flex-col items-center gap-2 text-yellow-700 dark:text-yellow-400">
          <CheckCircle2 size={32} />
          <p className="text-center">{message}</p>
        </div>
      )}

      {status === 'error' && (
        <div className="flex flex-col items-center gap-2 text-red-600 dark:text-red-400">
          <XCircle size={32} />
          <p className="text-center">{message}</p>
        </div>
      )}
    </div>
  );
}


