import React from 'react';

interface ProgressBarProps {
  progress: number;
  message: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, message }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center p-6 bg-gray-800/50 rounded-2xl border border-blue-500/30 space-y-4">
      <div className="w-full bg-gray-700 rounded-full h-4">
        <div
          className="bg-gradient-to-r from-blue-500 to-teal-400 h-4 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="w-full flex justify-between items-center">
        <p className="text-sm font-semibold text-gray-300 animate-pulse">
          {message}
        </p>
        <p className="text-sm font-bold text-blue-300">{Math.round(progress)}%</p>
      </div>
      <p className="text-xs text-gray-500 text-center">
        This process can take a few minutes. Please be patient.
      </p>
    </div>
  );
};

export default ProgressBar;
