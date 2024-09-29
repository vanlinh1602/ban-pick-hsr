import { CopyIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Match } from '@/features/match/types';

type Props = {
  match: Match;
  onClose: () => void;
};

const MatchUrlModal = ({ match, onClose }: Props) => {
  const itemRenderer = (item: string) => {
    return (
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input type="text" placeholder="Enter text to copy" value={item} />
        <Button
          size="icon"
          onClick={() => {
            navigator.clipboard.writeText(item);
          }}
          className={'transition-colors'}
        >
          <CopyIcon className="h-4 w-4" />
          <span className="sr-only">Copy to clipboard</span>
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
        <h3 className="text-2xl font-bold mb-4">Match URL</h3>
        <div className="text-start">
          <div className="space-y-2">
            <div className="font-semibold text-sm">Player 1</div>
            {itemRenderer(
              `${window.location.origin}/match/${match.id}?s=${match.players[0]?.id}`,
            )}
            <div className="font-semibold text-sm">Player 2</div>
            {itemRenderer(
              `${window.location.origin}/match/${match.id}?s=${match.players[1]?.id}`,
            )}
            <div className="font-semibold text-sm">Viewer</div>
            {itemRenderer(`${window.location.origin}/match/${match.id}`)}
          </div>
        </div>
        <div className="space-x-5 mt-5">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MatchUrlModal;
