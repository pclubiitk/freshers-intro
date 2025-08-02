'use client';

import React, { useState, useRef, useEffect, ChangeEvent, FormEvent, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from 'sonner';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Branches, Hostels } from '@/utils/constants';
import ProgressStepper from '@/components/ProgressStepper';
import InterestTag from '@/components/InterestTag';
import { getImages, addImages, removeKnowledge, clearImages, putImages,  } from '@/utils/indexedDB';
import Image from 'next/image';
import { Knowledge, Profile, User } from '@/utils/types';
import ProfileCard from '@/components/ProfileCard';
import { useAuth } from '@/contexts/AuthContext';
import Loading from '@/components/Loading';
import type { Dispatch, JSX, SetStateAction } from 'react';
import { FaInstagram, FaLinkedin, FaDiscord, FaGithub, FaCode, FaLaptopCode } from 'react-icons/fa';
import { fetchImageAsFileAndPreview } from '@/utils/functions';

const BACKEND_ORIGIN = process.env.NEXT_PUBLIC_BACKEND_ORIGIN;

const SOCIAL_ICONS: Record<string, JSX.Element> = {
  instagram: <FaInstagram className="inline mr-1" />,
  linkedin: <FaLinkedin className="inline mr-1" />,
  discord: <FaDiscord className="inline mr-1" />,
  github: <FaGithub className="inline mr-1" />,
  codeforces: <FaCode className="inline mr-1" />,
  leetcode: <FaCode className="inline mr-1" />,
  atcoder: <FaLaptopCode className="inline mr-1" />,
  hackerrank: <FaLaptopCode className="inline mr-1" />,
};

type FormDataType = {
  bio: string;
  branch: string;
  interests: string[];
  hostel: string;
socials: Record<string, string>;
};

const InitialLoad = async ( setFormData: React.Dispatch<React.SetStateAction<FormDataType>>,
  setInitialProfile: React.Dispatch<React.SetStateAction<Profile>>,
  setImages: Dispatch<SetStateAction<Knowledge[]>>,
 ) => {
  try {
    const res = await fetch(`${BACKEND_ORIGIN}/profile/get-my-profile`, {
      method: 'GET',
      credentials: 'include',
    });
    if (res.status === 404) {
    setImages([]);
    const emptyProfile = {
      bio: "",
      branch: "",
      batch: "",
      interests: [],
      hostel: "",
      socials: {"": ""}
    };
    setFormData(emptyProfile);
    sessionStorage.setItem("updated_profile", JSON.stringify(emptyProfile));
    await putImages([]);
    return;
  }
    

    if (!res.ok) {
      throw new Error(`Failed to fetch profile: ${res.status}`);
    }

    const json = await res.json();

    
    const image_object_array = await Promise.all(
    json.user.images.map(({ id, image_url }: { id: string; image_url: string }) =>
      fetchImageAsFileAndPreview(image_url)
    )
  );

  setImages(image_object_array);

    const profileData = {
      bio: json.bio || '',
      branch: json.branch || '',
      interests: json.interests || [],
      hostel: json.hostel || '',
      socials: json.socials || {},
    }
    setFormData(profileData);
    setInitialProfile(json)
    sessionStorage.setItem("updated_profile", JSON.stringify(profileData));
  await putImages(image_object_array);

  } catch (err) {
    console.error('Initial load error:', err);
  }
};

//thi will fetch existing profile data from the backend and initialize the form state.

const AddIntroPage: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const {isAuthenticated, loading_or_not} = useAuth();
 
  useEffect(() => {
    if (!loading_or_not && !isAuthenticated) {
      router.replace('/login');
    }
  }, [loading_or_not, isAuthenticated, router]);
  
  
  
  
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');
  // const [formData, setFormData] = useState<FormDataType>({
  //   bio: '',
  //   branch: '',
  //   interests: [],
  //   hostel: '',
  // });
    const [formData, setFormData] = useState<FormDataType>({
    bio: '',
    branch: '',
    interests: [],
    hostel: '',
   socials: {
    instagram: '',
    linkedin: '',
    discord: '',
    github: '',
    codeforces: '',
    leetcode: '',
    atcoder: '',
    hackerrank: '',
  },
  });
  const [initialProfile,setInitialProfile] = useState<Profile>({
    user:{ username: '', email: '', id: 0, is_verified: false, images: [] }
  }
)

const [interest, setInterest] = useState<string>('');
const fileInputRef = useRef<HTMLInputElement | null>(null)
const [images, setImages] = useState<Knowledge[]>([]);
const [hasLoaded, setHasLoaded] = useState(false);




useEffect(() => {
  const tryLoad = async () => {
    try {
      await InitialLoad(setFormData, setInitialProfile, setImages);
      const saved = localStorage.getItem('userProfile');
      const initial = localStorage.getItem('initialProfile');
      const step = localStorage.getItem('currentStep');
      const parsedSaved = saved ? JSON.parse(saved) : null;
      const parsedInitial = initial ? JSON.parse(initial) : null;

      if (parsedSaved?.branch && parsedInitial?.user?.username) {
        setFormData(parsedSaved);
        setInitialProfile(parsedInitial);
      } else {
        await InitialLoad(setFormData, setInitialProfile, setImages);
      }
      if (step) setCurrentStep(parseInt(step));
      const stored = await getImages();
      if (stored.length > 0) setImages(stored);
    } catch (err) {
      console.error('Failed to load profile:', err);
      await InitialLoad(setFormData, setInitialProfile, setImages); // fallback
    } finally {
      setHasLoaded(true);
    }
  };

  tryLoad();
}, []);

  
  useEffect(() => {
    if (!hasLoaded) return;
    const timeout = setTimeout(() => {
      localStorage.setItem('userProfile', JSON.stringify(formData));
    }, 400);
    return () => clearTimeout(timeout);
  }, [formData, hasLoaded]);

  useEffect(() => {
    if (!hasLoaded) return;
    localStorage.setItem('currentStep', currentStep.toString());
  }, [currentStep, hasLoaded]);

  useEffect(() => {
    if (!hasLoaded) return;
    localStorage.setItem('initialProfile', JSON.stringify(initialProfile));
  }, [initialProfile, hasLoaded]);

    if (loading_or_not) return <Loading />;
    if (!isAuthenticated) return null;
  
  
  const handleInputChange = (name: keyof FormDataType, value: any) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      return updatedData;
    });
  };




  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const remainingSlots = 5 - images.length;
    const newFiles = files.slice(0, remainingSlots);
    if (!newFiles.length) return;

    const readers = newFiles.map((file) => {
      const reader = new FileReader();
      return new Promise<{ file: File; preview: string }>((resolve) => {
        reader.onloadend = () => resolve({ file, preview: reader.result as string });
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(async (results) => {
        await addImages(results);
        const updatedKnowledge = [...images, ...results];
        setImages(updatedKnowledge);
    });
  };

  const removePhoto = async (index: number) => {
    await removeKnowledge(index);
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
  };

  const handleInterestAdd = (interest: string) => {
    if (!formData.interests.includes(interest)) {
      const updated = {
        ...formData,
        interests: [...formData.interests, interest],
      };
      setFormData(updated);
      toast.success("Interest added");
      localStorage.setItem('userProfile', JSON.stringify(updated));
    }
    setInterest('')
  };

  const handleInterestRemove = (interest: string) => {
    const updated = {
      ...formData,
      interests: formData.interests.filter((i) => i !== interest),
    };
    setFormData(updated);
    localStorage.setItem('userProfile', JSON.stringify(updated));
  };

  const uploadImagesToS3 = async (): Promise<string[]> => {
    const keys: string[] = [];
    for (const {file} of images) {
      try {
        const presignRes = await fetch(`${BACKEND_ORIGIN}/s3/presign?filename=${file.name}&type=${file.type}`, {
          credentials: 'include',
        });

        const { upload_url, fields, key } = await presignRes.json();

        const uploadForm = new FormData();
        Object.entries(fields).forEach(([k, v]) => uploadForm.append(k, v as string));
        uploadForm.append('file', file);

        const uploadRes = await fetch(upload_url, {
          method: 'POST',
          body: uploadForm,
        });

        if (!uploadRes.ok) throw new Error(`Upload failed for ${file.name}`);

        keys.push(key);
        toast.success(`${file.name} uploaded`);
      } catch (err) {
        toast.error(`Error uploading ${file.name}`);
        console.error(err);
        throw err;
      }
    }
    return keys;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      if ( !formData.bio.trim()) {
        throw new Error('Please enter your bio.');
      }
      const uploadedKeys = await uploadImagesToS3();

      // const payload = {
      //   bio: formData.bio,
      //   branch: formData.branch,
      //   hostel: formData.hostel,
      //   interests: formData.interests,
      //   image_keys: uploadedKeys,
      // };
      const payload = {
  bio: formData.bio,
  branch: formData.branch,
  hostel: formData.hostel,
  interests: formData.interests,
  image_keys: uploadedKeys,
  socials: formData.socials,
};


      const res = await fetch(`${BACKEND_ORIGIN}/profile/create-or-update-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
       
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }
      toast.success('Profile submitted successfully!');
      await clearImages();
      setImages([]);
      localStorage.removeItem('userProfile');
      localStorage.removeItem('currentStep');
      router.push('/profiles');
    } catch (err: any) {
      // setSubmitError(err.message || 'Submission failed');
      toast.error(err.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const commonInterests = ['Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Astronomy',
  'Gaming',
  'Esports',
  'Board Games & Puzzles',
  'Cricket',
  'Football',
  'Basketball',
  'Badminton',
  'Table Tennis',
  'Squash',
  'Swimming',
  'Fitness',
  'Yoga',
  'Reading',
  'Poetry',
  'Blogging',
  'Listening Music',
  'Singing',
  'Dancing',
  'Theatre',
  'Stand-up Comedy',
  'Movies',
  'Anime',
  'Photography',
  'Videography',
  'Graphic Design',
  'Drawing',
  'Crafts',
  'Fashion',
  'Cooking',
  'Food Exploring',
  'Travelling',
  'Programming ',
  'Robotics',
  'AI & Machine Learning',
  'Startups & Entrepreneurship',
  'Debating',
  'Volunteering',
  'Environment conservation',
  'Finance & Investing',
  'Self-Improvement',
  'Memes & Internet Culture'];

  const styles = {
    background: theme === 'dark' ? 'bg-black' : 'bg-white',
    textColor: theme === 'dark' ? 'text-white' : 'text-gray-900',
    inputBg: theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50',
    inputBorder: theme === 'dark' ? 'border-gray-700' : 'border-gray-300',
    secondaryText: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
    buttonPrimary: theme === 'dark' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600',
    buttonSecondary: theme === 'dark' ? 'border-indigo-600 text-indigo-400 hover:bg-gray-800' : 'border-indigo-500 text-indigo-500 hover:bg-indigo-50',
  };
const renderStep = () => {
  switch (currentStep) {
    case 1:
      return (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6 w-full">
 <div className="flex-1 space-y-2">
    <h3 className={`text-xl font-semibold ${styles.textColor}`}>Branch</h3>
    <Select
      value={formData?.branch}
      onValueChange={(value) => handleInputChange('branch', value)}
    >
      <SelectTrigger
        className={`w-full p-2 border ${styles.inputBorder} rounded ${styles.inputBg} ${styles.textColor}`}
      >
        <SelectValue placeholder="Select your branch" />
      </SelectTrigger>
      <SelectContent>
        {Branches.map((year) => (
          <SelectItem key={year} value  ={year}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>

  <div className="flex-1 space-y-2">
    <h3 className={`text-xl font-semibold ${styles.textColor}`}>Hostel</h3>
    <Select
      value={formData?.hostel}
      onValueChange={(value) => handleInputChange('hostel', value)}
    >
      <SelectTrigger
        className={`w-full p-2 border ${styles.inputBorder} rounded ${styles.inputBg} ${styles.textColor}`}
      >
        <SelectValue placeholder="Select your hall" />
      </SelectTrigger>
      <SelectContent>
        {Hostels.map((hall) => (
          <SelectItem key={hall} value={hall}>
            {hall}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
</div>



            <h3 className={`text-xl font-semibold ${styles.textColor}`}>Your images</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {images.map((images, index) => (
                <div key={index} className="relative aspect-square rounded overflow-hidden shadow-md">
                  <Image src={images.preview} title={`Preview ${index}`} alt={`Preview ${index}`} fill className="object-cover w-full h-full" />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <label className="flex items-center justify-center aspect-square border-2 border-dashed text-indigo-500 rounded cursor-pointer">
                  <span>+</span>
                  <input type="file" multiple accept="image/*" onChange={handleImageUpload} ref={fileInputRef} className="hidden" />
                </label>
              )}
            </div>
            <p className={`text-sm ${styles.secondaryText}`}>{images.length}/5 photos added</p>
        
          <h3 className={`text-xl font-semibold ${styles.textColor}`}>Social Handles (Optional)</h3>
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
    <span className="">{`${key.charAt(0).toUpperCase()+key.slice(1,)}`}</span>
    <input
      type="text"
      placeholder={`Enter ${key.charAt(0).toUpperCase()+key.slice(1,)} username${key === 'discord' ? ' (e.g. user#0000)' : ''}`}
      value={formData.socials?.[key] || ''}
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          socials: { ...prev.socials, [key]: e.target.value },
        }))
      }
      className={`w-full p-2 border ${styles.inputBorder} rounded ${styles.inputBg} ${styles.textColor}`}
    />
  </div>
))
}
          </div>
        </div>
      );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className={`text-xl font-semibold ${styles.textColor}`}>About You</h3>
            <textarea
              name="bio"
              value={formData?.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Tell us about yourself"
              className={`w-full p-2 h-40 border ${styles.inputBorder} rounded ${styles.inputBg} ${styles.textColor}`}
            />





            <h3 className={`text-xl font-semibold ${styles.textColor}`}>Your Interests</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData?.interests.map((interest) => (
                <InterestTag key={interest} text={interest} onRemove={() => handleInterestRemove(interest)} removable />
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {commonInterests.map((interest) => (
                <InterestTag
                  key={interest}
                  text={interest}
                  onClick={() => handleInterestAdd(interest)}
                  disabled={formData?.interests.includes(interest) || formData?.interests.length >= 5}
                />
              ))}
            </div>
            <div className="flex mt-4 gap-2">
              <input
                type="text"
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                maxLength={20}
                className={`flex-1 p-2 border ${styles.inputBorder} ${styles.inputBg} ${styles.textColor} rounded`}
                placeholder="Add custom interest"
              />
              <p className="text-xs text-gray-500 mt-1">
                {interest.length}/20
              </p>
              <button
                type="button"
                onClick={() => handleInterestAdd(interest)}
                disabled={!interest.trim() || formData?.interests.length >= 5}
                className={`px-4 py-2 ${styles.buttonPrimary} text-white rounded`}
              >
                Add
              </button>
            </div>



          </div>
        );

      case 3:
        return (
          <div className={`space-y-4 ${styles.textColor}`}>
            <h2 className="text-2xl font-bold">Review</h2>
            <p><strong>Branch:</strong> {formData?.branch}</p>
            <p><strong>Bio:</strong> {formData?.bio}</p>
            <p><strong>Hostel:</strong> {formData?.hostel}</p>

            <p><strong>Interests:</strong></p>
            <div className="flex flex-wrap gap-2">
              {formData.interests.map((interest) => (
                <InterestTag key={interest} text={interest} />
              ))}
            </div>
<p><strong>Social Links:</strong></p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {Object.entries(formData.socials)
  .filter(([, value]) => value.trim() !== '')
  .map(([platform, value]) => (
    <p key={platform} className="text-sm text-gray-800 dark:text-gray-200">
      {SOCIAL_ICONS[platform] || null}
      <strong>{platform.charAt(0).toUpperCase() + platform.slice(1)}:</strong> {value}
    </p>
))}

        </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {images.map((images, i) => (
              <div key={i} className="relative w-full h-32 sm:h-36 md:h-40 rounded overflow-hidden">
                <Image
                  src={images.preview}
                  alt={`preview-${i}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
              </div>
            ))}
          </div>
        </div>
      );
    }
  };

  if (!hasLoaded) return <Loading />;

  return (

    <div className={`min-h-screen ${styles.background} lg:fixed lg:inset-0 mt-20 p-6 flex flex-col lg:flex-row gap-10`}>

      <div className='flex h-fit'>
        <ProfileCard profile={initialProfile} />
      </div>

      <div className='overflow-y-auto no-scrollbar mb-20 w-full max-w-6xl mx-auto bg-background-100 dark:bg-background-900 rounded-2xl shadow-lg border border-border-300 dark:border-border-700 dark:border-zinc-500 p-4 transition-all duration-300 items-center'>
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-blue-500 to-cyan-400 mb-6">
          Your Profile
        </h1>
        <div className="w-full max-w-4xl">
          <ProgressStepper steps={['Basic Info', 'About You', 'Confirm']} currentStep={currentStep} />
          <form onSubmit={handleSubmit} className="mt-8 space-y-8">
            {renderStep()}
            {submitError && <p className="text-red-500 text-center">{submitError}</p>}
            <div className="flex justify-between pt-6">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  className={`px-4 py-2 ${styles.buttonSecondary} rounded`}
                  disabled={isSubmitting}
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                className={`px-6 py-2 ${styles.buttonPrimary} text-white rounded ${isSubmitting ? 'opacity-70' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : currentStep === 3 ? 'Submit' : 'Continue'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddIntroPage;
