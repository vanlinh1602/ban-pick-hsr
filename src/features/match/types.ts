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

export type MatchGame = {
  player: number;
  characters: string[];
  lightCones: string[];
  points: number;
};

export type Match = {
  id: string;
  players: Player[];
  status: 'set-up' | 'ban-pick' | 'playing' | 'finished';
  date?: number;
  tournamentId?: string;
  winner?: number;
  winMatch?: string;
  lossMatch?: string;
  games?: MatchGame[];
  host?: {
    id: string;
    email?: string;
  };
  matchSetup?: MatchSetUpInfo;
  isLive?: boolean;
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
