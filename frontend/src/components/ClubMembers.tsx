'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Profile } from '@/utils/types';
import ProfileCard from './ProfileCard';
import Image from 'next/image';
import Link from 'next/link';

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
      <h2 className="text-3xl font-semibold mb-4 text-center capitalize text-neutral-900 dark:text-white">
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
          780: {slidesPerView: 3},
          1440: {slidesPerView: 4}
        }}
        className="rounded-xl shadow-md"
      >
        {profiles.map((profile) => (
          <SwiperSlide key={profile.user.id}>
            <ProfileCard profile={profile} number_of_interests={2}/>
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
