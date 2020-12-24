import * as API from '../services/channel';
import { notification } from 'antd';

export default {
  namespace: 'Channel',

  state: {
    transactionList: [], // 交易列表
    transactionTotal: 0,

    transactionDetail: {}, // 当前交易详情
  },

  subscriptions: {
    setup({ dispatch, history }) {},
  },

  effects: {
    *getTransactionTotalDocs({ payload }, { call, put }) {
      const res = yield call(API.getTransactionTotalDocs, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            transactionTotal: result,
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
    *onSearch({ payload }, { call, put }) {
      const res = yield call(API.getTransactionDetail, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            transactionTotal: 1,
            transactionList: [result],
            transactionDetail: result,
          },
        });
      } else if (statusCode === 404) {
        yield put({
          type: 'common',
          payload: {
            transactionTotal: 0,
            transactionList: [],
            transactionDetail: '',
          },
        });
        notification.error({ message: res.message , top: 64, duration: 1 });
      }
    },

    *getTransactionDetail({ payload }, { call, put }) {
      const res = yield call(API.getTransactionDetail, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            transactionTotal: 1,
            transactionList: [result],
            transactionDetail: result,
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
