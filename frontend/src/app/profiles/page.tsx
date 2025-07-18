'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

//you will have to replace this mock array by the array of users that will be fetched from backend. rest need not be changed
const DataUsers = [
  {
    name: 'Alice Verma',
    bio: 'Tech enthusiast and passionate about AI and robotics. Love to code and explore new technologies. I also enjoy painting in my free time and attending hackathons.',
    interests: ['AI', 'Robotics', 'Music', 'Chess'],
    photos: [
      '/images/person.jpg',
      '/images/person2.jpg',
      '/images/ritikab24.png',
    ],
  },
  {
    name: 'Rohan Mehta',
    bio: 'Avid traveler and part-time photographer. I build full-stack web apps in my free time. Interested in game dev too!',
    interests: ['Travel', 'Photography', 'Coding', 'Gaming'],
    photos: [
      'https://source.unsplash.com/random/300x300?boy,1',
      'https://source.unsplash.com/random/300x300?boy,2',
    ],
  },
  {
    name: 'Sara Khan',
    bio: 'I love painting and working on design systems. Currently diving deep into frontend frameworks like React and Vue.',
    interests: ['Art', 'UI/UX', 'React', 'Painting'],
    photos: [
      'https://source.unsplash.com/random/300x300?woman,1',
      'https://source.unsplash.com/random/300x300?woman,2',
      'https://source.unsplash.com/random/300x300?woman,3',
    ],
  },
  {
    name: 'Alice Verma',
    bio: 'Tech enthusiast and passionate about AI and robotics. Love to code and explore new technologies. I also enjoy painting in my free time and attending hackathons.',
    interests: ['AI', 'Robotics', 'Music', 'Chess'],
    photos: [
      '/images/person.jpg',
      '/images/person2.jpg',
      '/images/ritikab24.png',
    ],
  },
  {
    name: 'Rohan Mehta',
    bio: 'Avid traveler and part-time photographer. I build full-stack web apps in my free time. Interested in game dev too!',
    interests: ['Travel', 'Photography', 'Coding', 'Gaming'],
    photos: [
      'https://source.unsplash.com/random/300x300?boy,1',
      'https://source.unsplash.com/random/300x300?boy,2',
    ],
  },
  {
    name: 'Sara Khan',
    bio: 'I love painting and working on design systems. Currently diving deep into frontend frameworks like React and Vue.',
    interests: ['Art', 'UI/UX', 'React', 'Painting'],
    photos: [
      'https://source.unsplash.com/random/300x300?woman,1',
      'https://source.unsplash.com/random/300x300?woman,2',
      'https://source.unsplash.com/random/300x300?woman,3',
    ],
  },
  {
    name: 'Alice Verma',
    bio: 'Tech enthusiast and passionate about AI and robotics. Love to code and explore new technologies. I also enjoy painting in my free time and attending hackathons.',
    interests: ['AI', 'Robotics', 'Music', 'Chess'],
    photos: [
      '/images/person.jpg',
      '/images/person2.jpg',
      '/images/ritikab24.png',
    ],
  },
  {
    name: 'Rohan Mehta',
    bio: 'Avid traveler and part-time photographer. I build full-stack web apps in my free time. Interested in game dev too!',
    interests: ['Travel', 'Photography', 'Coding', 'Gaming'],
    photos: [
      'https://source.unsplash.com/random/300x300?boy,1',
      'https://source.unsplash.com/random/300x300?boy,2',
    ],
  },
  {
    name: 'Sara Khan',
    bio: 'I love painting and working on design systems. Currently diving deep into frontend frameworks like React and Vue.',
    interests: ['Art', 'UI/UX', 'React', 'Painting'],
    photos: [
      'https://source.unsplash.com/random/300x300?woman,1',
      'https://source.unsplash.com/random/300x300?woman,2',
      'https://source.unsplash.com/random/300x300?woman,3',
    ],
  },
  {
    name: 'Alice Verma',
    bio: 'Tech enthusiast and passionate about AI and robotics. Love to code and explore new technologies. I also enjoy painting in my free time and attending hackathons.',
    interests: ['AI', 'Robotics', 'Music', 'Chess'],
    photos: [
      '/images/person.jpg',
      '/images/person2.jpg',
      '/images/ritikab24.png',
    ],
  },
  {
    name: 'Rohan Mehta',
    bio: 'Avid traveler and part-time photographer. I build full-stack web apps in my free time. Interested in game dev too!',
    interests: ['Travel', 'Photography', 'Coding', 'Gaming'],
    photos: [
      'https://source.unsplash.com/random/300x300?boy,1',
      'https://source.unsplash.com/random/300x300?boy,2',
    ],
  },
  {
    name: 'Sara Khan',
    bio: 'I love painting and working on design systems. Currently diving deep into frontend frameworks like React and Vue.',
    interests: ['Art', 'UI/UX', 'React', 'Painting'],
    photos: [
      'https://source.unsplash.com/random/300x300?woman,1',
      'https://source.unsplash.com/random/300x300?woman,2',
      'https://source.unsplash.com/random/300x300?woman,3',
    ],
  },
];

const UserGallery = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white px-4 py-8 transition-colors duration-300">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10">
        <h1 className="text-5xl font-extrabold text-center md:text-left mb-4 md:mb-0 bg-gradient-to-r from-pink-500 via-blue-500 to-cyan-400 bg-clip-text text-transparent animate-gradient">
          Browse Profiles
        </h1>

        <input
          type="text"
          placeholder="Search by name or interest..."
          className="w-full md:w-80 px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {DataUsers.map((user, index) => (
          <div
            key={index}
            className="bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden shadow-md border border-gray-300 dark:border-gray-700 transition-colors p-4"
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Image container (square) */}
              <div className="w-full md:w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                <Swiper
                  modules={[Navigation, Pagination]}
                  navigation
                  pagination={{ clickable: true }}
                  className="w-full h-full"
                >
                  {user.photos.map((photo, i) => (
                    <SwiperSlide key={i}>
                      <img
                        src={photo}
                        alt={`User ${index} Photo ${i}`}
                        className="w-full h-full object-cover"
                        onError={(e) =>
                          ((e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png')
                        }
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {/* Text content */}
              <div className="flex-1 flex flex-col">
                <h2 className="text-xl font-semibold mb-1">{user.name}</h2>
                <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3 mb-3">
                  {user.bio}
                </p>

                <div className="flex flex-wrap gap-2 mt-auto">
                  {user.interests.map((interest, i) => (
                    <span
                      key={i}
                      className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserGallery;