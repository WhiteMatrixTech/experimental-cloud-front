import * as API from '../services/logs';
import type { Reducer, Effect } from 'umi';

export type LogsModelState = {
  logsList: Array<object>,
  logsTotal: number,
}

export type LogsModelType = {
  namespace: 'Logs';
  state: LogsModelState;
  effects: {
    getLogsList: Effect;
  };
  reducers: {
    common: Reducer<LogsModelState>;
  };
};

const LogsModel: LogsModelType = {
  namespace: 'Logs',

  state: {
    logsList: [], // 用户列表
    logsTotal: 0,
  },

  effects: {
    *getLogsList({ payload }, { call, put }) {
      const res = yield call(API.getLogsList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            logsList: result.list,
            logsTotal: result.totalDocs,
          },
        });
      }
    },
  },

  reducers: {
    common(state, action) {
      return { ...state, ...action.payload };
    },
  },
};

export default LogsModel;
