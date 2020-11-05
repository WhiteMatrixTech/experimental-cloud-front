import * as API from 'services/channel.js';

export default {
  namespace: 'Channel',

  state: {
    transactionList: [], // 交易列表
    transactionTotal: 0,

    transactionDetail: {}, // 当前交易详情
  },

  subscriptions: {
    setup({ dispatch, history }) {

    },
  },

  effects: {
    *getTransactionList({ payload }, { call, put }) {
      const res = yield call(API.getTransactionList, payload)
      const { status, result } = res;
      if (status === 'ok') {
        yield put({
          type: 'common',
          payload: {
            transactionList: result.list,
            transactionTotal: result.totalDocs
          }
        });
      }
    },
    *getTransactionDetail({ payload }, { call, put }) {
      const res = yield call(API.getTransactionDetail, payload)
      const { status, result } = res;
      if (status === 'ok') {
        yield put({
          type: 'common',
          payload: {
            transactionDetail: result
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
