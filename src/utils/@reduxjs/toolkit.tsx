import {
  createSlice as createSliceOriginal,
  CreateSliceOptions,
  SliceCaseReducers,
} from '@reduxjs/toolkit';

import type { RootStateKeyType } from '../types/injector-typings';

/* Wrap createSlice with stricter Name options */
export const createSlice = <
  State,
  CaseReducers extends SliceCaseReducers<State>,
  Name extends RootStateKeyType
>(
  options: CreateSliceOptions<State, CaseReducers, Name>
) => createSliceOriginal(options);
