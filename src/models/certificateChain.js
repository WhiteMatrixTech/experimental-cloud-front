import * as API from 'services/certificateChain.js';
import { notification } from 'antd';

export default {
  namespace: 'CertificateChain',

  state: {
    certificateChainList: [], // 已存证上链列表
    certificateChainTotal: 0,

  },

  subscriptions: {
    setup({ dispatch, history }) {

    },
  },

  effects: {
    *getCertificateChainList({ payload }, { call, put }) {
      const res = yield call(API.getCertificateChainList, payload)
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            certificateChainList: result.items,
          }
        });
      }
    },
    *getEvidenceTotalDocs({ payload }, { call, put }) {
      const res = yield call(API.getEvidenceTotalDocs, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            certificateChainTotal: result,
          },
        });
      }
    },
    *uploadChain({ payload }, { call, put }) {
      const res = yield call(API.uploadChain, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok' && result) {
        notification.success({ message: '存证上链成功', top: 64, duration: 1 });
        return true;
      } else {
        notification.error({ message: res.message || '存证上链失败', top: 64, duration: 1 });
      }
    },
  },

  reducers: {
    common(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
