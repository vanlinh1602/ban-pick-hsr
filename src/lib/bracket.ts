import { Match } from '@/features/match/types';
import { Player } from '@/features/tournament/type';

type BracketType = 'single' | 'double';

const generateSingleBracket = (players: Player[]): Match[][] => {
  const newRounds: Match[][] = [];
  let currentRound = players.map((player) => ({ ...player, score: 0 }));
  while (currentRound.length > 1) {
    const matches: Match[] = [];
    for (let i = 0; i < currentRound.length; i += 2) {
      if (i + 1 < currentRound.length) {
        matches.push({
          id: Date.now().toString() + i,
          players: [currentRound[i], currentRound[i + 1]],
          status: 'set-up',
        });
      } else {
        matches.push({
          id: Date.now().toString() + i,
          players: [currentRound[i]],
          status: 'set-up',
        });
      }
    }
    newRounds.push(matches);
    currentRound = matches.map((match) => ({
      ...match.players[0],
      score: 0,
    }));
  }
  return newRounds;
};

const generateDoubleBracket = (_players: Player[]): Match[][] => {
  return [];
};

export const generateBracket = (
  type: BracketType,
  players: Player[],
): Match[][] => {
  if (type === 'single') {
    return generateSingleBracket(players);
  }
  if (type === 'double') {
    return generateDoubleBracket(players);
  }
  return [];
};
