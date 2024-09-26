import { useEffect, useMemo, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux';

import { BanPickCard } from '@/components';
import { selectCharacters } from '@/features/catalogs/store/selectors';

import { selectLiveActions, selectMatchData } from '../../store/selectors';

type Props = {
  id: string;
};

type BanPickData = {
  id: string;
  name: string;
  image: string;
};
const BanPickViewer = ({ id }: Props) => {
  const matchData = useSelector((state: any) => selectMatchData(state, id!));
  const characters = useSelector(selectCharacters);
  const liveActions = useSelector(selectLiveActions);
  const [state, setState] = useState<string>();

  const players = useMemo(() => {
    const tmp: CustomObject<{
      ban: BanPickData[];
      pick: BanPickData[];
    }> = {
      player1: { ban: [], pick: [] },
      player2: { ban: [], pick: [] },
    };
    let flag = false;
    matchData?.matchSetup?.banPickStatus.forEach((status, index) => {
      const player = status.player === 1 ? 'player1' : 'player2';
      const character = characters[status.character || ''];
      if (status.type === 'ban') {
        tmp[player].ban.push({
          id: `ban-${index}`,
          name: character?.name || 'Unknown',
          image: character?.icon || '',
        });
      } else {
        tmp[player].pick.push({
          id: `pick-${index}`,
          name: character?.name || 'Unknown',
          image: character?.icon || '',
        });
      }
      if (!flag && !status.character) {
        flag = true;
        setState(`${status.type}-${index}`);
      }
    });
    return [tmp.player1, tmp.player2];
  }, [matchData]);

  useEffect(() => {
    if (liveActions?.banPick) {
      setState(liveActions.banPick.key);
    }
  }, [liveActions?.banPick]);

  return (
    <div>
      {/* <h2 className="max-w-4xl mx-auto p-6 bg-slate-300 rounded-lg shadow-lg m-5 text-2xl font-semibold">
        Ban Pick Viewer
      </h2> */}
      <div className="flex flex-col md:flex-row justify-center items-stretch bg-gray-100 p-4">
        {players.map((player, index) => (
          <div
            key={index}
            className="flex-1 max-w-md mx-2 my-4 bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="bg-blue-600 text-white p-4 flex items-center">
              <FaUserCircle className="text-2xl mr-2" />
              <h2 className="text-xl font-bold">
                {matchData?.players[index]?.name}
              </h2>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">Banned Characters</h3>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {player.ban.map((ban, index) => {
                  let info = ban;
                  if (ban.id === liveActions?.banPick?.key) {
                    const char = characters[liveActions.banPick.character];
                    info = {
                      id: ban.id,
                      name: char?.name || 'Unknown',
                      image: char?.icon || '',
                    };
                  }
                  return (
                    <BanPickCard
                      key={index}
                      state={state === ban.id ? 'banning' : 'idle'}
                      info={info}
                    />
                  );
                })}
              </div>

              <h3 className="text-lg font-semibold mb-2">Selected Character</h3>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {player.pick.map((pick, charIndex) => {
                  let info = pick;
                  if (pick.id === liveActions?.banPick?.key) {
                    const char = characters[liveActions.banPick.character];
                    info = {
                      id: pick.id,
                      name: char?.name || 'Unknown',
                      image: char?.icon || '',
                    };
                  }
                  return (
                    <BanPickCard
                      key={charIndex}
                      state={state === info.id ? 'selecting' : 'idle'}
                      info={info}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BanPickViewer;
