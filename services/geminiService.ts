import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

type VideoGenerationConfig = {
  numberOfVideos: number;
  includeAudio?: boolean;
  narration?: {
    text: string;
    voice?: {
      languageCode: string;
    };
  };
};

export const generateVideo = async (
  prompt: string, 
  speechScript?: string, 
  voiceCode?: string,
  onProgress?: (progress: number) => void
): Promise<{ videoUrl: string; transcript?: string }> => {
  
  // 1. Enhance prompt for reliability
  const finalPrompt = speechScript
    ? `${prompt}. The video must be in English and narrated in a clear ${voiceCode} voice with the following script: "${speechScript}"`
    : `${prompt}. The video must be in English.`;

  console.log(`Starting video generation for enhanced prompt: "${finalPrompt}"`);

  // 2. Configure the API call
  const config: VideoGenerationConfig = {
    numberOfVideos: 1,
    includeAudio: true, // Explicitly request an audio track
  };

  if (speechScript && speechScript.trim()) {
    config.narration = { 
      text: speechScript,
      voice: {
        languageCode: voiceCode || 'en-US'
      }
    };
  }

  // 3. Start the generation operation
  let operation = await ai.models.generateVideos({
    model: 'veo-2.0-generate-001',
    prompt: finalPrompt,
    config: config
  });

  console.log("Video generation operation started:", operation.name);

  // 4. Poll for the result with progress updates
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Check every 5 seconds
    console.log("Polling for video generation status...");
    
    try {
        operation = await ai.operations.getVideosOperation({ operation: operation });
        
        // Extract progress percentage from metadata if available
        const progress = (operation.metadata as any)?.progressPercent ?? 0;
        if (onProgress) {
            onProgress(progress);
        }
        console.log(`Operation status: ${operation.done ? 'Done' : 'In Progress'} (${progress}%)`);

    } catch (error) {
        console.error("Error polling for operation status:", error);
        throw new Error("Failed while waiting for video generation to complete.");
    }
  }
  
  // 5. Handle completion
  if (onProgress) onProgress(100); // Set progress to 100% on completion

  if (operation.error) {
    console.error("Video generation operation failed with an error:", operation.error);
    throw new Error(`Video generation failed: ${operation.error.message || 'Unknown error'}`);
  }

  const generatedVideo = operation.response?.generatedVideos?.[0];
  const downloadLink = generatedVideo?.video?.uri;
  
  if (!downloadLink) {
    console.error("No video URI found in the operation response. Full response:", JSON.stringify(operation, null, 2));
    throw new Error("Video generation failed to return a download link. This may be due to safety filters or other restrictions.");
  }
  
  console.log("Video generated successfully. Download link:", downloadLink);

  // 6. Fetch the video file
  const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  if (!videoResponse.ok) {
    console.error("Failed to download video. Status:", videoResponse.status, await videoResponse.text());
    throw new Error(`Failed to download the generated video.`);
  }
  
  const videoBlob = await videoResponse.blob();
  const typedVideoBlob = new Blob([videoBlob], { type: 'video/mp4' });
  const videoUrl = URL.createObjectURL(typedVideoBlob);
  console.log("Video downloaded and blob URL created:", videoUrl);

  // 7. Extract transcript and return
  const transcript = (generatedVideo as any)?.narration?.transcript;
  if (transcript) {
    console.log("Transcript found:", transcript);
  }

  return { videoUrl, transcript };
};
