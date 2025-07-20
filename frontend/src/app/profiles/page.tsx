'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
// import './swiper-custom.css';

export type Image = { image_url: string };

export type Profile = {
  user: {
    username: string;
    email: string;
    id: number;
    is_verified: boolean;
    images: Image[];
  };
  bio?: string;
  branch?: string;
  batch?: string;
  hostel?: string;
  hobbies?: string[];
  interests?: string[];
};

const ORIGIN = process.env.NEXT_PUBLIC_BACKEND_ORIGIN;
const LIMIT = 10;

const fetchProfiles = async ({ pageParam = 0 }): Promise<Profile[]> => {
  const res = await fetch(`${ORIGIN}/profile/get-all-profiles?skip=${pageParam * LIMIT}&limit=${LIMIT}`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch profiles');
  return res.json();
};

const UserGallery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const observerRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ['profiles'],
    queryFn: ({ pageParam = 0 }) => fetchProfiles({ pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < LIMIT) return undefined;
      return allPages.length;
    },
    initialPageParam: 0,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) return <p className="text-center py-10">Loading profiles...</p>;
  if (error) return <p className="text-center py-10 text-red-500">Error loading profiles.</p>;

  const allProfiles: Profile[] = data?.pages.flat() ?? [];

  const filteredProfiles = allProfiles.filter((profile) => {
    const search = searchTerm.toLowerCase();
    return (
      profile.user.username.toLowerCase().includes(search) ||
      profile.interests?.some((i) => i.toLowerCase().includes(search)) ||
      profile.user.email.split('@')[0].includes(search)
    );
  });

  return (
    <div className="min-h-screen bg-background text-foreground py-8 transition-colors duration-300">
      <div className="flex flex-col md:flex-row items-start mx-4 md:items-center justify-between mb-10">
        <h1 className="text-5xl font-extrabold text-center md:text-left mb-4 md:mb-0 bg-gradient-to-r from-pink-500 via-blue-500 to-cyan-400 bg-clip-text text-transparent animate-gradient">
          Browse Profiles
        </h1>

        <input
          type="text"
          placeholder="Search by name or interest..."
          className="w-full md:w-80 px-4 py-2 rounded-md bg-muted dark:bg-muted-dark text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filteredProfiles.length > 0 ? filteredProfiles.map((profile) => (
          <div
            key={profile.user.id}
            className="group relative bg-gray-100 mx-4 dark:bg-gray-900 rounded-lg overflow-hidden shadow-md border border-gray-300 dark:border-gray-700 transition-all p-4 h-full hover:shadow-lg hover:border-indigo-500"
          >
            <Link href={`/profiles/${encodeURIComponent(profile.user.id.toString())}`} className="absolute inset-0 z-10" />

            <div className="flex flex-col md:flex-row gap-4 relative z-0">
              <div className="w-full md:w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                <Swiper
                  modules={[Navigation, Pagination]}
                  navigation
                  pagination={{ clickable: true }}
                  className="w-full h-full custom-swiper"
                >
                  {(profile.user.images.length > 0
                    ? profile.user.images
                    : [{ image_url: '/images/profile-placeholder.jpg' }]
                  ).map((img, i) => (
                    <SwiperSlide key={i}>
                      <img
                        src={img.image_url}
                        alt={`Photo ${i} of ${profile.user.username}`}
                        loading="lazy"
                        className="w-full h-full object-cover"
                        onError={(e) =>
                          ((e.target as HTMLImageElement).src = '/images/profile-placeholder.jpg')
                        }
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <div className="flex-1 flex flex-col">
                <div className='flex flex-row place-content-between'>
                  <h2 className="text-xl font-semibold mb-1 group-hover:text-indigo-600 transition-colors">
                  {profile.user.username}
                  </h2>
                  <span className='bg-indigo-600 text-white text-sm px-3 py-1 rounded-full'>
                    {profile.user.email.split('@')[0]}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3 mb-3">
                  {profile.bio || 'No bio provided.'}
                </p>

                <div className="flex flex-wrap gap-2 mt-auto">
                  {profile.interests?.map((interest, i) => (
                    <span
                      key={i}
                      className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full"
                    >
                      {interest}
                    </span>
                  )) || <span className="text-sm text-gray-500">No interests listed.</span>}
                </div>
              </div>
            </div>
          </div>
        )) : <div className="flex items-center justify-center min-h-[50vh] min-w-[100vw] overflow-hidden mt-10">
      <span className="text-gray-500 text-lg text-center">
        No profiles found.
      </span>
    </div>}
      </div>

      {hasNextPage && (
        <div
          ref={observerRef}
          className="h-10 mt-10 flex justify-center items-center text-gray-500"
        >
          {isFetchingNextPage ? (
            <>
              <Loader2 className="animate-spin mr-2" /> Loading more profiles...
            </>
          ) : (
            'Scroll to load more'
          )}
        </div>
      )}
    </div>
  );
};

export default UserGallery;
