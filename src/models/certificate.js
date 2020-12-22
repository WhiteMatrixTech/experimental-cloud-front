import * as API from 'services/certificate.js';

export default {
  namespace: 'Certificate',

  state: {
    certificateList: [], // 成员企业列表
    certificateTotal: 0,

  },

  subscriptions: {
    setup({ dispatch, history }) {

    },
  },

  effects: {
    *getCertificateList({ payload }, { call, put }) {
      const res = yield call(API.getCertificateList, payload)
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            certificateList: result.list,
            certificateTotal: result.totalDocs
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
