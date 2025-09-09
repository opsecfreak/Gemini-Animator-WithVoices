import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import VideoPlayer from './components/VideoPlayer';
import ProgressBar from './components/ProgressBar';
import TranscriptDisplay from './components/TranscriptDisplay';
import { generateVideo } from './services/geminiService';

const LOADING_MESSAGES = [
  "Warming up the digital director...",
  "Scouting virtual locations...",
  "Casting silicon actors...",
  "Recording narration...",
  "Compositing scenes frame by frame...",
  "Rendering high-fidelity graphics...",
  "Applying visual effects...",
  "Syncing audio and video...",
  "Finalizing the digital masterpiece...",
];

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('An animation of someone in a datacenter talking about how security is essential for activities.');
  const [speechScript, setSpeechScript] = useState<string>('Security is not just a feature, it\'s the foundation of everything we build in the modern datacenter.');
  const [addSpeech, setAddSpeech] = useState<boolean>(true);
  const [selectedVoice, setSelectedVoice] = useState<string>('en-US');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setLoadingMessage(LOADING_MESSAGES[0]);
      let messageIndex = 0;
      interval = setInterval(() => {
        messageIndex = (messageIndex + 1) % LOADING_MESSAGES.length;
        setLoadingMessage(LOADING_MESSAGES[messageIndex]);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleGenerateVideo = useCallback(async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setVideoUrl(null);
    setTranscript(null);
    setProgress(0);

    try {
      const script = addSpeech ? speechScript : undefined;
      const { videoUrl: url, transcript: newTranscript } = await generateVideo(
        prompt,
        script,
        selectedVoice,
        (p) => setProgress(p)
      );
      setVideoUrl(url);
      if (newTranscript) {
        setTranscript(newTranscript);
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, isLoading, addSpeech, speechScript, selectedVoice]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <Header />
      <main className="w-full max-w-4xl flex-grow flex flex-col items-center justify-center container mx-auto px-4">
        <div className="w-full bg-gray-800/50 backdrop-blur-sm border border-blue-500/30 rounded-2xl shadow-2xl shadow-blue-500/10 p-6 md:p-8 space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
            Describe the Video You Want to Create
          </h2>
          <PromptInput
            prompt={prompt}
            setPrompt={setPrompt}
            onSubmit={handleGenerateVideo}
            isLoading={isLoading}
            addSpeech={addSpeech}
            setAddSpeech={setAddSpeech}
            speechScript={speechScript}
            setSpeechScript={setSpeechScript}
            selectedVoice={selectedVoice}
            setSelectedVoice={setSelectedVoice}
          />
          {error && <div className="text-center text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</div>}
        </div>
        
        <div className="w-full max-w-4xl mt-8">
          {isLoading && <ProgressBar progress={progress} message={loadingMessage} />}
          {videoUrl && !isLoading && (
            <div className="space-y-6">
              <VideoPlayer videoUrl={videoUrl} />
              <a
                href={videoUrl}
                download="ai-generated-video.mp4"
                className="w-full py-3 px-6 text-lg font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all duration-300 flex items-center justify-center gap-2 transform active:scale-95"
                aria-label="Download generated video"
              >
                Download Video
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
              {transcript && <TranscriptDisplay transcript={transcript} />}
            </div>
          )}
        </div>
      </main>
      <footer className="w-full max-w-4xl text-center text-gray-500 text-sm py-4">
        Powered by Gemini. Video generation may take several minutes.
      </footer>
    </div>
  );
};

export default App;