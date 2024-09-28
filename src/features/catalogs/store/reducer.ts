import { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@/utils/@reduxjs/toolkit';

import type { CatalogState } from '../types';

export const initialState: CatalogState = {
  handling: false,
  data: {
    characters: {},
    lightCones: {},
    filterCharacter: {
      character_combat_type: {
        key: 'character_combat_type',
        text: 'Combat Type',
        values: [],
      },
      character_paths: {
        key: 'character_paths',
        text: 'Paths',
        values: [],
      },
      character_rarity: {
        key: 'character_rarity',
        text: 'Rarity',
        values: [],
      },
      character_factions: {
        key: 'character_factions',
        text: 'Factions',
        values: [],
      },
    },
    filterLightCone: {
      equipment_paths: {
        key: 'equipment_paths',
        text: 'Paths',
        values: [],
      },
      equipment_rarity: {
        key: 'equipment_rarity',
        text: 'Rarity',
        values: [],
      },
      equipment_skill_type: {
        key: 'equipment_skill_type',
        text: 'Skill Type',
        values: [],
      },
      equipment_source: {
        key: 'equipment_source',
        text: 'Source',
        values: [],
      },
    },
  },
  configs: {},
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
    fetchConfigs(state, action: PayloadAction<CatalogState['configs']>) {
      state.handling = false;
      state.configs = action.payload;
    },
    modifyConfigs(state, action: PayloadAction<CatalogState['configs']>) {
      state.configs = {
        ...state.configs,
        ...action.payload,
      };
    },
    updateConfigs(state, _action: PayloadAction<CatalogState['configs']>) {
      state.handling = true;
    },
    updateHanding(state, action: PayloadAction<boolean>) {
      state.handling = action.payload;
    },
  },
});

export const { actions, name: key, reducer } = slice;
