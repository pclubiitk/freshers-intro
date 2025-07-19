// Converted to TypeScript (TSX)
'use client';

import React, { useState, useRef, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from 'sonner';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem,} from '@/components/ui/select';
import { Branches, Hostels } from '@/utils/constants';
import ProgressStepper from '@/components/ProgressStepper';
import InterestTag from '@/components/InterestTag';
import { addPreviews, getPreviews, clearPreviews, removePreviewByValue } from '@/utils/indexedDB';

const BACKEND_ORIGIN = process.env.NEXT_PUBLIC_BACKEND_ORIGIN;


type FormDataType = {
  bio: string;
  branch: string;
  batch: string;
  interests: string[];
  hobbies: string[];
  hostel: string;
  photos: File[];
};

const AddIntroPage: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [formData, setFormData] = useState<FormDataType>({
    bio: '',
    branch: '',
    batch: '',
    interests: [],
    hobbies: [],
    hostel: '',
    photos: [],
  });

  const [interest, setInterest] = useState<string>('');
  const [hobby, setHobby] = useState<string>('');
  const [previews,setPreviews] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)





  useEffect(() => {
    const savedData = localStorage.getItem('userProfile');
    if (savedData) setFormData(JSON.parse(savedData));
    getPreviews().then((stored) => {
        if (stored.length > 0) setPreviews(stored);
    });
  }, []);





  const handleInputChange = (name: keyof FormDataType, value: any) => {
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    localStorage.setItem('userProfile', JSON.stringify(updatedData));
  };




  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const remainingSlots = 5 - formData.photos.length;
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
        const updated = {
            ...formData,
            photos: [...formData.photos, ...results.map((r) => r.file)],
        };

        const newPreviews = results.map((r) => r.preview);
        setPreviews([...previews, ...newPreviews]);

        await addPreviews(newPreviews);

        setFormData(updated);
        localStorage.setItem('userProfile', JSON.stringify(updated));
    });
  };

  const removePhoto = async (index: number) => {
    const updatedPhotos = formData.photos.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);

    const updated = {
        ...formData,
        photos: updatedPhotos,
    };

    setFormData(updated);
    localStorage.setItem('userProfile', JSON.stringify(updated));
    setPreviews(updatedPreviews);

    // Remove by matching preview string
    const previewToDelete = previews[index];
    await removePreviewByValue(previewToDelete);
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

  const handleHobbyAdd = (hobby: string) => {
    if (!formData.hobbies.includes(hobby)) {
      const updated = {
        ...formData,
        hobbies: [...formData.hobbies, hobby],
      };
      setFormData(updated);
      toast.success("Hobby added");
      localStorage.setItem('userProfile', JSON.stringify(updated));
    }
    setHobby('')
  };

  const handleHobbyRemove = (hobby: string) => {
    const updated = {
      ...formData,
      hobbies: formData.hobbies.filter((i) => i !== hobby),
    };
    setFormData(updated);
    localStorage.setItem('userProfile', JSON.stringify(updated));
  };

  const uploadImagesToS3 = async (): Promise<string[]> => {
    const keys: string[] = [];
    for (const file of formData.photos) {
      try {
        const presignRes = await fetch(`${BACKEND_ORIGIN}/s3/presign?filename=${file.name}`, {
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
      if ( !formData.bio.trim() || formData.interests.length === 0) {
        throw new Error('Please complete all required fields');
      }

      const uploadedKeys = await uploadImagesToS3();

      const payload = {
        bio: formData.bio,
        branch: formData.branch,
        batch: formData.batch,
        hobbies: formData.hobbies,
        hostel: formData.hostel,
        interests: formData.interests,
        image_keys: uploadedKeys,
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
      await clearPreviews();
      setPreviews([]);
      localStorage.clear()
      setTimeout(() => {
        router.push('/profiles')
        setFormData({
          bio: '',
          branch: '',
          batch: '',
          interests: [],
          hobbies: [],
          hostel: '',
          photos: [],
        })
      }, 1500);
    } catch (err: any) {
      setSubmitError(err.message || 'Submission failed');
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const commonInterests = ['Maths', 'Physics', 'Chemistry', 'Gaming', 'Sports', 'Reading', 'Travel', 'Art', 'Cooking'];

  const commonHobbies = ['Programming', 'Cricket', 'badminton' , 'Photography'];


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



            <h3 className={`text-xl font-semibold ${styles.textColor}`}>Batch</h3>
            <Select
              value={formData.batch}
              onValueChange={(value) => {handleInputChange('batch',value)}}
            >
              <SelectTrigger
                className={`w-full p-2 border ${styles.inputBorder} rounded ${styles.inputBg} ${styles.textColor}`}
              >
                <SelectValue placeholder="Select your batch" />
              </SelectTrigger>
              <SelectContent>
                {['Y20', 'Y21', 'Y22', 'Y23', 'Y24', 'Y25'].map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>







            <h3 className={`text-xl font-semibold ${styles.textColor}`}>Branch</h3>
            <Select
              value={formData.branch}
              onValueChange={(value) => {handleInputChange('branch',value)}}
            >
              <SelectTrigger
                className={`w-full p-2 border ${styles.inputBorder} rounded ${styles.inputBg} ${styles.textColor}`}
              >
                <SelectValue placeholder="Select your branch" />
              </SelectTrigger>
              <SelectContent>
                {Branches.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>



            <h3 className={`text-xl font-semibold ${styles.textColor}`}>Hostel</h3>
            <Select
              value={formData.hostel}
              onValueChange={(value) => {handleInputChange('hostel',value)}}
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



            <h3 className={`text-xl font-semibold ${styles.textColor}`}>Upload Photos (max 5)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {previews.map((preview, index) => (
                <div key={index} className="relative aspect-square rounded overflow-hidden shadow-md">
                  <img src={preview} alt={`Preview ${index}`} className="object-cover w-full h-full" />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
              {formData.photos.length < 5 && (
                <label className="flex items-center justify-center aspect-square border-2 border-dashed text-indigo-500 rounded cursor-pointer">
                  <span>+</span>
                  <input type="file" multiple accept="image/*" onChange={handleImageUpload} ref={fileInputRef} className="hidden" />
                </label>
              )}
            </div>
            <p className={`text-sm ${styles.secondaryText}`}>{formData.photos.length}/5 photos added</p>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className={`text-xl font-semibold ${styles.textColor}`}>About You</h3>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Tell us about yourself"
              className={`w-full p-2 h-40 border ${styles.inputBorder} rounded ${styles.inputBg} ${styles.textColor}`}
              required
            />





            <h3 className={`text-xl font-semibold ${styles.textColor}`}>Your Interests</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.interests.map((interest) => (
                <InterestTag key={interest} text={interest} onRemove={() => handleInterestRemove(interest)} removable />
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {commonInterests.map((interest) => (
                <InterestTag
                  key={interest}
                  text={interest}
                  onClick={() => handleInterestAdd(interest)}
                  disabled={formData.interests.includes(interest) || formData.interests.length >= 5}
                />
              ))}
            </div>
            <div className="flex mt-4 gap-2">
              <input
                type="text"
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                className={`flex-1 p-2 border ${styles.inputBorder} ${styles.inputBg} ${styles.textColor} rounded`}
                placeholder="Add custom interest"
              />
              <button
                type="button"
                onClick={() => handleInterestAdd(interest)}
                disabled={!interest.trim() || formData.interests.length >= 5}
                className={`px-4 py-2 ${styles.buttonPrimary} text-white rounded`}
              >
                Add
              </button>
            </div>





            <>
              <h3 className={`text-xl font-semibold ${styles.textColor}`}>Your Hobbies</h3>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.hobbies.map((Hobby) => (
                  <InterestTag key={Hobby} text={Hobby} onRemove={() => handleHobbyRemove(Hobby)} removable />
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {commonHobbies.map((hobby) => (
                  <InterestTag
                    key={hobby}
                    text={hobby}
                    onClick={() => handleHobbyAdd(hobby)}
                    disabled={formData.hobbies.includes(hobby) || formData.hobbies.length >= 5}
                  />
                ))}
              </div>
              <div className="flex mt-4 gap-2">
                <input
                  type="text"
                  value={hobby}
                  onChange={(e) => setHobby(e.target.value)}
                  className={`flex-1 p-2 border ${styles.inputBorder} ${styles.inputBg} ${styles.textColor} rounded`}
                  placeholder="Add custom Hobby"
                />
                <button
                  type="button"
                  onClick={() => handleHobbyAdd(hobby)}
                  disabled={!hobby.trim() || formData.hobbies.length >= 5}
                  className={`px-4 py-2 ${styles.buttonPrimary} text-white rounded`}
                >
                  Add
                </button>
              </div>
            </>
          </div>
        );

      case 3:
        return (
          <div className={`space-y-4 ${styles.textColor}`}>
            <h2 className="text-2xl font-bold">Review</h2>
            <p><strong>Batch:</strong> {formData.batch}</p>
            <p><strong>Branch:</strong> {formData.branch}</p>
            <p><strong>Bio:</strong> {formData.bio}</p>
            <p><strong>Hostel:</strong> {formData.hostel}</p>


            <p><strong>Hobbies:</strong></p>
            <div className="flex flex-wrap gap-2">
              {formData.hobbies.map((hobby) => (
                <InterestTag key={hobby} text={hobby} />
              ))}
            </div>
            <p><strong>Interests:</strong></p>
            <div className="flex flex-wrap gap-2">
              {formData.interests.map((interest) => (
                <InterestTag key={interest} text={interest} />
              ))}
            </div>


            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {previews.map((src, i) => (
                <img key={i} src={src} alt={`preview-${i}`} className="object-cover w-full aspect-square rounded" />
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen ${styles.background} p-6 flex flex-col items-center`}>
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-blue-500 to-cyan-400 mb-6">
        Complete Your Profile
      </h1>
      <div className="w-full max-w-3xl">
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
  );
};

export default AddIntroPage;
