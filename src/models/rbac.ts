import * as API from '../services/rbac';
import { notification } from 'antd';
import type { Reducer, Effect } from 'umi';
import { ChainCodeIndex, UserAccessPolicy } from '~/pages/about/rbac/_config';
import { formatMessage } from 'umi';

export type RbacRole = {
  roleName: string;
  policy: UserAccessPolicy[];
};

export type RBACModelState = {
  roleList: Array<RbacRole>;
  roleNameList: Array<string>;
  chaincodeList: Array<ChainCodeIndex>;
  rbacPolicy: RbacRole | object;
};

export type RBACModelType = {
  namespace: 'RBAC';
  state: RBACModelState;
  effects: {
    getRoleList: Effect;
    getRoleNameList: Effect;
    getChainCodeList: Effect;
    getMyselfChainCodeList: Effect;
    getRbacConfigWithRole: Effect;
    setConfig: Effect;
    setConfigByJson: Effect;
  };
  reducers: {
    common: Reducer<RBACModelState>;
  };
};

const RBACModel: RBACModelType = {
  namespace: 'RBAC',

  state: {
    roleList: [], // 角色列表
    roleNameList: [], // 角色名列表
    chaincodeList: [], // 合约列表
    rbacPolicy: {}
  },

  effects: {
    *getRoleList({ payload }, { call, put }) {
      const res = yield call(API.getRoleList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            roleList: result
          }
        });
        return result;
      }
    },

    *getRoleNameList({ payload }, { call, put }) {
      const res = yield call(API.getRoleNameList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            roleNameList: result
          }
        });
        return result;
      }
    },

    *getChainCodeList({ payload }, { call, put }) {
      const res = yield call(API.getChaincodeList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            chaincodeList: result
          }
        });
      }
    },

    *getMyselfChainCodeList({ payload }, { call, put }) {
      const res = yield call(API.getMyselfChainCodeList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            chaincodeList: result
          }
        });
      }
    },

    *getRbacConfigWithRole({ payload }, { call, put }) {
      const res = yield call(API.getRbacConfigWithRole, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok' && result) {
        yield put({
          type: 'common',
          payload: {
            rbacPolicy: result
          }
        });
      }
    },

    *setConfig({ payload }, { call, put }) {
      const res = yield call(API.setConfig, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        notification.success({
          message: result.message || formatMessage({ id: 'BASS_NOTIFICATION_RBAC_CONFIGURE_ROLE_SUCCESS' }),
          top: 64,
          duration: 3
        });
        return true;
      } else {
        notification.error({
          message: result.message || formatMessage({ id: 'BASS_NOTIFICATION_RBAC_CONFIGURE_ROLE_FAILED' }),
          top: 64,
          duration: 3
        });
        return false;
      }
    },

    *setConfigByJson({ payload }, { call, put }) {
      const res = yield call(API.setConfigByJson, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        notification.success({
          message: result.message || formatMessage({ id: 'BASS_NOTIFICATION_RBAC_CONFIGURE_ROLE_SUCCESS' }),
          top: 64,
          duration: 3
        });
        return true;
      } else {
        notification.error({
          message: result.message || formatMessage({ id: 'BASS_NOTIFICATION_RBAC_CONFIGURE_ROLE_FAILED' }),
          top: 64,
          duration: 3
        });
        return false;
      }
    }
  },

  reducers: {
    common(state, action) {
      return { ...state, ...action.payload };
    }
  }
};

export default RBACModel;
