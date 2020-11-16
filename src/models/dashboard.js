import { getBlockList } from 'services/block.js';
import { getTransactionList } from 'services/channel.js';

export default {
  namespace: 'Dashboard',

  state: {
    blockList: [], // 区块链列表
    transactionList: [], // 交易列表
  },

  effects: {
    *getBlockList({ payload }, { call, put }) {
      const res = yield call(getBlockList, payload)
      const { status, result } = res;
      if (status === 'ok') {
        yield put({
          type: 'common',
          payload: {
            blockList: result.list,
          }
        });
      }
    },
    *getTransactionList({ payload }, { call, put }) {
      const res = yield call(getTransactionList, payload)
      const { status, result } = res;
      if (status === 'ok') {
        yield put({
          type: 'common',
          payload: {
            transactionList: result.list,
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
