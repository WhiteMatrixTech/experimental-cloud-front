import * as API from 'services/myInfo.js';

export default {
  namespace: 'MyInfo',

  state: {
    myLeague: {}, // 我的联盟信息
    myCompany: {}, // 我的企业信息
    myOrgInfo: {}, // 我的组织信息
  },

  subscriptions: {
    setup({ dispatch, history }) {

    },
  },

  effects: {
    *getMyInfoDetail({ payload }, { call, put }) {
      const res = yield call(API.getMyInfoDetail, payload)
      const { status, result } = res;
      if (status === 'ok') {
        yield put({
          type: 'common',
          payload: {
            myLeague: result
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
