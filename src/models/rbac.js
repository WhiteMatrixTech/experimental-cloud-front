import * as API from '../services/rbac.js';
import { notification } from 'antd';

export default {
  namespace: 'RBAC',

  state: {
    roleList: [], // 角色列表

    roleNameList: [], // 角色名列表

    chaincodeList: [], // 合约列表

    rbacPolicy: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {},
  },

  effects: {
    *getRoleList({ payload }, { call, put }) {
      const res = yield call(API.getRoleList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            roleList: result,
          },
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
            roleNameList: result,
          },
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
            chaincodeList: result,
          },
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
            chaincodeList: result,
          },
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
            rbacPolicy: result,
          },
        });
      }
    },

    *setConfig({ payload }, { call, put }) {
      const res = yield call(API.setConfig, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        notification.success({ message: result.message || '配置角色访问策略成功', top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.message || '配置角色访问策略失败', top: 64, duration: 3 });
      }
    },

    *setConfigByJson({ payload }, { call, put }) {
      const res = yield call(API.setConfigByJson, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        notification.success({ message: result.message || '配置角色访问策略成功', top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.message || '配置角色访问策略失败', top: 64, duration: 3 });
      }
    },
  },

  reducers: {
    common(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
