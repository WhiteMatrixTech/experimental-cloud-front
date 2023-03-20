import * as API from '../services/organization';
import { notification } from 'antd';
import type { Reducer, Effect } from 'umi';
import { OrgStatus } from '~/pages/about/organizations/_config';

export type OrganizationSchema = {
  networkName: string;
  orgName: string;
  orgAliasName: string;
  orgMspId: string;
  orgAddress: string;
  orgStatus: OrgStatus;
  companyName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  orgFullName: string;
};

export type OrganizationModelState = {
  orgList: Array<OrganizationSchema>;
  orgTotal: number;
  orgInUseList: Array<OrganizationSchema>;
};

export type OrganizationModelType = {
  namespace: 'Organization';
  state: OrganizationModelState;
  effects: {
    createOrg: Effect;
    getOrgList: Effect;
    getOrgInUseList: Effect;
  };
  reducers: {
    common: Reducer<OrganizationModelState>;
  };
};

const OrganizationModel: OrganizationModelType = {
  namespace: 'Organization',

  state: {
    orgList: [], // 用户列表
    orgTotal: 0,

    orgInUseList: []
  },

  effects: {
    *createOrg({ payload }, { call, put }): any {
      const res = yield call(API.createOrg, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        notification.success({ message: result.message || '组织创建请求发起成功', top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.message || '组织创建请求发起失败', top: 64, duration: 3 });
        return false;
      }
    },

    *getOrgList({ payload }, { call, put }): any {
      const res = yield call(API.getOrgList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            orgList: result,
            orgTotal: result.length
          }
        });
      }
    },
    *getOrgInUseList({ payload }, { call, put }): any {
      const res = yield call(API.getOrgInUseList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            orgInUseList: result
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

export default OrganizationModel;
