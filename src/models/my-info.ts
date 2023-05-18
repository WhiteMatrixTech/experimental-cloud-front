import * as API from '../services/my-info';
import { checkOrgInUse } from '../services/contract';
import type { Reducer, Effect } from 'umi';
import { NetworkStatus } from '~/utils/networkStatus';
import { MemberApprovalStatus } from '~/pages/about/member/_config';
import { OrgStatus } from '~/pages/about/organizations/_config';

export type MyLeagueSchema = {
  leagueName: string;
  leaderName: string;
  networkName: string;
  createTime: string;
  description: string;
  networkStatus: NetworkStatus;
};

export type MyCompanySchema = {
  approvalStatus: MemberApprovalStatus;
  userInfo: {
    email: string;
    name: string;
    phoneNo: string;
    address: string;
    enterpriseName: string;
    enterpriseUsci: string;
    createTime: string;
    super: boolean;
    admin: boolean;
  }

};

export type MyOrganizationSchema = {
  /**
   * 网络名称
   */
  networkName: string;
  /**
   * 组织名称
   */
  orgName: string;
  /**
   * 组织别名
   */
  orgAliasName: string;
  /**
   * 组织MspId
   */
  orgMspId: string;
  /**
   * 组织地址
   */
  orgAddress: string;
  /**
   * 组织状态
   */
  orgStatus: OrgStatus;
  /**
   * 所属人公司名称
   */
  enterpriseName: string;
  /**
   * 所属人邮箱
   */
  email: string;
  /**
   * 创建时间
   */
  createTime: string;
  /**
   * 更新时间
   */
  updateTime: string;
  /**
   * 组织全名
   */
  orgFullName: string;
};

export type MyInfoModelState = {
  myLeague: MyLeagueSchema | null; // 我的联盟信息
  myCompany: MyCompanySchema | null; // 我的用户信息
  myOrgInfo: MyOrganizationSchema | null; // 我的组织信息
};

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
    myLeague: null, // 我的联盟信息
    myCompany: null, // 我的用户信息
    myOrgInfo: null // 我的组织信息
  },

  effects: {
    *getMyLeagueInfo({ payload }, { call, put }): any {
      const res = yield call(API.getMyLeagueInfo, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            myLeague: result
          }
        });
      }
    },

    *checkOrgInUse({ payload }, { call, put }): any {
      const res = yield call(checkOrgInUse, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        return !!result.length;
      }
    },

    *getMyCompanyInfo({ payload }, { call, put }): any {
      const res = yield call(API.getMyCompanyInfo, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            myCompany: result
          }
        });
      }
    },

    *getMyOrgInfo({ payload }, { call, put }): any {
      const res = yield call(API.getMyOrgInfo, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            myOrgInfo: result
          }
        });
      }
    }
  },

  reducers: {
    common(state, action) {
      return { ...state, ...action.payload };
    }
  }
};

export default MyInfoModel;
