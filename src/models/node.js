import * as API from '../services/node.js';
import { notification } from 'antd';

export default {
  namespace: 'Peer',

  state: {
    nodeList: [],
    nodeTotal: 0,
    nodeSSH: '',
  },

  subscriptions: {
    setup({ dispatch, history }) {},
  },

  effects: {
    *getNodeList({ payload }, { call, put }) {
      const res = yield call(API.getNodeList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            nodeList: result,
            nodeTotal: result.length,
          },
        });
      }
    },

    *getNodeSSH({ payload }, { call, put }) {
      const res = yield call(API.getNodeSSH, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            nodeSSH: result,
          },
        });
      }
    },

    *createNode({ payload }, { call, put }) {
      const res = yield call(API.createNode, payload);
      const { statusCode, result } = res;
      const succMessage = `节点创建请求发起成功`;
      const failMessage = `节点创建请求发起失败`;
      if (statusCode === 'ok' && result) {
        notification.success({ message: result.message || succMessage, top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.message || failMessage, top: 64, duration: 3 });
      }
    },
  },

  reducers: {
    common(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
