import * as API from '../services/block';
import { notification } from 'antd';

export default {
  namespace: 'Block',

  state: {
    breadCrumbItem: null, // 匹配面包屑数组

    blockList: [], // 区块链列表
    blockTotal: 0,
    blockDetail: {}, // 当前区块详情

    transactionList: [], // 当前区块下的交易列表
    transactionTotal: 0,
  },

  subscriptions: {
    setup({ dispatch, history }) {},
  },

  effects: {
    *getBlockTotalDocs({ payload }, { call, put }) {
      const res = yield call(API.getBlockTotalDocs, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            blockTotal: result.count,
          },
        });
      }
    },
    *getBlockList({ payload }, { call, put }) {
      const res = yield call(API.getBlockList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            blockList: result.items,
          },
        });
      }
    },
    *onSearch({ payload }, { call, put }) {
      const res = yield call(API.getBlockDetail, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            blockTotal: 1,
            blockList: [result],
            blockDetail: result,
          },
        });
      } else {
        yield put({
          type: 'common',
          payload: {
            blockTotal: 0,
            blockList: [],
            blockDetail: '',
          },
        });
        notification.error({ message: result.message, top: 64, duration: 1 });
      }
    },
    *getBlockDetail({ payload }, { call, put }) {
      const res = yield call(API.getBlockDetail, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            blockTotal: 1,
            blockList: [result],
            blockDetail: result,
          },
        });
      }
    },
    *getTxCountByBlockHash({ payload }, { call, put }) {
      const res = yield call(API.getTxCountByBlockHash, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            transactionTotal: result.count,
          },
        });
      }
    },
    *getTransactionList({ payload }, { call, put }) {
      const res = yield call(API.getTransactionList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            transactionList: result.items,
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
