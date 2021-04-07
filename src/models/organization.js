import * as API from '../services/organization.js';
import { notification } from 'antd';

export default {
  namespace: 'Organization',

  state: {
    orgList: [], // 成员企业列表
    orgTotal: 0,

    orgInUseList: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {},
  },

  effects: {
    *createOrg({ payload }, { call, put }) {
      const res = yield call(API.createOrg, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        notification.success({ message: result.message || '组织创建成功', top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.message || '组织创建失败', top: 64, duration: 3 });
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
