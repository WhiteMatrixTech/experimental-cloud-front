import * as API from '../services/my-info.js';
import { checkOrgInUse } from '../services/contract.js';
import type { Reducer, Effect } from 'umi';

export type MyInfoModelState = {
  myLeague: object, // 我的联盟信息
  myCompany: object, // 我的用户信息
  myOrgInfo: object, // 我的组织信息
}

export type MyInfoModelType = {
  namespace: 'MyInfo';
  state: MyInfoModelState;
  effects: {
    getMyLeagueInfo: Effect;
    checkOrgInUse: Effect;
    getMyCompanyInfo: Effect;
    getMyOrgInfo: Effect;
  };
  reducers: {
    common: Reducer<MyInfoModelState>;
  };
};

const MyInfoModel: MyInfoModelType = {
  namespace: 'MyInfo',

  state: {
    myLeague: {}, // 我的联盟信息
    myCompany: {}, // 我的用户信息
    myOrgInfo: {}, // 我的组织信息
  },

  effects: {
    *getMyLeagueInfo({ payload }, { call, put }) {
      const res = yield call(API.getMyLeagueInfo, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            myLeague: result,
          },
        });
      }
    },

    *checkOrgInUse({ payload }, { call, put }) {
      const res = yield call(checkOrgInUse, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        return result.result;
      }
    },

    *getMyCompanyInfo({ payload }, { call, put }) {
      const res = yield call(API.getMyCompanyInfo, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            myCompany: result,
          },
        });
      }
    },

    *getMyOrgInfo({ payload }, { call, put }) {
      const res = yield call(API.getMyOrgInfo, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            myOrgInfo: result,
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

export default MyInfoModel;
