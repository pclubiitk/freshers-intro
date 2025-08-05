'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { Loader2, ChevronDown, Filter } from 'lucide-react';
import { 
  FaInstagram, 
  FaLinkedinIn, 
  FaGithub,
  FaDiscord 
} from 'react-icons/fa';
import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Loading from '@/components/Loading';
import ProfileCard from '@/components/ProfileCard';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

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
  socials?: {
    discord?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
  };
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
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [selectedHall, setSelectedHall] = useState<string>('');
  const [selectedBatch, setSelectedBatch] = useState<string>('');
  const observerRef = useRef<HTMLDivElement | null>(null);
  const { isAuthenticated, loading_or_not } = useAuth();

  useEffect(() => {
    if (!loading_or_not && !isAuthenticated) {
      router.replace('/login');
    }
  }, [loading_or_not, isAuthenticated, router]);

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

  if (isLoading) return <Loading />;
  if (error) return <p className="text-center py-10 text-red-500">Error loading profiles.</p>;
  if (loading_or_not) return <Loading />;
  if (!isAuthenticated) return null;

  const allProfiles: Profile[] = data?.pages.flat() ?? [];

  const branches = Array.from(new Set(allProfiles.map(p => p.branch).filter(Boolean))) as string[];
  const halls = Array.from(new Set(allProfiles.map(p => p.hostel).filter(Boolean))) as string[];
  const batches = Array.from(new Set(allProfiles.map(p => p.batch).filter(Boolean))) as string[];

const filteredProfiles = allProfiles.filter((profile) => {
  
  const search = searchTerm.toLowerCase();
  return (
    (profile.user.username.toLowerCase().includes(search) ||
     profile.interests?.some((i) => i.toLowerCase().includes(search)) ||
     profile.user.email.split('@')[0].toLowerCase().includes(search)) &&
    (!selectedBranch || profile.branch?.toLowerCase() === selectedBranch.toLowerCase()) &&
    (!selectedHall || profile.hostel?.toLowerCase() === selectedHall.toLowerCase()) &&
    (!selectedBatch || profile.batch?.toLowerCase() === selectedBatch.toLowerCase())
  );
});

  return (
    <div className="min-h-screen bg-background text-foreground py-8 transition-colors duration-300">
      <div className="flex flex-col md:flex-row items-start mx-4 md:items-center justify-between mb-10">
        <h1 className="text-5xl font-extrabold text-center md:text-left mb-4 md:mb-0 text-black dark:text-white bg-clip-text animate-gradient">
          Browse Profiles
        </h1>

        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <div className="flex gap-2 w-full">
            <input
              type="text"
              placeholder="Search by name or interest..."
              className="flex-1 px-4 py-2 rounded-md bg-muted dark:bg-muted-dark text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <div className="relative">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex h-[100%] items-center gap-1 px-3 py-2 bg-gray-200 dark:bg-black rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <Filter size={18} />
                <ChevronDown size={18} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

        {showFilters && (
  <div className="fixed inset-0 z-30 flex items-start justify-center px-4 pt-24 sm:pt-32 bg-black/40" onClick={() => setShowFilters(false)}>
    <div
      className="bg-white dark:bg-black rounded-lg shadow-xl w-full max-w-md p-4 border border-gray-200 dark:border-gray-700"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-lg font-semibold mb-4">Filter Profiles</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Branch</label>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-md bg-white dark:bg-gray-900"
          >
            <option value="">All Branches</option>
            {branches.map(branch => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Hostel</label>
          <select
            value={selectedHall}
            onChange={(e) => setSelectedHall(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-md bg-white dark:bg-gray-900"
          >
            <option value="">All Hostels</option>
            {halls.map(hall => (
              <option key={hall} value={hall}>{hall}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Batch</label>
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-md bg-white dark:bg-gray-900"
          >
            <option value="">All Batches</option>
            {batches.map(batch => (
              <option key={batch} value={batch}>{batch}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setShowFilters(false)}
          className="w-full py-2 bg-indigo-600 text-white rounded-md mt-4 hover:bg-indigo-700 transition"
        >
          Apply Filters
        </button>
      </div>
    </div>
  </div>
)}


            </div>
          </div>
        </div>
      </div>

       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {filteredProfiles.map((profile,index=profile.user.id) => (
           <div key={index} className="no-underline">
            <ProfileCard profile={profile} number_of_interests={5}/>
          </div>
        ))}
      </div>

      <div ref={observerRef} className="w-full flex justify-center my-10">
        {isFetchingNextPage && <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />}
        {!hasNextPage && <p className="text-muted-foreground">No more profiles</p>}
      </div>
    </div>
  );
};

export default UserGallery;