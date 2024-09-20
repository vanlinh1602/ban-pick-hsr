import { useMemo, useState } from 'react';
import { FaExpand, FaPlay, FaVolumeUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';

import characters from '@/data/character.json';

import { selectMatchData } from '../../store/selectors';
import { Character } from '../../types';

type Props = {
  id: string;
};

const MatchLive = ({ id }: Props) => {
  const [isLive] = useState(true);
  const [score] = useState({ team1: 0, team2: 0 });
  const [currentTime] = useState(new Date());
  const matchDetail = useSelector((state: any) => selectMatchData(state, id));

  const lineups = {
    team1: [
      { name: 'Player1', role: 'Top' },
      { name: 'Player2', role: 'Jungle' },
      { name: 'Player3', role: 'Mid' },
      { name: 'Player4', role: 'ADC' },
      { name: 'Player5', role: 'Support' },
    ],
    team2: [
      { name: 'Player6', role: 'Top' },
      { name: 'Player7', role: 'Jungle' },
      { name: 'Player8', role: 'Mid' },
      { name: 'Player9', role: 'ADC' },
      { name: 'Player10', role: 'Support' },
    ],
  };

  const { playerData } = useMemo(() => {
    const mathInfo: {
      playerData: CustomObject<{
        bans: Character[];
        picks: Character[];
      }>;
    } = {
      playerData: {
        player1: { bans: [], picks: [] },
        player2: { bans: [], picks: [] },
      },
    };
    matchDetail.matchSetup?.banPickStatus.forEach((status) => {
      const character = characters.find((char) => {
        return char.entry_page_id === status.character;
      });
      if (status.type === 'ban') {
        mathInfo.playerData[`player${status.player}`].bans.push(character!);
      } else {
        mathInfo.playerData[`player${status.player}`].picks.push(character!);
      }
    });
    return mathInfo;
  }, [matchDetail.matchSetup?.banPickStatus]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Left Column - Video Player */}
      <div className="md:w-2/3 p-4">
        <div className="relative w-full h-0 pb-[56.25%] bg-black rounded-lg overflow-hidden">
          <video
            className="absolute top-0 left-0 w-full h-full object-cover"
            src="https://example.com/live-stream.mp4"
            controls
          >
            Your browser does not support the video tag.
          </video>
          <div className="absolute bottom-4 left-4 flex space-x-2">
            <button
              className="p-2 bg-white rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Play/Pause"
            >
              <FaPlay className="text-gray-800" />
            </button>
            <button
              className="p-2 bg-white rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Volume"
            >
              <FaVolumeUp className="text-gray-800" />
            </button>
            <button
              className="p-2 bg-white rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Fullscreen"
            >
              <FaExpand className="text-gray-800" />
            </button>
          </div>
          {isLive && (
            <div className="absolute top-4 left-4 bg-red-600 text-white px-2 py-1 rounded-md text-sm font-semibold">
              LIVE
            </div>
          )}
        </div>
      </div>

      {/* Right Column - Match Information */}
      <div className="md:w-1/3 p-4 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <div className="flex justify-between items-center mb-4">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-blue-600">
                {matchDetail.players[0].name}
              </h3>
              <p className="text-3xl font-bold">{score.team1}</p>
            </div>
            <div className="text-2xl font-bold text-gray-600">vs</div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-red-600">
                {matchDetail.players[1].name}
              </h3>
              <p className="text-3xl font-bold">{score.team2}</p>
            </div>
          </div>
          <p className="text-center text-gray-600">
            {} - {currentTime.toLocaleTimeString()}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Bans</h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex space-x-2 mt-1 items-center">
              <div className="font-semibold text-blue-600 w-1/3 text-start">
                {matchDetail.players[0].name} Bans:
              </div>
              {playerData.player1.bans.map((char) => {
                return (
                  <img
                    key={char.entry_page_id}
                    src={char.icon_url}
                    alt={char.name}
                    className="w-8 h-8 rounded-full"
                  />
                );
              })}
            </div>
          </div>
          <div className="flex space-x-2 mt-1 items-center">
            <div className="font-semibold text-red-600 w-1/3 text-start">
              {matchDetail.players[1].name} Bans:
            </div>
            {playerData.player2.bans.map((char) => {
              return (
                <img
                  key={char.entry_page_id}
                  src={char.icon_url}
                  alt={char.name}
                  className="w-8 h-8 rounded-full"
                />
              );
            })}
          </div>
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Picks</h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex space-x-2 mt-1 items-center">
              <div className="font-semibold text-blue-600 w-1/3 text-start">
                {matchDetail.players[0].name} Bans:
              </div>
              {playerData.player1.picks.map((char) => {
                return (
                  <img
                    key={char.entry_page_id}
                    src={char.icon_url}
                    alt={char.name}
                    className="w-8 h-8 rounded-full"
                  />
                );
              })}
            </div>
          </div>
          <div className="flex space-x-2 mt-1 items-center">
            <div className="font-semibold text-red-600 w-1/3 text-start">
              {matchDetail.players[1].name} Bans:
            </div>
            {playerData.player2.picks.map((char) => {
              return (
                <img
                  key={char.entry_page_id}
                  src={char.icon_url}
                  alt={char.name}
                  className="w-8 h-8 rounded-full"
                />
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Team Lineups
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-blue-600 mb-2">
                {matchDetail.players[0].name}
              </h4>
              <ul className="space-y-2">
                {lineups.team1.map((player, index) => (
                  <li key={index} className="flex justify-between">
                    <span className="text-gray-700">{player.name}</span>
                    <span className="text-gray-500">{player.role}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-red-600 mb-2">
                {matchDetail.players[1].name}
              </h4>
              <ul className="space-y-2">
                {lineups.team2.map((player, index) => (
                  <li key={index} className="flex justify-between">
                    <span className="text-gray-700">{player.name}</span>
                    <span className="text-gray-500">{player.role}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchLive;
