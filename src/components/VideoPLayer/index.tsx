import { useEffect, useRef, useState } from 'react';
import {
  FaExpand,
  FaPause,
  FaPlay,
  FaVolumeMute,
  FaVolumeUp,
} from 'react-icons/fa';

import { socket } from '@/services/socket';
import formatError from '@/utils/formatError';

import { toast } from '../hooks/use-toast';
import { Button } from '../ui/button';

const configuration = {
  iceServers: [
    {
      urls: 'turn:openreplay.metered.ca:443',
      username: 'openreplayproject',
      credential: 'openreplayproject',
    },
  ],
};

type Props = {
  room: string;
  isPlayer?: boolean;
};

const VideoPlayer = ({ room, isPlayer }: Props) => {
  const [isLive, setIsLive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  const connection = useRef<RTCPeerConnection | null>(null);
  const ref = useRef<HTMLVideoElement>(null);

  const handleLiveStream = () => {
    navigator.mediaDevices
      .getDisplayMedia({ video: true, audio: true })
      .then((stream) => {
        ref.current!.srcObject = stream;
        ref.current!.muted = true;
        setIsLive(true);
        const initConnection = new RTCPeerConnection(configuration);
        initConnection.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit('ice-candidate', { room, data: event.candidate });
          }
        };

        stream.getTracks().forEach((track) => {
          initConnection!.addTrack(track, stream);
          track.onended = () => {
            setIsLive(false);
            ref.current!.srcObject = null;
            initConnection!.close();
            socket.emit('end-stream', { room });
          };
        });

        initConnection
          .createOffer()
          .then((offer) => {
            initConnection!.setLocalDescription(offer);
            //Sending the offer to the server
            socket.emit('offer', { room, data: offer });
          })
          .catch((error) =>
            toast({
              description: formatError(error),
              title: 'Error',
              variant: 'destructive',
            }),
          );
        connection.current = initConnection;
      });
  };

  useEffect(() => {
    socket.on('ice-candidate', ({ data }) => {
      const candidate = new RTCIceCandidate(data);
      connection.current!.addIceCandidate(candidate).catch((err) =>
        toast({
          description: formatError(err),
          title: 'Error',
          variant: 'destructive',
        }),
      );
    });

    socket.on('answer', ({ answer }) => {
      connection.current!.setRemoteDescription(answer).catch((err) =>
        toast({
          description: formatError(err),
          title: 'Error',
          variant: 'destructive',
        }),
      );
    });

    socket.on('end-stream', () => {
      setIsLive(false);
      ref.current!.srcObject = null;
      connection.current!.close();
    });

    socket.on('offer', ({ data }) => {
      const offerConnect = new RTCPeerConnection(configuration);
      offerConnect.onicecandidate = (e) => {
        if (e.candidate) {
          //when it receives the ice candidate, it sends the ice candidate to the server
          socket.emit('ice-candidate', { room, data: e.candidate });
        }
      };
      setIsLive(true);
      offerConnect.ontrack = (event) => {
        ref.current!.srcObject = event.streams[0];
        ref.current?.play();
      };

      offerConnect.setRemoteDescription(data);
      offerConnect
        .createAnswer()
        .then((answer) => {
          offerConnect!.setLocalDescription(answer);
          //Sending the answer to the server
          socket.emit('answer', { room, answer });
        })
        .catch((error) =>
          toast({
            description: formatError(error),
            title: 'Error',
            variant: 'destructive',
          }),
        );
      connection.current = offerConnect;
    });
  }, []);

  return (
    <div className="relative w-full h-0 pb-[56.25%] bg-black rounded-lg overflow-hidden">
      <>
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay
          controls={!isPlayer}
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
          {isPlayer ? (
            <Button
              className="ml-2 text-blue-500 hover:underline"
              onClick={handleLiveStream}
            >
              Start live stream
            </Button>
          ) : (
            <p className="text-white px-2 py-1 rounded-md text-sm font-semibold bg-slate-500">
              No stream available
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default VideoPlayer;
