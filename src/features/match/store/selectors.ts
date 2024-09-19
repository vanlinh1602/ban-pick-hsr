import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '@/types/RootState';

import { initialState } from './reducer';

const selectDomain = (state: RootState) => state?.matchStore || initialState;
const selectPath = (_state: RootState, path: string) => path;

export const selectMatchData = createSelector(
  [selectDomain, selectPath],
  (state, path) => state.data?.[path],
);

export const selectMatchHandling = createSelector(
  selectDomain,
  (state) => state.handling,
);
