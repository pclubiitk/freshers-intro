'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Trash2, Ban } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

type User = {
  id: string;
  email: string;
  name: string;
};

type UserProfile = {
  id: string;
  user: User;
};

type Report = {
  id: string;
  reason?: string;
  reporter: User;
  reported_profile: UserProfile;
  created_at: string;
};

const ORIGIN = process.env.NEXT_PUBLIC_BACKEND_ORIGIN;
export const formatToIST = (utcDateStr: string) => {
  const date = new Date(utcDateStr);
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const { isAuthenticated, loading_or_not, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!loading_or_not && !isAuthenticated) {
      router.replace('/login');
    }
  }, [loading_or_not, isAuthenticated, router]);

  useEffect(() => {
    if (!user) return;

    if (!['secretary', 'coordinator'].includes(user.club_role)) {
      toast.error('Access denied');
      router.push('/');
      return;
    }

    fetchReports();
  }, [user]);

  const fetchReports = async () => {
    try {
      const res = await fetch(`${ORIGIN}/profile/get-reports`, {
        method: 'GET',
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to fetch reports');
      const data = await res.json();
      setReports(data);
    } catch (err) {
      console.error(err);
      toast.error('Error loading reports');
    } finally {
      setLoading(false);
    }
  };

  const deleteReport = async (reportId: string) => {
    setActionLoading(reportId);
    try {
      const res = await fetch(`${ORIGIN}/profile/delete-report/${reportId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to delete report');
      setReports((prev) => prev.filter((r) => r.id !== reportId));
      toast.success('Report deleted');
    } catch (err) {
      toast.error('Could not delete report');
    } finally {
      setActionLoading(null);
    }
  };

  const suspendProfile = async (profileId: string, reportId: string) => {
    setActionLoading(reportId);
    try {
      const res = await fetch(`${ORIGIN}/profile/delete-profile/${profileId}`, {
        method: 'POST',
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to delete profile');
      toast.success('Profile Deleted');
      setReports((prev) => prev.filter((r) => r.id !== reportId));
    } catch (err) {
      toast.error('Could not suspend profile');
    } finally {
      setActionLoading(null);
    }
  };


  if (loading || loading_or_not) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  if (reports.length === 0) {
    return (
      <div className="text-center mt-20 text-muted-foreground text-lg">
        No reports found.
      </div>
    );
  }

  return (
    <div className="mx-auto py-10 px-4 bg-white dark:bg-black text-black dark:text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">Profile Reports</h1>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <Card key={report.id} className="shadow-md hover:shadow-lg transition">
            <CardContent className="p-5 space-y-4">
              <div>
                <span className="font-semibold">Reported by:</span>{' '}
                <span className="text-blue-600">{report.reporter.email}</span>
              </div>
              <div>
                <span className="font-semibold">Reported At:</span>{' '}
                <span className="text-blue-600">{formatToIST(report.created_at)}</span>
              </div>
              <div>
                <span className="font-semibold">Reported profile:</span>{' '}
                <span className="text-red-600">{report.reported_profile.user.email}</span>
              </div>
              <div>
                <span className="font-semibold">Reason:</span>{' '}
                <span>{report.reason || 'No reason provided'}</span>
              </div>
              <Link
                href={`/profiles/${report.reported_profile.user.id}`}
                className="dark:text-blue-500 text-blue-600 dark:hover:text-white hover:text-blue-600 no-underline hover:underline"
              >
                View Reported Profile
              </Link>
              <div className="flex gap-4 pt-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteReport(report.id)}
                  disabled={actionLoading === report.id}
                >
                  {actionLoading === report.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Deleting
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Report
                    </>
                  )}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    suspendProfile(report.reported_profile.id, report.id)
                  }
                  disabled={actionLoading === report.id}
                >
                  {actionLoading === report.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Suspending
                    </>
                  ) : (
                    <>
                      <Ban className="w-4 h-4 mr-2" />
                      Suspend Profile
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
