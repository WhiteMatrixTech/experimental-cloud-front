import * as API from '../services/transactions';
import { notification } from 'antd';
import type { Reducer, Effect } from 'umi';

export type TransactionSchema = {
  blockHash: string; // 区块哈希
  chainCodeName: string; // 合约名称
  channelId: string; // 通道ID
  txArgs: string; // 交易参数
  txMsp: string; // 交易组织
  txEndorseMsp: string; // 背书组织
  createdAt: string; // 创建时间
  txId: string; // 交易id
  leagueName: string; // 联盟名
  networkName: string; // 网络名称
};

export type TransactionsModelState = {
  transactionList: Array<TransactionSchema>;
  transactionTotal: number;
  transactionDetail: TransactionSchema | null;
};

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

    transactionDetail: null // 当前交易详情
  },

  effects: {
    *getTransactionTotalDocs({ payload }, { call, put }): any {
      const res = yield call(API.getTransactionTotalDocs, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            transactionTotal: result.count
          }
        });
      }
    },
    *getTransactionList({ payload }, { call, put }): any {
      const res = yield call(API.getTransactionList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            transactionList: result.items
          }
        });
      }
    },
    *onSearch({ payload }, { call, put }): any {
      const res = yield call(API.getTransactionDetail, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            transactionTotal: 1,
            transactionList: [result],
            transactionDetail: result
          }
        });
      } else {
        yield put({
          type: 'common',
          payload: {
            transactionTotal: 0,
            transactionList: [],
            transactionDetail: ''
          }
        });
        notification.error({ message: result.message, top: 64, duration: 3 });
      }
    },

    *getTransactionDetail({ payload }, { call, put }): any {
      const res = yield call(API.getTransactionDetail, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            transactionTotal: 1,
            transactionList: [result],
            transactionDetail: result
          }
        });
      }
    }
  },

  reducers: {
    common(state, action) {
      return { ...state, ...action.payload };
    }
  }
};

export default TransactionsModel;
