import * as API from '../services/block';
import { notification } from 'antd';
import type { Reducer, Effect, TransactionSchema } from 'umi';

export type BlockSchema = {
  id: number;
  network: string;
  number: number;
  timestamp: string;
  dataHash: string;
  prevHash: string;
  txCount: number;
  blockHash: string;
  prevBlockHash: string;
  blockSize: string;
  channelGenesisHash: string;
  channelId: string;
  tip: number;
};

export type BlockModelState = {
  blockList: Array<BlockSchema>; // 区块链列表
  blockTotal: number;
  blockDetail: BlockSchema | null; // 当前区块详情

  transactionList: Array<TransactionSchema>; // 当前区块下的交易列表
  transactionTotal: number;
};

export type BlockModelType = {
  namespace: 'Block';
  state: BlockModelState;
  effects: {
    getBlockTotalDocs: Effect;
    getBlockList: Effect;
    onSearch: Effect;
    getBlockDetail: Effect;
    getTxCountByBlockHash: Effect;
    getTransactionList: Effect;
  };
  reducers: {
    common: Reducer<BlockModelState>;
  };
};

const BlockModel: BlockModelType = {
  namespace: 'Block',

  state: {
    blockList: [],
    blockTotal: 0,
    blockDetail: null,
    transactionList: [],
    transactionTotal: 0
  },

  effects: {
    *getBlockTotalDocs({ payload }, { call, put }): any {
      const res = yield call(API.getBlockTotalDocs, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            blockTotal: result.count
          }
        });
      }
    },
    *getBlockList({ payload }, { call, put }): any {
      const res = yield call(API.getBlockList, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            blockList: result.items
          }
        });
      }
    },
    *onSearch({ payload }, { call, put }): any {
      const res = yield call(API.getBlockDetail, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            blockTotal: 1,
            blockList: [result],
            blockDetail: result
          }
        });
      } else {
        yield put({
          type: 'common',
          payload: {
            blockTotal: 0,
            blockList: [],
            blockDetail: ''
          }
        });
        notification.error({ message: result.message, top: 64, duration: 3 });
      }
    },
    *getBlockDetail({ payload }, { call, put }): any {
      const res = yield call(API.getBlockDetail, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            blockTotal: 1,
            blockList: [result],
            blockDetail: result
          }
        });
      }
    },
    *getTxCountByBlockHash({ payload }, { call, put }): any {
      const res = yield call(API.getTxCountByBlockHash, payload);
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
    }
  },

  reducers: {
    common(state, action) {
      return { ...state, ...action.payload };
    }
  }
};

export default BlockModel;
