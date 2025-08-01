"use client";

import Step_1_BasicInfo from "@/components/profile-form/Step1BasicInfo";
import Step_2_AboutYou from "@/components/profile-form/Step2AboutYou";
import Step_3_Review from "@/components/profile-form/Step3Review";
import ProgressStepper from "@/components/ProgressStepper";
import { fetchImageAsFileAndPreview } from "@/utils/functions";
import { deleteImageDB, getImages, initImgDB, putImages } from "@/utils/indexedDB";
import { Image_Obj, User_Profile_Form } from "@/utils/types";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";


const BACKEND_ORIGIN = process.env.NEXT_PUBLIC_BACKEND_ORIGIN;

const InitialImageOrProfileLoad = async (
  setImages: Dispatch<SetStateAction<Image_Obj[]>>,
  setFormData: Dispatch<SetStateAction<User_Profile_Form>>
) => {
  await initImgDB();

  const res = await fetch(`${BACKEND_ORIGIN}/profile/get-my-profile`, {
    method: "GET",
    credentials: "include",
  });

  if (res.status === 404) {
    setImages([]);
    const emptyProfile = {
      bio: "",
      branch: "",
      batch: "",
      interests: [],
      hostel: "",
    };
    setFormData(emptyProfile);
    sessionStorage.setItem("updated_profile", JSON.stringify(emptyProfile));
    await putImages([]);
    return;
  }

  if (!res.ok) {
    console.error(`Failed to fetch profile: ${res.status}`);
    return;
  }

  const json = await res.json();

  const image_object_array = await Promise.all(
    json.user.images.map(({ id, image_url }: { id: string; image_url: string }) =>
      fetchImageAsFileAndPreview(image_url)
    )
  );

  setImages(image_object_array);

  const profileData = {
    bio: json.bio || "",
    branch: json.branch || "",
    batch: json.batch || "",
    interests: json.interests || [],
    hostel: json.hostel || "",
  };

  setFormData(profileData);
  sessionStorage.setItem("updated_profile", JSON.stringify(profileData));
  await putImages(image_object_array);
};



export default function Page() {
  const router = useRouter();
  const [firstLoad, setFirstLoad] = useState<boolean>(true)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [submitError, setSubmitError] = useState<string>("")
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<User_Profile_Form>({
    bio: "",
    branch: "",
    batch: "",
    interests: [],
    hostel: "",
  });
  const [customInterest, setCustomInterest] = useState<string>("")
  const [images, setImages] = useState<Image_Obj[]>([]);




  // Load from IndexedDB on mount
  useEffect(() => {
    (async () => {
      await initImgDB();
      const storedImages = await getImages();
      const storedProfile = (sessionStorage.getItem("updated_profile"))
      const storedStep = sessionStorage.getItem("step")
      if (!storedImages || !storedProfile || !storedStep) {
        if (!storedImages || !storedProfile) {
          await InitialImageOrProfileLoad(setImages, setFormData)
        }
        if (!storedStep) {
          sessionStorage.setItem("step", "1")
        }
        return;
      }
      setImages(storedImages)
      setFormData(JSON.parse(storedProfile))
      setCurrentStep(Number(storedStep))
      setFirstLoad(false);
    })();
  }, []);

  useEffect(() => {
    if (!firstLoad) {
      sessionStorage.setItem("step", JSON.stringify(currentStep))
    }
  }, [currentStep, firstLoad])
  useEffect(() => {
    if (!firstLoad) {
      sessionStorage.setItem("updated_profile", JSON.stringify(formData))
    }
  }, [formData, firstLoad])


  const handleInputChange = (name: keyof User_Profile_Form, value: any) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      return updatedData;
    });
  };



  const uploadImagesToS3 = async (): Promise<string[]> => {
    const keys: string[] = [];
    for (const { file } of images) {
      try {
        console.log(file)
        const presignRes = await fetch(
          `${BACKEND_ORIGIN}/s3/presign?filename=${file.name}&type=${file.type}`,
          {
            credentials: "include",
          }
        );

        const { upload_url, fields, key } = await presignRes.json();

        const uploadForm = new FormData();
        Object.entries(fields).forEach(([k, v]) =>
          uploadForm.append(k, v as string)
        );
        uploadForm.append("file", file);

        const uploadRes = await fetch(upload_url, {
          method: "POST",
          body: uploadForm,
        });

        if (!uploadRes.ok) throw new Error(`Upload failed for ${file.name}`);

        keys.push(key);
        toast.success(`${file.name} uploaded`);
      } catch (err) {
        // if(err=={"detail":})
        toast.error(`Error uploading ${file.name}`);
        console.error(err);
        throw err;
      }
    }
    return keys;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
      setSubmitError("")
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      if (!formData.bio.trim()) {
        throw new Error("Please enter your bio.");
      }
      const uploadedKeys = await uploadImagesToS3();

      const payload = {
        bio: formData.bio,
        branch: formData.branch,
        hostel: formData.hostel,
        interests: formData.interests,
        image_keys: uploadedKeys,
      };

      const res = await fetch(
        `${BACKEND_ORIGIN}/profile/create-or-update-profile`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }
      toast.success("Profile submitted successfully!");
      sessionStorage.removeItem("userProfile");
      sessionStorage.removeItem("currentStep");
      await deleteImageDB()
      setImages([]);
      router.push("/profiles");
    } catch (err: any) {
      // setSubmitError(err.message || 'Submission failed');
      toast.error(err.message || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };





  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step_1_BasicInfo formData={formData} handleInputChange={handleInputChange} images={images} setImages={setImages} />
      case 2:
        return <Step_2_AboutYou formData={formData}
          handleInputChange={handleInputChange}
          setFormData={setFormData} customInterest={customInterest} setCustomInterest={setCustomInterest} submitError={submitError} setSubmitError={setSubmitError}
        />
      case 3:
        return <Step_3_Review formData={formData} images={images} />
    }
  };


  return (

    <div
      className={`min-h-screen p-6 flex flex-col justify-center lg:flex-row items-center gap-10`}
    >
      {/* <ProfileCard profile={initialProfile} /> */}

      <div className="w-full max-w-6xl mx-auto bg-background-100 dark:bg-background-900 rounded-2xl shadow-lg border border-border-300 dark:border-border-700 p-4 transition-all duration-300 flex flex-col">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-blue-500 to-cyan-400 mb-6">
          Your Profile
        </h1>
        <div className="w-full max-w-3xl ">
          <ProgressStepper
            steps={["Basic Info", "About You", "Confirm"]}
            currentStep={currentStep}
          />
          <form onSubmit={handleSubmit} className="mt-8 space-y-8">
            {renderStep()}
            {submitError !== "" ? (
              <p className="text-red-500 text-center">{submitError}</p>
            ) : null}
            <div className="flex justify-between pt-6">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep((prev) => prev - 1);
                    setSubmitError("");
                  }
                  }
                  className={`px-4 py-2 rounded dark:bg-indigo-600 dark:hover:bg-indigo-700 bg-indigo-500 hover:bg-indigo-600`}
                  disabled={isSubmitting}
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                className={`px-6 py-2 text-white rounded ${isSubmitting ? "opacity-70" : ""} dark:bg-indigo-600 dark:hover:bg-indigo-700 bg-indigo-500 hover:bg-indigo-600`}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Processing..."
                  : currentStep === 3
                    ? "Submit"
                    : "Continue"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

}
