import { PayloadAction } from '@reduxjs/toolkit';
import { all, put, takeLatest } from 'redux-saga/effects';

import { toast } from '@/components/hooks/use-toast';
import { backendService } from '@/services';
import formatError from '@/utils/formatError';

import { Match, MatchSetUpInfo } from '../types';
import { actions as matchActions } from './reducer';

function* getMatch(action: PayloadAction<string>) {
  try {
    const id = action.payload;

    const result: WithApiResult<Match> = yield backendService.post(
      '/match/get',
      { id },
    );
    if (result.kind === 'ok') {
      const match = result.data;
      yield put(matchActions.fetchMatch(match));
    } else {
      yield put(matchActions.updateHanding(false));
      toast({
        variant: 'destructive',
        title: 'Failed',
        description: formatError(result),
      });
    }
  } catch (err) {
    matchActions.updateHanding(false);
    toast({
      variant: 'destructive',
      title: 'Failed',
      description: formatError(err),
    });
  }
}

function* createMatch(
  action: PayloadAction<{
    mathInfo: MatchSetUpInfo;
    onSuccess: (id: string) => void;
  }>,
) {
  try {
    const { mathInfo, onSuccess } = action.payload;

    const result: WithApiResult<{ id: string }> = yield backendService.post(
      '/match/create',
      { mathInfo },
    );
    if (result.kind === 'ok') {
      onSuccess(result.data.id);
    } else {
      yield put(matchActions.updateHanding(false));
      toast({
        variant: 'destructive',
        title: 'Failed',
        description: formatError(result),
      });
    }
  } catch (err) {
    matchActions.updateHanding(false);
    toast({
      variant: 'destructive',
      title: 'Failed',
      description: formatError(err),
    });
  }
}

export default function* saga() {
  yield all([
    takeLatest(matchActions.getMatch.type, getMatch),
    takeLatest(matchActions.createMatch.type, createMatch),
  ]);
}
