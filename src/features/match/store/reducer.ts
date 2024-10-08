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
    fetchMatches(state, action: PayloadAction<Match[]>) {
      state.handling = false;
      const matches = action.payload;
      matches.forEach((match) => {
        if (Object.keys(match).length) {
          state.data = {
            ...state.data,
            [match.id]: match,
          };
        }
      });
    },
    updateHanding(state, action: PayloadAction<boolean>) {
      state.handling = action.payload;
    },
    getMatch(state, _action: PayloadAction<string>) {
      state.handling = true;
    },
    getMatches(state, _action: PayloadAction<{ tournament: string }>) {
      state.handling = true;
    },
    createMatch(
      state,
      _action: PayloadAction<{
        matchInfo: Partial<Match>;
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
    updateMatch(state, _action: PayloadAction<Partial<Match>>) {
      state.handling = true;
    },
    updateMatches(state, _action: PayloadAction<Match[]>) {
      state.handling = true;
    },
    modifyLiveActions(
      state,
      action: PayloadAction<{ action: string; data: any }>,
    ) {
      state.liveActions = {
        ...state.liveActions,
        [action.payload.action]: action.payload.data,
      };
    },
  },
});

export const { actions, name: key, reducer } = slice;
