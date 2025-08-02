import { Profile } from '@/utils/types'
import Image from 'next/image';
import Link from 'next/link'
import React from 'react'
import { FaDiscord, FaGithub, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from "swiper/react";

const ProfileCard = ({ profile }: { profile: Profile }) => {
    return (
        <div
            key={profile.user.id}
            className="group relative mx-4 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gradient-to-tr from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-indigo-500"
        >
            <div className="flex flex-col md:flex-row gap-6 p-6">
                {/* Image Swiper */}
                {/* Image Swiper */}
                <div className="w-full md:w-[158px] h-[158px] flex-shrink-0 rounded-xl overflow-hidden border bg-white dark:bg-gray-800">
                    <Swiper
                        modules={[Pagination]}
                        pagination={{ clickable: true }}
                        className="w-full h-full"
                    >
                        {(profile.user.images.length > 0
                            ? profile.user.images
                            : [{ image_url: "/images/profile-placeholder.jpg" }]
                        ).map((img, i) => (
                            <SwiperSlide key={i} className="h-full w-full">
                                <div className="relative w-full h-full flex items-center justify-center">
                                    <Image
                                        src={img.image_url}
                                        alt="preview"
                                        fill
                                        className="object-contain pointer-events-none"
                                        sizes="(max-width: 768px) 120px, 158px"
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>


                {/* Info Content */}
                <div className="flex-1 flex flex-col justify-between">
                    <div className="flex gap-2 mb-4 relative">
                        <Link
                            href={`/profiles/${encodeURIComponent(profile.user.id.toString())}`}
                        >
                            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 group-hover:text-indigo-600 transition-colors duration-200">

                                {profile.user.username}

                            </h2>
                        </Link>
                        <div className="self-start bg-indigo-600 text-white text-xs px-3 py-1 rounded-full shadow">
                            {profile.user.email.split("@")[0]}
                        </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4 italic">
                        {profile.bio || "No bio provided."}
                    </p>

                    {/* Social Links */}
                    <div className="flex gap-4 mb-4 text-gray-500 dark:text-gray-400">
                        {profile.socials?.discord && (
                            <a
                                href={`https://discord.com/users/${profile.socials.discord}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Discord"
                                className="hover:text-[#5865F2] transition-colors"
                            >
                                <FaDiscord size={20} />
                            </a>
                        )}
                        {profile.socials?.instagram && (
                            <a
                                href={`https://instagram.com/${profile.socials.instagram}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="hover:text-[#E1306C] transition-colors"
                            >
                                <FaInstagram size={20} />
                            </a>
                        )}
                        {profile.socials?.linkedin && (
                            <a
                                href={`https://linkedin.com/in/${profile.socials.linkedin}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                                className="hover:text-[#0077B5] transition-colors"
                            >
                                <FaLinkedinIn size={20} />
                            </a>
                        )}
                        {profile.socials?.github && (
                            <a
                                href={`https://github.com/${profile.socials.github}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="GitHub"
                                className="hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                <FaGithub size={20} />
                            </a>
                        )}
                    </div>

                    {/* Interests */}
                    <div className="flex flex-wrap gap-2">
                        {profile.interests?.length > 0 ? (
                            profile.interests.map((interest, i) => (
                                <span
                                    key={i}
                                    className="inline-block bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-100 text-xs px-3 py-1 rounded-full font-medium shadow-sm"
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

    )
}

export default ProfileCard