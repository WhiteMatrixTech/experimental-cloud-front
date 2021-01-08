import * as API from '../services/union.js';
import { notification } from 'antd';

export default {
  namespace: 'Union',

  state: {
    unionList: [], // 通道列表
    unionTotal: 0,

    orgListOfUnion: [], // 当前通道下的组织列表
    orgTotalOfUnion: 0,

    peerListOfUnion: [], // 当前通道下的节点列表
    peerTotalOfUnion: 0,

    contractListOfUnion: [], // 当前通道下的合约列表
    contractTotalOfUnion: 0,
    contractInfoOfUnion: {},

    blockListOfUnion: [], // 当前通道下的区块列表
    blockTotalOfUnion: 0,

    transactionListOfUnion: [], // 当前通道下的交易列表
    transactionTotalOfUnion: 0,
  },

  subscriptions: {
    setup({ dispatch, history }) {

    },
  },

  effects: {
    *createChannel({ payload }, { call, put }) {
      const res = yield call(API.createChannel, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        notification.success({ message: '通道创建成功', top: 64, duration: 1 });
        return true
      } else {
        notification.error({ message: result.message || '通道创建失败', top: 64, duration: 1 })
      }
    },
    *getUnionList({ payload }, { call, put }) {
      const res = yield call(API.getUnionList, payload)
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            unionList: result,
            unionTotal: result.length
          }
        });
      }
    },
    *getOrgListOfUnion({ payload }, { call, put }) {
      const res = yield call(API.getOrgListOfUnion, payload)
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            orgListOfUnion: result.list,
            orgTotalOfUnion: result.totalDocs
          }
        });
      }
    },
    *getPeerListOfUnion({ payload }, { call, put }) {
      const res = yield call(API.getPeerListOfUnion, payload)
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            peerListOfUnion: result.list,
            peerTotalOfUnion: result.totalDocs
          }
        });
      }
    },
    *getContractListOfUnion({ payload }, { call, put }) {
      const res = yield call(API.getContractListOfUnion, payload)
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            contractListOfUnion: result.list,
            contractTotalOfUnion: result.totalDocs
          }
        });
      }
    },
    *getContractSummaryOfUnion({ payload }, { call, put }) {
      const res = yield call(API.getContractSummaryOfUnion, payload)
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            contractInfoOfUnion: result
          }
        });
      }
    },
    *getBlockListOfUnion({ payload }, { call, put }) {
      const res = yield call(API.getBlockListOfUnion, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            blockListOfUnion: result.items,
          },
        });
      }
    },
    *getTransactionsListOfUnion({ payload }, { call, put }) {
      const res = yield call(API.getTransactionsListOfUnion, payload);
      const { statusCode, result } = res;
      if (statusCode === 'ok') {
        yield put({
          type: 'common',
          payload: {
            transactionListOfUnion: result.items,
          },
        });
      }
    },
    *getStatisInfo({ payload }, { call, put, all }) {
      const [blockRes, transactionRes] = yield all([
        call(API.getBlockTotalOfUnion, payload),
        call(API.getTransactionsTotalOfUnion, payload),
      ]);
      const blockTotalOfUnion = blockRes.statusCode === 'ok' ? blockRes.result : 0;
      const transactionTotalOfUnion = transactionRes.statusCode === 'ok' ? transactionRes.result : 0;
      yield put({
        type: 'common',
        payload: {
          blockTotalOfUnion,
          transactionTotalOfUnion
        }
      });
    },
  },

  reducers: {
    common(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
