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

export const selectLightCones = createSelector(
  [selectDomain],
  (state) => state.data.lightCones,
);

export const selectFilterCharacter = createSelector(
  [selectDomain],
  (state) => state.data.filterCharacter,
);

export const selectFilterLightCone = createSelector(
  [selectDomain],
  (state) => state.data.filterLightCone,
);

export const selectConfigs = createSelector(
  [selectDomain],
  (state) => state.configs,
);
