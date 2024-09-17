
import { BACKEND } from '@/config';

import Api from './api';

export const backendService = new Api({
  baseURL: BACKEND,
  withCredentials: true,
});

