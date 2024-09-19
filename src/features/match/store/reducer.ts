import { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@/utils/@reduxjs/toolkit';

import type { Match, MatchSetUpInfo, MatchState } from '../types';

export const initialState: MatchState = {
  handling: false,
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
        mathInfo: MatchSetUpInfo;
        onSuccess: (id: string) => void;
      }>,
    ) {
      state.handling = true;
    },
  },
});

export const { actions, name: key, reducer } = slice;
