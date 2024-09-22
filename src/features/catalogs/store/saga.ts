import { all, put, takeLatest } from 'redux-saga/effects';

import { toast } from '@/components/hooks/use-toast';
import { backendService } from '@/services';
import formatError from '@/utils/formatError';

import { CatalogState } from '../types';
import { actions as catalogActions } from './reducer';

function* getCatalogs() {
  try {
    const result: WithApiResult<CatalogState['data']> =
      yield backendService.post('/api/resource', {});
    if (result.kind === 'ok') {
      const catalog = result.data;
      yield put(catalogActions.fetchCatalogs(catalog));
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
  yield all([takeLatest(catalogActions.getCatalogs.type, getCatalogs)]);
}
