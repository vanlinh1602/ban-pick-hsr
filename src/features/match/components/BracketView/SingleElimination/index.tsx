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
  isStart?: boolean;
};

const SingleElimination = ({
  rounds,
  allowEdit,
  players,
  onSubmitEdit,
  isStart,
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
          return <div key={generateID()} className="w-full p-4 h-32"></div>;
        }
        return (
          <div
            key={match.id}
            className="overflow-hidden pt-4 pb-4"
            onClick={() => setSelectedMatch({ roundIndex, data: match })}
            tabIndex={0}
            role="button"
          >
            <div className="p-4 flex items-center text-gray-500 rounded-t-lg bg-white w-56 h-12 border-b border-b-black border border-gray-400">
              <span
                className={`font-semibold ${match.winner === 1 ? 'text-green-600' : 'text-gray-700'}`}
              >
                {match.players[0]?.name || 'TBD'}
              </span>
            </div>
            <div className="p-4 flex items-center text-gray-500 rounded-b-lg  bg-white w-56 h-12 shadow-md border border-gray-400">
              <span
                className={`font-semibold ${match.winner === 2 ? 'text-green-600' : 'text-gray-700'}`}
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
              isStart={isStart}
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
      <div className="mx-auto px-4 pb-4 mt-4 max-h-full h-full overflow-y-scroll ">
        <div className="flex flex-row space-y-0 space-x-20 sticky top-0 bg-white">
          {activeRounds.map((_round, index) => (
            <div
              key={`title-round-${index}`}
              className="flex min-w-56 w-56 justify-center text-xl font-semibold bg-[#1e2235] text-white p-1 rounded-lg"
            >
              Round {index + 1}
            </div>
          ))}
        </div>
        <div className="flex flex-1">
          {activeRounds.map((round, roundIndex) => (
            <>
              <div
                key={`round-${roundIndex}`}
                className="flex flex-col items-center justify-around"
              >
                {renderMatches(round.matches, roundIndex)}
              </div>
              {roundIndex !== activeRounds.length - 1 && (
                <div
                  key={`line-${roundIndex}`}
                  className="flex flex-col items-center justify-around min-w-20 w-20"
                >
                  {_.range(0, round.matches.length / 2).map((index) => {
                    const hasMatch1 = _.size(round.matches[2 * index]);
                    const hasMatch2 = _.size(round.matches[2 * index + 1]);
                    return (
                      <div
                        key={`line-${roundIndex}-${index}`}
                        style={{
                          height: 128 * Math.pow(2, roundIndex),
                        }}
                        className="grid grid-cols-2"
                      >
                        <div
                          className={`h-full w-10 ${hasMatch1 ? 'border-r-2 border-t-2' : ''}`}
                        ></div>
                        <div
                          className={`h-full w-10  ${hasMatch1 ? 'border-b-2' : ''}`}
                        ></div>
                        <div
                          className={`h-full w-10 ${hasMatch2 ? 'border-r-2 border-b-2' : ''}`}
                        ></div>
                        <div
                          className={`h-full w-10 ${hasMatch2 ? 'border-t-2' : ''}`}
                        ></div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ))}
        </div>
      </div>
    </>
  );
};

export default SingleElimination;
