import { Player } from '../tournament/type';

export type MatchSetUpInfo = {
  banPickStatus: {
    player: number;
    type: 'ban' | 'pick';
    character?: string;
  }[];
  firstPick: number;
  goFirst: number;
};

export type Match = {
  id: string;
  players: Player[];
  status: 'set-up' | 'ban-pick' | 'playing' | 'finished';
  date?: number;
  tournamentId?: string;
  winner?: number;
  games?: {
    player: number;
    characters: string[];
    points: number;
  }[];
  host?: {
    id: string;
    email?: string;
  };
  matchSetup?: MatchSetUpInfo;
};

export type MatchState = {
  handling: boolean;
  data: CustomObject<Match>;
  liveActions?: {
    banPick?: {
      type: 'ban' | 'pick';
      player: number;
      character: string;
      key: string;
    };
  };
};
