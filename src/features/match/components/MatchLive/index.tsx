import { useEffect, useMemo, useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog-ui';
import { Button } from '@/components/ui/button';
import { selectCharacters } from '@/features/catalogs/store/selectors';
import type { Character } from '@/features/catalogs/types';
import { socket } from '@/services/socket';

import { useMatchSlice } from '../../store';
import { selectMatchData } from '../../store/selectors';
import { MatchGame } from '../../types';
import MatchUrlModal from '../MatchUrlModal';
import { PlayerVideo } from './PlayerVideo';
import { SetupTeams } from './SetupTeams';
import { ViewerVideo } from './ViewerVideo';

type Props = {
  id: string;
};

const MatchLive = ({ id }: Props) => {
  const location = useLocation();
  const { state, search } = location;

  const dispatch = useDispatch();
  const { actions: matchActions } = useMatchSlice();

  const matchDetail = useSelector((s: any) => selectMatchData(s, id));
  const characters = useSelector(selectCharacters);
  const [player, setPlayer] = useState<number>();
  const [gameSetup, setGameSetup] = useState<MatchGame>();
  const [showModal, setShowModal] = useState(false);
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(search);
    const security = params.get('s') || state?.securityId;

    if (security) {
      const findedPlayer = matchDetail.players?.findIndex((p) => {
        return p.id === security;
      });
      if (findedPlayer !== -1) {
        setPlayer(findedPlayer + 1);
      }
    }
  }, [matchDetail]);

  const activeTurn = useMemo(() => {
    if (!matchDetail.games?.length) {
      return matchDetail.matchSetup?.goFirst;
    } else {
      return matchDetail.games[matchDetail.games.length - 1].player === 1
        ? 2
        : 1;
    }
  }, [matchDetail.games]);

  const { playerData, score, disabledChars } = useMemo(() => {
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

    const unAvailableCharacters: string[] = [];
    matchDetail?.matchSetup?.banPickStatus.forEach((status) => {
      const character = characters[status.character!] || {};
      if (status.type === 'ban') {
        mathInfo.playerData[`player${status.player}`].bans.push(character!);
        unAvailableCharacters.push(character.id);
      } else {
        mathInfo.playerData[`player${status.player}`].picks.push(character!);
        if (player !== status.player) {
          unAvailableCharacters.push(character.id);
        }
      }
    });
    matchDetail.games?.forEach((game) => {
      if (game.player === 1) {
        mathInfo.score.player1 += game.points;
      } else if (game.player === 2) {
        mathInfo.score.player2 += game.points;
      }
      if (game.player === player) {
        unAvailableCharacters.push(...game.characters);
      }
    });
    return { ...mathInfo, disabledChars: unAvailableCharacters };
  }, [matchDetail?.matchSetup?.banPickStatus, matchDetail.games]);

  const handleSendGameSetup = () => {
    if (gameSetup) {
      const gameUpdate = [...(matchDetail.games || []), gameSetup];
      dispatch(
        matchActions.modifyMatch({
          id,
          patch: ['games'],
          data: gameUpdate,
        }),
      );
      socket.emit('syncMatch', { room: id, match: { id, games: gameUpdate } });
    }
  };

  return (
    <>
      {showModal ? (
        <MatchUrlModal
          match={matchDetail}
          onClose={() => setShowModal(false)}
        />
      ) : null}
      {showSetup ? (
        <SetupTeams
          data={gameSetup}
          disabledChars={disabledChars}
          onSubmit={(setup: MatchGame) => {
            setGameSetup({
              ...setup,
              player: player!,
            });
            setShowSetup(false);
          }}
          onClose={() => setShowSetup(false)}
        />
      ) : null}
      <div className="flex flex-col md:flex-row h-full bg-gray-100">
        {/* Left Column - Video Player */}
        <div className="md:w-2/3 p-4">
          {player && activeTurn !== player ? (
            <PlayerVideo room={id} />
          ) : (
            <ViewerVideo room={id} isLive={matchDetail.isLive} />
          )}
        </div>
        {/* Right Column - Match Information */}
        <div className="md:w-1/3 p-4">
          <div className="bg-white rounded-lg shadow-md p-6 mb-2">
            <h3 className="text-2xl text-gray-800 mb-2 font-bold flex justify-center items-center">
              Match Result
              <FaInfoCircle
                className="inline-block text-blue-700 text-lg ml-2"
                onClick={() =>
                  setShowModal((prev) => {
                    return !prev;
                  })
                }
              />
            </h3>
            <div className="flex justify-between items-center mb-2 border-b-2  pb-2">
              <div className="text-center w-5/12 flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-blue-600">
                  {matchDetail.players[0].name}
                </h3>
                <p className="text-3xl font-bold">{score.player1}</p>
              </div>
              <div className="text-2xl font-bold text-gray-600">vs</div>
              <div className="text-center w-5/12 flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-red-600">
                  {matchDetail.players[1].name}
                </h3>
                <p className="text-3xl font-bold">{score.player2}</p>
              </div>
            </div>
            <div className="flex justify-between items-center mb-2">
              <div className="text-center w-5/12 flex justify-center">
                {playerData.player1.bans.map((char) => {
                  return (
                    <img
                      key={char.id}
                      src={char.icon}
                      alt={char.name}
                      className="w-8 h-8 rounded-full"
                    />
                  );
                })}
              </div>
              <div className="text-base font-bold text-red-400 w-2/12">Ban</div>
              <div className="text-center w-5/12 flex justify-center">
                {playerData.player2.bans.map((char) => {
                  return (
                    <img
                      key={char.id}
                      src={char.icon}
                      alt={char.name}
                      className="w-8 h-8 rounded-full"
                    />
                  );
                })}
              </div>
            </div>
            <div className="flex justify-between items-center ">
              <div className="text-center w-5/12 flex justify-center">
                {playerData.player1.picks.map((char) => {
                  return (
                    <img
                      key={char.id}
                      src={char.icon}
                      alt={char.name}
                      className="w-8 h-8 rounded-full"
                    />
                  );
                })}
              </div>
              <div className="text-base font-bold text-blue-400 w-2/12">
                Pick
              </div>
              <div className="text-center w-5/12 flex justify-center">
                {playerData.player2.picks.map((char) => {
                  return (
                    <img
                      key={char.id}
                      src={char.icon}
                      alt={char.name}
                      className="w-8 h-8 rounded-full"
                    />
                  );
                })}
              </div>
            </div>
          </div>

          <div className="text-end text-blue-600 font-semibold cursor-pointer mb-2">
            {activeTurn === player ? (
              <div className="space-x-2">
                <Button onClick={() => setShowSetup(true)}>Set up teams</Button>
                <AlertDialog>
                  <AlertDialogTrigger>
                    <Button className="bg-green-600">Send set up</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will store and send
                        your set up to the server.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleSendGameSetup}>
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ) : null}
          </div>
          {matchDetail.games?.map((game, index) => {
            const playerInfo = matchDetail.players[game.player - 1];
            return (
              <div
                key={`game-${index}`}
                className="bg-white rounded-lg shadow-md p-6 mb-2"
              >
                <div className="flex justify-between border-b-2 ">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    Game {index + 1}
                  </h3>
                  <h3
                    className={`text-lg font-semibold mb-2
                    ${game.player === 1 ? 'text-blue-600' : 'text-red-600'}`}
                  >
                    {playerInfo.name}
                  </h3>
                </div>
                <div className="flex justify-around items-center">
                  <div className="grid grid-cols-4 gap-5">
                    {game.characters.map((char, charIndex) => {
                      const character = characters[char];
                      return (
                        <img
                          key={charIndex}
                          src={character?.icon}
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
    </>
  );
};

export default MatchLive;
