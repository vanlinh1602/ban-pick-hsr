import { useEffect, useRef, useState } from 'react';
import {
  FaExpand,
  FaPause,
  FaPlay,
  FaVolumeMute,
  FaVolumeUp,
} from 'react-icons/fa';

type Props = {
  stream?: MediaStream;
};

const VideoPlayer = ({ stream }: Props) => {
  const [isLive] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (stream) {
      ref.current!.srcObject = stream;
    }
  }, [stream]);

  const handlePlayPause = () => {
    if (ref.current!.paused) {
      ref.current!.play();
    } else {
      ref.current!.pause();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolume = () => {
    ref.current!.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    ref.current!.requestFullscreen();
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="relative w-full h-0 pb-[56.25%] bg-black rounded-lg overflow-hidden">
      {stream ? (
        <>
          <video
            className="absolute top-0 left-0 w-full h-full object-cover"
            autoPlay
            controls
            ref={ref}
          >
            Your browser does not support the video tag.
          </video>
          {/* flex -> hidden */}
          <div className="absolute bottom-4 left-4 space-x-2 hidden">
            <button
              className="p-2 bg-white rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Play/Pause"
              onClick={handlePlayPause}
            >
              {isPlaying ? (
                <FaPlay className="text-gray-800" />
              ) : (
                <FaPause className="text-gray-800" />
              )}
            </button>
            <button
              className="p-2 bg-white rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Volume"
              onClick={handleVolume}
            >
              {isMuted ? (
                <FaVolumeUp className="text-gray-800" />
              ) : (
                <FaVolumeMute className="text-gray-800" />
              )}
            </button>
            <button
              className="p-2 bg-white rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Fullscreen"
              onClick={handleFullscreen}
            >
              <FaExpand className="text-gray-800" />
            </button>
          </div>
          {isLive && (
            <div className="absolute top-4 left-4 bg-red-600 text-white px-2 py-1 rounded-md text-sm font-semibold">
              LIVE
            </div>
          )}
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-white px-2 py-1 rounded-md text-sm font-semibold bg-slate-500">
            No stream available
          </p>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
