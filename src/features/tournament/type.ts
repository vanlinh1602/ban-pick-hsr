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
  rounds?: {
    round: string;
    matches: string[];
  }[];
};

export type TournamentState = {
  handling: boolean;
  data: CustomObject<Tournament>;
};
