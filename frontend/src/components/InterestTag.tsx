'use client';
import React from 'react';

type InterestTagProps = {
  text: string;
  removable?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
  disabled?: boolean;
};

const InterestTag: React.FC<InterestTagProps> = ({
  text,
  removable = false,
  onRemove,
  onClick,
  disabled = false,
}) => {
  return (
    <div>
      <div
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium cursor-pointer transition
          ${disabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-indigo-500 text-white hover:bg-indigo-600'}`}
        onClick={!disabled ? onClick : undefined}
      >
        {text}
        {removable && (
          <button
            type="button"
            onClick={onRemove}
            className="ml-1 text-white hover:text-red-300 focus:outline-none"
          >
            ×
          </button>
        )}
      </div>
      <br />
    </div>
  );
};

export default InterestTag;
