import { ApiResponse, ApisauceConfig, ApisauceInstance, create } from 'apisauce';

import { ApiProblems } from '@/types/api';

function getApiProblem(response: ApiResponse<any>): ApiProblems {
  let problem: ApiProblems = { kind: 'unknown' };
  switch (response.problem) {
    case 'CONNECTION_ERROR':
      problem = { kind: 'cannot-connect', temporary: true };
      break;
    case 'NETWORK_ERROR':
      problem = { kind: 'cannot-connect', temporary: true };
      break;
    case 'TIMEOUT_ERROR':
      problem = { kind: 'timeout', temporary: true };
      break;
    case 'SERVER_ERROR':
      problem = { kind: 'server', error: response.originalError };
      break;
    case 'CLIENT_ERROR':
      switch (response.status) {
        case 401:
          problem = { kind: 'unauthorized' };
          break;
        case 403:
          problem = { kind: 'forbidden' };
          break;
        case 404:
          problem = { kind: 'not-found' };
          break;
        default:
          problem = { kind: 'rejected' };
      }
      break;
    case 'CANCEL_ERROR':
      problem = { kind: 'cancelled' };
      break;
    case 'UNKNOWN_ERROR':
    default:
  }

  if (response.originalError) {
    problem.error = response.originalError;
  }

  return problem;
}

export default class Api {
  api: ApisauceInstance;

  config: ApisauceConfig;

  constructor(config: ApisauceConfig) {
    this.config = config;
    this.api = create(config);
  }

  post = async <T>(path: string, params?: any): Promise<{ kind: 'ok'; data: T } | ApiProblems> => {
    const response: ApiResponse<any> = await this.api.post(path, params);

    if (response.ok) {
      return { kind: 'ok', data: response.data };
    }
    return getApiProblem(response);
  };

  download = async (
    path: string,
    params?: any
  ): Promise<{ kind: 'ok'; data: Blob | undefined } | ApiProblems> => {
    const response: ApiResponse<Blob> = await this.api.post(path, params, {
      responseType: 'blob',
    });

    if (response.ok) {
      return { kind: 'ok', data: response.data };
    }
    return getApiProblem(response);
  };

  upload = async <T>(
    path: string,
    files: File[],
    params?: CustomObject<string>
  ): Promise<{ kind: 'ok'; data: T | undefined } | ApiProblems> => {
    const data = new FormData();
    Object.entries(params ?? {}).forEach(([field, value]) => {
      data.append(field, value);
    });
    files.forEach((file) => {
      data.append('files', file);
    });
    const response: ApiResponse<any> = await this.api.post(path, data);

    if (response.ok) {
      return { kind: 'ok', data: response.data };
    }
    return getApiProblem(response);
  };

  callSignServer = async <T>(
    path: string,
    buffer: ArrayBuffer | string,
    params?: CustomObject<any>,
    responseType?: 'blob' | 'arraybuffer' | 'document' | 'json' | 'text' | 'stream'
  ): Promise<{ kind: 'ok'; data: T | undefined } | ApiProblems> => {
    const data = new FormData();
    Object.entries(params ?? {}).forEach(([field, value]) => {
      data.append(field, value);
    });
    if (buffer) {
      data.append('files', new Blob([buffer]));
    }
    const options = {
      withCredentials: true,
      responseType,
    };
    const response: ApiResponse<any> = await this.api.post(path, data, options);

    if (response.ok) {
      return { kind: 'ok', data: response.data };
    }
    return getApiProblem(response);
  };

  graphql = async <T>(
    path: string,
    def: string,
    query: string,
    variables?: any
  ): Promise<{ kind: 'ok'; data: T } | ApiProblems> => {
    const response: ApiResponse<any> = await this.api.post(path, {
      query,
      variables,
    });
    if (response.ok) {
      return { kind: 'ok', data: response.data?.data?.[def] };
    }
    return getApiProblem(response);
  };
}
