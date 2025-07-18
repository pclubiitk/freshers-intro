'use client';

import React, { useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import ProfileCard from '@/components/ProfileCard';
import { Loader2 } from 'lucide-react';
import { Profile } from '@/utils/types';

const ORIGIN = process.env.NEXT_PUBLIC_BACKEND_ORIGIN;
const LIMIT = 10;


const fetchProfiles = async ({ pageParam = 0 }): Promise<Profile[]> => {
  const res = await fetch(`${ORIGIN}/profile/get-all-profiles?skip=${pageParam * LIMIT}&limit=${LIMIT}`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch profiles');
  }
  return res.json();
};

const BrowseProfilesPage = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ['profiles'],
  queryFn: ({ pageParam = 0 }) => fetchProfiles(pageParam),
  getNextPageParam: (lastPage, allPages) => {
    if (lastPage.length <  LIMIT) return undefined;
    return allPages.length;
  },
  initialPageParam: 0
  });

  // Infinite scroll trigger
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 200 >=
        document.documentElement.offsetHeight
      ) {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) return <p className="text-center py-10">Loading profiles...</p>;
  if (error) return <p className="text-center py-10 text-red-500">Error loading profiles.</p>;

  const allProfiles = data?.pages.flat() ?? [];

  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-8 transition-colors duration-300">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10">
        <h1 className="text-5xl font-extrabold text-center md:text-left mb-4 md:mb-0 bg-gradient-to-r from-pink-500 via-blue-500 to-cyan-400 bg-clip-text text-transparent animate-gradient">
          Browse Profiles
        </h1>

        <input
          type="text"
          placeholder="Search by name or interest..."
          className="w-full md:w-80 px-4 py-2 rounded-md bg-muted dark:bg-muted-dark text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {allProfiles.map((profile, index) => (
          <ProfileCard key={index} profile={profile} index={index} />
        ))}
      </div>

      {isFetchingNextPage && (
        <div className="flex items-center justify-center gap-2 mt-6 text-lg text-muted-foreground">
          <Loader2 className="animate-spin" />
          Loading more profiles...
        </div>
      )}
    </div>
  );
};

export default BrowseProfilesPage;
