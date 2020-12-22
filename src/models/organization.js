import * as API from 'services/organization.js';

export default {
  namespace: 'Organization',

  state: {
    orgList: [], // 成员企业列表
    orgTotal: 0,
  },

  subscriptions: {
    setup({ dispatch, history }) {},
  },

  effects: {
    *getOrgList({ payload }, { call, put }) {
      const res = yield call(API.getOrgList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            orgList: result.items,
          },
        });
      }
    },
    *getOrgTotalDocs({ payload }, { call, put }) {
      const res = yield call(API.getOrgTotalDocs, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            orgTotal: result,
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
