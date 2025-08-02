"use client";

import { Branches, Hostels } from "@/utils/constants";


import ImagesInput from "./ImagesInput";
import { Image_Obj, User_Profile_Form } from "@/utils/types";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, } from '@/components/ui/select';

interface Step1BasicInfoProps {
    formData: User_Profile_Form;
    handleInputChange: (name: keyof User_Profile_Form, value: any) => void;
    images: Image_Obj[];
    setImages: React.Dispatch<React.SetStateAction<Image_Obj[]>>;
}

export default function Step_1_BasicInfo({
    formData,
    handleInputChange,
    images,
    setImages
}: Step1BasicInfoProps) {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6 w-full">
                {/* Branch Selection */}
                <div className="flex-1 space-y-2">
                    <h3 className="pointer-events-none select-none outline-none text-xl font-semibold text-gray-900 dark:text-white">
                        Branch
                    </h3>
                    <Select
                        value={formData?.branch}
                        onValueChange={(value) => handleInputChange('branch', value)}
                    >
                        <SelectTrigger className="w-full p-3 border ">
                            <SelectValue placeholder="Select your branch" />
                        </SelectTrigger>
                        <SelectContent>
                            {Branches.map((branch) => (
                                <SelectItem
                                    key={branch}
                                    value={branch}
                                    className="cursor-pointer"
                                >
                                    {branch}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Hostel Selection */}
                <div className="flex-1 space-y-2">
                    <h3 className="pointer-events-none select-none outline-none text-xl font-semibold text-gray-900 dark:text-white">
                        Hostel
                    </h3>
                    <Select
                        value={formData?.hostel}
                        onValueChange={(value) => handleInputChange('hostel', value)}
                    >
                        <SelectTrigger className="w-full p-3 border ">
                            <SelectValue placeholder="Select your hostel" />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                            {Hostels.map((hostel) => (
                                <SelectItem
                                    key={hostel}
                                    value={hostel}
                                    className="cursor-pointer"
                                >
                                    {hostel}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>


            {/* Image Selection */}
            <ImagesInput images={images} setImages={setImages} />



            <h3 className={`text-xl font-semibold`}>Social Handles (Optional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                    'instagram',
                    'linkedin',
                    'discord',
                    'github',
                    'codeforces',
                    'leetcode',
                    'atcoder',
                    'hackerrank',
                ].map((key) => (
                    <div key={key} className="flex flex-col">
                        <span className="">{`${key.charAt(0).toUpperCase() + key.slice(1,)}`}</span>
                        <input
                            type="text"
                            placeholder={`Enter ${key.charAt(0).toUpperCase() + key.slice(1,)} username${key === 'discord' ? ' (e.g. user#0000)' : ''}`}
                            value={formData.socials?.[key] || ''}
                            onChange={(e) => {
                                const defaultSocials = {
                                    instagram: '',
                                    linkedin: '',
                                    discord: '',
                                    github: '',
                                    codeforces: '',
                                    leetcode: '',
                                    atcoder: '',
                                    hackerrank: '',
                                };

                                handleInputChange("socials", { ...defaultSocials, ...formData.socials, [key]: e.target.value })
                            }
                            }
                            className={`w-full p-2 border rounded`}
                        />
                    </div>
                ))
                }
            </div>
        </div>
    );
}

