import * as API from '../services/my-info';
import { checkOrgInUse } from '../services/contract';
import type { Reducer, Effect } from 'umi';
import { NetworkStatus } from '@/utils/networkStatus';

export type MyLeagueSchema = {
  leagueName: string,
  leaderCompanyName: string,
  networkName: string,
  createdTime: string,
  description: string,
  networkStatus: NetworkStatus,
  startTime: string
}

export type MyCompanySchema = {
  companyName: string,
  //TODO: 使用页面处的枚举
  approvalStatus: string,
  companyCertBusinessNumber: string,
  legalPersonName: string,
  legalPersonIdCardNumber: string,
  contactName: string,
  contactPhone: string,
  contactEmail: string,
  companyAddress: string
}

export type MyOrganizationSchema = {
  networkName: string,
  orgName: string,
  orgAliasName: string,
  orgMspId: string,
  orgAddress: string,
  //TODO: 使用页面处的枚举
  orgStatus: string,
  companyName: string,
  updatedAt: string,
  orgFullName: string
}

export type MyInfoModelState = {
  myLeague: MyLeagueSchema | object, // 我的联盟信息
  myCompany: MyCompanySchema | object, // 我的用户信息
  myOrgInfo: MyOrganizationSchema | object, // 我的组织信息
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
