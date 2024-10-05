import { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@/utils/@reduxjs/toolkit';

import { User, UserState } from '../types';

export const initialState: UserState = {
  handling: false,
};

const slice = createSlice({
  name: 'userStore',
  initialState,
  reducers: {
    updateHandling: (state, action: PayloadAction<boolean>) => {
      state.handling = action.payload;
    },

    signedIn: (state, _action: PayloadAction<User>) => {
      state.handling = true;
    },
    signOut: (state) => {
      state.handling = false;
      state.data = undefined;
    },
    fetchUser: (state, action: PayloadAction<User>) => {
      state.handling = false;
      state.data = action.payload;
    },
  },
});

export const { actions, name: key, reducer } = slice;
