import { format } from 'date-fns';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Match } from '@/features/match/types';
import { translations } from '@/locales/translations';

type Props = {
  match: Match;
  onClose: () => void;
};

export const ViewMatch = ({ match, onClose }: Props) => {
  const { t } = useTranslation();
  const playerPoints = useMemo(() => {
    return match.games?.reduce(
      (acc, game) => {
        if (!acc[game.player - 1]) {
          acc[game.player - 1] = 0;
        }
        acc[game.player - 1] += game.points;
        return acc;
      },
      {} as Record<number, number>,
    );
  }, []);
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg max-w-sm w-full cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-bold mb-3">
          {t(translations.matchDetail)}
        </h3>
        <div className="font-semibold ">
          <span className="ml-1 mb-3">
            {format(match.date || Date.now(), 'dd/LL/y')}
          </span>
        </div>
        <div className="flex items-center justify-center text-center">
          <div
            className={`text-3xl font-semibold flex flex-col w-5/12 ${match.winner === 1 ? 'text-green-600' : 'text-gray-700'}`}
          >
            <span>{match.players[0]?.name || 'TBD'}</span>
            <span>{playerPoints?.[0] || '--'}</span>
          </div>
          <span className="text-sm text-gray-500 w-2/12">vs</span>
          <div
            className={`text-3xl font-semibold flex flex-col w-5/12 ${match.winner === 2 ? 'text-green-600' : 'text-gray-700'}`}
          >
            <span>{match.players[1]?.name || 'TBD'}</span>
            <span>{playerPoints?.[1] || '--'}</span>
          </div>
        </div>
        <Button
          className="mt-4 px-4 py-2 text-white rounded  transition-colors"
          onClick={onClose}
        >
          {t(translations.actions.back)}
        </Button>
      </div>
    </div>
  );
};
