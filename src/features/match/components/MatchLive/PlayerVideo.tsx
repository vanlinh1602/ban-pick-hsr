import { Device } from 'mediasoup-client';
import { RtpCapabilities } from 'mediasoup-client/lib/RtpParameters';
import { AppData, Transport } from 'mediasoup-client/lib/types';
import { useEffect, useRef, useState } from 'react';
import {
  FaExpand,
  FaPause,
  FaPlay,
  FaVolumeMute,
  FaVolumeUp,
} from 'react-icons/fa';

import { toast } from '@/components/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { socket } from '@/services/socket';

type Props = {
  room: string;
};

const produceParams = {
  // mediasoup params
  encodings: [
    {
      rid: 'r0',
      maxBitrate: 100000,
      scalabilityMode: 'S1T3',
    },
    {
      rid: 'r1',
      maxBitrate: 300000,
      scalabilityMode: 'S1T3',
    },
    {
      rid: 'r2',
      maxBitrate: 900000,
      scalabilityMode: 'S1T3',
    },
  ],
  // https://mediasoup.org/documentation/v3/mediasoup-client/api/#ProducerCodecOptions
  codecOptions: {
    videoGoogleStartBitrate: 1000,
  },
};

export const PlayerVideo = ({ room }: Props) => {
  const [isLive, setIsLive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [transportSave, setTransportSave] = useState<Transport<AppData>>();

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

  const handleLiveStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      ref.current!.srcObject = stream;
      ref.current!.muted = true;
      // get rtpCapabilities from server
      const { rtpCapabilities }: { rtpCapabilities: RtpCapabilities } =
        await new Promise((resolve, reject) => {
          try {
            socket.emit('getRtpCapabilities', (data: any) => {
              resolve(data);
            });
          } catch (error: any) {
            reject(error);
          }
        });

      // create device
      const divice = new Device();
      await divice.load({
        routerRtpCapabilities: rtpCapabilities,
      });

      // create send transport
      const { params }: any = await new Promise((resolve, reject) => {
        try {
          socket.emit(
            'createWebRtcTransport',
            {
              player: true,
              room,
            },
            (data: any) => {
              resolve(data);
            },
          );
        } catch (error: any) {
          reject(error);
        }
      });

      if (params.error) {
        throw new Error(params.error);
      }

      const transport = await divice.createSendTransport(params);
      transport.on('connect', ({ dtlsParameters }, callback, errback) => {
        try {
          socket.emit('transport-connect', {
            dtlsParameters,
            room,
          });
          callback();
        } catch (error: any) {
          errback(error);
        }
      });

      transport.on('produce', (parameters, callback, errback) => {
        try {
          socket.emit(
            'transport-produce',
            {
              kind: parameters.kind,
              rtpParameters: parameters.rtpParameters,
              appData: parameters.appData,
              room,
            },
            ({ id }: any) => {
              callback({ id });
            },
          );
        } catch (error: any) {
          errback(error);
        }
      });

      await Promise.all(
        stream.getTracks().map(async (track) => {
          const producer = await transport.produce({
            track,
            ...(track.kind === 'video' ? produceParams : {}),
          });
          producer.on('transportclose', () => {
            transport.close();
            setIsLive(false);
          });
          producer.on('trackended', () => {
            transport.close();
            setIsLive(false);
          });
        }),
      );

      // sync match status
      setIsLive(true);
      setTransportSave(transport);
      socket.emit('syncMatch', {
        room,
        match: { id: room, isLive: true },
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        description: error.message,
        title: 'Error',
      });
    }
  };

  useEffect(() => {
    return () => {
      if (transportSave) {
        transportSave.close();
      }
    };
  }, [transportSave]);

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
          <Button
            className="ml-2 text-blue-500 hover:underline"
            onClick={handleLiveStream}
          >
            Start live stream
          </Button>
        </div>
      ) : null}
    </div>
  );
};
