import ProfileDetails from '../../../components/ProfileDetails';
import { notFound } from 'next/navigation';
import { Profile } from '@/utils/types';

const ORIGIN = process.env.NEXT_PUBLIC_BACKEND_ORIGIN;

async function fetchProfileById(id: string): Promise<Profile | null> {
  try {
    const res = await fetch(`${ORIGIN}/profile/get-profile-by-id?id=${id}`, {
      credentials: 'include',
      cache: 'no-store',
    });

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function ProfilePage({ params }: { params: Promise<{ profileId: string }> }) {
  const {profileId} = await params;
  const decodedId = decodeURIComponent(profileId);
  const profile = await fetchProfileById(decodedId);
  if (!profile) return notFound();

  return <ProfileDetails profile={profile} />;
}
