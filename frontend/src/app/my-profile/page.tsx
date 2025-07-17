'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { user, loading_or_not, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading_or_not && !isAuthenticated) {
      router.replace('/login');
    }
  }, [loading_or_not, isAuthenticated]);

  if (loading_or_not) return <div>loading...</div>;

  return (
    <div className="p-10 pt-40">
      <h1 className="text-xl font-bold">Welcome, {user?.username}</h1>
      <p>Email: {user?.email}</p>
      <p>Verified: {user?.is_verified ? 'Yes' : 'No'}</p>
    </div>
  );
}
