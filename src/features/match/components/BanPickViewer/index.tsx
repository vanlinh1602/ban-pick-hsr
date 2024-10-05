import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaUserCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux';

import { BanPickCard } from '@/components';
import { selectCharacters } from '@/features/catalogs/store/selectors';
import { startTutorial } from '@/lib/tutorial';
import { translations } from '@/locales/translations';

import { selectLiveActions, selectMatchData } from '../../store/selectors';
import MatchUrlModal from '../MatchUrlModal';

type Props = {
  id: string;
};

type BanPickData = {
  id: string;
  name: string;
  image: string;
};
const BanPickViewer = ({ id }: Props) => {
  const { t } = useTranslation();
  const matchData = useSelector((state: any) => selectMatchData(state, id!));
  const characters = useSelector(selectCharacters);
  const liveActions = useSelector(selectLiveActions);
  const [showModal, setShowModal] = useState(false);
  const [state, setState] = useState<string>();

  useEffect(() => {
    const tutorial = JSON.parse(localStorage.getItem('tutorial') || '{}');
    if (!tutorial.matchViewer) {
      startTutorial('match-viewer')!.drive();
      localStorage.setItem(
        'tutorial',
        JSON.stringify({ ...tutorial, matchViewer: true }),
      );
    }
  }, []);

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

  return (
    <div>
      {showModal ? (
        <MatchUrlModal match={matchData} onClose={() => setShowModal(false)} />
      ) : null}
      <div
        className="font-semibold text-blue-400 underline cursor-pointer w-fit-content mx-auto mt-4"
        onClick={() => setShowModal(true)}
      >
        <div id="match-get-url" className="flex justify-center">
          <span>{t(translations.notify.clickHereToGetLink)}</span>
        </div>
      </div>
      <div
        id="match-live"
        className="flex flex-col md:flex-row justify-center items-stretch bg-gray-100 p-4 pt-0"
      >
        {players.map((player, index) => (
          <div
            key={index}
            className="flex-1 max-w-md mx-2 my-4 bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="bg-primary text-white p-4 flex items-center">
              <FaUserCircle className="text-2xl mr-2" />
              <h2 className="text-xl font-bold">
                {matchData?.players[index]?.name}
              </h2>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">
                {t(translations.bandedCharacter)}
              </h3>
              <div className="grid grid-cols-3 gap-2 mb-4 h-40 w-full">
                {player.ban.map((ban, charIndex) => {
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
                      key={charIndex}
                      state={state === ban.id ? 'banning' : 'idle'}
                      info={info}
                    />
                  );
                })}
              </div>

              <h3 className="text-lg font-semibold mb-2">
                {t(translations.pickedCharacter)}
              </h3>
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
