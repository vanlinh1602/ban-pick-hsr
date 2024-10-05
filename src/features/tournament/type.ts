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
  organizer: {
    id: string;
    name: string;
  };
  description: string;
  players: Player[];
  format: 'single' | 'double';
  status: 'set-up' | 'start' | 'finished';
  rounds?: CustomObject<string[]>[];
};

export type TournamentState = {
  handling: boolean;
  data: CustomObject<Tournament>;
};
