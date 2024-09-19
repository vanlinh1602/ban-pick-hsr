import { combineReducers } from '@reduxjs/toolkit';

import { InjectedReducersType } from '@/utils/types/injector-typings';

export function createReducer(injectedReducers: InjectedReducersType = {}) {
  if (Object.keys(injectedReducers).length === 0) {
    return (state: any) => state;
  }
  return combineReducers({
    ...injectedReducers,
  });
}
