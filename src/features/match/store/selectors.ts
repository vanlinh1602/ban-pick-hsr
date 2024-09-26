import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '@/types/RootState';

import { Match } from '../types';
import { initialState } from './reducer';

const selectDomain = (state: RootState) => state?.matchStore || initialState;
const selectPath = (_state: RootState, path: string) => path;

export const selectMatchData = createSelector(
  [selectDomain, selectPath],
  (state, path) => state.data?.[path],
);

export const selectMatchOfTournament = createSelector(
  [selectDomain, selectPath],
  (state, path): CustomObject<Match> => {
    const matches = state.data;
    return Object.keys(matches)
      .filter((key) => matches[key].tournamentId === path)
      .reduce((acc, key) => {
        acc[key] = matches[key];
        return acc;
      }, {} as CustomObject<Match>);
  },
);

export const selectMatchHandling = createSelector(
  selectDomain,
  (state) => state.handling,
);

export const selectLiveActions = createSelector(
  selectDomain,
  (state) => state.liveActions,
);
