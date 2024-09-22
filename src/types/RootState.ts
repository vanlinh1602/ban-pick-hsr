import type { CatalogState } from '@/features/catalogs/types';
import type { MatchState } from '@/features/match/types';

export type RootState = {
  matchStore: MatchState;
  catalogStore: CatalogState;
};
