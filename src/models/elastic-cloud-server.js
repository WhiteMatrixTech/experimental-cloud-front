import * as API from '../services/elastic-cloud-server.js';
import { notification } from 'antd';

export default {
  namespace: 'ElasticServer',

  state: {
    serverList: [],
    serverTotal: 0,

    nodeList: [],
    nodeTotal: 0,

    serverPerformance: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {},
  },

  effects: {
    *getServerList({ payload }, { call, put }) {
      const res = yield call(API.getServerList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            serverList: result.items,
          },
        });
      }
    },

    *getServerTotal({ payload }, { call, put }) {
      const res = yield call(API.getServerTotal, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            serverTotal: result.count,
          },
        });
      }
    },

    *createServer({ payload }, { call, put }) {
      const res = yield call(API.createServer, payload);
      const { statusCode, result } = res;
      const succMessage = `创建服务器成功`;
      const failMessage = `创建服务器失败`;
      if (statusCode === 'ok' && result) {
        notification.success({ message: result.message || succMessage, top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.message || failMessage, top: 64, duration: 3 });
      }
    },

    *modifyServer({ payload }, { call, put }) {
      const res = yield call(API.modifyServer, payload);
      const { statusCode, result } = res;
      const succMessage = `修改服务器成功`;
      const failMessage = `修改服务器失败`;
      if (statusCode === 'ok' && result) {
        notification.success({ message: result.message || succMessage, top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.message || failMessage, top: 64, duration: 3 });
      }
    },

    *deleteServer({ payload }, { call, put }) {
      const res = yield call(API.deleteServer, payload);
      const { statusCode, result } = res;
      const succMessage = `删除服务器成功`;
      const failMessage = `删除服务器失败`;
      if (statusCode === 'ok' && result) {
        notification.success({ message: result.message || succMessage, top: 64, duration: 3 });
        return true;
      } else {
        notification.error({ message: result.message || failMessage, top: 64, duration: 3 });
      }
    },

    *getNodeList({ payload }, { call, put }) {
      const res = yield call(API.getNodeList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            nodeList: result.items,
          },
        });
      }
    },

    *getNodeTotal({ payload }, { call, put }) {
      const res = yield call(API.getNodeTotal, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            nodeTotal: result.count,
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
