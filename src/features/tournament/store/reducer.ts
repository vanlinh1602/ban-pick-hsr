import { PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';

import { Match } from '@/features/match/types';
import { createSlice } from '@/utils/@reduxjs/toolkit';

import { Tournament, TournamentState } from '../type';

export const initialState: TournamentState = {
  handling: false,
  data: {},
};

const slice = createSlice({
  name: 'tournamentStore',
  initialState,
  reducers: {
    updateHanding(state, action: PayloadAction<boolean>) {
      state.handling = action.payload;
    },
    getTournaments(state) {
      state.handling = true;
    },
    getTournament(state, _action: PayloadAction<string>) {
      state.handling = true;
    },
    fetchTournaments(state, action: PayloadAction<CustomObject<Tournament>>) {
      state.handling = false;
      state.data = action.payload;
    },
    modifyTournament(
      state,
      action: PayloadAction<{ path: string[]; data: any }>,
    ) {
      const { path, data } = action.payload;
      state.handling = false;
      _.set(state.data, [...path], data);
    },
    updateTournament(state, _action: PayloadAction<Partial<Tournament>>) {
      state.handling = true;
    },
    createTournament(state, _action: PayloadAction<Partial<Tournament>>) {
      state.handling = true;
    },
    saveBracket(
      state,
      _action: PayloadAction<{
        id: string;
        rounds: Match[][];
      }>,
    ) {
      state.handling = true;
    },
  },
});

export const { actions, name: key, reducer } = slice;
