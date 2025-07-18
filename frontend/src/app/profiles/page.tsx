import React from 'react';
import { Profile } from '@/utils/types';
import ProfileCard from '@/components/ProfileCard';

const sampleProfiles: Profile[] = [
  {
    user: {
      username: "ananya_raj",
      email: "ananya@example.com",
      id: 1,
      is_varified: true,
      images: [{ image_url:"https://freshers-intro-images.s3.eu-north-1.amazonaws.com/user-profiles/41/Joker2.jpg" },{ image_url: "https://freshers-intro-images.s3.eu-north-1.amazonaws.com/user-profiles/41/Joker1.jpg" },{ image_url: "https://randomuser.me/api/portraits/women/44.jpg" }]
    },
    bio: "Passionate about AI and robotics. Building autonomous drones in my free time.",
    branch: "Electronics and Communication",
    batch: "2022",
    hostel: "Himalaya",
    hobbies: ["Photography", "Drone Racing"],
    interests: ["AI", "Robotics", "Electronics"],
  },
  {
    user: {
      username: "rahul_yadav",
      email: "rahul@example.com",
      id: 2,
      is_varified: true,
      images: [{ image_url: "https://freshers-intro-images.s3.eu-north-1.amazonaws.com/user-profiles/40/sherlock1.jpg" },{ image_url: "https://freshers-intro-images.s3.eu-north-1.amazonaws.com/user-profiles/40/sherlock2.jpg" },{ image_url: "https://freshers-intro-images.s3.eu-north-1.amazonaws.com/user-profiles/40/sherlock3.jpg" },{ image_url: "https://freshers-intro-images.s3.eu-north-1.amazonaws.com/user-profiles/40/sherlock4.jpg" },{ image_url: "https://freshers-intro-images.s3.eu-north-1.amazonaws.com/user-profiles/40/sherlock5.jpg" }]
    },
    bio: "Backend dev & music lover. I spend nights debugging and playing the guitar.",
    branch: "Computer Science",
    batch: "2023",
    hostel: "Satpura",
    hobbies: ["Guitar", "Coding", "Gaming"],
    interests: ["Web Dev", "Cloud Computing"],
  },
  {
    user: {
      username: "sana_khan",
      email: "sana@example.com",
      id: 3,
      is_varified: false,
      images: [{ image_url: "https://randomuser.me/api/portraits/women/68.jpg" }]
    },
    bio: "Creative soul exploring UI/UX design. Let’s collaborate on cool interfaces!",
    branch: "Information Technology",
    batch: "2024",
    hostel: "Vindhya",
    hobbies: ["Sketching", "UI Design"],
    interests: ["UX Research", "Frontend Dev"],
  },
  {
    user: {
      username: "arjun_patel",
      email: "arjun@example.com",
      id: 4,
      is_varified: true,
      images: [{ image_url: "https://randomuser.me/api/portraits/men/33.jpg" }]
    },
    bio: "ML researcher & chess nerd. Currently working on GANs for image generation.",
    branch: "Mathematics and Computing",
    batch: "2021",
    hostel: "Aravali",
    hobbies: ["Chess", "Blogging"],
    interests: ["ML", "GANs", "Data Science"],
  },
  {
    user: {
      username: "isha_mehra",
      email: "isha@example.com",
      id: 5,
      is_varified: true,
      images: [{ image_url: "https://randomuser.me/api/portraits/women/24.jpg" }]
    },
    bio: "Nature lover and aspiring civil engineer. Let's talk sustainable development 🌱",
    branch: "Civil Engineering",
    batch: "2025",
    hostel: "Shivalik",
    hobbies: ["Hiking", "Photography", "Gardening"],
    interests: ["Sustainability", "Architecture", "GeoTech"],
  }
];





const BrowseProfilesPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-8 transition-colors duration-300">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10">
        <h1 className="text-5xl font-extrabold text-center md:text-left mb-4 md:mb-0 bg-gradient-to-r from-pink-500 via-blue-500 to-cyan-400 bg-clip-text text-transparent animate-gradient">
          Browse Profiles
        </h1>

        <input
          type="text"
          placeholder="Search by name or interest..."
          className="w-full md:w-80 px-4 py-2 rounded-md bg-muted dark:bg-muted-dark text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {sampleProfiles.map((profile, index) => (
          <ProfileCard key={index} profile={profile} index={index} />
        ))}
      </div>
    </div>
  );
};

export default BrowseProfilesPage;
