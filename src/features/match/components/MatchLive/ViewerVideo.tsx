import { Device } from 'mediasoup-client';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  FaExpand,
  FaPause,
  FaPlay,
  FaVolumeMute,
  FaVolumeUp,
} from 'react-icons/fa';

import { toast } from '@/components/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { generateID } from '@/lib/utils';
import { socket } from '@/services/socket';

type Props = {
  room: string;
  isLive?: boolean;
};

export const ViewerVideo = ({ room, isLive }: Props) => {
  const [isView, setIsView] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const viewerId = useMemo(() => generateID(), []);

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

  const ref = useRef<HTMLVideoElement>(null);

  const handleViewStream = async () => {
    try {
      const { rtpCapabilities }: any = await new Promise((resolve) => {
        socket.emit('getRtpCapabilities', async (data: any) => {
          resolve(data);
        });
      });

      const device = new Device();
      await device.load({ routerRtpCapabilities: rtpCapabilities });
      const { params }: any = await new Promise((resolve) => {
        socket.emit('createWebRtcTransport', { room, viewerId }, (data: any) =>
          resolve(data),
        );
      });
      if (params.error) {
        throw new Error(params.error);
      }
      const consumerTransport = device.createRecvTransport(params);

      consumerTransport.on(
        'connect',
        ({ dtlsParameters }, callback, errback) => {
          try {
            socket.emit('transport-recv-connect', {
              dtlsParameters,
              room,
              viewerId,
            });
            callback();
          } catch (error: any) {
            errback(error);
          }
        },
      );

      const streamParams: any = await new Promise((resolve) => {
        socket.emit(
          'consume',
          {
            rtpCapabilities: device.rtpCapabilities,
            room,
            viewerId,
          },
          (data: any) => resolve(data),
        );
      });

      if (streamParams.error) {
        throw new Error(params.error);
      }

      const tracks: MediaStreamTrack[] = [];

      await Promise.all(
        Object.values(streamParams).map(async (streamParam: any) => {
          const consumer = await consumerTransport.consume({
            id: streamParam.id,
            producerId: streamParam.producerId,
            kind: streamParam.kind,
            rtpParameters: streamParam.rtpParameters,
          });
          tracks.push(consumer.track);
        }),
      );

      setIsView(true);
      ref.current!.srcObject = new MediaStream(tracks);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        description: error.message,
        title: 'Error',
      });
    }
  };

  useEffect(() => {
    setIsView(false);
    ref.current!.srcObject = null;
  }, [isLive]);

  return (
    <div className="relative w-full h-0 pb-[56.25%] bg-black rounded-lg overflow-hidden">
      <>
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay
          controls={isLive}
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
      {!isLive ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-white text-lg font-semibold">
            The live stream is not available
          </p>
        </div>
      ) : (
        <>
          {!isView && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                className="ml-2 text-blue-500 hover:underline"
                onClick={handleViewStream}
              >
                View live stream
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
