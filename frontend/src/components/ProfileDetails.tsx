'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Profile } from '@/utils/types';
import {
  FaUserGraduate,
  FaBuilding,
  FaLayerGroup,
} from 'react-icons/fa';

export default function ProfileDetails({ profile }: { profile: Profile }) {
  const images =
    profile.user.images.length > 0
      ? profile.user.images.map((img) => img.image_url)
      : ['/images/profile-placeholder.jpg'];

  return (
    <div className=" bg-gradient-to-b bg-fixed dark:bg-black text-black dark:text-white bg-white px-4 sm:px-8 py-8 sm:py-12 lg:py-16">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-purple-800 bg-black/20 backdrop-blur-sm">
            <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          className="w-full aspect-[4/3] !h-full"
        >
          {images.map((url, i) => (
            <SwiperSlide key={i} className="h-full">
              <img
                src={url}
                alt={`${profile.user.username} Photo ${i + 1}`}
                onError={(e) =>
                  (e.currentTarget.src = '/images/profile-placeholder.jpg')
                }
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </SwiperSlide>
          ))}
        </Swiper>

          </div>

          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-2 flex items-center gap-2">
                {profile.user.username}
              </h1>
              <p className="text-sm dark:text-purple-300 text-zinc-600 mb-6">
                @{profile.user.email.split('@')[0]}
              </p>

              {profile.bio && (
                <section className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">About</h2>
                  <p className="dark:text-purple-100 text-sm sm:text-base leading-relaxed bg-purple-800/20 p-4 rounded-xl border border-purple-600 overflow-x ">
                    {profile.bio}
                  </p>
                </section>
              )}

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Academic Info</h2>
                <ul className="space-y-2">
                  {profile.branch && (
                    <li className="flex items-center gap-2 dark:text-purple-200">
                      <FaLayerGroup className="dark:text-purple-400 text-black" />
                      <strong>Branch:</strong> {profile.branch}
                    </li>
                  )}
                  {profile.batch && (
                    <li className="flex items-center gap-2 dark:text-purple-200">
                      <FaUserGraduate className="dark:text-purple-400 text-black" />
                      <strong>Batch:</strong> {profile.batch}
                    </li>
                  )}
                  {profile.hostel && (
                    <li className="flex items-center gap-2 dark:text-purple-200">
                      <FaBuilding className="dark:text-purple-400 text-black" />
                      <strong>Hostel:</strong> {profile.hostel}
                    </li>
                  )}
                </ul>
              </section>

              {/* Interests */}
              {Array.isArray(profile.interests) &&
                profile.interests.length > 0 && (
                  <section>
                    <h2 className="text-xl font-semibold mb-2">My Interests</h2>
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((interest, i) => (
                        <span
                          key={i}
                          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold shadow-md hover:bg-indigo-600 hover:scale-105 transition"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </section>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
