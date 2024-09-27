import { Match } from '@/features/match/types';
import { Player } from '@/features/tournament/type';

import { generateID } from './utils';

type BracketType = 'single' | 'double';

const generateSingleBracket = (players: Player[]): { matches: Match[] }[] => {
  const newRounds: { matches: Match[] }[] = [];
  let currentRound = players.map((player) => ({ ...player, score: 0 }));
  while (currentRound.length > 1) {
    const matches: Match[] = [];
    for (let i = 0; i < currentRound.length; i += 2) {
      if (i + 1 < currentRound.length) {
        matches.push({
          id: generateID(),
          players: [currentRound[i], currentRound[i + 1]],
          status: 'set-up',
        });
      } else {
        matches.push({
          id: generateID(),
          players: [currentRound[i]],
          status: 'set-up',
        });
      }
    }
    newRounds.push({ matches });
    currentRound = matches.map((match) => ({
      ...match.players[0],
      score: 0,
    }));
  }
  return newRounds;
};

const generateDoubleBracket = (
  players: Player[],
): {
  winnersBracket: Match[];
  losersBracket: Match[];
}[] => {
  const data: {
    winnersBracket: Match[];
    losersBracket: Match[];
  }[] = [];
  // Initialize brackets
  let winnersBracket: Player[] = [...players];
  let losersBracket: Player[] = [];
  const eliminated = [];

  let roundNumber = 1;

  while (winnersBracket.length > 1 || losersBracket.length > 1) {
    data[roundNumber - 1] = {
      winnersBracket: [],
      losersBracket: [],
    };

    // Winners bracket
    if (winnersBracket.length > 1) {
      const newWinners = [];
      const newLosers = [];
      for (let i = 0; i < winnersBracket.length; i += 2) {
        if (i + 1 < winnersBracket.length) {
          data[roundNumber - 1].winnersBracket.push({
            id: generateID(),
            players: [winnersBracket[i], winnersBracket[i + 1]],
            status: 'set-up',
          });
          const winner = winnersBracket[i];
          const loser = winnersBracket[i + 1];
          newWinners.push(winner);
          newLosers.push(loser);
        } else {
          newWinners.push(winnersBracket[i]);
        }
      }
      winnersBracket = newWinners;
      losersBracket = [...newLosers, ...losersBracket];
    }

    // Losers bracket
    if (losersBracket.length > 1) {
      const newLosers = [];
      for (let i = 0; i < losersBracket.length; i += 2) {
        if (i + 1 < losersBracket.length) {
          const winner = losersBracket[i];
          const loser = losersBracket[i + 1];
          data[roundNumber - 1].losersBracket.push({
            id: generateID(),
            players: [losersBracket[i], losersBracket[i + 1]],
            status: 'set-up',
          });
          newLosers.push(winner);
          eliminated.push(loser);
        } else {
          newLosers.push(losersBracket[i]);
        }
      }
      losersBracket = newLosers;
    }

    roundNumber++;
  }

  // Grand Final
  if (winnersBracket.length === 1 && losersBracket.length === 1) {
    data[roundNumber - 1] = {
      winnersBracket: [
        {
          id: generateID(),
          players: [winnersBracket[0], losersBracket[0]],
          status: 'set-up',
        },
      ],
      losersBracket: [],
    };
  }
  return data;
};

export const generateBracket = <T extends BracketType>(
  type: T,
  players: Player[],
): T extends 'single'
  ? { matches: Match[] }[]
  : {
      winnersBracket: Match[];
      losersBracket: Match[];
    }[] => {
  switch (type) {
    case 'single':
      return generateSingleBracket(players) as any;
    case 'double':
      return generateDoubleBracket(players) as any;
    default:
      return [];
  }
};
