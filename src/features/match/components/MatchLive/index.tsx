import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { VideoPlayer } from '@/components';
import characters from '@/data/character.json';

import { selectMatchData } from '../../store/selectors';
import { Character } from '../../types';

type Props = {
  id: string;
};

const MatchLive = ({ id }: Props) => {
  const matchDetail = useSelector((state: any) => selectMatchData(state, id));

  const { playerData, score } = useMemo(() => {
    const mathInfo: {
      playerData: CustomObject<{
        bans: Character[];
        picks: Character[];
      }>;
      score: { player1: number; player2: number };
    } = {
      playerData: {
        player1: { bans: [], picks: [] },
        player2: { bans: [], picks: [] },
      },
      score: { player1: 0, player2: 0 },
    };
    matchDetail?.matchSetup?.banPickStatus.forEach((status) => {
      const character = characters.find((char) => {
        return char.entry_page_id === status.character;
      });
      if (status.type === 'ban') {
        mathInfo.playerData[`player${status.player}`].bans.push(character!);
      } else {
        mathInfo.playerData[`player${status.player}`].picks.push(character!);
      }
    });
    matchDetail.games?.forEach((game) => {
      if (game.player === 1) {
        mathInfo.score.player1 += game.points;
      } else if (game.player === 2) {
        mathInfo.score.player2 += game.points;
      }
    });
    return mathInfo;
  }, [matchDetail?.matchSetup?.banPickStatus]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Left Column - Video Player */}
      <div className="md:w-2/3 p-4">
        <VideoPlayer />
      </div>
      {/* Right Column - Match Information */}
      <div className="md:w-1/3 p-4 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <h3 className="text-2xl text-gray-800 mb-2 font-bold">
            Match Result
          </h3>
          <div className="flex justify-between items-center mb-4">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-blue-600">
                {matchDetail.players[0].name}
              </h3>
              <p className="text-3xl font-bold">{score.player1}</p>
            </div>
            <div className="text-2xl font-bold text-gray-600">vs</div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-red-600">
                {matchDetail.players[1].name}
              </h3>
              <p className="text-3xl font-bold">{score.player2}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <div className="flex items-center border-b-2 pb-2">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 mr-5">
              Bans
            </h3>
            <div className="w-full ">
              <div className="flex space-x-2 mt-1 items-center">
                <div className="font-semibold text-blue-600 text-start">
                  {matchDetail.players[0].name}:
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
              <div className="flex space-x-2 mt-1 items-center">
                <div className="font-semibold text-red-600 text-start">
                  {matchDetail.players[1].name}:
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
            </div>
          </div>
          <div className="flex items-center">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 mr-5">
              Picks
            </h3>
            <div className="w-full ">
              <div className="flex space-x-2 mt-1 items-center">
                <div className="font-semibold text-blue-600 text-start">
                  {matchDetail.players[0].name}:
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
              <div className="flex space-x-2 mt-1 items-center">
                <div className="font-semibold text-red-600 text-start">
                  {matchDetail.players[1].name}:
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
          </div>
        </div>
        {matchDetail.games?.map((game, index) => {
          const player = matchDetail.players[game.player - 1];
          return (
            <div
              key={`game-${index}`}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between border-b-2 ">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  Game {index + 1}
                </h3>
                <h3
                  className={`text-lg font-semibold mb-2
                    ${game.player === 1 ? 'text-blue-600' : 'text-red-600'}`}
                >
                  {player.name}
                </h3>
              </div>
              <div className="flex justify-around items-center">
                <div className="grid grid-cols-4 gap-5">
                  {game.characters.map((char, index) => {
                    const character = characters.find(
                      (item) => item.entry_page_id === char,
                    );
                    return (
                      <img
                        key={index}
                        src={character?.icon_url}
                        alt={character?.name}
                        className="w-10 h-10 rounded"
                      />
                    );
                  })}
                </div>
                <div>
                  <p className="font-semibold text-red-600 text-xl">Point</p>
                  <p className="text-xl font-bold">{game.points}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MatchLive;
