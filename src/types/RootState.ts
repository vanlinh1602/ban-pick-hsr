import type { CatalogState } from '@/features/catalogs/types';
import type { MatchState } from '@/features/match/types';
import type { TournamentState } from '@/features/tournament/type';
import { UserState } from '@/features/user/types';

export type RootState = {
  matchStore: MatchState;
  catalogStore: CatalogState;
  tournamentStore: TournamentState;
  userStore: UserState;
};
