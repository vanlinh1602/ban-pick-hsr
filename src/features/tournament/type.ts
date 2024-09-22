export type Tournament = {
  id: string;
  name: string;
  date: {
    from: number;
    to?: number;
  };
  organizer: string;
  description: string;
  players: { name: string; email: string }[];
  rounds?: {
    round: string;
    matches: string[];
  }[];
};

export type TournamentState = {
  handling: boolean;
  data: CustomObject<Tournament>;
};
