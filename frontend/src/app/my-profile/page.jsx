'use client';

import React, { useState, useRef, useEffect } from 'react';
import ProgressStepper from '@/components/ProgressStepper';
import InterestTag from '@/components/InterestTag';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';

const AddIntroPage = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    interests: [],
    newInterest: '',
    photos: [],
    previews: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // this will load saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('userProfile');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFormData(parsedData);
    }
  }, []);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = 5 - formData.photos.length;
    const newFiles = files.slice(0, remainingSlots);
    if (newFiles.length === 0) return;

    const readers = newFiles.map((file) => {
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onloadend = () => resolve({ file, preview: reader.result });
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((results) => {
      const updatedData = {
        ...formData,
        photos: [...formData.photos, ...results.map((r) => r.file)],
        previews: [...formData.previews, ...results.map((r) => r.preview)],
      };
      setFormData(updatedData);
      localStorage.setItem('userProfile', JSON.stringify(updatedData));
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    localStorage.setItem('userProfile', JSON.stringify(updatedData));
  };

  const handleInterestAdd = (interest) => {
    if (!formData.interests.includes(interest) && formData.interests.length < 5) {
      const updatedData = {
        ...formData,
        interests: [...formData.interests, interest],
        newInterest: '',
      };
      setFormData(updatedData);
      localStorage.setItem('userProfile', JSON.stringify(updatedData));
    }
  };

  const handleInterestRemove = (interestToRemove) => {
    const updatedData = {
      ...formData,
      interests: formData.interests.filter((interest) => interest !== interestToRemove),
    };
    setFormData(updatedData);
    localStorage.setItem('userProfile', JSON.stringify(updatedData));
  };

  const removePhoto = (index) => {
    const updatedData = {
      ...formData,
      photos: formData.photos.filter((_, i) => i !== index),
      previews: formData.previews.filter((_, i) => i !== index),
    };
    setFormData(updatedData);
    localStorage.setItem('userProfile', JSON.stringify(updatedData));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      if (!formData.name.trim() || !formData.bio.trim() || formData.interests.length === 0) {
        throw new Error('Please complete all required fields');
      }

      // Here you would  send data to our backend 
      // await saveProfileToAPI(formData);

      setSubmitSuccess(true);
      setTimeout(() => {
        router.push('/profile');
      }, 1500);
    } catch (error) {
      setSubmitError(error.message || 'Failed to save profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const commonInterests = ['Programming', 'Music', 'Sports', 'Photography', 'Gaming', 'Reading', 'Travel', 'Art', 'Cooking'];

  // these are theme-aware styles
  const styles = {
    background: theme === 'dark' ? 'bg-black' : 'bg-white',
    textColor: theme === 'dark' ? 'text-white' : 'text-gray-900',
    inputBg: theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50',
    inputBorder: theme === 'dark' ? 'border-gray-700' : 'border-gray-300',
    cardBg: theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100',
    errorBg: theme === 'dark' ? 'bg-red-900' : 'bg-red-100',
    errorText: theme === 'dark' ? 'text-red-300' : 'text-red-700',
    successBg: theme === 'dark' ? 'bg-green-900' : 'bg-green-100',
    successText: theme === 'dark' ? 'text-green-300' : 'text-green-700',
    secondaryText: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
    buttonPrimary: theme === 'dark' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600',
    buttonSecondary: theme === 'dark' ? 'border-indigo-600 text-indigo-400 hover:bg-gray-800' : 'border-indigo-500 text-indigo-500 hover:bg-indigo-50',
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className={`text-xl font-semibold mb-2 ${styles.textColor}`}>Name</h3>
            <input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className={`w-full max-w-md p-2 border ${styles.inputBorder} rounded mb-6 ${styles.inputBg} ${styles.textColor}`}
              required
            />

            <h3 className={`text-xl font-semibold mb-2 ${styles.textColor}`}>Your Photos (Max 5)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {formData.previews.map((preview, index) => (
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
                <label className={`flex items-center justify-center aspect-square border-2 border-dashed ${theme === 'dark' ? 'border-indigo-500 text-indigo-400 hover:bg-gray-800' : 'border-indigo-400 text-indigo-500 hover:bg-gray-50'} rounded cursor-pointer`}>
                  <span>+</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    ref={fileInputRef}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <p className={`text-sm ${styles.secondaryText} text-right mt-2`}>{formData.photos.length}/5 photos added</p>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className={`text-xl font-semibold mb-2 ${styles.textColor}`}>About You</h3>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us about yourself..."
              className={`w-full max-w-xl p-2 h-40 border ${styles.inputBorder} rounded mb-4 ${styles.inputBg} ${styles.textColor}`}
              required
            />

            <h3 className={`font-semibold mb-2 ${styles.textColor}`}>Your Interests (Max 5)</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.interests.map((interest) => (
                <InterestTag key={interest} text={interest} removable={true} onRemove={() => handleInterestRemove(interest)} theme={theme} />
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {commonInterests.map((interest) => (
                <InterestTag
                  key={interest}
                  text={interest}
                  onClick={() => handleInterestAdd(interest)}
                  disabled={formData.interests.includes(interest) || formData.interests.length >= 5}
                  theme={theme}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={formData.newInterest}
                onChange={(e) => setFormData((prev) => ({ ...prev, newInterest: e.target.value }))}
                placeholder="Add custom interest"
                className={`flex-1 p-2 border ${styles.inputBorder} ${styles.inputBg} ${styles.textColor} rounded`}
              />
              <button
                type="button"
                disabled={!formData.newInterest.trim() || formData.interests.length >= 5}
                onClick={() => {
                  handleInterestAdd(formData.newInterest.trim());
                }}
                className={`px-4 py-2 ${styles.buttonPrimary} text-white rounded disabled:${theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-300 text-gray-500'}`}
              >
                Add
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className={`space-y-6 ${styles.textColor}`}>
            <h2 className="text-2xl font-bold mb-4">Review Your Information</h2>
            <p className="mb-2"><strong>Name:</strong> {formData.name}</p>
            <p className="mb-2"><strong>Bio:</strong> {formData.bio}</p>
            <p className="font-semibold">Interests:</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.interests.map((interest) => (
                <InterestTag key={interest} text={interest} theme={theme} />
              ))}
            </div>
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Your Photos</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {formData.previews.map((preview, index) => (
                  <img key={index} src={preview} alt={`Preview ${index}`} className={`object-cover w-full aspect-square rounded border ${styles.inputBorder}`} />
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen ${styles.background} p-4 flex flex-col items-center justify-center`}>
      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-blue-500 to-cyan-400 animate-gradient text-center mb-2">
        Your Profile
      </h1>
      {/* <h6 className={`text-center ${styles.secondaryText} text-sm uppercase tracking-wider mb-6`}>Programming Club, IITK</h6> */}

      <div className="w-full max-w-3xl">
        <ProgressStepper steps={['Basic Info', 'About You', 'Confirm']} currentStep={currentStep} theme={theme} />
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          {renderStep()}

          {submitError && (
            <div className={`p-4 ${styles.errorBg} rounded-md`}>
              <p className={`${styles.errorText} text-center`}>{submitError}</p>
            </div>
          )}

          {submitSuccess && (
            <div className={`p-4 ${styles.successBg} rounded-md`}>
              <p className={`${styles.successText} text-center`}>Profile saved successfully! Redirecting...</p>
            </div>
          )}

          <div className="flex justify-between pt-4">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className={`px-4 py-2 ${styles.buttonSecondary} rounded transition-colors`}
                disabled={isSubmitting}
              >
                Back
              </button>
            )}
            <button
              type="submit"
              className={`px-6 py-2 ${styles.buttonPrimary} text-white rounded transition-colors ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : currentStep === 3 ? 'Complete Profile' : 'Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddIntroPage;