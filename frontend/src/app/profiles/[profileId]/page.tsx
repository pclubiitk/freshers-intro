'use client';

import { use } from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Loading from '@/components/Loading';
import ProfileDetails from '../../../components/ProfileDetails';
import { Profile } from '@/utils/types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const ORIGIN = process.env.NEXT_PUBLIC_BACKEND_ORIGIN;

export default function ProfilePage({ params }: { params: Promise<{ profileId: string }> }) {
  const router = useRouter();
  const { isAuthenticated, loading_or_not } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { profileId } = use(params);
  const decodedId = decodeURIComponent(profileId);

  useEffect(() => {
    if (!loading_or_not && !isAuthenticated) {
      router.replace('/login');
    }
  }, [loading_or_not, isAuthenticated, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${ORIGIN}/profile/get-profile-by-id?id=${decodedId}`, {
          credentials: 'include',
          cache: 'no-store',
        });
        if (!res.ok) {
          setProfile(null);
        } else {
          const data = await res.json();
          setProfile(data);
        }
      } catch (error) {
        setProfile(null);
      } finally {
        setLoadingProfile(false);
      }
    };

    if (isAuthenticated) {
      fetchProfile();
    }
  }, [decodedId, isAuthenticated]);

  const handleReportSubmit = () => {
  const reportPromise = new Promise<void>(async (resolve, reject) => {
    if (!reason.trim()) {
      reject(new Error('Please provide a reason'));
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${ORIGIN}/profile/report-profile`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reported_profile_id: decodedId, reason }),
      });

      if (!res.ok) {
        const data = await res.json();
        reject(new Error(data.detail || 'Failed to report user'));
        return;
      }

      resolve();
      setDialogOpen(false);
      setReason('');
    } catch (err) {
      reject(new Error('Something went wrong while reporting'));
    } finally {
      setSubmitting(false);
    }
  });

  toast.promise(reportPromise, {
    loading: 'Reporting user...',
    success: 'User reported successfully',
    error: (err: Error) => err.message || 'Failed to report user',
  });
};


  if (loading_or_not || loadingProfile) return <Loading />;
  if (!isAuthenticated) return null;
  if (!profile) return null;

  return (
      <div className="relative min-h-screen overflow-hidden">
    {profile?.background_image ? (
      <div
        className="absolute inset-0 bg-center bg-cover z-0"
        style={{
          backgroundImage: `url(${profile.background_image})`,
          filter: 'brightness(1)',
          transform: 'scale(1.1)',
        }}
      />
    ) : (
      <div className="absolute inset-0 bg-white dark:bg-black z-0" />
    )}

    <div className="absolute inset-0 z-0 bg-white/60 dark:bg-black/30 backdrop-blur-xs" />

    <div className="relative z-10 space-y-4 px-4 sm:px-8 py-6 text-black dark:text-white">
      <ProfileDetails profile={profile} />
      <div className="flex justify-end ">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="destructive"
              className="rounded-xl px-4 py-2 text-sm font-semibold fixed bottom-[20] right-[20]"
            >
                Report Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className='dark:text-white text-black'>Report User</DialogTitle>
              <DialogDescription>
                <span className="dark:text-red-300 text-red-500">We take reports very seriously.</span> <br/>Tell us why you are reporting this user. Your feedback helps keep the platform safe.
              </DialogDescription>
            </DialogHeader>
            <Textarea
              placeholder="Why are you reporting this profile?"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px] dark:text-zinc-100 text-black"
            />
            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => {setDialogOpen(false); setReason('');}}
                className='dark:text-white text-black'
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReportSubmit}
                disabled={submitting}
              >
                {submitting ? 'Reporting...' : 'Submit Report'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
    </div>
  );
}
