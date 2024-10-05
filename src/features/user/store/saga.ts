import { PayloadAction } from '@reduxjs/toolkit';
import { getAuth } from 'firebase/auth';
import { all, put, takeLatest } from 'redux-saga/effects';

import { toast } from '@/components/hooks/use-toast';
import { backendService } from '@/services';
import formatError from '@/utils/formatError';

import { User } from '../types';
import { actions as userActions } from './reducer';

function* signIn(action: PayloadAction<User>) {
  try {
    const token: string = yield getAuth().currentUser?.getIdToken(true);
    const result: WithApiResult<{ user: User }> = yield backendService.post(
      '/api/auth',
      {
        token,
        user: action.payload,
      },
    );
    if (result.kind === 'ok') {
      yield put(userActions.fetchUser(result.data.user));
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: formatError(result),
      });
    }
  } catch (error) {
    yield put(userActions.updateHandling(false));
    toast({
      variant: 'destructive',
      title: 'Error',
      description: formatError(error),
    });
  }
}

function* signOut() {
  try {
    yield backendService.post('/api/signOut');
  } catch (error) {
    toast({
      variant: 'destructive',
      title: 'Error',
      description: formatError(error),
    });
  }
}

export default function* saga() {
  yield all([
    takeLatest(userActions.signedIn.type, signIn),
    takeLatest(userActions.signOut.type, signOut),
  ]);
}
