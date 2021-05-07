import * as API from '../services/transactions';
import { notification } from 'antd';
import type { Reducer, Effect } from 'umi';

export type TransactionsModelState = {
  transactionList: Array<object>,
  transactionTotal: number,
  transactionDetail: object,
}

export type TransactionsModelType = {
  namespace: 'Transactions';
  state: TransactionsModelState;
  effects: {
    getTransactionTotalDocs: Effect;
    getTransactionList: Effect;
    onSearch: Effect;
    getTransactionDetail: Effect;
  };
  reducers: {
    common: Reducer<TransactionsModelState>;
  };
};

const TransactionsModel: TransactionsModelType = {
  namespace: 'Transactions',

  state: {
    transactionList: [], // 交易列表
    transactionTotal: 0,

    transactionDetail: {}, // 当前交易详情
  },

  effects: {
    *getTransactionTotalDocs({ payload }, { call, put }) {
      const res = yield call(API.getTransactionTotalDocs, payload);
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
      } else {
        yield put({
          type: 'common',
          payload: {
            transactionTotal: 0,
            transactionList: [],
            transactionDetail: '',
          },
        });
        notification.error({ message: result.message, top: 64, duration: 3 });
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

export default TransactionsModel;
