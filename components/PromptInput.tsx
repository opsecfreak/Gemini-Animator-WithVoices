import React from 'react';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  addSpeech: boolean;
  setAddSpeech: (addSpeech: boolean) => void;
  speechScript: string;
  setSpeechScript: (script: string) => void;
  selectedVoice: string;
  setSelectedVoice: (voice: string) => void;
}

const VOICES = [
  { name: "English (US)", code: "en-US" },
  { name: "English (UK)", code: "en-GB" },
  { name: "English (Australia)", code: "en-AU" },
  { name: "Spanish (Spain)", code: "es-ES" },
  { name: "French (France)", code: "fr-FR" },
  { name: "German (Germany)", code: "de-DE" },
  { name: "Japanese (Japan)", code: "ja-JP" },
];

const PromptInput: React.FC<PromptInputProps> = ({
  prompt,
  setPrompt,
  onSubmit,
  isLoading,
  addSpeech,
  setAddSpeech,
  speechScript,
  setSpeechScript,
  selectedVoice,
  setSelectedVoice,
}) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="prompt-input" className="block text-sm font-medium text-gray-400 mb-2">Video Prompt</label>
        <textarea
          id="prompt-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g., A robot exploring a futuristic city at night..."
          className="w-full h-28 p-4 bg-gray-900 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 resize-none placeholder-gray-500"
          disabled={isLoading}
          aria-label="Video Prompt"
        />
      </div>

      <div className="flex items-center">
        <input
          id="add-speech-checkbox"
          type="checkbox"
          checked={addSpeech}
          onChange={(e) => setAddSpeech(e.target.checked)}
          className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="add-speech-checkbox" className="ml-2 block text-sm text-gray-300">
          Add Speech Narration
        </label>
      </div>
      
      {addSpeech && (
        <div className="space-y-4 transition-all duration-500 ease-in-out">
          <div>
            <label htmlFor="voice-select" className="block text-sm font-medium text-gray-400 mb-2">Narration Voice</label>
            <select
              id="voice-select"
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              disabled={isLoading}
              className="w-full p-3 bg-gray-900 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 appearance-none bg-no-repeat bg-right pr-8"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundSize: '1.5em 1.5em',
              }}
              aria-label="Narration Voice"
            >
              {VOICES.map((voice) => (
                <option key={voice.code} value={voice.code} className="bg-gray-800 text-white">
                  {voice.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="speech-script-input" className="block text-sm font-medium text-gray-400 mb-2">Speech Script</label>
            <textarea
              id="speech-script-input"
              value={speechScript}
              onChange={(e) => setSpeechScript(e.target.value)}
              placeholder="Enter the narration for the video..."
              className="w-full h-20 p-4 bg-gray-900 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 resize-none placeholder-gray-500"
              disabled={isLoading}
              aria-label="Speech Script"
            />
          </div>
        </div>
      )}

      <button
        onClick={onSubmit}
        disabled={isLoading || !prompt.trim()}
        className="w-full py-3 px-6 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 transform active:scale-95"
      >
        {isLoading ? 'Generating...' : 'Generate Video'}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
        </svg>
      </button>
    </div>
  );
};

export default PromptInput;