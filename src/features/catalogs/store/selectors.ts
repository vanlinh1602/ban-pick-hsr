import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '@/types/RootState';

import { initialState } from './reducer';

const selectDomain = (state: RootState) => state?.catalogStore || initialState;

export const selectCatalogHandling = createSelector(
  [selectDomain],
  (state) => state.handling,
);

export const selectCharacters = createSelector(
  [selectDomain],
  (state) => state.data.characters,
);
export const selectCombatTypes = createSelector(
  [selectDomain],
  (state) => state.data.combatTypes,
);
export const selectPaths = createSelector(
  [selectDomain],
  (state) => state.data.paths,
);
