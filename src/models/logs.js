import * as API from 'services/logs.js';

export default {
  namespace: 'Logs',

  state: {
    logsList: [], // 成员企业列表
    logsTotal: 0,

  },

  subscriptions: {
    setup({ dispatch, history }) {

    },
  },

  effects: {
    *getLogsList({ payload }, { call, put }) {
      const res = yield call(API.getLogsList, payload)
      const { status, result } = res;
      if (status === 'ok') {
        yield put({
          type: 'common',
          payload: {
            logsList: result.list,
            logsTotal: result.totalDocs
          }
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
