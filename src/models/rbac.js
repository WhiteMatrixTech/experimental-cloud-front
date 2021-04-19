import * as API from '../services/rbac.js';
import { notification } from 'antd';

export default {
  namespace: 'RBAC',

  state: {
    companyList: [], // 成员企业列表
    chaincodeList: [], // 合约列表

    rbacPolicy: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {},
  },

  effects: {
    *getCompanyList({ payload }, { call, put }) {
      const res = yield call(API.getCompanyList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            companyList: result,
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

    *getRbacConfigWithOrg({ payload }, { call, put }) {
      const res = yield call(API.getRbacConfigWithOrg, payload);
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
        notification.success({ message: result.message || '配置访问策略成功', top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.message || '配置访问策略失败', top: 64, duration: 3 });
      }
    },

    *resetConfig({ payload }, { call, put }) {
      const res = yield call(API.resetConfig, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        notification.success({ message: result.message || '重置访问策略成功', top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.message || '重置访问策略失败', top: 64, duration: 3 });
      }
    },
  },

  reducers: {
    common(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
