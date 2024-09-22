import { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@/utils/@reduxjs/toolkit';

import type { CatalogState } from '../types';

export const initialState: CatalogState = {
  handling: false,
  data: {
    characters: [],
    combatTypes: [],
    paths: [],
  },
};

const slice = createSlice({
  name: 'catalogStore',
  initialState,
  reducers: {
    getCatalogs(state) {
      state.handling = true;
    },
    fetchCatalogs(state, action: PayloadAction<CatalogState['data']>) {
      state.handling = false;
      state.data = action.payload;
    },
    updateHanding(state, action: PayloadAction<boolean>) {
      state.handling = action.payload;
    },
  },
});

export const { actions, name: key, reducer } = slice;
