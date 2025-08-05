"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { renderProfiles } from "@/components/ClubMembers";
import { FaArrowRight, FaExternalLinkAlt } from "react-icons/fa";
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

  return (
    <div className="flex flex-col min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <main className="flex-grow px-4 sm:px-6">
        <div className="mx-auto">
<div className="md:flex-row flex-col flex items-center md:pl-[30px] md:pr-[30px] pt-[20px]">
  
              <div className="flex flex-col items-center text-center md:ml-10 md:mb-0 mb-10">
            <div className="mb-4">
              <Image
                src="/images/pclublogo.png"
                alt="Programming Club IITK Logo"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-black dark:text-white bg-clip-text  animate-gradient">
              Welcome Freshers!
            </h1>
            <p className="mt-4 text-gray-700 dark:text-gray-300 text-lg max-w-xl">
              This is your platform to introduce yourself to your batch, explore others’ profiles, and make your mark ✨
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                href="/signup"
                className="px-6 py-3 font-semibold rounded-lg bg-black/10 hover:bg-black/20 dark:hover:bg-white/20 dark:bg-white/10 text-black dark:text-white border border-black/10 dark:border-white/30 animate-gradient hover:brightness-110 transition transition-all no-underline group flex items-center gap-1 pl-6 pr-6 hover:pl-4 hover:pr-8"
              >
                Get Started<span className="absolute right-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                  <FaArrowRight />
                </span>
              </Link>
              <Link
                href="/profiles"
                className="px-6 py-3 font-semibold rounded-lg bg-black/10 hover:bg-black/20 dark:hover:bg-white/20 dark:bg-white/10 text-black dark:text-white border border-black/10 dark:border-white/10 animate-gradient hover:brightness-110 transition transition-all no-underline group flex items-center gap-1 pl-6 pr-6 hover:pl-4 hover:pr-8"
              >
                View Profiles<span className="absolute right-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                  <FaArrowRight />
                </span>
              </Link>
            </div>
                <div className="flex justify-center mt-4">
              <Link
                href="https://chat.whatsapp.com/BYkx1NdoSok3apTAlRc1CE"
                target="_blank"
                className="px-6 py-3 font-semibold rounded-lg bg-black/10 hover:bg-black/20 dark:hover:bg-white/20 dark:bg-white/10 text-black dark:text-white border border-black/10 dark:border-white/10 animate-gradient hover:brightness-110 transition transition-all no-underline group flex items-center gap-1 pl-6 pr-6 hover:pl-4 hover:pr-8"
              >
                Y25 Official WhatsApp Group<span className="absolute right-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                  <FaExternalLinkAlt />
                </span>
              </Link>
            </div>
            </div>
          <div className=" flex flex-1 w-full">
            <div className="flex-1 w-full">
              <div className="aspect-[16/9] rounded-lg overflow-hidden shadow-md justify-center items-center flex">
                <iframe
                id="ytplayer"
                  src="https://www.youtube.com/embed/bYgOm78lcHc?autoplay=1&mute=1&rel=0&loop=1&controls=1&playlist=bYgOm78lcHc"
                  allow="autoplay"
                  allowFullScreen
                  className="w-[90%] h-[90%]"
                ></iframe>
              </div>
            </div>
          </div>

          </div>

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
