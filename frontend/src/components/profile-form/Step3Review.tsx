import { Image_Obj, User_Profile_Form } from "@/utils/types";
import InterestTag from "../InterestTag";
import Image from "next/image";

interface Step3Review {
    formData: User_Profile_Form;
    images: Image_Obj[];

}

export default function Step_3_Review(
    {
        formData,
        images
    }: Step3Review
) {
    return (
        <div className={`space-y-4`}>
            <h2 className="text-2xl font-bold">Review</h2>
            <p>
                <strong>Branch:</strong> {formData?.branch}
            </p>
            <p>
                <strong>Bio:</strong> {formData?.bio}
            </p>
            <p>
                <strong>Hostel:</strong> {formData?.hostel}
            </p>

            <p>
                <strong>Interests:</strong>
            </p>
            <div className="flex flex-wrap gap-2">
                {formData.interests.map((interest) => (
                    <InterestTag key={interest} text={interest} />
                ))}
            </div>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {images.map((image, i) => (
                    <div
                        key={image.preview + i}
                        className="relative w-[100px] h-[100px] rounded-2xl overflow-hidden border"
                        draggable
                    >
                        <Image
                            src={image.preview}
                            alt="preview"
                            fill
                            className="object-contain pointer-events-none"
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}