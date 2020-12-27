import { getBlockList } from '../services/block.js';
import { getTransactionList } from '../services/transactions.js';
import * as API from '../services/dashboard.js';
import { notification } from 'antd';

export default {
  namespace: 'Dashboard',

  state: {
    networkStatusInfo: {}, // 网络状态信息

    blockList: [], // 区块链列表
    transactionList: [], // 交易列表
  },

  effects: {
    *getNetworkInfo({ payload }, { call, put }) {
      const res = yield call(API.getNetworkInfo, payload)
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            networkStatusInfo: result,
          }
        });
      }
    },
    *createNetwork({ payload }, { call, put }) {
      const res = yield call(API.createNetwork, payload)
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        notification.success({ message: '创建网络请求发起成功', top: 64, duration: 1 });
        yield put({
          type: 'getNetworkInfo',
          payload: {}
        });
      } else {
        notification.error({ message: result.message || '创建网络请求发起成功', top: 64, duration: 1 });
      }
    },
    *deleteNetwork({ payload }, { call, put }) {
      const res = yield call(API.deleteNetwork, payload)
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        notification.success({ message: '网络删除成功', top: 64, duration: 1 });
        yield put({
          type: 'getNetworkInfo',
          payload: {}
        });
      } else {
        notification.error({ message: result.message || '网络删除失败', top: 64, duration: 1 });
      }
    },
    *getBlockList({ payload }, { call, put }) {
      const res = yield call(getBlockList, payload)
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            blockList: result.items,
          }
        });
      }
    },
    *getTransactionList({ payload }, { call, put }) {
      const res = yield call(getTransactionList, payload)
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            transactionList: result.items,
          }
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
