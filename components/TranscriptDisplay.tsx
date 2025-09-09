import React from 'react';

interface TranscriptDisplayProps {
  transcript: string;
}

const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ transcript }) => {
  return (
    <div className="w-full bg-gray-800/50 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6">
      <h3 className="text-lg font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
        Transcript
      </h3>
      <div className="max-h-48 overflow-y-auto p-4 bg-gray-900 rounded-lg border border-gray-700">
        <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
          {transcript}
        </p>
      </div>
    </div>
  );
};

export default TranscriptDisplay;
