import { PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';

import { createSlice } from '@/utils/@reduxjs/toolkit';

import type { Match, MatchState } from '../types';

export const initialState: MatchState = {
  handling: false,
  data: {},
};

const slice = createSlice({
  name: 'matchStore',
  initialState,
  reducers: {
    fetchMatch(state, action: PayloadAction<Match>) {
      state.handling = false;
      const match = action.payload;
      if (Object.keys(match).length) {
        state.data = {
          ...state.data,
          [match.id]: match,
        };
      }
    },
    updateHanding(state, action: PayloadAction<boolean>) {
      state.handling = action.payload;
    },
    getMatch(state, _action: PayloadAction<string>) {
      state.handling = true;
    },
    createMatch(
      state,
      _action: PayloadAction<{
        mathInfo: Partial<Match>;
        onSuccess: (id: string) => void;
      }>,
    ) {
      state.handling = true;
    },
    modifyMatch(
      state,
      action: PayloadAction<{ id: string; patch: string[]; data: any }>,
    ) {
      const { id, patch, data } = action.payload;
      _.set(state.data, [id, ...patch], data);
    },
    updateMatch(state, _action: PayloadAction<Match>) {
      state.handling = true;
    },
  },
});

export const { actions, name: key, reducer } = slice;
