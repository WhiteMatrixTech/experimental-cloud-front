import * as API from '../services/peer.js';
import { notification } from 'antd';

export default {
  namespace: 'Peer',

  state: {
    peerList: [],
    peerTotal: 0,
  },

  subscriptions: {
    setup({ dispatch, history }) { },
  },

  effects: {

    *getPeerList({ payload }, { call, put }) {
      const res = yield call(API.getPeerList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            peerList: result,
            peerTotal: result.length
          },
        });
      }
    },

    *createPeer({ payload }, { call, put }) {
      const res = yield call(API.createPeer, payload);
      const { statusCode, result } = res;
      const succMessage = `节点创建成功`;
      const failMessage = `节点创建失败`;
      if (statusCode === 'ok' && result) {
        notification.success({ message: result.message || succMessage, top: 64, duration: 1 });
        return true;
      } else {
        notification.error({ message: res.message || failMessage, top: 64, duration: 1 });
      }
    },
  },

  reducers: {
    common(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
