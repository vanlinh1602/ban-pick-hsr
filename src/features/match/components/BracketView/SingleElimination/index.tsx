import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';

import { Match } from '@/features/match/types';
import { Player } from '@/features/tournament/type';
import { generateID } from '@/lib/utils';

import { MatchEditorModal } from '../MatchEditorModal';
import { ViewMatch } from '../ViewMatch';

type Props = {
  rounds: { matches: Match[] }[];
  allowEdit?: boolean;
  players?: Player[];
  onSubmitEdit?: (roundIndex: number, data: Match) => void;
};

const SingleElimination = ({
  rounds,
  allowEdit,
  players,
  onSubmitEdit,
}: Props) => {
  const [activeRounds, setActiveRounds] = useState<{ matches: Match[] }[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<{
    roundIndex: number;
    data: Match;
  }>();

  useEffect(() => {
    const paramsRound = _.cloneDeep(rounds);
    const initRounds: { matches: Match[] }[] = [];
    if (paramsRound.length > 1) {
      if (paramsRound[0].matches.length < paramsRound[1].matches.length * 2) {
        const firstRound = paramsRound.shift();
        const arr: any[] = _.range(paramsRound[0].matches.length * 2).map(
          () => ({}),
        );

        firstRound?.matches.forEach((match) => {
          const nextMatch = match?.winMatch!.split('-')[1];
          if (!_.size(_.get(arr, [Number(nextMatch) * 2]))) {
            _.set(arr, [Number(nextMatch) * 2], match);
          } else {
            _.set(arr, [Number(nextMatch) * 2 + 1], match);
          }
        });
        initRounds.push({ matches: arr });
      }
    }
    initRounds.push(...paramsRound);
    setActiveRounds(initRounds);
  }, [rounds]);

  const renderMatches = useCallback(
    (matches: Match[], roundIndex: number) => {
      return matches.map((match) => {
        if (!_.size(match)) {
          return (
            <div key={generateID()} className="w-full p-4">
              <p className="h-7"></p>
            </div>
          );
        }
        return (
          <div
            key={match.id}
            className="relative p-4 mb-4 bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
            onClick={() => setSelectedMatch({ roundIndex, data: match })}
            tabIndex={0}
            role="button"
          >
            <div className="flex items-center h-7">
              <span
                className={`font-semibold w-5/12 ${match.winner === 1 ? 'text-green-600' : 'text-gray-700'}`}
              >
                {match.players[0]?.name || 'TBD'}
              </span>
              <span className="text-sm text-gray-500 w-2/12">vs</span>
              <span
                className={`font-semibold w-5/12 ${match.winner === 2 ? 'text-green-600' : 'text-gray-700'}`}
              >
                {match.players[1]?.name || 'TBD'}
              </span>
            </div>
          </div>
        );
      });
    },
    [setSelectedMatch],
  );

  return (
    <>
      {selectedMatch ? (
        <>
          {allowEdit ? (
            <MatchEditorModal
              match={selectedMatch.data}
              onClose={() => setSelectedMatch(undefined)}
              allPlayers={players || []}
              onSubmit={(match) => {
                onSubmitEdit?.(selectedMatch.roundIndex, match);
              }}
            />
          ) : (
            <ViewMatch
              match={selectedMatch.data}
              onClose={() => setSelectedMatch(undefined)}
            />
          )}
        </>
      ) : null}
      <div className="container mx-auto p-4 max-h-full h-full ">
        <div className="flex flex-col md:flex-row  space-y-8 md:space-y-0 md:space-x-4">
          {activeRounds.map((_round, index) => (
            <div
              key={index}
              className="flex w-52 justify-center text-xl font-semibold bg-[#1e2235] text-white p-1 rounded-lg"
            >
              Round {index + 1}
            </div>
          ))}
        </div>
        <div className="w-full overflow-scroll h-full">
          <div className="flex flex-row space-y-0 space-x-4">
            {activeRounds.map((round, index) => (
              <div key={index} className="flex flex-col justify-around w-52">
                {renderMatches(round.matches, index)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleElimination;
