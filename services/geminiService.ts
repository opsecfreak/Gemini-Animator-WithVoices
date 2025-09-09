import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define a more specific type for the video generation config
type VideoGenerationConfig = {
  numberOfVideos: number;
  narration?: {
    text: string;
    voice?: {
      languageCode: string;
    };
  };
};

export const generateVideo = async (prompt: string, speechScript?: string, voiceCode?: string): Promise<string> => {
  console.log(`Starting video generation for prompt: "${prompt}"`);
  if (speechScript) {
    console.log(`With speech script: "${speechScript}" and voice: "${voiceCode}"`);
  }

  const config: VideoGenerationConfig = {
    numberOfVideos: 1,
  };

  if (speechScript && speechScript.trim()) {
    config.narration = { 
      text: speechScript,
      voice: {
        languageCode: voiceCode || 'en-US' // Use selected voice or default to en-US
      }
    };
  }

  let operation = await ai.models.generateVideos({
    model: 'veo-2.0-generate-001',
    prompt: prompt,
    config: config
  });

  console.log("Video generation operation started:", operation.name);

  // Poll for the result
  while (!operation.done) {
    // Wait for 10 seconds before checking the status again
    await new Promise(resolve => setTimeout(resolve, 10000));
    console.log("Polling for video generation status...");
    try {
        // Fix: Pass the entire operation object to get the latest status.
        operation = await ai.operations.getVideosOperation({ operation: operation });
    } catch (error) {
        console.error("Error polling for operation status:", error);
        throw new Error("Failed while waiting for video generation to complete.");
    }
    console.log(`Operation status: ${operation.done ? 'Done' : 'In Progress'}`);
  }
  
  // After polling, check if the operation resulted in an error
  if (operation.error) {
    console.error("Video generation operation failed with an error:", operation.error);
    throw new Error(`Video generation failed: ${operation.error.message || 'Unknown error'}`);
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  
  if (!downloadLink) {
    console.error("No video URI found in the operation response. Full response:", JSON.stringify(operation, null, 2));
    throw new Error("Video generation failed to return a download link. This may be due to safety filters or other restrictions.");
  }
  
  console.log("Video generated successfully. Download link:", downloadLink);

  // Fetch the video file
  const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  if (!videoResponse.ok) {
    throw new Error(`Failed to download the generated video. Status: ${videoResponse.status}`);
  }
  
  const videoBlob = await videoResponse.blob();
  
  // Create a local URL for the blob to be used in the <video> tag
  const videoUrl = URL.createObjectURL(videoBlob);
  
  console.log("Video downloaded and blob URL created:", videoUrl);
  return videoUrl;
};
