"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { renderProfiles } from "@/components/ClubMembers";
const ORIGIN = process.env.NEXT_PUBLIC_BACKEND_ORIGIN;
export default function Home() {
  const [secretaries, setSecretaries] = useState([]);
  const [coordinators, setCoordinators] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      const secRes = await fetch(`${ORIGIN}/profile/get-club-members?role=secretary`);
      const coordRes = await fetch(`${ORIGIN}/profile/get-club-members?role=coordinator`);

      if (secRes.ok) setSecretaries(await secRes.json());
      if (coordRes.ok) setCoordinators(await coordRes.json());
    };
    fetchMembers();
  }, []);

  const renderProfileds = (members: any[]) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
      {members.map((member) => (
        <div
          key={member.user.id}
          className="rounded-xl border p-4 flex flex-col items-center bg-white dark:bg-zinc-900 shadow hover:shadow-lg transition"
        >
          <Image
            src={member.user.images?.[0]?.image_url || "/images/profile-placeholder.jpg"}
            alt={member.user.username}
            width={80}
            height={80}
            className="rounded-full object-cover"
          />
          <h3 className="font-bold mt-2">{member.user.username}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{member.club_role}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-white text-black dark:bg-black dark:text-white pt-24">
      <main className="flex-grow px-4 sm:px-6">
        <div className="mx-auto max-w-screen-lg">

          {/* Hero Section */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-4">
              <Image
                src="/images/pclublogo.png"
                alt="Programming Club IITK Logo"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-pink-500 via-blue-500 to-cyan-400 bg-clip-text text-transparent animate-gradient">
              Welcome Freshers!
            </h1>

            <p className="mt-4 text-gray-700 dark:text-gray-300 text-lg max-w-xl">
              This is your platform to introduce yourself to your batch, explore others’ profiles, and make your mark ✨
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                href="/signup"
                className="px-6 py-3 font-semibold rounded-lg bg-gradient-to-r from-pink-500 via-blue-500 to-cyan-400 hover:brightness-110 transition text-white no-underline"
              >
                Get Started
              </Link>
              <Link
                href="/profiles"
                className="px-6 py-3 font-semibold rounded-lg bg-black/10 dark:bg-white/10 border border-black/10 dark:border-white/10 hover:bg-black/20 dark:hover:bg-white/20 hover:text-black hover:dark:text-white transition no-underline"
              >
                View Profiles
              </Link>
            </div>
          </div>

          {/* WhatsApp + Video Section */}
          <div className="mt-16 flex flex-col md:flex-row md:items-center justify-between gap-12">
            <div className="flex-1 flex flex-col items-center gap-4">
              <Link
                href="https://chat.whatsapp.com/BYkx1NdoSok3apTAlRc1CE"
                target="_blank"
                className="px-6 py-3 font-semibold rounded-lg bg-green-500 hover:bg-green-600 no-underline text-white transition w-full md:w-fit text-center"
              >
                Join the Y25 Official WhatsApp Group
              </Link>
              <div className="flex flex-col items-center md:items-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  or scan to join:
                </p>
                <div className="p-4 bg-white dark:bg-zinc-800 rounded-xl shadow-md border border-gray-200 dark:border-zinc-700">
                  <Image
                    src="/whatsappgroupqr.png"
                    alt="Join WhatsApp Group QR"
                    width={160}
                    height={160}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
            <div className="flex-1 w-full">
              <div className="aspect-[16/9] rounded-lg overflow-hidden shadow-md">
                <iframe
                  src="https://drive.google.com/file/d/1lTnSYNlWXjJ3tdVIPHNDS855-7ISxt4T/preview"
                  allow="autoplay"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Club Members */}
          {/* <div className="mt-20">
            <h2 className="text-3xl font-bold mb-4 text-center">Meet the Coordinators</h2>
            {renderProfiles(coordinators)}
          </div>
          <div className="mt-20">
            <h2 className="text-3xl font-bold mb-4 text-center">Meet the Secretaries</h2>
            {renderProfiles(secretaries)}
          </div> */}

      {renderProfiles(secretaries, coordinators)}


        </div>
      </main>

      <footer className="text-center text-sm text-gray-600 dark:text-gray-500 py-6">
        Made by{' '}
        <a
          href="https://pclub.in"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-black dark:hover:text-white"
        >
          Programming Club IITK
        </a>
      </footer>
    </div>
  );
}
