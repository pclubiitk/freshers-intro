"use client";

import { Branches, Hostels } from "@/utils/constants";


import ImagesInput from "./ImagesInput";
import { Image_Obj, User_Profile_Form } from "@/utils/types";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem,} from '@/components/ui/select';

interface FormData {
    branch: string;
    hostel: string;
    [key: string]: any; // for extensibility
}

interface Step1BasicInfoProps {
    formData: FormData;
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

            <p className="text-sm">{images.length}/5 photos added</p>
        </div>
    );
}









// <div className="flex-1 space-y-2">
//     <h3 className={`text-xl font-semibold text-gray-900 dark:text-white`}>Branch</h3>
//     <Select
//       value={formData?.branch}
//       onValueChange={(value) => handleInputChange('branch', value)}
//     >
//       <SelectTrigger
//         className={`w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white`}
//       >
//         <SelectValue placeholder="Select your branch" />
//       </SelectTrigger>
//       <SelectContent>
//         {Branches.map((year) => (
//           <SelectItem key={year} value  ={year}>
//             {year}
//           </SelectItem>
//         ))}
//       </SelectContent>
//     </Select>
//   </div>

//   <div className="flex-1 space-y-2">
//     <h3 className={`text-xl font-semibold text-gray-900 dark:text-white`}>Hostel</h3>
//     <Select
//       value={formData?.hostel}
//       onValueChange={(value) => handleInputChange('hostel', value)}
//     >
//       <SelectTrigger
//         className={`w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white`}
//       >
//         <SelectValue placeholder="Select your hall" />
//       </SelectTrigger>
//       <SelectContent>
//         {Hostels.map((hall) => (
//           <SelectItem key={hall} value={hall}>
//             {hall}
//           </SelectItem>
//         ))}
//       </SelectContent>
//     </Select>
//   </div>
// </div>