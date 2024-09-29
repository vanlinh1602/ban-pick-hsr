import { PayloadAction } from '@reduxjs/toolkit';
import { all, put, takeLatest } from 'redux-saga/effects';

import { toast } from '@/components/hooks/use-toast';
import { backendService } from '@/services';
import formatError from '@/utils/formatError';

import { Match } from '../types';
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

function* getMatches(action: PayloadAction<{ tournament: string }>) {
  try {
    const { tournament } = action.payload;

    const result: WithApiResult<Match[]> = yield backendService.post(
      '/match/query',
      { filter: { tournamentId: tournament } },
    );
    if (result.kind === 'ok') {
      const matches = result.data;
      yield put(matchActions.fetchMatches(matches));
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
    matchInfo: Partial<Match>;
    onSuccess: (id: string) => void;
  }>,
) {
  try {
    const { matchInfo, onSuccess } = action.payload;
    const result: WithApiResult<{ id: string }> = yield backendService.post(
      '/match/create',
      { matchInfo },
    );
    if (result.kind === 'ok') {
      onSuccess(result.data.id);
      toast({
        title: 'Success',
        description: 'Match created',
      });
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

function* updateMatch(action: PayloadAction<Match>) {
  try {
    const match = action.payload;

    const result: WithApiResult<Match[]> = yield backendService.post(
      '/match/update',
      { matches: [match] },
    );
    if (result.kind === 'ok') {
      yield put(matchActions.fetchMatch(result.data[0]));
      toast({
        title: 'Success',
        description: 'Match updated',
      });
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

function* updateMatches(action: PayloadAction<Match[]>) {
  try {
    const matches = action.payload;

    const result: WithApiResult<Match[]> = yield backendService.post(
      '/match/update',
      { matches },
    );
    if (result.kind === 'ok') {
      yield put(matchActions.fetchMatches(result.data));
      toast({
        title: 'Success',
        description: 'Matches updated',
      });
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
    takeLatest(matchActions.getMatches.type, getMatches),
    takeLatest(matchActions.createMatch.type, createMatch),
    takeLatest(matchActions.updateMatch.type, updateMatch),
    takeLatest(matchActions.updateMatches.type, updateMatches),
  ]);
}
