import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '@/types/RootState';

import { initialState } from './reducer';

const selectDomain = (state: RootState) => state?.userStore || initialState;

export const selectUserInformation = createSelector(
  [selectDomain],
  (userStore) => userStore.data,
);

export const selectUserHandling = createSelector(
  [selectDomain],
  (userStore) => userStore.handling,
);
