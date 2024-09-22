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
  players: { name: string; id: string }[];
  status: 'ban-pick' | 'playing' | 'finished';
  date?: number;
  winner?: string;
  games?: {
    player: number;
    characters: string[];
    points: number;
  }[];
  matchSetup?: MatchSetUpInfo;
};

export type MatchState = {
  handling: boolean;
  data: CustomObject<Match>;
};
