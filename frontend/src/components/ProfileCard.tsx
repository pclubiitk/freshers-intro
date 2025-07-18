'use client'
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Profile } from '@/utils/types';

const ProfileCard = ({ profile, index }: { profile: Profile; index: number }) => (
  <div className="bg-background-100 dark:bg-background-900 rounded-lg overflow-hidden shadow-md border border-border-300 dark:border-border-700 transition-colors p-4">
    <div className="flex flex-col md:flex-row gap-4">
      <div className="w-full md:w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          className="w-full h-full"
        >
          {profile.user.images.map((obj, i) => (
            <SwiperSlide key={i}>
              <img
                src={obj.image_url}
                alt={`User ${index} Photo ${i}`}
                className="w-full h-full object-cover"
              />
            </SwiperSlide>
          ))}

        </Swiper>
      </div>

      <div className="flex-1 flex flex-col">
        <h2 className="text-xl font-semibold mb-1">{profile.user.username}</h2>
        <p className="text-foreground-700 dark:text-foreground-300 text-sm line-clamp-3 mb-3">
          {profile.bio}
        </p>

        <div className="flex flex-wrap gap-2 mt-auto">
          {profile.interests?.map((interest, i) => (
            <span
              key={i}
              className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default ProfileCard