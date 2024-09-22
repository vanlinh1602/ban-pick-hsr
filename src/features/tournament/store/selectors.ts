import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '@/types/RootState';

import { initialState } from './reducer';

const selectDomain = (state: RootState) =>
  state?.tournamentStore || initialState;

const selectPath = (_state: RootState, path: string) => path;

export const selectTournamentHandling = createSelector(
  [selectDomain],
  (state) => state.handling,
);

export const selectTournaments = createSelector(
  [selectDomain],
  (state) => state.data,
);

export const selectTournamentData = createSelector(
  [selectDomain, selectPath],
  (state, path) => state.data?.[path],
);
