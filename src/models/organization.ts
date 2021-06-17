import * as API from '../services/organization';
import { notification } from 'antd';
import type { Reducer, Effect } from 'umi';
import { formatMessage } from 'umi';

export type OrganizationSchema = {
  _id: string;
  networkName: string; // 网络名称
  orgName: string; // 组织名成
  companyName: string; // 企业名称
  createdAt: Date; // 创建日期  2021-01-29T02:23:02.141Z
  orgAddress: string; // 组织地址
  orgAliasName: string; // 组织别名
  orgMspId: string; //
  orgStatus: string; // 组织状态
  updatedAt: Date; // 更新日期 2021-01-29T02:23:02.141Z
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
    *createOrg({ payload }, { call, put }) {
      const res = yield call(API.createOrg, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        notification.success({
          message: result.message || formatMessage({ id: 'BASS_NOTIFICATION_ORGANIZATION_CREATE_SUCCESS' }),
          top: 64,
          duration: 3
        });
        return true;
      } else {
        notification.error({
          message: result.message || formatMessage({ id: 'BASS_NOTIFICATION_RGANIZATION_CREATE_FAILED' }),
          top: 64,
          duration: 3
        });
        return false;
      }
    },

    *getOrgList({ payload }, { call, put }) {
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
    *getOrgInUseList({ payload }, { call, put }) {
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
