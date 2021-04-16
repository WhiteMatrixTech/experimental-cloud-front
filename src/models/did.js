import * as API from '../services/did.js';
import { notification } from 'antd';

export default {
  namespace: 'DID',

  state: {
    didList: [], // DID列表
    didTotal: 0,

    didDetail: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {},
  },

  effects: {
    *getDidList({ payload }, { call, put }) {
      const res = yield call(API.getDidList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            didList: result,
            didTotal: result.length,
          },
        });
      }
    },

    *getDetailByDid({ payload }, { call, put }) {
      const res = yield call(API.getDetailByDid, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok' && result) {
        yield put({
          type: 'common',
          payload: {
            didDetail: result,
            didList: [result],
            didTotal: 1,
          },
        });
      }
    },

    *createDID({ payload }, { call, put }) {
      const res = yield call(API.createDID, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        notification.success({ message: result.message || 'DID创建成功', top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.message || 'DID创建失败', top: 64, duration: 3 });
      }
    },

    *modifyDID({ payload }, { call, put }) {
      const res = yield call(API.modifyDID, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        notification.success({ message: result.message || '修改DID成功', top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.message || '修改DID失败', top: 64, duration: 3 });
      }
    },

    *deleteDID({ payload }, { call, put }) {
      const res = yield call(API.deleteDID, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        notification.success({ message: result.message || '删除DID成功', top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.message || '删除DID失败', top: 64, duration: 3 });
      }
    },
  },

  reducers: {
    common(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
