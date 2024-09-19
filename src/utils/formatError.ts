import _ from 'lodash';

import { ApiProblems } from '@/types/api';

export default (error: any) => {
  if ((error as ApiProblems).kind) {
    if (_.get(error, 'error.response.data.errors')) {
      return _.get(error, 'error.response.data.errors', [])
        .map(({ message }: { message: string }) => message)
        .join(', ');
    }
    if (_.get(error, 'error.response.data')) {
      return error?.error?.response?.data;
    }
    return error?.error?.message;
  }

  if (error.errors) {
    return Object.values(error.errors).join(', ');
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unkown error';
};
