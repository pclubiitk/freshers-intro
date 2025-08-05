'use client';

import React from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { FaInstagram, FaLinkedinIn, FaGithub, FaDiscord, FaCode, FaLaptopCode } from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/pagination';
import { Profile } from '@/utils/types';
import { SiHackerrank } from 'react-icons/si';
import Image from 'next/image';
import { useUserArt } from '@/utils/hooks/useUserArt';

type Props = {
  profile: Profile;
  number_of_interests: number;
};


const ProfileCard: React.FC<Props> = ({ profile, number_of_interests }) => {
  const socialLinks = [
    {
      key: 'discord',
      url: (value: string) => `https://discord.com/users/${value}`,
      icon: <FaDiscord size={20} />,
      color: '#5865F2',
    },
    {
      key: 'instagram',
      url: (value: string) => `https://instagram.com/${value}`,
      icon: <FaInstagram size={20} />,
      color: '#E1306C',
    },
    {
      key: 'linkedin',
      url: (value: string) => `https://linkedin.com/in/${value}`,
      icon: <FaLinkedinIn size={20} />,
      color: '#0077B5',
    },
    {
      key: 'github',
      url: (value: string) => `https://github.com/${value}`,
      icon: <FaGithub size={20} className='invert dark:invert-0'/>,
      color: 'white',
    },
    {
      key: 'codeforces',
      url: (value: string) => `https://codeforces.com/profile/${value}`,
      icon: <Image src='/icons8-codeforces-24.png' className="hover:scale-130" width={20} height={20} alt={''}/>,
    },
    {
      key: 'leetcode',
      url: (value: string) => `https://leetcode.com/${value}`,
      icon: <Image src='/icons8-leetcode-24.png' className="hover:scale-130" width={20} height={20} alt={''}/>,
    },
    {
      key: 'atcoder',
      url: (value: string) => `https://atcoder.jp/users/${value}`,
      icon: <FaLaptopCode size={20} />,
      color: '#0033cc',
    },
    {
      key: 'hackerrank',
      url: (value: string) => `https://www.hackerrank.com/${value}`,
      icon: <SiHackerrank size={20} />,
      color: '#2ec866'
    },
  ];

  return (

    <div className="group relative bg-gray-100 mx-4 dark:bg-gray-900 rounded-lg overflow-hidden shadow-md border border-gray-300 dark:border-gray-700 transition-all p-4 h-full hover:shadow-lg hover:border-indigo-500"
    >
       {profile?.background_image ? (
      <div
        className="absolute inset-0 bg-center bg-cover z-0"
        style={{
          backgroundImage: `url(${profile.background_image})`,
          filter: 'blur(1px) brightness(1)',
          transform: 'scale(1.1)',

        }}
      />
    ) : (
      <div className="absolute inset-0 bg-white dark:bg-black z-0" />
    )}
    <div className="absolute inset-0 z-0 bg-white/60 dark:bg-black/30" />

      <div className="flex flex-col md:flex-row gap-4 relative z-0">

        <div className="w-full md:w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
          <Link href={`/profiles/${encodeURIComponent(profile.user.id.toString())}`}>
            <div className="absolute inset-0 z-0" />
            <Swiper
              modules={[Pagination]}
              pagination={{ clickable: true }}
              className="w-full h-full custom-swiper"
            >
              {(profile.user.images.length > 0
                ? profile.user.images.slice(0,1)
                : [{ image_url: '/images/profile-placeholder.jpg' }]
              ).map((img, i) => (
                <SwiperSlide key={i}>
                  <img
                    src={img.image_url}
                    alt={`Photo ${i} of ${profile.user.username}`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                    onError={(e) => ((e.target as HTMLImageElement).src = '/images/profile-placeholder.jpg')}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </Link>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
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
            {socialLinks.map(({ key, url, icon, color }) => {
              const value = profile.socials?.[key as keyof typeof profile.socials];
              return (
                value && (
                  <a
                    key={key}
                    href={url(value)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 transition-colors"
                    style={{ color }}
                    aria-label={key}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {icon}
                  </a>
                )
              );
            })}
          </div>

          <div className="flex flex-wrap gap-2 mt-auto">
            {profile.interests?.slice(0,number_of_interests)?.map((interest: string, i: number) => (
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
