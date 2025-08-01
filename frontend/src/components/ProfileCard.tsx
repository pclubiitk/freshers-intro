'use client';

import React from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { FaInstagram, FaLinkedinIn, FaGithub, FaDiscord } from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/pagination';
import { Profile } from '@/utils/types';

type Props = {
  profile: Profile;
};

const ProfileCard: React.FC<Props> = ({ profile }) => {
  return (
    <div
      className="group relative bg-gray-100 mx-4 dark:bg-gray-900 rounded-lg overflow-hidden shadow-md border border-gray-300 dark:border-gray-700 transition-all p-4 h-full hover:shadow-lg hover:border-indigo-500"
    >
      <Link
        href={`/profiles/${encodeURIComponent(profile.user.id.toString())}`}
        className="absolute inset-0 z-10"
      />
      <div className="flex flex-col md:flex-row gap-4 relative z-0">
        <div className="w-full md:w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
          <Swiper
            modules={[Pagination]}
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
          <div className="flex flex-row place-content-between items-center">
            <h2 className="text-xl font-semibold mb-1 group-hover:text-indigo-600 transition-colors">
              {profile.user.username}
            </h2>
            <span className="inline-flex items-center justify-center bg-indigo-600 text-white text-sm font-medium px-4 py-[2px] rounded-full">
              {profile.user.email.split('@')[0]}
            </span>
          </div>

          <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3 mb-3">
            {profile.bio || 'None'}
          </p>

          <div className="flex gap-3 mb-3">
            {profile.socials?.discord && (
              <a
                href={`https://discord.com/users/${profile.socials.discord}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-[#5865F2] dark:text-gray-400 dark:hover:text-[#5865F2] transition-colors"
                aria-label="Discord"
              >
                <FaDiscord size={20} />
              </a>
            )}
            {profile.socials?.instagram && (
              <a
                href={`https://instagram.com/${profile.socials.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-[#E1306C] dark:text-gray-400 dark:hover:text-[#E1306C] transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram size={20} />
              </a>
            )}
            {profile.socials?.linkedin && (
              <a
                href={`https://linkedin.com/in/${profile.socials.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-[#0077B5] dark:text-gray-400 dark:hover:text-[#0077B5] transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn size={20} />
              </a>
            )}
            {profile.socials?.github && (
              <a
                href={`https://github.com/${profile.socials.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                aria-label="GitHub"
              >
                <FaGithub size={20} />
              </a>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-auto">
            {profile.interests?.map((interest: string, i: number) => (
  <span
    key={i}
    className="inline-flex items-center justify-center bg-indigo-600 text-white text-xs font-medium px-4 py-[2px] rounded-full"
  >
    {interest}
  </span>
))}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
