export type Player = {
  id: string;
  name: string;
  email: string;
};

export type Tournament = {
  id: string;
  name: string;
  date: {
    from: number;
    to?: number;
  };
  organizer: string;
  description: string;
  players: Player[];
  format: 'single' | 'double';
  rounds?:
    | {
        matches: string[];
      }[]
    | {
        winnersBracket: string[];
        losersBracket: string[];
      }[];
};

export type TournamentState = {
  handling: boolean;
  data: CustomObject<Tournament>;
};
