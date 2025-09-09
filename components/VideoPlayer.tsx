import React from 'react';

interface VideoPlayerProps {
  videoUrl: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {
  return (
    <div className="bg-black/50 rounded-2xl overflow-hidden border border-blue-500/30 shadow-lg">
      <video
        src={videoUrl}
        controls
        className="w-full h-auto aspect-video"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;