import { PayloadAction } from '@reduxjs/toolkit';
import { cloneDeep, unset } from 'lodash';
import { all, put, takeLatest } from 'redux-saga/effects';

import { toast } from '@/components/hooks/use-toast';
import { backendService } from '@/services';
import formatError from '@/utils/formatError';

import { CatalogState } from '../types';
import { actions as catalogActions } from './reducer';

function* getCatalogs() {
  try {
    const result: WithApiResult<{
      data: CatalogState['data'];
      configs: CatalogState['configs'];
    }> = yield backendService.post('/api/resource', {});
    if (result.kind === 'ok') {
      const { data, configs } = result.data;
      yield put(catalogActions.fetchCatalogs(data));
      yield put(catalogActions.fetchConfigs(configs));
    } else {
      yield put(catalogActions.updateHanding(false));
      toast({
        variant: 'destructive',
        title: 'Failed',
        description: formatError(result),
      });
    }
  } catch (err) {
    catalogActions.updateHanding(false);
    toast({
      variant: 'destructive',
      title: 'Failed',
      description: formatError(err),
    });
  }
}

function* updateConfigs(action: PayloadAction<CatalogState['configs']>) {
  try {
    const result: WithApiResult<
      {
        errors: string;
        id: string;
      }[]
    > = yield backendService.post('/api/updateConfigs', {
      configs: action.payload,
    });
    if (result.kind === 'ok') {
      const updatedConfigs = cloneDeep(action.payload);
      if (result.data.length === 0) {
        toast({
          title: 'Success',
          description: 'Configs updated successfully',
        });
      } else {
        result.data.forEach((error) => {
          unset(updatedConfigs, error.id);
          toast({
            variant: 'destructive',
            title: 'Failed',
            description: `Failed to update config ${error.id}: ${error.errors}`,
          });
        });
      }
      yield put(catalogActions.updateHanding(false));
      yield put(catalogActions.modifyConfigs(updatedConfigs));
    } else {
      yield put(catalogActions.updateHanding(false));
      toast({
        variant: 'destructive',
        title: 'Failed',
        description: formatError(result),
      });
    }
  } catch (err) {
    catalogActions.updateHanding(false);
    toast({
      variant: 'destructive',
      title: 'Failed',
      description: formatError(err),
    });
  }
}

export default function* saga() {
  yield all([
    takeLatest(catalogActions.getCatalogs.type, getCatalogs),
    takeLatest(catalogActions.updateConfigs.type, updateConfigs),
  ]);
}
