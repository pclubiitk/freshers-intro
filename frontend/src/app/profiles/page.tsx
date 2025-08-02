"use client";

import React, { useState, useRef, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2, ChevronDown, Filter } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Loading from "@/components/Loading";
import { Profile } from "@/utils/types";
import SearchFilters from "@/components/browse-profile/SearchFilters";
import ProfileCard from "@/components/browse-profile/ProfileCard";

const ORIGIN = process.env.NEXT_PUBLIC_BACKEND_ORIGIN;
const LIMIT = 10;

// 🔧 New: fetch function accepts filters
const fetchProfiles = async ({
  pageParam = 0,
  searchTerm,
  branch,
  batch,
  hall,
}: {
  pageParam: number;
  searchTerm: string;
  branch: string;
  batch: string;
  hall: string;
}): Promise<Profile[]> => {
  const params = new URLSearchParams({
    skip: String(pageParam * LIMIT),
    limit: String(LIMIT),
  });

  if (searchTerm) params.append("searchTerm", searchTerm);
  if (branch) params.append("branch", branch);
  if (batch) params.append("batch", batch);
  if (hall) params.append("hall", hall);

  const res = await fetch(`${ORIGIN}/profile/get-all-profiles?${params}`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch profiles");
  return res.json();
};

const UserGallery = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedHall, setSelectedHall] = useState<string>("");
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  const observerRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["profiles", debouncedSearchTerm, selectedBranch, selectedBatch, selectedHall],
    queryFn: ({ pageParam = 0 }) =>
      fetchProfiles({
        pageParam,
        searchTerm: debouncedSearchTerm,
        branch: selectedBranch,
        batch: selectedBatch,
        hall: selectedHall,
      }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < LIMIT) return undefined;
      return allPages.length;
    },
    initialPageParam: 0,
  });

  // Re-fetch when filters change
  useEffect(() => {
    refetch();
  }, [searchTerm, selectedBranch, selectedBatch, selectedHall]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);


  useEffect(() => {
    sessionStorage.clear();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) observer.disconnect();
    };
  }, [observerRef, hasNextPage, isFetchingNextPage]);

  if (isLoading) return <Loading />;
  if (error)
    return (
      <p className="text-center py-10 text-red-500">Error loading profiles.</p>
    );

  const allProfiles: Profile[] = data?.pages.flat() ?? [];

  // For filter dropdown options only
  const branches = Array.from(new Set(allProfiles.map((p) => p.branch).filter(Boolean))) as string[];
  const halls = Array.from(new Set(allProfiles.map((p) => p.hostel).filter(Boolean))) as string[];
  const batches = Array.from(new Set(allProfiles.map((p) => p.batch).filter(Boolean))) as string[];

  return (
    <div className="min-h-screen bg-background text-foreground py-8 transition-colors duration-300">
      <div className="flex flex-col md:flex-row items-start mx-4 md:items-center justify-between mb-10">
        <h1 className="text-5xl font-extrabold text-center md:text-left mb-4 md:mb-0 bg-gradient-to-r from-pink-500 via-blue-500 to-cyan-400 bg-clip-text text-transparent animate-gradient">
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
                className="flex items-center gap-1 px-3 py-2 bg-gray-200 dark:bg-black rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <Filter size={18} />
                <ChevronDown
                  size={18}
                  className={`transition-transform ${showFilters ? "rotate-180" : ""}`}
                />
              </button>

              {showFilters && (
                <SearchFilters
                  setShowFilters={setShowFilters}
                  selectedBranch={selectedBranch}
                  setSelectedBranch={setSelectedBranch}
                  selectedHall={selectedHall}
                  setSelectedHall={setSelectedHall}
                  selectedBatch={selectedBatch}
                  setSelectedBatch={setSelectedBatch}
                  branches={branches}
                  batches={batches}
                  halls={halls}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {allProfiles.length > 0 ? (
          allProfiles.map((profile, i) => (
            <ProfileCard key={i} profile={profile} />
          ))
        ) : (
          <div className="flex items-center justify-center min-h-[50vh] min-w-[100vw] overflow-hidden mt-10">
            <span className="text-gray-500 text-lg text-center">
              No profiles found.
            </span>
          </div>
        )}
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
            "Scroll to load more"
          )}
        </div>
      )}
    </div>
  );
};

export default UserGallery;
