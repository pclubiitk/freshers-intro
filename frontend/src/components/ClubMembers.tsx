'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Profile } from '@/utils/types';
import Image from 'next/image';
import Link from 'next/link';
function ProfileCard({ profile }: { profile: Profile }) {
  const { user, branch, batch } = profile;
  const imageUrl = user.images[0]?.image_url || '/default-avatar.png';

  return (
    <div
      key={profile.user.id}
      className="group relative bg-gray-100 mx-auto dark:bg-gray-900 rounded-lg overflow-hidden shadow-md border border-gray-300 dark:border-gray-700 transition-all p-4 hover:shadow-lg hover:border-indigo-500 max-w-lg min-h-[15rem]"
    >
          <Link
            href={`/profiles/${encodeURIComponent(profile.user.id.toString())}`}
            className="absolute inset-0 z-10"
          />

          <div className="flex flex-col sm:flex-row gap-4 relative z-0 min-h-[15rem]">
            <div className="w-full sm:w-40 aspect-square flex-shrink-0 rounded-lg overflow-hidden">
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                className="w-full h-full"
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
                      className="w-full h-full object-cover"  // Ensures image fills container
                      onError={(e) =>
                        ((e.target as HTMLImageElement).src = '/images/profile-placeholder.jpg')
                      }
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>


        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex justify-between items-start gap-2 flex-wrap">
            <h2 className="text-lg font-semibold group-hover:text-indigo-600 transition-colors truncate">
              {profile.user.username}
            </h2>
            <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full break-all">
              {profile.user.email.split('@')[0]}
            </span>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm mt-2 line-clamp-3">
            {profile.bio || 'No bio provided.'}
          </p>
          <div className="flex flex-wrap gap-2 mt-auto pt-2">
            {profile.interests?.length ? (
              profile.interests.slice(0,2).map((interest, i) => (
                <span
                  key={i}
                  className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full"
                >
                  {interest}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-500">No interests listed.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfileSection({ role, profiles }: { role: string; profiles: Profile[] }) {
  if (!profiles || profiles.length === 0) return null;

  const title =
    role === 'secretary'
      ? 'Secretaries'
      : role === 'coordinator'
      ? 'Coordinators'
      : 'Members';

  return (
    <section className="py-6 px-4">
      <h2 className="text-2xl font-semibold mb-4 text-center capitalize text-neutral-900 dark:text-white">
        Meet the {title}
      </h2>
      <Swiper
        modules={[Navigation, Pagination]}
        slidesPerView={1}
        spaceBetween={20}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="rounded-xl shadow-md"
      >
        {profiles.map((profile) => (
          <SwiperSlide key={profile.user.id}>
            <ProfileCard profile={profile} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}


export function renderProfiles(secretaries: Profile[], coordinators: Profile[]) {
  return (
    <div className="space-y-16">
      <ProfileSection role="coordinator" profiles={coordinators} />
      <ProfileSection role="secretary" profiles={secretaries} />
    </div>
  );
}
