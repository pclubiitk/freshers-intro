// 'use client'
// import React from 'react';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Pagination } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// import { Profile } from '@/utils/types';
// import { Badge } from './ui/badge';
// import Image from 'next/image';

// const ProfileCard = ({ profile}: { profile: Profile}) => (
//   <div className="flex flex-col gap-2 bg-background-100 dark:bg-background-900 rounded-lg overflow-hidden shadow-md border border-border-300 dark:border-border-700 transition-colors p-4">
//     <div className="flex flex-col md:flex-row gap-4">
//       <div className="w-full md:w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
//         <Swiper
//           modules={[Navigation, Pagination]}
//           navigation
//           pagination={{ clickable: true }}
//           className="w-full h-full"
//         >
//           {profile.user.images.map((obj, i) => (
//             <SwiperSlide key={i}>
//               <Image
//                 src={obj.image_url}
//                 alt={`Photo ${i}`}
//                 className="w-full h-full object-cover"
//                 fill
//               />
//             </SwiperSlide>
//           ))}

//         </Swiper>
//       </div>

//       <div className="flex-1 flex flex-col">
//         <h2 className="text-xl font-semibold mb-1">{profile.user.username}</h2>
//         <p className="text-foreground-700 dark:text-foreground-300 text-sm line-clamp-3 mb-3">
//           {profile.bio}
//         </p>
//       </div>
//     </div>
    
//     <div>
//       <div className="flex flex-wrap gap-2 mt-auto">
//         {profile.interests?.map((interest, i) => (
//           <Badge
//             key={i}
//             variant="default"
//             className="bg-purple-500 text-white dark:bg-purple-600"
//           >
//             {interest}
//           </Badge>
//         ))}
//       </div>
//       <Badge
//         variant="default"
//         className="bg-orange-500 text-white dark:bg-orange-600"
//       >
//         {profile.batch}
//       </Badge>
//     </div>
//   </div>
// );

// export default ProfileCard
// 'use client';
// import React from 'react';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Pagination } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// import { Profile } from '@/utils/types';
// import { Badge } from './ui/badge';
// import Image from 'next/image';

// const ProfileCard = ({ profile }: { profile: Profile }) => (
//   <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl mx-auto flex flex-col gap-4 bg-background-100 dark:bg-background-900 rounded-2xl overflow-hidden shadow-lg border border-border-300 dark:border-border-700 transition-colors p-4 sm:p-6">
    
//     <div className="flex flex-col sm:flex-row gap-4">
//       <div className="w-full sm:w-30 aspect-square relative rounded-xl overflow-hidden">
//         <Swiper
//           modules={[Navigation, Pagination]}
//           navigation
//           pagination={{ clickable: true }}
//           className="w-full h-full"
//         >
//           {profile.user.images.map((obj, i) => (
//             <SwiperSlide key={i}>
//               <Image
//                 src={obj.image_url}
//                 alt={`Photo ${i}`}
//                 fill
//                 className="object-cover"
//                 sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
//                 priority={i === 0}
//               />
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>

//       <div className="flex-1 flex flex-col">
//         <h2 className="text-xl sm:text-2xl font-semibold mb-1">{profile.user.username}</h2>
//         <p className="text-foreground-700 dark:text-foreground-300 text-sm sm:text-base line-clamp-3 mb-3">
//           {profile.bio}
//         </p>
//       </div>
//     </div>

//     <div className="flex flex-wrap items-center gap-2">
//       {profile.interests?.map((interest, i) => (
//         <Badge
//           key={i}
//           variant="default"
//           className="bg-purple-500 text-white dark:bg-purple-600 text-xs sm:text-sm"
//         >
//           {interest}
//         </Badge>
//       ))}
//       <Badge
//         variant="default"
//         className="bg-orange-500 text-white dark:bg-orange-600 ml-auto text-xs sm:text-sm"
//       >
//         {profile.batch}
//       </Badge>
//     </div>
//   </div>
// );

// export default ProfileCard;
// 'use client';
// import React from 'react';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Pagination } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// import { Profile } from '@/utils/types';
// import { Badge } from './ui/badge';
// import Image from 'next/image';

// const ProfileCard = ({ profile }: { profile: Profile }) => (
//   <div className="flex flex-col gap-4 bg-background-100 dark:bg-background-900 rounded-2xl shadow-md border border-border-300 dark:border-border-700 p-4 w-full max-w-md mx-auto md:max-w-lg lg:max-w-xl xl:max-w-2xl transition-all">
    
//     {/* Top Section: Image + Basic Info */}
//     <div className="flex flex-col md:flex-row gap-4">
      
//       {/* Image Swiper */}
//       <div className="w-full md:w-40 h-40 relative flex-shrink-0">
//         <Swiper
//           modules={[Navigation, Pagination]}
//           navigation
//           pagination={{ clickable: true }}
//           className="w-full h-full rounded-lg overflow-hidden"
//         >
//           {profile.user.images.map((obj, i) => (
//             <SwiperSlide key={i}>
//               <div className="relative w-full h-40">
//                 <Image
//                   src={obj.image_url}
//                   alt={`Photo ${i}`}
//                   className="object-cover"
//                   fill
//                   sizes="(max-width: 768px) 100vw, 160px"
//                 />
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>

//       {/* Profile Text Info */}
//       <div className="flex-1 flex flex-col justify-between">
//         <div>
//           <h2 className="text-xl font-bold mb-1 text-foreground-900 dark:text-foreground-100">
//             {profile.user.username}
//           </h2>
//           <p className="text-foreground-700 dark:text-foreground-300 text-sm md:text-base line-clamp-3">
//             {profile.bio}
//           </p>
//         </div>
//         <div className="mt-3 hidden md:block">
//           <Badge
//             variant="default"
//             className="bg-orange-500 text-white dark:bg-orange-600"
//           >
//             Batch {profile.batch}
//           </Badge>
//         </div>
//       </div>
//     </div>

//     {/* Bottom Section: Tags */}
//     <div className="flex flex-wrap gap-2 justify-start">
//       {profile.interests?.map((interest, i) => (
//         <Badge
//           key={i}
//           variant="default"
//           className="bg-purple-500 text-white dark:bg-purple-600"
//         >
//           {interest}
//         </Badge>
//       ))}
//       <span className="block md:hidden mt-2">
//         <Badge
//           variant="default"
//           className="bg-orange-500 text-white dark:bg-orange-600"
//         >
//           Batch {profile.batch}
//         </Badge>
//       </span>
//     </div>
//   </div>
// );

// export default ProfileCard;
// 'use client'
// import React from 'react';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Pagination } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// import { Profile } from '@/utils/types';
// import { Badge } from './ui/badge';
// import Image from 'next/image';

// const ProfileCard = ({ profile }: { profile: Profile }) => (
//   <div className="w-full max-w-md mx-auto bg-background-100 dark:bg-background-900 rounded-2xl shadow-lg border border-border-300 dark:border-border-700 p-4 transition-all duration-300">
    
//     {/* Image Swiper */}
//     <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-4">
//       <Swiper
//         modules={[Navigation, Pagination]}
//         navigation
//         pagination={{ clickable: true }}
//         className="w-full h-full"
//       >
//         {profile.user.images.map((obj, i) => (
//           <SwiperSlide key={i}>
//             <Image
//               src={obj.image_url}
//               alt={`Photo ${i}`}
//               className="object-cover"
//               fill
//               sizes="(max-width: 768px) 100vw, 400px"
//             />
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>

//     {/* Text Info */}
//     <div className="flex flex-col items-start space-y-2 text-center md:text-left">
//       <h2 className="text-2xl font-bold capitalize">{profile.user.username}</h2>
//       <p className="text-sm text-foreground-700 dark:text-foreground-300">{profile.bio}</p>

//       {/* Interests */}
//       <div className="flex flex-wrap gap-2">
//         {profile.interests?.map((interest, i) => (
//           <Badge
//             key={i}
//             variant="default"
//             className="bg-purple-500 text-white dark:bg-purple-600"
//           >
//             {interest}
//           </Badge>
//         ))}
//         <Badge
//           variant="default"
//           className="bg-orange-500 text-white dark:bg-orange-600"
//         >
//           Batch {profile.batch}
//         </Badge>
//       </div>
//     </div>
//   </div>
// );

// export default ProfileCard;
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
