import { set, union } from 'lodash';
import { DoubleElimination, SingleElimination } from 'tournament-pairings';

import { Match } from '@/features/match/types';
import { Player } from '@/features/tournament/type';

import { generateID } from './utils';

type BracketType = 'single' | 'double';

export class BracketManager {
  public static generateSingleBracket(
    players: Player[],
  ): { matches: Match[] }[] {
    const rounds: Match[][] = [];
    const generate = SingleElimination(players.length, 1);
    generate.forEach((match) => {
      const matchPlayers = [];
      if (match.player1) {
        matchPlayers.push(players[Number(match.player1) - 1]);
      }
      if (match.player2) {
        matchPlayers.push(players[Number(match.player2) - 1]);
      }
      let nextMatch = '';
      if (match.win) {
        nextMatch = `${match.win.round - 1}-${match.win.match - 1}`;
      }
      set(rounds, [match.round - 1, match.match - 1], {
        id: generateID(),
        players: matchPlayers,
        winMatch: nextMatch,
        status: 'set-up',
      });
    });
    return rounds.map((matches) => ({ matches }));
  }

  public static generateDoubleBracket(players: Player[]): {
    winnersBracket: Match[];
    losersBracket: Match[];
  }[] {
    const data: {
      winnersBracket: Match[];
      losersBracket: Match[];
    }[] = [];
    // Initialize brackets
    const generate = DoubleElimination(players.length, 1);
    const temp: {
      win: number[];
      loss: number[];
    } = {
      win: [],
      loss: [],
    };
    const rounds: Match[][] = [];
    generate.forEach((match) => {
      const matchPlayers = [];
      if (match.player1) {
        matchPlayers.push(players[Number(match.player1) - 1]);
      }
      if (match.player2) {
        matchPlayers.push(players[Number(match.player2) - 1]);
      }
      let nextMatch = '';
      if (match.win) {
        temp.win = union(temp.win, [match.win.round - 1]);
        nextMatch = `${match.win.round - 1}-${match.win.match - 1}`;
      }
      let lossMatch = '';
      if (match.loss) {
        temp.loss = union(temp.loss, [match.loss.round - 1]);
        lossMatch = `${match.loss.round - 1}-${match.loss.match - 1}`;
      }
      set(rounds, [match.round - 1, match.match - 1], {
        id: generateID(),
        players: matchPlayers,
        winMatch: nextMatch,
        lossMatch: lossMatch,
        status: 'set-up',
      });
    });

    return data;
  }

  public static generateBracket<T extends BracketType>(
    type: T,
    players: Player[],
  ): T extends 'single'
    ? { matches: Match[] }[]
    : {
        winnersBracket: Match[];
        losersBracket: Match[];
      }[] {
    switch (type) {
      case 'single':
        return this.generateSingleBracket(players) as any;
      case 'double':
        return this.generateDoubleBracket(players) as any;
      default:
        return [];
    }
  }
}
