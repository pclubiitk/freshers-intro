'use client';
import React from 'react';

type ProgressStepperProps = {
  steps: string[];
  currentStep: number;
};

const ProgressStepper: React.FC<ProgressStepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex justify-between items-center mb-8 relative">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className="flex flex-col items-center z-10">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-1 text-sm
                ${index + 1 <= currentStep ? 'bg-indigo-500 text-white' : 'bg-gray-300 text-gray-600'}`}
            >
              {index + 1}
            </div>
            <div
              className={`text-xs text-center font-medium 
                ${index + 1 <= currentStep ? 'text-indigo-500' : 'text-gray-500'}`}
            >
              {step}
            </div>
          </div>

          {index < steps.length - 1 && (
            <div
              className={`flex-grow h-1 mx-2 rounded-full 
                ${index + 1 < currentStep ? 'bg-indigo-500' : 'bg-gray-300'}`}
            ></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ProgressStepper;
