import * as API from '../services/logs.js';

export default {
  namespace: 'Logs',

  state: {
    logsList: [], // 用户列表
    logsTotal: 0,
  },

  subscriptions: {
    setup({ dispatch, history }) {},
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
