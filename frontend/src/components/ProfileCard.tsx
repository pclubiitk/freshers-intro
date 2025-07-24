'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Profile } from '@/utils/types';
import { Badge } from './ui/badge';
import Image from 'next/image';
import { 
  FaInstagram, 
  FaLinkedinIn, 
  FaGithub,
  FaDiscord 
} from 'react-icons/fa';

const ProfileCard = ({ profile }: { profile: Profile }) => (
  <div className="w-full max-w-xl mx-auto bg-background-100 dark:bg-background-900 rounded-2xl shadow-lg border border-border-300 dark:border-border-700 p-4 transition-all duration-300">
    
    {/* Image Swiper */}
    <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-4">
      {profile.user.images?.length > 0 ? (
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          className="w-full h-full"
        >
          {profile.user.images.map((obj, i) => (
            <SwiperSlide key={i}>
              <div className="relative w-full h-full">
                <Image
                  src={obj.image_url}
                  alt={`Photo ${i + 1} of ${profile.user.username}`}
                  fill
                  className="object-cover rounded-xl"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
          No images available
        </div>
      )}
    </div>

    {/* Profile Info */}
    <div className="flex flex-col items-start space-y-2 text-center md:text-left text-gray-500 dark:text-gray-400">
      <h2 className="text-2xl font-bold capitalize">{profile.user.username}</h2>
      <p className="text-sm text-foreground-700 dark:text-foreground-300">{profile.bio}</p>

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

      {/* Interests and Batch */}
      <div className="flex flex-wrap gap-2 mt-2">
        {profile.interests?.map((interest, i) => (
          <Badge
            key={interest + i}
            variant="default"
            className="bg-purple-500 text-white dark:bg-purple-600"
          >
            {interest}
          </Badge>
        ))}



        {profile.batch && (
          <Badge
            variant="default"
            className="bg-orange-500 text-white dark:bg-orange-600"
          >
            Batch: {profile.batch}
          </Badge>
        )}
        {profile.batch && (
          <Badge
            variant="default"
            className="bg-blue-500 text-white dark:bg-blue-600"
          >
            Branch: {profile.branch}
          </Badge>
        )}
      </div>
    </div>
  </div>
);

export default ProfileCard;
