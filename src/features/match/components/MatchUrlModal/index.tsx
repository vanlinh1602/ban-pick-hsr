import { CopyIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuCheckCheck } from 'react-icons/lu';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Match } from '@/features/match/types';
import { translations } from '@/locales/translations';

type Props = {
  match: Match;
  onClose: () => void;
};

const MatchUrlModal = ({ match, onClose }: Props) => {
  const [copy, setCopy] = useState<string>();

  const { t } = useTranslation();
  const itemRenderer = (id: string, item: string) => {
    return (
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input type="text" placeholder="Enter text to copy" value={item} />
        <Button
          size="icon"
          onClick={() => {
            navigator.clipboard.writeText(item);
            setCopy(id);
          }}
          className={'transition-colors'}
        >
          {copy === id ? (
            <LuCheckCheck className="h-4 w-4" />
          ) : (
            <CopyIcon className="h-4 w-4" />
          )}
        </Button>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-bold mb-4">{t(translations.matchURL)}</h3>
        <div className="text-start">
          <div className="space-y-2">
            <div className="font-semibold text-sm">
              {t(translations.player)} 1
            </div>
            {itemRenderer(
              'player1',
              `${window.location.origin}/match/${match.id}?s=${match.players[0]?.id}`,
            )}
            <div className="font-semibold text-sm">
              {t(translations.player)} 2
            </div>
            {itemRenderer(
              'player2',
              `${window.location.origin}/match/${match.id}?s=${match.players[1]?.id}`,
            )}
            <div className="font-semibold text-sm">
              {t(translations.viewer)}
            </div>
            {itemRenderer(
              'viewer',
              `${window.location.origin}/match/${match.id}`,
            )}
          </div>
        </div>
        <div className="space-x-5 mt-5">
          <Button variant="secondary" onClick={onClose}>
            {t(translations.actions.close)}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MatchUrlModal;
