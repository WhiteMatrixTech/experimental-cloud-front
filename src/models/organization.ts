import * as API from '../services/organization.js';
import { notification } from 'antd';
import type { Reducer, Effect } from 'umi';

export type OrganizationModelState = {
  orgList: Array<object>,
  orgTotal: number,
  orgInUseList: Array<object>,
}

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

    orgInUseList: [],
  },

  effects: {
    *createOrg({ payload }, { call, put }) {
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

    *getOrgList({ payload }, { call, put }) {
      const res = yield call(API.getOrgList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            orgList: result,
            orgTotal: result.length,
          },
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
            orgInUseList: result,
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

export default OrganizationModel;
